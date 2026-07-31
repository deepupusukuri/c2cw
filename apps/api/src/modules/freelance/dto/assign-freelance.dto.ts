import { IsString } from "class-validator";

export class AssignFreelanceDto {
  @IsString()
  studentId!: string;
}
