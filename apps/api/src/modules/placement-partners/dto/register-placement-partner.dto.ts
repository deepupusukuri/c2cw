import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class RegisterPlacementPartnerDto {
  @IsString()
  agencyName!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;
}
