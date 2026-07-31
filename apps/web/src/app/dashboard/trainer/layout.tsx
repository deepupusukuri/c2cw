"use client";

import { ReactNode } from "react";
import { LayoutDashboard, FileCheck2, Building2, Trophy, GraduationCap } from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/trainer/overview", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/trainer/projects", icon: FileCheck2 },
  { label: "Internships", href: "/dashboard/trainer/internships", icon: Building2 },
  { label: "Marathon", href: "/dashboard/trainer/marathon", icon: Trophy },
  { label: "Enrollments", href: "/dashboard/trainer/enrollments", icon: GraduationCap },
];

export default function TrainerLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.TRAINER);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="Trainer Dashboard">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Trainer Dashboard">
      {children}
    </DashboardShell>
  );
}
