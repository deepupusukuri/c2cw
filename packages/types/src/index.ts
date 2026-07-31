// Shared enums and DTO shapes between apps/api and apps/web.
// Keep in sync with apps/api/prisma/schema.prisma enums.

export enum Role {
  STUDENT = "STUDENT",
  COLLEGE = "COLLEGE",
  CORPORATE = "CORPORATE",
  HIRING_PARTNER = "HIRING_PARTNER",
  PLACEMENT_PARTNER = "PLACEMENT_PARTNER",
  TRAINER = "TRAINER",
  ADMIN = "ADMIN",
}

export enum OAuthProvider {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  LINKEDIN = "LINKEDIN",
}

export enum ProjectType {
  ACADEMIC = "ACADEMIC",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
  MARATHON = "MARATHON",
}

export enum ProjectStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SCORED = "SCORED",
}

export enum ProgramType {
  CAREER_PATH = "CAREER_PATH",
  CORE = "CORE",
}

export enum EnrollmentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  WITHDRAWN = "WITHDRAWN",
}

export enum JobStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum PipelineStage {
  APPLIED = "APPLIED",
  SCREENING = "SCREENING",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
}

export enum InternshipStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum FreelanceStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum TalkStatus {
  APPLIED = "APPLIED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PUBLISHED = "PUBLISHED",
}

export enum TransactionType {
  PAYMENT = "PAYMENT",
  PAYOUT = "PAYOUT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum InfluencerBadge {
  NONE = "NONE",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  INFLUENCER = "INFLUENCER",
}

export enum ModuleName {
  STUDENT_PROFILE = "STUDENT_PROFILE",
  PROGRAMS = "PROGRAMS",
  PROJECTS = "PROJECTS",
  JOB_MARKETPLACE = "JOB_MARKETPLACE",
  INTERNSHIPS = "INTERNSHIPS",
  HIRING_PARTNERS = "HIRING_PARTNERS",
  CHAT = "CHAT",
  REFERRALS = "REFERRALS",
  FREELANCE = "FREELANCE",
  WALLET = "WALLET",
  TALKS = "TALKS",
  SPONSORSHIP = "SPONSORSHIP",
  MARATHON = "MARATHON",
  PLACEMENT_PARTNERS = "PLACEMENT_PARTNERS",
  CAMPUS_AMBASSADOR = "CAMPUS_AMBASSADOR",
  RECOMMENDATIONS = "RECOMMENDATIONS",
  SMART_SEARCH = "SMART_SEARCH",
}

export enum SponsorshipStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum SponsorshipRequestStatus {
  PENDING = "PENDING",
  MATCHED = "MATCHED",
  REJECTED = "REJECTED",
}

export enum MarathonEventStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum MarathonParticipantStatus {
  REGISTERED = "REGISTERED",
  SUBMITTED = "SUBMITTED",
  SCORED = "SCORED",
}

export enum PlacementReferralStatus {
  REFERRED = "REFERRED",
  HIRED = "HIRED",
  COMMISSION_APPROVED = "COMMISSION_APPROVED",
  PAID = "PAID",
  REJECTED = "REJECTED",
}

export enum CampusAmbassadorStatus {
  APPLIED = "APPLIED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name: string | null;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
