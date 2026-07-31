import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [
      pendingProjects,
      pendingInternships,
      pendingFreelance,
      pendingWithdrawals,
      pendingTalks,
      pendingSponsorshipPledges,
      pendingSponsorshipRequests,
      pendingCampusAmbassadors,
      pendingPlacementReferrals,
      totalUsers,
      totalStudents,
      modules,
    ] = await Promise.all([
      this.prisma.project.count({ where: { status: "SUBMITTED" } }),
      this.prisma.internship.count({ where: { status: "PENDING_APPROVAL" } }),
      this.prisma.freelanceProject.count({ where: { status: "PENDING_APPROVAL" } }),
      this.prisma.transaction.count({ where: { type: "PAYOUT", status: "PENDING" } }),
      this.prisma.talk.count({ where: { status: "APPLIED" } }),
      this.prisma.sponsorship.count({ where: { status: "PENDING" } }),
      this.prisma.sponsorshipRequest.count({ where: { status: "PENDING" } }),
      this.prisma.campusAmbassador.count({ where: { status: "APPLIED" } }),
      this.prisma.placementReferral.count({
        where: { status: { in: ["REFERRED", "HIRED", "COMMISSION_APPROVED"] } },
      }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: "STUDENT" } }),
      this.prisma.module.findMany({ orderBy: { name: "asc" } }),
    ]);

    return {
      pendingApprovals: {
        projects: pendingProjects,
        internships: pendingInternships,
        freelanceProjects: pendingFreelance,
        withdrawals: pendingWithdrawals,
        talks: pendingTalks,
        sponsorshipPledges: pendingSponsorshipPledges,
        sponsorshipRequests: pendingSponsorshipRequests,
        campusAmbassadors: pendingCampusAmbassadors,
        placementReferrals: pendingPlacementReferrals,
      },
      users: { total: totalUsers, students: totalStudents },
      modules,
    };
  }
}
