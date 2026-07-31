import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { JobStatus, PipelineStage } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { CreateJobDto } from "./dto/create-job.dto";
import { SetPipelineStageDto } from "./dto/set-pipeline-stage.dto";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(postedById: string, dto: CreateJobDto, hiringPartnerId?: string) {
    return this.prisma.job.create({
      data: {
        postedById,
        hiringPartnerId,
        title: dto.title,
        description: dto.description,
        requirements: toJson(dto.requirements ?? {}),
        requiredSkills: dto.requiredSkills ?? [],
        minReadinessScore: dto.minReadinessScore ?? 0,
        status: JobStatus.OPEN,
      },
    });
  }

  async findAll(filters: { skill?: string; minReadinessScore?: number }) {
    const jobs = await this.prisma.job.findMany({
      where: {
        status: JobStatus.OPEN,
        minReadinessScore: filters.minReadinessScore ? { lte: filters.minReadinessScore } : undefined,
      },
      include: { hiringPartner: true },
      orderBy: { createdAt: "desc" },
    });
    if (!filters.skill) return jobs;
    const needle = filters.skill.toLowerCase();
    return jobs.filter((j) => j.requiredSkills.some((s) => s.toLowerCase().includes(needle)));
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { hiringPartner: true, applications: true },
    });
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }

  async apply(jobId: string, studentId: string) {
    await this.findOne(jobId);
    const existing = await this.prisma.application.findUnique({
      where: { jobId_studentId: { jobId, studentId } },
    });
    if (existing) throw new ConflictException("Already applied to this job");
    return this.prisma.application.create({
      data: { jobId, studentId, stage: PipelineStage.APPLIED },
    });
  }

  myApplications(studentId: string) {
    return this.prisma.application.findMany({
      where: { studentId },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });
  }

  pipelineForJob(jobId: string) {
    return this.prisma.application.findMany({
      where: { jobId },
      include: { student: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  setStage(applicationId: string, dto: SetPipelineStageDto) {
    return this.prisma.application.update({
      where: { id: applicationId },
      data: { stage: dto.stage, notes: dto.notes },
    });
  }
}
