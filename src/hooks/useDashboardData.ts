
'use client';
import { useState, useEffect, useCallback } from 'react';
import { KPIMetric, KpiApiResponse, Booking, ApiCall as Call, Alert, ChartData } from '@/lib/types';
import { API_BASE_URL, API_CHARTS_BASE_URL } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';

const formatDurationFromSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to generate plausible sparkline data
const generateSparklineData = (currentValue: number, points: number = 8) => {
  // If currentValue is 0, create a flat line of small non-zero values to avoid division by zero.
  if (currentValue === 0) {
    return Array(points).fill(0.1);
  }
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
        isGood = higherIsBetter ? value >= targetValue : value <= targetValue;
    } else {
        isGood = higherIsBetter ? value >= targetValue : value <= targetValue;
    }

    // Special case for missed calls
    if (unit === 'number' && !higherIsBetter && value > targetValue) {
        return 'critical';
    }

    return isGood ? 'good' : 'warning';
};

export const useDashboardData = (dateRange: 'today' | 'last_week' | 'last_month' | 'all_time') => {
  const { isAuthenticated } = useAuth();
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chartData, setChartData] = useState<ChartData>({});
  
  const [kpiLoading, setKpiLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [callsLoading, setCallsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  const [kpiError, setKpiError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [callsError, setCallsError] = useState<string | null>(null);
  const [chartsError, setChartsError] = useState<string | null>(null);
  
  const getUrlWithFilter = useCallback((baseUrl: string, otherParams: string = '') => {
      let url = baseUrl;
      const params = new URLSearchParams(otherParams);
      
      if (dateRange !== 'all_time') {
          params.append('filter', dateRange);
      }

      const paramString = params.toString();
      if (paramString) {
          url += `?${paramString}`;
      }
      return url;
  }, [dateRange]);


  const fetchKpis = useCallback(async (signal: AbortSignal) => {
    setKpiLoading(true);
    setKpiError(null);
    setKpiMetrics([]); // Reset on new fetch
    setAlerts([]);

    try {
      const url = getUrlWithFilter(`${API_BASE_URL}/compute/kpis`);
      const response = await fetch(url, { signal });
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch KPIs: ${response.status} ${errorText || response.statusText}`);
      }
      const data: KpiApiResponse = await response.json();
      const kpis = data.kpis;

      const kpiConfig: { id: 'first_call_resolution_pct' | 'avg_call_duration_sec' | 'call_abandon_rate_pct' | 'customer_satisfaction_avg_rating' | 'missed_calls' | 'customer_conversion_rate_pct' | 'overall_quality_score' | 'positive_sentiment_rate_pct'; label: string; target: string; higherIsBetter: boolean, unit: 'percentage' | 'seconds' | 'number' | 'rating' }[] = [
          { id: 'first_call_resolution_pct', label: 'First Call Resolution', target: '>90%', higherIsBetter: true, unit: 'percentage' },
          { id: 'avg_call_duration_sec', label: 'Avg Call Duration', target: '<300s', higherIsBetter: false, unit: 'seconds' },
          { id: 'call_abandon_rate_pct', label: 'Call Abandon Rate', target: '<5%', higherIsBetter: false, unit: 'percentage' },
          { id: 'customer_satisfaction_avg_rating', label: 'Customer Satisfaction', target: '>4.0', higherIsBetter: true, unit: 'rating' },
          { id: 'missed_calls', label: 'Missed Calls', target: '0', higherIsBetter: false, unit: 'number' },
          { id: 'customer_conversion_rate_pct', label: 'Customer Conversion Rate', target: '>10%', higherIsBetter: true, unit: 'percentage' },
          { id: 'overall_quality_score', label: 'Overall Quality Score', target: '>85', higherIsBetter: true, unit: 'number' },
          { id: 'positive_sentiment_rate_pct', label: 'Positive Sentiment Rate', target: '>80%', higherIsBetter: true, unit: 'percentage' },
      ];
      
      const mappedKpis: KPIMetric[] = kpiConfig.map(config => {
          const value = kpis[config.id];
          const sparklineData = generateSparklineData(value);
          const trend = getTrend(sparklineData);

          const status = getKpiStatus(value, config.target, config.higherIsBetter, config.unit);

          let displayValue: string;

          switch (config.unit) {
              case 'percentage':
                  displayValue = `${value.toFixed(1)}%`;
                  break;
              case 'seconds':
                  displayValue = formatDurationFromSeconds(value);
                  break;
              case 'rating':
                  displayValue = `${value.toFixed(1)}/5`;
                  break;
              default: // number
                  displayValue = value.toString();
          }

          return {
              id: config.id,
              label: config.label,
              value: displayValue,
              target: config.target,
              trend: trend,
              status: status,
              sparklineData: sparklineData,
          };
      });
      
    
      setKpiMetrics(mappedKpis);

      // Generate dynamic alerts
      const newAlerts: Alert[] = [];
      if (kpis.missed_calls > 0) {
          newAlerts.push({
              id: 'alert-missed-calls',
              type: 'critical',
              title: 'Missed Calls Detected',
              message: `${kpis.missed_calls} call(s) were missed. Review agent availability.`,
              timestamp: new Date(),
              read: false,
          });
      }
      if (kpis.call_abandon_rate_pct > 5) {
          newAlerts.push({
              id: 'alert-abandon-rate',
              type: 'warning',
              title: 'High Abandonment Rate',
              message: `Call abandonment is at ${kpis.call_abandon_rate_pct.toFixed(1)}%, exceeding the 5% target.`,
              timestamp: new Date(),
              read: false,
          });
      }
      if (kpis.first_call_resolution_pct < 90) {
           newAlerts.push({
              id: 'alert-fcr',
              type: 'warning',
              title: 'Low First Call Resolution',
              message: `FCR is at ${kpis.first_call_resolution_pct.toFixed(1)}%, below the 90% target.`,
              timestamp: new Date(),
              read: false,
          });
      }
       if (newAlerts.length === 0) {
          newAlerts.push({
              id: 'alert-all-good',
              type: 'info',
              title: 'System Nominal',
              message: 'All key performance indicators are within their target ranges.',
              timestamp: new Date(),
              read: true,
          });
      }
      setAlerts(newAlerts);

    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (err instanceof Error) {
        setKpiError(err.message);
      } else {
        setKpiError('An unexpected error occurred while fetching KPIs.');
      }
    } finally {
      setKpiLoading(false);
    }
  }, [getUrlWithFilter]);
  
  const fetchBookings = useCallback(async (signal: AbortSignal) => {
    setBookingsLoading(true);
    setBookingsError(null);
    setRecentBookings([]); // Reset on new fetch
    try {
      const url = getUrlWithFilter(`${API_BASE_URL}/bookings/`, 'skip=0&limit=100');
      const response = await fetch(url, { signal });
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch bookings: ${response.status} ${errorText || response.statusText}`);
      }
      const data: Booking[] = await response.json();
      setRecentBookings(data);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (err instanceof Error) {
        setBookingsError(err.message);
      } else {
        setBookingsError('An unexpected error occurred while fetching bookings.');
      }
    } finally {
      setBookingsLoading(false);
    }
  }, [getUrlWithFilter]);
  
  const fetchCalls = useCallback(async (signal: AbortSignal) => {
    setCallsLoading(true);
    setCallsError(null);
    setActiveCalls([]); // Reset on new fetch

    try {
      const url = getUrlWithFilter(`${API_BASE_URL}/calls/`);
      const response = await fetch(url, { signal });
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch calls: ${response.status} ${errorText || response.statusText}`);
      }
      const data: Call[] = await response.json();
      setActiveCalls(data.slice(-5));
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (err instanceof Error) {
        setCallsError(err.message);
      } else {
        setCallsError('An unexpected error occurred while fetching calls.');
      }
    } finally {
      setCallsLoading(false);
    }
  }, [getUrlWithFilter]);
  
  const fetchChartData = useCallback(async (signal: AbortSignal) => {
    setChartsLoading(true);
    setChartsError(null);
    setChartData({});

    try {
      const url = getUrlWithFilter(`${API_CHARTS_BASE_URL}/overview`);
      const response = await fetch(url, { signal });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chart API Error: ${response.status} ${errorText}`);
      }
      const rawData = await response.json();
      const overview = rawData.overview;
      
      const transformedData: ChartData = {
          calls_trend: overview.calls_trend?.dates.map((date: string, i: number) => ({
              name: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
              value: overview.calls_trend.calls[i]
          })),
          bookings_trend: overview.bookings_trend?.dates.map((date: string, i: number) => ({
              name: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
              value: overview.bookings_trend.bookings[i]
          })),
          lead_funnel: overview.lead_funnel?.stages.map((stage: string, i: number) => ({
              stage,
              count: overview.lead_funnel.counts[i]
          })),
          lead_sources: overview.lead_sources?.sources.map((source: string, i: number) => ({
              name: source,
              value: overview.lead_sources.conversions[i]
          })),
          sentiment_summary: overview.sentiment_summary ? Object.entries(overview.sentiment_summary).map(([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              value,
          })) : [],
          call_intent: overview.call_intent?.intents.map((intent: string, i: number) => ({
              name: intent,
              value: overview.call_intent.counts[i]
          })),
          customer_growth: overview.customer_growth?.dates.map((date: string, i: number) => ({
              name: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
              value: overview.customer_growth.new_customers[i]
          })),
      };
      setChartData(transformedData);

    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      if (err instanceof Error) {
        setChartsError(err.message);
      } else {
        setChartsError('An unexpected error occurred fetching chart data.');
      }
    } finally {
      setChartsLoading(false);
    }
  }, [getUrlWithFilter]);


  useEffect(() => {
    if (!isAuthenticated) return;

    const controller = new AbortController();
    const signal = controller.signal;

    fetchKpis(signal);
    fetchBookings(signal);
    fetchCalls(signal);
    fetchChartData(signal);

    return () => {
      controller.abort();
    }
  }, [isAuthenticated, dateRange, fetchKpis, fetchBookings, fetchCalls, fetchChartData]);

  return { 
    kpiMetrics, 
    recentBookings, 
    activeCalls, 
    alerts,
    chartData,
    kpiLoading, 
    bookingsLoading, 
    callsLoading,
    chartsLoading,
    kpiError, 
    bookingsError, 
    callsError,
    chartsError
  };
};
