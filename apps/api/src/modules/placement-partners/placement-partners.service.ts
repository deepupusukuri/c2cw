import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PlacementReferralStatus, TransactionStatus, TransactionType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { RegisterPlacementPartnerDto } from "./dto/register-placement-partner.dto";
import { CreateReferralDto } from "./dto/create-referral.dto";

@Injectable()
export class PlacementPartnersService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterPlacementPartnerDto) {
    const existing = await this.prisma.placementPartner.findUnique({ where: { userId } });
    if (existing) throw new ConflictException("Placement partner profile already exists");
    return this.prisma.placementPartner.create({
      data: {
        userId,
        agencyName: dto.agencyName,
        commissionRate: dto.commissionRate ?? 10,
      },
    });
  }

  async findMine(userId: string) {
    const partner = await this.prisma.placementPartner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException("Placement partner profile not found");
    return partner;
  }

  // Full commission logic: rate is snapshotted from the partner's profile at referral time,
  // so a later change to the partner's commissionRate never retroactively alters past referrals.
  async createReferral(userId: string, dto: CreateReferralDto) {
    const partner = await this.findMine(userId);
    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException("Job not found");

    const existing = await this.prisma.placementReferral.findUnique({
      where: {
        placementPartnerId_studentId_jobId: {
          placementPartnerId: partner.id,
          studentId: dto.studentId,
          jobId: dto.jobId,
        },
      },
    });
    if (existing) {
      throw new ConflictException("You've already referred this student for this job");
    }

    const commissionRate = Number(partner.commissionRate);
    const commissionAmount = Math.round(dto.baseAmount * (commissionRate / 100) * 100) / 100;

    return this.prisma.placementReferral.create({
      data: {
        placementPartnerId: partner.id,
        studentId: dto.studentId,
        jobId: dto.jobId,
        baseAmount: dto.baseAmount,
        commissionRate,
        commissionAmount,
        status: PlacementReferralStatus.REFERRED,
      },
    });
  }

  async myReferrals(userId: string) {
    const partner = await this.findMine(userId);
    return this.prisma.placementReferral.findMany({
      where: { placementPartnerId: partner.id },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });
  }

  allReferrals(status?: string) {
    return this.prisma.placementReferral.findMany({
      where: { status: (status as any) || undefined },
      include: {
        job: true,
        placementPartner: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private async findReferral(id: string) {
    const referral = await this.prisma.placementReferral.findUnique({ where: { id } });
    if (!referral) throw new NotFoundException("Referral not found");
    return referral;
  }

  async markHired(id: string) {
    const referral = await this.findReferral(id);
    if (referral.status !== PlacementReferralStatus.REFERRED) {
      throw new BadRequestException("Only a REFERRED referral can be marked HIRED");
    }
    return this.prisma.placementReferral.update({
      where: { id },
      data: { status: PlacementReferralStatus.HIRED },
    });
  }

  async approveCommission(id: string) {
    const referral = await this.findReferral(id);
    if (referral.status !== PlacementReferralStatus.HIRED) {
      throw new BadRequestException("Only a HIRED referral can have its commission approved");
    }
    return this.prisma.placementReferral.update({
      where: { id },
      data: { status: PlacementReferralStatus.COMMISSION_APPROVED },
    });
  }

  async releaseCommission(id: string) {
    const referral = await this.findReferral(id);
    if (referral.status !== PlacementReferralStatus.COMMISSION_APPROVED) {
      throw new BadRequestException("Commission must be approved before it can be released");
    }
    const partner = await this.prisma.placementPartner.findUnique({
      where: { id: referral.placementPartnerId },
    });
    if (!partner) throw new NotFoundException("Placement partner not found");

    const [updatedReferral] = await this.prisma.$transaction([
      this.prisma.placementReferral.update({
        where: { id },
        data: { status: PlacementReferralStatus.PAID },
      }),
      this.prisma.transaction.create({
        data: {
          userId: partner.userId,
          type: TransactionType.PAYOUT,
          amount: referral.commissionAmount,
          status: TransactionStatus.SUCCESS,
          metadata: toJson({ placementReferralId: id, jobId: referral.jobId, studentId: referral.studentId }),
        },
      }),
      this.prisma.wallet.update({
        where: { userId: partner.userId },
        data: { balance: { increment: referral.commissionAmount } },
      }),
    ]);
    return updatedReferral;
  }

  reject(id: string) {
    return this.prisma.placementReferral.update({
      where: { id },
      data: { status: PlacementReferralStatus.REJECTED },
    });
  }
}
