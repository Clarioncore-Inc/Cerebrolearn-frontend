import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, ShoppingCart, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueAnalyticsProps {
  userRole: 'admin' | 'creator';
}

export function RevenueAnalytics({ userRole }: RevenueAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const revenueData = [
    { month: 'Jan', revenue: 12400, transactions: 156 },
    { month: 'Feb', revenue: 15800, transactions: 189 },
    { month: 'Mar', revenue: 18900, transactions: 224 },
    { month: 'Apr', revenue: 16700, transactions: 198 },
    { month: 'May', revenue: 21300, transactions: 267 },
    { month: 'Jun', revenue: 24100, transactions: 302 }
  ];

  const categoryRevenue = [
    { name: 'Technology', value: 45000, color: '#395192' },
    { name: 'Business', value: 28000, color: '#10b981' },
    { name: 'Design', value: 18000, color: '#f59e0b' },
    { name: 'Marketing', value: 15000, color: '#8b5cf6' }
  ];

  const topCourses = [
    { title: 'Advanced React', revenue: 8450, sales: 169, avgPrice: 50 },
    { title: 'Leadership', revenue: 6780, sales: 226, avgPrice: 30 },
    { title: 'Data Analytics', revenue: 5920, sales: 148, avgPrice: 40 },
    { title: 'Product Management', revenue: 4650, sales: 155, avgPrice: 30 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Revenue Analytics</h1>
          <p className="text-gray-600">Track financial performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">$109,200</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#395192]" />
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">+8.3%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900">1,336</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">+5.2%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900">$81.74</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">+15.7%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Paying Customers</p>
          <p className="text-3xl font-bold text-gray-900">847</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#395192" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Top Revenue Generating Courses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">${course.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{course.sales}</td>
                  <td className="px-6 py-4 text-gray-600">${course.avgPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
