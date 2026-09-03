import { AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { PUBLICATION } from '@/lib/constants';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Research Methodology</h1>
          <p className="text-xl text-slate-600 font-light">
            A comprehensive overview of the satellite imagery processing, classification workflow, and change detection protocols used in the NusaUrban Observatory.
          </p>
        </header>

        {/* 1. Overview */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
            <Layers className="mr-3 h-6 w-6 text-emerald-600" />
            1. Workflow Overview
          </h2>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <ol className="list-decimal pl-5 space-y-3 text-slate-700">
              <li><strong>Data Acquisition:</strong> Sentinel-2 Level-2A imagery.</li>
              <li><strong>Preprocessing:</strong> Annual cloud-filtered composites via Google Earth Engine.</li>
              <li><strong>Feature Extraction:</strong> Computation of Spectral bands & indices.</li>
              <li><strong>Classification:</strong> Random Forest machine learning classification.</li>
              <li><strong>Mapping:</strong> Generation of Annual LULC (Land Use/Land Cover) maps.</li>
              <li><strong>Post-processing:</strong> Vegetation-change detection (2017–2025).</li>
              <li><strong>Analysis:</strong> RTH-proxy assessment against statutory benchmarks.</li>
              <li><strong>Dissemination:</strong> WebGIS platform publication.</li>
            </ol>
          </div>
        </section>

        {/* 2 & 3. Study Areas & Data Source */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">2. Study Areas</h2>
            <div className="bg-white p-5 rounded-lg border border-slate-200 h-full">
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><strong>Jakarta:</strong> Mainland DKI Jakarta (excluding Kepulauan Seribu), covering approximately 650 km².</li>
                <li><strong>Bandung:</strong> Kota Bandung, covering approximately 168 km².</li>
              </ul>
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">3. Data Source</h2>
            <div className="bg-white p-5 rounded-lg border border-slate-200 h-full">
              <p className="text-slate-700">
                Primary data utilizes Sentinel-2 Level-2A imagery provided by Copernicus. Data is processed within Google Earth Engine (GEE), filtered for scenes with &lt;20% cloud cover.
              </p>
            </div>
          </section>
        </div>

        {/* 4 & 5. Compositing & Spectral Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Compositing & Features</h2>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-medium text-lg text-slate-800 mb-2">4. Annual Compositing</h3>
              <p className="text-slate-700">
                A median composite is generated for each calendar year. The QA60 band is utilized for rigorous cloud-masking to ensure surface reflectance integrity.
              </p>
            </div>
            <div className="p-6 bg-slate-50/50">
              <h3 className="font-medium text-lg text-slate-800 mb-2">5. Spectral Features</h3>
              <p className="text-slate-700">
                The classification model incorporates multiple features:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
                <li>Optical/Infrared bands: B2–B8, B11–B12</li>
                <li>Indices: NDVI, NDWI, NDBI, NDMI, SAVI, EVI</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6, 7 & 8. Classification & Accuracy */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Classification Strategy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">6. Random Forest</h3>
              <p className="text-sm text-slate-700">
                Configured with 100 decision trees. Training and validation data are split using a 70/30 ratio for robust model evaluation.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">7. Classes</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>Vegetation (0)</li>
                <li>Water (1)</li>
                <li>Urban (2)</li>
                <li>Open Land (3)</li>
                <li>NoData (255)</li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">8. Accuracy</h3>
              <p className="text-sm text-slate-700">
                Overall Accuracy and Kappa statistics are computed for each annual map to quantify classification performance.
              </p>
            </div>
          </div>
        </section>

        {/* 9 & 10. Change Detection & RTH */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Analysis Framework</h2>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-medium text-lg text-slate-800 mb-2">9. Change Detection</h3>
              <p className="text-slate-700">
                Compares the baseline (2017) and endpoint (2025) years. To reduce noise, a 9-pixel minimum patch filter with 4-connectivity is applied to the change maps.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-medium text-lg text-slate-800 mb-2">10. RTH Proxy</h3>
              <p className="text-slate-700">
                A proxy for Ruang Terbuka Hijau (RTH) is calculated by combining the Vegetation and Water classes. This spatial metric is then compared against the 30% statutory benchmark for urban areas.
              </p>
            </div>
          </div>
        </section>

        {/* 11. Limitations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
            <AlertTriangle className="mr-3 h-6 w-6 text-amber-500" />
            11. Limitations
          </h2>
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 text-slate-800">
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Spatial Resolution:</strong> 10m Sentinel-2 pixels cannot resolve micro-scale urban green spaces or narrow street trees.</li>
              <li><strong>Class Ambiguity:</strong> "Open Land" exhibits spectral overlap with certain urban and sparse vegetation features, making it the most challenging class to map accurately.</li>
              <li><strong>Lack of Field Validation:</strong> Ground-truth data relies entirely on visual interpretation of high-resolution imagery rather than in-situ field surveys.</li>
              <li><strong>Temporal Aggregation:</strong> Annual median compositing may smooth out phenological extremes and rapid, short-term land cover transitions.</li>
              <li><strong>Proxy Nature:</strong> The RTH proxy is strictly a physical land-cover metric; it does not confer legal RTH status or distinguish between public and private green spaces.</li>
            </ul>
          </div>
        </section>

        {/* 12. Citation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
            <BookOpen className="mr-3 h-6 w-6 text-emerald-600" />
            12. Suggested Citation
          </h2>
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
            <p className="font-mono text-sm text-slate-700 break-words">
              {PUBLICATION?.authors || 'Zakiul Fahmi Jailani et al.'} ({PUBLICATION?.year || '2026'}). {PUBLICATION?.title || 'Monitoring Urban Expansion and RTH Proxy using Sentinel-2'}. {PUBLICATION?.journal || 'Journal of Urban Remote Sensing'}. {PUBLICATION?.doi ? `DOI: ${PUBLICATION.doi}` : ''}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
