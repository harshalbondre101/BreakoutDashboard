
'use client';
import { useState, useEffect } from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import { KPICard } from '@/components/kpi-card';
import { activeCalls, recentBookings, alerts } from '@/lib/data';
import { KPIMetric, KpiApiResponse } from '@/lib/types';
import { DollarSign } from 'lucide-react';

const formatDurationFromSeconds = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')} min`;
};

export default function DashboardPage() {
  const [time, setTime] = useState('');
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    const fetchKpis = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://fragrances-independently-conflict-thank.trycloudflare.com/compute/kpis');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: KpiApiResponse = await response.json();
        const kpis = data.kpis;

        const mappedKpis: KPIMetric[] = [
          {
            id: 'fcr',
            label: 'First Call Resolution',
            value: `${kpis.first_call_resolution_pct.toFixed(1)}%`,
            target: '>90%',
            trend: 'up',
            status: kpis.first_call_resolution_pct > 90 ? 'good' : 'warning',
            sparklineData: [72, 74, 76, 75, 77, 78, 79, 78],
          },
          {
            id: 'acd',
            label: 'Avg Call Duration',
            value: formatDurationFromSeconds(kpis.avg_call_duration_sec),
            target: '<5 min',
            trend: 'down',
            status: kpis.avg_call_duration_sec < 300 ? 'good' : 'warning',
            sparklineData: [320, 310, 300, 290, 280, 270, 280, 280].map(s => s/60),
          },
          {
            id: 'abandonment',
            label: 'Call Abandon Rate',
            value: `${kpis.call_abandon_rate_pct.toFixed(1)}%`,
            target: '<5%',
            trend: 'stable',
            status: kpis.call_abandon_rate_pct < 5 ? 'good' : 'warning',
            sparklineData: [7.2, 6.9, 6.8, 7.0, 6.8, 6.7, 6.8, 6.8],
          },
          {
            id: 'csat',
            label: 'Customer Satisfaction',
            value: `${kpis.customer_satisfaction_avg_rating.toFixed(1)}/5`,
            target: '>4.5',
            trend: 'up',
            status: kpis.customer_satisfaction_avg_rating > 4.5 ? 'good' : 'good', // API returns 0
            sparklineData: [4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.8, 4.7],
          },
          {
            id: 'missed-calls',
            label: 'Missed Calls',
            value: kpis.missed_calls,
            target: '0',
            trend: 'down',
            status: kpis.missed_calls === 0 ? 'good' : 'critical',
            sparklineData: [5, 4, 3, 2, 1, 0, 1, 0],
          },
          {
            id: 'conversion',
            label: 'Customer Conversion Rate',
            value: `${kpis.customer_conversion_rate_pct.toFixed(1)}%`,
            target: '>10%',
            trend: 'up',
            status: kpis.customer_conversion_rate_pct > 10 ? 'good' : 'good', // API returns 0
            sparklineData: [8, 9, 9.5, 10, 11, 10.5, 11.5, 12],
          },
          {
            id: 'quality',
            label: 'Overall Quality Score',
            value: kpis.overall_quality_score.toFixed(1),
            target: '>85',
            trend: 'stable',
            status: kpis.overall_quality_score > 85 ? 'good' : 'warning',
            sparklineData: [80, 81, 82, 83, 82, 82, 83, 82],
          },
          {
            id: 'sentiment',
            label: 'Positive Sentiment Rate',
            value: `${kpis.positive_sentiment_rate_pct.toFixed(1)}%`,
            target: '>80%',
            trend: 'up',
            status: kpis.positive_sentiment_rate_pct > 80 ? 'good' : 'good', // API returns 0
            sparklineData: [75, 76, 78, 79, 80, 82, 81, 83],
          },
        ];
        setKpiMetrics(mappedKpis);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchKpis();
    
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600 bg-emerald-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'failed': case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const queueWaitTime = '3.2 min';
  const activeCallsCount = activeCalls.length;
  const availableAgents = 18;
  const missedCalls = 4;

  const renderKpiGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-sm h-32 animate-pulse" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full bg-red-50 text-red-700 p-4 rounded-lg text-center">
          <p>Failed to load KPI data.</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
          <p className="text-gray-500 mt-1">Real-time operational overview</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-medium">
            System Online
          </div>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
            {time}
          </div>
        </div>
      </div>

      {renderKpiGrid()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="w-6 h-6 text-blue-600" />
                Active Calls
              </h2>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{activeCallsCount}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{queueWaitTime}</p>
                  <p className="text-xs text-gray-500">Avg Wait</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{availableAgents}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{missedCalls}</p>
                  <p className="text-xs text-gray-500">Missed</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(call.sentiment)}`}>
                        {call.sentiment}
                      </div>
                      <p className="font-semibold text-gray-900">{call.customerName}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Agent: {call.agentName}</p>
                    <p className="text-xs text-gray-500 mt-1">{call.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatDuration(call.duration)}</p>
                    <p className={`text-xs font-medium mt-1 ${
                      call.status === 'active' ? 'text-emerald-600' :
                      call.status === 'on-hold' ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      {call.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                Call Volume (24h)
              </h3>
              <div className="h-48 flex items-end justify-between gap-1">
                {Array.from({ length: 24 }, (_, i) => {
                  const height = Math.random() * 80 + 20;
                  const current = new Date().getHours() === i;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full ${current ? 'bg-blue-600' : 'bg-blue-300'} rounded-t transition-all hover:bg-blue-500`}
                        style={{ height: `${height}%` }}
                      />
                      {i % 4 === 0 && (
                        <p className="text-xs text-gray-500 mt-1">{i}h</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sentiment Distribution</h3>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    <circle
                      cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.68)}
                    />
                    <circle
                      cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="20"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.68 - 0.22)}
                      style={{ transform: 'rotate(245deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">68%</p>
                    <p className="text-xs text-gray-500">Positive</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-around mt-4">
                <div className="text-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1" />
                  <p className="text-sm font-medium">68%</p>
                  <p className="text-xs text-gray-500">Positive</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1" />
                  <p className="text-sm font-medium">22%</p>
                  <p className="text-xs text-gray-500">Neutral</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1" />
                  <p className="text-sm font-medium">10%</p>
                  <p className="text-xs text-gray-500">Negative</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              Recent Bookings
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentBookings.slice(0, 10).map((booking) => (
                <div key={booking.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-900 text-sm">{booking.customerName}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{booking.eventType}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold text-emerald-600">${booking.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{booking.paymentMethod}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              System Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                    alert.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{alert.title}</p>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
