export class CreatePollDto {
  title : string
  options: string[]
  expiredAt?: Date
  allowAnon: boolean
}
