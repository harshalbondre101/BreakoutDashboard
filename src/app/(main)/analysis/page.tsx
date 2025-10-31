
'use client';
import { useState, useEffect } from 'react';
import { KPIMetric } from '@/lib/types';
import { API_BASE_URL } from '@/lib/config';
import { BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExecutiveOverview } from './_components/executive-overview';
import { KpiSection } from './_components/kpi-section';
import { AiPerformance } from './_components/ai-performance';
import { Alerts } from './_components/alerts';
import { AdditionalAnalytics } from './_components/additional-analytics';
import { useAuth } from '@/context/AuthContext';
import { useDashboardFilter } from '@/context/DashboardFilterContext';

const formatDurationFromSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function AnalysisPage() {
  const [executiveMetrics, setExecutiveMetrics] = useState<KPIMetric[]>([]);
  const [allOtherKpis, setAllOtherKpis] = useState<Record<string, any[]>>({
    customers: [],
    leads: [],
    bookings: [],
    llmkpi: [],
    charts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { dateRange } = useDashboardFilter();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllKpis = async () => {
        setLoading(true);
        setError(null);
        setExecutiveMetrics([]);
        setAllOtherKpis({ customers: [], leads: [], bookings: [], llmkpi: [], charts: [] });

        try {
            // Fetch executive KPIs
            const execUrl = `${API_BASE_URL}/compute/kpis?filter=${dateRange}`;
            const execResponse = await fetch(execUrl, { signal });
            if (!execResponse.ok) {
                throw new Error(`Failed to fetch executive KPIs: ${execResponse.statusText}`);
            }
            const execData = await execResponse.json();
            
            const executiveKpiConfig: { id: keyof typeof execData.kpis; label: string; target: string; higherIsBetter: boolean, unit: 'percentage' | 'seconds' | 'number' | 'rating' }[] = [
              { id: 'first_call_resolution_pct', label: 'First Call Resolution', target: '>90%', higherIsBetter: true, unit: 'percentage' },
              { id: 'avg_call_duration_sec', label: 'Avg Call Duration', target: '<300s', higherIsBetter: false, unit: 'seconds' },
              { id: 'call_abandon_rate_pct', label: 'Call Abandon Rate', target: '<5%', higherIsBetter: false, unit: 'percentage' },
              { id: 'missed_calls', label: 'Missed Calls', target: '0', higherIsBetter: false, unit: 'number' },
              { id: 'overall_quality_score', label: 'Overall Quality Score', target: '>85', higherIsBetter: true, unit: 'number' },
              { id: 'positive_sentiment_rate_pct', label: 'Positive Sentiment Rate', target: '>80%', higherIsBetter: true, unit: 'percentage' },
            ];
            
            const processKpis = (kpis: any, config: any[]): KPIMetric[] => {
                return config.map(conf => {
                    const value = kpis[conf.id];
                    if (value === undefined || value === null) return null;
                    const displayValue = conf.unit === 'percentage' ? `${Number(value).toFixed(2)}%` : conf.unit === 'seconds' ? formatDurationFromSeconds(Number(value)) : String(value);
                    return { id: conf.id, label: conf.label, value: displayValue, target: conf.target, status: 'good', trend: 'stable', sparklineData: [] };
                }).filter(Boolean) as KPIMetric[];
            };

            setExecutiveMetrics(processKpis(execData.kpis, executiveKpiConfig));

            // Fetch all other KPIs
            const allKpisUrl = `${API_BASE_URL}/kpis/all?filter=${dateRange}`;
            const allKpisResponse = await fetch(allKpisUrl, { signal });
            if (!allKpisResponse.ok) {
                throw new Error(`Failed to fetch all KPIs: ${allKpisResponse.statusText}`);
            }
            const allKpisData = await allKpisResponse.json();
            setAllOtherKpis({
                customers: allKpisData.customers || [],
                leads: allKpisData.leads || [],
                bookings: allKpisData.bookings || [],
                llmkpi: allKpisData.llmkpi || [],
                charts: allKpisData.charts || [],
            });

        } catch (err) {
            if ((err as Error).name === 'AbortError') {
              console.log('Fetch aborted');
              return;
            }
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    fetchAllKpis();

    return () => {
      controller.abort();
    };
  }, [isAuthenticated, dateRange]);

  const allMetricsForAlerts = [
      ...executiveMetrics, 
  ];
  
  const customerKpiIds = ['total_customers', 'new_customers', 'avg_spend_per_customer', 'customer_satisfaction_avg_rating', 'customer_conversion_rate'];
  const leadKpiIds = ['total_leads_generated', 'lead_conversion_rate', 'avg_lead_response_time', 'best_lead_source', 'qualified_lead_ratio'];
  const bookingKpiIds = ['total_bookings', 'booking_conversion_rate', 'avg_booking_value', 'cancellation_rate', 'repeat_booking_rate'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Hub</h1>
            <p className="text-gray-500 mt-1">Deep dive analytics and AI performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Executive Overview</h2>
            </div>
            <ExecutiveOverview metrics={executiveMetrics} loading={loading} error={error} />
          </div>

          <Tabs defaultValue="customers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <KpiSection 
                title="KPIs - Customers" 
                kpiIds={customerKpiIds}
                metrics={allOtherKpis.customers}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="leads">
              <KpiSection 
                title="KPIs - Leads"
                kpiIds={leadKpiIds}
                metrics={allOtherKpis.leads}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="bookings">
              <KpiSection
                title="KPIs - Bookings"
                kpiIds={bookingKpiIds}
                metrics={allOtherKpis.bookings}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
          
          <AdditionalAnalytics charts={allOtherKpis.charts} loading={loading} />
          <AiPerformance metrics={allOtherKpis.llmkpi} loading={loading} />
          <Alerts metrics={allMetricsForAlerts} loading={loading} />
        </div>
      </div>
    </div>
  );
}
