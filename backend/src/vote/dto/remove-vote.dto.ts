import { IsUUID } from 'class-validator';

export class RemoveVoteDto {
  @IsUUID()
  optionId: string;
}
