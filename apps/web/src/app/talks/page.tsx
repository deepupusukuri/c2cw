import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Talks — Industry Speakers on C2CW",
  description:
    "Watch published talks from industry speakers, admin-approved and linked directly to their C2CW profile.",
};

interface Talk {
  id: string;
  title: string;
  slug: string;
  videoUrl: string | null;
  speaker: { name: string | null };
}

async function getTalks(): Promise<Talk[]> {
  try {
    return await api.get<Talk[]>("/talks");
  } catch {
    return [];
  }
}

export default async function TalksPage() {
  const talks = await getTalks();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Talks"
        title="Talks from industry speakers"
        description="Speakers apply, admins approve, and published talks link straight back to the speaker's C2CW profile."
      />

      <section className="mt-10">
        <h2 className="sr-only">Published talks</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {talks.length === 0 && (
            <p className="text-sm text-ink-secondary">No talks published yet — check back soon.</p>
          )}
          {talks.map((t) => (
            <Link key={t.id} href={`/talks/${t.slug}`} className="card block hover:shadow-sm">
              <h3 className="font-heading text-lg font-medium">{t.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{t.speaker?.name ?? "C2CW speaker"}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Want to speak at C2CW?"
        description="Apply as a speaker — approved talks are published and linked to your profile."
        ctaLabel="Apply to speak"
        ctaHref="/register"
      />
    </PageShell>
  );
}
