import { Module } from "@nestjs/common";
import { StudentProfileController } from "./student-profile.controller";
import { StudentProfileService } from "./student-profile.service";
import { ReadinessScoreService } from "./readiness-score.service";

@Module({
  controllers: [StudentProfileController],
  providers: [StudentProfileService, ReadinessScoreService],
  exports: [StudentProfileService, ReadinessScoreService],
})
export class StudentProfileModule {}
