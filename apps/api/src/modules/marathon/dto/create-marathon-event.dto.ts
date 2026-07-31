import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateMarathonEventDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}
