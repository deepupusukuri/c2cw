"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, Send } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface Job {
  id: string;
  title: string;
  description: string | null;
  requiredSkills: string[];
  minReadinessScore: number;
}

interface Application {
  id: string;
  stage: string;
  job: Job;
}

export default function StudentJobsPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  const refresh = useCallback(async () => {
    const [jobsRes, applicationsRes] = await Promise.all([
      api.get<Job[]>("/jobs"),
      api.get<Application[]>("/jobs/me/applications"),
    ]);
    setJobs(jobsRes);
    setApplications(applicationsRes);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function apply(jobId: string) {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      toast("Application submitted");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't apply", "error");
    }
  }

  const appliedJobIds = new Set(applications.map((a) => a.job.id));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Open Jobs</h2>
        {jobs === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {jobs?.length === 0 && (
          <div className="card">
            <EmptyState icon={Briefcase} title="No open jobs yet" />
          </div>
        )}
        {jobs && jobs.length > 0 && (
          <ListStack>
            {jobs.map((j) => (
              <ListCard
                key={j.id}
                icon={Briefcase}
                title={j.title}
                caption={`Min readiness: ${j.minReadinessScore} · ${j.requiredSkills.join(", ") || "any skills"}`}
                actions={
                  appliedJobIds.has(j.id) ? (
                    <span className="badge-pending">Applied</span>
                  ) : (
                    <button onClick={() => apply(j.id)} className="btn-ghost text-xs">
                      Apply
                    </button>
                  )
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <StatCard
            label="Applications sent"
            value={applications.length}
            icon={Send}
            accent="primary"
          />
          <StatCard
            label="Open jobs"
            value={jobs ? jobs.length : "-"}
            icon={Briefcase}
            accent="green"
          />
        </div>
        <InfoPanel
          icon={Briefcase}
          title="Tips for applying"
          items={[
            "Every job lists a minimum readiness score — check Skills to see yours.",
            "Track each application's pipeline stage right here after you apply.",
            "Check Recommended for jobs ranked by your skill overlap.",
          ]}
        />
      </div>
    </div>
  );
}
