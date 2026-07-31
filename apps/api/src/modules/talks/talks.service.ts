import { Injectable, NotFoundException } from "@nestjs/common";
import { TalkStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { ApplyTalkDto } from "./dto/apply-talk.dto";
import { PublishTalkDto } from "./dto/publish-talk.dto";

@Injectable()
export class TalksService {
  constructor(private prisma: PrismaService) {}

  apply(speakerId: string, dto: ApplyTalkDto) {
    return this.prisma.talk.create({
      data: {
        speakerId,
        title: dto.title,
        slug: dto.slug,
        metadata: toJson(dto.metadata ?? {}),
        status: TalkStatus.APPLIED,
      },
    });
  }

  findPublished() {
    return this.prisma.talk.findMany({
      where: { status: TalkStatus.PUBLISHED },
      include: { speaker: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  // Unlike findPublished(), includes APPLIED/APPROVED/REJECTED — an admin needs
  // to see (and approve/publish) a talk before it's public.
  findAllForAdmin() {
    return this.prisma.talk.findMany({
      include: { speaker: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findBySlug(slug: string) {
    const talk = await this.prisma.talk.findUnique({
      where: { slug },
      include: { speaker: { select: { id: true, name: true } } },
    });
    if (!talk) throw new NotFoundException("Talk not found");
    return talk;
  }

  approve(id: string) {
    return this.prisma.talk.update({ where: { id }, data: { status: TalkStatus.APPROVED } });
  }

  reject(id: string) {
    return this.prisma.talk.update({ where: { id }, data: { status: TalkStatus.REJECTED } });
  }

  publish(id: string, dto: PublishTalkDto) {
    return this.prisma.talk.update({
      where: { id },
      data: { status: TalkStatus.PUBLISHED, videoUrl: dto.videoUrl },
    });
  }

  mine(speakerId: string) {
    return this.prisma.talk.findMany({ where: { speakerId }, orderBy: { createdAt: "desc" } });
  }
}
