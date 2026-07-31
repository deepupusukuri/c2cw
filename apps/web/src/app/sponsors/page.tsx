import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { SponsorPledgeForm } from "@/components/SponsorPledgeForm";

export const metadata: Metadata = {
  title: "Sponsors — Back Verified Student Talent",
  description:
    "Sponsor programs, workshops, or the C2CW Marathon and get visibility with a pipeline of verified, readiness-scored student talent.",
};

export default function SponsorsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Sponsors"
        title="Back the pipeline, not just an event"
        description="Sponsors fund programs, workshops, and the C2CW Marathon — and get direct visibility with students building verified, employer-trusted profiles."
      />

      <BenefitsGrid
        heading="Why sponsor C2CW"
        items={[
          {
            title: "Brand Visibility",
            description: "Your brand shown across sponsored programs, workshops, or marathon events.",
          },
          {
            title: "Talent Pipeline",
            description: "Early visibility into students building verified skills relevant to your industry.",
          },
          {
            title: "Flexible Tiers",
            description: "Sponsor a single workshop, a full program, or the annual Marathon.",
          },
        ]}
      />

      <section className="mt-10">
        <SponsorPledgeForm />
      </section>
    </PageShell>
  );
}
