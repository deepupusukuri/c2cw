"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HiringPartnerRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/hiring-partner/overview");
  }, [router]);
  return null;
}
