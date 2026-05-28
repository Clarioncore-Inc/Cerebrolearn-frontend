import React, { useEffect, useState } from 'react';
import api from '../../utils/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
  GraduationCap,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AdminAnalytics {
  total_users: number;
  total_courses: number;
  total_enrollments: number;
  total_revenue: number;
}

export function GlobalAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await api.admin.getAnalytics();
      setAnalytics('analytics' in analyticsData ? analyticsData.analytics : analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = analytics?.total_users || 0;
  const totalCourses = analytics?.total_courses || 0;
  const totalEnrollments = analytics?.total_enrollments || 0;
  const totalRevenue = analytics?.total_revenue || 0;
  const avgRevenuePerCourse = totalCourses > 0 ? totalRevenue / totalCourses : 0;
  const avgEnrollmentsPerCourse = totalCourses > 0 ? totalEnrollments / totalCourses : 0;
  const usersPerCourse = totalCourses > 0 ? totalUsers / totalCourses : 0;
  const revenuePerEnrollment = totalEnrollments > 0 ? totalRevenue / totalEnrollments : 0;

  const platformOverviewData = [
    { name: 'Users', value: totalUsers },
    { name: 'Courses', value: totalCourses },
    { name: 'Enrollments', value: totalEnrollments },
  ];

  const revenueMetricsData = [
    { metric: 'Total Revenue', value: totalRevenue },
    { metric: 'Revenue/Course', value: Number(avgRevenuePerCourse.toFixed(2)) },
    { metric: 'Revenue/Enrollment', value: Number(revenuePerEnrollment.toFixed(2)) },
  ];

  const comparisonData = [
    {
      name: 'Platform Totals',
      users: totalUsers,
      courses: totalCourses,
      enrollments: totalEnrollments,
    },
  ];

  const COLORS = ['#395192', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Courses',
      value: totalCourses,
      change: '+8.2%',
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Enrollments',
      value: totalEnrollments,
      change: '+23.1%',
      icon: GraduationCap,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const additionalMetrics = [
    {
      label: 'Avg Enrollments/Course',
      value: avgEnrollmentsPerCourse.toFixed(1),
      icon: TrendingUp,
    },
    {
      label: 'Avg Revenue/Course',
      value: `$${avgRevenuePerCourse.toFixed(0)}`,
      icon: DollarSign,
    },
    {
      label: 'Users/Course',
      value: usersPerCourse.toFixed(1),
      icon: UserPlus,
    },
    {
      label: 'Revenue/Enrollment',
      value: `$${revenuePerEnrollment.toFixed(2)}`,
      icon: Award,
    },
  ];

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2">Global Analytics</h1>
        <p className="text-muted-foreground">
          Platform-wide metrics and performance insights
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-green-500 font-medium">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {additionalMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="growth" className="w-full">
        <TabsList>
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Platform Totals Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformOverviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#395192" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Users, Courses & Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={platformOverviewData}>
                    <defs>
                      <linearGradient id="colorOverview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#colorOverview)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueMetricsData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" name="Value" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformOverviewData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Totals Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#395192" name="Users" />
                    <Bar dataKey="courses" fill="#8b5cf6" name="Courses" />
                    <Bar dataKey="enrollments" fill="#10b981" name="Enrollments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformOverviewData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Current total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Performance Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {additionalMetrics.map((metric, index) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{metric.label}</p>
                      <p className="text-xs text-muted-foreground">Derived from totals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}