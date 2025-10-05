import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/kpi-card";
import { analysisKpis } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import AiInsights from "./_components/ai-insights";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";


const heatmapData = [
    { kpi: 'Revenue Growth', status: 'increase' },
    { kpi: 'Customer Churn', status: 'decrease' },
    { kpi: 'Booking Rate', status: 'increase' },
    { kpi: 'Avg. Call Duration', status: 'decrease' },
    { kpi: 'CSAT Score', status: 'increase' },
    { kpi: 'AI Resolution Rate', status: 'increase' },
    { kpi: 'Agent Productivity', status: 'neutral' },
    { kpi: 'Marketing ROI', status: 'increase' },
];

const statusStyles = {
    increase: 'bg-emerald-100 text-emerald-800',
    decrease: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
    increase: <TrendingUp className="w-5 h-5" />,
    decrease: <TrendingDown className="w-5 h-5" />,
    neutral: <Minus className="w-5 h-5" />,
};


export default function AnalysisPage() {
  return (
    <>
      <Header title="Business Intelligence Hub" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Executive Overview</CardTitle>
              <CardDescription>A summary of key AI and quality performance indicators.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {analysisKpis.map((metric) => (
                <KPICard key={metric.id} metric={metric} />
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Performance Heatmap</CardTitle>
              <CardDescription>At-a-glance view of KPI trends. Green is positive, red is negative.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {heatmapData.map((item) => (
                <div key={item.kpi} className={cn("p-3 rounded-lg flex items-center gap-3", statusStyles[item.status as keyof typeof statusStyles])}>
                    {statusIcons[item.status as keyof typeof statusIcons]}
                    <span className="text-sm font-medium">{item.kpi}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Actionable recommendations from our AI analysis engine.</CardDescription>
            </CardHeader>
            <CardContent>
              <AiInsights />
            </CardContent>
          </Card>
        </section>

      </main>
    </>
  );
}
