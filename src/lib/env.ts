import { z } from 'zod';

// ---------------------------------------------------------------------------
// Environment Variable Validation
// ---------------------------------------------------------------------------
// Client-side variables are validated at import time.
// Server-side variables are validated lazily on first use.
// Missing values produce helpful messages instead of crashes.
// ---------------------------------------------------------------------------

const clientSchema = z.object({
  NEXT_PUBLIC_R2_BASE_URL: z
    .string()
    .default('')
    .transform((v) => v.replace(/\/$/, '')),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .default('http://localhost:3000'),
  NEXT_PUBLIC_MAP_STYLE_URL: z
    .string()
    .default(''),
  NEXT_PUBLIC_DATASET_VALIDATED: z
    .string()
    .default('false'),
});

// Parse client env (safe — all have defaults)
const clientResult = clientSchema.safeParse({
  NEXT_PUBLIC_R2_BASE_URL: process.env.NEXT_PUBLIC_R2_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MAP_STYLE_URL: process.env.NEXT_PUBLIC_MAP_STYLE_URL,
  NEXT_PUBLIC_DATASET_VALIDATED: process.env.NEXT_PUBLIC_DATASET_VALIDATED,
});

export const clientEnv = clientResult.success
  ? clientResult.data
  : {
      NEXT_PUBLIC_R2_BASE_URL: '',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_MAP_STYLE_URL: '',
      NEXT_PUBLIC_DATASET_VALIDATED: 'false',
    };

/**
 * Get the DATABASE_URL (server-side only).
 * Returns null if not configured.
 */
export function getDatabaseUrl(): string | null {
  if (typeof window !== 'undefined') {
    throw new Error('DATABASE_URL must not be accessed on the client side');
  }
  return process.env.DATABASE_URL ?? null;
}

/**
 * Check if the database is available
 */
export function isDatabaseAvailable(): boolean {
  return typeof window === 'undefined' && !!process.env.DATABASE_URL;
}

/**
 * Check if the dataset has been validated
 */
export function isDatasetValidated(): boolean {
  return clientEnv.NEXT_PUBLIC_DATASET_VALIDATED === 'true';
}

/**
 * Get R2 base URL (no trailing slash)
 */
export function getR2BaseUrl(): string {
  return clientEnv.NEXT_PUBLIC_R2_BASE_URL;
}
