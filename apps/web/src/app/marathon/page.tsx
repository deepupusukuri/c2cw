import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CtaBanner } from "@/components/CtaBanner";
import { MarathonRegisterButton } from "@/components/MarathonRegisterButton";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Marathon — A Timed, Project-Based Challenge",
  description:
    "The C2CW Marathon is a timed, project-based challenge where student submissions are reviewed and scored just like any other project on the platform.",
};

interface MarathonEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  startAt: string;
  endAt: string;
  status: string;
}

async function getEvents(): Promise<MarathonEvent[]> {
  try {
    return await api.get<MarathonEvent[]>("/marathon/events");
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function MarathonPage() {
  const events = await getEvents();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Marathon"
        title="A timed challenge, a real project"
        description="The Marathon is a project-based challenge run over a fixed window. Submissions go through the same review and scoring pipeline as any other project — no separate leaderboard gimmicks."
      />

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Upcoming & past events</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 && (
            <p className="text-sm text-ink-secondary">No marathon events scheduled yet — check back soon.</p>
          )}
          {events.map((e) => (
            <div key={e.id} className="card flex flex-col justify-between">
              <div>
                <span className={e.status === "OPEN" ? "badge-verified" : "badge-pending"}>
                  {e.status}
                </span>
                <h3 className="mt-2 font-heading text-lg font-medium">{e.title}</h3>
                {e.description && <p className="mt-2 text-sm text-ink-secondary">{e.description}</p>}
                <p className="mt-3 text-xs text-ink-secondary">
                  {formatDate(e.startAt)} – {formatDate(e.endAt)}
                </p>
              </div>
              {e.status === "OPEN" && (
                <div className="mt-4 flex justify-end">
                  <MarathonRegisterButton eventId={e.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <BenefitsGrid
        heading="How the Marathon works"
        items={[
          {
            title: "Timed Window",
            description: "A fixed submission period, announced ahead of time.",
          },
          {
            title: "Real Review",
            description: "Submissions are reviewed and scored through the same Projects pipeline as any project.",
          },
          {
            title: "Counts Toward Readiness",
            description: "A scored Marathon project adds to your corporate-readiness score like any other.",
          },
        ]}
      />

      <CtaBanner
        title="Get ready for the next Marathon"
        description="Register now so your profile is set up before the next window opens."
      />
    </PageShell>
  );
}
