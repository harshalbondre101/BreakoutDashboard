
'use client';
import { useState } from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { ChartCard } from './analytics/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartComponents = {
  line: "line",
  bar: "bar",
  'bar-line': "bar-line",
  funnel: "funnel",
  pie: "pie",
  area: "area",
  'horizontal-bar': "horizontal-bar",
  'dual-bar': "dual-bar",
  donut: "donut",
  'call-sentiment': "call-sentiment",
  bubble: "bubble",
  treemap: "treemap",
};

type FilterType = 'daily' | 'weekly' | 'quarterly' | 'half_yearly' | 'yearly';

export const AnalyticsOverview = () => {
  const [filter, setFilter] = useState<FilterType>('weekly');
  const { data, loading, error, chartsConfig } = useAnalyticsData(undefined, filter);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Analytics Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartsConfig.map((chart) => (
          <ChartCard
            key={chart.id}
            title={chart.title}
            chartType={chart.chartType as keyof typeof chartComponents}
            data={data[chart.id] || []}
            isLoading={loading[chart.id]}
            error={error[chart.id]}
          />
        ))}
      </div>
    </div>
  );
};
