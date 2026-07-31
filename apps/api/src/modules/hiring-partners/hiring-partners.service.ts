import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { JobStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { RegisterHiringPartnerDto } from "./dto/register-hiring-partner.dto";
import { BulkRequestDto } from "./dto/bulk-request.dto";

@Injectable()
export class HiringPartnersService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterHiringPartnerDto) {
    const existing = await this.prisma.hiringPartner.findUnique({ where: { userId } });
    if (existing) throw new ConflictException("Hiring partner profile already exists");
    return this.prisma.hiringPartner.create({
      data: {
        userId,
        companyName: dto.companyName,
        tier: dto.tier ?? "standard",
        configJson: toJson(dto.configJson ?? {}),
      },
    });
  }

  async findMine(userId: string) {
    const partner = await this.prisma.hiringPartner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException("Hiring partner profile not found");
    return partner;
  }

  async bulkRequest(userId: string, dto: BulkRequestDto) {
    const partner = await this.findMine(userId);
    return this.prisma.$transaction(
      dto.jobs.map((job) =>
        this.prisma.job.create({
          data: {
            postedById: userId,
            hiringPartnerId: partner.id,
            title: job.title,
            description: job.description,
            requiredSkills: job.requiredSkills ?? [],
            status: JobStatus.OPEN,
          },
        }),
      ),
    );
  }

  async pipeline(userId: string) {
    const partner = await this.findMine(userId);
    return this.prisma.job.findMany({
      where: { hiringPartnerId: partner.id },
      include: { applications: { include: { student: { select: { id: true, name: true, email: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async analytics(userId: string) {
    const partner = await this.findMine(userId);
    const jobs = await this.prisma.job.findMany({
      where: { hiringPartnerId: partner.id },
      include: { applications: true },
    });
    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, j) => sum + j.applications.length, 0);
    const hired = jobs.reduce(
      (sum, j) => sum + j.applications.filter((a) => a.stage === "HIRED").length,
      0,
    );
    // Stub: deeper analytics (time-to-hire, funnel conversion) plug in here later.
    return { totalJobs, totalApplications, hired };
  }
}
