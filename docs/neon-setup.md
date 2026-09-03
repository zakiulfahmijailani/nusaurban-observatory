# Neon PostgreSQL Setup & Migrations

NusaUrban Observatory connects to serverless Neon PostgreSQL using `@neondatabase/serverless` and Drizzle ORM.

## 1. Create a Neon Project
1. Log in to [Neon Console](https://console.neon.tech).
2. Create a new project: `nusaurban`.
3. Copy the pooled connection string (`postgres://...`).

## 2. Environment Configuration
Add the connection string to `.env.local`:
```env
DATABASE_URL=postgres://user:password@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

> [!WARNING]
> Never commit `DATABASE_URL` to GitHub. It is exclusively read server-side by Next.js Route Handlers and ingestion scripts, and is never bundled into client JavaScript.

## 3. Database Migration Steps

Run Drizzle schema push or migration generator:
```bash
# Push schema directly to Neon DB
npx drizzle-kit push

# Or generate SQL migrations
npx drizzle-kit generate
```

## 4. Ingesting Research Data into Neon

Once the database is initialized, run the idempotent data importer:
```bash
npm run data:import
```

The importer will:
1. Verify source CSV integrity with SHA-256 hashes.
2. Validate rows via Zod.
3. Upsert annual metrics, change summaries, and cities.
4. Record the execution in `ingest_runs`.
