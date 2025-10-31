
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/config';

interface ChartData {
  title: string;
  chartType:
    | 'line'
    | 'bar'
    | 'bar-line'
    | 'funnel'
    | 'pie'
    | 'area'
    | 'horizontal-bar'
    | 'dual-bar'
    | 'donut'
    | 'call-sentiment'
    | 'treemap'
    | 'bubble';
  data: any[];
}

export const useDashboardCharts = (dateRange: 'today' | 'last_week' | 'last_month' | 'all_time', shouldFetch: boolean) => {
    const { isAuthenticated } = useAuth();
    const [chartsData, setChartsData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !shouldFetch) {
            setChartsData([]);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchChartData = async () => {
            setLoading(true);
            setError(null);
            setChartsData([]);

            try {
                let url = `${API_BASE_URL}/api/dashboard/overview`;
                if (dateRange !== 'all_time') {
                    url += `?filter=${dateRange}`;
                }

                const response = await fetch(url, { signal });
                if (!response.ok) {
                    throw new Error(`Failed to fetch chart data: ${response.statusText}`);
                }
                const rawData = await response.json();
                
                const transformedCharts: ChartData[] = [];

                // 1. Calls Trend
                if (rawData.calls_trend) {
                    transformedCharts.push({
                        title: "Calls Trend",
                        chartType: "line",
                        data: rawData.calls_trend.dates.map((date: string, index: number) => ({
                            date,
                            total_calls: rawData.calls_trend.calls[index]
                        }))
                    });
                }
                 // 2. Bookings Trend
                if (rawData.bookings_trend) {
                    transformedCharts.push({
                        title: "Bookings Trend",
                        chartType: "bar",
                        data: rawData.bookings_trend.dates.map((date: string, index: number) => ({
                            date,
                            bookings: rawData.bookings_trend.bookings[index]
                        }))
                    });
                }
                // 3. Lead Funnel
                if (rawData.lead_funnel) {
                    transformedCharts.push({
                        title: "Lead Funnel",
                        chartType: "funnel",
                        data: rawData.lead_funnel.stages.map((stage: string, index: number) => ({
                            stage,
                            count: rawData.lead_funnel.counts[index]
                        }))
                    });
                }
                // 4. Lead Sources
                 if (rawData.lead_sources) {
                    transformedCharts.push({
                        title: "Lead Sources by Conversion",
                        chartType: "horizontal-bar",
                        data: rawData.lead_sources.sources.map((source: string, index: number) => ({
                            name: source,
                            value: rawData.lead_sources.conversions[index]
                        }))
                    });
                }
                // 5. Sentiment Summary
                if (rawData.sentiment_summary) {
                    transformedCharts.push({
                        title: "Sentiment Summary",
                        chartType: "donut",
                        data: Object.entries(rawData.sentiment_summary).map(([name, value]) => ({
                            name: name.charAt(0).toUpperCase() + name.slice(1),
                            value
                        }))
                    });
                }
                // 6. Revenue Summary
                if (rawData.revenue_summary) {
                    transformedCharts.push({
                        title: "Revenue Summary",
                        chartType: "bar",
                        data: [
                            { name: 'Total Revenue', value: rawData.revenue_summary.total_revenue },
                            { name: 'Received', value: rawData.revenue_summary.total_received },
                            { name: 'Dues', value: rawData.revenue_summary.total_dues }
                        ]
                    });
                }

                setChartsData(transformedCharts);

            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchChartData();

        return () => {
            controller.abort();
        };

    }, [isAuthenticated, dateRange, shouldFetch]);

    return { chartsData, loading, error };
};
