"use client";

import { ReactNode } from "react";
import { LayoutDashboard, Briefcase, GraduationCap, Wallet } from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/corporate/overview", icon: LayoutDashboard },
  { label: "Jobs", href: "/dashboard/corporate/jobs", icon: Briefcase },
  { label: "Internships", href: "/dashboard/corporate/internships", icon: GraduationCap },
  { label: "Freelance", href: "/dashboard/corporate/freelance", icon: Wallet },
];

export default function CorporateLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.CORPORATE);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="Corporate Dashboard">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Corporate Dashboard">
      {children}
    </DashboardShell>
  );
}
