
'use client';

import { Brain } from 'lucide-react';

interface AiMetric {
  name: string;
  value: number;
}

interface AiPerformanceProps {
  metrics: AiMetric[];
  loading: boolean;
}

export function AiPerformance({ metrics, loading }: AiPerformanceProps) {

  const renderKpiCards = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100 h-24 animate-pulse" />
      ));
    }
    
    if (!metrics || metrics.length === 0) {
        return (
             <div className="col-span-full text-gray-500 p-4 rounded-lg text-center">
                <p>No AI KPI data available for this period.</p>
            </div>
        )
    }

    return metrics.map((metric) => (
      <div key={metric.name} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
        <p className="text-2xl font-bold text-gray-900">{metric.value.toFixed(2)}%</p>
      </div>
    ));
  };


  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Performance Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {renderKpiCards()}
      </div>
    </div>
  );
}
