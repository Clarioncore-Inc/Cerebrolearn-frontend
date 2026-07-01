import React, { useState } from 'react';
import { Users, BookOpen, TrendingUp, Award, Calendar, MoreVertical, UserPlus, Settings, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TeamDashboardProps {
  teamId: string;
}

export function TeamDashboard({ teamId }: TeamDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'courses' | 'activity'>('overview');

  // Mock data - replace with API calls
  const teamInfo = {
    name: 'Engineering',
    description: 'Software development and technical teams',
    memberCount: 45,
    teamLead: 'Sarah Chen',
    created: '2024-01-15',
    avgProgress: 78,
    coursesAssigned: 12,
    coursesCompleted: 156,
    totalXP: 67890
  };

  const teamMembers = [
    { id: '1', name: 'Sarah Chen', role: 'Team Lead', progress: 95, coursesCompleted: 12, xp: 15400, avatar: 'SC', status: 'online' },
    { id: '2', name: 'Alex Kumar', role: 'Member', progress: 82, coursesCompleted: 10, xp: 12800, avatar: 'AK', status: 'online' },
    { id: '3', name: 'Maria Garcia', role: 'Member', progress: 88, coursesCompleted: 11, xp: 13200, avatar: 'MG', status: 'offline' },
    { id: '4', name: 'Tom Wilson', role: 'Member', progress: 65, coursesCompleted: 7, xp: 8900, avatar: 'TW', status: 'online' },
    { id: '5', name: 'Lisa Chen', role: 'Member', progress: 72, coursesCompleted: 8, xp: 9600, avatar: 'LC', status: 'offline' }
  ];

  const assignedCourses = [
    { id: '1', title: 'Advanced React Patterns', enrolled: 38, completed: 28, dueDate: '2024-12-15', priority: 'Required' },
    { id: '2', title: 'TypeScript Masterclass', enrolled: 35, completed: 25, dueDate: '2024-12-20', priority: 'Required' },
    { id: '3', title: 'System Design', enrolled: 30, completed: 18, dueDate: '2025-01-10', priority: 'Optional' },
    { id: '4', title: 'Clean Code Principles', enrolled: 42, completed: 32, dueDate: '2024-12-25', priority: 'Required' }
  ];

  const progressData = [
    { week: 'Week 1', progress: 45 },
    { week: 'Week 2', progress: 52 },
    { week: 'Week 3', progress: 61 },
    { week: 'Week 4', progress: 68 },
    { week: 'Week 5', progress: 72 },
    { week: 'Week 6', progress: 78 }
  ];

  const recentActivity = [
    { user: 'Sarah Chen', action: 'completed', item: 'Advanced React Patterns', time: '2h ago', type: 'completion' },
    { user: 'Alex Kumar', action: 'earned badge', item: 'Quick Learner', time: '5h ago', type: 'badge' },
    { user: 'Maria Garcia', action: 'started', item: 'System Design', time: '1d ago', type: 'enrollment' },
    { user: 'Tom Wilson', action: 'completed lesson', item: 'React Hooks Deep Dive', time: '1d ago', type: 'lesson' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#395192] rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="mb-1">{teamInfo.name}</h1>
              <p className="text-gray-600">{teamInfo.description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <UserPlus className="w-5 h-5" />
              Add Members
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>

        {/* Team Leader Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 inline-flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
            SC
          </div>
          <div>
            <p className="text-sm text-gray-600">Team Lead</p>
            <p className="font-medium text-gray-900">{teamInfo.teamLead}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Team Members</p>
          <p className="text-2xl font-bold text-gray-900">{teamInfo.memberCount}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Courses Assigned</p>
          <p className="text-2xl font-bold text-gray-900">{teamInfo.coursesAssigned}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Avg Progress</p>
          <p className="text-2xl font-bold text-gray-900">{teamInfo.avgProgress}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total XP</p>
          <p className="text-2xl font-bold text-gray-900">{teamInfo.totalXP.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <div className="flex gap-2 p-2">
            {['overview', 'members', 'courses', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-[#395192] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Chart */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Team Progress Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#395192" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Performers */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {teamMembers.slice(0, 3).map((member, index) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div className="w-10 h-10 bg-[#395192] rounded-full flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.coursesCompleted} courses completed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#395192]">{member.xp.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="w-12 h-12 bg-[#395192] rounded-full flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        {member.role === 'Team Lead' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Lead</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{member.coursesCompleted} courses</span>
                        <span>•</span>
                        <span>{member.xp.toLocaleString()} XP</span>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{member.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#395192] rounded-full h-2"
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              {assignedCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          course.priority === 'Required'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{course.enrolled} enrolled</span>
                        <span>•</span>
                        <span>{course.completed} completed</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {course.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#395192] rounded-full h-2"
                        style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round((course.completed / course.enrolled) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'completion' ? 'bg-green-100' :
                    activity.type === 'badge' ? 'bg-yellow-100' :
                    activity.type === 'enrollment' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'completion' && <Award className="w-5 h-5 text-green-600" />}
                    {activity.type === 'badge' && <Award className="w-5 h-5 text-yellow-600" />}
                    {activity.type === 'enrollment' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'lesson' && <BookOpen className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-white border-2 border-[#395192] text-[#395192] rounded-lg hover:bg-blue-50 transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Assign New Course</span>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Team Discussion</span>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Schedule Session</span>
        </button>
      </div>
    </div>
  );
}