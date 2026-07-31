-- CreateEnum
CREATE TYPE "SponsorshipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SponsorshipRequestStatus" AS ENUM ('PENDING', 'MATCHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MarathonEventStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "MarathonParticipantStatus" AS ENUM ('REGISTERED', 'SUBMITTED', 'SCORED');

-- CreateEnum
CREATE TYPE "PlacementReferralStatus" AS ENUM ('REFERRED', 'HIRED', 'COMMISSION_APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "CampusAmbassadorStatus" AS ENUM ('APPLIED', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PLACEMENT_PARTNER';

-- CreateTable
CREATE TABLE "Sponsorship" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'standard',
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "SponsorshipStatus" NOT NULL DEFAULT 'PENDING',
    "matchedRequestId" TEXT,
    "configJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorshipRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amountRequested" DECIMAL(12,2) NOT NULL,
    "status" "SponsorshipRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarathonEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "MarathonEventStatus" NOT NULL DEFAULT 'DRAFT',
    "configJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarathonEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarathonParticipant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "projectId" TEXT,
    "status" "MarathonParticipantStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarathonParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementPartner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agencyName" TEXT NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "configJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacementPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementReferral" (
    "id" TEXT NOT NULL,
    "placementPartnerId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "baseAmount" DECIMAL(12,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" DECIMAL(12,2) NOT NULL,
    "status" "PlacementReferralStatus" NOT NULL DEFAULT 'REFERRED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacementReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusAmbassador" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "status" "CampusAmbassadorStatus" NOT NULL DEFAULT 'APPLIED',
    "configJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusAmbassador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sponsorship_matchedRequestId_key" ON "Sponsorship"("matchedRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "MarathonEvent_slug_key" ON "MarathonEvent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MarathonParticipant_projectId_key" ON "MarathonParticipant"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "MarathonParticipant_eventId_studentId_key" ON "MarathonParticipant"("eventId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementPartner_userId_key" ON "PlacementPartner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementReferral_placementPartnerId_studentId_jobId_key" ON "PlacementReferral"("placementPartnerId", "studentId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "CampusAmbassador_userId_key" ON "CampusAmbassador"("userId");

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_matchedRequestId_fkey" FOREIGN KEY ("matchedRequestId") REFERENCES "SponsorshipRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorshipRequest" ADD CONSTRAINT "SponsorshipRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarathonParticipant" ADD CONSTRAINT "MarathonParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "MarathonEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarathonParticipant" ADD CONSTRAINT "MarathonParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementPartner" ADD CONSTRAINT "PlacementPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementReferral" ADD CONSTRAINT "PlacementReferral_placementPartnerId_fkey" FOREIGN KEY ("placementPartnerId") REFERENCES "PlacementPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementReferral" ADD CONSTRAINT "PlacementReferral_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusAmbassador" ADD CONSTRAINT "CampusAmbassador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
