'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const LeadFunnelChart = ({ data }: { data: any[] }) => (
    <BarChart layout="vertical" data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="stage" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
);
