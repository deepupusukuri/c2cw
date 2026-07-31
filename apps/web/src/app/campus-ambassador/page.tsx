import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CampusAmbassadorApply } from "@/components/CampusAmbassadorApply";

export const metadata: Metadata = {
  title: "Campus Ambassador Program",
  description:
    "Represent C2CW on your campus, refer students, and grow your Influence Score into Bronze, Silver, Gold, or Influencer status.",
};

export default function CampusAmbassadorPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Campus Ambassador"
        title="Represent C2CW on your campus"
        description="Campus Ambassadors refer students to C2CW and build their Influence Score through the platform's points-based referral system — no cash, all reputation."
      />

      <BenefitsGrid
        heading="How it works"
        items={[
          {
            title: "Refer Students",
            description: "Share your referral link — every student who signs up earns you points.",
          },
          {
            title: "Build Influence",
            description: "Your Influence Score grows with every successful referral.",
          },
          {
            title: "Earn Badges",
            description: "Climb from Bronze to Silver, Gold, and Influencer status as your score grows.",
          },
        ]}
      />

      <section className="mt-10">
        <CampusAmbassadorApply />
      </section>
    </PageShell>
  );
}
