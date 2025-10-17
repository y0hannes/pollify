import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PollsService {
  constructor(private prisma: PrismaService) {}

  async create(createPollDto: CreatePollDto, userId: string) {
    const { title, options, expiredAt, allowAnon } = createPollDto;

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const poll = await this.prisma.poll.create({
      data: {
        title,
        expiredAt,
        allowAnon,
        creator: {
          connect: { id: userId },
        },
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: {
        options: true,
        creator: true,
      },
    });

    return poll;
  }

  async findMyPolls(userId: string) {
    return await this.prisma.poll.findMany({
      where: { creatorID: userId },
    });
  }

  async findAll() {
    return await this.prisma.poll.findMany()
  }

  async findOne(pollId: string) {
    return await this.prisma.poll.findUnique({
      where: { id: pollId },
    });
  }

  async findAndCheckOwnership(userId: string, pollId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      select: {
        id: true,
        creatorID: true,
      },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.creatorID !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this poll',
      );
    }
    return poll;
  }

  async update(pollId: string, userId: string, updatePollDto: UpdatePollDto) {
    await this.findAndCheckOwnership(userId, pollId);
    return this.prisma.poll.update({
      where: { id: pollId },
      data: {
        title: updatePollDto.title,
        expiredAt: updatePollDto.expiredAt,
        allowAnon: updatePollDto.allowAnon,
      },
      include: {
        options: true,
      },
    });
  }

  async remove(userId: string, pollId: string) {
    await this.findAndCheckOwnership(userId, pollId);
    return this.prisma.poll.delete({
      where: { id: pollId },
    });
  }
}
