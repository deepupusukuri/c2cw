import { Module } from "@nestjs/common";
import { InternshipsController } from "./internships.controller";
import { InternshipsService } from "./internships.service";
import { StudentProfileModule } from "../student-profile/student-profile.module";

@Module({
  imports: [StudentProfileModule],
  controllers: [InternshipsController],
  providers: [InternshipsService],
  exports: [InternshipsService],
})
export class InternshipsModule {}
