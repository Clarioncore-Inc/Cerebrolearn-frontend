"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  CreditCard,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface RevenueAnalyticsDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function RevenueAnalyticsDashboard({ onNavigate }: RevenueAnalyticsDashboardProps) {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year

  // Load data from localStorage
  const appointments = useMemo(() => {
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    return bookings.filter((b: any) => b.psychologistId === user?.id || b.psychologistName?.includes('Dr.'));
  }, [user]);

  const sessionNotes = useMemo(() => {
    return JSON.parse(localStorage.getItem(`session_notes_${user?.id}`) || '[]');
  }, [user]);

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    const ranges: any = {
      'week': 7,
      'month': 30,
      'quarter': 90,
      'year': 365
    };
    const days = ranges[timeRange] || 30;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return { start, end: now };
  };

  // Filter appointments by date range
  const filteredAppointments = useMemo(() => {
    const { start, end } = getDateRange();
    return appointments.filter((apt: any) => {
      const aptDate = new Date(apt.date);
      return aptDate >= start && aptDate <= end;
    });
  }, [appointments, timeRange]);

  // Calculate revenue metrics
  const revenueMetrics = useMemo(() => {
    const completed = filteredAppointments.filter((a: any) => 
      a.status === 'completed' || new Date(a.date) < new Date()
    );
    
    const totalRevenue = completed.reduce((sum: number, apt: any) => 
      sum + (apt.price || 150), 0
    );

    const pendingRevenue = filteredAppointments
      .filter((a: any) => a.status === 'confirmed' && new Date(a.date) >= new Date())
      .reduce((sum: number, apt: any) => sum + (apt.price || 150), 0);

    const cancelledRevenue = filteredAppointments
      .filter((a: any) => a.status === 'cancelled')
      .reduce((sum: number, apt: any) => sum + ((apt.cancellationFee || 0)), 0);

    const avgSessionRate = completed.length > 0 
      ? totalRevenue / completed.length 
      : 150;

    // Calculate by session type
    const byType: any = {};
    completed.forEach((apt: any) => {
      const type = apt.sessionType || 'Standard Session';
      if (!byType[type]) {
        byType[type] = { count: 0, revenue: 0 };
      }
      byType[type].count++;
      byType[type].revenue += apt.price || 150;
    });

    return {
      totalRevenue,
      pendingRevenue,
      cancelledRevenue,
      avgSessionRate,
      completedSessions: completed.length,
      byType
    };
  }, [filteredAppointments]);

  // Calculate client metrics
  const clientMetrics = useMemo(() => {
    const uniqueClients = new Set(filteredAppointments.map((a: any) => a.studentId));
    const newClients = filteredAppointments.filter((a: any) => 
      a.sessionType?.includes('Initial') || a.sessionType?.includes('Consultation')
    );
    const returningClients = filteredAppointments.filter((a: any) => 
      !a.sessionType?.includes('Initial') && !a.sessionType?.includes('Consultation')
    );

    const retentionRate = uniqueClients.size > 0
      ? (returningClients.length / uniqueClients.size) * 100
      : 0;

    return {
      totalClients: uniqueClients.size,
      newClients: newClients.length,
      returningClients: returningClients.length,
      retentionRate
    };
  }, [filteredAppointments]);

  // Calculate time metrics
  const timeMetrics = useMemo(() => {
    const totalMinutes = filteredAppointments
      .filter((a: any) => a.status === 'completed' || new Date(a.date) < new Date())
      .reduce((sum: number, apt: any) => {
        const duration = parseInt(apt.sessionType?.match(/(\d+) min/)?.[1] || '60');
        return sum + duration;
      }, 0);

    const totalHours = totalMinutes / 60;
    const utilizationRate = timeRange === 'week' ? (totalHours / 40) * 100 :
                           timeRange === 'month' ? (totalHours / 160) * 100 :
                           (totalHours / 480) * 100;

    return {
      totalHours,
      utilizationRate: Math.min(utilizationRate, 100),
      avgDailyHours: totalHours / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90)
    };
  }, [filteredAppointments, timeRange]);

  // Revenue trend (daily/weekly)
  const revenueTrend = useMemo(() => {
    const trend: any = [];
    const { start, end } = getDateRange();
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const dayRevenue = filteredAppointments
        .filter((a: any) => {
          const aptDate = new Date(a.date);
          return aptDate.toDateString() === date.toDateString() && 
                 (a.status === 'completed' || aptDate < new Date());
        })
        .reduce((sum: number, apt: any) => sum + (apt.price || 150), 0);
      
      if (dayRevenue > 0) {
        trend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue
        });
      }
    }
    
    return trend;
  }, [filteredAppointments]);

  // Compare to previous period
  const comparison = useMemo(() => {
    const currentTotal = revenueMetrics.totalRevenue;
    
    // Get previous period
    const { start } = getDateRange();
    const days = Math.ceil((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
    
    const previousAppointments = appointments.filter((apt: any) => {
      const aptDate = new Date(apt.date);
      return aptDate >= previousStart && aptDate < start && apt.status === 'completed';
    });
    
    const previousTotal = previousAppointments.reduce((sum: number, apt: any) => 
      sum + (apt.price || 150), 0
    );

    const change = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;

    return {
      previousTotal,
      change,
      isIncrease: change >= 0
    };
  }, [revenueMetrics, appointments, timeRange]);

  const exportReport = () => {
    const report = `
PSYCHOLOGIST REVENUE & ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
Period: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
Psychologist: ${user?.name || 'Dr. Professional'}

======================================
REVENUE SUMMARY
======================================
Total Revenue: $${revenueMetrics.totalRevenue.toLocaleString()}
Pending Revenue: $${revenueMetrics.pendingRevenue.toLocaleString()}
Cancellation Fees: $${revenueMetrics.cancelledRevenue.toLocaleString()}
Average Session Rate: $${revenueMetrics.avgSessionRate.toFixed(2)}
Completed Sessions: ${revenueMetrics.completedSessions}

Previous Period: $${comparison.previousTotal.toLocaleString()}
Change: ${comparison.isIncrease ? '+' : ''}${comparison.change.toFixed(1)}%

======================================
CLIENT METRICS
======================================
Total Clients: ${clientMetrics.totalClients}
New Clients: ${clientMetrics.newClients}
Returning Clients: ${clientMetrics.returningClients}
Retention Rate: ${clientMetrics.retentionRate.toFixed(1)}%

======================================
TIME UTILIZATION
======================================
Total Clinical Hours: ${timeMetrics.totalHours.toFixed(1)}
Utilization Rate: ${timeMetrics.utilizationRate.toFixed(1)}%
Average Daily Hours: ${timeMetrics.avgDailyHours.toFixed(1)}

======================================
REVENUE BY SESSION TYPE
======================================
${Object.entries(revenueMetrics.byType).map(([type, data]: any) => 
  `${type}: $${data.revenue.toLocaleString()} (${data.count} sessions)`
).join('\n')}

======================================
REVENUE TREND
======================================
${revenueTrend.map((t: any) => `${t.date}: $${t.revenue}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${timeRange}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Report exported successfully');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Revenue & Analytics</h1>
            <p className="text-muted-foreground">
              Track your practice performance and financial metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                </div>
                {comparison.isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className="text-3xl font-bold text-green-600">
                ${revenueMetrics.totalRevenue.toLocaleString()}
              </p>
              <p className={`text-xs mt-1 ${comparison.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.isIncrease ? '+' : ''}{comparison.change.toFixed(1)}% from previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Clients</span>
              </div>
              <p className="text-3xl font-bold">{clientMetrics.totalClients}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {clientMetrics.newClients} new, {clientMetrics.returningClients} returning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Clinical Hours</span>
              </div>
              <p className="text-3xl font-bold">{timeMetrics.totalHours.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {timeMetrics.utilizationRate.toFixed(1)}% utilization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-muted-foreground">Completed Sessions</span>
              </div>
              <p className="text-3xl font-bold">{revenueMetrics.completedSessions}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ${revenueMetrics.avgSessionRate.toFixed(0)} avg rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Details</TabsTrigger>
            <TabsTrigger value="clients">Client Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-sm">Completed Sessions</span>
                    </div>
                    <span className="font-semibold">${revenueMetrics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Pending Sessions</span>
                    </div>
                    <span className="font-semibold">${revenueMetrics.pendingRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                      <span className="text-sm">Cancellation Fees</span>
                    </div>
                    <span className="font-semibold">${revenueMetrics.cancelledRevenue.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="font-semibold">Total Earnings</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(revenueMetrics.totalRevenue + revenueMetrics.cancelledRevenue).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Session Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue by Session Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(revenueMetrics.byType).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No completed sessions yet
                    </p>
                  ) : (
                    Object.entries(revenueMetrics.byType).map(([type, data]: any) => (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{type}</span>
                          <span className="font-semibold">${data.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all" 
                              style={{ 
                                width: `${(data.revenue / revenueMetrics.totalRevenue) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-16 text-right">
                            {data.count} sessions
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueTrend.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No revenue data for this period
                  </p>
                ) : (
                  <div className="space-y-2">
                    {revenueTrend.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">{item.date}</span>
                        <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary to-secondary h-6 rounded-full transition-all flex items-center justify-end px-2"
                            style={{ 
                              width: `${(item.revenue / Math.max(...revenueTrend.map((t: any) => t.revenue))) * 100}%`,
                              minWidth: '40px'
                            }}
                          >
                            <span className="text-xs font-semibold text-white">
                              ${item.revenue}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Details Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Session Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    ${revenueMetrics.avgSessionRate.toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">per session</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-secondary">
                    {clientMetrics.retentionRate.toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {clientMetrics.returningClients} returning clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Utilization Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-purple-600">
                    {timeMetrics.utilizationRate.toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {timeMetrics.avgDailyHours.toFixed(1)} hours/day avg
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Income</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed Sessions:</span>
                        <span className="font-semibold">${revenueMetrics.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cancellation Fees:</span>
                        <span className="font-semibold">${revenueMetrics.cancelledRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Total Income:</span>
                        <span className="font-bold text-green-600">
                          ${(revenueMetrics.totalRevenue + revenueMetrics.cancelledRevenue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Pending & Future</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confirmed Appointments:</span>
                        <span className="font-semibold">${revenueMetrics.pendingRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potential Revenue:</span>
                        <span className="font-semibold">${revenueMetrics.pendingRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Projected Total:</span>
                        <span className="font-bold text-blue-600">
                          ${(revenueMetrics.totalRevenue + revenueMetrics.pendingRevenue + revenueMetrics.cancelledRevenue).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Analytics Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">New Clients</p>
                      <p className="text-2xl font-bold">{clientMetrics.newClients}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className="text-lg font-semibold">
                        {clientMetrics.totalClients > 0 
                          ? ((clientMetrics.newClients / clientMetrics.totalClients) * 100).toFixed(0)
                          : 0}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Returning Clients</p>
                      <p className="text-2xl font-bold">{clientMetrics.returningClients}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className="text-lg font-semibold">
                        {clientMetrics.totalClients > 0 
                          ? ((clientMetrics.returningClients / clientMetrics.totalClients) * 100).toFixed(0)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Retention Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Client Retention Rate</span>
                      <span className="text-2xl font-bold">{clientMetrics.retentionRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${clientMetrics.retentionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Active Clients:</span>
                      <span className="font-semibold">{clientMetrics.totalClients}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Average Sessions per Client:</span>
                      <span className="font-semibold">
                        {clientMetrics.totalClients > 0 
                          ? (revenueMetrics.completedSessions / clientMetrics.totalClients).toFixed(1)
                          : 0}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-semibold">Performance Score</span>
                  </div>
                  <p className="text-4xl font-bold text-yellow-600">
                    {Math.min(95, 70 + Math.floor(clientMetrics.retentionRate / 5))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold">Collection Rate</span>
                  </div>
                  <p className="text-4xl font-bold text-green-600">98%</p>
                  <p className="text-xs text-muted-foreground mt-1">Payment success rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold">Documentation Rate</span>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">
                    {revenueMetrics.completedSessions > 0 
                      ? Math.min(100, ((sessionNotes.length / revenueMetrics.completedSessions) * 100)).toFixed(0)
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sessionNotes.length} of {revenueMetrics.completedSessions} sessions documented
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Practice Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Strong Retention</p>
                    <p className="text-xs text-muted-foreground">
                      Your {clientMetrics.retentionRate.toFixed(0)}% retention rate is above industry average (60-70%)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Consistent Utilization</p>
                    <p className="text-xs text-muted-foreground">
                      {timeMetrics.utilizationRate.toFixed(0)}% utilization rate - maintaining good work-life balance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Revenue Growth</p>
                    <p className="text-xs text-muted-foreground">
                      {comparison.isIncrease ? 'Positive' : 'Negative'} trend of {Math.abs(comparison.change).toFixed(1)}% compared to previous period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
