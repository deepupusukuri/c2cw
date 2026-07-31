import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "C2CW — Proof-Based Hiring for Students and Corporates",
  description:
    "C2CW connects students, colleges, and corporates around verified skills, real projects, and a corporate-readiness score employers can trust.",
};

const AUDIENCES = [
  { label: "Students", href: "/students", copy: "Build a profile employers verify, not just believe." },
  { label: "Colleges", href: "/colleges", copy: "Track placement outcomes across your student cohort." },
  { label: "Corporates", href: "/corporates", copy: "Hire from a pool of pre-verified, scored talent." },
  { label: "Hiring Partners", href: "/hiring-partners", copy: "Run bulk hiring pipelines with real analytics." },
  { label: "Placement Partners", href: "/placement-partners", copy: "Earn commission placing verified candidates." },
  { label: "Trainers", href: "/trainers", copy: "Run programs and evaluate real project work." },
];

export default function Home() {
  return (
    <PageShell>
      <div className="max-w-2xl">
        <span className="badge-sponsored mb-4">Proof-based hiring</span>
        <h1 className="font-heading text-3xl font-semibold leading-tight text-ink">
          From college project to corporate offer — with proof at every step.
        </h1>
        <p className="mt-4 text-lg text-ink-secondary">
          C2CW connects students, colleges, corporates, and trainers around verified skills,
          real projects, and a readiness score employers can actually trust.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/register" className="btn-primary">
            Build your profile
          </Link>
          <Link href="/jobs" className="btn-ghost">
            Browse jobs
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card">
          <h3 className="font-heading text-lg font-medium">Digital Profile</h3>
          <p className="mt-2 text-sm text-ink-secondary">
            Skills, projects, internships, and certifications rolled into one
            corporate-readiness score.
          </p>
        </div>
        <div className="card">
          <h3 className="font-heading text-lg font-medium">Verified Projects</h3>
          <p className="mt-2 text-sm text-ink-secondary">
            Academic, freelance, and internship work — reviewed and scored, not just claimed.
          </p>
        </div>
        <div className="card">
          <h3 className="font-heading text-lg font-medium">Direct Hiring</h3>
          <p className="mt-2 text-sm text-ink-secondary">
            Corporates and hiring partners filter candidates by real, verified readiness.
          </p>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="font-heading text-xl font-semibold">Built for every side of hiring</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <Link key={a.href} href={a.href} className="card block hover:shadow-sm">
              <h3 className="font-heading text-base font-medium">{a.label}</h3>
              <p className="mt-1 text-sm text-ink-secondary">{a.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Ready to build a readiness score that means something?"
        description="Register in under a minute and start adding verified skills and projects today."
      />
    </PageShell>
  );
}
