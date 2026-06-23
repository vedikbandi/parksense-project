'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, Download, RefreshCw, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface GrowthMetrics {
  week_violations: number;
  prev_week: number;
  wow_growth_pct: number;
}

interface DailyData {
  date: string;
  total_violations: number;
  unique_vehicles: number;
}

interface HourlyData {
  hour: number;
  total_violations: number;
  unique_vehicles: number;
}

interface StationData {
  police_station: string;
  total_violations: number;
}

export default function AnalyticsPage() {
  const [dailyTrend, setDailyTrend] = useState<DailyData[]>([]);
  const [hourlyPattern, setHourlyPattern] = useState<HourlyData[]>([]);
  const [stationPerformance, setStationPerformance] = useState<StationData[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoints = [
        fetch(`${API_URL}/api/analytics/daily-trend`),
        fetch(`${API_URL}/api/analytics/hourly-pattern`),
        fetch(`${API_URL}/api/analytics/station-performance`),
        fetch(`${API_URL}/api/analytics/growth-metrics`)
      ];

      const responses = await Promise.all(endpoints);

      const failedEndpoints = responses
        .map((res, idx) => ({ res, idx }))
        .filter(({ res }) => !res.ok);

      if (failedEndpoints.length > 0) {
        throw new Error(`${failedEndpoints.length} analytics endpoint(s) failed`);
      }

      const [daily, hourly, station, growth] = await Promise.all(
        responses.map(res => res.json())
      );

      setDailyTrend(daily.data || []);
      setHourlyPattern(hourly.data || []);
      setStationPerformance(station.data || []);
      setGrowthMetrics(growth.data?.[0] || null);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching analytics:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Unable to load analytics data. ${errorMessage}. Please ensure the backend is running on ${API_URL}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalyticsData]);

  const exportData = useCallback(() => {
    if (!dailyTrend || dailyTrend.length === 0) {
      alert('No data available to export');
      return;
    }

    try {
      const csv = [
        ['Date', 'Total Violations', 'Unique Vehicles'],
        ...dailyTrend.map((d: DailyData) => [d.date, d.total_violations, d.unique_vehicles])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Failed to export data. Please try again.');
    }
  }, [dailyTrend]);

  if (loading && !growthMetrics) return <LoadingSpinner message="Loading analytics data..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchAnalyticsData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Deep insights and predictive trends • Last Updated: {lastUpdated}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={exportData} 
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-100"
                aria-label="Export data to CSV"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button 
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                aria-label="Refresh analytics data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8 space-y-8">
        {growthMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Week-over-Week Growth</CardTitle>
                {growthMetrics.wow_growth_pct > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${growthMetrics.wow_growth_pct > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthMetrics.wow_growth_pct > 0 ? '+' : ''}
                  {growthMetrics.wow_growth_pct?.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {growthMetrics.week_violations?.toLocaleString()} violations this week
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Current Week</CardTitle>
                <Calendar className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{growthMetrics.week_violations?.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">Total violations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Previous Week</CardTitle>
                <Activity className="w-5 h-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{growthMetrics.prev_week?.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">Baseline comparison</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📈</span>
              <span>Daily Violation Trends</span>
            </CardTitle>
            <CardDescription>Historical violation patterns and vehicle activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area 
                  type="monotone" 
                  dataKey="total_violations" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViolations)"
                  name="Total Violations"
                />
                <Area 
                  type="monotone" 
                  dataKey="unique_vehicles" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVehicles)"
                  name="Unique Vehicles"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⏰</span>
              <span>Hourly Violation Pattern</span>
            </CardTitle>
            <CardDescription>Peak hours and violation distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={hourlyPattern} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Total Violations', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: any) => [value.toLocaleString(), 'Violations']}
                  labelFormatter={(label) => `${label}:00 - ${(parseInt(label) + 1) % 24}:00`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="total_violations" 
                  fill="#8b5cf6" 
                  name="Total Violations"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚔</span>
              <span>Top Police Stations by Violations</span>
            </CardTitle>
            <CardDescription>Station-wise enforcement activity and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={stationPerformance} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Total Violations', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="police_station" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 11 }}
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
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="total_violations" 
                  fill="#f59e0b" 
                  name="Total Violations"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 py-6">
          <p>🚦 Bangalore Traffic Police • Gridlock Hackathon 2.0 • Advanced Analytics</p>
        </div>
      </div>
    </div>
  );
}