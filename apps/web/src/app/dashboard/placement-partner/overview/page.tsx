"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Users, Wallet } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { staggerChildren, slideUp } from "@/lib/motion";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";

interface PlacementPartner {
  id: string;
  agencyName: string;
  commissionRate: string;
}

interface Referral {
  id: string;
  commissionAmount: string;
  status: string;
}

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const { toast } = useToast();
  const [agencyName, setAgencyName] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/placement-partners/register", {
        agencyName,
        commissionRate: Number(commissionRate),
      });
      toast("Registered as a placement partner");
      onRegistered();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't register", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-lg font-medium">Register as a placement partner</h2>
      <div>
        <label className="text-sm text-ink-secondary">Agency name</label>
        <input
          required
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Commission rate (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          required
          value={commissionRate}
          onChange={(e) => setCommissionRate(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

function RegisterGate({ onRegistered }: { onRegistered: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <RegisterForm onRegistered={onRegistered} />
      <InfoPanel
        icon={Wallet}
        title="What you get as a Placement Partner"
        items={[
          "Refer candidates to open roles and earn commission on successful hires.",
          "Track every referral's status from referred through hired to paid.",
          "Commission is calculated automatically from your agreed rate.",
          "Manage all your referrals from a single dashboard.",
        ]}
      />
    </div>
  );
}

export default function PlacementPartnerOverviewPage() {
  const [partner, setPartner] = useState<PlacementPartner | null | undefined>(undefined);
  const [referrals, setReferrals] = useState<Referral[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      const p = await api.get<PlacementPartner>("/placement-partners/me");
      setPartner(p);
    } catch {
      setPartner(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!partner) return;
    api
      .get<Referral[]>("/placement-partners/referrals/mine")
      .then(setReferrals)
      .catch(() => setReferrals([]));
  }, [partner]);

  if (partner === undefined) {
    return <SkeletonCard />;
  }

  if (!partner) {
    return <RegisterGate onRegistered={refresh} />;
  }

  const totalCommission = (referrals ?? [])
    .filter((r) => r.status === "COMMISSION_APPROVED" || r.status === "PAID")
    .reduce((sum, r) => sum + Number(r.commissionAmount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold">{partner.agencyName}</h2>
        <p className="text-sm text-ink-secondary">{partner.commissionRate}% commission rate</p>
      </div>

      <StatGrid columns={2}>
        <StatCard label="Total referrals" value={referrals?.length ?? "-"} icon={Users} accent="primary" />
        <StatCard
          label="Total commission"
          value={referrals ? `₹${totalCommission.toLocaleString()}` : "-"}
          icon={Wallet}
          accent="green"
        />
      </StatGrid>

      <motion.div variants={staggerChildren} initial="hidden" animate="visible">
        <motion.a
          href="/dashboard/placement-partner/referrals"
          variants={slideUp}
          className="card block max-w-sm transition-shadow hover:shadow-elevated"
        >
          <Handshake size={20} className="text-primary" />
          <p className="mt-3 text-sm font-medium">Manage referrals</p>
          <p className="mt-1 text-xs text-ink-secondary">
            Refer candidates for open roles and track commission status.
          </p>
        </motion.a>
      </motion.div>
    </div>
  );
}
