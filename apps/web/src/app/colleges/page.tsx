import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "For Colleges — Track Verified Placement Outcomes",
  description:
    "Give your students a corporate-readiness score employers trust, and get visibility into program enrollment and placement outcomes.",
};

export default function CollegesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="For Colleges"
        title="Placement outcomes you can actually see"
        description="Enroll your students in career-path and core programs, and track enrollment status, project approvals, and readiness scores in one place."
      />

      <BenefitsGrid
        heading="What colleges get"
        items={[
          {
            title: "Program Enrollment",
            description: "Enroll cohorts into career-path or core programs and track status per student.",
          },
          {
            title: "Verified Outcomes",
            description:
              "Projects and internships are admin/trainer-reviewed, not self-reported — outcomes hold up.",
          },
          {
            title: "Direct Hiring Access",
            description: "Your students apply straight into hiring-partner pipelines with real readiness scores.",
          },
          {
            title: "Trainer Coordination",
            description: "Trainers evaluate program work and internships without leaving the platform.",
          },
        ]}
      />

      <CtaBanner
        title="Bring your college onto C2CW"
        description="Register your college account to start enrolling students in programs."
      />
    </PageShell>
  );
}
