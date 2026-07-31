-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "postedById" TEXT;

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
