import { Injectable, NotFoundException } from "@nestjs/common";
import { InternshipApplicationStatus, InternshipStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { ReadinessScoreService } from "../student-profile/readiness-score.service";
import { CreateInternshipDto } from "./dto/create-internship.dto";
import { EvaluateInternshipDto } from "./dto/evaluate.dto";

@Injectable()
export class InternshipsService {
  constructor(
    private prisma: PrismaService,
    private readinessScore: ReadinessScoreService,
  ) {}

  create(postedById: string, companyId: string | undefined, dto: CreateInternshipDto) {
    return this.prisma.internship.create({
      data: {
        postedById,
        companyId,
        title: dto.title,
        description: dto.description,
        metadata: toJson(dto.metadata ?? {}),
        status: InternshipStatus.PENDING_APPROVAL,
      },
    });
  }

  approve(id: string) {
    return this.prisma.internship.update({
      where: { id },
      data: { status: InternshipStatus.OPEN },
    });
  }

  findAll() {
    return this.prisma.internship.findMany({
      where: { status: InternshipStatus.OPEN },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Unlike findAll(), includes PENDING_APPROVAL/CLOSED — an admin needs to see
  // (and approve) an internship before it's public.
  findAllForAdmin() {
    return this.prisma.internship.findMany({
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: { company: true, applications: true, evaluations: true },
    });
    if (!internship) throw new NotFoundException("Internship not found");
    return internship;
  }

  apply(internshipId: string, studentId: string) {
    return this.prisma.internshipApplication.upsert({
      where: { internshipId_studentId: { internshipId, studentId } },
      update: {},
      create: { internshipId, studentId },
    });
  }

  select(internshipId: string, studentId: string) {
    return this.prisma.internshipApplication.update({
      where: { internshipId_studentId: { internshipId, studentId } },
      data: { status: InternshipApplicationStatus.SELECTED },
    });
  }

  assignMentor(internshipId: string, mentorId: string) {
    return this.prisma.internship.update({
      where: { id: internshipId },
      data: { mentorId },
    });
  }

  findMineForUser(postedById: string) {
    return this.prisma.internship.findMany({
      where: { postedById },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  }

  applicationsForInternship(internshipId: string) {
    return this.prisma.internshipApplication.findMany({
      where: { internshipId },
      include: { student: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async evaluate(internshipId: string, studentId: string, dto: EvaluateInternshipDto) {
    const evalResult = await this.prisma.internshipEval.upsert({
      where: { internshipId_studentId: { internshipId, studentId } },
      update: { score: dto.score, notes: dto.notes },
      create: { internshipId, studentId, score: dto.score, notes: dto.notes },
    });
    await this.readinessScore.recompute(studentId);
    return evalResult;
  }
}
