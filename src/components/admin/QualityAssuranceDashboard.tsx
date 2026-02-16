"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Users,
  Star,
  MessageSquare,
  Activity,
  Flag,
  ArrowLeft,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QualityAssuranceDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function QualityAssuranceDashboard({ onNavigate }: QualityAssuranceDashboardProps) {
  const [selectedPsychologist, setSelectedPsychologist] = useState<string | null>(null);

  // Load quality data
  const qualityData = useMemo(() => {
    const psychologists = JSON.parse(localStorage.getItem('psychologists') || '[]');
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    const sessionNotes = JSON.parse(localStorage.getItem('session_notes') || '[]');
    const feedback = JSON.parse(localStorage.getItem('session_feedback') || '[]');

    return { psychologists, bookings, sessionNotes, feedback };
  }, []);

  // Quality metrics
  const metrics = useMemo(() => {
    const lowRatedSessions = qualityData.feedback.filter((f: any) => f.rating <= 2);
    const highRatedSessions = qualityData.feedback.filter((f: any) => f.rating >= 4);
    const incompleteSessions = qualityData.bookings.filter((b: any) => {
      const sessionDate = new Date(b.date);
      const now = new Date();
      return sessionDate < now && b.status !== 'completed' && b.status !== 'cancelled';
    });
    const missingSoapNotes = qualityData.bookings.filter((b: any) => {
      const sessionDate = new Date(b.date);
      const now = new Date();
      const isCompleted = sessionDate < now;
      const hasNotes = qualityData.sessionNotes.some((n: any) => n.bookingId === b.id);
      return isCompleted && !hasNotes && b.status !== 'cancelled';
    });

    // Psychologist-specific metrics
    const psychologistMetrics = qualityData.psychologists.map((p: any) => {
      const sessions = qualityData.bookings.filter((b: any) => b.psychologistId === p.id);
      const psychFeedback = qualityData.feedback.filter((f: any) => {
        const booking = qualityData.bookings.find((b: any) => b.id === f.appointmentId);
        return booking?.psychologistId === p.id;
      });
      const psychNotes = qualityData.sessionNotes.filter((n: any) => n.psychologistId === p.id);

      const completedSessions = sessions.filter((s: any) => {
        const sessionDate = new Date(s.date);
        return sessionDate < new Date() && s.status !== 'cancelled';
      });

      const avgRating = psychFeedback.length > 0
        ? psychFeedback.reduce((sum: number, f: any) => sum + f.rating, 0) / psychFeedback.length
        : 0;

      const notesCompletionRate = completedSessions.length > 0
        ? (psychNotes.length / completedSessions.length) * 100
        : 0;

      const cancellationRate = sessions.length > 0
        ? (sessions.filter((s: any) => s.status === 'cancelled').length / sessions.length) * 100
        : 0;

      // Quality flags
      const flags = [];
      if (avgRating > 0 && avgRating < 3.5) flags.push('Low Ratings');
      if (notesCompletionRate < 80) flags.push('Missing Notes');
      if (cancellationRate > 20) flags.push('High Cancellations');
      if (psychFeedback.some((f: any) => f.rating <= 2)) flags.push('Recent Low Rating');

      return {
        ...p,
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        avgRating,
        feedbackCount: psychFeedback.length,
        notesCount: psychNotes.length,
        notesCompletionRate,
        cancellationRate,
        flags
      };
    });

    // Identify at-risk psychologists
    const atRisk = psychologistMetrics.filter(p => p.flags.length > 0);

    return {
      lowRatedSessions,
      highRatedSessions,
      incompleteSessions,
      missingSoapNotes,
      psychologistMetrics,
      atRisk,
      avgPlatformRating: qualityData.feedback.length > 0
        ? qualityData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / qualityData.feedback.length
        : 0,
      notesCompletionRate: qualityData.bookings.filter((b: any) => {
        const sessionDate = new Date(b.date);
        return sessionDate < new Date() && b.status !== 'cancelled';
      }).length > 0
        ? (qualityData.sessionNotes.length / qualityData.bookings.filter((b: any) => {
            const sessionDate = new Date(b.date);
            return sessionDate < new Date() && b.status !== 'cancelled';
          }).length) * 100
        : 0
    };
  }, [qualityData]);

  const exportQAReport = () => {
    const report = `
CEREBROLEARN QUALITY ASSURANCE REPORT
Generated: ${new Date().toLocaleString()}

========================================
QUALITY OVERVIEW
========================================
Platform Average Rating: ${metrics.avgPlatformRating.toFixed(2)}/5.0
Total Feedback Submissions: ${qualityData.feedback.length}
High-Rated Sessions (4-5 stars): ${metrics.highRatedSessions.length}
Low-Rated Sessions (1-2 stars): ${metrics.lowRatedSessions.length}
Notes Completion Rate: ${metrics.notesCompletionRate.toFixed(1)}%

========================================
ISSUES REQUIRING ATTENTION
========================================
Missing SOAP Notes: ${metrics.missingSoapNotes.length} sessions
Incomplete Sessions: ${metrics.incompleteSessions.length}
At-Risk Psychologists: ${metrics.atRisk.length}

========================================
AT-RISK PSYCHOLOGISTS
========================================
${metrics.atRisk.map((p: any) => `
${p.name}
  Average Rating: ${p.avgRating.toFixed(2)}/5.0
  Notes Completion: ${p.notesCompletionRate.toFixed(1)}%
  Cancellation Rate: ${p.cancellationRate.toFixed(1)}%
  Quality Flags: ${p.flags.join(', ')}
`).join('\n')}

========================================
PSYCHOLOGIST QUALITY METRICS
========================================
${metrics.psychologistMetrics
  .sort((a: any, b: any) => b.avgRating - a.avgRating)
  .map((p: any) => `
${p.name}
  Sessions: ${p.totalSessions} (${p.completedSessions} completed)
  Avg Rating: ${p.avgRating > 0 ? p.avgRating.toFixed(2) : 'N/A'}/5.0
  Feedback: ${p.feedbackCount} reviews
  Notes Completion: ${p.notesCompletionRate.toFixed(1)}%
  Cancellation Rate: ${p.cancellationRate.toFixed(1)}%
  ${p.flags.length > 0 ? `⚠️ FLAGS: ${p.flags.join(', ')}` : '✅ No quality concerns'}
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-assurance-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('QA report exported!');
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
              <h1 className="text-4xl font-bold mb-2">Quality Assurance</h1>
              <p className="text-muted-foreground">
                Monitor service quality and identify areas for improvement
              </p>
            </div>
            <Button onClick={exportQAReport}>
              <Download className="h-4 w-4 mr-2" />
              Export QA Report
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        {metrics.atRisk.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{metrics.atRisk.length} psychologist(s)</strong> require quality review. 
              Please review the "At-Risk Providers" tab for details.
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="h-8 w-8 text-yellow-600 opacity-20" />
                {metrics.avgPlatformRating >= 4 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Platform Rating</p>
              <p className="text-2xl font-bold mb-1">{metrics.avgPlatformRating.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="h-8 w-8 text-blue-600 opacity-20" />
                {metrics.notesCompletionRate >= 90 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Notes Completion</p>
              <p className="text-2xl font-bold mb-1">{metrics.notesCompletionRate.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">
                {metrics.missingSoapNotes.length} missing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Low-Rated Sessions</p>
              <p className="text-2xl font-bold mb-1">{metrics.lowRatedSessions.length}</p>
              <p className="text-sm text-muted-foreground">
                Requires review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Flag className="h-8 w-8 text-orange-600 opacity-20" />
                {metrics.atRisk.length === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">At-Risk Providers</p>
              <p className="text-2xl font-bold mb-1">{metrics.atRisk.length}</p>
              <p className="text-sm text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="at-risk">At-Risk Providers</TabsTrigger>
            <TabsTrigger value="psychologists">All Psychologists</TabsTrigger>
            <TabsTrigger value="sessions">Session Issues</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = qualityData.feedback.filter((f: any) => f.rating === rating).length;
                      const percentage = qualityData.feedback.length > 0 
                        ? (count / qualityData.feedback.length) * 100 
                        : 0;
                      
                      return (
                        <div key={rating}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{rating} stars</span>
                            <span className="text-sm text-muted-foreground">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                rating >= 4 ? 'bg-green-500' :
                                rating === 3 ? 'bg-yellow-500' :
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
                  <CardTitle>Documentation Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Complete Notes</p>
                        <p className="text-sm text-muted-foreground">SOAP documentation</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{qualityData.sessionNotes.length}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">Missing Notes</p>
                        <p className="text-sm text-muted-foreground">Requires follow-up</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{metrics.missingSoapNotes.length}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Completion Rate</p>
                        <p className="text-sm text-muted-foreground">Overall compliance</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{metrics.notesCompletionRate.toFixed(0)}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
                <CardDescription>Performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">High Quality</p>
                    <p className="text-2xl font-bold">{metrics.highRatedSessions.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">4-5 star sessions</p>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Activity className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Medium Quality</p>
                    <p className="text-2xl font-bold">
                      {qualityData.feedback.filter((f: any) => f.rating === 3).length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3 star sessions</p>
                  </div>

                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Low Quality</p>
                    <p className="text-2xl font-bold">{metrics.lowRatedSessions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* At-Risk Tab */}
          <TabsContent value="at-risk" className="space-y-4">
            {metrics.atRisk.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    No psychologists require quality review at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              metrics.atRisk.map((psychologist: any) => (
                <Card key={psychologist.id} className="border-2 border-red-200 dark:border-red-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          {psychologist.name}
                        </CardTitle>
                        <CardDescription>
                          {psychologist.specialties?.join(', ') || 'General Practice'}
                        </CardDescription>
                      </div>
                      <Button size="sm" onClick={() => onNavigate('admin-psychologist-management')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                        <p className="text-2xl font-bold">
                          {psychologist.avgRating > 0 ? psychologist.avgRating.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Notes Completion</p>
                        <p className="text-2xl font-bold">{psychologist.notesCompletionRate.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cancellation Rate</p>
                        <p className="text-2xl font-bold">{psychologist.cancellationRate.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Sessions</p>
                        <p className="text-2xl font-bold">{psychologist.totalSessions}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Quality Flags:</p>
                      <div className="flex flex-wrap gap-2">
                        {psychologist.flags.map((flag: string) => (
                          <Badge key={flag} variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* All Psychologists Tab */}
          <TabsContent value="psychologists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Psychologist Quality Metrics</CardTitle>
                <CardDescription>Comprehensive performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.psychologistMetrics
                    .sort((a: any, b: any) => b.avgRating - a.avgRating)
                    .map((psychologist: any) => (
                      <div key={psychologist.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{psychologist.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {psychologist.specialties?.join(', ') || 'General Practice'}
                            </p>
                          </div>
                          {psychologist.flags.length > 0 ? (
                            <Badge variant="destructive">
                              {psychologist.flags.length} flag{psychologist.flags.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Good Standing
                            </Badge>
                          )}
                        </div>

                        <div className="grid md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Sessions</p>
                            <p className="font-semibold">{psychologist.completedSessions}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Avg Rating</p>
                            <p className="font-semibold">
                              {psychologist.avgRating > 0 ? psychologist.avgRating.toFixed(2) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Reviews</p>
                            <p className="font-semibold">{psychologist.feedbackCount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Notes %</p>
                            <p className="font-semibold">{psychologist.notesCompletionRate.toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Cancel %</p>
                            <p className="font-semibold">{psychologist.cancellationRate.toFixed(0)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Issues Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Low-Rated Sessions</CardTitle>
                <CardDescription>Sessions rated 2 stars or below</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.lowRatedSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No low-rated sessions to review
                  </p>
                ) : (
                  <div className="space-y-3">
                    {metrics.lowRatedSessions.map((feedback: any) => {
                      const booking = qualityData.bookings.find((b: any) => b.id === feedback.appointmentId);
                      const psychologist = qualityData.psychologists.find((p: any) => p.id === booking?.psychologistId);
                      
                      return (
                        <div key={feedback.id} className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{psychologist?.name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking ? new Date(booking.date).toLocaleDateString() : 'Date unknown'}
                              </p>
                            </div>
                            <Badge variant="destructive">
                              {feedback.rating} / 5
                            </Badge>
                          </div>
                          {feedback.improvements && (
                            <div className="mt-3 p-3 bg-muted/50 rounded">
                              <p className="text-sm font-semibold mb-1">Feedback:</p>
                              <p className="text-sm">{feedback.improvements}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Missing SOAP Notes</CardTitle>
                <CardDescription>Completed sessions without documentation</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.missingSoapNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All sessions have proper documentation
                  </p>
                ) : (
                  <div className="space-y-3">
                    {metrics.missingSoapNotes.slice(0, 10).map((booking: any) => {
                      const psychologist = qualityData.psychologists.find((p: any) => p.id === booking.psychologistId);
                      
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">{psychologist?.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.date).toLocaleDateString()} - {booking.sessionType}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-yellow-600">
                            <Clock className="h-3 w-3 mr-1" />
                            Notes Due
                          </Badge>
                        </div>
                      );
                    })}
                    {metrics.missingSoapNotes.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        +{metrics.missingSoapNotes.length - 10} more sessions
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}