import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Programs — Career Paths & Core Programs",
  description:
    "Browse C2CW's career-path and core programs — structured tracks that turn skills into verified, employer-trusted proof of readiness.",
};

interface Program {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
}

async function getPrograms(): Promise<Program[]> {
  try {
    return await api.get<Program[]>("/programs");
  } catch {
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Programs"
        title="Career Paths & Core Programs"
        description="Structured tracks — from foundational skill-building to full career paths — each feeding directly into your corporate-readiness score."
      />

      <section className="mt-10">
        <h2 className="sr-only">All programs</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.length === 0 && (
            <p className="text-sm text-ink-secondary">No programs published yet — check back soon.</p>
          )}
          {programs.map((p) => (
            <Link key={p.id} href={`/programs/${p.slug}`} className="card block hover:shadow-sm">
              <span className="badge-sponsored">{p.type.replace("_", " ")}</span>
              <h3 className="mt-2 font-heading text-lg font-medium">{p.name}</h3>
              {p.description && (
                <p className="mt-2 text-sm text-ink-secondary line-clamp-3">{p.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Find the right program for your career path"
        description="Register as a student to enroll and start tracking your readiness score."
      />
    </PageShell>
  );
}
