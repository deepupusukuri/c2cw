import { IsString } from "class-validator";

export class ApplyCampusAmbassadorDto {
  @IsString()
  collegeName!: string;
}
