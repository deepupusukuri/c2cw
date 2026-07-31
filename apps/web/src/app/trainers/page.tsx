import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "For Trainers — Run Programs, Evaluate Real Work",
  description:
    "Trainers on C2CW run programs, review and score student projects, and evaluate internships — all feeding directly into student readiness scores.",
};

export default function TrainersPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="For Trainers"
        title="Evaluate real work, not just attendance"
        description="Review project submissions, score internship evaluations, and chat directly with the students you're training — all inside one dashboard."
      />

      <BenefitsGrid
        heading="What trainers do"
        items={[
          {
            title: "Review Projects",
            description: "Approve, reject, or score academic and freelance project submissions.",
          },
          {
            title: "Evaluate Internships",
            description: "Score internship performance, feeding directly into the student's readiness score.",
          },
          {
            title: "Direct Chat",
            description: "Message students directly for feedback, with file sharing and full history.",
          },
          {
            title: "Manage Enrollments",
            description: "Update enrollment status for students in your programs.",
          },
        ]}
      />

      <CtaBanner
        title="Start training on C2CW"
        description="Register a Trainer account to get access to your review queue."
      />
    </PageShell>
  );
}
