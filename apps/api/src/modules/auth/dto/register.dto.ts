import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "@prisma/client";

// ADMIN is deliberately excluded — admin accounts are seeded (see prisma/seed.ts) or
// created by an existing admin, never self-registered through the public API.
export const SELF_REGISTERABLE_ROLES = [
  Role.STUDENT,
  Role.COLLEGE,
  Role.CORPORATE,
  Role.HIRING_PARTNER,
  Role.PLACEMENT_PARTNER,
  Role.TRAINER,
] as const;

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsIn(SELF_REGISTERABLE_ROLES)
  role!: Role;
}
