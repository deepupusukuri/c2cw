import { Module } from "@nestjs/common";
import { RecommendationsController } from "./recommendations.controller";
import { RecommendationsService } from "./recommendations.service";
import { RECOMMENDATIONS_PROVIDER } from "./providers/recommendations-provider.interface";
import { RuleBasedRecommendationsProvider } from "./providers/rule-based-recommendations.provider";

@Module({
  controllers: [RecommendationsController],
  providers: [
    RecommendationsService,
    { provide: RECOMMENDATIONS_PROVIDER, useClass: RuleBasedRecommendationsProvider },
  ],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
