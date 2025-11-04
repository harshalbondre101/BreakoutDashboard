
'use client';
import { ChartCard } from '@/components/analytics/ChartCard';
import { ChartData } from '@/lib/types';

interface DashboardChartsProps {
  chartData: ChartData;
  isLoading: boolean;
  error: string | null;
}

export function DashboardCharts({ chartData, isLoading, error }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Calls Trend"
        chartType="line"
        data={chartData.calls_trend || []}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="Bookings Trend"
        chartType="bar"
        data={chartData.bookings_trend || []}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="Customer Growth"
        chartType="area"
        data={chartData.customer_growth || []}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="Sentiment Distribution"
        chartType="pie"
        data={chartData.sentiment_summary || []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
