import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('polls/:pollId/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  async create(
    @Param('pollId') pollId: string,
    @Req() req,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    const userId = req.user?.id ?? null;
    return this.voteService.create(pollId, createVoteDto.optionId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':voteId')
  async remove(
    @Param('pollId') pollId: string,
    @Param('voteId') voteId: string,
    @Req() req,
  ) {
    const userId = req.user?.id ?? null;
    if (!userId)
      throw new BadRequestException('Only logged in users can delete votes.');
    return this.voteService.remove(pollId, voteId, userId);
  }
}
