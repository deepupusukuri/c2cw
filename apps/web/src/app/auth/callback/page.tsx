"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function CallbackHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setToken(token).then(() => router.replace("/dashboard"));
  }, [params, router, setToken]);

  return <p className="p-8 text-center text-ink-secondary">Signing you in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-ink-secondary">Signing you in...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
