# Adding a New City to NusaUrban Observatory

NusaUrban Observatory is engineered to support adding new Indonesian cities (e.g., Surabaya, Medan, Makassar, IKN Nusantara) **purely through data and configuration**, without redesigning or rewriting application components.

---

## Workflow Overview

```
GEE Export Script  ──>  Colab PMTiles Pipeline  ──>  Cloudflare R2  ──>  Import CLI  ──>  Platform Live!
```

---

## Step 1: Run Google Earth Engine Classification
1. Duplicate `gee_exports/jakarta_webgis_exports.js` (or `bandung_webgis_exports.js`).
2. Update:
   - `WEBGIS_CITY = 'Surabaya'`
   - `WEBGIS_FOLDER = 'GEE_WEBGIS_SURABAYA'`
   - Boundary table asset: `projects/.../batas_surabaya`
3. Execute tasks to export:
   - 9 annual categorical LULC rasters (2017–2025)
   - 1 vegetation-change raster (2017–2025)
   - 1 annual stats CSV
   - 1 change summary CSV
   - 1 boundary GeoJSON

## Step 2: Convert to PMTiles via Colab Notebook
1. Open `NusaUrban_GEE_to_WebGIS.ipynb`.
2. Add the new city slug to the processing loop:
   ```python
   CITIES = ["jakarta", "bandung", "surabaya"]
   ```
3. Run sections to reproject (EPSG:3857), style RGBA PNGs, pyramid overviews (zoom 8–14), and convert to `.pmtiles`.
4. Upload to Cloudflare R2:
   - `tiles/surabaya/surabaya_lulc_{year}.pmtiles`
   - `tiles/surabaya/surabaya_vegetation_change_2017_2025.pmtiles`
   - `boundaries/surabaya_boundary.geojson`

## Step 3: Register City in the Platform
Add the new city configuration in `src/lib/constants.ts`:
```typescript
export const CITIES = {
  // ... existing cities
  surabaya: {
    id: 'surabaya',
    name: 'Kota Surabaya',
    province: 'Jawa Timur',
    center: [112.75, -7.25] as [number, number],
    zoom: 12,
  },
};
```

Update `src/lib/types.ts`:
```typescript
export type CitySlug = 'jakarta' | 'bandung' | 'surabaya';
```

## Step 4: Run Data Ingestion
Run the import command:
```bash
npm run data:import
```

The new city will immediately appear in:
- The Home page city cards
- Map city switcher
- Compare page
- Analytical side panel
- Land-cover trajectory charts
- Data catalogue download links
