import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class MilestoneItem {
  @IsString()
  title!: string;

  @IsNumber()
  @Min(0)
  amount!: number;
}

export class CreateFreelanceDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneItem)
  milestones!: MilestoneItem[];
}
