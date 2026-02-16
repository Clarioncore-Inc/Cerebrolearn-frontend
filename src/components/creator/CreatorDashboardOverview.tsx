import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Star,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Plus,
  CheckCircle2,
  MessageSquare,
  Clock,
  Target,
  Zap,
  Calendar,
  Eye,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface CreatorDashboardOverviewProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CreatorDashboardOverview({ onNavigate }: CreatorDashboardOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      description: 'vs last month',
      details: '+$1,385 this month'
    },
    {
      title: 'Total Students',
      value: '2,847',
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'across all courses',
      details: '+437 this month'
    },
    {
      title: 'Active Courses',
      value: '12',
      change: '3 drafts',
      trend: 'neutral',
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'published',
      details: '15 total courses'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'from 1,234 reviews',
      details: '87% 5-star reviews'
    }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 2400, students: 240 },
    { name: 'Feb', revenue: 3800, students: 320 },
    { name: 'Mar', revenue: 3200, students: 290 },
    { name: 'Apr', revenue: 4800, students: 410 },
    { name: 'May', revenue: 5400, students: 480 },
    { name: 'Jun', revenue: 6200, students: 520 }
  ];

  const topCourses = [
    { id: '1', title: 'Complete React Development', students: 1250, revenue: 24875, rating: 4.9, growth: '+15%' },
    { id: '2', title: 'Advanced TypeScript Patterns', students: 890, revenue: 17780, rating: 4.8, growth: '+22%' },
    { id: '3', title: 'Web Development Bootcamp', students: 707, revenue: 14140, rating: 4.7, growth: '+8%' }
  ];

  const recentActivity = [
    { type: 'enrollment', course: 'React Development', student: 'John Doe', time: '2 mins ago', icon: Users, color: 'blue' },
    { type: 'review', course: 'TypeScript Patterns', rating: 5, reviewer: 'Jane Smith', time: '15 mins ago', icon: Star, color: 'yellow' },
    { type: 'completion', course: 'Web Bootcamp', student: 'Mike Johnson', time: '1 hour ago', icon: CheckCircle2, color: 'green' },
    { type: 'question', course: 'React Development', student: 'Sarah Wilson', time: '2 hours ago', icon: MessageSquare, color: 'purple' },
    { type: 'enrollment', course: 'TypeScript Patterns', student: 'Tom Brown', time: '3 hours ago', icon: Users, color: 'blue' }
  ];

  const goals = [
    { title: 'Reach 5,000 students', current: 4234, target: 5000, color: 'blue' },
    { title: 'Publish 30 courses', current: 26, target: 30, color: 'purple' },
    { title: '$20K monthly revenue', current: 17850, target: 20000, color: 'emerald' }
  ];

  const upcomingTasks = [
    { task: 'Update React course content', priority: 'high', dueDate: 'Today' },
    { task: 'Respond to 12 student questions', priority: 'medium', dueDate: 'Today' },
    { task: 'Review assignment submissions', priority: 'high', dueDate: 'Tomorrow' },
    { task: 'Record new lessons for Web Dev', priority: 'low', dueDate: 'This week' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back! 👋</h1>
          <p className="text-lg text-muted-foreground">
            Here's what's happening with your courses today
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => onNavigate('creator-analytics')}>
            <BarChart3 className="mr-2 h-5 w-5" />
            View Analytics
          </Button>
          <Button size="lg" className="bg-primary" onClick={() => onNavigate('creator-create-course')}>
            <Plus className="mr-2 h-5 w-5" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-none hover:shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" 
                 style={{ background: stat.color.replace('text-', '') }}></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {stat.trend === 'up' && (
                  <Badge className="bg-green-500/10 text-green-700 border-0">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === 'down' && (
                  <Badge className="bg-red-500/10 text-red-700 border-0">
                    <ArrowDown className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                )}
                {stat.trend === 'neutral' && (
                  <Badge variant="secondary">{stat.change}</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs font-medium text-primary mt-2">{stat.details}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart & Top Courses */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Revenue Overview</CardTitle>
                <CardDescription>Your earnings over the last 6 months</CardDescription>
              </div>
              <div className="flex gap-2">
                {['7d', '30d', '90d'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period as any)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#395192" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#395192" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#395192" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-accent/30">
            <CardTitle className="text-xl">Top Performers</CardTitle>
            <CardDescription>Best selling courses this month</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onNavigate('creator-courses', course)}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{course.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">${(course.revenue / 1000).toFixed(1)}k</div>
                    <Badge className="bg-green-500/10 text-green-700 border-0 text-xs">
                      {course.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-accent/30">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your students</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${activity.color}-500/10 text-${activity.color}-500`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activity.type === 'enrollment' && `${activity.student} enrolled in ${activity.course}`}
                      {activity.type === 'review' && `${activity.reviewer} left a ${activity.rating}-star review on ${activity.course}`}
                      {activity.type === 'completion' && `${activity.student} completed ${activity.course}`}
                      {activity.type === 'question' && `${activity.student} asked a question in ${activity.course}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals & Tasks */}
        <div className="space-y-6">
          {/* Goals */}
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Goals
              </CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {goals.map((goal, index) => {
                const percentage = (goal.current / goal.target) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-muted-foreground">
                        {goal.current.toLocaleString()}/{goal.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                  </div>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'default' : 'secondary'
                  } className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-none hover:shadow-md transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to create something amazing?</h3>
              <p className="text-muted-foreground">Share your knowledge with thousands of students worldwide</p>
            </div>
            <Button size="lg" className="bg-primary" onClick={() => onNavigate('creator-create-course')}>
              <Plus className="mr-2 h-5 w-5" />
              Create New Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}