import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { ActiveCalls } from "./_components/active-calls";
import { RecentBookings } from "./_components/recent-bookings";
import { KPICard } from "@/components/kpi-card";
import { kpiMetrics } from "@/lib/data";

export default function DashboardPage() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <>
      <Header title="Command Center" subtitle="Real-time operational overview">
        <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                System Online
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
            </div>
        </div>
      </Header>
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiMetrics.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActiveCalls />
            <RecentBookings />
        </div>
      </main>
    </>
  );
}
