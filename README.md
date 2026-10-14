# wassaphas.com

Personal portfolio of **Wassaphas Thongsopa** — full-stack developer & AI builder.

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4 |
| Backend | Next.js Route Handlers + Server Actions |
| Database | MariaDB via `mysql2` |
| Hosting | VPS · Nginx · PM2 · Cloudflare |
| CI/CD | GitHub Actions → standalone build → release-folder deploy with health-checked rollback |

## Run locally

```bash
npm install
npm run dev
```

Without `DATABASE_URL` the site renders [`db/seed.json`](db/seed.json) read-only, so you can
work on the UI with no database. To use a real one, copy `.env.example` to `.env.local`, then:

```bash
npm run db:migrate
npm run db:seed
```

### Adding a dependency on Windows

`npm install <pkg>` on Windows can drop the Linux-only `@emnapi/*` entries from
`package-lock.json`, and then `npm ci` fails in CI. After adding a package, regenerate the
lockfile from scratch:

```bash
rm -rf node_modules package-lock.json && npm install
```

## Where content lives

- **Name, tagline, about, links** — [`src/content/profile.ts`](src/content/profile.ts) (ships with a deploy)
- **Projects, skills, experience** — MariaDB, edited at `/admin` (projects) or seeded from `db/seed.json` on first deploy
- **Contact messages** — MariaDB, read at `/admin`
- **Visitor analytics** — page views and clicks on links/buttons, read at `/admin/analytics`.
  No cookies and no raw IPs: a visitor is a hash that changes daily. Bots and a signed-in
  admin aren't counted. Add `data-track="name"` to an element to label it in the report.

## API

| Method | Path | |
|---|---|---|
| GET | `/api/projects` | Published projects as JSON |
| POST | `/api/contact` | `{ name, email, message }` — validated, rate-limited per IP (3 / 10 min) |
| POST | `/api/track` | Page view / click beacon from the site (always 204) |
| GET | `/api/health` | `{ status, db }` — used by the deploy health check |

## Database changes

Add a new file `db/migrations/NNN_description.sql`. Never edit one that has been applied —
`scripts/migrate.mjs` records applied files in `schema_migrations` and runs on every deploy.

## Deploy

Push to `main`. The workflow lints, typechecks and builds, uploads the standalone bundle, and
[`deploy/remote-deploy.sh`](deploy/remote-deploy.sh) unpacks it into a new release folder,
migrates, switches `current`, and rolls back if `/api/health` doesn't report the database as ok.

Repository secrets: `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`.
Runtime secrets live only on the server in `/srv/wassaphas/shared/.env`.
