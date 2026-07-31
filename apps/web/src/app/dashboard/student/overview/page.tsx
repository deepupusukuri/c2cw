"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Award, Trophy } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { slideUp, staggerChildren } from "@/lib/motion";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";

interface StudentProfile {
  readinessScore: number;
  influenceScore: number;
  influencerBadge: string;
  skills: string[];
  certifications: unknown[];
  achievements: unknown[];
}

export default function StudentOverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setProfile(await api.get<StudentProfile>("/student-profile/me"));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong loading your profile.");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (error) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={refresh} className="btn-ghost mt-4 text-xs">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Welcome back, {user?.name}</h2>
        <p className="text-sm text-ink-secondary">Here&apos;s where your profile stands today.</p>
      </div>

      {!profile ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <StatGrid columns={4}>
            <StatCard label="Readiness score" value={profile.readinessScore} icon={Target} accent="primary" />
            <StatCard label="Skills added" value={profile.skills.length} icon={Sparkles} accent="green" />
            <StatCard
              label="Certifications"
              value={profile.certifications.length}
              icon={Award}
              accent="purple"
            />
            <StatCard label="Achievements" value={profile.achievements.length} icon={Trophy} accent="orange" />
          </StatGrid>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2"
            >
              <motion.div variants={slideUp} className="card transition-shadow hover:shadow-sm">
                <h3 className="font-heading text-lg font-medium">Corporate Readiness Score</h3>
                <div className="mt-4">
                  <ProgressBar value={profile.readinessScore} label="Readiness" />
                </div>
                <p className="mt-3 text-xs text-ink-secondary">
                  Computed from your skills, approved projects, completed programs, and internship
                  evaluations.
                </p>
              </motion.div>
              <motion.div variants={slideUp} className="card transition-shadow hover:shadow-sm">
                <h3 className="font-heading text-lg font-medium">Influence Score</h3>
                <p className="mt-2 text-3xl font-semibold">{profile.influenceScore}</p>
                <span className="badge-influencer mt-2 inline-block">{profile.influencerBadge}</span>
              </motion.div>
            </motion.div>
            <InfoPanel
              icon={Sparkles}
              title="Get the most from your profile"
              items={[
                "Add skills to unlock better job and internship matches.",
                "Check Recommended regularly — new matches appear as jobs are posted.",
                "Your readiness score updates automatically as you add achievements and certifications.",
                "Completing programs and internships boosts your readiness score further.",
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
