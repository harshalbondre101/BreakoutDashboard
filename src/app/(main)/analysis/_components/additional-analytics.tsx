
'use client';
import { ChartCard } from '@/components/analytics/ChartCard';

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
};

interface ApiChart {
    title: string;
    x_axis?: (string | number)[];
    y_axis?: (string | number)[];
    data?: {
      labels: (string | number)[];
      values: (string | number)[];
    };
    chart_type: keyof typeof chartComponents;
}

interface AdditionalAnalyticsProps {
  charts: ApiChart[];
  loading: boolean;
}

export const AdditionalAnalytics = ({ charts, loading }: AdditionalAnalyticsProps) => {
  const transformData = (chart: ApiChart) => {
    if (chart.chart_type === 'funnel' && chart.data) {
      return chart.data.labels.map((label, index) => ({
        stage: label,
        count: chart.data.values[index],
      }));
    }
    if (chart.data) {
      return chart.data.labels.map((label, index) => ({
        name: label,
        value: chart.data.values[index],
      }));
    }
    if (chart.x_axis && chart.y_axis) {
      return chart.x_axis.map((x, index) => ({
        name: x,
        value: chart.y_axis[index],
      }));
    }
    return [];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Additional Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && charts.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={`pulse-api-${index}`} className="p-6 bg-gray-100 rounded-xl shadow-md h-72 animate-pulse" />
          ))
        ) : (
          charts.map((chart) => (
            <ChartCard
              key={chart.title}
              title={chart.title}
              chartType={chart.chart_type}
              data={transformData(chart)}
              isLoading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};
