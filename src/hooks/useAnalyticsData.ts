
'use client';
import { useState, useEffect, useRef } from 'react';
import { API_CHARTS_BASE_URL } from '@/lib/config';

const defaultChartsConfig = [
  { id: 'calls-trend', title: 'Calls Trend', chartType: 'line', endpoint: 'calls-trend' },
  { id: 'bookings-trend', title: 'Bookings Trend', chartType: 'bar', endpoint: 'bookings-trend' },
  { id: 'sentiment_summary', title: 'Call Sentiment Distribution', chartType: 'call-sentiment', endpoint: 'sentiment-summary' },
  { id: 'customer_growth', title: 'Customer Growth', chartType: 'area', endpoint: 'customer-growth' },
  { id: 'customer_rating', title: 'Customer Rating Distribution', chartType: 'pie', endpoint: 'customer-rating-summary' },
  { id: 'call_intent', title: 'Intent Distribution', chartType: 'pie', endpoint: 'call-intent-summary' },
];


type ChartConfigItem = {
    id: string;
    title: string;
    chartType: string;
    endpoint: string;
};

type FilterType = 'daily' | 'weekly' | 'quarterly' | 'half_yearly' | 'yearly' | 'today' | 'last_week' | 'last_month' | 'all_time';

// Data transformation functions
const transformCallsTrend = (data: any) => (data?.dates || []).map((date: string, index: number) => ({ date, total_calls: data.calls[index] }));
const transformBookingsTrend = (data: any) => (data?.dates || []).map((date: string, index: number) => ({ date, bookings: data.bookings[index] }));
const transformLeadFunnel = (data: any) => (data?.stages || []).map((stage: string, index: number) => ({ stage, count: data.counts[index] }));
const transformLeadSources = (data: any) => (data?.sources || []).map((source: string, index: number) => ({ name: source, value: data.conversions[index] }));
const transformCustomerGrowth = (data: any) => (data?.dates || []).map((date: string, index: number) => ({ date, total_customers: data.total[index] }));
const transformPaymentsStatus = (data: any) => Object.entries(data || {}).map(([name, value]) => ({ name, value: value as number }));
const transformCallSentiment = (data: any) => Object.entries(data || {}).map(([name, value]) => ({ name, value: value as number }));
const transformCustomerRating = (data: any) => (data?.ratings || []).map((rating: number, index: number) => ({ name: `${rating} Stars`, value: data.counts[index] }));
const transformIntentDistribution = (data: any) => {
    if (!data || !data.intents) return [];
    const combined = data.intents.map((intent: string, index: number) => ({
      name: intent,
      value: data.counts[index],
    }));

    combined.sort((a: { value: number }, b: { value: number }) => b.value - a.value);

    if (combined.length > 5) {
        const top5 = combined.slice(0, 5);
        const otherSum = combined.slice(5).reduce((acc: number, curr: { value: number }) => acc + curr.value, 0);
        return [...top5, { name: 'Other', value: otherSum }];
    }

    return combined;
};


const dataTransformers: Record<string, (data: any) => any[]> = {
    'calls_trend': transformCallsTrend,
    'bookings_trend': transformBookingsTrend,
    'sentiment_summary': transformCallSentiment,
    'customer_growth': transformCustomerGrowth,
    'customer_rating': transformCustomerRating,
    'call_intent': transformIntentDistribution,
    'lead-funnel': transformLeadFunnel,
    'lead-sources': transformLeadSources,
    'payments-status': transformPaymentsStatus,
};

export const useAnalyticsData = (chartsConfig: ChartConfigItem[] = defaultChartsConfig, filter?: FilterType) => {
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});

  const retryTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const isOverview = chartsConfig.some(c => c.endpoint === 'overview');

    const fetcher = async (attempt = 1) => {
        const initialLoadingState = chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: attempt === 1 }), {});
        setLoading(initialLoadingState);
        setError({});

        try {
            const url = filter ? `${API_CHARTS_BASE_URL}/overview?filter=${filter}` : `${API_CHARTS_BASE_URL}/overview`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
            }
            const overviewData = await response.json();
            
            const transformedData: Record<string, any[]> = {};
            for (const chart of chartsConfig) {
                const apiData = overviewData[chart.id];
                const transformer = dataTransformers[chart.id];
                if (apiData && transformer) {
                    transformedData[chart.id] = transformer(apiData);
                } else if (apiData) {
                    transformedData[chart.id] = Array.isArray(apiData) ? apiData : Object.entries(apiData).map(([name, value]) => ({ name, value }));
                } else {
                    transformedData[chart.id] = [];
                }
            }
            
            setData(transformedData);
            setRetrying({});

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while fetching overview data.';
            const errorState = chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: errorMessage }), {});
            setError(errorState);
            
            if (attempt < 5) {
                const retryState = chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: true }), {});
                setRetrying(retryState);
                const delay = Math.pow(2, attempt) * 1000;
                retryTimeouts.current['overview'] = setTimeout(() => fetcher(attempt + 1), delay);
            } else {
                setRetrying({});
            }
        } finally {
            if (attempt === 1) {
                setLoading({});
            }
        }
    };
    
    // This hook is now optimized for the overview case.
    // If a non-overview usage is needed later, this hook would need further generalization.
    if (isOverview) {
        if (retryTimeouts.current['overview']) {
            clearTimeout(retryTimeouts.current['overview']);
        }
        fetcher();
    }


    // Cleanup timeouts on unmount or when dependencies change
    return () => {
        Object.values(retryTimeouts.current).forEach(clearTimeout);
    };
  }, [JSON.stringify(chartsConfig), filter]);

  return { data, loading, error, isRetrying: retrying, chartsConfig };
};
