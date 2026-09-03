import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { PUBLICATION, CITIES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto flex flex-col items-start space-y-6">
          <Badge variant="secondary" className="bg-emerald-800 text-emerald-100 hover:bg-emerald-700">2017–2025</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">NusaUrban Observatory</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light">
            Urban Growth and Green-Space Monitoring for Indonesia
          </p>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            The platform visualizes results from published satellite remote-sensing research on Jakarta and Bandung's urban expansion and green-space deficits.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/explore">
                <Map className="mr-2 h-5 w-5" /> Explore the Map
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-900 hover:bg-slate-800 hover:text-white">
              <Link href={PUBLICATION?.doi || '#'} target="_blank" rel="noopener noreferrer">
                <BookOpen className="mr-2 h-5 w-5" /> Read the Research
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            <Badge variant="outline" className="text-slate-300 border-slate-600">Sentinel-2</Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">Random Forest</Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">Google Earth Engine</Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">10m Resolution</Badge>
          </div>
        </div>
      </section>

      {/* City Cards Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Study Areas</h2>
            <p className="text-slate-600 text-lg">
              We monitor two major Indonesian cities representing distinct urban trajectories: a coastal megacity and a highland regional capital.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <MapPin className="mr-2 text-emerald-600 h-6 w-6" /> DKI Jakarta
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Mainland DKI Jakarta (excluding Kepulauan Seribu)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Indonesia's capital and a rapidly urbanizing coastal megacity facing critical challenges with green-space availability and land subsidence.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 -ml-4">
                  <Link href="/explore?city=jakarta">
                    View on Map <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <MapPin className="mr-2 text-emerald-600 h-6 w-6" /> Kota Bandung
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Highland city in West Java
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  A high-altitude regional center with a contrasting urban trajectory, historical green spaces, and distinct topographical constraints on expansion.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 -ml-4">
                  <Link href="/explore?city=bandung">
                    View on Map <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* About the Research Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">About the Research</h2>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-slate-800">Publication Details</h3>
            <p className="text-slate-600 leading-relaxed">
              {PUBLICATION?.authors || 'Zakiul Fahmi Jailani et al.'} ({PUBLICATION?.year || '2026'}). 
              <span className="italic mx-1">{PUBLICATION?.title || 'Monitoring Urban Expansion and RTH Proxy using Sentinel-2.'}</span> 
              {PUBLICATION?.journal || 'Journal of Urban Remote Sensing.'} 
              <a href={PUBLICATION?.doi || '#'} className="text-emerald-600 hover:underline ml-1">
                {PUBLICATION?.doi || 'DOI link'}
              </a>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="font-semibold text-xl mb-4 text-slate-800">Methodology Highlights</h3>
              <ul className="space-y-3 text-slate-600 list-disc pl-5">
                <li>Sentinel-2 Level-2A imagery</li>
                <li>Annual cloud-filtered composites via Google Earth Engine</li>
                <li>Random Forest classifier (100 trees)</li>
                <li>Multiple spectral indices (NDVI, NDWI, NDBI, NDMI, SAVI, EVI)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-4 text-slate-800">RTH Proxy Statement</h3>
              <p className="text-slate-600 leading-relaxed">
                The Ruang Terbuka Hijau (RTH) indicator shown is a satellite-derived proxy combining <span className="font-medium">Vegetation</span> and <span className="font-medium">Water</span> classes. It does <strong>NOT</strong> represent legally certified RTH per Indonesian regulatory definitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Disclaimers Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Scientific Disclaimers</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-slate-800 mb-2">Resolution Limits</h4>
              <p className="text-sm text-slate-600">Analysis relies on Sentinel-2 10-metre spatial resolution. Sub-pixel urban greening or fine-scale structures may not be captured accurately.</p>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-slate-800 mb-2">Classification Ambiguity</h4>
              <p className="text-sm text-slate-600">The "Open Land" class is the most difficult to classify consistently and may have higher margin of error compared to Water or Vegetation.</p>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-slate-800 mb-2">Validation Status</h4>
              <p className="text-sm text-slate-600">There has been no systematic field validation of the generated maps; accuracy metrics rely on sample-based cross-validation from high-resolution imagery.</p>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100">
              <h4 className="font-semibold text-slate-800 mb-2">Intended Use</h4>
              <p className="text-sm text-slate-600">These maps serve as macro-level monitoring indicators. Do not attribute specific local changes to particular causes, and do not use as a basis for legal enforcement.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
