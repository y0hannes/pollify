import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body() createPollDto: CreatePollDto) {
    const user = req.user;
    return this.pollsService.create(createPollDto, user.id);
  }

  @Get('mypolls')
  findMyPolls(@Req() req) {
    const user = req.user.id;
    return this.pollsService.findMyPolls(user.id);
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    const user = req.user;
    return this.pollsService.update(id, user.id, updatePollDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const user = req.user;
    return this.pollsService.remove(user.id, id);
  }
}
