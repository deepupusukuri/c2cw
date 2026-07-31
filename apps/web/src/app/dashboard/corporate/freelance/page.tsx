"use client";

import { useCallback, useEffect, useState } from "react";
import { Wallet, Clock3 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface FreelanceRow {
  id: string;
  title: string;
  status: string;
  clientId: string;
  budget: string | null;
  assignedStudentId: string | null;
}

const STATUS_BADGE: Record<string, string> = {
  PENDING_APPROVAL: "badge-pending",
  APPROVED: "badge-sponsored",
  IN_PROGRESS: "badge-sponsored",
  COMPLETED: "badge-verified",
};

function PostFreelanceForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/freelance", {
        title,
        description: description || undefined,
        milestones: [{ title: milestoneTitle, amount: Number(milestoneAmount) }],
      });
      setTitle("");
      setDescription("");
      setMilestoneTitle("");
      setMilestoneAmount("");
      toast("Freelance project submitted for admin approval");
      onCreated();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't submit freelance project", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-base font-medium">Post a freelance project</h2>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-ink-secondary">First milestone title</label>
          <input
            required
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Milestone amount (₹)</label>
          <input
            type="number"
            min={1}
            required
            value={milestoneAmount}
            onChange={(e) => setMilestoneAmount(e.target.value)}
            className="input-field mt-1"
          />
        </div>
      </div>
      <p className="text-xs text-ink-secondary">
        More milestones can be added later — this starts the project with one.
      </p>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Submitting..." : "Submit for approval"}
      </button>
    </form>
  );
}

export default function CorporateFreelancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<FreelanceRow[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      const all = await api.get<FreelanceRow[]>("/freelance");
      setProjects(user ? all.filter((f) => f.clientId === user.id) : []);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load freelance projects", "error");
    }
  }, [user, toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pending = projects?.filter((p) => p.status === "PENDING_APPROVAL").length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <PostFreelanceForm onCreated={refresh} />
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-medium">Your freelance projects</h2>
          {projects === null && (
            <ListStack>
              <SkeletonCard />
              <SkeletonCard />
            </ListStack>
          )}
          {projects?.length === 0 && (
            <div className="card">
              <EmptyState icon={Wallet} title="No freelance projects yet" description="Post one above to get started." />
            </div>
          )}
          {projects && projects.length > 0 && (
            <ListStack>
              {projects.map((p) => (
                <ListCard
                  key={p.id}
                  icon={Wallet}
                  title={p.title}
                  caption={`${p.budget ? `₹${p.budget}` : "Budget set by milestones"}${p.assignedStudentId ? " · Student assigned" : " · Awaiting student assignment"}`}
                  badge={<span className={STATUS_BADGE[p.status] ?? "badge-pending"}>{p.status.replace("_", " ")}</span>}
                />
              ))}
            </ListStack>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Projects posted" value={projects?.length ?? "-"} icon={Wallet} accent="purple" />
          <StatCard label="Awaiting approval" value={pending} icon={Clock3} accent="orange" />
        </div>
        <InfoPanel
          icon={Wallet}
          title="How freelance assignment works"
          items={[
            "Admin reviews and approves every freelance project before it's assigned.",
            "Once approved, admin matches a student to your project based on skills and readiness.",
            "Milestone payments release as the assigned student completes each milestone.",
            "You'll see the assigned student's name here as soon as one is matched.",
          ]}
        />
      </div>
    </div>
  );
}
