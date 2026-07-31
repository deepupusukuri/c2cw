"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard,
  Heart,
  GraduationCap,
  Handshake,
  Trophy,
  FileCheck2,
  Building2,
  Briefcase,
  Wallet,
  Mic,
} from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/admin/overview", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/admin/projects", icon: FileCheck2 },
  { label: "Internships", href: "/dashboard/admin/internships", icon: Building2 },
  { label: "Freelance", href: "/dashboard/admin/freelance", icon: Briefcase },
  { label: "Withdrawals", href: "/dashboard/admin/withdrawals", icon: Wallet },
  { label: "Talks", href: "/dashboard/admin/talks", icon: Mic },
  { label: "Sponsorship", href: "/dashboard/admin/sponsorship", icon: Heart },
  { label: "Ambassadors", href: "/dashboard/admin/ambassadors", icon: GraduationCap },
  { label: "Referrals", href: "/dashboard/admin/referrals", icon: Handshake },
  { label: "Marathon", href: "/dashboard/admin/marathon", icon: Trophy },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.ADMIN);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="Admin">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Admin">
      {children}
    </DashboardShell>
  );
}
