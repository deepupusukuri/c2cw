"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollegeRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/college/overview");
  }, [router]);
  return null;
}
