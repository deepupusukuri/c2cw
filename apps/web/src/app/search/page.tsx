import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = {
  title: "Search",
  description: "Search programs, jobs, and talks on C2CW.",
};

export default function SearchPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Search" title="Find programs, jobs, and talks" />
      <div className="mt-8 max-w-2xl">
        <SearchBox />
      </div>
    </PageShell>
  );
}
