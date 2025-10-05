import type { KPIMetric, Call, Booking, Alert, Customer, Lead, Event, Agent, WhatsAppTemplate, EventTheme, SystemHealthMetric, RecentAudit } from './types';
import { DollarSign, Zap, Users, Activity, BarChart, Phone, CheckCircle, PieChart, TrendingUp, UserCheck, Clock, Shield, Star, Bot, User, MessageSquare, Palette, HeartHandshake, Settings } from 'lucide-react';

export const kpiMetrics: KPIMetric[] = [
  { id: 'rev', title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', changeType: 'increase', icon: DollarSign },
  { id: 'bookings', title: 'Bookings', value: '+2350', change: '+180.1%', changeType: 'increase', icon: Users },
  { id: 'calls', title: 'Active Calls', value: '573', change: '+19%', changeType: 'increase', icon: Phone },
  { id: 'csat', title: 'CSAT', value: '92.8%', change: '-1.2%', changeType: 'decrease', icon: Star },
];

export const activeCalls: Call[] = [
  { id: 'call1', customer: { name: 'Olivia Martin', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, duration: '3m 45s', sentiment: 'positive', topics: ['Booking', 'Pricing'], outcome: 'Resolved', timestamp: '', type: 'inbound', status: 'active' },
  { id: 'call2', customer: { name: 'Jackson Lee', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }, duration: '1m 12s', sentiment: 'neutral', topics: ['Inquiry'], outcome: 'Pending', timestamp: '', type: 'inbound', status: 'active' },
  { id: 'call3', customer: { name: 'Isabella Nguyen', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' }, duration: '5m 02s', sentiment: 'negative', topics: ['Complaint', 'Refund'], outcome: 'Escalated', timestamp: '', type: 'inbound', status: 'active' },
  { id: 'call4', customer: { name: 'William Kim', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' }, duration: '0m 30s', sentiment: 'positive', topics: ['Confirmation'], outcome: 'Resolved', timestamp: '', type: 'outbound', status: 'active' },
];

export const callVolumeData = [
  { name: '00:00', calls: 30 }, { name: '02:00', calls: 25 }, { name: '04:00', calls: 40 },
  { name: '06:00', calls: 50 }, { name: '08:00', calls: 80 }, { name: '10:00', calls: 120 },
  { name: '12:00', calls: 150 }, { name: '14:00', calls: 140 }, { name: '16:00', calls: 160 },
  { name: '18:00', calls: 130 }, { name: '20:00', calls: 90 }, { name: '22:00', calls: 60 },
];

export const sentimentDistributionData = [
  { name: 'Positive', value: 400, fill: 'var(--color-chart-2)' },
  { name: 'Neutral', value: 300, fill: 'var(--color-chart-4)' },
  { name: 'Negative', value: 150, fill: 'var(--color-chart-5)' },
];

export const recentBookings: Booking[] = [
  { id: 'bk1', customer: { name: 'Liam Johnson', email: 'liam@example.com' }, event: 'Wedding', date: '2024-08-15', guests: 150, value: 12500, payment: 'paid', status: 'confirmed' },
  { id: 'bk2', customer: { name: 'Sophia Brown', email: 'sophia@example.com' }, event: 'Corporate Gala', date: '2024-09-20', guests: 300, value: 25000, payment: 'pending', status: 'pending' },
  { id: 'bk3', customer: { name: 'Noah Williams', email: 'noah@example.com' }, event: 'Birthday Party', date: '2024-07-30', guests: 50, value: 3500, payment: 'paid', status: 'confirmed' },
  { id: 'bk4', customer: { name: 'Ava Jones', email: 'ava@example.com' }, event: 'Product Launch', date: '2024-10-01', guests: 200, value: 18000, payment: 'paid', status: 'confirmed' },
];

export const systemAlerts: Alert[] = [
  { id: 'al1', message: 'High call volume detected in the support queue.', severity: 'warning', timestamp: '2 minutes ago' },
  { id: 'al2', message: 'Payment gateway API is responding slowly.', severity: 'critical', timestamp: '5 minutes ago' },
  { id: 'al3', message: 'New AI model version deployed successfully.', severity: 'info', timestamp: '15 minutes ago' },
];

export const bookingMetrics: KPIMetric[] = [
  { id: 'total-bookings', title: 'Total Bookings', value: '1,254', change: '+12.5%', changeType: 'increase', icon: Users },
  { id: 'confirmed-bookings', title: 'Confirmed Bookings', value: '1,100', change: '+15.2%', changeType: 'increase', icon: CheckCircle },
  { id: 'total-revenue', title: 'Total Revenue', value: '$1.2M', change: '+22.1%', changeType: 'increase', icon: DollarSign },
  { id: 'avg-value', title: 'Avg. Booking Value', value: '$980', change: '+3.4%', changeType: 'increase', icon: PieChart },
];

export const keyBookingMetrics = {
    modificationRate: { title: 'Modification Rate', value: '5.2%' },
    cancellationRate: { title: 'Cancellation Rate', value: '2.1%' },
    noShowRate: { title: 'No-Show Rate', value: '0.8%' },
    rebookingRate: { title: 'Rebooking Rate', value: '15.7%' }
};

export const paymentAnalytics = {
    successRate: { title: 'Payment Success Rate', value: '98.5%' },
    avgProcessingTime: { title: 'Avg. Processing Time', value: '3.2s' },
};

export const callsPageMetrics: KPIMetric[] = [
    { id: 'total-calls', title: 'Total Calls', value: '25,832', change: '+8.2%', changeType: 'increase', icon: Phone },
    { id: 'avg-duration', title: 'Avg. Duration', value: '4m 32s', change: '-2.1%', changeType: 'decrease', icon: Clock },
    { id: 'ai-handled', title: 'AI Handled', value: '65%', change: '+5.0%', changeType: 'increase', icon: Bot },
    { id: 'positive-sentiment', title: 'Positive Sentiment', value: '78%', change: '+1.5%', changeType: 'increase', icon: Star },
];

export const callList: Call[] = [
    { id: 'cl1', customer: { name: 'Emily Clark', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' }, agent: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' }, duration: '6m 15s', sentiment: 'positive', topics: ['New Booking', 'Custom Package'], outcome: 'Resolved', timestamp: '2024-07-29T10:00:00Z', type: 'inbound' },
    { id: 'cl2', customer: { name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, agent: { name: 'AI Assistant', avatar: 'bot' }, duration: '2m 45s', sentiment: 'neutral', topics: ['Date Inquiry'], outcome: 'Transferred', timestamp: '2024-07-29T10:05:00Z', type: 'inbound' },
    { id: 'cl3', customer: { name: 'Sarah Davis', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }, agent: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' }, duration: '8m 30s', sentiment: 'negative', topics: ['Complaint', 'Service Quality'], outcome: 'Follow-up', timestamp: '2024-07-29T10:12:00Z', type: 'inbound' },
    { id: 'cl4', customer: { name: 'David Wilson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' }, duration: '1m 20s', sentiment: 'neutral', topics: ['Information'], outcome: 'Resolved', timestamp: '2024-07-29T10:15:00Z', type: 'missed' },
];

export const customerData: Customer[] = [
    { id: 'cust1', name: 'Innovate Inc.', type: 'vip', email: 'contact@innovate.com', phone: '123-456-7890', bookings: 12, totalValue: 150000, sentiment: 'positive', status: 'active', registeredDate: '2022-01-15' },
    { id: 'cust2', name: 'John & Jane Smith', type: 'regular', email: 'jj.smith@email.com', phone: '234-567-8901', bookings: 2, totalValue: 15000, sentiment: 'positive', status: 'active', registeredDate: '2023-05-20' },
    { id: 'cust3', 'name': 'Global Corp', 'type': 'new', 'email': 'hello@global.co', 'phone': '345-678-9012', 'bookings': 1, 'totalValue': 25000, 'sentiment': 'neutral', 'status': 'active', 'registeredDate': '2024-06-10' },
    { id: 'cust4', 'name': 'Peak Industries', 'type': 'regular', 'email': 'info@peak.io', 'phone': '456-789-0123', 'bookings': 5, 'totalValue': 65000, 'sentiment': 'negative', 'status': 'churned', 'registeredDate': '2022-11-30' },
];

export const leadData: Lead[] = [
    { id: 'lead1', name: 'Alice Wonderland', contact: 'alice@email.com', source: 'Website', eventType: 'Wedding', score: 85, expectedValue: 18000, status: 'qualified' },
    { id: 'lead2', name: 'Bob Builder', contact: 'bob@email.com', source: 'Referral', eventType: 'Corporate', score: 70, expectedValue: 30000, status: 'contacted' },
    { id: 'lead3', name: 'Charlie Chocolate', contact: 'charlie@email.com', source: 'Cold Call', eventType: 'Party', score: 40, expectedValue: 5000, status: 'new' },
    { id: 'lead4', name: 'Diana Prince', contact: 'diana@email.com', source: 'Website', eventType: 'Wedding', score: 95, expectedValue: 22000, status: 'qualified' },
];

export const eventData: Event[] = [
    { id: 'event1', name: 'Innovate & Global Wedding', type: 'wedding', venue: 'Grand Ballroom', date: '2024-12-15', customer: 'Innovate Inc.', capacity: 300, revenue: 50000, status: 'planned' },
    { id: 'event2', 'name': 'TechCorp Summit', 'type': 'corporate', 'venue': 'Conference Center', 'date': '2024-08-20', 'customer': 'Global Corp', 'capacity': 500, 'revenue': 75000, 'status': 'completed' },
    { id: 'event3', 'name': 'Summer Fest', 'type': 'party', 'venue': 'Outdoor Arena', 'date': '2024-07-04', 'customer': 'Community', 'capacity': 2000, 'revenue': 15000, 'status': 'completed' },
];


export const liveMonitoringCalls: Call[] = [
    { id: 'live1', status: 'active', duration: '02:30', customer: { name: 'Alice M.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, agent: { name: 'Dan', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }, sentiment: 'positive', topics: ['Booking'], outcome: 'Pending', timestamp: '', type: 'inbound' },
    { id: 'live2', status: 'active', duration: '05:12', customer: { name: 'Bob R.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' }, agent: { name: 'AI', avatar: 'bot' }, sentiment: 'neutral', topics: ['Info'], outcome: 'Pending', timestamp: '', type: 'inbound' },
    { id: 'live3', status: 'active', duration: '01:45', customer: { name: 'Charlie P.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' }, agent: { name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' }, sentiment: 'negative', topics: ['Complaint'], outcome: 'Pending', timestamp: '', type: 'inbound' },
];

export const agentStatus = {
    available: { count: 12, icon: UserCheck },
    busy: { count: 28, icon: Phone },
    away: { count: 5, icon: Clock },
};

export const queueStatus = {
    avgWaitTime: { title: "Avg Wait Time", value: "1m 15s" },
    callsInQueue: { title: "Calls in Queue", value: "8" },
    longestWait: { title: "Longest Wait", value: "3m 45s" },
};

export const analysisKpis: KPIMetric[] = [
    { id: 'kpi1', title: 'Intent Recognition Accuracy', value: '96.2%', change: '+0.5%', changeType: 'increase', icon: Bot },
    { id: 'kpi2', title: 'Conversation Completion Rate', value: '89.7%', change: '-1.2%', changeType: 'decrease', icon: CheckCircle },
    { id: 'kpi3', title: 'Overall Quality Score', value: '94.5%', change: '+2.1%', changeType: 'increase', icon: Star },
    { id: 'kpi4', title: 'First Call Resolution (AI)', value: '75.3%', change: '+3.8%', changeType: 'increase', icon: Zap },
];

export const agentData: Agent[] = [
  { id: 'agent1', name: 'Nexus Prime', avatar: 'bot', isAI: true, status: 'online', fcr: 85, csat: 95, callsToday: 512 },
  { id: 'agent2', name: 'Aura', avatar: 'bot', isAI: true, status: 'online', fcr: 82, csat: 93, callsToday: 489 },
  { id: 'agent3', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', isAI: false, status: 'busy', fcr: 92, csat: 98, callsToday: 45 },
  { id: 'agent4', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', isAI: false, status: 'offline', fcr: 90, csat: 97, callsToday: 38 },
];

export const whatsAppTemplates: WhatsAppTemplate[] = [
  { id: 'wa1', name: 'Booking Confirmation', category: 'Transactional', status: 'approved', sent: 1250, read: 1180, ctr: 15 },
  { id: 'wa2', name: 'Promotional Offer', category: 'Marketing', status: 'approved', sent: 5000, read: 3500, ctr: 8 },
  { id: 'wa3', name: 'New Year Greeting', category: 'Marketing', status: 'pending', sent: 0, read: 0, ctr: 0 },
];

export const eventThemes: EventTheme[] = [
  { id: 'theme1', name: 'Classic Elegance', description: 'Timeless decor for weddings.', basePrice: 5000, bookings: 45, revenue: 225000, popularity: 'high' },
  { id: 'theme2', name: 'Modern Corporate', description: 'Sleek and professional setup.', basePrice: 3500, bookings: 62, revenue: 217000, popularity: 'high' },
  { id: 'theme3', name: 'Rustic Charm', description: 'For cozy, intimate gatherings.', basePrice: 4200, bookings: 25, revenue: 105000, popularity: 'medium' },
  { id: 'theme4', name: 'Neon Nights', description: 'Vibrant and energetic party theme.', basePrice: 3000, bookings: 15, revenue: 45000, popularity: 'low' },
];

export const systemHealth: SystemHealthMetric[] = [
    { id: 'sh1', name: 'System Uptime', value: '99.98%', status: 'healthy' },
    { id: 'sh2', name: 'Compliance Score', value: '98%', status: 'healthy' },
    { id: 'sh3', name: 'Quality Score', value: '94%', status: 'warning' },
    { id: 'sh4', name: 'Violations', value: '3', status: 'critical' },
];

export const recentAudits: RecentAudit[] = [
    { id: 'ra1', area: 'Payment Gateway', result: 'passed', timestamp: '2024-07-28T14:00Z' },
    { id: 'ra2', area: 'Data Privacy', result: 'passed', timestamp: '2024-07-27T11:00Z' },
    { id: 'ra3', area: 'AI Call Routing', result: 'failed', timestamp: '2024-07-26T09:30Z' },
];
