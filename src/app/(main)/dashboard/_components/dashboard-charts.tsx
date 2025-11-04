
'use client';
import { ChartCard } from '@/components/analytics/ChartCard';
import {
  callVolumeData,
  sentimentDistributionData,
  callResolutionData,
  callDurationData,
  callIntentData,
  csatData,
} from '@/lib/data';

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ChartCard
        title="Call Volume (24h)"
        chartType="bar"
        data={callVolumeData}
        isLoading={false}
      />
      <ChartCard
        title="Sentiment Distribution"
        chartType="pie"
        data={sentimentDistributionData}
        isLoading={false}
      />
      <ChartCard
        title="First Call Resolution Rate"
        chartType="line"
        data={callResolutionData}
        isLoading={false}
      />
      <ChartCard
        title="Average Call Duration (min)"
        chartType="area"
        data={callDurationData}
        isLoading={false}
      />
      <ChartCard
        title="Call Intents"
        chartType="donut"
        data={callIntentData}
        isLoading={false}
      />
      <ChartCard
        title="CSAT Scores"
        chartType="horizontal-bar"
        data={csatData}
        isLoading={false}
      />
    </div>
  );
}
