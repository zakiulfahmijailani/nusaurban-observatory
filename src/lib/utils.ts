import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Number formatting (display only — originals stay in DB at full precision)
// ---------------------------------------------------------------------------

export function formatNumber(value: number | null | undefined, decimals = 2, unit = ''): string {
  if (value == null || Number.isNaN(value)) return '—';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatPercent(value: number | null | undefined, decimals = 2): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${formatNumber(value, decimals)}%`;
}

export function formatArea(value: number | null | undefined, unit = 'km²'): string {
  if (value == null || Number.isNaN(value)) return '—';
  return formatNumber(value, 2, unit);
}

// ---------------------------------------------------------------------------
// R2 URL construction — matches actual Cloudflare R2 structure
// ---------------------------------------------------------------------------

export function getR2BaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_R2_BASE_URL ?? '';
  return base.replace(/\/$/, '');
}

/** Build a full public R2 URL from a relative asset path */
export function buildR2Url(path: string): string {
  const base = getR2BaseUrl();
  if (!base) return path; // fallback for missing env
  return `${base}/${path.replace(/^\//, '')}`;
}

/** PMTiles URL for a given city, year, and kind */
export function buildPmtilesUrl(city: string, year: number | string, kind: 'lulc' | 'vegetation_change'): string {
  if (kind === 'lulc') {
    return buildR2Url(`tiles/${city}/${city}_lulc_${year}.pmtiles`);
  }
  // vegetation_change is always 2017_2025
  return buildR2Url(`tiles/${city}/${city}_vegetation_change_2017_2025.pmtiles`);
}

/** pmtiles:// protocol URL for MapLibre */
export function buildPmtilesProtocolUrl(city: string, year: number | string, kind: 'lulc' | 'vegetation_change'): string {
  const httpUrl = buildPmtilesUrl(city, year, kind);
  return `pmtiles://${httpUrl}`;
}

/** City boundary GeoJSON URL */
export function buildBoundaryUrl(city: string): string {
  return buildR2Url(`boundaries/${city}_boundary.geojson`);
}

/** Manifest URL */
export function buildManifestUrl(): string {
  return buildR2Url('metadata/webgis_manifest.json');
}

/** Annual metrics CSV URL */
export function buildMetricsCsvUrl(): string {
  return buildR2Url('metadata/annual_metrics.csv');
}

// ---------------------------------------------------------------------------
// RTH calculations
// ---------------------------------------------------------------------------

export function calculateRthDeficit(rthPct: number, targetPct: number, totalKm2: number): { deficitPct: number; deficitKm2: number } {
  if (rthPct >= targetPct) return { deficitPct: 0, deficitKm2: 0 };
  const deficitPct = targetPct - rthPct;
  const deficitKm2 = (deficitPct / 100) * totalKm2;
  return { deficitPct, deficitKm2 };
}

export function isRthCompliant(rthPct: number, targetPct: number = 30): boolean {
  return rthPct >= targetPct;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function yearRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function isValidYear(year: number): boolean {
  return year >= 2017 && year <= 2025 && Number.isInteger(year);
}

export function isValidCity(city: string): city is 'jakarta' | 'bandung' {
  return city === 'jakarta' || city === 'bandung';
}

export function normalizeCitySlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '');
}

/** Safe number parsing that never returns NaN silently */
export function safeParseFloat(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(value);
  return Number.isNaN(num) ? null : num;
}

/** Check if dataset is validated */
export function isDatasetValidated(): boolean {
  return process.env.NEXT_PUBLIC_DATASET_VALIDATED === 'true';
}
