'use client';

import React, { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMapState } from '@/hooks/use-map-store';
import { Skeleton } from '@/components/ui/skeleton';

const MapContainer = dynamic(() => import('@/components/map/map-container'), { ssr: false });
const MapControls = dynamic(() => import('@/components/map/map-controls'), { ssr: false });
const MapLegend = dynamic(() => import('@/components/map/map-legend'), { ssr: false });
const MetricsPanel = dynamic(() => import('@/components/map/metrics-panel'), { ssr: false });

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlCity = (searchParams.get('city') as any) || 'jakarta';
  const urlYear = parseInt(searchParams.get('year') || '2025', 10);
  const urlLayer = (searchParams.get('layer') as any) || 'lulc';

  const mapState = useMapState({
    activeCity: urlCity,
    activeYear: urlYear,
    activeLayer: urlLayer,
  });

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (params.get('city') !== mapState.activeCity) {
      params.set('city', mapState.activeCity);
      changed = true;
    }
    if (params.get('year') !== mapState.activeYear.toString()) {
      params.set('year', mapState.activeYear.toString());
      changed = true;
    }
    if (params.get('layer') !== mapState.activeLayer) {
      params.set('layer', mapState.activeLayer);
      changed = true;
    }

    if (changed) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [mapState.activeCity, mapState.activeYear, mapState.activeLayer, pathname, router, searchParams]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background">
      <div className="border-b border-border z-10 bg-background/95 backdrop-blur">
        <MapControls
          city={mapState.activeCity}
          year={mapState.activeYear}
          layer={mapState.activeLayer}
          opacity={mapState.rasterOpacity}
          showBoundary={mapState.showBoundary}
          isAnimating={mapState.isAnimating}
          basemapStyle={mapState.basemapStyle}
          onCityChange={mapState.setActiveCity}
          onYearChange={mapState.setActiveYear}
          onLayerChange={mapState.setActiveLayer}
          onOpacityChange={mapState.setRasterOpacity}
          onBoundaryToggle={(show) => mapState.setShowBoundary(show)}
          onAnimationToggle={mapState.toggleAnimation}
          onBasemapChange={mapState.setBasemapStyle}
        />
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Analytical Side Panel */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card/50 overflow-y-auto z-10 max-h-[40vh] md:max-h-full">
          <MetricsPanel city={mapState.activeCity} year={mapState.activeYear} />
        </div>

        {/* Map Viewport */}
        <div className="flex-1 relative">
          <MapContainer
            city={mapState.activeCity}
            year={mapState.activeYear}
            layer={mapState.activeLayer}
            opacity={mapState.rasterOpacity}
            showBoundary={mapState.showBoundary}
            basemapStyle={mapState.basemapStyle}
          />

          <div className="absolute bottom-8 right-4 z-10">
            <MapLegend layer={mapState.activeLayer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-3.5rem)] w-full flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
