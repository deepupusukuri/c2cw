import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "For Students — Build a Verified Digital Profile",
  description:
    "Turn skills, projects, and internships into a corporate-readiness score employers actually trust. Free student profile on C2CW.",
};

export default function StudentsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="For Students"
        title="A profile employers verify, not just believe"
        description="Skills, projects, internships, assessments, and certifications — all rolled into one corporate-readiness score, reviewed and scored by real people, not self-reported claims."
      />

      <BenefitsGrid
        heading="What you build here"
        items={[
          {
            title: "Digital Profile",
            description:
              "One place for skills, projects, internships, assessments, certifications, achievements, and a video profile.",
          },
          {
            title: "Corporate Readiness Score",
            description:
              "A weighted score computed from your approved projects, completed programs, and internship evaluations.",
          },
          {
            title: "Verified Projects",
            description:
              "Submit academic, freelance, or internship work for admin/trainer review and scoring.",
          },
          {
            title: "Direct Applications",
            description: "Apply to jobs and internships from hiring partners who filter by your real score.",
          },
          {
            title: "Freelance & Wallet",
            description:
              "Get matched to freelance projects and get paid by milestone straight into your C2CW wallet.",
          },
          {
            title: "Referrals & Influence",
            description: "Earn points and badges — Bronze to Influencer — for referring other students.",
          },
        ]}
      />

      <CtaBanner
        title="Start building your readiness score today"
        description="Registration takes under a minute — add your first skill right after."
      />
    </PageShell>
  );
}
