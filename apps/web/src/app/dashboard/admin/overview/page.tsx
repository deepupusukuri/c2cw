"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { staggerChildren, slideUp } from "@/lib/motion";
import { SkeletonStatCard } from "@/components/ui/Skeleton";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface ModuleRow {
  id: string;
  name: string;
  isEnabled: boolean;
}

interface Overview {
  pendingApprovals: {
    projects: number;
    internships: number;
    freelanceProjects: number;
    withdrawals: number;
    talks: number;
    sponsorshipPledges: number;
    sponsorshipRequests: number;
    campusAmbassadors: number;
    placementReferrals: number;
  };
  users: { total: number; students: number };
  modules: ModuleRow[];
}

export default function AdminOverviewPage() {
  const { toast } = useToast();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.get<Overview>("/admin/overview");
      setOverview(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong loading the admin overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggle(name: string, current: boolean) {
    try {
      await api.patch(`/modules/${name}`, { isEnabled: !current });
      toast(`${name.replace(/_/g, " ")} ${!current ? "enabled" : "disabled"}`);
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't update module", "error");
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-red-600">{error ?? "Couldn't load the admin overview."}</p>
        <button onClick={refresh} className="btn-ghost mt-4 text-xs">
          Try again
        </button>
      </div>
    );
  }

  const approvalCards = [
    { label: "Projects awaiting review", value: overview.pendingApprovals.projects },
    { label: "Internships awaiting approval", value: overview.pendingApprovals.internships },
    { label: "Freelance requests awaiting approval", value: overview.pendingApprovals.freelanceProjects },
    { label: "Withdrawals awaiting approval", value: overview.pendingApprovals.withdrawals },
    { label: "Talk applications awaiting review", value: overview.pendingApprovals.talks },
    { label: "Sponsorship pledges pending", value: overview.pendingApprovals.sponsorshipPledges },
    { label: "Sponsorship requests pending", value: overview.pendingApprovals.sponsorshipRequests },
    { label: "Campus Ambassador applications", value: overview.pendingApprovals.campusAmbassadors },
    { label: "Placement referrals in progress", value: overview.pendingApprovals.placementReferrals },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Admin overview</h2>
        <p className="text-sm text-ink-secondary">
          {overview.users.total} users total · {overview.users.students} students
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {approvalCards.map((c) => (
              <motion.div key={c.label} variants={slideUp} className="card transition-shadow hover:shadow-sm">
                <p className="text-3xl font-semibold">{c.value}</p>
                <p className="mt-1 text-xs text-ink-secondary">{c.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-ink-secondary" />
                <h3 className="font-heading text-lg font-medium">Module toggles</h3>
              </div>
              <p className="mt-1 text-xs text-ink-secondary">
                Disabling a module blocks its API routes immediately (via ModuleEnabledGuard) — no
                redeploy needed.
              </p>
            </div>
            <ListStack>
              {overview.modules.map((m) => (
                <ListCard
                  key={m.id}
                  icon={ShieldCheck}
                  accent={m.isEnabled ? "green" : "primary"}
                  title={m.name.replace(/_/g, " ")}
                  actions={
                    <button
                      onClick={() => toggle(m.name, m.isEnabled)}
                      className={`${m.isEnabled ? "badge-verified" : "badge-pending"} transition-transform duration-150 ease-out active:scale-95`}
                    >
                      {m.isEnabled ? "Enabled" : "Disabled"}
                    </button>
                  }
                />
              ))}
            </ListStack>
          </div>
        </div>
        <div className="space-y-6">
          <InfoPanel
            icon={ShieldCheck}
            title="Admin playbook"
            items={[
              "Each pending-approval card corresponds to a review queue in the sidebar navigation.",
              "Disabling a module blocks its API routes immediately — no redeploy needed.",
              "Re-enabling a module restores access instantly, so toggles are safe to test.",
              `There are ${overview.users.total} users total, including ${overview.users.students} students.`,
              "Approval counts refresh automatically after every action you take in a review queue.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
