
import { KPIMetric, ActiveCall, Booking, Customer, Lead, Event, Call, Agent, WhatsAppTemplate, Theme, Alert, CustomerListItem } from './types';

// This file is now primarily for type definitions and can be removed or repurposed
// if all data fetching is handled via APIs. For now, we'll keep the types.
// The actual data is now served from the /api routes.

// Example of empty arrays to prevent breaking imports if any remain.
export const kpiMetrics: KPIMetric[] = [];
export const activeCalls: ActiveCall[] = [];
export const recentBookings: Booking[] = [];
export const customers: Customer[] = [];
export const customerList: CustomerListItem[] = [];
export const leads: Lead[] = [];
export const events: Event[] = [];
export const calls: Call[] = [];
export const agents: Agent[] = [];
export const whatsappTemplates: WhatsAppTemplate[] = [];
export const themes: Theme[] = [];
export const alerts: Alert[] = [];
