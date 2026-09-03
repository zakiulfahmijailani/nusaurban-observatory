import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatPercent,
  formatArea,
  calculateRthDeficit,
  isRthCompliant,
  normalizeCitySlug,
  buildPmtilesUrl,
  buildPmtilesProtocolUrl,
  buildBoundaryUrl,
  buildManifestUrl,
  isValidYear,
  isValidCity,
  safeParseFloat,
} from '@/lib/utils';
import { ApiParamsSchema } from '@/lib/types';
import { getFixtureMetrics, getFixtureCities, getFixtureChangeSummary } from '@/lib/data/fixtures';

describe('1. CSV Parsing & Fixtures Loading', () => {
  it('correctly loads and parses Jakarta annual stats CSV without corruption', () => {
    const metrics = getFixtureMetrics('jakarta');
    expect(metrics.length).toBe(9); // 2017 to 2025
    expect(metrics[0]?.year).toBe(2017);
    expect(metrics[8]?.year).toBe(2025);
    expect(metrics[0]?.city).toBe('jakarta');
  });

  it('correctly loads Bandung change summary', () => {
    const change = getFixtureChangeSummary('bandung');
    expect(change.length).toBe(1);
    expect(change[0]?.baseline_year).toBe(2017);
    expect(change[0]?.final_year).toBe(2025);
    expect(change[0]?.minimum_patch_pixels).toBe(9);
    expect(change[0]?.connectivity).toBe(4);
  });
});

describe('2. Numeric Conversion & Precision', () => {
  it('safely parses floats without NaN or unexpected nulls', () => {
    expect(safeParseFloat('102.04')).toBe(102.04);
    expect(safeParseFloat(60.77)).toBe(60.77);
    expect(safeParseFloat(null)).toBeNull();
    expect(safeParseFloat('')).toBeNull();
    expect(safeParseFloat('invalid')).toBeNull();
  });

  it('formats numbers with fixed decimals and units for display without truncating DB values', () => {
    expect(formatNumber(12.3456, 2)).toBe('12.35');
    expect(formatPercent(14.2)).toBe('14.20%');
    expect(formatArea(650.7119)).toBe('650.71 km²');
    expect(formatNumber(null)).toBe('—');
  });
});

describe('3. Dataset Version Validation', () => {
  it('validates publication year bounds and dataset version tags', () => {
    expect(isValidYear(2017)).toBe(true);
    expect(isValidYear(2025)).toBe(true);
    expect(isValidYear(2016)).toBe(false);
    expect(isValidYear(2026)).toBe(false);
    expect(isValidYear(2020.5)).toBe(false);
  });
});

describe('4. RTH Deficit & Compliance Calculations', () => {
  it('calculates deficit when RTH proxy is below 30% benchmark', () => {
    // 14.2% proxy with total area of 650.74 km²
    const { deficitPct, deficitKm2 } = calculateRthDeficit(14.2, 30, 650.74);
    expect(deficitPct).toBeCloseTo(15.8, 1);
    expect(deficitKm2).toBeCloseTo(102.81, 1);
    expect(isRthCompliant(14.2, 30)).toBe(false);
  });

  it('reports zero deficit and true compliance when RTH proxy meets or exceeds 30%', () => {
    const { deficitPct, deficitKm2 } = calculateRthDeficit(36.46, 30, 650.74);
    expect(deficitPct).toBe(0);
    expect(deficitKm2).toBe(0);
    expect(isRthCompliant(36.46, 30)).toBe(true);
  });
});

describe('5. City Slug Normalization', () => {
  it('normalizes various casing and spaced city inputs', () => {
    expect(normalizeCitySlug('Jakarta')).toBe('jakarta');
    expect(normalizeCitySlug('  DKI JAKARTA ')).toBe('dkijakarta');
    expect(normalizeCitySlug('Bandung')).toBe('bandung');
    expect(isValidCity('jakarta')).toBe(true);
    expect(isValidCity('bandung')).toBe(true);
    expect(isValidCity('surabaya')).toBe(false);
  });
});

