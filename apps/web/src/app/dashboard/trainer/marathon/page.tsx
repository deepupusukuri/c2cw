"use client";

import { useCallback, useEffect, useState } from "react";
import { Trophy, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonRow, SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface MarathonEvent {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface Participant {
  id: string;
  status: string;
  project: { id: string; title: string } | null;
  student: { id: string; name: string | null; email: string } | null;
}

const STATUS_BADGE: Record<string, string> = {
  REGISTERED: "badge-pending",
  SUBMITTED: "badge-sponsored",
  SCORED: "badge-verified",
};

function EventCard({ event }: { event: MarathonEvent }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [participants, setParticipants] = useState<Participant[] | null>(null);

  async function loadParticipants() {
    try {
      const rows = await api.get<Participant[]>(`/marathon/events/${event.id}/participants`);
      setParticipants(rows);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load participants", "error");
    }
  }

  async function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && participants === null) await loadParticipants();
  }

  async function markScored(participantId: string) {
    try {
      await api.patch(`/marathon/participants/${participantId}/score`, {});
      toast("Marked as scored");
      loadParticipants();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't update participant", "error");
    }
  }

  return (
    <ListCard
      icon={Trophy}
      accent={event.status === "OPEN" ? "green" : "primary"}
      title={event.title}
      badge={<span className={event.status === "OPEN" ? "badge-verified" : "badge-pending"}>{event.status}</span>}
      actions={
        <button onClick={toggle} className="btn-ghost text-xs">
          {expanded ? "Hide participants" : "View participants"}
        </button>
      }
    >
      {expanded && (
        <div className="mt-3 rounded-btn bg-surface-muted p-3">
          {participants === null && <SkeletonRow />}
          {participants?.length === 0 && <p className="text-xs text-ink-secondary">No participants yet.</p>}
          {participants?.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-1.5">
              <div>
                <span className="text-xs font-medium">{p.student?.name ?? p.student?.email ?? "Unknown"}</span>
                {p.project && <span className="ml-2 text-xs text-ink-secondary">{p.project.title}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={STATUS_BADGE[p.status] ?? "badge-pending"}>{p.status}</span>
                {p.status === "SUBMITTED" && (
                  <button onClick={() => markScored(p.id)} className="btn-ghost text-xs">
                    Mark scored
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ListCard>
  );
}

export default function TrainerMarathonPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<MarathonEvent[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      setEvents(await api.get<MarathonEvent[]>("/marathon/admin/events"));
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load marathon events", "error");
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openCount = events?.filter((e) => e.status === "OPEN").length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Marathon scoring</h2>
        {events === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {events?.length === 0 && (
          <div className="card">
            <EmptyState icon={Trophy} title="No marathon events yet" />
          </div>
        )}
        {events && events.length > 0 && (
          <ListStack>
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total events" value={events?.length ?? "-"} icon={Trophy} accent="primary" />
          <StatCard label="Open events" value={openCount} icon={CheckCircle2} accent="green" />
        </div>
        <InfoPanel
          icon={Trophy}
          title="Marathon lifecycle"
          items={[
            "Events move through DRAFT → OPEN → CLOSED as they progress.",
            "Participants submit their work, then move to SUBMITTED status.",
            "Mark a participant scored once you've reviewed their submission.",
            "Only events that are OPEN accept new participant submissions.",
          ]}
        />
      </div>
    </div>
  );
}
