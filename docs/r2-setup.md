# Cloudflare R2 Configuration Guide

NusaUrban Observatory relies on Cloudflare R2 for streaming high-resolution raster PMTiles and GeoJSON vector boundaries.

## 1. Bucket Structure

```
nusaurban-bucket/
├── tiles/
│   ├── jakarta/
│   │   ├── jakarta_lulc_2017.pmtiles
│   │   ├── ...
│   │   ├── jakarta_lulc_2025.pmtiles
│   │   └── jakarta_vegetation_change_2017_2025.pmtiles
│   └── bandung/
│       ├── bandung_lulc_2017.pmtiles
│       ├── ...
│       ├── bandung_lulc_2025.pmtiles
│       └── bandung_vegetation_change_2017_2025.pmtiles
├── boundaries/
│   ├── jakarta_boundary.geojson
│   └── bandung_boundary.geojson
└── metadata/
    ├── webgis_manifest.json
    ├── annual_metrics.csv
    ├── raster_vs_gee_statistics_check.csv
    └── pmtiles_inventory.csv
```

## 2. Mandatory CORS Configuration

Cloudflare R2 must accept HTTP Range Requests and expose content-range headers to the browser client. In the Cloudflare Dashboard:
1. Navigate to **R2 > Buckets > Settings > CORS Policy**.
2. Apply the following JSON policy:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://*.vercel.app",
      "https://nusaurban.org"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "Range",
      "Content-Type",
      "Accept",
      "Origin",
      "Authorization"
    ],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Range",
      "Accept-Ranges",
      "ETag"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

## 3. Public Domain & HTTP 206 Partial Content Verification

PMTiles relies on HTTP `206 Partial Content`. You can test whether your public R2 domain is configured correctly using `curl`:

```bash
curl -I -H "Range: bytes=0-1024" https://<YOUR_R2_DOMAIN>/tiles/jakarta/jakarta_lulc_2025.pmtiles
```

**Expected Response Headers:**
```http
HTTP/2 206
accept-ranges: bytes
content-range: bytes 0-1024/1941953
content-length: 1025
etag: "..."
```

## 4. Environment Variable Configuration

Add your public R2 domain (without trailing slash) to `.env.local`:
```env
NEXT_PUBLIC_R2_BASE_URL=https://pub-87a04e038b1946e2b78041da54a6a4a3.r2.dev
```
