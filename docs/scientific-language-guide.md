# Scientific Language & Terminology Guide

To maintain scientific integrity and prevent public misinterpretation, all content, analytical panels, tooltips, and public releases on NusaUrban Observatory must follow these language standards.

---

## 1. Satellite-Derived RTH Proxy vs. Legal RTH

> [!CAUTION]
> Never describe the green-space metric as "official RTH", "legal RTH", or "certified Green Open Space".

- **Permissible Terminology:**
  - `Satellite-derived RTH proxy` (English)
  - `Proksi Ruang Terbuka Hijau (RTH) turunan satelit` (Bahasa Indonesia)
- **Scientific Rationale:**
  - The proxy is computed as the combined spectral surface area of `Vegetation (class 0) + Water (class 1)`.
  - It does not distinguish public versus private ownership (e.g., private gardens, golf courses, or commercial rooftops).
  - It does not replace cadastral, legal, zoning, or field-verified municipal surveys.

---

## 2. The 30% Green Open Space Benchmark

- **Permissible Terminology:**
  - `30% Policy Benchmark` (Tolok Ukur Kebijakan 30%)
- **Forbidden Terminology:**
  - Do NOT call it a "target", "model goal", or "scientific threshold".
  - Green coloration in charts or UI indicators must **never automatically imply legal compliance** unless specifically confirmed by official authorities.

---

## 3. Spatial Resolution & Spectral Ambiguity

Always communicate the following sensor constraints:
1. **10-Metre Pixel Footprint:** Sentinel-2 Level-2A imagery has a 10m Ground Sampling Distance (GSD). Objects or patches smaller than ~100 m² cannot be reliably distinguished.
2. **Open Land Spectral Confusion:** Bare soil, low-density suburban structures, unpaved surfaces, construction sites, and sparse dried vegetation exhibit overlapping spectral signatures in optical sensors.
3. **Lack of In-Situ Ground Truth:** Reference points were visually interpreted from high-resolution satellite imagery rather than systematic field audits.

---

## 4. Causality & External Attributions

- **Do Not Claim Direct Causality:** Never state that observed annual fluctuations were "caused by COVID-19", "caused by regulation XYZ", or "caused by specific infrastructure projects", unless backed by external independent peer-reviewed causal attribution.
- **Accurate Phrasing:** Describe changes as *observed spectral transitions*, *multi-temporal trends*, or *satellite-detected area differences*.
- **Caution on Enforcement:** Metrics are designed for macro-level spatial monitoring and policy tracking; they must **never be used as the sole basis for regulatory enforcement or legal penalties**.

---

## 5. Distinction in Change Metrics

Always maintain a clear mathematical separation:
1. **Endpoint Difference:** `Vegetation_2025 - Vegetation_2017` (net aggregate change).
2. **Patch-Filtered Spatial Change:** Cumulative 4-directional connected patches of at least 9 pixels (900 m² at 10m resolution).
   - Raw noise pixels are filtered out.
   - Patch-filtered loss and patch-filtered gain do not sum to the endpoint difference due to the morphological spatial filter.
