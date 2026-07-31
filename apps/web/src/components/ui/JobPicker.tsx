"use client";

import { Combobox, ComboboxItem } from "./Combobox";
import { api } from "@/lib/api";

interface SmartSearchResult {
  jobs: { id: string; title: string; description: string | null }[];
}

export function JobPicker({
  selectedLabel,
  onSelect,
}: {
  selectedLabel?: string | null;
  onSelect: (jobId: string, label: string) => void;
}) {
  async function search(query: string): Promise<ComboboxItem[]> {
    const results = await api.get<SmartSearchResult>(`/smart-search?q=${encodeURIComponent(query)}`);
    return results.jobs.map((j) => ({
      id: j.id,
      label: j.title,
      sublabel: j.description ?? undefined,
    }));
  }

  return (
    <Combobox
      placeholder="Search jobs by title..."
      selectedLabel={selectedLabel}
      search={search}
      onSelect={(item) => onSelect(item.id, item.label)}
    />
  );
}
