"use client";

import { ReactNode } from "react";
import { LayoutDashboard, GraduationCap } from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/college/overview", icon: LayoutDashboard },
  { label: "Programs", href: "/dashboard/college/programs", icon: GraduationCap },
];

export default function CollegeLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.COLLEGE);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="College Dashboard">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="College Dashboard">
      {children}
    </DashboardShell>
  );
}
