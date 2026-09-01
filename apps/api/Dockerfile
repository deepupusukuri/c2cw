# Dockerfile for @c2cw/api.
#
# Build context MUST be the repo root (see render.yaml: dockerContext: .),
# because this is a pnpm workspace monorepo and the install step needs to see
# every workspace member's package.json to match pnpm-lock.yaml.
#
# Why a Dockerfile at all, instead of Render's auto-detected Node build:
# gives full explicit control over exactly what ships in the final image for
# this monorepo, rather than relying on auto-detection to guess a nested
# workspace's build output correctly.
#
# (The actual root cause of an earlier "module not found" failure here turned
# out to be unrelated to Render/Docker at all: apps/api/tsconfig.json had no
# explicit rootDir, and the build's input set included apps/api/prisma/seed.ts
# alongside apps/api/src/**, so TypeScript inferred the common root as
# apps/api/ itself and emitted apps/api/build/src/main.js instead of
# apps/api/build/main.js. Fixed by pinning rootDir to ./src and excluding
# prisma/ from the build's tsconfig.)

FROM node:24-slim AS base
# node:*-slim doesn't ship OpenSSL, but Prisma's engine binaries need it to
# run (both `prisma generate` in the build stage and `prisma migrate deploy`
# at runtime) - without it Prisma fails with "Schema engine error".
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
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
# Fail the build loudly here if the entrypoint isn't where the runner stage
# (and the CMD below) expect it, instead of finding out later at deploy time.
RUN test -f apps/api/build/main.js || (echo "apps/api/build/main.js missing after build:" && ls -laR apps/api/build && exit 1)

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
