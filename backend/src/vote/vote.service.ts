import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async create(pollId: string, optionId: string, voterId: string | null) {
    // Validate that poll exists
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found.');
    }

    // Check if the option belongs to this poll
    const option = poll.options.find((opt) => opt.id === optionId);
    if (!option) {
      throw new BadRequestException('Option does not belong to this poll.');
    }

    // Prevent duplicate voting (per user or session)
    if (voterId) {
      const existingVote = await this.prisma.vote.findFirst({
        where: {
          pollId,
          voterId,
        },
      });

      if (existingVote) {
        throw new ForbiddenException('You already voted in this poll.');
      }
    }

    // Create vote
    return this.prisma.vote.create({
      data: {
        pollId,
        optionId,
        voterId,
      },
    });
  }

  async remove(pollId: string, voteId: string, voterId: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found.');
    }

    if (vote.voterId !== voterId) {
      throw new ForbiddenException('You can only delete your own vote.');
    }

    if (vote.pollId !== pollId) {
      throw new BadRequestException('Vote does not belong to the specified poll.');
    }

    return this.prisma.vote.delete({
      where: { id: voteId },
    });
  }
}
