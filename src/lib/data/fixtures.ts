import fs from 'fs';
import path from 'path';
import { PUBLICATION } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Simple CSV parser — handles the GEE export format
// ---------------------------------------------------------------------------

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0]!.split(',').map(h => h.trim());
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === '') continue;

    // Handle quoted fields (the .geo column contains JSON with commas)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length && j < values.length; j++) {
      const key = headers[j]!;
      // Skip GEE-only columns
      if (key === 'system:index' || key === '.geo') continue;
      row[key] = values[j]!;
    }
    result.push(row);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Paths to source CSV files (in the parent directory)
// ---------------------------------------------------------------------------

function getBasePath(): string {
  // In Next.js, process.cwd() returns the project root (nusaurban/)
  // Source data is in the parent directory (project_urban/)
  return path.join(process.cwd(), '..');
}

function getStatsPath(city: string): string {
  const folder = city === 'jakarta' ? 'GEE_WEBGIS_JAKARTA' : 'GEE_WEBGIS_BANDUNG';
  const file = `${city}_annual_stats_2017_2025.csv`;
  return path.join(getBasePath(), folder, file);
}

function getChangePath(city: string): string {
  const folder = city === 'jakarta' ? 'GEE_WEBGIS_JAKARTA' : 'GEE_WEBGIS_BANDUNG';
  const file = `${city}_change_summary_2017_2025.csv`;
  return path.join(getBasePath(), folder, file);
}

// ---------------------------------------------------------------------------
// Safe file reading
// ---------------------------------------------------------------------------

