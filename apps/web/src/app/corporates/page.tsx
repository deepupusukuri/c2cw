import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "For Corporates — Hire Pre-Verified, Scored Talent",
  description:
    "Post jobs and internships on C2CW and filter candidates by required skills and a corporate-readiness score built from verified work.",
};

export default function CorporatesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="For Corporates"
        title="Hire from a pool of pre-verified talent"
        description="Every candidate's readiness score is built from admin-reviewed projects, completed programs, and internship evaluations — not a self-written resume."
      />

      <BenefitsGrid
        heading="What corporates get"
        items={[
          {
            title: "Job Marketplace",
            description: "Post roles, filter applicants by skill and minimum readiness score.",
          },
          {
            title: "Pipeline Tracking",
            description: "Move applicants through Applied → Screening → Interview → Offer → Hired.",
          },
          {
            title: "Internship Programs",
            description: "Post internships, assign mentors, and evaluate students with a real score.",
          },
          {
            title: "Freelance Talent",
            description: "Post freelance work and get matched to a pre-vetted student, no open bidding.",
          },
        ]}
      />

      <CtaBanner
        title="Post your first role on C2CW"
        description="Register a corporate account to start posting jobs and internships."
      />
    </PageShell>
  );
}
