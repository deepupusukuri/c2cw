export interface RecommendationItem {
  id: string;
  score: number; // relevance in [0, 1] — comparable across recommendations from the same call
  reason: string; // human-readable explanation of why this was surfaced
  data: Record<string, unknown>;
}

export const RECOMMENDATIONS_PROVIDER = "RECOMMENDATIONS_PROVIDER";

/**
 * Swap-point for a real ML-based recommender. Bind a different class to
 * RECOMMENDATIONS_PROVIDER in RecommendationsModule (same pattern as
 * PAYMENT_PROVIDER in WalletModule) — every caller keeps working unchanged.
 *
 * A real implementation would likely replace the skill-overlap heuristic
 * with embedding similarity (e.g. pgvector cosine distance between a job's
 * requirements embedding and a student's StudentProfile.aiProfileAnalysis
 * embedding) and/or a learned ranking model trained on historical
 * application → hire outcomes.
 */
export interface RecommendationsProvider {
  recommendJobsForStudent(studentId: string, limit: number): Promise<RecommendationItem[]>;
  recommendCandidatesForJob(jobId: string, limit: number): Promise<RecommendationItem[]>;
}