function readAndParseSafe(filePath: string): Record<string, string>[] {
  try {
    if (fs.existsSync(filePath)) {
      return parseCSV(fs.readFileSync(filePath, 'utf8'));
    }
    console.warn(`⚠️ Fixture file not found: ${filePath}`);
    return [];
  } catch (e) {
    console.error(`❌ Error reading fixture: ${filePath}`, e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Safe number parsing
// ---------------------------------------------------------------------------

function safeFloat(val: string | undefined): number | null {
  if (val == null || val === '' || val === 'null' || val === 'undefined') return null;
  const n = parseFloat(val);
  return Number.isNaN(n) ? null : n;
}

function safeInt(val: string | undefined, fallback: number = 0): number {
  if (val == null || val === '') return fallback;
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? fallback : n;
}

// ---------------------------------------------------------------------------
// Type definitions for fixture data
// ---------------------------------------------------------------------------

export interface FixtureMetric {
  city: string;
  year: number;
  accuracy: number | null;
  kappa: number | null;
  veg_km2: number | null;
  veg_pct: number | null;
  water_km2: number | null;
  water_pct: number | null;
  urban_km2: number | null;
  urban_pct: number | null;
  open_km2: number | null;
  open_pct: number | null;
  total_km2: number | null;
  rth_proxy_km2: number | null;
  rth_proxy_pct: number | null;
  rth_target_pct: number;
  rth_deficit_km2: number | null;
  rth_deficit_pct: number | null;
  rth_compliant: boolean;
  pa_veg: number | null;
  ua_veg: number | null;
  pa_water: number | null;
  ua_water: number | null;
  pa_urban: number | null;
  ua_urban: number | null;
  pa_open: number | null;
  ua_open: number | null;
  analysis_version: string;
  pixel_size_m: number;
  source_file: string;
  reconciliation_status: string;
}

export interface FixtureChangeSummary {
  city: string;
  baseline_year: number;
  final_year: number;
  baseline_vegetation_km2: number | null;
  final_vegetation_km2: number | null;
  endpoint_net_change_km2: number | null;
  filtered_loss_km2: number | null;
  filtered_gain_km2: number | null;
  filtered_net_change_km2: number | null;
  minimum_patch_pixels: number;
  connectivity: number;
  pixel_size_m: number;
  source_file: string;
  reconciliation_status: string;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapAnnualMetric(row: Record<string, string>, citySlug: string, sourceFile: string): FixtureMetric {
  return {
    city: citySlug.toLowerCase(),
    year: safeInt(row['year']),
    accuracy: safeFloat(row['accuracy']),
    kappa: safeFloat(row['kappa']),
    veg_km2: safeFloat(row['veg_km2']),
    veg_pct: safeFloat(row['veg_pct']),
    water_km2: safeFloat(row['water_km2']),
    water_pct: safeFloat(row['water_pct']),
    urban_km2: safeFloat(row['urban_km2']),
    urban_pct: safeFloat(row['urban_pct']),
    open_km2: safeFloat(row['open_km2']),
    open_pct: safeFloat(row['open_pct']),
    total_km2: safeFloat(row['total_km2']),
    rth_proxy_km2: safeFloat(row['rth_total_km2']),
    rth_proxy_pct: safeFloat(row['rth_pct']),
    rth_target_pct: safeFloat(row['rth_target_pct']) ?? 30,
    rth_deficit_km2: safeFloat(row['rth_deficit_km2']),
    rth_deficit_pct: safeFloat(row['rth_deficit_pct']),
    rth_compliant: safeInt(row['rth_compliant']) === 1,
    pa_veg: safeFloat(row['pa_veg']),
    ua_veg: safeFloat(row['ua_veg']),
    pa_water: safeFloat(row['pa_water']),
    ua_water: safeFloat(row['ua_water']),
    pa_urban: safeFloat(row['pa_urban']),
    ua_urban: safeFloat(row['ua_urban']),
    pa_open: safeFloat(row['pa_open']),
    ua_open: safeFloat(row['ua_open']),
    analysis_version: row['analysis_version'] ?? 'published_2017_2025',
    pixel_size_m: safeInt(row['pixel_size_m'], 10),
    source_file: sourceFile,
    reconciliation_status: 'pending',
  };
}

function mapChangeSummary(row: Record<string, string>, citySlug: string, sourceFile: string): FixtureChangeSummary {
  return {
    city: citySlug.toLowerCase(),
    baseline_year: safeInt(row['baseline_year']),
    final_year: safeInt(row['final_year']),
    baseline_vegetation_km2: safeFloat(row['baseline_vegetation_km2']),
    final_vegetation_km2: safeFloat(row['final_vegetation_km2']),
    endpoint_net_change_km2: safeFloat(row['endpoint_net_change_km2']),
    filtered_loss_km2: safeFloat(row['patch_filtered_loss_km2']),
    filtered_gain_km2: safeFloat(row['patch_filtered_gain_km2']),
    filtered_net_change_km2: safeFloat(row['patch_filtered_net_change_km2']),
    minimum_patch_pixels: safeInt(row['minimum_patch_pixels'], 9),
    connectivity: safeInt(row['connectivity'], 4),
    pixel_size_m: safeInt(row['pixel_size_m'], 10),
    source_file: sourceFile,
    reconciliation_status: 'pending',
  };
}

// ---------------------------------------------------------------------------
// Public fixture API
// ---------------------------------------------------------------------------

export function getFixtureCities() {
  return [
    {
      slug: 'jakarta',
      display_name: 'DKI Jakarta',
      country_code: 'ID',
      province: 'DKI Jakarta',
      description_en: 'Mainland DKI Jakarta (excluding Kepulauan Seribu), following the study scope. Indonesia\'s capital and largest metropolitan area.',
      description_id: 'Daratan DKI Jakarta (tidak termasuk Kepulauan Seribu), sesuai cakupan studi. Ibu kota dan wilayah metropolitan terbesar Indonesia.',
      center_longitude: 106.85,
      center_latitude: -6.2,
      default_zoom: 11,
      boundary_url: 'boundaries/jakarta_boundary.geojson',
    },
    {
      slug: 'bandung',
      display_name: 'Kota Bandung',
      country_code: 'ID',
      province: 'Jawa Barat',
      description_en: 'Kota Bandung, a highland city in West Java experiencing distinctive urbanization pressures.',
      description_id: 'Kota Bandung, kota dataran tinggi di Jawa Barat yang mengalami tekanan urbanisasi yang khas.',
      center_longitude: 107.61,
      center_latitude: -6.91,
      default_zoom: 12,
      boundary_url: 'boundaries/bandung_boundary.geojson',
    },
  ];
}

export function getFixtureDatasetVersion() {
  return {
    version_key: 'published_2017_2025',
    title: 'Published LULC Classification 2017–2025',
    description: 'Annual land-cover classification and vegetation-change analysis from Sentinel-2 imagery using Random Forest in Google Earth Engine.',
    source: 'Google Earth Engine classification exports',
    projection_source: 'EPSG:32748',
    map_projection: 'EPSG:3857',
    pixel_size_m: 10,
    min_zoom: 8,
    max_zoom: 14,
    status: 'published',
  };
}

export function getFixtureMetrics(city?: string, year?: number): FixtureMetric[] {
  const cities = city ? [city] : ['jakarta', 'bandung'];
  const allMetrics: FixtureMetric[] = [];

  for (const c of cities) {
    const filePath = getStatsPath(c);
    const fileName = path.basename(filePath);
    const rows = readAndParseSafe(filePath);
    const mapped = rows.map(r => mapAnnualMetric(r, c, fileName));
    allMetrics.push(...mapped);
  }

  if (year != null) {
    return allMetrics.filter(r => r.year === year);
  }
  return allMetrics.sort((a, b) => a.year - b.year);
}

export function getFixtureChangeSummary(city?: string): FixtureChangeSummary[] {
  const cities = city ? [city] : ['jakarta', 'bandung'];
  const allSummaries: FixtureChangeSummary[] = [];

  for (const c of cities) {
    const filePath = getChangePath(c);
    const fileName = path.basename(filePath);
    const rows = readAndParseSafe(filePath);
    const mapped = rows.map(r => mapChangeSummary(r, c, fileName));
    allSummaries.push(...mapped);
  }

  return allSummaries;
}

export function getFixturePublication() {
  return {
    title: PUBLICATION.title,
    authors: JSON.stringify(PUBLICATION.authors),
    journal: PUBLICATION.journal,
    year: PUBLICATION.year,
    volume: String(PUBLICATION.volume),
    issue: String(PUBLICATION.issue),
    pages: PUBLICATION.pages,
    doi: PUBLICATION.doi,
    citation: `${PUBLICATION.authors.join(', ')} (${PUBLICATION.year}). ${PUBLICATION.title}. ${PUBLICATION.journal}, ${PUBLICATION.volume}(${PUBLICATION.issue}), ${PUBLICATION.pages}. https://doi.org/${PUBLICATION.doi}`,
  };
}
