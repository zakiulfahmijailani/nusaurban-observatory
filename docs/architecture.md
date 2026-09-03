# NusaUrban Observatory — System Architecture

## 1. High-Level Architecture

NusaUrban Observatory employs a **static-first, server-authoritative, cloud-native geospatial architecture**. It is engineered to deliver sub-second interactive visualization of massive multi-temporal Earth Observation datasets across mobile and desktop devices without requiring dedicated GPU spatial tile servers or polygonizing pixel classifications.

```
+-------------------------------------------------------------------------------+
|                               Browser Client                                  |
|  - Next.js 15 App Router (React 19, TypeScript strict)                       |
|  - MapLibre GL JS + PMTiles Protocol Driver                                   |
|  - Recharts accessible time-series data visualizations                       |
|  - Bilingual state manager (EN / ID dictionaries)                             |
+-------------------+------------------------------+----------------------------+
                    | HTTP REST / JSON             | HTTP Range Requests (206)
                    v                              v
+-------------------+------------------+   +------------------------------------+
|          Next.js Server API          |   |        Cloudflare R2 Bucket        |
|  - Route Handlers (/api/metrics, etc)|   |  - tiles/{city}/*.pmtiles          |
|  - Zod Input & Schema Validation     |   |  - boundaries/*.geojson            |
|  - Caching & Cache-Control headers   |   |  - metadata/*.json, *.csv          |
|  - Data Repository Interface         |   +------------------------------------+
+-------------------+------------------+
                    |
                    +------------------------------------+
                    |                                    |
                    v (if DATABASE_URL configured)       v (fallback fixture mode)
+-------------------+------------------+   +------------------------------------+
|          Neon PostgreSQL             |   |        Local Research Records      |
|  - cities, dataset_versions          |   |  - GEE_WEBGIS_JAKARTA/*.csv        |
|  - annual_metrics, change_summaries  |   |  - GEE_WEBGIS_BANDUNG/*.csv        |
|  - publications, ingest_runs         |   |  - Typed repository mapper         |
+--------------------------------------+   +------------------------------------+
```

## 2. Cloudflare R2 Cloud-Optimized Tile Serving

1. **Format:** Pre-rendered RGBA Cloud-Optimized PMTiles (Protomaps format) at native 10m spatial resolution.
2. **Streaming via Range Requests:** MapLibre issues standard HTTP `Range: bytes=start-end` requests. When panning or zooming, only the single 256×256 tile slice is transferred over the wire (~15–30 KB).
3. **No Massive GeoJSON Bloat:** Raster tiles remain as rasters rather than polygonizing hundreds of thousands of individual pixels into heavy GeoJSON features.
4. **Boundary Overlay:** City administrative boundaries are loaded asynchronously as GeoJSON line layers on top of the raster stack.

## 3. Database Layer (Neon PostgreSQL + Drizzle ORM)

- **PostgreSQL on Neon Serverless:** Provides transactional storage for tabular annual metrics, confusion matrices, dataset versions, change summaries, and ingest logs.
- **Fail-Safe Repository Pattern:** The data access layer (`src/lib/data/repository.ts`) automatically falls back to local CSV fixtures if `DATABASE_URL` is omitted, allowing zero-friction local development and preview deployments without credentials.

## 4. Bilingual Internationalization (i18n)

- Centralized typed dictionary interface (`src/i18n/types.ts`).
- Fully localized English (`en.ts`) and Bahasa Indonesia (`id.ts`) dictionaries with structured terminology adhering to scientific standards.
- Persistent client-side preference with zero hydration layout shifts.
