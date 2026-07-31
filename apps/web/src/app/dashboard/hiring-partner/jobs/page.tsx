"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostJobForm, JobsList, type JobRowData } from "@/components/JobsPanel";

interface BulkJobRow {
  title: string;
  description: string;
  skillsInput: string;
}

function BulkRequestForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<BulkJobRow[]>([{ title: "", description: "", skillsInput: "" }]);
  const [loading, setLoading] = useState(false);

  function updateRow(index: number, patch: Partial<BulkJobRow>) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((r) => [...r, { title: "", description: "", skillsInput: "" }]);
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/hiring-partners/bulk-request", {
        jobs: rows.map((r) => ({
          title: r.title,
          description: r.description || undefined,
          requiredSkills: r.skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        })),
      });
      setRows([{ title: "", description: "", skillsInput: "" }]);
      toast("Bulk job request submitted");
      onCreated();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't submit bulk request", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-base font-medium">Bulk-request roles</h2>
      <p className="text-xs text-ink-secondary">Post several roles at once — each goes live immediately.</p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-btn bg-surface-muted p-3 sm:grid-cols-4">
            <input
              required
              placeholder="Title"
              value={row.title}
              onChange={(e) => updateRow(i, { title: e.target.value })}
              className="input-field sm:col-span-2"
            />
            <input
              placeholder="Skills (comma-separated)"
              value={row.skillsInput}
              onChange={(e) => updateRow(i, { skillsInput: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <input
                placeholder="Description"
                value={row.description}
                onChange={(e) => updateRow(i, { description: e.target.value })}
                className="input-field flex-1"
              />
              {rows.length > 1 && (
                <button type="button" onClick={() => removeRow(i)} className="btn-ghost text-xs">
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={addRow} className="btn-ghost text-xs">
          Add another role
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Submitting..." : "Submit bulk request"}
        </button>
      </div>
    </form>
  );
}

export default function HiringPartnerJobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState<JobRowData[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      await api.get("/hiring-partners/me");
      setRegistered(true);
    } catch {
      setRegistered(false);
      return;
    }
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

  if (registered === null || (registered && jobs === null)) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!registered) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card">
          <EmptyState
            icon={Briefcase}
            title="Register to start posting jobs"
            description="Set up your Hiring Partner profile first — it only takes a few seconds."
            action={
              <Link href="/dashboard/hiring-partner/overview" className="btn-primary">
                Go to Overview
              </Link>
            }
          />
        </div>
        <InfoPanel
          icon={Briefcase}
          title="What you'll be able to do here"
          items={[
            "Bulk-request several roles at once, or post them one at a time.",
            "Track every applicant through a visual pipeline, from applied to hired.",
            "See algorithm-recommended candidates matched to each posting.",
          ]}
        />
      </div>
    );
  }

  const jobsList = jobs ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <BulkRequestForm onCreated={refresh} />
        <PostJobForm onCreated={refresh} />
        <JobsList jobs={jobsList} />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Jobs live" value={jobsList.length} icon={Briefcase} accent="primary" />
          <StatCard
            label="Unique skills"
            value={new Set(jobsList.flatMap((j) => j.requiredSkills)).size}
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
