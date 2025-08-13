import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Activity,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  BarChart3,
  PieChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

// Mock data for KPIs
const kpiData = [
  {
    id: 1,
    title: "Total Revenue",
    value: "$2,847,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-500",
    target: "$3,000,000",
    progress: 94.9
  },
  {
    id: 2,
    title: "Active Users",
    value: "45,231",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500",
    target: "50,000",
    progress: 90.5
  },
  {
    id: 3,
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.5%",
    trend: "down",
    icon: Target,
    color: "bg-orange-500",
    target: "4.0%",
    progress: 81.0
  },
  {
    id: 4,
    title: "Customer Satisfaction",
    value: "4.8/5.0",
    change: "+0.3",
    trend: "up",
    icon: CheckCircle,
    color: "bg-purple-500",
    target: "4.5/5.0",
    progress: 96.0
  }
];

// Sample time series data
const revenueData = [
  { month: 'Jan', revenue: 2100000, target: 2200000, users: 35000 },
  { month: 'Feb', revenue: 2300000, target: 2400000, users: 38000 },
  { month: 'Mar', revenue: 2450000, target: 2500000, users: 41000 },
  { month: 'Apr', revenue: 2600000, target: 2600000, users: 43000 },
  { month: 'May', revenue: 2750000, target: 2700000, users: 45000 },
  { month: 'Jun', revenue: 2847500, target: 2800000, users: 45231 }
];

const performanceData = [
  { name: 'Sales', value: 85, color: '#10B981' },
  { name: 'Marketing', value: 72, color: '#3B82F6' },
  { name: 'Support', value: 91, color: '#8B5CF6' },
  { name: 'Product', value: 78, color: '#F59E0B' }
];

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

export default function KPIDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const periods = ['1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">KPI Dashboard</h1>
            <p className="text-gray-600">Track your key performance indicators and business metrics</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {/* Period Filter */}
            <div className="flex bg-white rounded-lg border shadow-sm">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${period === periods[0] ? 'rounded-l-lg' : ''} ${
                    period === periods[periods.length - 1] ? 'rounded-r-lg' : ''
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';
          
          return (
            <div 
              key={kpi.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedKPI(kpi)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.color} bg-opacity-10`}>
                  <Icon className={`${kpi.color.replace('bg-', 'text-')} w-6 h-6`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.change}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress to target</span>
                  <span>{kpi.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${kpi.color}`}
                    style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">Target: {kpi.target}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue vs Target</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value, name) => [`$${(value / 1000000).toFixed(2)}M`, name === 'revenue' ? 'Actual' : 'Target']}
              />
              <Area
                type="monotone"
                dataKey="target"
                stackId="1"
                stroke="#D1D5DB"
                fill="#F3F4F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View Details
            </button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`${(value / 1000).toFixed(1)}K`, 'Users']} />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
            </RechartsPieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {performanceData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-sm font-medium text-gray-700">Goals Achieved</span>
              </div>
              <span className="text-lg font-bold text-green-600">73%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-500" size={20} />
                <span className="text-sm font-medium text-gray-700">In Progress</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">18%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="text-sm font-medium text-gray-700">At Risk</span>
              </div>
              <span className="text-lg font-bold text-red-600">9%</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last updated</span>
              <span className="text-gray-900 font-medium">2 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Revenue target exceeded</p>
                <p className="text-xs text-gray-500">Q2 revenue reached 102% of target</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New user milestone</p>
                <p className="text-xs text-gray-500">Reached 45K active users</p>
                <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Conversion rate alert</p>
                <p className="text-xs text-gray-500">Rate dropped below 3.5%</p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Customer satisfaction</p>
                <p className="text-xs text-gray-500">Monthly NPS increased to 4.8</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 text-center text-blue-500 hover:text-blue-600 text-sm font-medium py-2">
            View All Activities
          </button>
        </div>
      </div>
    </div>
  );
}