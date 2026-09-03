"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from './chart-wrapper';

export interface AccuracyData {
  year: number;
  accuracy: number;
  kappa: number;
}

interface Props {
  data: AccuracyData[];
  city: string;
}

export function AccuracyChart({ data, city }: Props) {
  const columns = [
    { key: 'year', label: 'Year' },
    { key: 'accuracy', label: 'Overall Accuracy (%)', format: (v: number) => v?.toFixed(2) },
    { key: 'kappa', label: 'Kappa Score', format: (v: number) => v?.toFixed(3) },
  ];

  return (
    <ChartWrapper
      title="Classification Reliability"
      city={city}
      sourceNote="Note: Overall Accuracy (0-100) shows the % of correct predictions. Kappa (0-1) measures agreement normalized for chance."
      data={data}
      columns={columns}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }} 
            stroke="#9ca3af"
            domain={[60, 100]}
            label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }} 
            stroke="#9ca3af"
            domain={[0.4, 1.0]}
            label={{ value: 'Kappa', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 } }}
          />
          
          <Tooltip 
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="accuracy" 
            name="Overall Accuracy (%)" 
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
          />
          
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="kappa" 
            name="Kappa Score" 
            stroke="#9333EA" 
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
