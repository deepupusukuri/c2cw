import { IsNumber, IsString, Min } from "class-validator";

export class CreateReferralDto {
  @IsString()
  studentId!: string;

  @IsString()
  jobId!: string;

  @IsNumber()
  @Min(1)
  baseAmount!: number;
}
