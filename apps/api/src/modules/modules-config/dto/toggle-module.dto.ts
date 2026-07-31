import { IsBoolean } from "class-validator";

export class ToggleModuleDto {
  @IsBoolean()
  isEnabled!: boolean;
}
