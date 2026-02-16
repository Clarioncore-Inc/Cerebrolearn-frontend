import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  BarChart3,
  Award,
  Clock,
  Activity
} from 'lucide-react';

export function PsychologistAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalPsychologists: 0,
    averageRating: 0,
    completionRate: 0,
    growthRate: 0,
  });
  const [topPsychologists, setTopPsychologists] = useState<any[]>([]);
  const [sessionTypeDistribution, setSessionTypeDistribution] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    // Load all data
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const allPsychologists = JSON.parse(localStorage.getItem('psychologist_profiles') || '[]');

    // Calculate total revenue
    const completedPayments = allPayments.filter((p: any) => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

    // Calculate average rating
    const ratedPsychologists = allPsychologists.filter((p: any) => p.reviewCount > 0);
    const averageRating = ratedPsychologists.length > 0
      ? ratedPsychologists.reduce((sum: number, p: any) => sum + p.rating, 0) / ratedPsychologists.length
      : 0;

    // Calculate completion rate
    const completedBookings = allBookings.filter((b: any) => b.status === 'completed').length;
    const completionRate = allBookings.length > 0
      ? (completedBookings / allBookings.length) * 100
      : 0;

    // Calculate growth rate (compare this month to last month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthBookings = allBookings.filter((b: any) => 
      new Date(b.createdAt) >= startOfMonth
    ).length;

    const lastMonthBookings = allBookings.filter((b: any) => {
      const date = new Date(b.createdAt);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    }).length;

    const growthRate = lastMonthBookings > 0
      ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100
      : 0;

    setAnalytics({
      totalRevenue,
      totalBookings: allBookings.length,
      totalPsychologists: allPsychologists.length,
      averageRating,
      completionRate,
      growthRate,
    });

    // Calculate top psychologists by revenue
    const psychologistEarnings: { [key: string]: { psychologist: any; earnings: number; sessions: number } } = {};

    allPsychologists.forEach((psych: any) => {
      const psychBookings = allBookings.filter((b: any) => b.psychologistEmail === psych.email);
      const psychPayments = completedPayments.filter((p: any) =>
        psychBookings.some((b: any) => b.id === p.bookingId)
      );
      const earnings = psychPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const sessions = psychBookings.filter((b: any) => b.status === 'completed').length;

      psychologistEarnings[psych.email] = {
        psychologist: psych,
        earnings,
        sessions,
      };
    });

    const topPsychs = Object.values(psychologistEarnings)
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);
    setTopPsychologists(topPsychs);

    // Calculate session type distribution
    const sessionTypes: { [key: string]: number } = {};
    allBookings.forEach((b: any) => {
      if (b.sessionType) {
        sessionTypes[b.sessionType] = (sessionTypes[b.sessionType] || 0) + 1;
      }
    });

    const distribution = Object.entries(sessionTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    setSessionTypeDistribution(distribution);

    // Calculate monthly trends (last 6 months)
    const monthlyData: { [key: string]: { bookings: number; revenue: number } } = {};
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      last6Months.push(monthStr);
      monthlyData[monthStr] = { bookings: 0, revenue: 0 };
    }

    allBookings.forEach((b: any) => {
      const monthStr = new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (monthlyData[monthStr]) {
        monthlyData[monthStr].bookings++;
      }
    });

    completedPayments.forEach((p: any) => {
      const monthStr = new Date(p.transactionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (monthlyData[monthStr]) {
        monthlyData[monthStr].revenue += p.amount;
      }
    });

    const trends = last6Months.map(month => ({
      month,
      ...monthlyData[month],
    }));
    setMonthlyTrends(trends);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics & Insights</h2>
        <p className="text-muted-foreground">
          System-wide performance metrics and trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Psychologists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPsychologists}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analytics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.growthRate > 0 ? '+' : ''}{analytics.growthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Month over month</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      {monthlyTrends.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Bookings
              </CardTitle>
              <CardDescription>Last 6 months booking trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyTrends.map((data: any, index: number) => {
                  const maxBookings = Math.max(...monthlyTrends.map((d: any) => d.bookings), 1);
                  const percentage = (data.bookings / maxBookings) * 100;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{data.month}</span>
                        <span className="font-semibold">{data.bookings} bookings</span>
                      </div>
                      <div className="h-8 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-end px-3"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-xs text-white font-medium">
                              {data.bookings}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Monthly Revenue
              </CardTitle>
              <CardDescription>Last 6 months revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyTrends.map((data: any, index: number) => {
                  const maxRevenue = Math.max(...monthlyTrends.map((d: any) => d.revenue), 1);
                  const percentage = (data.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{data.month}</span>
                        <span className="font-semibold">${data.revenue.toFixed(2)}</span>
                      </div>
                      <div className="h-8 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-end px-3"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-xs text-white font-medium">
                              ${data.revenue.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Psychologists */}
      {topPsychologists.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Psychologists
            </CardTitle>
            <CardDescription>Ranked by total earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPsychologists.map((item: any, index: number) => {
                const psych = item.psychologist;
                
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold text-primary">
                      #{index + 1}
                    </div>

                    <Avatar className="h-12 w-12">
                      <AvatarImage src={psych.avatar} />
                      <AvatarFallback>
                        {psych.fullName?.charAt(0).toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{psych.fullName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {psych.specialization}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        ${item.earnings.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          {psych.rating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {item.sessions} sessions
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Type Distribution */}
      {sessionTypeDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Session Type Distribution
            </CardTitle>
            <CardDescription>Popular consultation types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionTypeDistribution.map((item: any, index: number) => {
                const total = sessionTypeDistribution.reduce((sum, i) => sum + i.count, 0);
                const percentage = (item.count / total) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span className="font-semibold">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end px-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-xs text-white font-medium">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {analytics.completionRate.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {analytics.totalBookings > 0 
                  ? (analytics.totalRevenue / analytics.totalBookings).toFixed(2)
                  : '0.00'
                }
              </div>
              <p className="text-sm text-muted-foreground">Avg Booking Value</p>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {analytics.totalPsychologists > 0
                  ? (analytics.totalBookings / analytics.totalPsychologists).toFixed(1)
                  : '0.0'
                }
              </div>
              <p className="text-sm text-muted-foreground">Bookings per Psychologist</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}