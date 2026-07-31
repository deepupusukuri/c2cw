import { IsObject, IsOptional, IsString } from "class-validator";

export class RegisterHiringPartnerDto {
  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsOptional()
  @IsObject()
  configJson?: Record<string, unknown>;
}
