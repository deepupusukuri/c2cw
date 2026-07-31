import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { api, ApiError } from "@/lib/api";

interface Talk {
  id: string;
  title: string;
  slug: string;
  videoUrl: string | null;
  speaker: { id: string; name: string | null };
}

async function getTalk(slug: string): Promise<Talk | null> {
  try {
    return await api.get<Talk>(`/talks/${slug}`);
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
  const talk = await getTalk(params.slug);
  if (!talk) return { title: "Talk not found" };
  return {
    title: talk.title,
    description: `${talk.title} — a talk by ${talk.speaker?.name ?? "a C2CW speaker"} on C2CW.`.slice(0, 160),
  };
}

export default async function TalkDetailPage({ params }: { params: { slug: string } }) {
  const talk = await getTalk(params.slug);
  if (!talk) notFound();

  return (
    <PageShell>
      <h1 className="font-heading text-3xl font-semibold text-ink">{talk.title}</h1>
      <p className="mt-2 text-ink-secondary">by {talk.speaker?.name ?? "C2CW speaker"}</p>

      <div className="mt-8 max-w-3xl">
        {talk.videoUrl ? (
          <div className="aspect-video overflow-hidden rounded-card border border-border">
            <iframe
              src={talk.videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="card">
            <p className="text-sm text-ink-secondary">Video coming soon.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
