# Deploying C2CW (free tier)

Stack: **Vercel** (web) + **Render** (api) + **Neon** (Postgres). All three have
a free tier that doesn't expire (unlike Render's own free Postgres, which is
deleted after 30-90 days — that's why the database lives on Neon instead).

Order matters: set up the database first, then the API (which needs the
database's connection string), then the web app (which needs the API's URL).

## 1. Database — Neon

1. Sign up at https://neon.tech (GitHub login works) and create a project.
2. Open the project's **Connection Details** and copy the connection string
   (it looks like `postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require`).
3. Keep this tab open — you'll paste this string into Render as `DATABASE_URL`
   in the next step.

## 2. API — Render

1. Sign up at https://render.com (GitHub login) and connect the
   `c2cw` GitHub repo.
2. **New +** → **Blueprint** → select this repo. Render will detect
   [`render.yaml`](./render.yaml) at the repo root and propose a `c2cw-api`
   service — accept it.
   - If you'd rather configure it by hand instead of via the blueprint,
     create a **Web Service** manually with:
     - Root Directory: *(leave blank / repo root)*
     - Runtime/Environment: **Docker**
     - Dockerfile Path: `apps/api/Dockerfile`
     - Docker Build Context Directory: `.` (repo root — required, since this
       is a pnpm workspace monorepo and the install step needs every
       workspace member's `package.json` to match `pnpm-lock.yaml`)

     This deploys via `apps/api/Dockerfile` rather than Render's
     auto-detected Node build. That auto-detected builder (Railpack)
     compiled the app fine every time, but silently failed to preserve this
     monorepo's nested build output (`apps/api/build/`, formerly
     `apps/api/dist/`) when packaging the deploy artifact — it only
     recognizes build outputs at conventional, non-monorepo locations. The
     Dockerfile gives full explicit control over what ships in the final
     image instead of relying on that auto-detection guessing right.
3. Once the service is created, open its **Environment** tab and fill in the
   variables marked `sync: false` in `render.yaml`:
   - `DATABASE_URL` — the Neon connection string from step 1.
   - `JWT_SECRET` — any long random string (e.g. run `openssl rand -base64 32` locally).
   - `WEB_APP_URL` — you don't have the Vercel URL yet; put a placeholder like
     `https://placeholder.vercel.app` for now and come back to fix it after
     step 3 gives you the real URL. **Must include `https://`.**
   - Google/LinkedIn/Razorpay keys — only required if you're using those
     integrations; leave blank otherwise (routes using them just won't work
     until filled in).
   - Do **not** set `PORT` — Render assigns it automatically and `main.ts`
     already reads `process.env.PORT`.
4. Deploy. Watch the **Logs** tab. Note Render's free tier spins the service
   down after 15 minutes of no traffic — the first request after idle takes
   ~30-60s to wake back up, which is normal.
5. Once live, copy the service's public URL, e.g.
   `https://c2cw-api.onrender.com`. Your API base becomes
   `https://c2cw-api.onrender.com/api` (the app sets a global `api` prefix).

## 3. Web — Vercel

1. Sign up at https://vercel.com (GitHub login) and **Add New** → **Project**
   → import the same repo.
2. In the import screen, set:
   - **Root Directory:** `apps/web`
   - Framework Preset: Next.js (auto-detected)
   - Vercel auto-detects the pnpm workspace from `pnpm-workspace.yaml` at the
     repo root — no extra config needed for that part.
3. Add environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` = `https://c2cw-api.onrender.com/api` (from step 2.5)
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL, e.g. `https://c2cw.vercel.app`
     (you'll know the exact URL after the first deploy; update and redeploy
     once you have it)
4. Deploy.

## 4. Close the loop

Go back to Render → `c2cw-api` → Environment → update `WEB_APP_URL` to the
real Vercel URL from step 3 (e.g. `https://c2cw.vercel.app`, with `https://`).
This is what `app.enableCors(...)` in `apps/api/src/main.ts` checks against —
without the correct value here, the browser will block requests from the web
app with a CORS error even though the API itself is healthy. Redeploy the API
after changing it.

## Local development

Local dev is unaffected by any of this — `pnpm dev` at the repo root still
runs everything against `apps/api/.env` / `apps/web/.env.local` as before.
See `apps/api/.env.example` and `apps/web/.env.example` for the full list of
variables each app expects.
