"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { staggerChildren, slideUp } from "@/lib/motion";
import { SkeletonStatCard } from "@/components/ui/Skeleton";
import { InfoPanel } from "@/components/ui/InfoPanel";

interface Analytics {
  totalJobs: number;
  totalApplications: number;
  hired: number;
}

export default function HiringPartnerAnalyticsPage() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    api
      .get<Analytics>("/hiring-partners/analytics")
      .then(setAnalytics)
      .catch((err) => toast(err instanceof ApiError ? err.message : "Couldn't load analytics", "error"));
  }, [toast]);

  if (analytics === null) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    );
  }

  const cards = [
    { label: "Jobs posted", value: analytics.totalJobs },
    { label: "Total applications", value: analytics.totalApplications },
    { label: "Hires", value: analytics.hired },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold">Analytics</h2>
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {cards.map((c) => (
          <motion.div key={c.label} variants={slideUp} className="card">
            <p className="text-3xl font-semibold">{c.value}</p>
            <p className="mt-1 text-xs text-ink-secondary">{c.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h3 className="font-heading text-base font-medium">How these numbers are calculated</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            <strong className="text-ink">Jobs posted</strong> counts every role you&apos;ve created,
            whether posted directly or through a bulk request.{" "}
            <strong className="text-ink">Total applications</strong> is the sum of student applications
            received across all of your postings.{" "}
            <strong className="text-ink">Hires</strong> counts applicants whose pipeline stage has
            reached &quot;Hired&quot; on any of your jobs. All three figures update in real time as candidates
            apply and move through your pipeline.
          </p>
        </div>
        <InfoPanel
          icon={TrendingUp}
          title="Improving these metrics"
          items={[
            "Broaden your required skills list to raise total applications from a wider candidate pool.",
            "Respond to applicants promptly — faster pipeline movement improves your hire rate.",
            "Set a realistic minimum readiness score so strong candidates aren't filtered out.",
            "Keep postings up to date; stale listings attract fewer qualified applicants.",
          ]}
        />
      </div>
    </div>
  );
}
