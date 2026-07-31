"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Clock3 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PostInternshipForm, InternshipsList, type InternshipRowData } from "@/components/InternshipsPanel";

export default function HiringPartnerInternshipsPage() {
  const { toast } = useToast();
  const [internships, setInternships] = useState<InternshipRowData[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      setInternships(await api.get<InternshipRowData[]>("/internships/mine"));
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Couldn't load internships", "error");
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (internships === null) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const pending = internships.filter((i) => i.status === "PENDING_APPROVAL").length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <PostInternshipForm onCreated={refresh} />
        <InternshipsList internships={internships} />
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Internships posted" value={internships.length} icon={Building2} accent="primary" />
          <StatCard label="Awaiting approval" value={pending} icon={Clock3} accent="orange" />
        </div>
        <InfoPanel
          icon={Building2}
          title="What happens after you submit"
          items={[
            "An admin reviews every new internship before it goes live to students.",
            "Approval usually takes under a business day — no action needed from you.",
            "Once open, view and select applicants right from this page.",
            "You can post as many internships as you need — each is reviewed independently.",
          ]}
        />
      </div>
    </div>
  );
}
