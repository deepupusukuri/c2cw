import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  send(senderId: string, receiverId: string, body: string, attachments: unknown[] = []) {
    return this.prisma.message.create({
      data: { senderId, receiverId, body, attachments: toJson(attachments) },
    });
  }

  history(userId: string, otherUserId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async conversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        receiver: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    const seen = new Map<string, (typeof messages)[number]>();
    for (const m of messages) {
      const other = m.senderId === userId ? m.receiver : m.sender;
      if (!seen.has(other.id)) {
        seen.set(other.id, m);
      }
    }
    return Array.from(seen.entries()).map(([otherId, lastMessage]) => ({
      otherUserId: otherId,
      other: lastMessage.senderId === userId ? lastMessage.receiver : lastMessage.sender,
      lastMessage,
    }));
  }
}
