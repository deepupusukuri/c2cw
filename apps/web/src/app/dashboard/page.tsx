"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@c2cw/types";
import { useAuth } from "@/lib/auth-context";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === Role.ADMIN) {
      router.replace("/dashboard/admin");
    } else if (user.role === Role.STUDENT) {
      router.replace("/dashboard/student");
    } else if (user.role === Role.PLACEMENT_PARTNER) {
      router.replace("/dashboard/placement-partner");
    } else if (user.role === Role.CORPORATE) {
      router.replace("/dashboard/corporate");
    } else if (user.role === Role.COLLEGE) {
      router.replace("/dashboard/college");
    } else if (user.role === Role.TRAINER) {
      router.replace("/dashboard/trainer");
    } else if (user.role === Role.HIRING_PARTNER) {
      router.replace("/dashboard/hiring-partner");
    }
  }, [user, loading, router]);

  return <p className="p-8 text-center text-ink-secondary">Loading your dashboard...</p>;
}
