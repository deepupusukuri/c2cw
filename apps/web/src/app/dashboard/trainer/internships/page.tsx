"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonRow, SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface InternshipRow {
  id: string;
  title: string;
  status: string;
  company: { companyName: string } | null;
}

interface ApplicationRow {
  id: string;
  status: string;
  student: { id: string; name: string | null; email: string };
}

const STATUS_BADGE: Record<string, string> = {
  APPLIED: "badge-pending",
  SELECTED: "badge-sponsored",
  REJECTED: "badge-pending",
};

function InternshipRowItem({ internship }: { internship: InternshipRow }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [applications, setApplications] = useState<ApplicationRow[] | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<string, string>>({});
  const [notesInput, setNotesInput] = useState<Record<string, string>>({});

  async function loadApplications() {
    try {
      const rows = await api.get<ApplicationRow[]>(`/internships/${internship.id}/applications`);
      setApplications(rows);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load applicants", "error");
    }
  }

  async function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && applications === null) await loadApplications();
  }

  async function evaluate(studentId: string) {
    try {
      await api.patch(`/internships/${internship.id}/evaluate/${studentId}`, {
        score: Number(scoreInput[studentId] ?? 0),
        notes: notesInput[studentId] || undefined,
      });
      toast("Evaluation saved");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't save evaluation", "error");
    }
  }

  return (
    <ListCard
      icon={Building2}
      title={internship.title}
      caption={internship.company?.companyName}
      actions={
        <button onClick={toggle} className="btn-ghost text-xs">
          {expanded ? "Hide applicants" : "View applicants"}
        </button>
      }
    >
      {expanded && (
        <div className="mt-3 rounded-btn bg-surface-muted p-3">
          {applications === null && <SkeletonRow />}
          {applications?.length === 0 && <p className="text-xs text-ink-secondary">No applicants yet.</p>}
          {applications?.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs">{a.student.name ?? a.student.email}</span>
                <span className={STATUS_BADGE[a.status] ?? "badge-pending"}>{a.status}</span>
              </div>
              {a.status === "SELECTED" && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Score"
                    value={scoreInput[a.student.id] ?? ""}
                    onChange={(e) => setScoreInput((s) => ({ ...s, [a.student.id]: e.target.value }))}
                    className="input-field w-20 text-xs"
                  />
                  <input
                    placeholder="Notes"
                    value={notesInput[a.student.id] ?? ""}
                    onChange={(e) => setNotesInput((s) => ({ ...s, [a.student.id]: e.target.value }))}
                    className="input-field w-32 text-xs"
                  />
                  <button onClick={() => evaluate(a.student.id)} className="btn-ghost text-xs">
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ListCard>
  );
}

export default function TrainerInternshipsPage() {
  const { toast } = useToast();
  const [internships, setInternships] = useState<InternshipRow[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      setInternships(await api.get<InternshipRow[]>("/internships/admin/all"));
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load internships", "error");
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openCount = internships?.filter((i) => i.status === "OPEN").length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Internship applicant evaluation</h2>
        {internships === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {internships?.length === 0 && (
          <div className="card">
            <EmptyState icon={Building2} title="No internships yet" />
          </div>
        )}
        {internships && internships.length > 0 && (
          <ListStack>
            {internships.map((i) => (
              <InternshipRowItem key={i.id} internship={i} />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Internships" value={internships?.length ?? "-"} icon={Building2} accent="primary" />
          <StatCard label="Open" value={openCount} icon={CheckCircle2} accent="green" />
        </div>
        <InfoPanel
          icon={Building2}
          title="Evaluation flow"
          items={[
            "Only applicants marked SELECTED can be scored and given notes.",
            "Saving an evaluation automatically recomputes the student's readiness score.",
            "Notes are optional but help students understand their feedback.",
            "Applicants stay evaluable as long as the internship listing remains open.",
          ]}
        />
      </div>
    </div>
  );
}
