"use client";

import { useCallback, useEffect, useState } from "react";
import { GraduationCap, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface CampusAmbassadorApp {
  id: string;
  collegeName: string;
  status: string;
  user: { name: string | null; email: string };
}

export default function AdminAmbassadorsPage() {
  const { toast } = useToast();
  const [apps, setApps] = useState<CampusAmbassadorApp[] | null>(null);

  const refresh = useCallback(async () => {
    setApps(await api.get<CampusAmbassadorApp[]>("/campus-ambassador?status=APPLIED"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function approve(id: string) {
    try {
      await api.patch(`/campus-ambassador/${id}/approve`);
      toast("Application approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve application", "error");
    }
  }
  async function reject(id: string) {
    try {
      await api.patch(`/campus-ambassador/${id}/reject`);
      toast("Application rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject application", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Campus Ambassador applications</h2>
        {apps === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {apps?.length === 0 && (
          <div className="card">
            <EmptyState
              icon={GraduationCap}
              title="No applications pending"
              description="Student Campus Ambassador applications show up here for review."
            />
          </div>
        )}
        {apps && apps.length > 0 && (
          <ListStack>
            {apps.map((a) => (
              <ListCard
                key={a.id}
                icon={GraduationCap}
                accent="orange"
                title={a.user.name ?? a.user.email}
                caption={a.collegeName}
                actions={
                  <div className="flex items-center gap-2">
                    <button onClick={() => approve(a.id)} className="btn-ghost text-xs">
                      Approve
                    </button>
                    <button onClick={() => reject(a.id)} className="btn-ghost text-xs">
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
          <StatCard label="Applications" value={apps === null ? "-" : apps.length} icon={GraduationCap} accent="orange" />
          <StatCard
            label="Colleges"
            value={apps === null ? "-" : new Set(apps.map((a) => a.collegeName)).size}
            icon={Building2}
            accent="primary"
          />
        </div>
        <InfoPanel
          icon={GraduationCap}
          title="Campus Ambassador reviews"
          items={[
            "Applications land here as soon as a student applies.",
            "Approving grants the student Campus Ambassador status immediately.",
            "Rejecting removes the application from this queue.",
            "Multiple students from the same college can be approved.",
          ]}
        />
      </div>
    </div>
  );
}
