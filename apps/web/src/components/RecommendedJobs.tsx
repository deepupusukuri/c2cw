"use client";

import { useEffect, useState } from "react";
import { Wand2, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface RecommendationItem {
  id: string;
  score: number;
  reason: string;
  data: { id: string; title: string; requiredSkills: string[] };
}

export function RecommendedJobs({ onApply }: { onApply: (jobId: string) => void }) {
  const [items, setItems] = useState<RecommendationItem[] | null>(null);

  useEffect(() => {
    api
      .get<RecommendationItem[]>("/recommendations/jobs")
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-medium">Recommended for you</h2>
        <p className="mt-1 text-xs text-ink-secondary">
          Ranked by skill overlap with your profile — a rule-based placeholder for a future
          ML-based recommender (see README).
        </p>
      </div>
      {items === null && (
        <ListStack>
          <SkeletonCard />
          <SkeletonCard />
        </ListStack>
      )}
      {items?.length === 0 && (
        <div className="card">
          <EmptyState
            icon={Wand2}
            title="No recommendations yet"
            description="Add a few skills to your profile and matched jobs will show up here."
          />
        </div>
      )}
      {items && items.length > 0 && (
        <ListStack>
          {items.map((r) => (
            <ListCard
              key={r.id}
              icon={Briefcase}
              title={r.data.title}
              caption={r.reason}
              actions={
                <button onClick={() => onApply(r.id)} className="btn-ghost text-xs">
                  Apply
                </button>
              }
            />
          ))}
        </ListStack>
      )}
    </div>
  );
}
