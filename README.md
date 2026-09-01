# C2CW — College to Corporate World

Phase 1 (Foundation + MVP core) + Phase 2 (public SSR pages + SEO) implementation. Turborepo
monorepo: `apps/web` (Next.js 14), `apps/api` (NestJS + Prisma + PostgreSQL), `packages/types`
(shared enums/DTOs).

## Confirmed decisions for this build

- **Deployment target:** Vercel (web) + Render (api) + Neon (Postgres) — free tier. See
  [DEPLOYMENT.md](./DEPLOYMENT.md) for the full setup walkthrough and `render.yaml` for the API's
  build/start commands.
- **Payments:** Razorpay is stubbed behind a `PaymentProvider` interface
  (`apps/api/src/modules/wallet/providers/`). No real Razorpay/Stripe API calls are made.
- **Tenancy:** Single-tenant, role-based. `College`/`Corporate`/`HiringPartner` are roles/entities,
  not isolated tenants.

## Prerequisites

- Node 18+, pnpm (via `corepack enable pnpm`)
- PostgreSQL running locally (or any reachable instance)

If Postgres isn't installed yet, run once:

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo -u postgres psql -c "CREATE USER c2cw WITH PASSWORD 'c2cw_dev_pw' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE c2cw_dev OWNER c2cw;"
```

`apps/api/.env` is already pointed at
`postgresql://c2cw:c2cw_dev_pw@localhost:5432/c2cw_dev` — edit `DATABASE_URL` there if you used a
different setup.

## Running it

```bash
pnpm install
pnpm db:migrate    # creates tables from apps/api/prisma/schema.prisma
pnpm db:seed        # seeds the 15 Module rows (all enabled) + an admin user
pnpm dev            # runs api (port 4000) and web (port 3000) together via Turborepo
```

- Web: http://localhost:3000
- API: http://localhost:4000/api
- Seeded admin login: `admin@c2cw.dev` / `Admin@123`
- Register a new account at http://localhost:3000/register to get a Student/College/Corporate/
  HiringPartner/Trainer account.

Useful individual commands:

```bash
pnpm db:studio      # Prisma Studio GUI on the dev database
pnpm --filter @c2cw/api dev     # API only
pnpm --filter @c2cw/web dev     # Web only
```

## What's real vs stubbed

**Real (working end-to-end: DB → API → UI):**
- Auth: email/password register + login issuing JWTs, `/auth/me`. Roles enforced via
  `RolesGuard` + `@Roles()`.
- Module toggle system: `Module` table, `ModulesConfigModule`, and a `ModuleEnabledGuard` that
  actually blocks a module's routes (503) the moment an admin disables it — no redeploy needed.
  Wired UI in `/dashboard/admin`.
- Student Digital Profile: skills/projects/internships/assessments/certifications/achievements/
  experience/video URL as JSON columns, editable via API and a live skills editor in
  `/dashboard/student`.
- `corporate_readiness_score`: a real weighted-composite service
  (`readiness-score.service.ts`) recomputed on profile update, project approval, and internship
  evaluation — not a placeholder constant.
- Programs (CRUD + enrollment) and Job Marketplace (listings, apply, pipeline stages, skill/score
  filtering) — both wired into the student dashboard.
- Projects module: create/submit/admin-approve/score, feeding back into the readiness score.
- Internships: post → admin-approve → student apply/select → mentor assign → evaluation score.
- Hiring Partner: register, bulk job-posting endpoint, pipeline view, basic analytics counts.
- Chat: real Socket.io gateway with JWT-authenticated handshake, persisted message history, and a
  working local-disk file upload endpoint (`POST /chat/upload`, served from `/uploads`).
- Referrals: points ledger, influence score, Bronze/Silver/Gold/Influencer badge computation.
- Freelance: client posts → admin approves → admin assigns student → milestone
  complete → payment release (creates a real `Transaction` + credits the student `Wallet`).
- Wallet + Payments: top-up (via the stub provider) and withdrawal-request → admin-approval flow,
  both actually moving `Wallet.balance`.
- Talks: speaker apply → admin approve/reject → publish with video URL.
- Admin overview endpoint aggregating pending-approval counts across every module.

