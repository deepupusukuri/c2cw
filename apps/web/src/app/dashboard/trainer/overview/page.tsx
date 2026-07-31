"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileCheck2, Building2, Trophy, GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { staggerChildren, slideUp } from "@/lib/motion";
import { StatCard, StatGrid } from "@/components/ui/StatCard";

const QUICK_LINKS = [
  {
    label: "Review projects",
    description: "Score and approve submitted student projects.",
    href: "/dashboard/trainer/projects",
    icon: FileCheck2,
  },
  {
    label: "Evaluate internships",
    description: "Score selected internship applicants.",
    href: "/dashboard/trainer/internships",
    icon: Building2,
  },
  {
    label: "Score marathon events",
    description: "Review submissions and mark participants scored.",
    href: "/dashboard/trainer/marathon",
    icon: Trophy,
  },
  {
    label: "Manage enrollments",
    description: "Update program enrollment status for students.",
    href: "/dashboard/trainer/enrollments",
    icon: GraduationCap,
  },
];

interface ProjectRow {
  id: string;
}
interface InternshipRow {
  id: string;
}
interface MarathonEvent {
  id: string;
}
interface Program {
  id: string;
}

export default function TrainerOverviewPage() {
  const { user } = useAuth();
  const [projectsAwaiting, setProjectsAwaiting] = useState(0);
  const [internshipsTotal, setInternshipsTotal] = useState(0);
  const [marathonTotal, setMarathonTotal] = useState(0);
  const [programsTotal, setProgramsTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<ProjectRow[]>("/projects?status=SUBMITTED").catch(() => []),
      api.get<InternshipRow[]>("/internships/admin/all").catch(() => []),
      api.get<MarathonEvent[]>("/marathon/admin/events").catch(() => []),
      api.get<Program[]>("/programs").catch(() => []),
    ]).then(([projects, internships, marathonEvents, programs]) => {
      setProjectsAwaiting(projects.length);
      setInternshipsTotal(internships.length);
      setMarathonTotal(marathonEvents.length);
      setProgramsTotal(programs.length);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Welcome back, {user?.name}</h2>
        <p className="text-sm text-ink-secondary">Review, evaluate, and score across every program.</p>
      </div>

      <StatGrid columns={4}>
        <StatCard
          label="Awaiting review"
          value={loading ? "-" : projectsAwaiting}
          icon={FileCheck2}
          accent="primary"
        />
        <StatCard label="Internships" value={loading ? "-" : internshipsTotal} icon={Building2} accent="green" />
        <StatCard label="Marathon events" value={loading ? "-" : marathonTotal} icon={Trophy} accent="orange" />
        <StatCard label="Programs" value={loading ? "-" : programsTotal} icon={GraduationCap} accent="purple" />
      </StatGrid>

      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
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
