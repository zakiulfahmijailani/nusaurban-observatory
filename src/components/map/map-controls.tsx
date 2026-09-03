'use client';

import React from 'react';

// Assuming basic HTML/Tailwind since ui components aren't provided
// In a real app, replace with shadcn/ui components

interface MapControlsProps {
  city: 'jakarta' | 'bandung';
  year: number;
  layer: 'lulc' | 'vegetation_change';
  opacity: number;
  showBoundary: boolean;
  isAnimating: boolean;
  basemapStyle: string;
  onCityChange: (city: 'jakarta' | 'bandung') => void;
  onYearChange: (year: number) => void;
  onLayerChange: (layer: 'lulc' | 'vegetation_change') => void;
  onOpacityChange: (opacity: number) => void;
  onBoundaryToggle: (show: boolean) => void;
  onAnimationToggle: () => void;
  onBasemapChange: (style: string) => void;
}

const styles = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

export default function MapControls({
  city,
  year,
  layer,
  opacity,
  showBoundary,
  isAnimating,
  basemapStyle,
  onCityChange,
  onYearChange,
  onLayerChange,
  onOpacityChange,
  onBoundaryToggle,
  onAnimationToggle,
  onBasemapChange
}: MapControlsProps) {
  return (
    <div className="bg-white/90 backdrop-blur dark:bg-zinc-900/90 p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
      {/* City */}
      <select 
        value={city} 
        onChange={(e) => onCityChange(e.target.value as any)}
        className="p-2 border rounded bg-transparent"
      >
        <option value="jakarta">Jakarta</option>
        <option value="bandung">Bandung</option>
      </select>

      {/* Layer */}
      <select 
        value={layer} 
        onChange={(e) => onLayerChange(e.target.value as any)}
        className="p-2 border rounded bg-transparent"
      >
        <option value="lulc">LULC</option>
        <option value="vegetation_change">Vegetation Change</option>
      </select>

      {/* Year */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Year: {year}</span>
        <input 
          type="range" 
          min="2017" max="2025" step="1" 
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          disabled={layer === 'vegetation_change'}
        />
        <button 
          onClick={onAnimationToggle}
          disabled={layer === 'vegetation_change'}
          className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {isAnimating ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Opacity */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Opacity</span>
        <input 
          type="range" 
          min="0" max="1" step="0.05" 
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Boundary */}
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
        <input 
          type="checkbox" 
          checked={showBoundary}
          onChange={(e) => onBoundaryToggle(e.target.checked)}
          className="rounded border-gray-300"
        />
        Boundary
      </label>

      {/* Basemap */}
      <select 
        value={basemapStyle} 
        onChange={(e) => onBasemapChange(e.target.value)}
        className="p-2 border rounded bg-transparent ml-auto"
      >
        <option value={styles.light}>Light</option>
        <option value={styles.dark}>Dark</option>
      </select>
    </div>
  );
}
