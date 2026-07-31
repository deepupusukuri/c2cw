import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Placement Partners — Earn Commission Placing Verified Talent",
  description:
    "Placement partners help match C2CW's verified, readiness-scored students into corporate roles and earn commission on successful placements.",
};

export default function PlacementPartnersPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Placement Partners"
        title="Place verified talent, earn on every placement"
        description="Placement partners connect C2CW's readiness-scored students with corporate openings and earn commission when a placement is confirmed."
      />

      <BenefitsGrid
        heading="How it works"
        items={[
          {
            title: "Verified Candidate Pool",
            description: "Work from a pool of students whose readiness scores are already backed by reviewed work.",
          },
          {
            title: "Commission on Placement",
            description: "Earn commission when a candidate you place is confirmed hired.",
          },
          {
            title: "Full Visibility",
            description: "Track every candidate you've referred through the hiring pipeline.",
          },
        ]}
      />

      <div className="mt-6 card">
        <p className="text-sm text-ink-secondary">
          Full commission tracking and payout logic is on our near-term roadmap. Reach out via the{" "}
          <a href="/contact" className="text-primary">
            contact page
          </a>{" "}
          to get set up early.
        </p>
      </div>

      <CtaBanner
        title="Become a placement partner"
        description="Register your account and we'll follow up on onboarding."
      />
    </PageShell>
  );
}
