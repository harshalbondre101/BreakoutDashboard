'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

const chartsConfig = [
  { id: 'calls-trend', title: 'Calls Trend (Last 7 Days)', chartType: 'line', endpoint: '/api/dashboard/calls-trend' },
  { id: 'bookings-revenue', title: 'Bookings & Revenue Trend', chartType: 'bar-line', endpoint: '/api/dashboard/bookings-trend' },
  { id: 'lead-funnel', title: 'Lead Conversion Funnel', chartType: 'funnel', endpoint: '/api/dashboard/lead-funnel' },
  { id: 'lead-sources', title: 'Lead Source Effectiveness', chartType: 'pie', endpoint: '/api/dashboard/lead-sources' },
  { id: 'customer-growth', title: 'Customer Growth Over Time', chartType: 'area', endpoint: '/api/dashboard/customer-growth' },
  { id: 'customer-segments', title: 'Customer Segments by Location', chartType: 'horizontal-bar', endpoint: '/api/dashboard/customer-segments' },
  { id: 'revenue-summary', title: 'Revenue vs Refunds', chartType: 'dual-bar', endpoint: '/api/dashboard/revenue-summary' },
  { id: 'payments-status', title: 'Payments Status Breakdown', chartType: 'donut', endpoint: '/api/dashboard/payments-status' },
  { id: 'call-sentiment', title: 'Call Sentiment Distribution', chartType: 'call-sentiment', endpoint: '/api/dashboard/sentiment-summary' },
];

export const useAnalyticsData = () => {
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const fetchData = async (id: string, endpoint: string) => {
      setLoading(prev => ({ ...prev, [id]: true }));
      setError(prev => ({ ...prev, [id]: null }));
      try {
        // Mocking API calls for now
        // Replace with actual fetch calls
        // const response = await fetch(`${API_BASE_URL}${endpoint}`);
        // if (!response.ok) throw new Error('Failed to fetch');
        // const result = await response.json();
        // setData(prev => ({ ...prev, [id]: result }));

        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        let mockData: any[] = [];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        switch (id) {
            case 'calls-trend':
                mockData = last7Days.map(date => ({ date, total_calls: Math.floor(Math.random() * 50) + 100 }));
                break;
            case 'bookings-revenue':
                mockData = last7Days.map(date => ({ date, bookings: Math.floor(Math.random() * 10) + 5, revenue: (Math.random() * 500) + 1000 }));
                break;
            case 'lead-funnel':
                mockData = [ { stage: 'Leads', count: 1200 }, { stage: 'Qualified', count: 650 }, { stage: 'Booked', count: 320 } ];
                break;
            case 'lead-sources':
                mockData = [ { name: 'Organic Search', value: 400 }, { name: 'Paid Ads', value: 300 }, { name: 'Referral', value: 200 }, { name: 'Social Media', value: 250 } ];
                break;
            case 'customer-growth':
                mockData = last7Days.map((date, i) => ({ date, total_customers: 1000 + (i * (Math.floor(Math.random() * 20) + 10)) }));
                break;
            case 'customer-segments':
                mockData = [ { region: 'North America', count: 45 }, { region: 'Europe', count: 30 }, { region: 'Asia', count: 20 }, { region: 'South America', count: 15 } ];
                break;
            case 'revenue-summary':
                mockData = last7Days.map(date => ({ date, revenue: (Math.random() * 1000) + 1500, refunds: (Math.random() * 100) + 50 }));
                break;
            case 'payments-status':
                mockData = [ { name: 'Paid', value: 12500 }, { name: 'Pending', value: 2500 } ];
                break;
            case 'call-sentiment':
                mockData = [ { name: 'Positive', value: 68 }, { name: 'Neutral', value: 22 }, { name: 'Negative', value: 10 } ];
                break;
        }
        setData(prev => ({ ...prev, [id]: mockData }));

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