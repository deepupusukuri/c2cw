"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlacementPartnerRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/placement-partner/overview");
  }, [router]);
  return null;
}
