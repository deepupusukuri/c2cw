import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "@c2cw/types";
import { MessagesService } from "./messages.service";

interface SendMessagePayload {
  receiverId: string;
  body: string;
  attachments?: unknown[];
}

@WebSocketGateway({
  cors: { origin: process.env.WEB_APP_URL ?? "http://localhost:3000", credentials: true },
  namespace: "/chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwt: JwtService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(_client: Socket) {
    // no-op: room membership is cleaned up automatically by socket.io
  }

  @SubscribeMessage("message")
  async onMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const senderId = client.data.userId as string;
    const message = await this.messagesService.send(
      senderId,
      payload.receiverId,
      payload.body,
      payload.attachments ?? [],
    );
    this.server.to(`user:${payload.receiverId}`).to(`user:${senderId}`).emit("message", message);
    return message;
  }
}
