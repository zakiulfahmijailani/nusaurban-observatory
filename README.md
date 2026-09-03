# NusaUrban Observatory
> **Urban Growth and Green-Space Monitoring for Indonesia**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black.svg)]()
[![Bilingual](https://img.shields.io/badge/Language-EN%20%7C%20ID-success.svg)]()
[![DOI](https://img.shields.io/badge/DOI-10.31315%2Fimagi.v6i1.16592-blue.svg)](https://doi.org/10.31315/imagi.v6i1.16592)

NusaUrban Observatory is a production-ready, bilingual WebGIS platform that transforms published urban remote-sensing research into an interactive, scalable, and scientifically responsible public observatory.

Visualizes research findings from:
> **“Monitoring Urban Expansion and Green-Space Deficits in Jakarta and Bandung (2017–2025) Using Sentinel-2, Random Forest, and GEE”**  
> *Authors:* Zakiul Fahmi Jailani, Shidiq Al-Hakim, Ferrell Ananda Darmawan  
> *Journal:* Jurnal Ilmiah Geomatika, Vol 6, Iss 1, 2026, pp. 129–141  
> *DOI:* [10.31315/imagi.v6i1.16592](https://doi.org/10.31315/imagi.v6i1.16592)

---

## 🏛️ Architecture Summary

```
Browser (Client)
  ├── MapLibre GL JS + PMTiles Protocol (HTTP 206 Range Requests)
  ├── Bilingual Dictionary (EN / ID)
  └── Responsive Layout (Desktop multi-pane & Mobile bottom sheet)
Next.js 15 App Router Server
  ├── Route Handlers (/api/metrics, /api/cities, /api/change-summary)
  ├── Zod Input Validation & Public Cache-Control Headers
  └── Data Access Layer (Neon PostgreSQL with automatic local fixture fallback)
Cloudflare R2 Object Storage
  ├── tiles/{city}/*.pmtiles (Pre-rendered 10m LULC & vegetation change rasters)
  ├── boundaries/{city}_boundary.geojson
  └── metadata/webgis_manifest.json, annual_metrics.csv
Neon PostgreSQL (Drizzle ORM)
  └── cities, annual_metrics, change_summaries, dataset_versions, ingest_runs
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 20+ installed
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your variables:
```env
# Optional: Neon PostgreSQL (if left blank, platform runs on verified local fixtures)
DATABASE_URL=

# Cloudflare R2 Public Read-only Base URL (no trailing slash)
NEXT_PUBLIC_R2_BASE_URL=https://pub-87a04e038b1946e2b78041da54a6a4a3.r2.dev

# Site Base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Scientific Dataset Validation Gate
# Keep false until research authors confirm canonical reconciled release
NEXT_PUBLIC_DATASET_VALIDATED=false
```

---

## 💻 CLI Commands

| Command | Action |
|---|---|
| `npm run dev` | Start local development server on `http://localhost:3000` |
| `npm run build` | Compile optimized production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint strict checks |
| `npm test` | Run Vitest unit & integration test suite (18 tests) |
| `npm run data:audit` | Run reconciliation audit against published paper anchors |
| `npm run data:import` | Validate and ingest CSV datasets into database/fixtures |

---

## 📊 Scientific Data Reconciliation Status

The platform features an automated data reconciliation gate (`npm run data:audit`).

- **Jakarta 2025 Vegetation & RTH:** Exact match (`60.77 km²`, `14.20%`).
- **Bandung 2025 Vegetation & RTH:** Exact match (`8.53 km²`, `8.52%`).
- **Discrepancy Documented:** GEE export CSVs contain higher 2017 vegetation area for Jakarta (`102.04 km²` vs published `52.57 km²`) due to total administrative envelope versus clipped mainland boundary analysis.
- **Scientific Policy:** Discrepancies are **never silently averaged, merged, or overwritten**. While `NEXT_PUBLIC_DATASET_VALIDATED=false`, a discreet notice is displayed to users.
- Full details: See [`docs/data-reconciliation-report.md`](docs/data-reconciliation-report.md) and [`data/reconciliation-report.json`](data/reconciliation-report.json).

---

## 🗺️ Key Features

1. **Interactive Observatory Map (`/explore`):**
   - Multi-city selector (Jakarta, Bandung)
   - Annual slider & playback animation (2017–2025)
   - Layer toggles (Annual LULC vs. Cumulative 9-pixel filtered vegetation change)
   - Real-time analytical side panel showing Satellite-derived RTH proxy, distance from 30% policy benchmark, and classification reliability (Overall Accuracy & Kappa)
2. **Comparison System (`/compare`):**
   - Interactive draggable Swipe divider mode
   - Synchronized Side-by-Side dual-map mode
3. **Transparent Methodology (`/methodology`):**
   - Detailed breakdown of Sentinel-2 preprocessing, spectral indices (NDVI, SAVI, EVI, NDBI, NDMI, NDWI), Random Forest classification, and 9-pixel patch filtering.
4. **Data Catalogue (`/data`):**
   - Public download access to metrics CSVs, GeoJSON boundaries, and manifest.
5. **Full Bilingual Support:**
   - English (default) and Bahasa Indonesia with scientific terminology.

---

## 🌆 How to Add a New City

Adding a new city requires **zero code changes**:
1. Run Earth Engine classification using `gee_exports/` templates.
2. Generate PMTiles using `NusaUrban_GEE_to_WebGIS.ipynb` and upload to Cloudflare R2 (`tiles/{city}/`).
3. Add the city coordinate bounds to `src/lib/constants.ts`.
4. Run `npm run data:import`.
5. See [`docs/adding-a-city.md`](docs/adding-a-city.md) for full instructions.

---

## 📄 Documentation Directory

- [`docs/architecture.md`](docs/architecture.md) — System architecture, range requests, and components
- [`docs/data-model.md`](docs/data-model.md) — PostgreSQL Drizzle schema and entity relationships
- [`docs/data-reconciliation-report.md`](docs/data-reconciliation-report.md) — Numerical audit vs. published paper anchors
- [`docs/r2-setup.md`](docs/r2-setup.md) — Cloudflare R2 bucket setup and CORS policy
- [`docs/neon-setup.md`](docs/neon-setup.md) — Serverless PostgreSQL setup and migrations
- [`docs/deployment.md`](docs/deployment.md) — Production deployment instructions
- [`docs/adding-a-city.md`](docs/adding-a-city.md) — Extensibility guide
- [`docs/scientific-language-guide.md`](docs/scientific-language-guide.md) — Standardized scientific phrasing and limitations

---

## ⚖️ Scientific Disclaimer & Citation

Outputs are derived from satellite remote sensing and automated classification as monitoring indicators. They represent a **repeatable spectral proxy** and do not distinguish public and private green space, nor do they replace official cadastral, legal, planning, or field-verified land records.

```bibtex
@article{jailani2026monitoring,
  title={Monitoring Urban Expansion and Green-Space Deficits in Jakarta and Bandung (2017--2025) Using Sentinel-2, Random Forest, and GEE},
  author={Jailani, Zakiul Fahmi and Al-Hakim, Shidiq and Darmawan, Ferrell Ananda},
  journal={Jurnal Ilmiah Geomatika},
  volume={6},
  number={1},
  pages={129--141},
  year={2026},
  doi={10.31315/imagi.v6i1.16592}
}
```
