'use client';
import { KPICard } from '@/components/kpi-card';
import { KPIMetric } from '@/lib/types';

const formatDurationFromSeconds = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')} min`;
};

// Helper function to generate plausible sparkline data
const generateSparklineData = (currentValue: number, points: number = 8) => {
  const data = [currentValue];
  for (let i = 1; i < points; i++) {
    const fluctuation = (Math.random() - 0.5) * (currentValue * 0.2); // Fluctuate by up to 20%
    const previousValue = data[0];
    const newValue = Math.max(0, previousValue + fluctuation);
    data.unshift(newValue);
  }
  return data;
};

// Helper function to determine the trend
const getTrend = (sparklineData: number[]): 'up' | 'down' | 'stable' => {
  if (sparklineData.length < 2) return 'stable';
  const last = sparklineData[sparklineData.length - 1];
  const secondLast = sparklineData[sparklineData.length - 2];
  if (last > secondLast) return 'up';
  if (last < secondLast) return 'down';
  return 'stable';
};

const getKpiStatus = (value: number, target: string, higherIsBetter: boolean, unit: 'percentage' | 'seconds' | 'number' | 'rating'): 'good' | 'warning' | 'critical' => {
    const targetValue = parseFloat(target.replace(/[^\d.-]/g, ''));
    let isGood = false;

    if (unit === 'seconds') {
        // For seconds, the target is in minutes, so we convert it
        isGood = higherIsBetter ? value >= targetValue * 60 : value <= targetValue * 60;
    } else {
        isGood = higherIsBetter ? value >= targetValue : value <= targetValue;
    }

    // Special case for missed calls
    if (unit === 'number' && !higherIsBetter && value > targetValue) {
        return 'critical';
    }

    return isGood ? 'good' : 'warning';
};

export const KpiGrid = ({ kpiMetrics, kpiLoading, kpiError }: { kpiMetrics: KPIMetric[], kpiLoading: boolean, kpiError: string | null }) => {
  if (kpiLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (kpiError) {
    return (
      <div className="col-span-full bg-red-50 text-red-700 p-4 rounded-lg text-center">
        <p>Failed to load KPI data.</p>
        <p className="text-sm">{kpiError}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiMetrics.map((metric) => (
        <KPICard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
