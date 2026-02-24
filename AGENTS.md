# AGENTS.md

## Cursor Cloud specific instructions

This is the **Rubric Labs marketing website** — a single Next.js 16 app (not a monorepo). No database, no Docker, no external services required for local dev.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `bun install` |
| Dev server | `bun dev` (serves on `localhost:3000`) |
| Build | `bun run build` |
| Lint/format | `bun run format` (runs Biome) |

### Environment variables

A `.env.local` file is required for the dev server to start (env validation via `@t3-oss/env-nextjs` in `src/lib/env.ts` will crash without it). Required vars:

- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog analytics key (stub value works for dev)
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog host (stub value works for dev)
- `ROS_API_URL` — External API for contact form/newsletter (stub value works; form submit will fail gracefully)
- `ROS_SECRET` — Bearer token for ROS API (stub value works for dev)
- `URL` — Site URL, use `localhost:3000` for dev

If `.env.local` does not exist, create it with stub values so the dev server can start.

### Caveats

- **No test suite exists** — there are no test files or test scripts in this repo.
- The `@rubriclab/config` package (providing shared Biome/TS config) resolves from npm despite using `"*"` version; `bun install` handles this correctly.
- The `package.json` README section mentions Prisma but there is no Prisma setup in this repo — it's boilerplate from `create-rubric-app`.
- Blog content is MDX files in `src/lib/posts/`; newsletter data is a `.jsonl` file. No database needed.
