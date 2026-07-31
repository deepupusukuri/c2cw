"use client";

import { ReactNode } from "react";
import { LayoutDashboard, Handshake } from "lucide-react";
import { Role } from "@c2cw/types";
import { DashboardShell } from "@/components/DashboardShell";
import { useRequireRole } from "@/lib/use-require-role";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/placement-partner/overview", icon: LayoutDashboard },
  { label: "Referrals", href: "/dashboard/placement-partner/referrals", icon: Handshake },
];

export default function PlacementPartnerLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(Role.PLACEMENT_PARTNER);

  if (!ready) {
    return (
      <DashboardShell navItems={NAV_ITEMS} title="Placement Partner">
        <p className="text-center text-ink-secondary">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} title="Placement Partner">
      {children}
    </DashboardShell>
  );
}
