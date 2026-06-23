'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ViolationChartsProps {
  dowData: any[];
  tierData: any[];
}

const TIER_COLORS: { [key: string]: string } = {
  'Critical': '#ef4444',
  'High': '#f97316',
  'Medium': '#eab308',
  'Low': '#22c55e'
};

const DAY_NAMES = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Custom label for horizontal bars showing count and percentage
const renderBarLabel = (props: any) => {
  const { x, y, width, height, value, totalZones } = props;
  const percent = ((value / totalZones) * 100).toFixed(1);
  
  return (
    <text
      x={x + width + 10}
      y={y + height / 2}
      fill="#374151"
      textAnchor="start"
      dominantBaseline="middle"
      className="font-semibold text-sm"
    >
      {`${value.toLocaleString()} zones (${percent}%)`}
    </text>
  );
};

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = ((data.value / data.totalZones) * 100).toFixed(2);
    
    return (
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
        <p className="font-bold text-gray-900" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Zones:</span> {data.value.toLocaleString()}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Percentage:</span> {percent}%
        </p>
      </div>
    );
  }
  return null;
};

export default function ViolationCharts({ dowData, tierData }: ViolationChartsProps) {
  const dowChartData = dowData.map((item: any) => ({
    day: DAY_NAMES[item.day_of_week] || `Day ${item.day_of_week}`,
    violations: item.total_violations
  }));

  // Calculate total zones for percentage calculation
  const totalZones = tierData.reduce((sum, item) => sum + item.zone_count, 0);

  // Sort tierData in reverse order for horizontal bar chart (Critical at top, Low at bottom)
  const tierChartData = [...tierData]
    .sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return order[b.priority_tier as keyof typeof order] - order[a.priority_tier as keyof typeof order];
    })
    .map((item: any) => ({
      name: item.priority_tier,
      value: item.zone_count,
      color: TIER_COLORS[item.priority_tier] || '#64748b',
      totalZones: totalZones
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📅</span>
            <span>Violations by Day of Week</span>
          </CardTitle>
          <CardDescription>Weekly violation distribution patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dowChartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <defs>
                <linearGradient id="colorDow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Violations', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => [value.toLocaleString(), 'Violations']}
              />
              <Bar 
                dataKey="violations" 
                fill="url(#colorDow)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span>
            <span>Priority Tier Distribution</span>
          </CardTitle>
          <CardDescription>Zone classification by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={tierChartData} 
              layout="vertical"
              margin={{ top: 20, right: 120, left: 80, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                label={{ value: 'Number of Zones', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                tick={{ fontSize: 13, fontWeight: 500 }}
                width={70}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[0, 8, 8, 0]}
                label={(props) => renderBarLabel({ ...props, totalZones })}
              >
                {tierChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}