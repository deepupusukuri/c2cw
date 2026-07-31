"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Role } from "@c2cw/types";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: Role.STUDENT, label: "Student" },
  { value: Role.COLLEGE, label: "College" },
  { value: Role.CORPORATE, label: "Corporate" },
  { value: Role.HIRING_PARTNER, label: "Hiring Partner" },
  { value: Role.PLACEMENT_PARTNER, label: "Placement Partner" },
  { value: Role.TRAINER, label: "Trainer" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, name, role);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-heading text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-ink-secondary">Join C2CW and start your journey.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm text-ink-secondary">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-ink-secondary">I am a...</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="input-field mt-1"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
