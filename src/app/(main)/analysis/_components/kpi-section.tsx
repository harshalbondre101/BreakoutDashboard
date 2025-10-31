
'use client';

import { KPICard } from '@/components/kpi-card';

interface ApiKpi {
  name: string;
  value: number | string;
  unit?: string;
}

interface KpiSectionProps {
  title: string;
  kpiIds: string[];
  metrics: ApiKpi[];
  loading: boolean;
}

const formatValue = (value: number | string, unit?: string) => {
  if (typeof value === 'string') return value;
  if (unit === '%') return `${value.toFixed(2)}%`;
  if (unit === 'currency') return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (unit === 'hours') {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h ${minutes}m`;
  }
  return value.toString();
};

export function KpiSection({ title, kpiIds, metrics, loading }: KpiSectionProps) {
  const items = metrics
    .filter((m: ApiKpi) => kpiIds.includes(m.name))
    .map(m => ({
        id: m.name,
        label: m.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: formatValue(m.value, m.unit),
        target: 'N/A',
        status: 'good',
        trend: 'stable',
        sparklineData: Array.from({length: 8}, () => Math.random() * 100)
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {items.length === 0 && !loading ? (
        <div className="text-sm text-gray-500">No KPIs available for this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg h-24 animate-pulse" />
          )) : items.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </div>
      )}
    </div>
  );
}
