import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateSponsorshipDto {
  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsNumber()
  @Min(1)
  amount!: number;
}
