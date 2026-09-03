'use client';

import React from 'react';

interface MapLegendProps {
  layer: 'lulc' | 'vegetation_change';
}

interface LegendItem {
  label: string;
  color: string;
  border?: string;
}

const lulcClasses: LegendItem[] = [
  { label: 'Vegetation', color: '#2E7D32' },
  { label: 'Water', color: '#1976D2' },
  { label: 'Urban', color: '#D84315' },
  { label: 'Open Land', color: '#F9A825' },
];

const changeClasses: LegendItem[] = [
  { label: 'Vegetation Loss', color: '#C62828' },
  { label: 'Vegetation Gain', color: '#2E7D32' },
  { label: 'No Change', color: 'transparent', border: '#ccc' },
];

export default function MapLegend({ layer }: MapLegendProps) {
  const items = layer === 'lulc' ? lulcClasses : changeClasses;

  return (
    <div className="bg-white/95 dark:bg-zinc-900/95 p-3 rounded-md shadow-md text-sm border border-border">
      <h4 className="font-semibold mb-2 dark:text-white">
        {layer === 'lulc' ? 'Land Use Land Cover' : 'Vegetation Change (2017-2025)'}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span 
              className="w-4 h-4 rounded-sm shrink-0"
              style={{ 
                backgroundColor: item.color,
                border: item.border ? `1px solid ${item.border}` : 'none'
              }}
            />
            <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
