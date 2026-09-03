import { clientEnv } from './env';
import { CitySlug, Year, MapAsset } from './types';
import { buildR2Url, buildPmtilesUrl, buildBoundaryUrl, buildManifestUrl } from './utils';
import { cache } from 'react';

export interface R2Manifest {
  version: string;
  updated: string;
  datasets: {
    city: CitySlug;
    year: number;
    kind: 'lulc' | 'change';
    path: string;
  }[];
}

/**
 * Build URL for PMTiles datasets on R2
 */
export function getPmtilesUrl(city: CitySlug, year: Year, kind: 'lulc' | 'change' = 'lulc'): string {
  return buildPmtilesUrl(city, year, kind === 'change' ? 'vegetation_change' : 'lulc');
}

/**
 * Build URL for City Boundary GeoJSON on R2
 */
export function getBoundaryUrl(city: CitySlug): string {
  return buildBoundaryUrl(city);
}

/**
 * Build URL for metadata or manifest
 */
export function getMetadataUrl(filename: string = 'metadata/webgis_manifest.json'): string {
  return buildR2Url(filename);
}

/**
 * Fetch the dataset manifest with caching for performance
 */
export const fetchManifest = cache(async (): Promise<R2Manifest | null> => {
  try {
    const url = buildManifestUrl();
    if (!clientEnv.NEXT_PUBLIC_R2_BASE_URL) {
      return null;
    }
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      console.warn(`Failed to fetch manifest: ${response.statusText}`);
      return null;
    }
    
    return (await response.json()) as R2Manifest;
  } catch (error) {
    console.warn('Error fetching R2 manifest:', error);
    return null;
  }
});

/**
 * Helper to get a map asset object
 */
export function createMapAsset(id: string, city: CitySlug, type: 'lulc' | 'change' | 'boundary', year?: Year): MapAsset {
  let url = '';
  
  if (type === 'boundary') {
    url = getBoundaryUrl(city);
  } else if (year) {
    url = getPmtilesUrl(city, year, type);
  }
  
  return { id, url, type, city, year };
}
