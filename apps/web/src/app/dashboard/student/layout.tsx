"use client";

import { ReactNode } from "react";
import { LayoutDashboard, Sparkles, Wand2, GraduationCap, Briefcase } from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/student/overview", icon: LayoutDashboard },
  { label: "Skills", href: "/dashboard/student/skills", icon: Sparkles },
  { label: "Recommended", href: "/dashboard/student/recommended", icon: Wand2 },
  { label: "Programs", href: "/dashboard/student/programs", icon: GraduationCap },
  { label: "Jobs", href: "/dashboard/student/jobs", icon: Briefcase },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.STUDENT);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="Student Dashboard">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Student Dashboard">
      {children}
    </DashboardShell>
  );
}
