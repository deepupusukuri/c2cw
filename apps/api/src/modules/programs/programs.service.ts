import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { CreateProgramDto } from "./dto/create-program.dto";
import { EnrollmentStatus } from "@prisma/client";

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProgramDto) {
    return this.prisma.program.create({
      data: { ...dto, configJson: toJson(dto.configJson ?? {}) },
    });
  }

  findAll() {
    return this.prisma.program.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(idOrSlug: string) {
    const program = await this.prisma.program.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!program) throw new NotFoundException("Program not found");
    return program;
  }

  async enroll(userId: string, programId: string) {
    await this.findOne(programId);
    return this.prisma.enrollment.upsert({
      where: { userId_programId: { userId, programId } },
      update: {},
      create: { userId, programId, status: EnrollmentStatus.PENDING },
    });
  }

  async setEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus) {
    return this.prisma.enrollment.update({ where: { id: enrollmentId }, data: { status } });
  }

  myEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { program: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async enrollmentsForProgram(programId: string) {
    await this.findOne(programId);
    return this.prisma.enrollment.findMany({
      where: { programId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }
}
