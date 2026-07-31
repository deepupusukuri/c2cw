import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { toJson } from "../../common/utils/json.util";
import { ReadinessScoreService } from "./readiness-score.service";
import { UpdateStudentProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class StudentProfileService {
  constructor(
    private prisma: PrismaService,
    private readinessScore: ReadinessScoreService,
  ) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Student profile not found");
    }
    return profile;
  }

  async update(userId: string, dto: UpdateStudentProfileDto) {
    await this.findByUserId(userId);
    await this.prisma.studentProfile.update({
      where: { userId },
      data: {
        ...(dto.skills !== undefined && { skills: toJson(dto.skills) }),
        ...(dto.internships !== undefined && { internships: toJson(dto.internships) }),
        ...(dto.assessments !== undefined && { assessments: toJson(dto.assessments) }),
        ...(dto.certifications !== undefined && { certifications: toJson(dto.certifications) }),
        ...(dto.achievements !== undefined && { achievements: toJson(dto.achievements) }),
        ...(dto.experience !== undefined && { experience: toJson(dto.experience) }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.metadata !== undefined && { metadata: toJson(dto.metadata) }),
      },
    });
    await this.readinessScore.recompute(userId);
    return this.findByUserId(userId);
  }

  // Write-side of the ai_profile_analysis hook: today called manually (e.g. by an
  // admin, or a script), but this is exactly the endpoint a real analysis job would
  // POST its output to after running a model over the student's skills/projects/achievements.
  async setAiAnalysis(userId: string, analysis: Record<string, unknown>) {
    await this.findByUserId(userId);
    await this.prisma.studentProfile.update({
      where: { userId },
      data: { aiProfileAnalysis: toJson(analysis) },
    });
    return this.findByUserId(userId);
  }

  async search(params: { skill?: string; minReadinessScore?: number; q?: string }) {
    const profiles = await this.prisma.studentProfile.findMany({
      where: {
        readinessScore: params.minReadinessScore ? { gte: params.minReadinessScore } : undefined,
        user: params.q
          ? {
              OR: [
                { name: { contains: params.q, mode: "insensitive" } },
                { email: { contains: params.q, mode: "insensitive" } },
              ],
            }
          : undefined,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { readinessScore: "desc" },
    });

    if (!params.skill) return profiles;

    const needle = params.skill.toLowerCase();
    return profiles.filter((p) => {
      const skills = Array.isArray(p.skills) ? (p.skills as unknown[]) : [];
      return skills.some((s) => JSON.stringify(s).toLowerCase().includes(needle));
    });
  }
}
