import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthUser } from "@c2cw/types";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequireModule } from "../../common/decorators/require-module.decorator";
import { ModuleEnabledGuard } from "../../common/guards/module-enabled.guard";
import { MessagesService } from "./messages.service";

@Controller("chat")
@UseGuards(ModuleEnabledGuard)
@RequireModule("CHAT")
export class ChatController {
  constructor(private messagesService: MessagesService) {}

  @Get("conversations")
  conversations(@CurrentUser() user: AuthUser) {
    return this.messagesService.conversations(user.id);
  }

  @Get("history/:otherUserId")
  history(@CurrentUser() user: AuthUser, @Param("otherUserId") otherUserId: string) {
    return this.messagesService.history(user.id, otherUserId);
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return { name: file.originalname, url: `/uploads/${file.filename}`, size: file.size };
  }
}
