"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Award,
  Brain,
  Video,
  MessageSquare,
  Target,
  Clock,
  BarChart3,
  Download,
  Filter,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PlatformAnalyticsDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PlatformAnalyticsDashboard({ onNavigate }: PlatformAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Load all platform data
  const platformData = useMemo(() => {
    const psychologists = JSON.parse(localStorage.getItem('psychologists') || '[]');
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const sessionNotes = JSON.parse(localStorage.getItem('session_notes') || '[]');
    const feedback = JSON.parse(localStorage.getItem('session_feedback') || '[]');
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');

    return {
      psychologists,
      bookings,
      payments,
      sessionNotes,
      feedback,
      users
    };
  }, [dateRange]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const rangeDays = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
    const rangeMs = rangeDays * 24 * 60 * 60 * 1000;
    const rangeStart = new Date(now.getTime() - rangeMs);

    const bookingsInRange = platformData.bookings.filter((b: any) => 
      new Date(b.createdAt || b.date) >= rangeStart
    );
    const paymentsInRange = platformData.payments.filter((p: any) =>
      new Date(p.createdAt) >= rangeStart
    );
    const feedbackInRange = platformData.feedback.filter((f: any) =>
      new Date(f.submittedAt) >= rangeStart
    );

    // Previous period for comparison
    const prevRangeStart = new Date(rangeStart.getTime() - rangeMs);
    const bookingsPrevRange = platformData.bookings.filter((b: any) => {
      const date = new Date(b.createdAt || b.date);
      return date >= prevRangeStart && date < rangeStart;
    });

    const totalRevenue = paymentsInRange.reduce((sum: number, p: any) => 
      sum + (p.amount || 150), 0
    );
    const prevRevenue = platformData.payments
      .filter((p: any) => {
        const date = new Date(p.createdAt);
        return date >= prevRangeStart && date < rangeStart;
      })
      .reduce((sum: number, p: any) => sum + (p.amount || 150), 0);

    const avgRating = feedbackInRange.length > 0
      ? feedbackInRange.reduce((sum: number, f: any) => sum + f.rating, 0) / feedbackInRange.length
      : 0;

    const completedSessions = bookingsInRange.filter((b: any) => 
      b.status === 'completed' || new Date(b.date) < now
    ).length;

    const activeStudents = new Set(bookingsInRange.map((b: any) => b.studentId)).size;
    const activePsychologists = platformData.psychologists.filter((p: any) => 
      p.status === 'active' || p.status === 'approved'
    ).length;

    return {
      totalBookings: bookingsInRange.length,
      bookingsChange: bookingsPrevRange.length > 0 
        ? ((bookingsInRange.length - bookingsPrevRange.length) / bookingsPrevRange.length) * 100
        : 0,
      totalRevenue,
      revenueChange: prevRevenue > 0 
        ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
        : 0,
      activeStudents,
      activePsychologists,
      completedSessions,
      avgRating,
      totalFeedback: feedbackInRange.length
    };
  }, [platformData, dateRange]);

  // Session statistics
  const sessionStats = useMemo(() => {
    const completed = platformData.bookings.filter((b: any) => 
      b.status === 'completed' || new Date(b.date) < new Date()
    );
    const cancelled = platformData.bookings.filter((b: any) => b.status === 'cancelled');
    const upcoming = platformData.bookings.filter((b: any) => 
      new Date(b.date) >= new Date() && b.status !== 'cancelled'
    );

    const sessionTypes = platformData.bookings.reduce((acc: any, b: any) => {
      acc[b.sessionType] = (acc[b.sessionType] || 0) + 1;
      return acc;
    }, {});

    return {
      completed: completed.length,
      cancelled: cancelled.length,
      upcoming: upcoming.length,
      completionRate: platformData.bookings.length > 0 
        ? (completed.length / platformData.bookings.length) * 100
        : 0,
      cancellationRate: platformData.bookings.length > 0
        ? (cancelled.length / platformData.bookings.length) * 100
        : 0,
      sessionTypes
    };
  }, [platformData]);

  // Quality metrics
  const qualityMetrics = useMemo(() => {
    if (platformData.feedback.length === 0) {
      return {
        avgOverallRating: 0,
        avgHelpfulness: 0,
        avgProgress: 0,
        avgComfort: 0,
        recommendationRate: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const distribution = platformData.feedback.reduce((acc: any, f: any) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    const withRecommendation = platformData.feedback.filter((f: any) => 
      f.wouldRecommend !== null && f.wouldRecommend !== undefined
    );

    return {
      avgOverallRating: platformData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / platformData.feedback.length,
      avgHelpfulness: platformData.feedback.reduce((sum: number, f: any) => sum + (f.helpfulness || 0), 0) / platformData.feedback.length,
      avgProgress: platformData.feedback.reduce((sum: number, f: any) => sum + (f.progress || 0), 0) / platformData.feedback.length,
      avgComfort: platformData.feedback.reduce((sum: number, f: any) => sum + (f.comfort || 0), 0) / platformData.feedback.length,
      recommendationRate: withRecommendation.length > 0
        ? (withRecommendation.filter((f: any) => f.wouldRecommend).length / withRecommendation.length) * 100
        : 0,
      distribution
    };
  }, [platformData]);

  // Top psychologists
  const topPsychologists = useMemo(() => {
    const psychologistStats = platformData.psychologists.map((p: any) => {
      const sessions = platformData.bookings.filter((b: any) => b.psychologistId === p.id);
      const psychFeedback = platformData.feedback.filter((f: any) => {
        const booking = platformData.bookings.find((b: any) => b.id === f.appointmentId);
        return booking?.psychologistId === p.id;
      });

      const avgRating = psychFeedback.length > 0
        ? psychFeedback.reduce((sum: number, f: any) => sum + f.rating, 0) / psychFeedback.length
        : 0;

      return {
        ...p,
        totalSessions: sessions.length,
        avgRating,
        feedbackCount: psychFeedback.length
      };
    });

    return psychologistStats
      .sort((a, b) => b.totalSessions - a.totalSessions)
      .slice(0, 5);
  }, [platformData]);

  const exportReport = () => {
    const report = `
CEREBROLEAN PLATFORM ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
Date Range: Last ${dateRange}

========================================
KEY PERFORMANCE INDICATORS
========================================
Total Bookings: ${kpis.totalBookings} (${kpis.bookingsChange >= 0 ? '+' : ''}${kpis.bookingsChange.toFixed(1)}%)
Total Revenue: $${kpis.totalRevenue.toLocaleString()} (${kpis.revenueChange >= 0 ? '+' : ''}${kpis.revenueChange.toFixed(1)}%)
Active Students: ${kpis.activeStudents}
Active Psychologists: ${kpis.activePsychologists}
Completed Sessions: ${kpis.completedSessions}
Average Rating: ${kpis.avgRating.toFixed(2)}/5.0

========================================
SESSION STATISTICS
========================================
Completed: ${sessionStats.completed}
Cancelled: ${sessionStats.cancelled}
Upcoming: ${sessionStats.upcoming}
Completion Rate: ${sessionStats.completionRate.toFixed(1)}%
Cancellation Rate: ${sessionStats.cancellationRate.toFixed(1)}%

Session Types:
${Object.entries(sessionStats.sessionTypes).map(([type, count]) => `  ${type}: ${count}`).join('\n')}

========================================
QUALITY METRICS
========================================
Overall Rating: ${qualityMetrics.avgOverallRating.toFixed(2)}/5.0
Helpfulness: ${qualityMetrics.avgHelpfulness.toFixed(2)}/5.0
Progress: ${qualityMetrics.avgProgress.toFixed(2)}/5.0
Comfort: ${qualityMetrics.avgComfort.toFixed(2)}/5.0
Recommendation Rate: ${qualityMetrics.recommendationRate.toFixed(1)}%

Rating Distribution:
${Object.entries(qualityMetrics.distribution).reverse().map(([rating, count]) => 
  `  ${rating} stars: ${count} (${((count as number / platformData.feedback.length) * 100).toFixed(1)}%)`
).join('\n')}

========================================
TOP PSYCHOLOGISTS
========================================
${topPsychologists.map((p, i) => `
${i + 1}. ${p.name}
   Sessions: ${p.totalSessions}
   Avg Rating: ${p.avgRating.toFixed(2)}/5.0
   Specialties: ${p.specialties?.join(', ') || 'N/A'}
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analytics report exported!');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate('admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Portal
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive metrics and insights across the therapy platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                  </Button>
                ))}
              </div>
              <Button onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-primary opacity-20" />
                {kpis.bookingsChange >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
              <p className="text-2xl font-bold mb-1">{kpis.totalBookings}</p>
              <p className={`text-sm ${kpis.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpis.bookingsChange >= 0 ? '+' : ''}{kpis.bookingsChange.toFixed(1)}% vs previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-green-600 opacity-20" />
                {kpis.revenueChange >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold mb-1">${kpis.totalRevenue.toLocaleString()}</p>
              <p className={`text-sm ${kpis.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpis.revenueChange >= 0 ? '+' : ''}{kpis.revenueChange.toFixed(1)}% vs previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Students</p>
              <p className="text-2xl font-bold mb-1">{kpis.activeStudents}</p>
              <p className="text-sm text-muted-foreground">
                {kpis.activePsychologists} active psychologists
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-yellow-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
              <p className="text-2xl font-bold mb-1">{kpis.avgRating.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Based on {kpis.totalFeedback} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="psychologists">Psychologists</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">{sessionStats.completed}</p>
                  <p className="text-sm text-muted-foreground">
                    {sessionStats.completionRate.toFixed(1)}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Cancelled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">{sessionStats.cancelled}</p>
                  <p className="text-sm text-muted-foreground">
                    {sessionStats.cancellationRate.toFixed(1)}% cancellation rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">{sessionStats.upcoming}</p>
                  <p className="text-sm text-muted-foreground">
                    Scheduled sessions
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Session Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(sessionStats.sessionTypes).map(([type, count]) => {
                    const percentage = (count as number / platformData.bookings.length) * 100;
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{type}</span>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Overall Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{qualityMetrics.avgOverallRating.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">out of 5.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Helpfulness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{qualityMetrics.avgHelpfulness.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">out of 5.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{qualityMetrics.avgProgress.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">out of 5.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Comfort</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{qualityMetrics.avgComfort.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">out of 5.0</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Breakdown of all session ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(qualityMetrics.distribution).reverse().map(([rating, count]) => {
                    const total = platformData.feedback.length || 1;
                    const percentage = ((count as number) / total) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-16">{rating} stars</span>
                        <div className="flex-1 bg-muted rounded-full h-6 relative">
                          <div
                            className={`h-6 rounded-full transition-all ${
                              parseInt(rating) >= 4 ? 'bg-green-500' :
                              parseInt(rating) === 3 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%`, minWidth: percentage > 0 ? '30px' : '0' }}
                          >
                            {percentage > 0 && (
                              <span className="absolute left-2 top-1 text-xs font-semibold text-white">
                                {count}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-5xl font-bold mb-2">{qualityMetrics.recommendationRate.toFixed(1)}%</p>
                  <p className="text-muted-foreground">
                    of clients would recommend our therapists to others
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Psychologists Tab */}
          <TabsContent value="psychologists" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Psychologists</CardTitle>
                <CardDescription>Ranked by total sessions completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPsychologists.map((psychologist, index) => (
                    <div key={psychologist.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{psychologist.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {psychologist.specialties?.join(', ') || 'General Practice'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Sessions</p>
                        <p className="text-2xl font-bold">{psychologist.totalSessions}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-2xl font-bold">
                          {psychologist.avgRating > 0 ? psychologist.avgRating.toFixed(1) : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Reviews</p>
                        <p className="text-lg font-semibold">{psychologist.feedbackCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Psychologist Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['active', 'pending', 'suspended'].map((status) => {
                      const count = platformData.psychologists.filter((p: any) => 
                        p.status === status || (status === 'active' && p.status === 'approved')
                      ).length;
                      const percentage = (count / platformData.psychologists.length) * 100;
                      
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium capitalize">{status}</span>
                            <span className="text-sm text-muted-foreground">
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status === 'active' ? 'bg-green-500' :
                                status === 'pending' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Capacity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Psychologists</p>
                    <p className="text-2xl font-bold">{platformData.psychologists.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Sessions per Psychologist</p>
                    <p className="text-2xl font-bold">
                      {platformData.psychologists.length > 0 
                        ? (platformData.bookings.length / platformData.psychologists.length).toFixed(1)
                        : 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">
                    ${kpis.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last {dateRange}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">
                    ${platformData.payments.length > 0 
                      ? (platformData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0) / platformData.payments.length).toFixed(0)
                      : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Per session
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">
                    {platformData.payments.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completed payments
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Platform Revenue (20%)</span>
                  <span className="text-2xl font-bold">
                    ${(kpis.totalRevenue * 0.2).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Psychologist Earnings (80%)</span>
                  <span className="text-2xl font-bold">
                    ${(kpis.totalRevenue * 0.8).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}