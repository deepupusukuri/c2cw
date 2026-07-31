import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { MessagesService } from "./messages.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "change-me-in-prod",
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, MessagesService],
})
export class ChatModule {}
