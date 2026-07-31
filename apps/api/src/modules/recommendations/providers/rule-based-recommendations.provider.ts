import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  RecommendationItem,
  RecommendationsProvider,
} from "./recommendations-provider.interface";

function normalizeSkills(skills: unknown): string[] {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => (typeof s === "string" ? s : JSON.stringify(s)))
    .map((s) => s.toLowerCase().trim());
}

function overlapCount(a: string[], b: string[]): { count: number; matched: string[] } {
  const bSet = new Set(b);
  const matched = a.filter((s) => bSet.has(s));
  return { count: matched.length, matched };
}

/**
 * Deterministic, explainable placeholder — NOT machine learning. Scores purely
 * on skill-string overlap and the existing readiness-score gate so the
 * endpoint returns something genuinely useful today, while making the swap
 * point for a real model obvious (see the interface docstring).
 */
@Injectable()
export class RuleBasedRecommendationsProvider implements RecommendationsProvider {
  constructor(private prisma: PrismaService) {}

  async recommendJobsForStudent(studentId: string, limit: number): Promise<RecommendationItem[]> {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId: studentId } });
    if (!profile) throw new NotFoundException("Student profile not found");

    const studentSkills = normalizeSkills(profile.skills);
    const jobs = await this.prisma.job.findMany({
      where: { status: "OPEN", minReadinessScore: { lte: profile.readinessScore } },
    });

    const scored = jobs.map((job) => {
      const jobSkills = job.requiredSkills.map((s) => s.toLowerCase().trim());
      const { count, matched } = overlapCount(jobSkills, studentSkills);
      const score = jobSkills.length === 0 ? 0.5 : count / jobSkills.length;
      const reason =
        matched.length > 0
          ? `Matches ${matched.length} of your skills: ${matched.join(", ")}`
          : `Meets the minimum readiness score (${job.minReadinessScore})`;
      return {
        id: job.id,
        score,
        reason,
        data: job as unknown as Record<string, unknown>,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async recommendCandidatesForJob(jobId: string, limit: number): Promise<RecommendationItem[]> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException("Job not found");

    const jobSkills = job.requiredSkills.map((s) => s.toLowerCase().trim());
    const profiles = await this.prisma.studentProfile.findMany({
      where: { readinessScore: { gte: job.minReadinessScore } },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const scored = profiles.map((profile) => {
      const studentSkills = normalizeSkills(profile.skills);
      const { count, matched } = overlapCount(jobSkills, studentSkills);
      const score = jobSkills.length === 0 ? profile.readinessScore / 100 : count / jobSkills.length;
      const reason =
        matched.length > 0
          ? `Matches ${matched.length} required skills: ${matched.join(", ")}`
          : `Readiness score ${profile.readinessScore} meets the ${job.minReadinessScore} minimum`;
      return {
        id: profile.userId,
        score,
        reason,
        data: profile as unknown as Record<string, unknown>,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
