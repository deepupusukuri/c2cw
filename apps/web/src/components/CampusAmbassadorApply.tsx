"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Role } from "@c2cw/types";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";

interface Application {
  status: string;
  collegeName: string;
}

export function CampusAmbassadorApply() {
  const { user, loading } = useAuth();
  const [collegeName, setCollegeName] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== Role.STUDENT) {
      setChecked(true);
      return;
    }
    api
      .get<Application>("/campus-ambassador/me")
      .then(setApplication)
      .catch(() => setApplication(null))
      .finally(() => setChecked(true));
  }, [user]);

  if (loading || !checked) return null;

  if (!user) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          <Link href="/register" className="text-primary">
            Register as a student
          </Link>{" "}
          to apply as a Campus Ambassador.
        </p>
      </div>
    );
  }

  if (user.role !== Role.STUDENT) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          The Campus Ambassador program is open to student accounts.
        </p>
      </div>
    );
  }

  if (application) {
    return (
      <div className="card max-w-md">
        <p className="text-sm text-ink-secondary">
          Your application for {application.collegeName} is{" "}
          <span className="font-medium text-ink">{application.status}</span>.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await api.post<Application>("/campus-ambassador/apply", { collegeName });
      setApplication(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-4">
      <h3 className="font-heading text-base font-medium">Apply as a Campus Ambassador</h3>
      <div>
        <label className="text-sm text-ink-secondary">College name</label>
        <input
          required
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Submitting..." : "Apply"}
      </button>
    </form>
  );
}
