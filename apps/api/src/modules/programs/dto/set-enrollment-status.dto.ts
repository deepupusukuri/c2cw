import { IsEnum } from "class-validator";
import { EnrollmentStatus } from "@prisma/client";

export class SetEnrollmentStatusDto {
  @IsEnum(EnrollmentStatus)
  status!: EnrollmentStatus;
}
