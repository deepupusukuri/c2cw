import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export interface ProgramSearchRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rank: number;
}

export interface JobSearchRow {
  id: string;
  title: string;
  description: string | null;
  rank: number;
}

export interface TalkSearchRow {
  id: string;
  title: string;
  slug: string;
  rank: number;
}

/**
 * Wraps Postgres's built-in full-text search (to_tsvector/plainto_tsquery,
 * ranked with ts_rank) — no external search service, no AI. The natural
 * upgrade path is a semantic/vector layer: add a `pgvector` embedding column
 * per row (or a separate embeddings table), populate it from an embedding
 * model, and blend/replace the ts_rank ordering below with cosine-distance
 * ordering — the response shape here wouldn't need to change.
 */
@Injectable()
export class SmartSearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, limit = 10) {
    const term = query.trim();
    if (!term) {
      return { programs: [], jobs: [], talks: [] };
    }

    const [programs, jobs, talks] = await Promise.all([
      this.prisma.$queryRaw<ProgramSearchRow[]>`
        SELECT id, name, slug, description,
          ts_rank(to_tsvector('english', name || ' ' || coalesce(description, '')), plainto_tsquery('english', ${term})) AS rank
        FROM "Program"
        WHERE to_tsvector('english', name || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${term})
        ORDER BY rank DESC
        LIMIT ${limit}
      `,
      this.prisma.$queryRaw<JobSearchRow[]>`
        SELECT id, title, description,
          ts_rank(to_tsvector('english', title || ' ' || coalesce(description, '')), plainto_tsquery('english', ${term})) AS rank
        FROM "Job"
        WHERE status = 'OPEN'
          AND to_tsvector('english', title || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${term})
        ORDER BY rank DESC
        LIMIT ${limit}
      `,
      this.prisma.$queryRaw<TalkSearchRow[]>`
        SELECT id, title, slug,
          ts_rank(to_tsvector('english', title), plainto_tsquery('english', ${term})) AS rank
        FROM "Talk"
        WHERE status = 'PUBLISHED'
          AND to_tsvector('english', title) @@ plainto_tsquery('english', ${term})
        ORDER BY rank DESC
        LIMIT ${limit}
      `,
    ]);

    return { programs, jobs, talks };
  }
}
