
'use client';
import { useState, useEffect } from 'react';
import { API_CHARTS_BASE_URL } from '@/lib/config';

const chartsConfig = [
  { id: 'calls-trend', title: 'Calls Trend (Last 7 Days)', chartType: 'line', endpoint: '/calls-trend' },
  { id: 'bookings-revenue', title: 'Bookings & Revenue Trend', chartType: 'bar-line', endpoint: '/bookings-trend' },
  { id: 'lead-funnel', title: 'Lead Conversion Funnel', chartType: 'funnel', endpoint: '/lead-funnel' },
  { id: 'lead-sources', title: 'Lead Source Effectiveness', chartType: 'pie', endpoint: '/lead-sources' },
  { id: 'customer-growth', title: 'Customer Growth Over Time', chartType: 'area', endpoint: '/customer-growth' },
  { id: 'customer-segments', title: 'Customer Segments by Location', chartType: 'horizontal-bar', endpoint: '/customer-segments' },
  { id: 'revenue-summary', title: 'Revenue vs Refunds', chartType: 'dual-bar', endpoint: '/revenue-summary' },
  { id: 'payments-status', title: 'Payments Status Breakdown', chartType: 'donut', endpoint: '/payments-status' },
  { id: 'call-sentiment', title: 'Call Sentiment Distribution', chartType: 'call-sentiment', endpoint: '/sentiment-summary' },
];

// Data transformation functions
const transformCallsTrend = (data: any) => data.dates.map((date: string, index: number) => ({ date, total_calls: data.calls[index] }));
const transformBookingsRevenue = (data: any) => data.dates.map((date: string, index: number) => ({ date, bookings: data.bookings[index], revenue: data.revenue[index] }));
const transformLeadFunnel = (data: any) => data.stages.map((stage: string, index: number) => ({ stage, count: data.counts[index] }));
const transformLeadSources = (data: any) => data.sources.map((source: string, index: number) => ({ name: source, value: data.conversions[index] }));
const transformCustomerGrowth = (data: any) => data.dates.map((date: string, index: number) => ({ date, total_customers: data.total[index] }));
const transformCustomerSegments = (data: any) => data.regions.map((region: string, index: number) => ({ region, count: data.counts[index] }));
const transformRevenueSummary = (data: any) => data.dates.map((date: string, index: number) => ({ date, revenue: data.revenue[index], refunds: data.refunds[index] }));
const transformPaymentsStatus = (data: any) => Object.entries(data).map(([name, value]) => ({ name, value: value as number }));
const transformCallSentiment = (data: any) => Object.entries(data).map(([name, value]) => ({ name, value: value as number }));

export const useAnalyticsData = () => {
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const fetchData = async (id: string, endpoint: string) => {
      setLoading(prev => ({ ...prev, [id]: true }));
      setError(prev => ({ ...prev, [id]: null }));
      try {
        const response = await fetch(`${API_CHARTS_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        let transformedData;
        switch(id) {
          case 'calls-trend': transformedData = transformCallsTrend(result); break;
          case 'bookings-revenue': transformedData = transformBookingsRevenue(result); break;
          case 'lead-funnel': transformedData = transformLeadFunnel(result); break;
          case 'lead-sources': transformedData = transformLeadSources(result); break;
          case 'customer-growth': transformedData = transformCustomerGrowth(result); break;
          case 'customer-segments': transformedData = transformCustomerSegments(result); break;
          case 'revenue-summary': transformedData = transformRevenueSummary(result); break;
          case 'payments-status': transformedData = transformPaymentsStatus(result); break;
          case 'call-sentiment': transformedData = transformCallSentiment(result); break;
          default: transformedData = result;
        }

        setData(prev => ({ ...prev, [id]: transformedData }));
      } catch (e) {
        setError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'An error occurred' }));
      } finally {
        setLoading(prev => ({ ...prev, [id]: false }));
      }
    };

    chartsConfig.forEach(chart => fetchData(chart.id, chart.endpoint));
  }, []);

  return { data, loading, error, chartsConfig };
};
