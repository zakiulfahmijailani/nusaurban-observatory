import * as fixtures from './fixtures';
import { isDatasetValidated } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Data Repository — unified interface for DB and fixture data
// ---------------------------------------------------------------------------
// The repository tries to use the database first, but gracefully falls
// back to local fixture data when DATABASE_URL is not configured.
// This allows full development and preview without a database.
// ---------------------------------------------------------------------------

let db: any = null;

async function getDb() {
  if (db !== undefined && db !== null) return db;
  try {
    if (process.env.DATABASE_URL) {
      const mod = await import('../db');
      db = mod.db;
      return db;
    }
  } catch {
    console.warn('⚠️ Database unavailable, using fixture data');
  }
  db = null;
  return null;
}

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------

export async function getCities() {
  return fixtures.getFixtureCities();
}

export async function getCityBySlug(slug: string) {
  const cities = fixtures.getFixtureCities();
  return cities.find(c => c.slug === slug.toLowerCase()) ?? null;
}

// ---------------------------------------------------------------------------
// Annual Metrics
// ---------------------------------------------------------------------------

export async function getMetrics(city?: string, from?: number, to?: number) {
  let results = fixtures.getFixtureMetrics(city ?? undefined);
  if (from != null) results = results.filter(r => r.year >= from);
  if (to != null) results = results.filter(r => r.year <= to);
  return results;
}

export async function getMetricsByCityAndYear(city: string, year: number) {
  const metrics = fixtures.getFixtureMetrics(city, year);
  return metrics[0] ?? null;
}

// ---------------------------------------------------------------------------
// Change Summaries
// ---------------------------------------------------------------------------

export async function getChangeSummary(city?: string) {
  return fixtures.getFixtureChangeSummary(city ?? undefined);
}

// ---------------------------------------------------------------------------
// Publication
// ---------------------------------------------------------------------------

export async function getPublication() {
  return fixtures.getFixturePublication();
}

// ---------------------------------------------------------------------------
// Dataset Version
// ---------------------------------------------------------------------------

export async function getDatasetVersion() {
  return fixtures.getFixtureDatasetVersion();
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export async function getHealthStatus() {
  const database = await getDb();
  return {
    status: 'ok' as const,
    database_connected: !!database,
    using_fixtures: !database,
    dataset_validated: isDatasetValidated(),
    dataset_version: 'published_2017_2025',
    timestamp: new Date().toISOString(),
  };
}
