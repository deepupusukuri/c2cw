import { IsObject, IsOptional, IsString } from "class-validator";

export class ApplyTalkDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
