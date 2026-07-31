"use client";

import { useCallback, useEffect, useState } from "react";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface Program {
  id: string;
  name: string;
  type: string;
  description: string | null;
}

interface Enrollment {
  id: string;
  status: string;
  program: Program;
}

export default function StudentProgramsPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const refresh = useCallback(async () => {
    const [programsRes, enrollmentsRes] = await Promise.all([
      api.get<Program[]>("/programs"),
      api.get<Enrollment[]>("/programs/me/enrollments"),
    ]);
    setPrograms(programsRes);
    setEnrollments(enrollmentsRes);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function enroll(programId: string) {
    try {
      await api.post(`/programs/${programId}/enroll`);
      toast("Enrolled — pending activation");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't enroll", "error");
    }
  }

  const enrolledProgramIds = new Set(enrollments.map((e) => e.program.id));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Programs</h2>
        {programs === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {programs?.length === 0 && (
          <div className="card">
            <EmptyState icon={GraduationCap} title="No programs published yet" />
          </div>
        )}
        {programs && programs.length > 0 && (
          <ListStack>
            {programs.map((p) => (
              <ListCard
                key={p.id}
                icon={GraduationCap}
                title={p.name}
                caption={p.type.replace("_", " ")}
                actions={
                  enrolledProgramIds.has(p.id) ? (
                    <span className="badge-pending">Enrolled</span>
                  ) : (
                    <button onClick={() => enroll(p.id)} className="btn-ghost text-xs">
                      Enroll
                    </button>
                  )
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Programs enrolled"
            value={enrollments.length}
            icon={CheckCircle2}
            accent="green"
          />
          <StatCard
            label="Available programs"
            value={programs ? programs.length : "-"}
            icon={GraduationCap}
            accent="primary"
          />
        </div>
        <InfoPanel
          icon={GraduationCap}
          title="What happens after enrolling"
          items={[
            "Your enrollment starts out as PENDING.",
            "It activates once your college or trainer approves it.",
            "You can enroll in multiple programs at once.",
            "Completed programs contribute to your readiness score.",
          ]}
        />
      </div>
    </div>
  );
}
