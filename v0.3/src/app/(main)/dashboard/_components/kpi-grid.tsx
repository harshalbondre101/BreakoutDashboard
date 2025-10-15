
'use client';
import { KPICard } from "@/components/kpi-card";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus, Waves } from 'lucide-react';
import { cn } from "@/lib/utils";

const kpiData = [
  { name: 'First Call Resolution', value: '78%', target: '75-85%', change: 'increase' as const, chartData: [{ v: 0 }, { v: 20 }, { v: 10 }, { v: 40 }, { v: 50 }] },
  { name: 'Avg Call Duration', value: '6.2 min', target: '4-8 min', change: 'increase' as const, chartData: [{ v: 20 }, { v: 30 }, { v: 25 }, { v: 45 }, { v: 60 }] },
  { name: 'Abandonment Rate', value: '6.8%', target: '<8%', change: 'decrease' as const, chartData: [{ v: 50 }, { v: 40 }, { v: 60 }, { v: 30 }, { v: 20 }] },
  { name: 'Customer Satisfaction', value: '87%', target: '>85%', change: 'increase' as const, chartData: [{ v: 10 }, { v: 30 }, { v: 20 }, { v: 50 }, { v_80: 80 }] },
  { name: 'Customer Effort Score', value: '2.3', target: '<3.0', change: 'decrease' as const, chartData: [{ v: 60 }, { v: 50 }, { v: 40 }, { v: 30 }, { v: 20 }] },
  { name: 'Live Positive Sentiment', value: '68%', target: '≥65%', change: 'increase' as const, chartData: [{ v: 20 }, { v: 40 }, { v_30: 30 }, { v: 60 }, { v: 70 }] },
  { name: 'Cost per Contact', value: '₹4.20', target: '<₹5.60', change: 'decrease' as const, chartData: [{ v: 70 }, { v: 60 }, { v: 50 }, { v: 40 }, { v: 30 }] },
  { name: 'Agent Utilization', value: '82.4%', target: '75-85%', change: 'neutral' as const, chartData: [{ v: 40 }, { v: 50 }, { v: 45 }, { v: 55 }, { v: 50 }] },
];

const changeIcons = {
    increase: <TrendingUp className="w-4 h-4" />,
    decrease: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />
};

const changeColors = {
    increase: "text-emerald-500",
    decrease: "text-red-500",
    neutral: "text-gray-500"
};

const borderColors = {
    increase: "border-l-emerald-500",
    decrease: "border-l-amber-500",
    neutral: "border-l-gray-300"
}

const chartColors = {
    increase: "var(--color-emerald)",
    decrease: "var(--color-amber)",
    neutral: "var(--color-gray)"
}

export function KpiGrid({ kpiMetrics, kpiLoading, kpiError }: { kpiMetrics: any[], kpiLoading: boolean, kpiError: string | null }) {
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
