import { Mail, GraduationCap, MapPin, ExternalLink } from 'lucide-react';
import { PUBLICATION } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 sm:px-12 lg:px-24 text-slate-900">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">About the Observatory</h1>
          <p className="text-xl text-slate-600 font-light">
            Empowering sustainable urban planning in Indonesia through open geospatial data and satellite remote sensing.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Purpose</h2>
          <div className="prose prose-slate max-w-none text-lg text-slate-700">
            <p>
              The NusaUrban Observatory was established to monitor and visualize urban growth and the state of green spaces across Indonesia's rapidly changing cities. By leveraging open-access satellite data and machine learning, the observatory provides transparent, reproducible, and accessible spatial indicators to researchers, planners, and the public.
            </p>
            <p className="mt-4">
              <strong>Long-term Goal:</strong> We aim to provide yearly updates to our land-cover datasets and expand our monitoring coverage to include additional major Indonesian cities in the future.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Research Team</h2>
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <GraduationCap className="h-10 w-10 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-slate-900">Zakiul Fahmi Jailani</h3>
              <p className="text-slate-600">Lead Researcher & Corresponding Author</p>
              <div className="flex items-center text-slate-500 mt-2 text-sm">
                <MapPin className="h-4 w-4 mr-1" /> Universitas Bakrie, Jakarta, Indonesia
              </div>
              <a href="mailto:contact@nusaurban.example.com" className="inline-flex items-center mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                <Mail className="h-4 w-4 mr-2" /> Contact Researcher
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Publication & Citation</h2>
          <div className="bg-slate-900 text-white p-6 rounded-lg">
            <p className="text-slate-300 mb-4">The data and methodology visualized on this platform are based on peer-reviewed research:</p>
            <p className="font-serif text-lg leading-relaxed">
              {PUBLICATION?.authors || 'Zakiul Fahmi Jailani et al.'} ({PUBLICATION?.year || '2026'}). 
              <span className="italic mx-1">{PUBLICATION?.title || 'Monitoring Urban Expansion and RTH Proxy using Sentinel-2.'}</span> 
              {PUBLICATION?.journal || 'Journal of Urban Remote Sensing.'}
            </p>
            <a 
              href={PUBLICATION?.doi || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium transition-colors"
            >
              View Publication <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Acknowledgements</h2>
          <p className="text-slate-700">
            This research and platform were made possible through the use of open data and cloud computing platforms. We gratefully acknowledge:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>ESA Copernicus Program:</strong> For providing open access to Sentinel-2 Level-2A satellite imagery.</li>
            <li><strong>Google Earth Engine:</strong> For providing the cloud-computing infrastructure essential for processing the large-scale multi-temporal remote sensing datasets.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 text-slate-800 text-sm leading-relaxed">
            <h4 className="font-bold mb-2">Scientific Disclaimer</h4>
            <p>
              The maps and data provided by the NusaUrban Observatory are intended for scientific, educational, and macro-level monitoring purposes only. The Ruang Terbuka Hijau (RTH) metrics are a satellite-derived physical proxy and do not correspond to legally certified RTH per Indonesian regulations. The classifications are subject to errors associated with 10-meter spatial resolution and spectral mixing. This data should not be used as the sole basis for legal enforcement, property assessment, or micro-level site planning.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
