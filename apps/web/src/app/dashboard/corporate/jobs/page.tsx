"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PostJobForm, JobsList, type JobRowData } from "@/components/JobsPanel";

export default function CorporateJobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobRowData[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      const allJobs = await api.get<JobRowData[]>("/jobs");
      setJobs(user ? allJobs.filter((j) => j.postedById === user.id) : []);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load jobs", "error");
    }
  }, [user, toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (jobs === null) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <PostJobForm onCreated={refresh} />
        <JobsList jobs={jobs} />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Jobs live" value={jobs.length} icon={Briefcase} accent="primary" />
          <StatCard
            label="Unique skills"
            value={new Set(jobs.flatMap((j) => j.requiredSkills)).size}
            icon={CheckCircle2}
            accent="green"
          />
        </div>
        <InfoPanel
          icon={Briefcase}
          title="Tips for a strong job post"
          items={[
            "List 3-5 must-have skills — broader postings attract more applicants but weaker matches.",
            "A realistic minimum readiness score filters out unqualified applicants automatically.",
            "Move candidates through pipeline stages promptly to keep your response rate high.",
            "Check the Recommended candidates tab on each posting for algorithmic matches.",
          ]}
        />
      </div>
    </div>
  );
}
