"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Lightbulb } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";

function CreateProgramForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("CORE");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/programs", { name, slug, type, description: description || undefined });
      setStatus("done");
      setName("");
      setSlug("");
      setDescription("");
      toast("Program created");
    } catch (err) {
      setStatus("idle");
      toast(err instanceof ApiError ? err.message : "Couldn't create program", "error");
    }
  }

  if (status === "done") {
    return (
      <div className="card">
        <p className="text-sm text-ink-secondary">
          Program created and live on{" "}
          <Link href="/programs" className="text-primary">
            /programs
          </Link>
          .
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-3 text-xs">
          Create another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-heading text-lg font-medium">Create a program</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-ink-secondary">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Slug</label>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field mt-1">
            <option value="CORE">Core</option>
            <option value="CAREER_PATH">Career Path</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-ink-secondary">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field mt-1"
          />
        </div>
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-primary">
        {status === "loading" ? "Creating..." : "Create program"}
      </button>
    </form>
  );
}

export default function CollegeOverviewPage() {
  const { user } = useAuth();
  const [programCount, setProgramCount] = useState<number | null>(null);

  const refreshCount = useCallback(async () => {
    try {
      const programs = await api.get<{ id: string }[]>("/programs");
      setProgramCount(programs.length);
    } catch {
      // Sidebar stat is a nice-to-have; ignore failures silently.
    }
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <h2 className="font-heading text-2xl font-semibold">Welcome, {user?.name}</h2>
        <CreateProgramForm />
      </div>
      <div className="space-y-6">
        <StatCard label="Programs live" value={programCount ?? "-"} icon={GraduationCap} accent="primary" />
        <InfoPanel
          icon={Lightbulb}
          title="Tips for a strong program"
          items={[
            "Use a clear, descriptive name so students recognize it at a glance.",
            "Choose Core for foundational tracks and Career Path for role-focused specializations.",
            "Write a short description covering what students will learn or achieve.",
            "The slug becomes part of the program's public URL — keep it simple and unique.",
            "Programs go live immediately on the public /programs page once created.",
          ]}
        />
      </div>
    </div>
  );
}
