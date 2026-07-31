"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Handshake, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudentPicker } from "@/components/ui/StudentPicker";
import { JobPicker } from "@/components/ui/JobPicker";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface Referral {
  id: string;
  studentId: string;
  jobId: string;
  baseAmount: string;
  commissionRate: string;
  commissionAmount: string;
  status: string;
  job: { title: string };
}

const STATUS_BADGE: Record<string, string> = {
  REFERRED: "badge-pending",
  HIRED: "badge-sponsored",
  COMMISSION_APPROVED: "badge-sponsored",
  PAID: "badge-verified",
  REJECTED: "badge-pending",
};

function ReferralForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [student, setStudent] = useState<{ id: string; label: string } | null>(null);
  const [job, setJob] = useState<{ id: string; label: string } | null>(null);
  const [baseAmount, setBaseAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!student || !job) {
      toast("Pick a student and a job first", "error");
      return;
    }
    setLoading(true);
    try {
      await api.post("/placement-partners/referrals", {
        studentId: student.id,
        jobId: job.id,
        baseAmount: Number(baseAmount),
      });
      setStudent(null);
      setJob(null);
      setBaseAmount("");
      toast("Referral created");
      onCreated();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't create referral", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-base font-medium">Refer a candidate</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm text-ink-secondary">Student</label>
          <div className="mt-1">
            <StudentPicker selectedLabel={student?.label} onSelect={(id, label) => setStudent({ id, label })} />
          </div>
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Job</label>
          <div className="mt-1">
            <JobPicker selectedLabel={job?.label} onSelect={(id, label) => setJob({ id, label })} />
          </div>
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Base amount (₹)</label>
          <input
            type="number"
            min={1}
            required
            value={baseAmount}
            onChange={(e) => setBaseAmount(e.target.value)}
            className="input-field mt-1"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Submitting..." : "Create referral"}
      </button>
    </form>
  );
}

export default function PlacementPartnerReferralsPage() {
  const { toast } = useToast();
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [referrals, setReferrals] = useState<Referral[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      await api.get("/placement-partners/me");
      setRegistered(true);
    } catch {
      setRegistered(false);
      return;
    }
    try {
      const r = await api.get<Referral[]>("/placement-partners/referrals/mine");
      setReferrals(r);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load referrals", "error");
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (registered === null || (registered && referrals === null)) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!registered) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card">
          <EmptyState
            icon={Handshake}
            title="Register to start referring candidates"
            description="Set up your Placement Partner profile first — it only takes a few seconds."
            action={
              <Link href="/dashboard/placement-partner/overview" className="btn-primary">
                Go to Overview
              </Link>
            }
          />
        </div>
        <InfoPanel
          icon={Handshake}
          title="What you'll be able to do here"
          items={[
            "Refer candidates to open roles and earn commission on successful hires.",
            "Track every referral's status from referred through hired to paid.",
            "Commission is calculated automatically from your agreed rate.",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <ReferralForm onCreated={refresh} />

        <div className="space-y-4">
          <h2 className="font-heading text-lg font-medium">Your referrals</h2>
          {referrals === null && (
            <ListStack>
              <SkeletonCard />
              <SkeletonCard />
            </ListStack>
          )}
          {referrals?.length === 0 && (
            <div className="card">
              <EmptyState icon={Handshake} title="No referrals yet" />
            </div>
          )}
          {referrals && referrals.length > 0 && (
            <ListStack>
              {referrals.map((r) => (
                <ListCard
                  key={r.id}
                  icon={Handshake}
                  title={r.job.title}
                  caption={`Base ₹${r.baseAmount} · ${r.commissionRate}% → commission ₹${r.commissionAmount}`}
                  badge={<span className={STATUS_BADGE[r.status] ?? "badge-pending"}>{r.status.replace("_", " ")}</span>}
                />
              ))}
            </ListStack>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total referrals" value={referrals?.length ?? "-"} icon={Handshake} accent="primary" />
          <StatCard
            label="Hired"
            value={referrals?.filter((r) => r.status === "HIRED").length ?? "-"}
            icon={CheckCircle2}
            accent="green"
          />
        </div>
        <InfoPanel
          icon={Handshake}
          title="How referrals work"
          items={[
            "A referral starts as REFERRED once you submit a candidate for a job.",
            "Status moves to HIRED when the employer hires your candidate.",
            "Commission is calculated from the base amount and your commission rate.",
            "An admin approves the commission before it's marked PAID.",
          ]}
        />
      </div>
    </div>
  );
}
