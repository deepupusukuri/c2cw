"use client";

import { useCallback, useEffect, useState } from "react";
import { Trophy, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
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

export default function AdminMarathonPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<MarathonEvent[] | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setEvents(await api.get<MarathonEvent[]>("/marathon/admin/events"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/marathon/events", {
        title,
        slug,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
      });
      toast("Marathon event created as draft");
      setTitle("");
      setSlug("");
      setStartAt("");
      setEndAt("");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't create event", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function publish(id: string) {
    try {
      await api.patch(`/marathon/events/${id}/publish`);
      toast("Event published");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't publish event", "error");
    }
  }
  async function close(id: string) {
    try {
      await api.patch(`/marathon/events/${id}/close`);
      toast("Event closed");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't close event", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <form onSubmit={createEvent} className="card grid grid-cols-1 gap-3 sm:grid-cols-5">
          <h2 className="font-heading text-lg font-medium sm:col-span-5">Marathon events</h2>
          <input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field sm:col-span-2"
          />
          <input
            required
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="input-field"
          />
          <input
            required
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="input-field"
          />
          <input
            required
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="input-field"
          />
          <button type="submit" disabled={submitting} className="btn-primary sm:col-span-5">
            {submitting ? "Creating..." : "Create draft event"}
          </button>
        </form>

        <h2 className="font-heading text-lg font-medium">All events</h2>
        {events === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {events?.length === 0 && (
          <div className="card">
            <EmptyState icon={Trophy} title="No marathon events yet" description="Create one above to get started." />
          </div>
        )}
        {events && events.length > 0 && (
          <ListStack>
            {events.map((e) => (
              <ListCard
                key={e.id}
                icon={Trophy}
                accent={e.status === "OPEN" ? "green" : "primary"}
                title={e.title}
                badge={<span className={e.status === "OPEN" ? "badge-verified" : "badge-pending"}>{e.status}</span>}
                actions={
                  <div className="flex items-center gap-2">
                    {e.status !== "OPEN" && (
                      <button onClick={() => publish(e.id)} className="btn-ghost text-xs">
                        Publish
                      </button>
                    )}
                    {e.status === "OPEN" && (
                      <button onClick={() => close(e.id)} className="btn-ghost text-xs">
                        Close
                      </button>
                    )}
                  </div>
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total events" value={events === null ? "-" : events.length} icon={Trophy} accent="primary" />
          <StatCard
            label="Open now"
            value={events === null ? "-" : events.filter((e) => e.status === "OPEN").length}
            icon={CheckCircle2}
            accent="green"
          />
        </div>
        <InfoPanel
          icon={Trophy}
          title="Event lifecycle"
          items={[
            "New events start as drafts and aren't visible to students yet.",
            "Publish moves a draft to Open, making it visible and joinable.",
            "Closing an event ends submissions and locks in final standings.",
            "Slugs must be unique — they're used in the public event URL.",
          ]}
        />
      </div>
    </div>
  );
}
