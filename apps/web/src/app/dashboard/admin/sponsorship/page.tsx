"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Handshake } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { ListCard, ListStack } from "@/components/ui/ListCard";

interface SponsorshipPledge {
  id: string;
  companyName: string;
  tier: string;
  amount: string;
  status: string;
  sponsor: { name: string | null; email: string };
  matchedRequestId: string | null;
}

interface SponsorshipRequest {
  id: string;
  title: string;
  amountRequested: string;
  status: string;
  requester: { name: string | null; email: string };
}

export default function AdminSponsorshipPage() {
  const { toast } = useToast();
  const [pledges, setPledges] = useState<SponsorshipPledge[] | null>(null);
  const [requests, setRequests] = useState<SponsorshipRequest[]>([]);
  const [matchChoice, setMatchChoice] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    const [p, r] = await Promise.all([
      api.get<SponsorshipPledge[]>("/sponsorship/pledges"),
      api.get<SponsorshipRequest[]>("/sponsorship/requests"),
    ]);
    setPledges(p);
    setRequests(r);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pendingPledges = pledges?.filter((p) => p.status === "PENDING") ?? null;
  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  async function approve(id: string) {
    try {
      await api.patch(`/sponsorship/pledges/${id}/approve`);
      toast("Pledge approved");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't approve pledge", "error");
    }
  }
  async function reject(id: string) {
    try {
      await api.patch(`/sponsorship/pledges/${id}/reject`);
      toast("Pledge rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject pledge", "error");
    }
  }
  async function rejectRequest(id: string) {
    try {
      await api.patch(`/sponsorship/requests/${id}/reject`);
      toast("Request rejected");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't reject request", "error");
    }
  }
  async function match(pledgeId: string) {
    const requestId = matchChoice[pledgeId];
    if (!requestId) {
      toast("Pick a request to match first", "error");
      return;
    }
    try {
      await api.patch(`/sponsorship/pledges/${pledgeId}/match`, { requestId });
      toast("Pledge matched to request");
      refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't match pledge", "error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-medium">Pending pledges</h2>
          {pendingPledges === null && (
            <ListStack>
              <SkeletonCard />
              <SkeletonCard />
            </ListStack>
          )}
          {pendingPledges?.length === 0 && (
            <div className="card">
              <EmptyState icon={Heart} title="No pledges pending" />
            </div>
          )}
          {pendingPledges && pendingPledges.length > 0 && (
            <ListStack>
              {pendingPledges.map((p) => (
                <ListCard
                  key={p.id}
                  icon={Heart}
                  accent="orange"
                  title={`${p.companyName} · ₹${p.amount} (${p.tier})`}
                  caption={p.sponsor.email}
                  actions={
                    <div className="flex items-center gap-2">
                      <select
                        className="input-field w-48 text-xs"
                        value={matchChoice[p.id] ?? ""}
                        onChange={(e) => setMatchChoice((s) => ({ ...s, [p.id]: e.target.value }))}
                      >
                        <option value="">Match to request...</option>
                        {pendingRequests.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => match(p.id)} className="btn-ghost text-xs">
                        Match
                      </button>
                      <button onClick={() => approve(p.id)} className="btn-ghost text-xs">
                        Approve
                      </button>
                      <button onClick={() => reject(p.id)} className="btn-ghost text-xs">
                        Reject
                      </button>
                    </div>
                  }
                />
              ))}
            </ListStack>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-lg font-medium">Pending requests</h2>
          {pendingRequests.length === 0 && (
            <div className="card">
              <EmptyState icon={Heart} title="No requests pending" />
            </div>
          )}
          {pendingRequests.length > 0 && (
            <ListStack>
              {pendingRequests.map((r) => (
                <ListCard
                  key={r.id}
                  icon={Handshake}
                  title={`${r.title} · ₹${r.amountRequested}`}
                  caption={r.requester.email}
                  actions={
                    <button onClick={() => rejectRequest(r.id)} className="btn-ghost text-xs">
                      Reject
                    </button>
                  }
                />
              ))}
            </ListStack>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Pending pledges"
            value={pendingPledges === null ? "-" : pendingPledges.length}
            icon={Heart}
            accent="orange"
          />
          <StatCard label="Pending requests" value={pendingRequests.length} icon={Handshake} accent="primary" />
        </div>
        <InfoPanel
          icon={Heart}
          title="Matching sponsors"
          items={[
            "Match a pledge to a request before approving it, if there's a fit.",
            "Approving a pledge confirms the sponsor's contribution.",
            "Rejecting a request removes it from the matching list.",
            "Matched pledges keep their request until the match is approved.",
          ]}
        />
      </div>
    </div>
  );
}
