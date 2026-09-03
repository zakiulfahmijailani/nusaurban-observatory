'use client';

import React, { useEffect, useState } from 'react';

interface MetricsPanelProps {
  city: 'jakarta' | 'bandung';
  year: number;
}

interface MetricsData {
  rthProxyPercent: number;
  rthDeficit: number;
  rthAreaHa: number;
  vegetationArea: number;
  vegetationPercent: number;
  waterArea: number;
  waterPercent: number;
  urbanArea: number;
  urbanPercent: number;
  openLandArea: number;
  openLandPercent: number;
  overallAccuracy: number;
  kappa: number;
  datasetVersion: string;
  reconciliationStatus: string;
  rthCompliant: boolean;
}

export default function MetricsPanel({ city, year }: MetricsPanelProps) {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchMetrics() {
      try {
        const res = await fetch(`/api/metrics/${city}/${year}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        // Fallback dummy data for now
        if (isMounted) {
          setData({
            rthProxyPercent: 12.5,
            rthDeficit: 17.5,
            rthAreaHa: 12500,
            vegetationArea: 12000,
            vegetationPercent: 12.0,
            waterArea: 500,
            waterPercent: 0.5,
            urbanArea: 80000,
            urbanPercent: 80.0,
            openLandArea: 7500,
            openLandPercent: 7.5,
            overallAccuracy: 89.5,
            kappa: 0.82,
            datasetVersion: 'v1.0',
            reconciliationStatus: 'Verified',
            rthCompliant: false
          });
          setLoading(false);
        }
      }
    }

    fetchMetrics();
    return () => { isMounted = false; };
  }, [city, year]);

  if (loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
        <div className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-40 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 space-y-6 text-sm text-zinc-800 dark:text-zinc-200">
      <div>
        <h2 className="text-xl font-bold capitalize mb-1">{city} - {year}</h2>
        <p className="text-xs text-zinc-500">Dataset Version: {data.datasetVersion} • {data.reconciliationStatus}</p>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
        <h3 className="font-semibold mb-2">RTH Proxy Status</h3>
        <div className="flex items-end gap-2 mb-1">
          <span className={`text-3xl font-bold ${data.rthCompliant ? 'text-green-600' : 'text-red-600'}`}>
            {data.rthProxyPercent.toFixed(1)}%
          </span>
          <span className="text-zinc-500 mb-1">/ 30% (policy benchmark)</span>
        </div>
        {!data.rthCompliant && (
          <p className="text-red-600 text-xs mt-1">Deficit: {data.rthDeficit.toFixed(1)}%</p>
        )}
        <p className="text-xs mt-2">Est. RTH Area: {data.rthAreaHa.toLocaleString()} ha</p>
      </div>

      <div>
        <h3 className="font-semibold mb-3 border-b pb-1">Land Cover Composition</h3>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-[#2E7D32] rounded-sm"></span>Vegetation</span>
            <span className="font-mono">{data.vegetationPercent.toFixed(1)}% ({data.vegetationArea.toLocaleString()} ha)</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-[#1976D2] rounded-sm"></span>Water</span>
            <span className="font-mono">{data.waterPercent.toFixed(1)}% ({data.waterArea.toLocaleString()} ha)</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-[#D84315] rounded-sm"></span>Urban</span>
            <span className="font-mono">{data.urbanPercent.toFixed(1)}% ({data.urbanArea.toLocaleString()} ha)</span>
          </li>
          <li className="flex justify-between">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-[#F9A825] rounded-sm"></span>Open Land</span>
            <span className="font-mono">{data.openLandPercent.toFixed(1)}% ({data.openLandArea.toLocaleString()} ha)</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 border-t text-xs text-zinc-500">
        <p>Overall Accuracy: {data.overallAccuracy}%</p>
        <p>Kappa: {data.kappa}</p>
      </div>
    </div>
  );
}
