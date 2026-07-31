import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Open Jobs — Hire Verified, Readiness-Scored Talent",
  description:
    "Browse open roles from corporates and hiring partners on C2CW, filtered by required skills and candidate readiness score.",
};

interface Job {
  id: string;
  title: string;
  description: string | null;
  requiredSkills: string[];
  minReadinessScore: number;
}

async function getJobs(): Promise<Job[]> {
  try {
    return await api.get<Job[]>("/jobs");
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Job Marketplace"
        title="Open jobs from verified hiring partners"
        description="Every applicant comes with a corporate-readiness score built from real, reviewed work — not just a resume."
      />

      <section className="mt-10">
        <h2 className="sr-only">All open jobs</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 && <p className="text-sm text-ink-secondary">No open jobs yet — check back soon.</p>}
          {jobs.map((j) => (
            <div key={j.id} className="card">
              <h3 className="font-heading text-lg font-medium">{j.title}</h3>
              {j.description && <p className="mt-2 text-sm text-ink-secondary">{j.description}</p>}
              <p className="mt-3 text-xs text-ink-secondary">
                Min readiness score: {j.minReadinessScore}
              </p>
              {j.requiredSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {j.requiredSkills.map((s) => (
                    <span key={s} className="badge-verified">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Apply with a profile that proves it"
        description="Register as a student to apply — your readiness score is calculated automatically."
      />
    </PageShell>
  );
}
