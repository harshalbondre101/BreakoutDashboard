
'use client';
import { useState, useEffect } from 'react';
import { IndianRupee, Phone, Trophy, User } from 'lucide-react';
import { KPICard } from '@/components/kpi-card';
import { Booking, ApiCall as Call, KPIMetric } from '@/lib/types';
import { API_BASE_URL } from '@/lib/config';

// Mock data for employee-specific view
const employeeKpiData: KPIMetric[] = [
  { id: 'my_csat', label: 'My CSAT', value: '92%', target: '>90%', trend: 'up', status: 'good', sparklineData: [88, 89, 91, 90, 92, 92, 91, 92] },
  { id: 'my_fcr', label: 'My Resolution Rate', value: '85%', target: '>80%', trend: 'up', status: 'good', sparklineData: [80, 82, 81, 83, 84, 85, 85, 85] },
  { id: 'my_calls', label: 'My Calls Today', value: '24', target: '20-30', trend: 'stable', status: 'good', sparklineData: [18, 20, 22, 21, 23, 24, 24, 24] },
  { id: 'my_revenue', label: 'My Revenue', value: '₹1,52,000', target: '>₹1,20,000', trend: 'up', status: 'good', sparklineData: [110, 120, 135, 140, 145, 150, 155, 152].map(v => v * 1000) },
];

const myActiveCallsData: Call[] = [
    { Conv_ID: 'conv-e-1', Customer_ID: 201, Call_intent: 'New Booking Inquiry', Duration: 185, Date_time: new Date().toISOString(), Credits_consumed: 0.8, Transcript: '...' },
    { Conv_ID: 'conv-e-2', Customer_ID: 202, Call_intent: 'Follow-up', Duration: 320, Date_time: new Date().toISOString(), Credits_consumed: 1.2, Transcript: '...' },
];

const myRecentBookingsData: Booking[] = [
    { Booking_ID: 101, Customer_ID: 301, Slot_ID: 501, Payment_ID: 701, conv_id: 'conv-b-1', Booking_date: new Date(Date.now() - 3600000).toISOString(), guest_count: 50, Booking_status: 'confirmed' },
    { Booking_ID: 102, Customer_ID: 302, Slot_ID: 502, Payment_ID: 702, conv_id: 'conv-b-2', Booking_date: new Date(Date.now() - 86400000).toISOString(), guest_count: 120, Booking_status: 'confirmed' },
];

const leaderboardData = [
    { name: 'Your Rank', rank: 3, value: '₹1,52,000', isCurrentUser: true },
    { name: 'Sarah J.', rank: 1, value: '₹1,98,000' },
    { name: 'Michael B.', rank: 2, value: '₹1,75,000' },
    { name: 'Jessica D.', rank: 4, value: '₹1,45,000' },
];


export default function EmployeeDashboardPage() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, Alex!</h1>
                    <p className="text-gray-500 mt-1">Here's your performance snapshot for today.</p>
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                    {time}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {employeeKpiData.map((metric) => (
                    <KPICard key={metric.id} metric={metric} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <Phone className="w-6 h-6 text-blue-600" />
                            My Active Calls
                        </h2>
                        <div className="space-y-3">
                            {myActiveCallsData.map((call) => (
                                <div key={call.Conv_ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {call.Call_intent}
                                            </div>
                                            <p className="font-semibold text-gray-900">Conv: {call.Conv_ID}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Customer: {call.Customer_ID}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{formatDuration(call.Duration)}</p>
                                        <p className="text-xs font-medium mt-1 text-emerald-600">ACTIVE</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <IndianRupee className="w-6 h-6 text-emerald-600" />
                            My Recent Bookings
                        </h2>
                         <div className="space-y-3">
                            {myRecentBookingsData.map((booking) => (
                            <div key={booking.Booking_ID} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                <p className="font-semibold text-gray-900 text-sm">Booking #{booking.Booking_ID}</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.Booking_status)}`}>
                                    {booking.Booking_status}
                                </span>
                                </div>
                                <p className="text-xs text-gray-600">Customer ID: {booking.Customer_ID}</p>
                                <div className="flex justify-between items-center mt-2">
                                <p className="text-sm font-bold text-gray-800">Guests: {booking.guest_count}</p>
                                <p className="text-xs text-gray-500">{new Date(booking.Booking_date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        Team Leaderboard
                    </h2>
                    <div className="space-y-3">
                        {leaderboardData.map((item) => (
                            <div key={item.rank} className={`p-3 rounded-lg flex items-center justify-between ${item.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${item.rank <= 3 ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {item.rank}
                                    </span>
                                    <div>
                                        <p className={`font-semibold ${item.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>{item.name}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
