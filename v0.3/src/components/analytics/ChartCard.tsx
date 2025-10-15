'use client';
import React from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';

type ChartCardProps = {
  title: string;
  chartType:
    | 'line'
    | 'bar-line'
    | 'funnel'
    | 'pie'
    | 'area'
    | 'horizontal-bar'
    | 'dual-bar'
    | 'donut'
    | 'call-sentiment';
  data: any[];
  isLoading?: boolean;
  error?: string | null;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6F91'];

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  chartType,
  data,
  isLoading,
  error,
}) => {
  if (isLoading)
    return (
      <div className="animate-pulse p-6 bg-white rounded-xl shadow-md h-72 flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow-md h-72 flex items-center justify-center">
        {error}
      </div>
    );
  if (!data || data.length === 0)
    return (
      <div className="p-6 bg-gray-100 rounded-xl shadow-md h-72 flex items-center justify-center">
        No data
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="flex-1 flex items-center justify-center">
        {/* Line Chart */}
        {chartType === 'line' && (
          <LineChart width={320} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_calls" stroke="#8884d8" />
          </LineChart>
        )}

        {/* Bar + Line */}
        {chartType === 'bar-line' && (
          <BarChart width={320} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#8884d8" />
            <Line type="monotone" dataKey="revenue" stroke="#FF8042" />
          </BarChart>
        )}

        {/* Area Chart */}
        {chartType === 'area' && (
          <AreaChart width={320} height={250} data={data}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total_customers"
              stroke="#8884d8"
              fill="url(#colorArea)"
            />
          </AreaChart>
        )}

        {/* Pie / Donut / Sentiment */}
        {(chartType === 'pie' ||
          chartType === 'donut' ||
          chartType === 'call-sentiment') && (
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              dataKey="value"
              nameKey={data[0].name ? 'name' : 'stage'}
              cx="50%"
              cy="50%"
              innerRadius={chartType === 'donut' ? 50 : 0}
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}

        {/* Horizontal Bar */}
        {chartType === 'horizontal-bar' && (
          <BarChart layout="vertical" width={320} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="region" type="category" />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        )}

        {/* Dual Bar */}
        {chartType === 'dual-bar' && (
          <BarChart width={320} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
            <Bar dataKey="refunds" fill="#FF8042" />
          </BarChart>
        )}

        {/* Funnel placeholder */}
        {chartType === 'funnel' && (
          <div className="text-gray-500 text-center">
            Funnel chart requires a custom implementation
          </div>
        )}
      </div>
    </div>
  );
};



// 'use client';
// import { ResponsiveContainer } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import dynamic from 'next/dynamic';

// const CallsTrendChart = dynamic(() => import('./CallsTrendChart').then(mod => mod.CallsTrendChart), { ssr: false });
// const BookingsRevenueChart = dynamic(() => import('./BookingsRevenueChart').then(mod => mod.BookingsRevenueChart), { ssr: false });
// const LeadFunnelChart = dynamic(() => import('./LeadFunnelChart').then(mod => mod.LeadFunnelChart), { ssr: false });
// const LeadSourceChart = dynamic(() => import('./LeadSourceChart').then(mod => mod.LeadSourceChart), { ssr: false });
// const CustomerGrowthChart = dynamic(() => import('./CustomerGrowthChart').then(mod => mod.CustomerGrowthChart), { ssr: false });
// const CustomerSegmentsChart = dynamic(() => import('./CustomerSegmentsChart').then(mod => mod.CustomerSegmentsChart), { ssr: false });
// const RevenueRefundsChart = dynamic(() => import('./RevenueRefundsChart').then(mod => mod.RevenueRefundsChart), { ssr: false });
// const PaymentsStatusChart = dynamic(() => import('./PaymentsStatusChart').then(mod => mod.PaymentsStatusChart), { ssr: false });
// const CallSentimentChart = dynamic(() => import('./CallSentimentChart').then(mod => mod.CallSentimentChart), { ssr: false });

// const chartComponents = {
//   'line': CallsTrendChart,
//   'bar-line': BookingsRevenueChart,
//   'funnel': LeadFunnelChart,
//   'pie': LeadSourceChart,
//   'area': CustomerGrowthChart,
//   'horizontal-bar': CustomerSegmentsChart,
//   'dual-bar': RevenueRefundsChart,
//   'donut': PaymentsStatusChart,
//   'call-sentiment': CallSentimentChart,
// };

// export const ChartCard = ({ title, chartType, data, isLoading, error }: { title: string, chartType: keyof typeof chartComponents, data: any[], isLoading: boolean, error: string | null }) => {
//   const ChartComponent = chartComponents[chartType];

//   return (
//     <Card className="shadow-sm">
//       <CardHeader>
//         <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           {isLoading ? (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               Loading...
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center h-full text-red-500">
//               {error}
//             </div>
//           ) : !data || data.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               No Data Available
//             </div>
//           ) : (
//             <ChartComponent data={data} />
//           )}
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };
