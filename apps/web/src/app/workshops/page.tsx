import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Workshops — Short-Form, Skill-Focused Sessions",
  description:
    "Short-form, cohort-based workshops on C2CW that plug directly into your Student Digital Profile and readiness score.",
};

export default function WorkshopsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Workshops"
        title="Short-form sessions that still count"
        description="Workshops are focused, cohort-based sessions — shorter than a full program, but built to slot into the same profile and readiness score as everything else on C2CW."
      />

      <BenefitsGrid
        heading="Why workshops"
        items={[
          {
            title: "Focused Format",
            description: "A single skill or tool, taught in a short, cohort-based session.",
          },
          {
            title: "Trainer-Led",
            description: "Run by the same trainers who evaluate programs and internships on C2CW.",
          },
          {
            title: "Profile-Linked",
            description: "Completion shows up on your Student Digital Profile alongside programs and projects.",
          },
        ]}
      />

      <div className="mt-6 card">
        <p className="text-sm text-ink-secondary">
          Workshop scheduling is being finalized — in the meantime, browse our full{" "}
          <Link href="/programs" className="text-primary">
            Programs
          </Link>{" "}
          for structured, enrollable tracks.
        </p>
      </div>

      <CtaBanner
        title="Get notified when workshops open"
        description="Register now so your profile is ready the moment workshops go live."
      />
    </PageShell>
  );
}