**Stubbed / intentionally simplified for Phase 1:**
- **Payments:** `RazorpayStubProvider` returns fake order IDs and always "verifies" successfully —
  no real Razorpay SDK call. `StripeStubProvider` exists but isn't wired into the DI container
  (per spec, "stubbed interface, not wired").
- **File storage:** chat attachments and future video/project files go to local disk
  (`apps/api/uploads/`), not S3 — swap the `multer.diskStorage` in `chat.controller.ts` for an S3
  multer-storage driver when a bucket is available.
- **Google/LinkedIn OAuth:** strategies are fully wired (including LinkedIn's current OpenID
  Connect flow, not the deprecated v1 API), but will fail until real
  `GOOGLE_CLIENT_ID`/`LINKEDIN_CLIENT_ID` etc. are set in `apps/api/.env`.
- **Role dashboards:** only Student and Admin have dedicated UI. College/Corporate/HiringPartner/
  Trainer accounts land on the student dashboard layout for now — their APIs
  (hiring-partners, internships mentor/evaluate endpoints, programs enrollment-status) are real
  and testable via curl/Postman, just not wrapped in role-specific screens yet.
- **`packages/ui`:** scaffolded as an empty workspace package for Phase 2+; Phase 1's design
  tokens (Section 4 of the spec) live directly in `apps/web/src/app/globals.css` since only one
  app consumes them so far.
- **Hiring partner analytics:** counts only (jobs, applications, hires) — no time-to-hire/funnel
  breakdown yet.
- **Public marketing pages, SEO, and the remaining Phase 3 modules** (Sponsorship, Marathon,
  Placement Partners, Campus Ambassador) are out of scope for Phase 1 per the phased build plan.

## Phase 2 — Public site + SEO

All 20 spec'd public pages are live under `apps/web/src/app/`, each a Server Component with its
own `generateMetadata` (unique `<title>`, ≤160-char meta description) and a single `<h1>`:

- **Real, live-data pages** (marked `ƒ` dynamic at build — always fresh, `cache: "no-store"` on
  every API call): `/programs` (+ `/programs/[slug]` detail), `/jobs`, `/internships`,
  `/freelance-projects`, `/talks` (+ `/talks/[slug]` detail).
- **Marketing/informational pages** (static `○`, fastest): `/`, `/students`, `/colleges`,
  `/corporates`, `/hiring-partners`, `/placement-partners`, `/trainers`, `/workshops`,
  `/sponsors`, `/seek-sponsorship`, `/marathon`, `/campus-ambassador`, `/success-stories`,
  `/about`, `/contact`, `/login`, `/register`.
- `apps/web/src/app/sitemap.ts` — includes every static route plus live `/programs/*` and
  `/talks/*` slugs, generated from the same API calls the pages use.
- `apps/web/src/app/robots.ts` — allows everything except `/dashboard` and `/auth/callback`.
- Backend change: added a `@Public()` `GET /freelance/public` endpoint (client-approved
  opportunities only, no client email) so the Freelance Projects page can show real data without
  exposing the admin-only pending-approval queue.

**Honesty notes on content (as of Phase 2 — see Phase 3 section below for what changed):**
- Placement Partners, Sponsors, Seek Sponsorship, and Marathon had no backing data model at this
  point — those pages were accurate marketing copy with a CTA to `/contact` or `/register`, not
  fake live listings. Phase 3 below adds the real backend + forms for all four; Workshops still
  has no backing model.
- Success Stories intentionally ships with a real empty state ("no stories published yet")
  instead of fabricated testimonials — it's wired to feature genuine outcomes once cohorts
  complete programs.
- Contact page's form uses a `mailto:` submit (opens the visitor's email client) since there's no
  Lead/Contact backend model — it doesn't fake a "message sent" confirmation.

**Gotcha hit during this phase:** Next.js's App Router caches `fetch()` calls in Server Components
by default (`force-cache`), which silently served stale/empty listings after seeding new data.
Fixed by setting `cache: "no-store"` in `apps/web/src/lib/api.ts`, which correctly makes the
data-backed pages above render dynamically (`ƒ`) instead of static (`○`).

