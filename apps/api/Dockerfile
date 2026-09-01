# Dockerfile for @c2cw/api.
#
# Build context MUST be the repo root (see render.yaml: dockerContext: .),
# because this is a pnpm workspace monorepo and the install step needs to see
# every workspace member's package.json to match pnpm-lock.yaml.
#
# Why a Dockerfile at all, instead of Render's auto-detected Node build:
# Render's native Node builder (Railpack) builds the project successfully but
# doesn't reliably preserve a nested workspace's custom build output
# (apps/api/build/) when it packages the deploy artifact - it only recognizes
# build outputs at conventional, non-monorepo locations. A Dockerfile gives
# full explicit control over the final image instead of relying on that
# auto-detection guessing correctly for this layout.

FROM node:24-slim AS base
RUN corepack enable
WORKDIR /app

# ---- deps: install every workspace member's deps, cached across builds ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile

# ---- build: compile @c2cw/types then @c2cw/api ----
FROM deps AS build
COPY . .
RUN pnpm --filter @c2cw/api exec prisma generate --schema=prisma/schema.prisma
RUN npx turbo run build --filter=@c2cw/api

# ---- runner: only what's needed to run the compiled api ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /app/apps/api ./apps/api
COPY --from=build /app/packages/types ./packages/types

EXPOSE 4000
CMD ["sh", "-c", "pnpm --filter @c2cw/api exec prisma migrate deploy --schema=prisma/schema.prisma && node apps/api/build/main.js"]
