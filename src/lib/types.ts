import type { LucideIcon } from 'lucide-react';

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
}

export interface Call {
  id: string;
  customer: {
    name: string;
    avatar: string;
  };
  agent?: {
    name: string;
    avatar: string;
  };
  duration: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  outcome: string;
  timestamp: string;
  type: 'inbound' | 'outbound' | 'missed';
  status?: 'active' | 'completed' | 'on-hold';
}

export interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  event: string;
  date: string;
  guests: number;
  value: number;
  payment: 'paid' | 'pending' | 'failed';
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Alert {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
}

export interface Customer {
  id: string;
  name: string;
  type: 'vip' | 'regular' | 'new';
  email: string;
  phone: string;
  bookings: number;
  totalValue: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'active' | 'churned';
  registeredDate: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  source: string;
  eventType: string;
  score: number;
  expectedValue: number;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

export interface Event {
  id: string;
  name: string;
  type: 'wedding' | 'corporate' | 'party';
  venue: string;
  date: string;
  customer: string;
  capacity: number;
  revenue: number;
  status: 'planned' | 'completed' | 'cancelled';
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  isAI: boolean;
  status: 'online' | 'busy' | 'offline';
  fcr: number; // First Call Resolution
  csat: number; // Customer Satisfaction
  callsToday: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  sent: number;
  read: number;
  ctr: number; // Click-Through Rate
}

export interface EventTheme {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  bookings: number;
  revenue: number;
  popularity: 'high' | 'medium' | 'low';
}

export interface SystemHealthMetric {
  id: string;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface RecentAudit {
  id: string;
  area: string;
  result: 'passed' | 'failed';
  timestamp: string;
}
