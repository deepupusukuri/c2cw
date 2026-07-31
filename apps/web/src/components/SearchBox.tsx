"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

interface SearchResults {
  programs: { id: string; name: string; slug: string; description: string | null }[];
  jobs: { id: string; title: string; description: string | null }[];
  talks: { id: string; title: string; slug: string }[];
}

function SearchBoxInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<SearchResults>(`/smart-search?q=${encodeURIComponent(q)}`);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = params.get("q");
    if (initial) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`);
    runSearch(query);
  }

  const totalResults = results
    ? results.programs.length + results.jobs.length + results.talks.length
    : 0;

  return (
    <div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search programs, jobs, talks..."
          className="input-field"
        />
        <button type="submit" className="btn-primary shrink-0">
          Search
        </button>
      </form>

      {loading && <p className="mt-6 text-sm text-ink-secondary">Searching...</p>}

      {!loading && results && (
        <div className="mt-8 space-y-8">
          {totalResults === 0 && (
            <p className="text-sm text-ink-secondary">No results for &quot;{query}&quot;.</p>
          )}

          {results.programs.length > 0 && (
            <section>
              <h2 className="font-heading text-lg font-medium">Programs</h2>
              <div className="mt-3 space-y-2">
                {results.programs.map((p) => (
                  <Link key={p.id} href={`/programs/${p.slug}`} className="card block hover:shadow-sm">
                    <p className="text-sm font-medium">{p.name}</p>
                    {p.description && (
                      <p className="mt-1 text-xs text-ink-secondary line-clamp-2">{p.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.jobs.length > 0 && (
            <section>
              <h2 className="font-heading text-lg font-medium">Jobs</h2>
              <div className="mt-3 space-y-2">
                {results.jobs.map((j) => (
                  <div key={j.id} className="card">
                    <p className="text-sm font-medium">{j.title}</p>
                    {j.description && (
                      <p className="mt-1 text-xs text-ink-secondary line-clamp-2">{j.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.talks.length > 0 && (
            <section>
              <h2 className="font-heading text-lg font-medium">Talks</h2>
              <div className="mt-3 space-y-2">
                {results.talks.map((t) => (
                  <Link key={t.id} href={`/talks/${t.slug}`} className="card block hover:shadow-sm">
                    <p className="text-sm font-medium">{t.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchBox() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-secondary">Loading search...</p>}>
      <SearchBoxInner />
    </Suspense>
  );
}
