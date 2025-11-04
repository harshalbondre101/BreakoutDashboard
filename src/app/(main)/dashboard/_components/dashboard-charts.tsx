
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        title="Lead Funnel"
        chartType="funnel"
        data={chartData.lead_funnel || []}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="Lead Sources"
        chartType="bubble"
        data={chartData.lead_sources || []}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="Call Intents"
        chartType="donut"
        data={chartData.call_intent || []}
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
