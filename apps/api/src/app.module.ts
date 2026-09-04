import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { ModulesConfigModule } from "./modules/modules-config/modules-config.module";
import { StudentProfileModule } from "./modules/student-profile/student-profile.module";
import { ProgramsModule } from "./modules/programs/programs.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { InternshipsModule } from "./modules/internships/internships.module";
import { HiringPartnersModule } from "./modules/hiring-partners/hiring-partners.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ReferralsModule } from "./modules/referrals/referrals.module";
import { FreelanceModule } from "./modules/freelance/freelance.module";
import { WalletModule } from "./modules/wallet/wallet.module";
import { TalksModule } from "./modules/talks/talks.module";
import { AdminModule } from "./modules/admin/admin.module";
import { SponsorshipModule } from "./modules/sponsorship/sponsorship.module";
import { MarathonModule } from "./modules/marathon/marathon.module";
import { PlacementPartnersModule } from "./modules/placement-partners/placement-partners.module";
import { CampusAmbassadorModule } from "./modules/campus-ambassador/campus-ambassador.module";
import { RecommendationsModule } from "./modules/recommendations/recommendations.module";
import { SmartSearchModule } from "./modules/smart-search/smart-search.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ModulesConfigModule,
    StudentProfileModule,
    ProgramsModule,
    ProjectsModule,
    JobsModule,
    InternshipsModule,
    HiringPartnersModule,
    ChatModule,
    ReferralsModule,
    FreelanceModule,
    WalletModule,
    TalksModule,
    AdminModule,
    SponsorshipModule,
    MarathonModule,
    PlacementPartnersModule,
    CampusAmbassadorModule,
    RecommendationsModule,
    SmartSearchModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
