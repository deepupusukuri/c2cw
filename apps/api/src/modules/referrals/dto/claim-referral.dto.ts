import { IsString } from "class-validator";

export class ClaimReferralDto {
  @IsString()
  referrerId!: string;
}
