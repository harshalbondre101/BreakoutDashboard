'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const RevenueRefundsChart = ({ data }: { data: any[] }) => (
    <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#82ca9d" />
        <Bar dataKey="refunds" fill="#ff7300" />
    </BarChart>
);
