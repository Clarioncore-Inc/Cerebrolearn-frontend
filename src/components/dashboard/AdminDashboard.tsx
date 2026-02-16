import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DashboardSkeleton } from '../ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  UserPlus,
  GraduationCap,
  Trophy,
  Clock,
  BarChart3,
  FileCheck,
  FileText,
  Monitor,
  Shield,
  Settings,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock analytics data
      setAnalytics({
        total_users: 1247,
        total_courses: 89,
        total_enrollments: 3421,
        total_revenue: 54280
      });
      
      // Mock users data
      setUsers([
        { id: 1, full_name: 'John Doe', email: 'john@example.com', role: 'student', xp: 1250 },
        { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', xp: 2100 },
        { id: 3, full_name: 'Bob Johnson', email: 'bob@example.com', role: 'student', xp: 850 },
        { id: 4, full_name: 'Alice Williams', email: 'alice@example.com', role: 'student', xp: 1500 },
        { id: 5, full_name: 'Charlie Brown', email: 'charlie@example.com', role: 'instructor', xp: 3200 },
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToTool = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigate-admin', { detail: page }));
  };

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.total_users || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Courses',
      value: analytics?.total_courses || 0,
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Active Enrollments',
      value: analytics?.total_enrollments || 0,
      icon: UserPlus,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Revenue',
      value: `$${analytics?.total_revenue || 0}`,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const chartData = [
    { name: 'Mon', users: 12, enrollments: 8 },
    { name: 'Tue', users: 19, enrollments: 14 },
    { name: 'Wed', users: 15, enrollments: 11 },
    { name: 'Thu', users: 25, enrollments: 18 },
    { name: 'Fri', users: 22, enrollments: 16 },
    { name: 'Sat', users: 18, enrollments: 13 },
    { name: 'Sun', users: 14, enrollments: 10 },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="mb-2">Platform Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor platform-wide metrics and manage users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise Tools Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Enterprise Management Tools</h2>
          <p className="text-muted-foreground">
            Advanced analytics, monitoring, and configuration tools
          </p>
        </div>

        {/* Analytics & Reporting */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analytics & Reporting
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md cursor-pointer group"
                  onClick={() => navigateToTool('platform-analytics')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-semibold mb-2">Platform Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive metrics, KPIs, and performance insights across the entire platform
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md cursor-pointer group"
                  onClick={() => navigateToTool('quality-assurance')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-semibold mb-2">Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor service quality, ratings, and identify at-risk providers
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md cursor-pointer group"
                  onClick={() => navigateToTool('advanced-reports')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-semibold mb-2">Advanced Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Generate custom reports with filters and export capabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Management */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System Management
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md cursor-pointer group"
                  onClick={() => navigateToTool('system-health')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-orange-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-semibold mb-2">System Health</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring of platform services, performance, and uptime
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md cursor-pointer group"
                  onClick={() => navigateToTool('compliance-manager')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-semibold mb-2">Compliance Manager</h4>
                <p className="text-sm text-muted-foreground">
                  Track licensing, certifications, insurance, and regulatory compliance
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all shadow-none hover:shadow-md cursor-pointer group"
                  onClick={() => navigateToTool('platform-settings')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-cyan-500" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-semibold mb-2">Platform Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure system-wide settings, features, and preferences
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pending Applications Alert */}
      <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <ClipboardCheck className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Pending Applications</h3>
                <p className="text-sm text-muted-foreground">
                  You have <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">2 pending</Badge> applications awaiting review
                </p>
              </div>
            </div>
            <Button onClick={() => navigateToTool('applications')}>
              Review Applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-accent/30">
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-accent/30">
            <CardTitle>Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30">
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{user.role}</span>
                      <span className="text-sm text-muted-foreground">{user.xp || 0} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30">
              <CardTitle>Course Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Course moderation tools</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Transaction records</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}