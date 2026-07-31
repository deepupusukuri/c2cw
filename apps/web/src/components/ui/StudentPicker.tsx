"use client";

import { Combobox, ComboboxItem } from "./Combobox";
import { api } from "@/lib/api";

interface StudentProfileSearchResult {
  userId: string;
  user: { id: string; name: string | null; email: string };
}

export function StudentPicker({
  selectedLabel,
  onSelect,
}: {
  selectedLabel?: string | null;
  onSelect: (studentId: string, label: string) => void;
}) {
  async function search(query: string): Promise<ComboboxItem[]> {
    const results = await api.get<StudentProfileSearchResult[]>(
      `/student-profile/search?q=${encodeURIComponent(query)}`,
    );
    return results.map((r) => ({
      id: r.user.id,
      label: r.user.name ?? r.user.email,
      sublabel: r.user.email,
    }));
  }

  return (
    <Combobox
      placeholder="Search students by name or email..."
      selectedLabel={selectedLabel}
      search={search}
      onSelect={(item) => onSelect(item.id, item.label)}
    />
  );
}
