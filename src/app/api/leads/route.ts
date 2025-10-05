
import { NextResponse } from 'next/server';
import { Lead } from '@/lib/types';

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Conference', 'Product Launch'];
const leadSources = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call'];


export const leads: Lead[] = Array.from({ length: 150 }, (_, i) => ({
  id: `lead-${i + 1}`,
  name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
  email: `lead${i + 1}@example.com`,
  phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  source: leadSources[Math.floor(Math.random() * leadSources.length)],
  status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'][Math.floor(Math.random() * 7)] as any,
  score: Math.floor(Math.random() * 100),
  eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
  expectedValue: Math.floor(Math.random() * 10000) + 500,
  followUpDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 86400000 * 30) : undefined,
  assignedAgent: Math.random() > 0.3 ? `agent-${Math.floor(Math.random() * 10) + 1}` : undefined,
  notes: 'Initial contact made. Interested in premium package.',
  createdAt: new Date(Date.now() - Math.random() * 86400000 * 60)
}));


export async function GET() {
  return NextResponse.json(leads);
}
