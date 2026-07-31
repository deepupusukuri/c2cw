import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Computes the corporate_readiness_score for a student profile.
 * Weighted composite so later modules (jobs, internships, hiring-partner
 * analytics) can call `recompute` after any event that should move the score.
 */
@Injectable()
export class ReadinessScoreService {
  constructor(private prisma: PrismaService) {}

  async recompute(userId: string): Promise<number> {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return 0;

    const skills = Array.isArray(profile.skills) ? (profile.skills as unknown[]) : [];
    const certifications = Array.isArray(profile.certifications)
      ? (profile.certifications as unknown[])
      : [];
    const achievements = Array.isArray(profile.achievements)
      ? (profile.achievements as unknown[])
      : [];

    const [approvedProjects, completedEnrollments, internshipEvals] = await Promise.all([
      this.prisma.project.count({ where: { ownerId: userId, status: { in: ["APPROVED", "SCORED"] } } }),
      this.prisma.enrollment.count({ where: { userId, status: "COMPLETED" } }),
      this.prisma.internshipEval.findMany({ where: { studentId: userId } }),
    ]);

    const avgInternshipScore =
      internshipEvals.length > 0
        ? internshipEvals.reduce((sum, e) => sum + (e.score ?? 0), 0) / internshipEvals.length
        : 0;

    // Weighted composite, clamped to 0-100.
    const raw =
      Math.min(skills.length, 10) * 2 + // up to 20
      Math.min(certifications.length, 5) * 3 + // up to 15
      Math.min(achievements.length, 5) * 2 + // up to 10
      Math.min(approvedProjects, 10) * 3 + // up to 30
      Math.min(completedEnrollments, 5) * 2 + // up to 10
      (avgInternshipScore / 100) * 15; // up to 15

    const score = Math.max(0, Math.min(100, Math.round(raw)));

    await this.prisma.studentProfile.update({
      where: { userId },
      data: { readinessScore: score },
    });

    return score;
  }
}
