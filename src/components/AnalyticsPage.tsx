import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');

  // Time-lapse data showing changes over time
  const timeLapseData = [
    { month: 'May', healthy: 245, atRisk: 45, critical: 10 },
    { month: 'Jun', healthy: 242, atRisk: 48, critical: 10 },
    { month: 'Jul', healthy: 238, atRisk: 52, critical: 10 },
    { month: 'Aug', healthy: 235, atRisk: 55, critical: 10 },
    { month: 'Sep', healthy: 230, atRisk: 58, critical: 12 },
    { month: 'Oct', healthy: 228, atRisk: 60, critical: 12 },
  ];

  // Current health status
  const healthStatusData = [
    { name: 'Healthy', value: 228, color: '#10b981' },
    { name: 'At Risk', value: 60, color: '#f59e0b' },
    { name: 'Critical', value: 12, color: '#ef4444' },
  ];

  // Species distribution
  const speciesData = [
    { species: 'D. Fir', count: 95 },
    { species: 'W. Cedar', count: 78 },
    { species: 'Spruce', count: 62 },
    { species: 'Hemlock', count: 45 },
    { species: 'N. Fir', count: 20 },
  ];

  // Inspection activity
  const inspectionData = [
    { week: 'W1', inspections: 45 },
    { week: 'W2', inspections: 52 },
    { week: 'W3', inspections: 48 },
    { week: 'W4', inspections: 61 },
  ];

  // Heatmap data for mobile
  const sectorHealthData = [
    { sector: 'A', health: 83, status: 'good', trees: 48 },
    { sector: 'B', health: 68, status: 'fair', trees: 52 },
    { sector: 'C', health: 92, status: 'excellent', trees: 55 },
    { sector: 'D', health: 48, status: 'poor', trees: 45 },
    { sector: 'E', health: 84, status: 'good', trees: 50 },
    { sector: 'F', health: 32, status: 'critical', trees: 50 },
  ];

  const totalTrees = healthStatusData.reduce((sum, item) => sum + item.value, 0);
  const healthyPercentage = ((healthStatusData[0].value / totalTrees) * 100).toFixed(1);
  const atRiskPercentage = ((healthStatusData[1].value / totalTrees) * 100).toFixed(1);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-600';
      case 'good': return 'bg-green-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getHealthTextColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-green-500';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white">Analytics</h1>
            <p className="text-green-100 text-sm">Forest health reports</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-green-600 bg-green-600 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
          </select>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Total Trees</p>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl">{totalTrees}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Healthy</p>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl">{healthStatusData[0].value}</p>
                <p className="text-xs text-green-600">{healthyPercentage}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">At Risk</p>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl">{healthStatusData[1].value}</p>
                <p className="text-xs text-yellow-600">{atRiskPercentage}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Critical</p>
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <p className="text-2xl">{healthStatusData[2].value}</p>
                <p className="text-xs text-red-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  +2
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sector Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Sector Health Overview</CardTitle>
            <p className="text-sm text-gray-600">Current week performance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sectorHealthData.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <span className="font-semibold">{sector.sector}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sector.trees} trees</p>
                        <p className={`text-xs capitalize ${getHealthTextColor(sector.status)}`}>
                          {sector.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getHealthTextColor(sector.status)}`}>
                        {sector.health}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getHealthColor(sector.status)}`}
                      style={{ width: `${sector.health}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm">
                <strong>Critical:</strong> Sector F at 32% health. Immediate action needed.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm">
                <strong>Warning:</strong> Sector D declining rapidly (65% → 48%).
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm">
                <strong>Success:</strong> Sector C maintains excellent 92% health.
              </p>
            </div>
          </div>
        </div>

        {/* Charts Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-12 rounded-none">
                <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
                <TabsTrigger value="distribution" className="text-xs">Health</TabsTrigger>
                <TabsTrigger value="species" className="text-xs">Species</TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="p-4 mt-0">
                <h3 className="mb-4">Health Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeLapseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="healthy" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="distribution" className="p-4 mt-0">
                <h3 className="mb-4">Current Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={healthStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {healthStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="species" className="p-4 mt-0">
                <h3 className="mb-4">Species Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={speciesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="species" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="activity" className="p-4 mt-0">
                <h3 className="mb-4">Inspection Activity</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={inspectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-4">
                  Inspection activity is 23% above target for October. Great work!
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
