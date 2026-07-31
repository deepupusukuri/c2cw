"use client";

import { useCallback, useEffect, useState } from "react";
import { Handshake, Clock3 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface PlacementReferral {
  id: string;
  studentId: string;
  baseAmount: string;
  commissionAmount: string;
  status: string;
  job: { title: string };
  placementPartner: { agencyName: string; user: { name: string | null; email: string } };
}

const REFERRAL_ACTIONS: Record<string, { label: string; action: string }> = {
  REFERRED: { label: "Mark hired", action: "mark-hired" },
  HIRED: { label: "Approve commission", action: "approve-commission" },
  COMMISSION_APPROVED: { label: "Release commission", action: "release-commission" },
};

export default function AdminReferralsPage() {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<PlacementReferral[] | null>(null);

  const refresh = useCallback(async () => {
    setReferrals(await api.get<PlacementReferral[]>("/placement-partners/referrals"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const active = referrals?.filter((r) => !["PAID", "REJECTED"].includes(r.status)) ?? null;

  async function runAction(id: string, action: string, successMessage: string) {
    try {
      await api.patch(`/placement-partners/referrals/${id}/${action}`);
      toast(successMessage);
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't update referral", "error");
    }
  }
  async function reject(id: string) {
    try {
      await api.patch(`/placement-partners/referrals/${id}/reject`);
      toast("Referral rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject referral", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Placement referrals</h2>
        <p className="text-xs text-ink-secondary">
          Each step here is a real state transition — release commission credits the partner&apos;s
          wallet and creates a payout transaction.
        </p>
        {active === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {active?.length === 0 && (
          <div className="card">
            <EmptyState icon={Handshake} title="Nothing in progress" description="Active placement referrals will appear here." />
          </div>
        )}
        {active && active.length > 0 && (
          <ListStack>
            {active.map((r) => {
              const next = REFERRAL_ACTIONS[r.status];
              return (
                <ListCard
                  key={r.id}
                  icon={Handshake}
                  accent="orange"
                  title={`${r.placementPartner.agencyName} → ${r.job.title}`}
                  caption={`Base ₹${r.baseAmount} · commission ₹${r.commissionAmount} · ${r.status.replace("_", " ")}`}
                  actions={
                    <div className="flex items-center gap-2">
                      {next && (
                        <button
                          onClick={() => runAction(r.id, next.action, `Referral ${next.label.toLowerCase()}`)}
                          className="btn-ghost text-xs"
                        >
                          {next.label}
                        </button>
                      )}
                      <button onClick={() => reject(r.id)} className="btn-ghost text-xs">
                        Reject
                      </button>
                    </div>
                  }
                />
              );
            })}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Active referrals" value={active === null ? "-" : active.length} icon={Handshake} accent="primary" />
          <StatCard
            label="Awaiting hire"
            value={referrals === null ? "-" : referrals.filter((r) => r.status === "REFERRED").length}
            icon={Clock3}
            accent="orange"
          />
        </div>
        <InfoPanel
          icon={Handshake}
          title="Referral lifecycle"
          items={[
            "Referred → Hired → Commission approved → Released is the full lifecycle.",
            "Releasing commission credits the partner's wallet and creates a payout transaction.",
            "Reject at any stage to remove a referral from the active queue.",
            "Paid and rejected referrals no longer appear in this list.",
          ]}
        />
      </div>
    </div>
  );
}
