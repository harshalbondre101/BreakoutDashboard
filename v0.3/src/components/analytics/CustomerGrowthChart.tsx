'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const CustomerGrowthChart = ({ data }: { data: any[] }) => (
    <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="total_customers" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
);
