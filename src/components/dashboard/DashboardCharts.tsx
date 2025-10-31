
'use client';
import { ChartCard } from '@/components/analytics/ChartCard';
import { useDashboardCharts } from '@/hooks/useDashboardCharts';
import { useDashboardFilter } from '@/context/DashboardFilterContext';

interface DashboardChartsProps {
  canLoad: boolean;
}

export const DashboardCharts = ({ canLoad }: DashboardChartsProps) => {
  const { dateRange } = useDashboardFilter();
  const { chartsData, loading, error } = useDashboardCharts(dateRange, canLoad);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 col-span-full text-center text-red-500">
        <p>Could not load chart data: {error}</p>
      </div>
    );
  }
  
  if (loading && chartsData.length === 0) {
      return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 flex flex-col h-72">
                    <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="flex-1 flex items-center justify-center animate-pulse bg-gray-50 rounded-md">
                        <p className="text-gray-500">Loading Chart...</p>
                    </div>
                </div>
            ))}
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {chartsData.map((chart, index) => (
        <ChartCard
          key={index}
          title={chart.title}
          chartType={chart.chartType}
          data={chart.data}
          isLoading={loading}
          error={null}
        />
      ))}
    </div>
  );
};
