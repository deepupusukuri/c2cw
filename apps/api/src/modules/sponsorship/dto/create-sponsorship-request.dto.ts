import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateSponsorshipRequestDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  amountRequested!: number;
}
