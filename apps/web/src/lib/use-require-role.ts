"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@c2cw/types";
import { useAuth } from "./auth-context";

/**
 * Guards a role-specific dashboard page. If the logged-in user's role doesn't
 * match, redirects to /dashboard (which routes to the correct destination)
 * instead of letting the page render and fail against APIs scoped to a
 * different role. Returns true once it's safe to render the page's real content.
 */
export function useRequireRole(...allowed: Role[]): boolean {
  const { user, loading } = useAuth();
  const router = useRouter();

  const ready = !loading && !!user && allowed.includes(user.role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowed.includes(user.role)) {
      router.replace("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return ready;
}
