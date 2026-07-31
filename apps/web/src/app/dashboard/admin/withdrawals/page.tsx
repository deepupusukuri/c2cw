"use client";

import { useCallback, useEffect, useState } from "react";
import { Wallet, IndianRupee } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface WithdrawalRow {
  id: string;
  amount: string;
  status: string;
  user: { name: string | null; email: string };
}

export default function AdminWithdrawalsPage() {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[] | null>(null);

  const refresh = useCallback(async () => {
    setWithdrawals(await api.get<WithdrawalRow[]>("/wallet/withdrawals"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function approve(id: string) {
    try {
      await api.patch(`/wallet/withdrawals/${id}/approve`);
      toast("Withdrawal approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve withdrawal", "error");
    }
  }
  async function reject(id: string) {
    try {
      await api.patch(`/wallet/withdrawals/${id}/reject`);
      toast("Withdrawal rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject withdrawal", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Withdrawals awaiting approval</h2>
        {withdrawals === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {withdrawals?.length === 0 && (
          <div className="card">
            <EmptyState
              icon={Wallet}
              title="No withdrawals pending"
              description="Student wallet withdrawal requests awaiting approval show up here."
            />
          </div>
        )}
        {withdrawals && withdrawals.length > 0 && (
          <ListStack>
            {withdrawals.map((w) => (
              <ListCard
                key={w.id}
                icon={Wallet}
                title={`₹${w.amount}`}
                caption={w.user.name ?? w.user.email}
                actions={
                  <div className="flex items-center gap-2">
                    <button onClick={() => approve(w.id)} className="btn-ghost text-xs">
                      Approve
                    </button>
                    <button onClick={() => reject(w.id)} className="btn-ghost text-xs">
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
          <StatCard
            label="Requests"
            value={withdrawals === null ? "-" : withdrawals.length}
            icon={Wallet}
            accent="orange"
          />
          <StatCard
            label="Total amount"
            value={
              withdrawals === null
                ? "-"
                : `₹${withdrawals.reduce((sum, w) => sum + Number(w.amount), 0)}`
            }
            icon={IndianRupee}
            accent="primary"
          />
        </div>
        <InfoPanel
          icon={Wallet}
          title="Reviewing withdrawals"
          items={[
            "Approving a withdrawal releases funds from the student's wallet.",
            "Rejecting a withdrawal keeps the balance in the student's wallet untouched.",
            "Double-check the amount before approving — the action can't be undone from here.",
            "New requests appear as soon as a student submits them.",
          ]}
        />
      </div>
    </div>
  );
}
