
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


const getDummyData = (endpoint: string) => {
    if (endpoint === 'dummy-intent-distribution') {
        return [
            { name: 'Booking', value: 250 },
            { name: 'Inquiry', value: 450 },
            { name: 'Complaint', value: 80 },
            { name: 'Modification', value: 120 },
            { name: 'Other', value: 50 },
        ];
    }
    return null;
}

const dataTransformers: Record<string, (data: any) => any[]> = {
    'calls-trend': transformCallsTrend,
    'bookings-trend': transformBookingsTrend,
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

    if (isOverview) {
        // Single fetch for overview
        const fetchOverview = async (attempt = 1) => {
            setLoading(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: attempt === 1 }), prev));
            setError(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: null }), prev));

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
                    } else {
                        transformedData[chart.id] = [];
                    }
                }
                
                setData(transformedData);
                setRetrying(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: false }), prev));

            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while fetching overview data.';
                setError(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: errorMessage }), prev));
                
                if (attempt < 5) {
                    setRetrying(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: true }), prev));
                    const delay = Math.pow(2, attempt) * 1000;
                    retryTimeouts.current['overview'] = setTimeout(() => fetchOverview(attempt + 1), delay);
                } else {
                    setRetrying(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: false }), prev));
                }
            } finally {
                if (attempt === 1) {
                    setLoading(prev => chartsConfig.reduce((acc, c) => ({ ...acc, [c.id]: false }), prev));
                }
            }
        };

        if (retryTimeouts.current['overview']) {
            clearTimeout(retryTimeouts.current['overview']);
        }
        fetchOverview();

    } else {
        // Individual fetches for each chart
        const fetchDataWithRetry = async (id: string, endpoint: string, attempt = 1) => {
          setLoading(prev => ({ ...prev, [id]: attempt === 1 }));
          setError(prev => ({ ...prev, [id]: null }));

          const dummyData = getDummyData(endpoint);
          if (dummyData && endpoint === 'dummy-intent-distribution') {
            setData(prev => ({ ...prev, [id]: dummyData }));
            setLoading(prev => ({ ...prev, [id]: false }));
            setRetrying(prev => ({ ...prev, [id]: false }));
            return;
          }
          
          try {
            const url = filter ? `${API_CHARTS_BASE_URL}/${endpoint}?filter=${filter}` : `${API_CHARTS_BASE_URL}/${endpoint}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
            }
            const result = await response.json();
            
            if (result.message && result.message.includes("No data available")) {
                setData(prev => ({...prev, [id]: []}));
            } else {
                const transformer = dataTransformers[id];
                const transformedData = transformer ? transformer(result) : (result.charts || result || []);
                setData(prev => ({ ...prev, [id]: Array.isArray(transformedData) ? transformedData : [] }));
            }
            
            setError(prev => ({ ...prev, [id]: null }));
            setRetrying(prev => ({ ...prev, [id]: false }));

          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while fetching analytics data.';
            setError(prev => ({ ...prev, [id]: errorMessage }));
            
            if (attempt < 5) { // Retry up to 5 times
                setRetrying(prev => ({ ...prev, [id]: true }));
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                retryTimeouts.current[id] = setTimeout(() => {
                    fetchDataWithRetry(id, endpoint, attempt + 1);
                }, delay);
            } else {
                setRetrying(prev => ({ ...prev, [id]: false })); // Max retries reached
            }
          } finally {
             if (attempt === 1) {
                setLoading(prev => ({ ...prev, [id]: false }));
            }
          }
        };

        chartsConfig.forEach(chart => {
            if (retryTimeouts.current[chart.id]) {
                clearTimeout(retryTimeouts.current[chart.id]);
            }
            fetchDataWithRetry(chart.id, chart.endpoint);
        });
    }

    // Cleanup timeouts on unmount or when dependencies change
    return () => {
        Object.values(retryTimeouts.current).forEach(clearTimeout);
    };
  }, [JSON.stringify(chartsConfig), filter]);

  return { data, loading, error, isRetrying: retrying, chartsConfig };
};
