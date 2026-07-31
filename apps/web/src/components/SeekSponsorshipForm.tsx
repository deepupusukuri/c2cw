"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";

export function SeekSponsorshipForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amountRequested, setAmountRequested] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          <Link href="/register" className="text-primary">
            Register or log in
          </Link>{" "}
          to request sponsorship for your program or event.
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          Request submitted — admins will try to match it with an available sponsor.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await api.post("/sponsorship/requests", {
        title,
        description,
        amountRequested: Number(amountRequested),
      });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-4">
      <h3 className="font-heading text-base font-medium">Request sponsorship</h3>
      <div>
        <label className="text-sm text-ink-secondary">Program or event title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Amount requested (₹)</label>
        <input
          type="number"
          min={1}
          required
          value={amountRequested}
          onChange={(e) => setAmountRequested(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
