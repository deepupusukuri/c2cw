"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";

export function SponsorPledgeForm() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [tier, setTier] = useState("standard");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          <Link href="/register" className="text-primary">
            Register or log in
          </Link>{" "}
          to pledge a sponsorship.
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          Thanks — your pledge is in for admin review. You can track its status once we add a
          sponsor dashboard.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await api.post("/sponsorship/pledges", { companyName, tier, amount: Number(amount) });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-4">
      <h3 className="font-heading text-base font-medium">Pledge a sponsorship</h3>
      <div>
        <label className="text-sm text-ink-secondary">Company name</label>
        <input
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Tier</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="input-field mt-1">
          <option value="standard">Standard</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Amount (₹)</label>
        <input
          type="number"
          min={1}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Submitting..." : "Submit pledge"}
      </button>
    </form>
  );
}
