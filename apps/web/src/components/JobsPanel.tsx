"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListCard, ListStack } from "@/components/ui/ListCard";
import { Briefcase } from "lucide-react";

const STAGES = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];

export interface JobRowData {
  id: string;
  title: string;
  description: string | null;
  requiredSkills: string[];
  minReadinessScore: number;
  postedById: string;
}

interface Application {
  id: string;
  stage: string;
  student: { id: string; name: string | null; email: string };
}

interface RecommendationItem {
  id: string;
  score: number;
  reason: string;
}

export function PostJobForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [minReadinessScore, setMinReadinessScore] = useState("0");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/jobs", {
        title,
        description: description || undefined,
        requiredSkills: skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        minReadinessScore: Number(minReadinessScore),
      });
      setTitle("");
      setDescription("");
      setSkillsInput("");
      setMinReadinessScore("0");
      toast("Job posted");
      onCreated();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't post job", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-base font-medium">Post a job</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm text-ink-secondary">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field mt-1" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-ink-secondary">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Required skills (comma-separated)</label>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, SQL"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Minimum readiness score</label>
          <input
            type="number"
            min={0}
            max={100}
            value={minReadinessScore}
            onChange={(e) => setMinReadinessScore(e.target.value)}
            className="input-field mt-1"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Posting..." : "Post job"}
      </button>
    </form>
  );
}

export function JobRow({ job }: { job: JobRowData }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"pipeline" | "recommended">("pipeline");
  const [pipeline, setPipeline] = useState<Application[] | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[] | null>(null);

  async function loadPipeline() {
    const p = await api.get<Application[]>(`/jobs/${job.id}/pipeline`);
    setPipeline(p);
  }

  async function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && pipeline === null) await loadPipeline();
  }

  async function loadRecommended() {
    setTab("recommended");
    if (recommendations === null) {
      const r = await api.get<RecommendationItem[]>(`/recommendations/candidates/${job.id}`);
      setRecommendations(r);
    }
  }

  async function setStage(applicationId: string, stage: string) {
    try {
      await api.patch(`/jobs/applications/${applicationId}/stage`, { stage });
      toast("Stage updated");
      await loadPipeline();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't update stage", "error");
    }
  }

  return (
    <ListCard
      icon={Briefcase}
      title={job.title}
      caption={`Min readiness: ${job.minReadinessScore} · ${job.requiredSkills.join(", ") || "any skills"}`}
      actions={
        <button onClick={toggle} className="btn-ghost text-xs">
          {expanded ? "Hide" : "View pipeline"}
        </button>
      }
    >
      {expanded && (
        <div className="mt-3 rounded-btn bg-surface-muted p-3">
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => setTab("pipeline")}
              className={tab === "pipeline" ? "badge-sponsored" : "badge-pending"}
            >
              Pipeline
            </button>
            <button onClick={loadRecommended} className={tab === "recommended" ? "badge-sponsored" : "badge-pending"}>
              Recommended candidates
            </button>
          </div>

          {tab === "pipeline" && (
            <div className="space-y-2">
              {pipeline?.length === 0 && <p className="text-xs text-ink-secondary">No applicants yet.</p>}
              {pipeline?.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs">{a.student.name ?? a.student.email}</span>
                  <select
                    value={a.stage}
                    onChange={(e) => setStage(a.id, e.target.value)}
                    className="input-field w-36 text-xs"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {tab === "recommended" && (
            <div className="space-y-2">
              {recommendations?.length === 0 && (
                <p className="text-xs text-ink-secondary">No candidates match yet.</p>
              )}
              {recommendations?.map((r) => (
                <div key={r.id} className="text-xs">
                  <span className="font-medium">Score {(r.score * 100).toFixed(0)}%</span> — {r.reason}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ListCard>
  );
}

export function JobsList({ jobs }: { jobs: JobRowData[] }) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-medium">Your job postings</h2>
      {jobs.length === 0 && (
        <div className="card">
          <EmptyState icon={Briefcase} title="No jobs posted yet" description="Post your first role above." />
        </div>
      )}
      {jobs.length > 0 && (
        <ListStack>
          {jobs.map((j) => (
            <JobRow key={j.id} job={j} />
          ))}
        </ListStack>
      )}
    </div>
  );
}
