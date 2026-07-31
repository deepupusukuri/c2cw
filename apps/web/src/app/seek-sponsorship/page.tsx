import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { SeekSponsorshipForm } from "@/components/SeekSponsorshipForm";

export const metadata: Metadata = {
  title: "Seek Sponsorship — Fund Your Program or Cohort",
  description:
    "Colleges and trainers running a program or event on C2CW can request sponsorship support to cover costs and reach more students.",
};

export default function SeekSponsorshipPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Seek Sponsorship"
        title="Running a program? Get it sponsored"
        description="If you're a college, trainer, or organizer running a program, workshop, or event through C2CW, you can request sponsorship support to help fund it."
      />

      <BenefitsGrid
        heading="How it works"
        items={[
          {
            title: "Submit a Request",
            description: "Tell us about your program or event and what sponsorship would cover.",
          },
          {
            title: "Get Matched",
            description: "We connect eligible requests with sponsors looking to support that audience.",
          },
          {
            title: "Run With Support",
            description: "Sponsored programs get visibility and funding to reach more students.",
          },
        ]}
      />

      <section className="mt-10">
        <SeekSponsorshipForm />
      </section>
    </PageShell>
  );
}
