"use client";

import { useState } from "react";
import Link from "next/link";
import { Role } from "@c2cw/types";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";

export function MarathonRegisterButton({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <Link href="/register" className="btn-ghost text-xs">
        Register to join
      </Link>
    );
  }

  if (user.role !== Role.STUDENT) {
    return null;
  }

  async function onRegister() {
    setStatus("loading");
    setError(null);
    try {
      await api.post(`/marathon/events/${eventId}/register`);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return <span className="badge-verified">Registered</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={onRegister} disabled={status === "loading"} className="btn-ghost text-xs">
        {status === "loading" ? "Registering..." : "Register"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
