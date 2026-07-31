import { IsString } from "class-validator";

export class MatchSponsorshipDto {
  @IsString()
  requestId!: string;
}
