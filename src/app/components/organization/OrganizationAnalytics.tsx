import React, { useState } from 'react';
import { TrendingUp, Users, BookOpen, Award, Download, Calendar, BarChart3, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface OrganizationAnalyticsProps {
  organizationId: string;
}

export function OrganizationAnalytics({ organizationId }: OrganizationAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock data - replace with API calls
  const kpis = {
    totalEnrollments: 1234,
    enrollmentChange: 18.5,
    completionRate: 76.3,
    completionChange: 5.2,
    avgTimeToComplete: 14,
    timeChange: -2.1,
    activeLearners: 189,
    learnerChange: 12.3
  };

  const teamComparisonData = [
    { team: 'Engineering', enrolled: 145, completed: 112, inProgress: 33, avgScore: 85 },
    { team: 'Marketing', enrolled: 98, completed: 82, inProgress: 16, avgScore: 88 },
    { team: 'Sales', enrolled: 162, completed: 118, inProgress: 44, avgScore: 79 },
    { team: 'Design', enrolled: 76, completed: 68, inProgress: 8, avgScore: 92 },
    { team: 'Product', enrolled: 103, completed: 78, inProgress: 25, avgScore: 83 },
    { team: 'HR', enrolled: 52, completed: 48, inProgress: 4, avgScore: 90 }
  ];

  const enrollmentTrendData = [
    { month: 'Jan', enrollments: 45, completions: 32 },
    { month: 'Feb', enrollments: 58, completions: 41 },
    { month: 'Mar', enrollments: 72, completions: 55 },
    { month: 'Apr', enrollments: 65, completions: 48 },
    { month: 'May', enrollments: 89, completions: 67 },
    { month: 'Jun', enrollments: 102, completions: 78 }
  ];

  const categoryDistribution = [
    { name: 'Technology', value: 420, color: '#395192' },
    { name: 'Leadership', value: 280, color: '#10b981' },
    { name: 'Sales', value: 190, color: '#f59e0b' },
    { name: 'Design', value: 160, color: '#8b5cf6' },
    { name: 'Other', value: 184, color: '#6b7280' }
  ];

  const skillsRadarData = [
    { skill: 'Technical', team: 85, orgAvg: 75 },
    { skill: 'Leadership', team: 78, orgAvg: 70 },
    { skill: 'Communication', team: 82, orgAvg: 80 },
    { skill: 'Problem Solving', team: 88, orgAvg: 78 },
    { skill: 'Creativity', team: 75, orgAvg: 72 }
  ];

  const topCourses = [
    { title: 'Advanced React Patterns', enrollments: 145, completionRate: 82, avgRating: 4.8 },
    { title: 'Leadership Essentials', enrollments: 132, completionRate: 78, avgRating: 4.6 },
    { title: 'Data Analytics', enrollments: 118, completionRate: 85, avgRating: 4.9 },
    { title: 'Product Management 101', enrollments: 107, completionRate: 76, avgRating: 4.5 },
    { title: 'UI/UX Design Fundamentals', enrollments: 95, completionRate: 89, avgRating: 4.7 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Organization Analytics</h1>
          <p className="text-gray-600">Comprehensive learning metrics and insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#395192]" />
            </div>
            <span className={`text-sm ${kpis.enrollmentChange > 0 ? 'text-green-600' : 'text-red-600'} bg-green-50 px-2 py-1 rounded`}>
              {kpis.enrollmentChange > 0 ? '+' : ''}{kpis.enrollmentChange}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Enrollments</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.totalEnrollments}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.completionRate}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Avg Time to Complete</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.avgTimeToComplete}<span className="text-lg text-gray-500">d</span></p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Active Learners</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.activeLearners}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollment Trends */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Enrollment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="enrollments" stroke="#395192" strokeWidth={2} name="Enrollments" />
              <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2} name="Completions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Course Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Comparison */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-900 mb-6">Team Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={teamComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="inProgress" fill="#395192" name="In Progress" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Skills Radar */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Skills Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillsRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Team Average" dataKey="team" stroke="#395192" fill="#395192" fillOpacity={0.6} />
              <Radar name="Org Average" dataKey="orgAvg" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Top Performing Courses</h3>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-gray-900">{course.avgRating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#395192] rounded-full h-2"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{course.completionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Team Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamComparisonData.map((team) => (
                <tr key={team.team} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{team.team}</td>
                  <td className="px-6 py-4 text-gray-600">{team.enrolled}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{team.completed}</td>
                  <td className="px-6 py-4 text-blue-600">{team.inProgress}</td>
                  <td className="px-6 py-4 text-gray-900">{team.avgScore}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-[#395192] rounded-full h-2"
                          style={{ width: `${Math.round((team.completed / team.enrolled) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {Math.round((team.completed / team.enrolled) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Strong Growth</h3>
          <p className="text-sm text-gray-600">Enrollments up 18.5% this month. Design team leading with 92% avg score.</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="w-12 h-12 bg-[#395192] rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">On Track</h3>
          <p className="text-sm text-gray-600">76.3% completion rate exceeds quarterly target of 75%.</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Opportunity</h3>
          <p className="text-sm text-gray-600">Sales team shows potential for improvement in technical courses.</p>
        </div>
      </div>
    </div>
  );
}