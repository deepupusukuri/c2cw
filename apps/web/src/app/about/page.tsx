import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "About C2CW",
  description:
    "C2CW is a talent ecosystem connecting students, colleges, and corporates around proof-based hiring — verified skills over self-reported claims.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title="Hiring built on proof, not resumes"
        description="C2CW — College to Corporate World — is a talent ecosystem connecting students, colleges, corporates, hiring partners, and trainers around one idea: a candidate's readiness should be verified, not self-reported."
      />

      <section className="mt-10 max-w-2xl space-y-6 text-ink-secondary">
        <div>
          <h2 className="font-heading text-lg font-medium text-ink">What we&apos;re building</h2>
          <p className="mt-2 text-sm">
            Every student&apos;s Digital Profile is built from real, reviewed work — projects that get
            approved and scored, internships that get evaluated, programs that get completed. That
            feeds a single corporate-readiness score that hiring partners and corporates can
            actually filter and trust.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-lg font-medium text-ink">Who it&apos;s for</h2>
          <p className="mt-2 text-sm">
            Students building a career, colleges tracking placement outcomes, corporates and hiring
            partners looking for verified talent, trainers running programs, and placement partners
            and sponsors backing the ecosystem.
          </p>
        </div>
      </section>

      <CtaBanner title="See it for yourself" description="Register an account — it takes under a minute." />
    </PageShell>
  );
}
