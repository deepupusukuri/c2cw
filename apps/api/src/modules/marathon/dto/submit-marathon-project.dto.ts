import { IsString } from "class-validator";

export class SubmitMarathonProjectDto {
  @IsString()
  projectId!: string;
}
