
import { NextResponse } from 'next/server';
import { Customer } from '@/lib/types';

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const companies = ['Tech Corp', 'Global Enterprises', 'Innovation Inc', 'Future Solutions', 'Prime Industries'];

export const customers: Customer[] = Array.from({ length: 500 }, (_, i) => ({
  id: `cust-${i + 1}`,
  name: Math.random() > 0.3
    ? `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
    : companies[Math.floor(Math.random() * companies.length)],
  email: `customer${i + 1}@example.com`,
  phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  type: Math.random() > 0.3 ? 'individual' : 'corporate',
  status: Math.random() > 0.1 ? 'active' : 'inactive',
  totalBookings: Math.floor(Math.random() * 10) + 1,
  totalValue: Math.floor(Math.random() * 20000) + 1000,
  lifetime: Math.floor(Math.random() * 730) + 30,
  lastContact: new Date(Date.now() - Math.random() * 86400000 * 90),
  sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 10) < 7 ? 0 : Math.floor(Math.random() * 2) + 1] as any,
  tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
    ['VIP', 'Frequent', 'Corporate', 'Referral', 'At-Risk', 'High-Value'][Math.floor(Math.random() * 6)]
  ),
  createdAt: new Date(Date.now() - Math.random() * 86400000 * 730)
}));


export async function GET() {
  // In a real application, you'd fetch this data from a database.
  return NextResponse.json(customers);
}
