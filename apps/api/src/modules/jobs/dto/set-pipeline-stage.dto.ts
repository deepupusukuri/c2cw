import { IsEnum, IsOptional, IsString } from "class-validator";
import { PipelineStage } from "@prisma/client";

export class SetPipelineStageDto {
  @IsEnum(PipelineStage)
  stage!: PipelineStage;

  @IsOptional()
  @IsString()
  notes?: string;
}
