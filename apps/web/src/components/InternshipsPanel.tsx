"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListCard, ListStack } from "@/components/ui/ListCard";

export interface InternshipRowData {
  id: string;
  title: string;
  status: string;
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

export function PostInternshipForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/internships", { title, description: description || undefined });
      setTitle("");
      setDescription("");
      toast("Internship submitted for admin approval");
      onCreated();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't submit internship", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-base font-medium">Post an internship</h2>
      <div>
        <label className="text-sm text-ink-secondary">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field mt-1" />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Submitting..." : "Submit for approval"}
      </button>
    </form>
  );
}

function InternshipRow({ internship }: { internship: InternshipRowData }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [applications, setApplications] = useState<ApplicationRow[] | null>(null);

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

  async function select(studentId: string) {
    try {
      await api.patch(`/internships/${internship.id}/select/${studentId}`, {});
      toast("Applicant selected");
      loadApplications();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't select applicant", "error");
    }
  }

  return (
    <ListCard
      icon={Building2}
      accent={internship.status === "OPEN" ? "green" : "primary"}
      title={internship.title}
      badge={
        <span className={internship.status === "OPEN" ? "badge-verified" : "badge-pending"}>
          {internship.status.replace("_", " ")}
        </span>
      }
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
            <div key={a.id} className="flex items-center justify-between gap-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs">{a.student.name ?? a.student.email}</span>
                <span className={STATUS_BADGE[a.status] ?? "badge-pending"}>{a.status}</span>
              </div>
              {a.status === "APPLIED" && (
                <button onClick={() => select(a.student.id)} className="btn-ghost text-xs">
                  Select
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </ListCard>
  );
}

export function InternshipsList({ internships }: { internships: InternshipRowData[] }) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-medium">Your internships</h2>
      {internships.length === 0 && (
        <div className="card">
          <EmptyState icon={Building2} title="No internships posted yet" />
        </div>
      )}
      {internships.length > 0 && (
        <ListStack>
          {internships.map((i) => (
            <InternshipRow key={i.id} internship={i} />
          ))}
        </ListStack>
      )}
    </div>
  );
}
