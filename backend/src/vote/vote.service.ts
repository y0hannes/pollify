import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { RemoveVoteDto } from './dto/remove-vote.dto';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async create(voterId: string, createVoteDto: CreateVoteDto) {
    const { optionId } = createVoteDto;

    const existingVote = await this.prisma.vote.findUnique({
      where: {
        voterId_optionId: { voterId, optionId },
      },
    });

    if (existingVote) {
      throw new ForbiddenException('You already voted for this option.');
    }

    return await this.prisma.vote.create({
      data: {
        voterId,
        optionId,
      },
    });
  }

  async remove(voterId: string, dto: RemoveVoteDto) {
    const { optionId } = dto;

    const vote = await this.prisma.vote.findUnique({
      where: {
        voterId_optionId: { voterId, optionId },
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found.');
    }

    return this.prisma.vote.delete({
      where: {
        voterId_optionId: { voterId, optionId },
      },
    });
  }
}
