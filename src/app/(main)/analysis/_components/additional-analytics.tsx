
'use client';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { ChartCard } from '@/components/analytics/ChartCard';


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

const movedChartsConfig = [
  { id: 'revenue-summary', title: 'Revenue vs Refunds', chartType: 'dual-bar', endpoint: 'revenue-summary' },
  { id: 'payments-status', title: 'Payments Status Breakdown', chartType: 'donut', endpoint: 'payments-status' },
  { id: 'lead-funnel', title: 'Lead Conversion Funnel', chartType: 'horizontal-bar', endpoint: 'lead-funnel' },
];

export const AdditionalAnalytics = () => {
  const { data, loading, error } = useAnalyticsData(movedChartsConfig);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movedChartsConfig.map((chart) => (
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
