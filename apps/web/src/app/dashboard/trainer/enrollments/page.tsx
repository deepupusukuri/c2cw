"use client";

import { useCallback, useEffect, useState } from "react";
import { GraduationCap, Compass } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonRow, SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

const STATUSES = ["PENDING", "ACTIVE", "COMPLETED", "WITHDRAWN"];

interface Program {
  id: string;
  name: string;
  slug: string;
  type: string;
}

interface EnrollmentRow {
  id: string;
  status: string;
  user: { id: string; name: string | null; email: string };
}

function ProgramRow({ program }: { program: Program }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[] | null>(null);

  async function loadEnrollments() {
    try {
      const rows = await api.get<EnrollmentRow[]>(`/programs/${program.id}/enrollments`);
      setEnrollments(rows);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load enrollments", "error");
    }
  }

  async function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && enrollments === null) await loadEnrollments();
  }

  async function setStatus(enrollmentId: string, status: string) {
    try {
      await api.patch(`/programs/enrollments/${enrollmentId}/status`, { status });
      toast("Enrollment status updated");
      await loadEnrollments();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't update status", "error");
    }
  }

  return (
    <ListCard
      icon={GraduationCap}
      title={program.name}
      caption={program.type.replace("_", " ")}
      actions={
        <button onClick={toggle} className="btn-ghost text-xs">
          {expanded ? "Hide enrollments" : "View enrollments"}
        </button>
      }
    >
      {expanded && (
        <div className="mt-3 rounded-btn bg-surface-muted p-3">
          {enrollments === null && <SkeletonRow />}
          {enrollments?.length === 0 && <p className="text-xs text-ink-secondary">No enrollments yet.</p>}
          {enrollments?.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-2 py-1.5">
              <span className="text-xs">{e.user.name ?? e.user.email}</span>
              <select
                value={e.status}
                onChange={(ev) => setStatus(e.id, ev.target.value)}
                className="input-field w-32 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </ListCard>
  );
}

export default function TrainerEnrollmentsPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      setPrograms(await api.get<Program[]>("/programs"));
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load programs", "error");
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const careerPathCount = programs?.filter((p) => p.type === "CAREER_PATH").length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Program enrollments</h2>
        {programs === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {programs?.length === 0 && (
          <div className="card">
            <EmptyState icon={GraduationCap} title="No programs yet" />
          </div>
        )}
        {programs && programs.length > 0 && (
          <ListStack>
            {programs.map((p) => (
              <ProgramRow key={p.id} program={p} />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total programs" value={programs?.length ?? "-"} icon={GraduationCap} accent="primary" />
          <StatCard label="Career paths" value={careerPathCount} icon={Compass} accent="purple" />
        </div>
        <InfoPanel
          icon={GraduationCap}
          title="Enrollment lifecycle"
          items={[
            "Enrollments move through PENDING → ACTIVE → COMPLETED or WITHDRAWN.",
            "Set a student to ACTIVE once they've been confirmed for the program.",
            "Mark COMPLETED when a student finishes, or WITHDRAWN if they drop out.",
            "Status changes take effect immediately and are visible to the student right away.",
          ]}
        />
      </div>
    </div>
  );
}
