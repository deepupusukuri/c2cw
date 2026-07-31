"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Clock3 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
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

export default function AdminInternshipsPage() {
  const { toast } = useToast();
  const [internships, setInternships] = useState<InternshipRow[] | null>(null);

  const refresh = useCallback(async () => {
    const all = await api.get<InternshipRow[]>("/internships/admin/all");
    setInternships(all.filter((i) => i.status === "PENDING_APPROVAL"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function approve(id: string) {
    try {
      await api.patch(`/internships/${id}/approve`);
      toast("Internship approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve internship", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Internships awaiting approval</h2>
        {internships === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {internships?.length === 0 && (
          <div className="card">
            <EmptyState
              icon={Building2}
              title="No internships awaiting approval"
              description="New internship postings from corporates will appear here."
            />
          </div>
        )}
        {internships && internships.length > 0 && (
          <ListStack>
            {internships.map((i) => (
              <ListCard
                key={i.id}
                icon={Building2}
                accent="orange"
                title={i.title}
                caption={i.company?.companyName}
                actions={
                  <button onClick={() => approve(i.id)} className="btn-ghost text-xs">
                    Approve
                  </button>
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Awaiting approval"
            value={internships === null ? "-" : internships.length}
            icon={Clock3}
            accent="orange"
          />
          <StatCard
            label="Companies"
            value={
              internships === null
                ? "-"
                : new Set(internships.map((i) => i.company?.companyName ?? "Unknown")).size
            }
            icon={Building2}
            accent="primary"
          />
        </div>
        <InfoPanel
          icon={Building2}
          title="Internship approvals"
          items={[
            "New postings from corporates land here awaiting your review.",
            "Approving makes the internship immediately visible to students.",
            "There's no reject action here — reach out to the corporate directly if a posting needs changes.",
            "The company name comes from the corporate's profile, not the posting itself.",
          ]}
        />
      </div>
    </div>
  );
}
