"use client";

import { Wand2 } from "lucide-react";
import { RecommendedJobs } from "@/components/RecommendedJobs";
import { useToast } from "@/lib/toast-context";
import { api, ApiError } from "@/lib/api";
import { InfoPanel } from "@/components/ui/InfoPanel";

export default function StudentRecommendedPage() {
  const { toast } = useToast();

  async function apply(jobId: string) {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      toast("Application submitted");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't apply", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <RecommendedJobs onApply={apply} />
      </div>
      <div className="space-y-6">
        <InfoPanel
          icon={Wand2}
          title="How this list is built"
          items={[
            "Recommendations are ranked by skill overlap with your profile — a rule-based placeholder for a future ML-based recommender.",
            "Add more skills on the Skills tab to surface stronger, more relevant matches.",
            "Applying here works exactly like applying from the Jobs tab.",
          ]}
        />
      </div>
    </div>
  );
}
