import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InfluencerBadge } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const POINTS_PER_REFERRAL = 50;

const BADGE_THRESHOLDS: Array<[number, InfluencerBadge]> = [
  [1000, InfluencerBadge.INFLUENCER],
  [600, InfluencerBadge.GOLD],
  [300, InfluencerBadge.SILVER],
  [100, InfluencerBadge.BRONZE],
];

function badgeForScore(score: number): InfluencerBadge {
  for (const [threshold, badge] of BADGE_THRESHOLDS) {
    if (score >= threshold) return badge;
  }
  return InfluencerBadge.NONE;
}

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async claim(referredId: string, referrerId: string) {
    if (referredId === referrerId) {
      throw new BadRequestException("Cannot refer yourself");
    }
    const existing = await this.prisma.referral.findUnique({
      where: { referrerId_referredId: { referrerId, referredId } },
    });
    if (existing) {
      throw new ConflictException("Referral already claimed");
    }

    const referral = await this.prisma.referral.create({
      data: { referrerId, referredId, pointsAwarded: POINTS_PER_REFERRAL, reason: "signup" },
    });

    await this.recomputeInfluence(referrerId);
    return referral;
  }

  private async recomputeInfluence(userId: string) {
    const referrals = await this.prisma.referral.findMany({ where: { referrerId: userId } });
    const score = referrals.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const badge = badgeForScore(score);

    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (profile) {
      await this.prisma.studentProfile.update({
        where: { userId },
        data: { influenceScore: score, influencerBadge: badge },
      });
    }
    return { score, badge };
  }

  async myLedger(userId: string) {
    const [referrals, profile] = await Promise.all([
      this.prisma.referral.findMany({
        where: { referrerId: userId },
        include: { referred: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.studentProfile.findUnique({ where: { userId } }),
    ]);
    return {
      referrals,
      influenceScore: profile?.influenceScore ?? 0,
      influencerBadge: profile?.influencerBadge ?? InfluencerBadge.NONE,
    };
  }
}
