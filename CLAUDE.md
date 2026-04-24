# FlexQR

Dynamic QR code SaaS. Users create short-code QR codes whose destination URL can be changed at any time. The platform tracks scans, supports team workspaces, and monetizes via Stripe subscriptions.

## Monorepo layout

```
apps/web        Next.js 16 (App Router) — main application
packages/db     Prisma 6 schema + client singleton (@flexqr/db)
packages/config Shared TypeScript configs (@flexqr/config)
```

## Tech stack

| Concern       | Choice                                  |
|---------------|-----------------------------------------|
| Framework     | Next.js 16 (App Router)                 |
| Auth          | Supabase Auth (@supabase/ssr)           |
| Database      | Supabase Postgres via Prisma 6          |
| Redirect cache| Upstash Redis                           |
| Billing       | Stripe                                  |
| Email         | Resend                                  |
| Storage       | Vercel Blob (QR images, logos)          |
| Styling       | Tailwind v4 + shadcn/ui (added Phase 2) |
| Deployment    | Vercel                                  |

## Key conventions

- All `process.env` access goes through `apps/web/lib/env.ts`
- Supabase browser client: `lib/supabase/client.ts`
- Supabase server client: `lib/supabase/server.ts`
- Prisma access: `import { prisma } from "@/lib/db"`
- `NEXT_PUBLIC_APP_URL` controls the base URL for QR redirect links (defaults to `http://localhost:3000`). Short-code redirect URLs are `${APP_URL}/r/[shortCode]`.

## Redirect architecture

`GET /r/[shortCode]` is handled by `apps/web/app/r/[shortCode]/route.ts`.
The middleware matcher explicitly excludes `/r/` so redirect requests are never delayed by session refresh logic.

## Database

Run from repo root:
- `pnpm db:generate` — generate Prisma client (must run after schema changes)
- `pnpm db:push` — push schema to Supabase (dev only, no migration file)
- `pnpm db:migrate` — create a migration file + apply
- `pnpm db:studio` — open Prisma Studio

## Dev

```bash
pnpm install        # install all workspace deps
pnpm dev            # start Next.js dev server on :3000
```

Fill in `apps/web/.env.local` before starting (copy from `.env.example`).

## Build phases

- Phase 0 (done): monorepo scaffold, Prisma schema, Supabase client setup
- Phase 1: Supabase project provisioning, first DB migration, env wired
- Phase 2: Supabase Auth flows, workspace creation, dashboard shell
- Phase 3: QR code CRUD + QR generation + image storage
- Phase 4: Redirect engine (Redis cache + scan logging)
- Phase 5: Analytics dashboard
- Phase 6: Stripe billing + plan limits
- Phase 7: Marketing landing page + launch
