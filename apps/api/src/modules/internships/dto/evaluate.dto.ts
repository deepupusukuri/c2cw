import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class EvaluateInternshipDto {
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
