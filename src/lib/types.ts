



export interface ApiCall {
  Customer_ID: number;
  Transcript: string;
  Date_time: string;
  Duration: number;
  Call_intent: string;
  Credits_consumed: number;
  Conv_ID: string;
}


export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  sparklineData: number[];
}

export interface KpiApiResponse {
  status: string;
  kpis: {
    total_calls: number;
    analyzed_calls: number;
    first_call_resolution_pct: number;
    avg_call_duration_sec: number;
    positive_sentiment_rate_pct: number;
    call_abandon_rate_pct: number;
    missed_calls: number;
    customer_conversion_rate_pct: number;
    overall_quality_score: number;
    customer_satisfaction_avg_rating: number;
  };
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
}


export interface Customer {
  Name: string;
  Email: string;
  PhoneNumber: string;
  Original_Lead_ID: number;
  Customer_ID: number;
  CustomerSince: string;
}

export interface CustomerListItem {
  customer_id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: String;
}

export interface Lead {
  Name: string;
  Email: string;
  PhoneNumber: string;
  Status: string;
  LeadType: string;
  Priority: string;
  Source: string;
  Notes: string | null;
  LastNotified: string | null;
  Lead_ID: number;
  CreatedAt: string;
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
    Name: string;
    Description: string;
    Duration: number;
    Minimum_players: number;
    Trailers: string | null;
    Price_per_person: number;
    Theme_ID: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
