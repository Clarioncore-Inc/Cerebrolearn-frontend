import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  DollarSign, 
  TrendingUp,
  CreditCard,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Percent,
  Tag,
  Receipt,
  Wallet,
  BarChart3,
  Plus
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

interface CreatorRevenuePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CreatorRevenuePage({ onNavigate }: CreatorRevenuePageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const revenueStats = [
    {
      title: 'Total Revenue',
      value: '$24,582',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'This Month',
      value: '$3,847',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Pending Payout',
      value: '$1,234',
      change: 'Due in 5 days',
      trend: 'neutral',
      icon: Wallet,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Avg. per Course',
      value: '$2,048',
      change: '+5.1%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  const courseRevenue = [
    { name: 'Introduction to Python', sales: 1245, revenue: 61225, price: 49.99, trend: 'up' },
    { name: 'Web Development Bootcamp', sales: 892, revenue: 44588, price: 49.99, trend: 'up' },
    { name: 'React Masterclass', sales: 756, revenue: 37756, price: 49.99, trend: 'down' },
    { name: 'Data Science Fundamentals', sales: 654, revenue: 32685, price: 49.99, trend: 'up' },
    { name: 'UI/UX Design Principles', sales: 300, revenue: 14997, price: 49.99, trend: 'up' }
  ];

  const payoutHistory = [
    { date: '2024-03-01', amount: 2845.50, status: 'completed', method: 'Bank Transfer' },
    { date: '2024-02-01', amount: 2456.75, status: 'completed', method: 'Bank Transfer' },
    { date: '2024-01-01', amount: 2123.25, status: 'completed', method: 'Bank Transfer' }
  ];

  const discountCodes = [
    { code: 'WELCOME25', discount: '25%', uses: 145, revenue: 3625 },
    { code: 'SUMMER2024', discount: '20%', uses: 89, revenue: 2225 },
    { code: 'EARLYBIRD', discount: '30%', uses: 67, revenue: 1675 }
  ];

  // Revenue trend chart data
  const revenueTrendData = [
    { month: 'Jan', revenue: 1850, payouts: 1500 },
    { month: 'Feb', revenue: 2100, payouts: 1800 },
    { month: 'Mar', revenue: 2450, payouts: 2000 },
    { month: 'Apr', revenue: 2800, payouts: 2300 },
    { month: 'May', revenue: 3200, payouts: 2700 },
    { month: 'Jun', revenue: 3850, payouts: 3100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Revenue & Earnings</h1>
            <p className="text-base text-muted-foreground">
              Track your earnings and manage course monetization
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

        {/* Revenue Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {revenueStats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden border hover:border-primary/50 transition-all duration-300 shadow-none hover:shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10" style={{ background: stat.color.replace('text-', '') }}></div>
              <CardContent className="relative pt-[20px] pr-[20px] pb-[24px] pl-[20px]">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <Badge className={stat.trend === 'up' ? 'bg-green-500/10 text-green-700 border-0' : 'bg-red-500/10 text-red-700 border-0'}>
                      {stat.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </Badge>
                  )}
                  {stat.trend === 'neutral' && (
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  )}
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

      {/* Revenue Trend Chart */}
      <Card className="border-2 shadow-none hover:shadow-md transition-all">
        <CardHeader className="border-b bg-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue and payout tracking</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={revenueTrendData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="payouts" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPayouts)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Course */}
      <Card className="border-2 shadow-none hover:shadow-md transition-all">
        <CardHeader className="border-b bg-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Revenue by Course</CardTitle>
              <CardDescription>Top earning courses this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {courseRevenue.map((course, index) => (
              <div key={index} className="flex items-center gap-4 p-6 hover:bg-accent/50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-600 font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate mb-1 group-hover:text-primary transition-colors">{course.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Receipt className="w-3 h-3" />
                      {course.sales} sales
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      ${course.price} each
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${course.revenue.toLocaleString()}
                  </div>
                  <Badge variant={course.trend === 'up' ? 'default' : 'secondary'} className="mt-1">
                    {course.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {course.trend === 'up' ? '+12%' : '-5%'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout History & Discount Codes */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Payout History */}
        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Payout History</CardTitle>
                  <CardDescription>Recent withdrawals and payments</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {payoutHistory.map((payout, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg hover:bg-accent/60 transition-colors">
                  <div>
                    <p className="font-bold text-lg">${payout.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{payout.date}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{payout.method}</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700 border-0">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Request Payout
            </Button>
          </CardContent>
        </Card>

        {/* Discount Codes */}
        <Card className="border-2 shadow-none hover:shadow-md transition-all">
          <CardHeader className="border-b bg-purple-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Discount Codes</CardTitle>
                  <CardDescription>Active promotional codes</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create Code
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {discountCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg hover:bg-accent/60 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold font-mono text-sm">{code.code}</p>
                      <Badge variant="secondary" className="text-xs">{code.discount}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{code.uses} uses</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">${code.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="lg">
              <Tag className="mr-2 h-4 w-4" />
              Create New Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Settings */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-none hover:shadow-md transition-all">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Payment Settings</CardTitle>
          <CardDescription>Configure your payout preferences and pricing</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-6 justify-start" size="lg" onClick={() => onNavigate('creator-settings')}>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold mb-1">Payout Method</div>
                  <div className="text-xs text-muted-foreground">Update bank details and preferences</div>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-6 justify-start" size="lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold mb-1">Pricing Settings</div>
                  <div className="text-xs text-muted-foreground">Manage course prices and offers</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}