import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { CtaBanner } from "@/components/CtaBanner";
import { api, ApiError } from "@/lib/api";

interface Program {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  configJson: Record<string, unknown>;
}

async function getProgram(slug: string): Promise<Program | null> {
  try {
    return await api.get<Program>(`/programs/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = await getProgram(params.slug);
  if (!program) return { title: "Program not found" };
  return {
    title: program.name,
    description: (program.description ?? `${program.name} — a C2CW ${program.type.replace("_", " ").toLowerCase()} program with a verified, employer-trusted readiness track.`).slice(0, 160),
  };
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = await getProgram(params.slug);
  if (!program) notFound();

  return (
    <PageShell>
      <span className="badge-sponsored mb-4">{program.type.replace("_", " ")}</span>
      <h1 className="font-heading text-3xl font-semibold text-ink">{program.name}</h1>
      {program.description && (
        <p className="mt-4 max-w-2xl text-lg text-ink-secondary">{program.description}</p>
      )}

      <section className="mt-10 card max-w-2xl">
        <h2 className="font-heading text-lg font-medium">What you get</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-secondary">
          <li>A structured curriculum feeding directly into your corporate-readiness score</li>
          <li>Projects reviewed and scored by admins/trainers, not just self-reported</li>
          <li>Enrollment tracked on your Student Digital Profile</li>
        </ul>
      </section>

      <CtaBanner
        title={`Enroll in ${program.name}`}
        description="Register as a student, then enroll directly from your dashboard."
      />
    </PageShell>
  );
}
