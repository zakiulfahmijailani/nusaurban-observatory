"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MapContainer = dynamic(() => import('@/components/map/map-container'), { ssr: false });
const MapLegend = dynamic(() => import('@/components/map/map-legend'), { ssr: false });

const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const CITIES = [
  { id: 'jakarta', name: 'DKI Jakarta' },
  { id: 'bandung', name: 'Kota Bandung' },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cityParam = searchParams.get('city');
  const city: 'jakarta' | 'bandung' = cityParam === 'jakarta' ? 'jakarta' : 'bandung';
  const leftYear = searchParams.get('left') || '2017';
  const rightYear = searchParams.get('right') || '2025';
  const mode = (searchParams.get('mode') as 'swipe' | 'side-by-side') || 'swipe';

  const [dividerPosition, setDividerPosition] = useState(50);
  const isDragging = useRef(false);

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => params.set(k, v));
    router.replace(`/compare?${params.toString()}`);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging.current) return;
    const container = document.getElementById('compare-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let newPos = ((e.clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(5, Math.min(95, newPos));
    setDividerPosition(newPos);
  };

  useEffect(() => {
    const onMouseUp = () => {
      isDragging.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleMouseMove(e);
      }
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="border-b border-border bg-background/95 backdrop-blur px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          {/* City selector */}
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="text-muted-foreground">City:</span>
            <Select value={city} onValueChange={(val) => updateUrl({ city: val })}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Left Year */}
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="text-primary font-bold">Left:</span>
            <Select value={leftYear} onValueChange={(val) => updateUrl({ left: val })}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right Year */}
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="text-amber-600 font-bold">Right:</span>
            <Select value={rightYear} onValueChange={(val) => updateUrl({ right: val })}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
          <Button
            size="sm"
            variant={mode === 'swipe' ? 'default' : 'ghost'}
            className="h-7 text-xs px-3"
            onClick={() => updateUrl({ mode: 'swipe' })}
          >
            Swipe
          </Button>
          <Button
            size="sm"
            variant={mode === 'side-by-side' ? 'default' : 'ghost'}
            className="h-7 text-xs px-3"
            onClick={() => updateUrl({ mode: 'side-by-side' })}
          >
            Side by Side
          </Button>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div id="compare-container" className="flex-1 relative overflow-hidden select-none">
        {mode === 'swipe' ? (
          <>
            {/* Right Map (Base) */}
            <div className="absolute inset-0">
              <MapContainer
                city={city}
                year={parseInt(rightYear, 10)}
                layer="lulc"
                opacity={1}
                showBoundary={true}
              />
              <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur px-3 py-1.5 rounded-md shadow-md text-xs font-bold text-amber-600 border border-border">
                {city.toUpperCase()} — {rightYear}
              </div>
            </div>

            {/* Left Map (Clipped) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - dividerPosition}% 0 0)` }}
            >
              <MapContainer
                city={city}
                year={parseInt(leftYear, 10)}
                layer="lulc"
                opacity={1}
                showBoundary={true}
              />
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur px-3 py-1.5 rounded-md shadow-md text-xs font-bold text-primary border border-border">
                {city.toUpperCase()} — {leftYear}
              </div>
            </div>

            {/* Draggable Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-[0_0_10px_rgba(0,0,0,0.4)] z-30 flex items-center justify-center hover:bg-primary transition-colors"
              style={{ left: `${dividerPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
            >
              <div className="h-10 w-6 bg-white dark:bg-zinc-800 rounded-full border border-border shadow-md flex items-center justify-center text-xs text-muted-foreground font-mono">
                ↔
              </div>
            </div>
          </>
        ) : (
          /* Side by Side Mode */
          <div className="flex w-full h-full divide-x-2 divide-border">
            <div className="flex-1 relative">
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur px-3 py-1.5 rounded-md shadow-md text-xs font-bold text-primary border border-border">
                {city.toUpperCase()} — {leftYear}
              </div>
              <MapContainer
                city={city}
                year={parseInt(leftYear, 10)}
                layer="lulc"
                opacity={1}
                showBoundary={true}
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur px-3 py-1.5 rounded-md shadow-md text-xs font-bold text-amber-600 border border-border">
                {city.toUpperCase()} — {rightYear}
              </div>
              <MapContainer
                city={city}
                year={parseInt(rightYear, 10)}
                layer="lulc"
                opacity={1}
                showBoundary={true}
              />
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 right-4 z-20">
          <MapLegend layer="lulc" />
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-3.5rem)] w-full flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
