import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { ProjectType } from "@prisma/client";

export class CreateProjectDto {
  @IsString()
  title!: string;

  @IsEnum(ProjectType)
  type!: ProjectType;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
