import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/kpi-card";
import { analysisKpis, systemHealth } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import AiInsights from "./_components/ai-insights";
import { TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

const statusColors = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

const recentAudits = [
    { id: 'ra1', area: 'Payment Gateway', result: 'passed', timestamp: '2024-07-28T14:00Z' },
    { id: 'ra2', area: 'Data Privacy', result: 'passed', timestamp: '2024-07-27T11:00Z' },
    { id: 'ra3', area: 'AI Call Routing', result: 'failed', timestamp: '2024-07-26T09:30Z' },
];

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

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map(metric => (
                <div key={metric.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">{metric.name}</span>
                    <span className="text-sm font-bold">{metric.value}</span>
                  </div>
                  <Progress value={parseFloat(metric.value)} className={`h-2 [&>div]:${statusColors[metric.status as keyof typeof statusColors]}`}/>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAudits.map(audit => (
                    <TableRow key={audit.id}>
                      <TableCell>{audit.area}</TableCell>
                      <TableCell>
                        <Badge variant={audit.result === 'passed' ? 'default' : 'destructive'} className={audit.result === 'passed' ? 'bg-emerald-100 text-emerald-800' : ''}>
                          {audit.result === 'passed' ? <CheckCircle className="mr-1 w-3 h-3"/> : <AlertTriangle className="mr-1 w-3 h-3"/>}
                          {audit.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(audit.timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
