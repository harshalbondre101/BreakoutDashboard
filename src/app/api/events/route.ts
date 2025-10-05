
import { NextResponse } from 'next/server';
import { Event } from '@/lib/types';

const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Conference', 'Product Launch', 'Gala Dinner'];
const venues = ['Grand Ballroom', 'Riverside Garden', 'Metropolitan Hall', 'Skyline Terrace', 'Harbor View Center'];
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];


export const events: Event[] = Array.from({ length: 100 }, (_, i) => ({
  id: `event-${i + 1}`,
  name: `${eventTypes[Math.floor(Math.random() * eventTypes.length)]} ${i + 1}`,
  type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
  venue: venues[Math.floor(Math.random() * venues.length)],
  date: new Date(Date.now() + Math.random() * 86400000 * 180 - Math.random() * 86400000 * 90),
  status: ['planned', 'confirmed', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 5)] as any,
  capacity: Math.floor(Math.random() * 300) + 50,
  booked: Math.floor(Math.random() * 250) + 20,
  revenue: Math.floor(Math.random() * 50000) + 5000,
  customerId: `cust-${Math.floor(Math.random() * 500) + 1}`,
  customerName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}));

export async function GET() {
  return NextResponse.json(events);
}
