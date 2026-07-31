import { IsArray, IsObject, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsArray()
  skills?: unknown[];

  @IsOptional()
  @IsArray()
  internships?: unknown[];

  @IsOptional()
  @IsArray()
  assessments?: unknown[];

  @IsOptional()
  @IsArray()
  certifications?: unknown[];

  @IsOptional()
  @IsArray()
  achievements?: unknown[];

  @IsOptional()
  @IsArray()
  experience?: unknown[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
