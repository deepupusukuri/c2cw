import { Inject, Injectable } from "@nestjs/common";
import {
  RECOMMENDATIONS_PROVIDER,
  RecommendationsProvider,
} from "./providers/recommendations-provider.interface";

@Injectable()
export class RecommendationsService {
  constructor(
    @Inject(RECOMMENDATIONS_PROVIDER) private provider: RecommendationsProvider,
  ) {}

  jobsForStudent(studentId: string, limit = 10) {
    return this.provider.recommendJobsForStudent(studentId, limit);
  }

  candidatesForJob(jobId: string, limit = 10) {
    return this.provider.recommendCandidatesForJob(jobId, limit);
  }
}
