"use client";

import { useEffect, useState } from "react";
import { Briefcase, GraduationCap, Wallet, Clock3 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { InfoPanel, ActivityList } from "@/components/ui/InfoPanel";

interface JobRow {
  id: string;
  title: string;
  status: string;
  postedById: string;
  createdAt: string;
}
interface InternshipRow {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}
interface FreelanceRow {
  id: string;
  title: string;
  status: string;
  clientId: string;
  createdAt: string;
}

export default function CorporateOverviewPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [internships, setInternships] = useState<InternshipRow[]>([]);
  const [freelance, setFreelance] = useState<FreelanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<JobRow[]>("/jobs"),
      api.get<InternshipRow[]>("/internships/mine").catch(() => []),
      api.get<FreelanceRow[]>("/freelance").catch(() => []),
    ]).then(([allJobs, myInternships, allFreelance]) => {
      setJobs(allJobs.filter((j) => j.postedById === user.id));
      setInternships(myInternships);
      setFreelance(allFreelance.filter((f) => f.clientId === user.id));
      setLoading(false);
    });
  }, [user]);

  const pendingApprovals =
    internships.filter((i) => i.status === "PENDING_APPROVAL").length +
    freelance.filter((f) => f.status === "PENDING_APPROVAL").length;

  const recentActivity = [...jobs, ...internships, ...freelance]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      label: item.title,
      meta:
        "postedById" in item
          ? "Job posting"
          : "clientId" in item
            ? "Freelance project"
            : "Internship",
      badge: item.status.replace("_", " "),
    }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Welcome back, {user?.name}</h2>
        <p className="text-sm text-ink-secondary">
          Post roles, manage your pipeline, and find matched candidates.
        </p>
      </div>

      <StatGrid>
        <StatCard label="Jobs posted" value={loading ? "-" : jobs.length} icon={Briefcase} accent="primary" />
        <StatCard
          label="Internships posted"
          value={loading ? "-" : internships.length}
          icon={GraduationCap}
          accent="green"
        />
        <StatCard
          label="Freelance projects"
          value={loading ? "-" : freelance.length}
          icon={Wallet}
          accent="purple"
        />
        <StatCard
          label="Awaiting admin approval"
          value={loading ? "-" : pendingApprovals}
          icon={Clock3}
          accent="orange"
        />
      </StatGrid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityList
            icon={Briefcase}
            title="Recent activity"
            items={recentActivity}
            emptyText="Nothing posted yet — start with a job, internship, or freelance project from the sidebar."
          />
        </div>
        <InfoPanel
          icon={Briefcase}
          title="Getting the most from C2CW"
          items={[
            "Set a realistic minimum readiness score to see better-matched candidates first.",
            "Internships and freelance projects go live once an admin approves them — usually within a business day.",
            "Use the pipeline stages on each job to track candidates from applied through hired.",
            "Freelance projects need a student assigned by admin after approval — check back on the Freelance tab.",
          ]}
        />
      </div>
    </div>
  );
}
