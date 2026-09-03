"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from './chart-wrapper';

export interface LandCoverData {
  year: number;
  veg_km2: number;
  veg_pct: number;
  water_km2: number;
  water_pct: number;
  urban_km2: number;
  urban_pct: number;
  open_km2: number;
  open_pct: number;
}

interface Props {
  data: LandCoverData[];
  city: string;
}

const COLORS = {
  Vegetation: '#2E7D32',
  Water: '#1976D2',
  Urban: '#D84315',
  OpenLand: '#F9A825'
};

export function LandCoverChart({ data, city }: Props) {
  const [unit, setUnit] = useState<'pct' | 'km2'>('pct');
  const [visibleSeries, setVisibleSeries] = useState({
    Vegetation: true,
    Water: true,
    Urban: true,
    OpenLand: true
  });

  const toggleSeries = (dataKey: string) => {
    setVisibleSeries(prev => ({
      ...prev,
      [dataKey as keyof typeof visibleSeries]: !prev[dataKey as keyof typeof visibleSeries]
    }));
  };

  const columns = [
    { key: 'year', label: 'Year' },
    { key: `veg_${unit}`, label: `Vegetation (${unit === 'pct' ? '%' : 'km²'})`, format: (v: number) => v?.toFixed(2) },
    { key: `water_${unit}`, label: `Water (${unit === 'pct' ? '%' : 'km²'})`, format: (v: number) => v?.toFixed(2) },
    { key: `urban_${unit}`, label: `Urban (${unit === 'pct' ? '%' : 'km²'})`, format: (v: number) => v?.toFixed(2) },
    { key: `open_${unit}`, label: `Open Land (${unit === 'pct' ? '%' : 'km²'})`, format: (v: number) => v?.toFixed(2) },
  ];

  const formatTooltip = (value: any) => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return [`${Number.isNaN(num) ? '—' : num.toFixed(2)} ${unit === 'pct' ? '%' : 'km²'}`, ''];
  };

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    let seriesName = '';
    if (dataKey.startsWith('veg_')) seriesName = 'Vegetation';
    if (dataKey.startsWith('water_')) seriesName = 'Water';
    if (dataKey.startsWith('urban_')) seriesName = 'Urban';
    if (dataKey.startsWith('open_')) seriesName = 'OpenLand';
    
    if (seriesName) toggleSeries(seriesName);
  };

  return (
    <ChartWrapper
      title="Annual Land Cover Trajectory"
      city={city}
      sourceNote="Source: Sentinel-2 / Random Forest classification"
      hasUnitToggle={true}
      unit={unit}
      onUnitChange={setUnit}
      data={data}
      columns={columns}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke="#9ca3af"
            domain={[0, unit === 'pct' ? 100 : 'auto']}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            onClick={handleLegendClick} 
            wrapperStyle={{ cursor: 'pointer', fontSize: '12px' }}
          />
          
          <Line 
            type="monotone" 
            dataKey={`veg_${unit}`} 
            name="Vegetation" 
            stroke={COLORS.Vegetation} 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            hide={!visibleSeries.Vegetation}
          />
          <Line 
            type="monotone" 
            dataKey={`water_${unit}`} 
            name="Water" 
            stroke={COLORS.Water} 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            hide={!visibleSeries.Water}
          />
          <Line 
            type="monotone" 
            dataKey={`urban_${unit}`} 
            name="Urban" 
            stroke={COLORS.Urban} 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            hide={!visibleSeries.Urban}
          />
          <Line 
            type="monotone" 
            dataKey={`open_${unit}`} 
            name="Open Land" 
            stroke={COLORS.OpenLand} 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            hide={!visibleSeries.OpenLand}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
