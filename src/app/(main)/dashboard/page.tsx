
'use client';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Header } from './_components/Header';
import { KpiGrid } from './_components/kpi-grid';
import { ActiveCalls } from './_components/active-calls';
import { RecentBookings } from './_components/recent-bookings';
import { SystemAlerts } from './_components/system-alerts';
import { AnalyticsOverview } from '@/components/analytics-overview';
import { DashboardFilterProvider, useDashboardFilter } from '@/context/DashboardFilterContext';

function DashboardContent() {
  const { dateRange } = useDashboardFilter();
  const { 
    kpiMetrics, 
    recentBookings, 
    activeCalls, 
    callVolume, 
    alerts, 
    kpiLoading, 
    bookingsLoading, 
    callsLoading, 
    kpiError, 
    bookingsError, 
    callsError 
  } = useDashboardData(dateRange);

  return (
    <div className="space-y-6">
      <Header />

      <KpiGrid kpiMetrics={kpiMetrics} kpiLoading={kpiLoading} kpiError={kpiError} />

      <AnalyticsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActiveCalls 
            activeCalls={activeCalls} 
            callsLoading={callsLoading} 
            callsError={callsError} 
          />
        </div>

        <div className="space-y-6">
          <RecentBookings 
            recentBookings={recentBookings} 
            bookingsLoading={bookingsLoading} 
            bookingsError={bookingsError} 
          />
          <SystemAlerts alerts={alerts} kpiLoading={kpiLoading} />
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  return (
    <DashboardFilterProvider>
      <DashboardContent />
    </DashboardFilterProvider>
  )
}
