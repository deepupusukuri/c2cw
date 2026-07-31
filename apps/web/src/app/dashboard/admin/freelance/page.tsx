"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudentPicker } from "@/components/ui/StudentPicker";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface FreelanceRow {
  id: string;
  title: string;
  status: string;
  budget: string | null;
  assignedStudentId: string | null;
  client: { name: string | null; email: string };
}

export default function AdminFreelancePage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<FreelanceRow[] | null>(null);
  const [studentChoice, setStudentChoice] = useState<Record<string, { id: string; label: string }>>({});

  const refresh = useCallback(async () => {
    const [pending, approved] = await Promise.all([
      api.get<FreelanceRow[]>("/freelance?status=PENDING_APPROVAL"),
      api.get<FreelanceRow[]>("/freelance?status=APPROVED"),
    ]);
    setProjects([...pending, ...approved]);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function approve(id: string) {
    try {
      await api.patch(`/freelance/${id}/approve`);
      toast("Freelance request approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve request", "error");
    }
  }
  async function assign(id: string) {
    const student = studentChoice[id];
    if (!student) {
      toast("Pick a student first", "error");
      return;
    }
    try {
      await api.patch(`/freelance/${id}/assign`, { studentId: student.id });
      toast(`Assigned to ${student.label}`);
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't assign student", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Freelance requests</h2>
        <p className="text-xs text-ink-secondary">
          Pending requests need approval; approved requests need a student assigned.
        </p>
        {projects === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {projects?.length === 0 && (
          <div className="card">
            <EmptyState
              icon={Briefcase}
              title="No freelance requests pending"
              description="Client-posted freelance work awaiting approval or assignment shows up here."
            />
          </div>
        )}
        {projects && projects.length > 0 && (
          <ListStack>
            {projects.map((f) => (
              <ListCard
                key={f.id}
                icon={Briefcase}
                accent="orange"
                title={`${f.title} ${f.budget ? `· ₹${f.budget}` : ""}`}
                caption={`${f.client.email} · ${f.status.replace("_", " ")}`}
                actions={
                  <>
                    {f.status === "PENDING_APPROVAL" && (
                      <button onClick={() => approve(f.id)} className="btn-ghost text-xs">
                        Approve
                      </button>
                    )}
                    {f.status === "APPROVED" && !f.assignedStudentId && (
                      <div className="flex items-center gap-2">
                        <StudentPicker
                          selectedLabel={studentChoice[f.id]?.label}
                          onSelect={(id, label) => setStudentChoice((s) => ({ ...s, [f.id]: { id, label } }))}
                        />
                        <button onClick={() => assign(f.id)} className="btn-ghost text-xs">
                          Assign
                        </button>
                      </div>
                    )}
                  </>
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Pending approval"
            value={projects === null ? "-" : projects.filter((p) => p.status === "PENDING_APPROVAL").length}
            icon={Briefcase}
            accent="orange"
          />
          <StatCard
            label="Needs assignment"
            value={
              projects === null
                ? "-"
                : projects.filter((p) => p.status === "APPROVED" && !p.assignedStudentId).length
            }
            icon={UserPlus}
            accent="primary"
          />
        </div>
        <InfoPanel
          icon={Briefcase}
          title="Freelance workflow"
          items={[
            "Pending requests need approval before a student can be assigned.",
            "Approved projects without a student show an assign control below.",
            "Budgets are set by the client and shown here for reference only.",
            "Once assigned, the project moves off this review queue.",
          ]}
        />
      </div>
    </div>
  );
}
