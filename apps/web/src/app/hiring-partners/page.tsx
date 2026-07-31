import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Hiring Partners — Run Bulk Hiring Pipelines",
  description:
    "Hiring partners on C2CW post bulk job requests, manage full pipelines, and view analytics across every role they run.",
};

export default function HiringPartnersPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Hiring Partners"
        title="Bulk hiring, run through one pipeline"
        description="Submit a bulk hiring request across multiple roles at once, then manage every applicant's pipeline stage and view hiring analytics from a single dashboard."
      />

      <BenefitsGrid
        heading="What hiring partners get"
        items={[
          {
            title: "Bulk Requests",
            description: "Submit multiple job openings in a single request instead of posting one by one.",
          },
          {
            title: "Pipeline View",
            description: "See every applicant across every role, grouped by pipeline stage.",
          },
          {
            title: "Analytics",
            description: "Track total jobs posted, applications received, and hires made.",
          },
          {
            title: "Readiness Filtering",
            description: "Filter by required skills and minimum corporate-readiness score.",
          },
        ]}
      />

      <CtaBanner
        title="Become a hiring partner"
        description="Register a Hiring Partner account to submit your first bulk request."
      />
    </PageShell>
  );
}
