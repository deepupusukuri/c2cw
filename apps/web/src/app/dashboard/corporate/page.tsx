"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CorporateRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/corporate/overview");
  }, [router]);
  return null;
}
