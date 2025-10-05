
export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  target: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  sparklineData: number[];
}

export interface ActiveCall {
  id: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topic: string;
  status: 'active' | 'on-hold' | 'transferring';
  startTime: Date;
}

export interface Booking {
  Booking_ID: number;
  Booking_date: string;
  Slot_ID: number;
  Customer_ID: number;
  Booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  Payment_ID: number;
  conv_id: string;
  guest_count: number;
  // Fields that are not in the new API but were in the old mock data.
  // We can keep them optional or remove them if they are not needed.
  customerName?: string;
  eventType?: string;
  value?: number;
  paymentMethod?: 'credit' | 'debit' | 'wallet' | 'bank';
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
}


export interface Customer {
  Customer_ID: number;
  Name: string;
  Email: string;
  Phone_number: string;
  Registered_date: string;
}

export interface CustomerListItem {
  customer_id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: String;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score: number;
  eventType: string;
  expectedValue: number;
  followUpDate?: Date;
  assignedAgent?: string;
  notes: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  date: Date;
  status: 'planned' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  capacity: number;
  booked: number;
  revenue: number;
  customerId: string;
  customerName: string;
}

export interface Call {
  id: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  agentType: 'ai' | 'human';
  direction: 'inbound' | 'outbound';
  duration: number;
  outcome: 'resolved' | 'transferred' | 'callback' | 'abandoned';
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentJourney: number[];
  topics: string[];
  intentRecognized: boolean;
  intentAccuracy: number;
  transcript: string;
  recordingUrl?: string;
  startTime: Date;
  endTime: Date;
  cost: number;
  qualityScore: number;
}

export interface Agent {
  id: string;
  name: string;
  type: 'ai' | 'human';
  status: 'available' | 'busy' | 'away' | 'offline';
  skills: string[];
  performanceMetrics: {
    fcr: number;
    acd: number;
    csat: number;
    qualityScore: number;
    utilization: number;
    callsToday: number;
  };
  currentCall?: string;
  avatar?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  status: 'active' | 'pending' | 'rejected';
  language: string;
  metrics: {
    sent: number;
    delivered: number;
    read: number;
    clicked: number;
    converted: number;
  };
  createdAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  features: string[];
  status: 'active' | 'inactive';
  popularity: number;
  bookings: number;
  revenue: number;
  seasonalMultiplier?: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
