"use client";

import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Search, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxItem {
  id: string;
  label: string;
  sublabel?: string;
}

export function Combobox({
  onSelect,
  search,
  placeholder = "Search...",
  selectedLabel,
}: {
  onSelect: (item: ComboboxItem) => void;
  search: (query: string) => Promise<ComboboxItem[]>;
  placeholder?: string;
  selectedLabel?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ComboboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const items = await search(query);
        setResults(items);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="input-field flex items-center gap-2 text-left text-xs text-ink-secondary"
        >
          <Search size={13} className="shrink-0" />
          <span className={cn("truncate", selectedLabel && "text-ink")}>
            {selectedLabel ?? placeholder}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-72 rounded-card border border-border bg-surface p-2 shadow-elevated data-[state=open]:animate-pop-in"
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input-field text-sm"
          />
          <div className="mt-2 max-h-56 overflow-y-auto">
            {loading && (
              <div className="flex items-center gap-2 px-2 py-3 text-xs text-ink-secondary">
                <Loader2 size={13} className="animate-spin" />
                Searching...
              </div>
            )}
            {!loading && query.trim() && results.length === 0 && (
              <p className="px-2 py-3 text-xs text-ink-secondary">No matches.</p>
            )}
            {!loading &&
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-btn px-2.5 py-2 text-left text-sm text-ink transition-colors duration-150 ease-out hover:bg-surface-muted"
                >
                  <span>
                    <span className="block truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className="block truncate text-xs text-ink-secondary">
                        {item.sublabel}
                      </span>
                    )}
                  </span>
                  {selectedLabel === item.label && <Check size={14} className="text-primary" />}
                </button>
              ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
