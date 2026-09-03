"use client";

import React, { useState } from 'react';
import { Download, Table as TableIcon } from 'lucide-react';

interface ChartWrapperProps {
  title: string;
  city?: string;
  sourceNote?: string;
  datasetVersion?: string;
  hasUnitToggle?: boolean;
  unit?: 'pct' | 'km2';
  onUnitChange?: (unit: 'pct' | 'km2') => void;
  children: React.ReactNode;
  data: any[];
  columns: { key: string; label: string; format?: (val: any) => string | number }[];
}

export function ChartWrapper({
  title,
  city,
  sourceNote,
  datasetVersion,
  hasUnitToggle,
  unit,
  onUnitChange,
  children,
  data,
  columns
}: ChartWrapperProps) {
  const [showTable, setShowTable] = useState(false);

  const downloadCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const val = row[col.key];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full w-full">
      <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title} {city && <span className="text-gray-500 font-normal">| {city}</span>}</h3>
          {datasetVersion && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              v{datasetVersion}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnitToggle && onUnitChange && (
            <div className="flex bg-gray-100 rounded-md p-0.5">
              <button 
                onClick={() => onUnitChange('pct')}
                className={`px-3 py-1 text-xs font-medium rounded-sm ${unit === 'pct' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
              >
                %
              </button>
              <button 
                onClick={() => onUnitChange('km2')}
                className={`px-3 py-1 text-xs font-medium rounded-sm ${unit === 'km2' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
              >
                km²
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setShowTable(!showTable)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title={showTable ? "Show Chart" : "Show Data Table"}
            aria-label={showTable ? "Show Chart" : "Show Data Table"}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          
          <button 
            onClick={downloadCSV}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Download CSV"
            aria-label="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px] relative w-full">
        {showTable ? (
          <div className="absolute inset-0 overflow-auto border border-gray-200 rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 bg-gray-50 sticky top-0">
                <tr>
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-2 font-medium">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-2">
                        {col.format ? col.format(row[col.key]) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
      
      {sourceNote && (
        <div className="mt-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
          {sourceNote}
        </div>
      )}
    </div>
  );
}
