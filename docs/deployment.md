# Deployment Guide — NusaUrban Observatory

NusaUrban Observatory is optimized for deployment on Vercel, Cloudflare Pages, or containerized Docker environments.

## 1. Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Neon PostgreSQL database initialized (optional; fixtures work by default)
- [ ] Cloudflare R2 bucket with uploaded PMTiles and CORS configured
- [ ] Environment variables configured

## 2. Environment Variables in Production

| Variable | Description | Example | Required |
|---|---|---|---|
| `DATABASE_URL` | Neon pooled PostgreSQL connection string | `postgres://user:pass@ep-pooler.us-east-2.aws.neon.tech/neondb` | Optional (falls back to fixtures) |
| `NEXT_PUBLIC_R2_BASE_URL` | Public read-only R2 domain | `https://pub-87a04e038b1946e2b78041da54a6a4a3.r2.dev` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Production website URL | `https://nusaurban.org` | Yes |
| `NEXT_PUBLIC_DATASET_VALIDATED` | Scientific data validation gate | `false` (keep false until author review) | Yes |

> [!CAUTION]
> Keep `NEXT_PUBLIC_DATASET_VALIDATED=false` until the canonical reconciliation audit is reviewed and signed off. When set to `false`, the platform displays the reconciliation progress notice and prevents search engine indexing (`robots.txt: noindex`).

## 3. Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. In Vercel, import the project with root directory set to `nusaurban`.
3. Set the Environment Variables listed above.
4. Set Build Command: `npm run build`
5. Deploy!

## 4. Health & Verification

Once deployed, query the health endpoint:
```bash
curl https://<YOUR_DEPLOYED_URL>/api/health
```

Expected JSON response:
```json
{
  "data": {
    "status": "ok",
    "database_connected": false,
    "using_fixtures": true,
    "dataset_validated": false,
    "dataset_version": "published_2017_2025"
  }
}
```
