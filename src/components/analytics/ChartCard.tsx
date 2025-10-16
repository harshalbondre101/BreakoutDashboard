
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

const renderFunnel = (data: any[]) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="w-full flex flex-col items-center gap-1">
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.count / data[0].count) * 100 : 0;
        return (
          <div key={item.stage} className="flex flex-col items-center">
            <div
              className="bg-blue-500 text-white text-center py-2 transition-all duration-300"
              style={{
                width: `${Math.max(percentage, 10)}%`,
                clipPath: index === data.length - 1 
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' 
                  : 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
              }}
            >
              <div className="text-sm font-semibold">{item.stage}</div>
              <div className="text-xs">{item.count}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
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
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#FF8042" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FF8042" />
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
              nameKey="name"
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
            <Legend />
          </PieChart>
        )}

        {/* Horizontal Bar */}
        {chartType === 'horizontal-bar' && (
          <BarChart layout="vertical" width={320} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
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

        {/* Funnel */}
        {chartType === 'funnel' && renderFunnel(data)}
      </div>
    </div>
  );
};
