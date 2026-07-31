"use client";

import { ReactNode } from "react";
import { LayoutDashboard, Briefcase, GraduationCap, BarChart3 } from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/hiring-partner/overview", icon: LayoutDashboard },
  { label: "Jobs", href: "/dashboard/hiring-partner/jobs", icon: Briefcase },
  { label: "Internships", href: "/dashboard/hiring-partner/internships", icon: GraduationCap },
  { label: "Analytics", href: "/dashboard/hiring-partner/analytics", icon: BarChart3 },
];

export default function HiringPartnerLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.HIRING_PARTNER);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="Hiring Partner Dashboard">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Hiring Partner Dashboard">
      {children}
    </DashboardShell>
  );
}
