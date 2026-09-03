import { z } from 'zod';

export type CitySlug = 'jakarta' | 'bandung';
export type Year = number; // 2017-2025

export interface AnnualMetrics {
  year: number;
  city: string;
  veg_km2: number;
  veg_pct: number;
  water_km2: number;
  water_pct: number;
  urban_km2: number;
  urban_pct: number;
  open_km2: number;
  open_pct: number;
  total_km2: number;
  rth_total_km2: number;
  rth_pct: number;
  rth_target_pct: number;
  rth_deficit_km2: number;
  rth_deficit_pct: number;
  rth_compliant: boolean;
  accuracy: number;
  kappa: number;
  pa_veg: number;
  ua_veg: number;
  pa_water: number;
  ua_water: number;
  pa_urban: number;
  ua_urban: number;
  pa_open: number;
  ua_open: number;
  analysis_version: string;
  pixel_size_m: number;
}

export interface ChangeSummary {
  city: string;
  baseline_year: number;
  final_year: number;
  baseline_vegetation_km2: number;
  final_vegetation_km2: number;
  endpoint_net_change_km2: number;
  patch_filtered_loss_km2: number;
  patch_filtered_gain_km2: number;
  patch_filtered_net_change_km2: number;
  minimum_patch_pixels: number;
  connectivity: number;
  pixel_size_m: number;
}

export interface CityConfig {
  id: CitySlug;
  name: string;
  province: string;
  center: [number, number];
  zoom: number;
}

export interface MapAsset {
  id: string;
  url: string;
  type: 'lulc' | 'change' | 'boundary';
  city: CitySlug;
  year?: Year;
}

export interface DatasetVersion {
  version: string;
  date: string;
  validated: boolean;
}

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  volume: number;
  issue: number;
  year: number;
  pages: string;
  doi: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Zod schemas for API parameter validation
export const ApiParamsSchema = z.object({
  city: z.enum(['jakarta', 'bandung']),
  year: z.coerce.number().min(2017).max(2025).optional(),
});

export type ApiParams = z.infer<typeof ApiParamsSchema>;

export interface ReconciliationResult {
  city: string;
  year: number;
  status: 'matched' | 'mismatched' | 'missing';
  details?: string;
}
