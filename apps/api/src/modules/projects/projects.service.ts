import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { ReadinessScoreService } from "../student-profile/readiness-score.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ReviewProjectDto } from "./dto/review-project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private readinessScore: ReadinessScoreService,
  ) {}

  create(ownerId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { ownerId, title: dto.title, type: dto.type, metadata: toJson(dto.metadata ?? {}) },
    });
  }

  findMine(ownerId: string) {
    return this.prisma.project.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
  }

  findAll(filters: { type?: string; status?: string }) {
    return this.prisma.project.findMany({
      where: {
        type: (filters.type as any) || undefined,
        status: (filters.status as any) || undefined,
      },
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async submit(id: string, ownerId: string) {
    const project = await this.findOne(id);
    if (project.ownerId !== ownerId) throw new NotFoundException("Project not found");
    return this.prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.SUBMITTED },
    });
  }

  async review(id: string, dto: ReviewProjectDto) {
    const project = await this.findOne(id);
    const updated = await this.prisma.project.update({
      where: { id },
      data: { status: dto.status, score: dto.score ?? project.score },
    });
    if (dto.status === ProjectStatus.APPROVED || dto.status === ProjectStatus.SCORED) {
      await this.readinessScore.recompute(project.ownerId);
    }
    return updated;
  }
}
