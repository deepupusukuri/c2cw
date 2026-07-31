import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CampusAmbassadorStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { ApplyCampusAmbassadorDto } from "./dto/apply-campus-ambassador.dto";

@Injectable()
export class CampusAmbassadorService {
  constructor(private prisma: PrismaService) {}

  async apply(userId: string, dto: ApplyCampusAmbassadorDto) {
    const existing = await this.prisma.campusAmbassador.findUnique({ where: { userId } });
    if (existing) throw new ConflictException("You've already applied to be a Campus Ambassador");
    return this.prisma.campusAmbassador.create({
      data: { userId, collegeName: dto.collegeName, status: CampusAmbassadorStatus.APPLIED },
    });
  }

  async findMine(userId: string) {
    const ambassador = await this.prisma.campusAmbassador.findUnique({ where: { userId } });
    if (!ambassador) throw new NotFoundException("No Campus Ambassador application found");
    return ambassador;
  }

  list(status?: string) {
    return this.prisma.campusAmbassador.findMany({
      where: { status: (status as any) || undefined },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  approve(id: string) {
    return this.prisma.campusAmbassador.update({
      where: { id },
      data: { status: CampusAmbassadorStatus.APPROVED },
    });
  }

  reject(id: string) {
    return this.prisma.campusAmbassador.update({
      where: { id },
      data: { status: CampusAmbassadorStatus.REJECTED },
    });
  }
}
