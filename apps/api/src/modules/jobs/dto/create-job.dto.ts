import { IsArray, IsInt, IsObject, IsOptional, IsString, Min } from "class-validator";

export class CreateJobDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  requirements?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  requiredSkills?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  minReadinessScore?: number;
}
