import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MarathonEventStatus, MarathonParticipantStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMarathonEventDto } from "./dto/create-marathon-event.dto";

@Injectable()
export class MarathonService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMarathonEventDto) {
    return this.prisma.marathonEvent.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        status: MarathonEventStatus.DRAFT,
      },
    });
  }

  findAll() {
    return this.prisma.marathonEvent.findMany({
      where: { status: { in: [MarathonEventStatus.OPEN, MarathonEventStatus.CLOSED] } },
      orderBy: { startAt: "desc" },
    });
  }

  // Unlike findAll(), includes DRAFT events — an admin needs to see (and publish)
  // an event before it's public.
  findAllForAdmin() {
    return this.prisma.marathonEvent.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.marathonEvent.findUnique({ where: { slug } });
    if (!event) throw new NotFoundException("Marathon event not found");
    return event;
  }

  publish(id: string) {
    return this.prisma.marathonEvent.update({ where: { id }, data: { status: MarathonEventStatus.OPEN } });
  }

  close(id: string) {
    return this.prisma.marathonEvent.update({ where: { id }, data: { status: MarathonEventStatus.CLOSED } });
  }

  async register(eventId: string, studentId: string) {
    const event = await this.prisma.marathonEvent.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException("Marathon event not found");
    if (event.status !== MarathonEventStatus.OPEN) {
      throw new BadRequestException("Registration is only open while the event is OPEN");
    }
    return this.prisma.marathonParticipant.upsert({
      where: { eventId_studentId: { eventId, studentId } },
      update: {},
      create: { eventId, studentId, status: MarathonParticipantStatus.REGISTERED },
    });
  }

  async submitProject(eventId: string, studentId: string, projectId: string) {
    const [participant, project] = await Promise.all([
      this.prisma.marathonParticipant.findUnique({
        where: { eventId_studentId: { eventId, studentId } },
      }),
      this.prisma.project.findUnique({ where: { id: projectId } }),
    ]);
    if (!participant) throw new NotFoundException("You must register before submitting");
    if (!project || project.ownerId !== studentId) {
      throw new BadRequestException("Project not found or not owned by you");
    }
    if (project.type !== "MARATHON") {
      throw new BadRequestException("Project must be of type MARATHON");
    }

    return this.prisma.marathonParticipant.update({
      where: { eventId_studentId: { eventId, studentId } },
      data: { projectId, status: MarathonParticipantStatus.SUBMITTED },
    });
  }

  markScored(participantId: string) {
    return this.prisma.marathonParticipant.update({
      where: { id: participantId },
      data: { status: MarathonParticipantStatus.SCORED },
    });
  }

  myParticipation(studentId: string) {
    return this.prisma.marathonParticipant.findMany({
      where: { studentId },
      include: { event: true, project: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async participantsForEvent(eventId: string) {
    const participants = await this.prisma.marathonParticipant.findMany({
      where: { eventId },
      include: { project: true },
      orderBy: { createdAt: "asc" },
    });
    const students = await this.prisma.user.findMany({
      where: { id: { in: participants.map((p) => p.studentId) } },
      select: { id: true, name: true, email: true },
    });
    const byId = new Map(students.map((s) => [s.id, s]));
    return participants.map((p) => ({ ...p, student: byId.get(p.studentId) ?? null }));
  }
}
