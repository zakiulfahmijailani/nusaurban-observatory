export const RTH_TARGET_PERCENTAGE = 30;
export const RTH_PROXY_DEFINITION = "Vegetation class is used as a proxy for Ruang Terbuka Hijau (RTH).";
export const START_YEAR = 2017;
export const END_YEAR = 2025;

export const LULC_CLASSES = [
  { value: 0, name: 'Vegetation', nameId: 'Vegetasi', color: '#2E7D32', description: 'Trees, shrubs, grass, and other vegetation' },
  { value: 1, name: 'Water', nameId: 'Badan Air', color: '#1976D2', description: 'Rivers, lakes, and other water bodies' },
  { value: 2, name: 'Urban', nameId: 'Lahan Terbangun', color: '#D84315', description: 'Buildings, roads, and other impervious surfaces' },
  { value: 3, name: 'Open Land', nameId: 'Lahan Terbuka', color: '#F9A825', description: 'Bare soil, clear-cut areas, and unbuilt land' },
  { value: 255, name: 'NoData', nameId: 'Tidak Ada Data', color: 'transparent', description: 'Masked or unavailable data' }
];

export const VEGETATION_CHANGE_CLASSES = [
  { value: 0, name: 'No change', nameId: 'Tidak berubah', color: 'transparent', description: 'No change in vegetation' },
  { value: 1, name: 'Vegetation loss', nameId: 'Kehilangan Vegetasi', color: '#C62828', description: 'Area transitioned from vegetation to non-vegetation' },
  { value: 2, name: 'Vegetation gain', nameId: 'Penambahan Vegetasi', color: '#2E7D32', description: 'Area transitioned from non-vegetation to vegetation' },
  { value: 255, name: 'NoData', nameId: 'Tidak Ada Data', color: 'transparent', description: 'Masked or unavailable data' }
];

export const CITIES = {
  jakarta: {
    id: 'jakarta',
    name: 'DKI Jakarta',
    province: 'DKI Jakarta',
    center: [106.85, -6.2] as [number, number],
    zoom: 11
  },
  bandung: {
    id: 'bandung',
    name: 'Kota Bandung',
    province: 'Jawa Barat',
    center: [107.61, -6.91] as [number, number],
    zoom: 12
  }
};

export const PUBLICATION = {
  title: 'Monitoring Urban Expansion and Green-Space Deficits in Jakarta and Bandung (2017–2025) Using Sentinel-2, Random Forest, and GEE',
  authors: ['Zakiul Fahmi Jailani', 'Shidiq Al-Hakim', 'Ferrell Ananda Darmawan'],
  journal: 'Jurnal Ilmiah Geomatika',
  volume: 6,
  issue: 1,
  year: 2026,
  pages: '129–141',
  doi: '10.31315/imagi.v6i1.16592'
};

export const SCIENTIFIC_DISCLAIMER = "Results are based on Sentinel-2 satellite imagery processed with Random Forest classification in Google Earth Engine. While rigorous validation has been performed, the map may contain classification errors and is intended for macro-level spatial analysis rather than localized regulatory compliance.";