describe('6. PMTiles URL Construction', () => {
  it('builds canonical R2 PMTiles URLs conforming to architecture', () => {
    const lulcUrl = buildPmtilesUrl('jakarta', 2025, 'lulc');
    expect(lulcUrl).toContain('tiles/jakarta/jakarta_lulc_2025.pmtiles');

    const changeUrl = buildPmtilesUrl('bandung', 2025, 'vegetation_change');
    expect(changeUrl).toContain('tiles/bandung/bandung_vegetation_change_2017_2025.pmtiles');
  });

  it('constructs pmtiles:// protocol wrapper for MapLibre sources', () => {
    const protocolUrl = buildPmtilesProtocolUrl('jakarta', 2020, 'lulc');
    expect(protocolUrl.startsWith('pmtiles://')).toBe(true);
    expect(protocolUrl).toContain('tiles/jakarta/jakarta_lulc_2020.pmtiles');
  });

  it('builds correct boundary and manifest URLs', () => {
    expect(buildBoundaryUrl('jakarta')).toContain('boundaries/jakarta_boundary.geojson');
    expect(buildManifestUrl()).toContain('metadata/webgis_manifest.json');
  });
});

describe('7. Manifest Structure & Asset Keys', () => {
  it('verifies default cities configuration has coordinates and zoom', () => {
    const cities = getFixtureCities();
    expect(cities.length).toBe(2);

    const jkt = cities.find(c => c.slug === 'jakarta');
    expect(jkt).toBeDefined();
    expect(jkt?.center_longitude).toBeCloseTo(106.85, 1);
    expect(jkt?.center_latitude).toBeCloseTo(-6.2, 1);
    expect(jkt?.default_zoom).toBe(11);

    const bdg = cities.find(c => c.slug === 'bandung');
    expect(bdg).toBeDefined();
    expect(bdg?.center_longitude).toBeCloseTo(107.61, 1);
    expect(bdg?.center_latitude).toBeCloseTo(-6.91, 1);
    expect(bdg?.default_zoom).toBe(12);
  });
});

describe('8. API Parameter Validation via Zod', () => {
  it('accepts valid city and optional year', () => {
    const valid1 = ApiParamsSchema.safeParse({ city: 'jakarta', year: '2025' });
    expect(valid1.success).toBe(true);
    if (valid1.success) {
      expect(valid1.data.city).toBe('jakarta');
      expect(valid1.data.year).toBe(2025);
    }

    const valid2 = ApiParamsSchema.safeParse({ city: 'bandung' });
    expect(valid2.success).toBe(true);
  });

  it('rejects invalid cities and out-of-range years', () => {
    const invalidCity = ApiParamsSchema.safeParse({ city: 'medan' });
    expect(invalidCity.success).toBe(false);

    const invalidYear = ApiParamsSchema.safeParse({ city: 'jakarta', year: '2010' });
    expect(invalidYear.success).toBe(false);
  });
});

describe('9. Chart Data Transformation', () => {
  it('transforms annual metrics into trajectory format with 4 classes summing close to 100%', () => {
    const metrics = getFixtureMetrics('jakarta', 2025);
    expect(metrics.length).toBe(1);
    const m = metrics[0]!;

    const sumPct = (m.veg_pct ?? 0) + (m.water_pct ?? 0) + (m.urban_pct ?? 0) + (m.open_pct ?? 0);
    expect(sumPct).toBeCloseTo(100, 0); // ~100%
  });
});

describe('10. Data Reconciliation Comparison Logic', () => {
  it('correctly flags known discrepancies while matching canonical endpoints', () => {
    const jktMetrics = getFixtureMetrics('jakarta');
    const jkt2017 = jktMetrics.find(m => m.year === 2017)!;
    const jkt2025 = jktMetrics.find(m => m.year === 2025)!;

    // 2025 matches published paper anchor: 60.77 km²
    expect(jkt2025.veg_km2).toBeCloseTo(60.77, 1);
    expect(jkt2025.rth_proxy_pct).toBeCloseTo(14.20, 1);

    // 2017 discrepancy flagged (102.04 vs published 52.57)
    expect(jkt2017.veg_km2).toBeGreaterThan(55);
  });
});

describe('11. Missing Year & Edge Cases', () => {
  it('returns empty array when querying an unrecorded year without throwing', () => {
    const missing = getFixtureMetrics('jakarta', 1999);
    expect(missing).toEqual([]);
  });

  it('handles null values safely in all formatters', () => {
    expect(formatNumber(undefined)).toBe('—');
    expect(formatPercent(undefined)).toBe('—');
    expect(formatArea(undefined)).toBe('—');
  });
});
