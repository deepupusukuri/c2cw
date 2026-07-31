"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, BarChart3, FileText, Award } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { staggerChildren, slideUp } from "@/lib/motion";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";

interface HiringPartner {
  id: string;
  companyName: string;
  tier: string;
}

interface Analytics {
  totalJobs: number;
  totalApplications: number;
  hired: number;
}

const QUICK_LINKS = [
  {
    label: "Post & manage jobs",
    description: "Bulk-request roles, track your pipeline, and see recommended candidates.",
    href: "/dashboard/hiring-partner/jobs",
    icon: Briefcase,
  },
  {
    label: "Post internships",
    description: "Submit internships and review applicants.",
    href: "/dashboard/hiring-partner/internships",
    icon: GraduationCap,
  },
  {
    label: "View analytics",
    description: "Track job postings, applications, and hires.",
    href: "/dashboard/hiring-partner/analytics",
    icon: BarChart3,
  },
];

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [tier, setTier] = useState("standard");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/hiring-partners/register", { companyName, tier });
      toast("Registered as a hiring partner");
      onRegistered();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't register", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-lg font-medium">Register as a hiring partner</h2>
      <div>
        <label className="text-sm text-ink-secondary">Company name</label>
        <input
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Tier</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="input-field mt-1">
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
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
        icon={Award}
        title="What you get as a Hiring Partner"
        items={[
          "Post unlimited jobs, or bulk-request several roles at once.",
          "Track every applicant through a visual pipeline, from applied to hired.",
          "See algorithm-recommended candidates matched to each posting.",
          "Get analytics on job postings, applications, and hire rate.",
          "Post internships and review applicants right from your dashboard.",
        ]}
      />
    </div>
  );
}

export default function HiringPartnerOverviewPage() {
  const { toast } = useToast();
  const [partner, setPartner] = useState<HiringPartner | null | undefined>(undefined);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const refresh = useCallback(async () => {
    try {
      const p = await api.get<HiringPartner>("/hiring-partners/me");
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
      .get<Analytics>("/hiring-partners/analytics")
      .then(setAnalytics)
      .catch((err) => toast(err instanceof ApiError ? err.message : "Couldn't load analytics", "error"));
  }, [partner, toast]);

  if (partner === undefined) {
    return <SkeletonCard />;
  }

  if (!partner) {
    return <RegisterGate onRegistered={refresh} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold">{partner.companyName}</h2>
        <p className="text-sm text-ink-secondary capitalize">{partner.tier} tier</p>
      </div>

      <StatGrid columns={3}>
        <StatCard
          label="Jobs posted"
          value={analytics ? analytics.totalJobs : "-"}
          icon={Briefcase}
          accent="primary"
        />
        <StatCard
          label="Applications"
          value={analytics ? analytics.totalApplications : "-"}
          icon={FileText}
          accent="green"
        />
        <StatCard label="Hired" value={analytics ? analytics.hired : "-"} icon={Award} accent="purple" />
      </StatGrid>

      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {QUICK_LINKS.map((link) => (
          <motion.a
            key={link.href}
            href={link.href}
            variants={slideUp}
            className="card block transition-shadow hover:shadow-elevated"
          >
            <link.icon size={20} className="text-primary" />
            <p className="mt-3 text-sm font-medium">{link.label}</p>
            <p className="mt-1 text-xs text-ink-secondary">{link.description}</p>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
