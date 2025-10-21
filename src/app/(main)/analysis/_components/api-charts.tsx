
'use client';
import { useState, useEffect } from 'react';
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
    x_axis: (string | number)[];
    y_axis: (string | number)[];
    chart_type: keyof typeof chartComponents;
}

export const ApiCharts = () => {
  const [charts, setCharts] = useState<ApiChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://breakout-project.onrender.com/kpis/charts');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch charts: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        setCharts(data.charts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load charts.');
      } finally {
        setLoading(false);
      }
    };
    fetchCharts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-6 bg-gray-100 rounded-xl shadow-md h-72 animate-pulse" />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Insights</h2>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            <p>Failed to load additional charts.</p>
            <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const transformData = (chart: ApiChart) => {
    return chart.x_axis.map((x, index) => ({
      name: x,
      value: chart.y_axis[index],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart) => (
          <ChartCard
            key={chart.title}
            title={chart.title}
            chartType={chart.chart_type}
            data={transformData(chart)}
          />
        ))}
      </div>
    </div>
  );
};