## Project layout

```
apps/api/src/modules/
  auth/                 email + Google + LinkedIn OAuth, JWT
  modules-config/        Module toggle table + guard
  student-profile/        profile CRUD + readiness-score.service.ts
  programs/               programs + enrollment
  projects/               academic/internship/freelance/marathon projects
  jobs/                   job marketplace + pipeline
  internships/            post/approve/select/mentor/evaluate
  hiring-partners/        register/bulk-request/pipeline/analytics
  chat/                   Socket.io gateway + REST history + file upload
  referrals/              points ledger + influence score + badges
  freelance/              client → admin approval → assignment → milestones → payout
  wallet/                 wallet + stubbed Razorpay/Stripe providers
  talks/                  speaker application → publish
  admin/                  cross-module overview endpoint
  sponsorship/            pledges + requests + admin matching
  marathon/               event CRUD + register/submit/score
  placement-partners/     full referral → hire → commission → wallet payout logic
  campus-ambassador/      apply → admin approve/reject
  recommendations/        RECOMMENDATIONS_PROVIDER DI token + rule-based stub (AI swap point)
  smart-search/           Postgres full-text search (ts_rank), AI swap point documented inline
```

## Phase 3 — Sponsorship, Marathon, Placement Partners, Campus Ambassador

All four modules are real: DB tables, guarded REST APIs, and basic CRUD UI wired to live data —
verified end-to-end via curl and in a real browser, not just scaffolded.

**Schema additions** (`apps/api/prisma/schema.prisma`): `Sponsorship`, `SponsorshipRequest`,
`MarathonEvent`, `MarathonParticipant`, `PlacementPartner`, `PlacementReferral`,
`CampusAmbassador`, plus a new `PLACEMENT_PARTNER` role (added to both the Prisma `Role` enum and
`packages/types`).

- **Sponsorship** — a company pledges (`POST /sponsorship/pledges`), a college/trainer requests
  funding (`POST /sponsorship/requests`), and admin either approves/rejects each independently or
  matches a pledge to a request (`PATCH /sponsorship/pledges/:id/match`), which sets the pledge to
  `APPROVED` and the request to `MATCHED` in one transaction. UI: pledge form on `/sponsors`,
  request form on `/seek-sponsorship`, matching UI in the admin dashboard.
- **Marathon** — admin creates a `DRAFT` event and publishes it (`OPEN`); students register, then
  submit an existing `Project` of type `MARATHON` as their entry (validated to be theirs and the
  right type); admin/trainer marks a participant `SCORED` once the underlying Project is reviewed
  through the existing Projects pipeline — reusing Phase 1's review flow rather than duplicating
  it. UI: live event list + register button on `/marathon`, event creation/publish/close in the
  admin dashboard.
- **Placement Partners — full commission logic, not a stub.** A partner registers with a
  commission rate, refers a student against a job with an agreed base amount
  (`POST /placement-partners/referrals`), and the commission is computed and snapshotted
  immediately (`baseAmount × commissionRate / 100`) — later changes to the partner's rate never
  retroactively alter past referrals. Admin walks the referral through a real state machine
  (`REFERRED → HIRED → COMMISSION_APPROVED → PAID`), each transition guarded server-side (e.g.
  releasing before approval returns a 400, not a silent no-op). Releasing payment creates a real
  `Transaction` (`PAYOUT`/`SUCCESS`) and increments the partner's `Wallet.balance` — verified by
  checking the balance before and after (went from 0 to the exact commission amount). UI: a
  `/dashboard/placement-partner` mini-dashboard (register, create referral, track status) plus
  admin actions for each transition.
- **Campus Ambassador** — student applies with a college name, admin approves/rejects, one
  application per student enforced with a clean 409 on retry. UI: apply form on
  `/campus-ambassador`, approval list in the admin dashboard.
- `AdminService.overview()` extended with pending counts for all four modules.

**Bug found and fixed during verification:** creating a duplicate `PlacementReferral` (same
partner + student + job) hit the DB's unique constraint and crashed with a raw 500 instead of a
clean error — added an existence check that now throws a proper `ConflictException` (409).

