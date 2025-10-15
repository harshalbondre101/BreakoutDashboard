'use client';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import dynamic from 'next/dynamic';

const ChartCard = dynamic(() => import('./analytics/ChartCard').then(mod => mod.ChartCard), {
  ssr: false,
  loading: () => <div className="p-4 bg-white rounded-lg shadow-sm h-[300px] animate-pulse" />
});

// Define chartComponents without dynamic import for server components
const chartComponents = {
  line: "line",
  'bar-line': "bar-line",
  funnel: "funnel",
  pie: "pie",
  area: "area",
  'horizontal-bar': "horizontal-bar",
  'dual-bar': "dual-bar",
  donut: "donut",
  'call-sentiment': "call-sentiment",
};

export const AnalyticsOverview = () => {
  const { data, loading, error, chartsConfig } = useAnalyticsData();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics Overview</h2>
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