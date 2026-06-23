'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import ViolationCharts from '@/components/ViolationCharts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';

const PriorityZoneMap = dynamic(() => import('@/components/PriorityZoneMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500">Loading map...</p>
  </div>
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Stats {
  total_violations: number;
  critical_zones: number;
  high_priority_zones: number; // This is Critical+High!
  total_zones: number;
  avg_daily: number;
}

interface Zone {
  grid_id: string;
  grid_lat: number;
  grid_lon: number;
  violation_count: number;
  priority_score: number;
  priority_tier: string;
  police_station?: string;
  unique_vehicles?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [allZones, setAllZones] = useState<Zone[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [dowData, setDowData] = useState<any[]>([]);
  const [tierData, setTierData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Stratified zone display for map (Critical, High, Medium, Low)
  const getStratifiedZones = useCallback(() => {
    const critical = allZones.filter(z => z.priority_tier === 'Critical').slice(0, 20);
    const high = allZones.filter(z => z.priority_tier === 'High').slice(0, 15);
    const medium = allZones.filter(z => z.priority_tier === 'Medium').slice(0, 10);
    const low = allZones.filter(z => z.priority_tier === 'Low').slice(0, 5);
    return [...critical, ...high, ...medium, ...low];
  }, [allZones]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const responses = await Promise.all([
        fetch(`${API_URL}/api/stats`),
        fetch(`${API_URL}/api/priority-zones?limit=20`),
        fetch(`${API_URL}/api/priority-zones?limit=1500`),
        fetch(`${API_URL}/api/hotspots?limit=10`),
        fetch(`${API_URL}/api/temporal/daily`),
        fetch(`${API_URL}/api/tier-distribution`)
      ]);

      const failedEndpoints = responses.filter(res => !res.ok);
      if (failedEndpoints.length > 0) {
        throw new Error(`${failedEndpoints.length} API endpoint(s) failed`);
      }

      const [statsData, zonesData, allZonesData, hotspotsData, dowDataRes, tierDataRes] = 
        await Promise.all(responses.map(res => res.json()));

      setStats(statsData);
      setZones(zonesData);
      setAllZones(allZonesData);
      setHotspots(hotspotsData);
      setDowData(dowDataRes);
      setTierData(tierDataRes);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Unable to connect to backend API at ${API_URL}. Please ensure the FastAPI server is running.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = String(row[header] ?? '');
            return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please try again.');
    }
  }, []);

  // Filter logic for priority tier and search
  const filteredZones = allZones.filter(zone => {
    const tierMatch = tierFilter === 'all' || zone.priority_tier === tierFilter;
    const searchMatch = searchTerm === '' ||
      zone.grid_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zone.police_station && zone.police_station.toLowerCase().includes(searchTerm.toLowerCase()));
    return tierMatch && searchMatch;
  });

  const getPriorityColor = (tier: string) => {
    switch (tier) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  if (loading && !stats) return <LoadingSpinner message="Loading parking intelligence data..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚦 Parking Intelligence Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Bangalore Traffic Police • Last Updated: {lastUpdated}
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center space-x-2 shadow-md"
              aria-label="Refresh dashboard data"
            >
              <span className={loading ? 'animate-spin' : ''}>🔄</span>
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.total_violations?.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Jan - May 2024</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Critical Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats?.critical_zones}</div>
              <p className="text-xs text-gray-500 mt-1">Immediate action required</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority Zones (Critical + High)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats?.high_priority_zones}</div>
              <p className="text-xs text-gray-500 mt-1">Immediate & 48h deployment zones</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Daily Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.avg_daily?.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">Violations per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="relative z-10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📍 Priority Zone Map</span>
              <span className="text-sm font-normal text-gray-500">
                ({getStratifiedZones().length} zones)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PriorityZoneMap zones={getStratifiedZones()} />
          </CardContent>
        </Card>

        <ViolationCharts dowData={dowData} tierData={tierData} />

        {/* Filter Controls */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>🔍 Filter Priority Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Grid ID or Police Station
                </label>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tier-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Priority Tier
                </label>
                <select
                  id="tier-filter"
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tiers ({allZones.length})</option>
                  <option value="Critical">🔴 Critical ({allZones.filter(z => z.priority_tier === 'Critical').length})</option>
                  <option value="High">🟠 High ({allZones.filter(z => z.priority_tier === 'High').length})</option>
                  <option value="Medium">🟡 Medium ({allZones.filter(z => z.priority_tier === 'Medium').length})</option>
                  <option value="Low">🟢 Low ({allZones.filter(z => z.priority_tier === 'Low').length})</option>
                </select>
              </div>
            </div>

            {(tierFilter !== 'all' || searchTerm !== '') && (
              <div className="mt-4 flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {tierFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                    Tier: {tierFilter}
                    <button onClick={() => setTierFilter('all')} className="ml-2 font-bold">×</button>
                  </span>
                )}
                {searchTerm !== '' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-2 font-bold">×</button>
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-3">
              Showing <strong>{filteredZones.length}</strong> of {allZones.length} zones
            </p>
          </CardContent>
        </Card>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle>🎯 Top 20 Priority Zones</CardTitle>
                <button
                  onClick={() => exportToCSV(filteredZones, 'priority_zones')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
                >
                  <span>📥 Export CSV</span>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 bg-gray-50">
                      <th className="text-left p-3">Zone</th>
                      <th className="text-left p-3">Violations</th>
                      <th className="text-left p-3">Score</th>
                      <th className="text-left p-3">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZones.slice(0, 20).map((zone) => (
                      <tr key={zone.grid_id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{zone.grid_id}</span>
                        </td>
                        <td className="p-3 font-medium">{zone.violation_count.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="font-bold text-blue-600">{zone.priority_score}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(zone.priority_tier)}`}>{zone.priority_tier}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle>🔥 Top 10 Hotspots</CardTitle>
                <button
                  onClick={() => exportToCSV(hotspots, 'hotspots')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
                >
                  <span>📥 Export CSV</span>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 bg-gray-50">
                      <th className="text-left p-3">Grid</th>
                      <th className="text-left p-3">Total</th>
                      <th className="text-left p-3">Daily Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((spot, idx) => (
                      <tr key={spot.grid_id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 font-bold">#{idx + 1}</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{spot.grid_id}</span>
                          </div>
                        </td>
                        <td className="p-3 font-bold">{spot.violation_count.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{spot.daily_avg}/day</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 py-6">
          <p>🚦 Bangalore Traffic Police • Gridlock Hackathon 2.0 • AI-Driven Parking Intelligence</p>
        </div>
      </div>
    </div>
  );
}