import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Award,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  PlayCircle,
  CheckCircle2,
  Target,
  Share2,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

interface CreatorAnalyticsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CreatorAnalyticsPage({ onNavigate }: CreatorAnalyticsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const overviewStats = [
    {
      title: 'Total Views',
      value: '45,231',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Enrollments',
      value: '3,847',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Completion Rate',
      value: '68%',
      change: '+5.1%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Avg. Progress',
      value: '43%',
      change: '-2.3%',
      trend: 'down',
      icon: Target,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  const coursePerformance = [
    { name: 'Introduction to Python', subscribers: 1245, views: 15234, completion: 72, rating: 4.8 },
    { name: 'Web Development Bootcamp', subscribers: 892, views: 12100, completion: 65, rating: 4.7 },
    { name: 'React Masterclass', subscribers: 756, views: 9876, completion: 58, rating: 4.9 },
    { name: 'Data Science Fundamentals', subscribers: 654, views: 8932, completion: 71, rating: 4.6 },
    { name: 'UI/UX Design Principles', subscribers: 300, views: 4123, completion: 45, rating: 4.5 }
  ];

  // Chart data for engagement trends
  const engagementData = [
    { name: 'Mon', views: 2400, enrollments: 400, completions: 240 },
    { name: 'Tue', views: 1398, enrollments: 300, completions: 220 },
    { name: 'Wed', views: 3800, enrollments: 500, completions: 290 },
    { name: 'Thu', views: 3908, enrollments: 470, completions: 300 },
    { name: 'Fri', views: 4800, enrollments: 520, completions: 310 },
    { name: 'Sat', views: 3800, enrollments: 450, completions: 280 },
    { name: 'Sun', views: 4300, enrollments: 480, completions: 295 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Course Analytics</h1>
            <p className="text-base text-muted-foreground">
              Deep insights into your course performance and learner engagement
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)} className="w-auto">
              <TabsList className="bg-accent">
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
                <TabsTrigger value="90d">90 Days</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="lg" className="border-2">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden border hover:border-primary/50 transition-all duration-300 shadow-none hover:shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10" style={{ background: stat.color.replace('text-', '') }}></div>
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge className={stat.trend === 'up' ? 'bg-green-500/10 text-green-700 border-0' : 'bg-red-500/10 text-red-700 border-0'}>
                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Course Performance Table */}
      <Card className="border-2 shadow-none hover:shadow-md transition-all">
        <CardHeader className="border-b bg-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Course Performance</CardTitle>
              <CardDescription>Detailed metrics for each of your courses</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All Courses</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {coursePerformance.map((course, index) => (
              <div key={index} className="flex items-center gap-4 p-6 hover:bg-accent/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate mb-2 group-hover:text-primary transition-colors">{course.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-blue-500/10">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Subscribers</div>
                        <div className="font-semibold text-sm">{course.subscribers.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-purple-500/10">
                        <Eye className="w-3.5 h-3.5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Views</div>
                        <div className="font-semibold text-sm">{course.views.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-green-500/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                        <div className="font-semibold text-sm">{course.completion}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-amber-500/10">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                        <div className="font-semibold text-sm">{course.rating} ⭐</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-red-500/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                <CardDescription>Courses that need attention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[
                { lesson: 'Lesson 3: Advanced Concepts', dropoff: '23%' },
                { lesson: 'Lesson 5: Practical Project', dropoff: '18%' },
                { lesson: 'Lesson 7: Complex Topics', dropoff: '15%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/60 transition-colors">
                  <span className="text-sm font-medium flex-1">{item.lesson}</span>
                  <Badge variant="destructive" className="ml-3">{item.dropoff}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-green-500/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Top Performers</CardTitle>
                <CardDescription>Your best courses this month</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[
                { lesson: 'Lesson 1: Getting Started', views: '5,432' },
                { lesson: 'Lesson 2: Core Fundamentals', views: '4,891' },
                { lesson: 'Lesson 4: Real-world Examples', views: '4,223' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/60 transition-colors">
                  <span className="text-sm font-medium flex-1">{item.lesson}</span>
                  <div className="flex items-center gap-2 ml-3">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{item.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends Chart */}
      <Card className="border-2 shadow-none hover:shadow-md transition-all">
        <CardHeader className="border-b bg-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Engagement Trends</CardTitle>
              <CardDescription>Student engagement over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={engagementData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="enrollments" stroke="#82ca9d" />
              <Line type="monotone" dataKey="completions" stroke="#FF8C00" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}