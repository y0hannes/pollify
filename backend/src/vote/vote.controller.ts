import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { RemoveVoteDto } from './dto/remove-vote.dto';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  create(@Req() req, @Body() createVoteDto: CreateVoteDto) {
    return this.voteService.create(req.user.id, createVoteDto);
  }

  @Delete(':id')
  remove(@Req() req, @Body() removeVoteDto: RemoveVoteDto) {
    return this.voteService.remove(req.user.id, removeVoteDto);
  }
}
