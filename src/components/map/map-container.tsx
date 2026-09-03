'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL || '';
const removedTrailingSlash = R2_BASE.replace(/\/$/, '');

function getPmtilesUrl(city: string, year: number, layer: 'lulc' | 'vegetation_change') {
  if (layer === 'lulc') {
    return `${removedTrailingSlash}/tiles/${city}/${city}_lulc_${year}.pmtiles`;
  }
  return `${removedTrailingSlash}/tiles/${city}/${city}_vegetation_change_2017_2025.pmtiles`;
}

function getBoundaryUrl(city: string) {
  return `${removedTrailingSlash}/boundaries/${city}_boundary.geojson`;
}

const CITY_CENTERS = {
  jakarta: { center: [106.85, -6.2] as [number, number], zoom: 11 },
  bandung: { center: [107.61, -6.91] as [number, number], zoom: 12 },
};

interface MapContainerProps {
  city: 'jakarta' | 'bandung';
  year: number;
  layer: 'lulc' | 'vegetation_change';
  opacity: number;
  showBoundary: boolean;
  basemapStyle?: string;
}

export default function MapContainer({
  city,
  year,
  layer,
  opacity,
  showBoundary,
  basemapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const protocolRegistered = useRef(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainer.current || map.current) return;
      
      try {
        const [maplibregl, { Protocol }] = await Promise.all([
          import('maplibre-gl'),
          import('pmtiles')
        ]);

        if (!protocolRegistered.current) {
          const protocol = new Protocol();
          maplibregl.addProtocol('pmtiles', protocol.tile);
          protocolRegistered.current = true;
        }

        const mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style: basemapStyle,
          center: CITY_CENTERS[city].center,
          zoom: CITY_CENTERS[city].zoom,
          minZoom: 8,
          maxZoom: 18,
          attributionControl: false,
        });

        mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');
        mapInstance.addControl(new maplibregl.FullscreenControl(), 'top-right');
        mapInstance.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');
        mapInstance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

        mapInstance.on('load', () => {
          if (!isMounted) return;
          setIsLoading(false);
          updateLayers(mapInstance);
        });

        mapInstance.on('error', (e) => {
          console.error('Map error:', e);
          if (isMounted) setError('Error loading map data');
        });

        mapInstance.on('click', (e) => {
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="text-sm p-2 text-black">
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Year:</strong> ${year}</p>
                <p><strong>Layer:</strong> ${layer}</p>
                <p><strong>Location:</strong> ${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}</p>
              </div>
            `)
            .addTo(mapInstance);
        });

        map.current = mapInstance;
      } catch (err) {
        console.error('Failed to initialize map:', err);
        if (isMounted) setError('Failed to initialize map');
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLayers = (mapInstance: MapLibreMap) => {
    if (!mapInstance.isStyleLoaded()) return;

    // Handle Boundary
    const boundarySourceId = 'boundary-source';
    const boundaryLayerId = 'boundary-layer';

    if (showBoundary) {
      if (!mapInstance.getSource(boundarySourceId)) {
        mapInstance.addSource(boundarySourceId, {
          type: 'geojson',
          data: getBoundaryUrl(city)
        });
        mapInstance.addLayer({
          id: boundaryLayerId,
          type: 'line',
          source: boundarySourceId,
          paint: {
            'line-color': '#000000',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });
      } else {
        (mapInstance.getSource(boundarySourceId) as any).setData(getBoundaryUrl(city));
      }
    } else {
      if (mapInstance.getLayer(boundaryLayerId)) mapInstance.removeLayer(boundaryLayerId);
      if (mapInstance.getSource(boundarySourceId)) mapInstance.removeSource(boundarySourceId);
    }

    // Handle Raster Layer
    const rasterSourceId = 'raster-source';
    const rasterLayerId = 'raster-layer';
    const pmtilesUrl = `pmtiles://${getPmtilesUrl(city, year, layer)}`;

    if (mapInstance.getLayer(rasterLayerId)) {
      mapInstance.removeLayer(rasterLayerId);
    }
    if (mapInstance.getSource(rasterSourceId)) {
      mapInstance.removeSource(rasterSourceId);
    }

    mapInstance.addSource(rasterSourceId, {
      type: 'raster',
      url: pmtilesUrl,
      tileSize: 256
    });

    mapInstance.addLayer({
      id: rasterLayerId,
      type: 'raster',
      source: rasterSourceId,
      paint: {
        'raster-opacity': opacity
      }
    }, boundaryLayerId); // Add below boundary if it exists
  };

  // Effect to handle state updates
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    // Fly to city if changed
    const currentCenter = map.current.getCenter();
    const targetConfig = CITY_CENTERS[city];
    
    // basic check if we are far away
    if (Math.abs(currentCenter.lng - targetConfig.center[0]) > 0.1) {
      map.current.flyTo({
        center: targetConfig.center,
        zoom: targetConfig.zoom,
        duration: 2000
      });
    }

    updateLayers(map.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, year, layer, showBoundary]);

  // Effect for opacity
  useEffect(() => {
    if (map.current && map.current.getLayer('raster-layer')) {
      map.current.setPaintProperty('raster-layer', 'raster-opacity', opacity);
    }
  }, [opacity]);
  
  // Effect for basemap style
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setStyle(basemapStyle);
      
      // We must wait for style to load before re-adding our layers
      map.current.once('styledata', () => {
        if (map.current) {
          updateLayers(map.current);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basemapStyle]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="text-lg font-semibold text-gray-700">Loading map...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-100 bg-opacity-90">
          <div className="text-center">
            <div className="text-lg font-semibold text-red-700 mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
