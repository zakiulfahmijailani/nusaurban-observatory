"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { ChartWrapper } from './chart-wrapper';

export interface ChangeSummaryData {
  baseline_vegetation_km2: number;
  final_vegetation_km2: number;
  endpoint_net_change_km2: number;
  patch_filtered_loss_km2: number;
  patch_filtered_gain_km2: number;
  patch_filtered_net_change_km2: number;
}

interface Props {
  data: ChangeSummaryData | null;
  city: string;
}

export function ChangeSummaryChart({ data, city }: Props) {
  if (!data) return <div className="p-4 text-gray-500">No data available</div>;

  const columns = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Area (km²)', format: (v: number) => v?.toFixed(2) },
  ];

  const tableData = [
    { metric: 'Baseline Vegetation', value: data.baseline_vegetation_km2 },
    { metric: 'Final Vegetation', value: data.final_vegetation_km2 },
    { metric: 'Endpoint Net Change', value: data.endpoint_net_change_km2 },
    { metric: 'Patch-Filtered Loss', value: data.patch_filtered_loss_km2 },
    { metric: 'Patch-Filtered Gain', value: data.patch_filtered_gain_km2 },
    { metric: 'Patch-Filtered Net Change', value: data.patch_filtered_net_change_km2 },
  ];

  const chartData = [
    {
      name: 'Baseline',
      value: data.baseline_vegetation_km2,
      fill: '#4ade80' // light green
    },
    {
      name: 'Final',
      value: data.final_vegetation_km2,
      fill: '#22c55e' // normal green
    },
    {
      name: 'Gain (Filtered)',
      value: data.patch_filtered_gain_km2,
      fill: '#16a34a' // dark green
    },
    {
      name: 'Loss (Filtered)',
      value: data.patch_filtered_loss_km2,
      fill: '#ef4444' // red
    },
    {
      name: 'Net (Filtered)',
      value: data.patch_filtered_net_change_km2,
      fill: data.patch_filtered_net_change_km2 >= 0 ? '#3b82f6' : '#f97316' // blue if positive, orange if negative
    }
  ];

  const formatTooltip = (value: any) => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return [`${Number.isNaN(num) ? '—' : num.toFixed(2)} km²`, 'Area'];
  };

  return (
    <ChartWrapper
      title="Vegetation Change Summary"
      city={city}
      sourceNote="Note: Endpoint net change simply subtracts baseline from final. Patch-filtered net change aggregates multi-year temporally stabilized patches."
      data={tableData}
      columns={columns}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 12 }} 
            stroke="#9ca3af" 
            width={100}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <ReferenceLine x={0} stroke="#9ca3af" />
          <Bar dataKey="value" name="Area (km²)" radius={[0, 4, 4, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
