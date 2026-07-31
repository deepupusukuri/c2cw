"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrainerRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/trainer/overview");
  }, [router]);
  return null;
}
