"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";

interface StudentProfile {
  skills: string[];
}

export default function StudentSkillsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setProfile(await api.get<StudentProfile>("/student-profile/me"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!skillInput.trim() || !profile) return;
    setSubmitting(true);
    try {
      const nextSkills = [...profile.skills, skillInput.trim()];
      await api.patch("/student-profile/me", { skills: nextSkills });
      setSkillInput("");
      toast("Skill added");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't add skill", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeSkill(skill: string) {
    if (!profile) return;
    try {
      const nextSkills = profile.skills.filter((s) => s !== skill);
      await api.patch("/student-profile/me", { skills: nextSkills });
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't remove skill", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="card">
          <h2 className="font-heading text-lg font-medium">Skills</h2>
          <div className="mt-3 flex min-h-[2rem] flex-wrap gap-2">
            {profile === null && (
              <>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </>
            )}
            {profile?.skills.length === 0 && (
              <p className="text-sm text-ink-secondary">No skills added yet — add your first one below.</p>
            )}
            <AnimatePresence initial={false}>
              {profile?.skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="badge-verified flex items-center gap-1"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1 text-accent-green/70 hover:text-accent-green">
                    ×
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={addSkill} className="mt-4 flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. React, SQL, Figma"
              className="input-field"
            />
            <button type="submit" disabled={submitting} className="btn-primary shrink-0">
              {submitting ? "Adding..." : "Add skill"}
            </button>
          </form>
        </div>
      </div>
      <div className="space-y-6">
        <StatCard
          label="Skills added"
          value={profile ? profile.skills.length : "-"}
          icon={Sparkles}
          accent="green"
        />
        <InfoPanel
          icon={Target}
          title="How skills help you"
          items={[
            "Each skill you add feeds directly into your Corporate Readiness Score.",
            "Jobs and internships match candidates by overlap with required skills.",
            "Be specific — \"React\" matches better than \"frontend\".",
            "Remove outdated skills to keep your profile and matches accurate.",
          ]}
        />
      </div>
    </div>
  );
}
