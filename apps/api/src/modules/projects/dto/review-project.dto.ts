import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { ProjectStatus } from "@prisma/client";

export class ReviewProjectDto {
  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;
}
