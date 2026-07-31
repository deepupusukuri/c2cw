"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-heading text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-secondary">Log in to continue to your dashboard.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-ink-secondary">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <a href={`${API_URL}/auth/google`} className="btn-ghost w-full text-center">
          Continue with Google
        </a>
        <a href={`${API_URL}/auth/linkedin`} className="btn-ghost w-full text-center">
          Continue with LinkedIn
        </a>
      </div>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        No account?{" "}
        <Link href="/register" className="font-medium text-primary">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
