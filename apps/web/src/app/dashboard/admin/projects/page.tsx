"use client";

import { useCallback, useEffect, useState } from "react";
import { FileCheck2, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface ProjectRow {
  id: string;
  title: string;
  type: string;
  status: string;
  score: number | null;
  owner: { name: string | null; email: string };
}

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    setProjects(await api.get<ProjectRow[]>("/projects?status=SUBMITTED"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function approve(id: string) {
    try {
      const score = scoreInput[id];
      await api.patch(`/projects/${id}/review`, {
        status: "APPROVED",
        ...(score ? { score: Number(score) } : {}),
      });
      toast("Project approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve project", "error");
    }
  }
  async function reject(id: string) {
    try {
      await api.patch(`/projects/${id}/review`, { status: "REJECTED" });
      toast("Project rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject project", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Projects awaiting review</h2>
        {projects === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {projects?.length === 0 && (
          <div className="card">
            <EmptyState
              icon={FileCheck2}
              title="No projects awaiting review"
              description="Submitted projects will show up here for scoring and approval."
            />
          </div>
        )}
        {projects && projects.length > 0 && (
          <ListStack>
            {projects.map((p) => (
              <ListCard
                key={p.id}
                icon={FileCheck2}
                accent="orange"
                title={`${p.title} · ${p.type.replace("_", " ")}`}
                caption={p.owner.name ?? p.owner.email}
                actions={
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Score"
                      value={scoreInput[p.id] ?? ""}
                      onChange={(e) => setScoreInput((s) => ({ ...s, [p.id]: e.target.value }))}
                      className="input-field w-20 text-xs"
                    />
                    <button onClick={() => approve(p.id)} className="btn-ghost text-xs">
                      Approve
                    </button>
                    <button onClick={() => reject(p.id)} className="btn-ghost text-xs">
                      Reject
                    </button>
                  </div>
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Awaiting review"
            value={projects === null ? "-" : projects.length}
            icon={FileCheck2}
            accent="orange"
          />
          <StatCard
            label="Unique submitters"
            value={projects === null ? "-" : new Set(projects.map((p) => p.owner.email)).size}
            icon={Users}
            accent="primary"
          />
        </div>
        <InfoPanel
          icon={FileCheck2}
          title="Reviewing projects"
          items={[
            "Projects land here once a student submits them for review.",
            "Add a score before approving — it feeds into leaderboards and student profiles.",
            "Approving or rejecting removes the project from this queue immediately.",
            "Scores are optional — you can approve without one if scoring isn't needed.",
          ]}
        />
      </div>
    </div>
  );
}
