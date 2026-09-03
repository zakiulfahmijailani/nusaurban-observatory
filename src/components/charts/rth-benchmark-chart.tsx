"use client";

import React from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import { ChartWrapper } from './chart-wrapper';

export interface RTHBenchmarkData {
  year: number;
  rth_pct: number;
  rth_total_km2: number;
  rth_deficit_pct: number;
  rth_compliant: boolean | number;
}

interface Props {
  data: RTHBenchmarkData[];
  city: string;
}

export function RTHBenchmarkChart({ data, city }: Props) {
  const columns = [
    { key: 'year', label: 'Year' },
    { key: 'rth_pct', label: 'RTH (%)', format: (v: number) => v?.toFixed(2) },
    { key: 'rth_total_km2', label: 'Total RTH (km²)', format: (v: number) => v?.toFixed(2) },
    { key: 'rth_deficit_pct', label: 'Deficit (%)', format: (v: number) => v?.toFixed(2) },
    { key: 'rth_compliant', label: 'Compliant', format: (v: any) => v ? 'Yes' : 'No' },
  ];

  // Map data to include the benchmark and area fill logic
  const chartData = data.map(d => ({
    ...d,
    benchmark: 30,
    // For shading deficit: only value up to benchmark
    shadedDeficit: d.rth_pct < 30 ? [d.rth_pct, 30] : null
  }));

  const formatTooltip = (value: any, name: any) => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    const formattedNum = Number.isNaN(num) ? '—' : num.toFixed(2);
    if (name === 'Policy Benchmark' || name === 'benchmark') return [`${value}%`, 'Policy Benchmark'];
    if (name === 'rth_pct' || name === 'RTH Proxy') return [`${formattedNum}%`, 'RTH Proxy'];
    if (name === 'shadedDeficit' || name === 'Deficit Zone') return [`Under 30%`, 'Deficit Zone'];
    return [value, name];
  };

  return (
    <ChartWrapper
      title="RTH Proxy vs Policy Benchmark"
      city={city}
      sourceNote="Source: Sentinel-2 Classification Proxy"
      data={data}
      columns={columns}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke="#9ca3af"
            domain={[0, Math.max(40, Math.max(...data.map(d => d.rth_pct)) + 10)]}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          <ReferenceLine y={30} stroke="#FF6F00" strokeDasharray="5 5" label={{ position: 'top', value: 'Policy Benchmark (30%)', fill: '#FF6F00', fontSize: 12 }} />
          
          <Area 
            type="monotone" 
            dataKey="shadedDeficit" 
            name="Deficit Zone" 
            fill="#fee2e2" 
            stroke="none" 
            opacity={0.6}
            legendType="square"
          />
          
          <Line 
            type="monotone" 
            dataKey="rth_pct" 
            name="RTH Proxy" 
            stroke="#2E7D32" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
