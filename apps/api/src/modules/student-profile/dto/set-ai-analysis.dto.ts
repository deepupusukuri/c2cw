import { IsObject } from "class-validator";

// Shape is intentionally open — a real analysis job would write whatever
// structured output its model produces (strengths, gaps, suggested skills,
// an overall narrative, etc.) into this JSON column.
export class SetAiAnalysisDto {
  @IsObject()
  analysis!: Record<string, unknown>;
}
