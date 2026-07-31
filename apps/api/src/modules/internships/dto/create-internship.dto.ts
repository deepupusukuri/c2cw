import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateInternshipDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
