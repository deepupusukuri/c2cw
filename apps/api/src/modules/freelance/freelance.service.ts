import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FreelanceStatus, TransactionStatus, TransactionType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { CreateFreelanceDto } from "./dto/create-freelance.dto";

interface Milestone {
  title: string;
  amount: number;
  status: "pending" | "completed" | "paid";
}

@Injectable()
export class FreelanceService {
  constructor(private prisma: PrismaService) {}

  create(clientId: string, dto: CreateFreelanceDto) {
    const milestones: Milestone[] = dto.milestones.map((m) => ({
      title: m.title,
      amount: m.amount,
      status: "pending",
    }));
    return this.prisma.freelanceProject.create({
      data: {
        clientId,
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        milestones: toJson(milestones),
        status: FreelanceStatus.PENDING_APPROVAL,
      },
    });
  }

  findAll(filters: { status?: string }) {
    return this.prisma.freelanceProject.findMany({
      where: { status: (filters.status as any) || undefined },
      include: { client: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  // Public marketing-page listing: only client-approved opportunities, no client email.
  findPublic() {
    return this.prisma.freelanceProject.findMany({
      where: { status: { in: ["APPROVED", "ASSIGNED", "IN_PROGRESS", "COMPLETED"] } },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.freelanceProject.findUnique({ where: { id } });
    if (!project) throw new NotFoundException("Freelance project not found");
    return project;
  }

  approve(id: string) {
    return this.prisma.freelanceProject.update({
      where: { id },
      data: { status: FreelanceStatus.APPROVED },
    });
  }

  assign(id: string, studentId: string) {
    return this.prisma.freelanceProject.update({
      where: { id },
      data: { assignedStudentId: studentId, status: FreelanceStatus.ASSIGNED },
    });
  }

  async completeMilestone(id: string, index: number) {
    const project = await this.findOne(id);
    const milestones = (project.milestones as unknown as Milestone[]) ?? [];
    if (!milestones[index]) throw new NotFoundException("Milestone not found");
    milestones[index].status = "completed";
    return this.prisma.freelanceProject.update({
      where: { id },
      data: { milestones: toJson(milestones), status: FreelanceStatus.IN_PROGRESS },
    });
  }

  async releaseMilestonePayment(id: string, index: number) {
    const project = await this.findOne(id);
    if (!project.assignedStudentId) {
      throw new BadRequestException("No student assigned to this project");
    }
    const milestones = (project.milestones as unknown as Milestone[]) ?? [];
    const milestone = milestones[index];
    if (!milestone) throw new NotFoundException("Milestone not found");
    if (milestone.status !== "completed") {
      throw new BadRequestException("Milestone must be completed before payment release");
    }

    milestone.status = "paid";
    const allPaid = milestones.every((m) => m.status === "paid");

    const [updatedProject] = await this.prisma.$transaction([
      this.prisma.freelanceProject.update({
        where: { id },
        data: {
          milestones: toJson(milestones),
          status: allPaid ? FreelanceStatus.COMPLETED : FreelanceStatus.IN_PROGRESS,
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId: project.assignedStudentId,
          type: TransactionType.PAYOUT,
          amount: milestone.amount,
          status: TransactionStatus.SUCCESS,
          metadata: { freelanceProjectId: id, milestoneIndex: index, milestoneTitle: milestone.title },
        },
      }),
      this.prisma.wallet.update({
        where: { userId: project.assignedStudentId },
        data: { balance: { increment: milestone.amount } },
      }),
    ]);

    return updatedProject;
  }
}
