import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { ProgramType } from "@prisma/client";

export class CreateProgramDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsEnum(ProgramType)
  type!: ProgramType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  configJson?: Record<string, unknown>;
}
