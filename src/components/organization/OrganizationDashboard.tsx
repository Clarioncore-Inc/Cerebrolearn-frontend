import React, { useState } from 'react';
import { Users, BookOpen, TrendingUp, Award, UserPlus, Briefcase, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface OrganizationDashboardProps {
  organizationId: string;
}

export function OrganizationDashboard({ organizationId }: OrganizationDashboardProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock data - replace with API calls
  const orgStats = {
    totalMembers: 247,
    activeMembers: 189,
    totalTeams: 12,
    totalCourses: 48,
    completionRate: 76,
    licensesUsed: 247,
    licensesTotal: 300,
    avgProgress: 64
  };

  const teamPerformanceData = [
    { team: 'Engineering', members: 45, avgProgress: 78, completions: 34 },
    { team: 'Marketing', members: 28, avgProgress: 82, completions: 24 },
    { team: 'Sales', members: 52, avgProgress: 71, completions: 38 },
    { team: 'Design', members: 22, avgProgress: 85, completions: 19 },
    { team: 'Product', members: 31, avgProgress: 74, completions: 25 },
    { team: 'HR', members: 15, avgProgress: 88, completions: 14 }
  ];

  const activityData = [
    { date: 'Mon', enrollments: 12, completions: 8 },
    { date: 'Tue', enrollments: 18, completions: 14 },
    { date: 'Wed', enrollments: 15, completions: 11 },
    { date: 'Thu', enrollments: 22, completions: 17 },
    { date: 'Fri', enrollments: 19, completions: 15 },
    { date: 'Sat', enrollments: 8, completions: 6 },
    { date: 'Sun', enrollments: 5, completions: 4 }
  ];

  const recentActivities = [
    { type: 'completion', user: 'Sarah Chen', action: 'completed', item: 'Advanced React Patterns', team: 'Engineering', time: '5m ago' },
    { type: 'enrollment', user: 'Mike Johnson', action: 'enrolled in', item: 'Product Management 101', team: 'Product', time: '12m ago' },
    { type: 'badge', user: 'Emily Davis', action: 'earned badge', item: 'Fast Learner', team: 'Marketing', time: '1h ago' },
    { type: 'team', user: 'Admin', action: 'created team', item: 'Customer Success', team: 'Organization', time: '2h ago' },
    { type: 'completion', user: 'James Wilson', action: 'completed', item: 'Leadership Essentials', team: 'Sales', time: '3h ago' },
    { type: 'enrollment', user: 'Lisa Anderson', action: 'enrolled in', item: 'Data Analytics', team: 'Design', time: '4h ago' }
  ];

  const topPerformers = [
    { name: 'Sarah Chen', team: 'Engineering', coursesCompleted: 12, xp: 15400, avatar: 'SC' },
    { name: 'Emily Davis', team: 'Marketing', coursesCompleted: 11, xp: 14200, avatar: 'ED' },
    { name: 'Mike Johnson', team: 'Product', coursesCompleted: 10, xp: 13800, avatar: 'MJ' },
    { name: 'James Wilson', team: 'Sales', coursesCompleted: 9, xp: 12600, avatar: 'JW' },
    { name: 'Lisa Anderson', team: 'Design', coursesCompleted: 9, xp: 12200, avatar: 'LA' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Organization Dashboard</h1>
        <p className="text-gray-600">Overview of your organization's learning progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Members */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#395192]" />
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Members</p>
          <p className="text-2xl font-bold text-gray-900">{orgStats.totalMembers}</p>
          <p className="text-sm text-gray-500 mt-2">{orgStats.activeMembers} active this month</p>
        </div>

        {/* Teams */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Teams</p>
          <p className="text-2xl font-bold text-gray-900">{orgStats.totalTeams}</p>
          <p className="text-sm text-gray-500 mt-2">Across all departments</p>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Active Courses</p>
          <p className="text-2xl font-bold text-gray-900">{orgStats.totalCourses}</p>
          <p className="text-sm text-gray-500 mt-2">Available to teams</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-900">{orgStats.completionRate}%</p>
          <p className="text-sm text-gray-500 mt-2">Avg progress: {orgStats.avgProgress}%</p>
        </div>
      </div>

      {/* License Usage */}
      <div className="bg-gradient-to-br from-[#395192] to-[#4a63a8] p-6 rounded-lg mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">License Usage</h3>
            <p className="text-blue-100 text-sm">{orgStats.licensesUsed} of {orgStats.licensesTotal} licenses used</p>
          </div>
          <button className="bg-white text-[#395192] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Upgrade Plan
          </button>
        </div>
        <div className="w-full bg-blue-900/30 rounded-full h-3 mb-2">
          <div 
            className="bg-white rounded-full h-3 transition-all"
            style={{ width: `${(orgStats.licensesUsed / orgStats.licensesTotal) * 100}%` }}
          />
        </div>
        <p className="text-sm text-blue-100">{orgStats.licensesTotal - orgStats.licensesUsed} licenses remaining</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Team Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Team Performance</h3>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgProgress" fill="#395192" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#395192] text-white font-semibold">
                  {performer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{performer.name}</p>
                  <p className="text-sm text-gray-500">{performer.team}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#395192]">{performer.coursesCompleted}</p>
                  <p className="text-xs text-gray-500">courses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-900 mb-6">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="enrollments" stroke="#395192" strokeWidth={2} dot={{ fill: '#395192' }} />
            <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#395192] rounded-full" />
            <span className="text-sm text-gray-600">Enrollments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Completions</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-[#395192] text-sm hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'completion' ? 'bg-green-100' :
                activity.type === 'enrollment' ? 'bg-blue-100' :
                activity.type === 'badge' ? 'bg-yellow-100' :
                'bg-purple-100'
              }`}>
                {activity.type === 'completion' && <Award className="w-5 h-5 text-green-600" />}
                {activity.type === 'enrollment' && <BookOpen className="w-5 h-5 text-blue-600" />}
                {activity.type === 'badge' && <Award className="w-5 h-5 text-yellow-600" />}
                {activity.type === 'team' && <Users className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-sm text-gray-500">{activity.team} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <button className="flex items-center gap-3 p-4 bg-white border-2 border-[#395192] text-[#395192] rounded-lg hover:bg-blue-50 transition-colors">
          <UserPlus className="w-5 h-5" />
          <span className="font-medium">Invite Members</span>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Briefcase className="w-5 h-5" />
          <span className="font-medium">Create Team</span>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Assign Courses</span>
        </button>
      </div>
    </div>
  );
}