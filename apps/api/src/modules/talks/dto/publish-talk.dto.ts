import { IsUrl } from "class-validator";

export class PublishTalkDto {
  @IsUrl()
  videoUrl!: string;
}
