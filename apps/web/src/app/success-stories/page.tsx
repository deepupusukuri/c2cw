import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real outcomes from students who built a verified profile, completed programs, and got hired through C2CW.",
};

export default function SuccessStoriesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Success Stories"
        title="Outcomes, not anecdotes"
        description="As students complete programs, get evaluated on internships, and land offers through C2CW, their stories will be featured here — with the readiness score and project history behind them."
      />

      <section className="mt-10 card">
        <h2 className="font-heading text-lg font-medium">No stories published yet</h2>
        <p className="mt-2 text-sm text-ink-secondary">
          We publish success stories from real, verified outcomes on the platform — not written
          testimonials. Check back as the first cohorts complete their programs and get placed.
        </p>
      </section>

      <CtaBanner
        title="Be the first success story"
        description="Register, build your profile, and start applying — your outcome could be featured here."
      />
    </PageShell>
  );
}
