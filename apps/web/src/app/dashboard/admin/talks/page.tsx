"use client";

import { useCallback, useEffect, useState } from "react";
import { Mic, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface TalkRow {
  id: string;
  title: string;
  status: string;
  speaker: { name: string | null; email: string };
}

export default function AdminTalksPage() {
  const { toast } = useToast();
  const [talks, setTalks] = useState<TalkRow[] | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    const all = await api.get<TalkRow[]>("/talks/admin/all");
    setTalks(all.filter((t) => t.status === "APPLIED" || t.status === "APPROVED"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function approve(id: string) {
    try {
      await api.patch(`/talks/${id}/approve`);
      toast("Talk approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve talk", "error");
    }
  }
  async function reject(id: string) {
    try {
      await api.patch(`/talks/${id}/reject`);
      toast("Talk rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject talk", "error");
    }
  }
  async function publish(id: string) {
    const videoUrl = videoUrlInput[id];
    if (!videoUrl) {
      toast("Add a video URL first", "error");
      return;
    }
    try {
      await api.patch(`/talks/${id}/publish`, { videoUrl });
      toast("Talk published");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't publish talk", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg font-medium">Talk applications</h2>
        {talks === null && (
          <ListStack>
            <SkeletonCard />
            <SkeletonCard />
          </ListStack>
        )}
        {talks?.length === 0 && (
          <div className="card">
            <EmptyState
              icon={Mic}
              title="No talk applications pending"
              description="Speaker applications awaiting review or publish show up here."
            />
          </div>
        )}
        {talks && talks.length > 0 && (
          <ListStack>
            {talks.map((t) => (
              <ListCard
                key={t.id}
                icon={Mic}
                title={t.title}
                caption={`${t.speaker.name ?? t.speaker.email} · ${t.status}`}
                actions={
                  <>
                    {t.status === "APPLIED" && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => approve(t.id)} className="btn-ghost text-xs">
                          Approve
                        </button>
                        <button onClick={() => reject(t.id)} className="btn-ghost text-xs">
                          Reject
                        </button>
                      </div>
                    )}
                    {t.status === "APPROVED" && (
                      <div className="flex items-center gap-2">
                        <input
                          placeholder="Video URL"
                          value={videoUrlInput[t.id] ?? ""}
                          onChange={(e) => setVideoUrlInput((s) => ({ ...s, [t.id]: e.target.value }))}
                          className="input-field w-48 text-xs"
                        />
                        <button onClick={() => publish(t.id)} className="btn-ghost text-xs">
                          Publish
                        </button>
                      </div>
                    )}
                  </>
                }
              />
            ))}
          </ListStack>
        )}
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Awaiting review"
            value={talks === null ? "-" : talks.filter((t) => t.status === "APPLIED").length}
            icon={Mic}
            accent="orange"
          />
          <StatCard
            label="Approved"
            value={talks === null ? "-" : talks.filter((t) => t.status === "APPROVED").length}
            icon={CheckCircle2}
            accent="green"
          />
        </div>
        <InfoPanel
          icon={Mic}
          title="Talk pipeline"
          items={[
            "Approve moves an application forward; reject removes it from the queue.",
            "Approved talks need a video URL before you can publish them.",
            "Publishing makes the talk visible to students on the platform.",
            "Speakers are notified automatically when their status changes.",
          ]}
        />
      </div>
    </div>
  );
}
