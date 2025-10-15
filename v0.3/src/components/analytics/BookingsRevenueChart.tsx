'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

export const BookingsRevenueChart = ({ data }: { data: any[] }) => (
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" />
    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
  </BarChart>
);