**Known simplification:** the Placement Partner referral form takes raw student/job IDs (no
search picker yet) — noted directly in the UI copy rather than hidden.

## Phase 4 — AI-ready hooks (no AI logic)

Exactly what the spec asked for — plumbing and a documented swap point, not a real model. Two new
toggleable modules (`RECOMMENDATIONS`, `SMART_SEARCH`, seeded alongside the other 15) and one new
write path on an existing field.

- **`recommendations` service interface + stub.**
  `apps/api/src/modules/recommendations/providers/recommendations-provider.interface.ts` defines
  `RecommendationsProvider` (`recommendJobsForStudent`, `recommendCandidatesForJob`) behind a
  `RECOMMENDATIONS_PROVIDER` DI token — the exact same swap-a-class pattern as Phase 1's
  `PAYMENT_PROVIDER`. The bound implementation, `RuleBasedRecommendationsProvider`, is a
  deterministic, explainable heuristic (skill-string overlap between a student's profile and a
  job's `requiredSkills`, gated by `minReadinessScore`) — genuinely useful today, explicitly *not*
  machine learning. Verified end-to-end: a student with skills `["React","SQL","Node.js"]` against
  a job requiring `["Node.js","SQL"]` scores a perfect `1.0` with the reason
  `"Matches 2 of your skills: node.js, sql"`; a job with no listed skills falls back to a
  readiness-based reason instead. `GET /recommendations/jobs` (student) and
  `GET /recommendations/candidates/:jobId` (hiring partner/corporate/admin) — role-guard confirmed
  rejecting the wrong role with a clean 403. UI: a "Recommended for you" widget on the student
  dashboard with an Apply button wired to the existing apply flow.
  **Where a real model plugs in:** bind a different class to `RECOMMENDATIONS_PROVIDER` in
  `RecommendationsModule` — e.g. one computing embedding similarity (pgvector cosine distance)
  between a job's requirements and a student's profile, or a learned ranking model trained on
  historical application → hire outcomes. No caller changes.
- **`smart-search` wrapping Postgres full-text search.**
  `apps/api/src/modules/smart-search/smart-search.service.ts` runs real `to_tsvector` /
  `plainto_tsquery` / `ts_rank` queries via `$queryRaw` (parameterized, not string-concatenated)
  across `Program` (name+description), `Job` (title+description, OPEN only), and `Talk`
  (title, PUBLISHED only) — not a substring `ILIKE` shortcut. `GET /smart-search?q=engineer`
  verified returning both "Backend Engineer" and "Frontend Engineer" ranked by relevance; empty
  query and no-match query both verified returning clean empty arrays rather than errors. Public,
  no auth required. UI: `/search` page with grouped results by type.
  **Where a real model plugs in:** the natural upgrade is a semantic/vector layer — add a
  `pgvector` embedding column (or a separate embeddings table), populate it from an embedding
  model, and blend or replace the `ts_rank` ordering with cosine-distance ordering. The response
  shape wouldn't need to change.
- **`ai_profile_analysis` field — reserved since Phase 1, now actually writable.**
  `StudentProfile.aiProfileAnalysis Json?` already existed in the schema; Phase 4 adds
  `PATCH /student-profile/:userId/ai-analysis` (admin-only for now) so something can actually
  populate it, verified end-to-end with a sample `{strengths, gaps, suggestedSkills}` payload and
  confirmed a non-admin gets a clean 403. **Where a real model plugs in:** a background job would
  run a model over the student's skills/projects/achievements/certifications and `PATCH` its
  structured output to this same endpoint — the shape is intentionally open (`Record<string,
  unknown>`) since it's whatever a real analysis pipeline decides to produce.
- Module toggling verified on both new modules too — disabling `SMART_SEARCH` returns a 503 from
  `GET /smart-search` immediately, matching every other module's behavior.

## Next steps (Phase 3 backlog / future work)

Workshops still has no backing data model (was out of scope for both Phase 2 and Phase 3). The
Placement Partner referral form still takes raw student/job IDs (no search picker). Public role
dashboards for College/Corporate/Trainer accounts remain unbuilt (their APIs are real and
testable, just not wrapped in dedicated UI).
