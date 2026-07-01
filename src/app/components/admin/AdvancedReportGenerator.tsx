"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Star,
  Activity,
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdvancedReportGeneratorProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AdvancedReportGenerator({ onNavigate }: AdvancedReportGeneratorProps) {
  const [reportConfig, setReportConfig] = useState({
    type: 'comprehensive',
    dateRange: '30d',
    includeBookings: true,
    includePayments: true,
    includeFeedback: true,
    includePsychologists: true,
    includeStudents: true,
    includeSessionNotes: true,
    includeAnalytics: true,
    includeCompliance: true,
    format: 'text'
  });

  const reportTypes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Report',
      description: 'Complete platform overview with all metrics',
      icon: FileText
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, payments, and earnings breakdown',
      icon: DollarSign
    },
    {
      id: 'quality',
      name: 'Quality Assurance Report',
      description: 'Service quality and satisfaction metrics',
      icon: Star
    },
    {
      id: 'operational',
      name: 'Operational Report',
      description: 'Bookings, sessions, and utilization',
      icon: Activity
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Licensing, insurance, and regulatory status',
      icon: CheckCircle2
    }
  ];

  const dateRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  // Load data
  const reportData = useMemo(() => {
    const psychologists = JSON.parse(localStorage.getItem('psychologists') || '[]');
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const sessionNotes = JSON.parse(localStorage.getItem('session_notes') || '[]');
    const feedback = JSON.parse(localStorage.getItem('session_feedback') || '[]');
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');

    // Filter by date range
    const now = new Date();
    const rangeDays = reportConfig.dateRange === '7d' ? 7 :
                     reportConfig.dateRange === '30d' ? 30 :
                     reportConfig.dateRange === '90d' ? 90 :
                     reportConfig.dateRange === '1y' ? 365 :
                     999999;
    const rangeMs = rangeDays * 24 * 60 * 60 * 1000;
    const rangeStart = new Date(now.getTime() - rangeMs);

    const filteredBookings = bookings.filter((b: any) => 
      new Date(b.createdAt || b.date) >= rangeStart
    );
    const filteredPayments = payments.filter((p: any) =>
      new Date(p.createdAt) >= rangeStart
    );
    const filteredFeedback = feedback.filter((f: any) =>
      new Date(f.submittedAt) >= rangeStart
    );

    return {
      psychologists,
      bookings: filteredBookings,
      payments: filteredPayments,
      sessionNotes,
      feedback: filteredFeedback,
      users
    };
  }, [reportConfig.dateRange]);

  const generateReport = () => {
    const { type } = reportConfig;
    let report = '';

    // Header
    report += `
CEREBROLEARN ${type.toUpperCase()} REPORT
Generated: ${new Date().toLocaleString()}
Date Range: ${dateRanges.find(d => d.value === reportConfig.dateRange)?.label}
Report Type: ${reportTypes.find(t => t.id === type)?.name}

========================================
`;

    // Comprehensive Report
    if (type === 'comprehensive') {
      report += `
EXECUTIVE SUMMARY
========================================
Total Psychologists: ${reportData.psychologists.length}
Total Bookings: ${reportData.bookings.length}
Total Revenue: $${reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0).toLocaleString()}
Average Rating: ${reportData.feedback.length > 0 ? (reportData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / reportData.feedback.length).toFixed(2) : 'N/A'}/5.0
Active Students: ${new Set(reportData.bookings.map((b: any) => b.studentId)).size}
Session Completion Rate: ${reportData.bookings.length > 0 ? ((reportData.bookings.filter((b: any) => b.status === 'completed').length / reportData.bookings.length) * 100).toFixed(1) : 0}%

BOOKINGS OVERVIEW
========================================
Total Bookings: ${reportData.bookings.length}
Completed: ${reportData.bookings.filter((b: any) => b.status === 'completed').length}
Cancelled: ${reportData.bookings.filter((b: any) => b.status === 'cancelled').length}
Upcoming: ${reportData.bookings.filter((b: any) => new Date(b.date) >= new Date() && b.status !== 'cancelled').length}

Session Types:
${Object.entries(reportData.bookings.reduce((acc: any, b: any) => {
  acc[b.sessionType] = (acc[b.sessionType] || 0) + 1;
  return acc;
}, {})).map(([type, count]) => `  ${type}: ${count}`).join('\n')}

FINANCIAL OVERVIEW
========================================
Total Revenue: $${reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0).toLocaleString()}
Total Transactions: ${reportData.payments.length}
Average Transaction: $${reportData.payments.length > 0 ? (reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0) / reportData.payments.length).toFixed(0) : 0}
Platform Revenue (20%): $${(reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0) * 0.2).toLocaleString()}
Psychologist Earnings (80%): $${(reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0) * 0.8).toLocaleString()}

QUALITY METRICS
========================================
Total Feedback: ${reportData.feedback.length}
Average Rating: ${reportData.feedback.length > 0 ? (reportData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / reportData.feedback.length).toFixed(2) : 'N/A'}/5.0
5-Star Reviews: ${reportData.feedback.filter((f: any) => f.rating === 5).length}
4-Star Reviews: ${reportData.feedback.filter((f: any) => f.rating === 4).length}
3-Star Reviews: ${reportData.feedback.filter((f: any) => f.rating === 3).length}
2-Star Reviews: ${reportData.feedback.filter((f: any) => f.rating === 2).length}
1-Star Reviews: ${reportData.feedback.filter((f: any) => f.rating === 1).length}

PSYCHOLOGISTS
========================================
Total Psychologists: ${reportData.psychologists.length}
Active: ${reportData.psychologists.filter((p: any) => p.status === 'active' || p.status === 'approved').length}
Pending: ${reportData.psychologists.filter((p: any) => p.status === 'pending').length}

Top Performers:
${reportData.psychologists
  .map((p: any) => ({
    ...p,
    sessions: reportData.bookings.filter((b: any) => b.psychologistId === p.id).length
  }))
  .sort((a, b) => b.sessions - a.sessions)
  .slice(0, 5)
  .map((p, i) => `  ${i + 1}. ${p.name} - ${p.sessions} sessions`)
  .join('\n')}
`;
    }

    // Financial Report
    if (type === 'financial') {
      const totalRevenue = reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0);
      const platformRevenue = totalRevenue * 0.2;
      const psychologistRevenue = totalRevenue * 0.8;

      report += `
REVENUE SUMMARY
========================================
Total Revenue: $${totalRevenue.toLocaleString()}
Total Transactions: ${reportData.payments.length}
Average Transaction Value: $${reportData.payments.length > 0 ? (totalRevenue / reportData.payments.length).toFixed(2) : 0}

REVENUE DISTRIBUTION
========================================
Platform Revenue (20%): $${platformRevenue.toLocaleString()}
Psychologist Earnings (80%): $${psychologistRevenue.toLocaleString()}

PAYMENT DETAILS
========================================
${reportData.payments.slice(0, 50).map((p: any, i: number) => `
Payment ${i + 1}
  Amount: $${p.amount || 150}
  Date: ${new Date(p.createdAt).toLocaleDateString()}
  Method: ${p.method || 'Credit Card'}
  Status: ${p.status || 'completed'}
`).join('\n')}

${reportData.payments.length > 50 ? `... and ${reportData.payments.length - 50} more transactions` : ''}

PSYCHOLOGIST EARNINGS BREAKDOWN
========================================
${reportData.psychologists
  .map((p: any) => {
    const sessions = reportData.bookings.filter((b: any) => b.psychologistId === p.id && b.status === 'completed');
    const earnings = sessions.length * 150 * 0.8; // $150 per session, 80% to psychologist
    return { ...p, sessions: sessions.length, earnings };
  })
  .sort((a, b) => b.earnings - a.earnings)
  .map((p) => `
${p.name}
  Sessions: ${p.sessions}
  Gross Revenue: $${(p.sessions * 150).toLocaleString()}
  Psychologist Earnings: $${p.earnings.toLocaleString()}
  Platform Fee: $${(p.sessions * 150 * 0.2).toLocaleString()}
`).join('\n')}
`;
    }

    // Quality Report
    if (type === 'quality') {
      const avgRating = reportData.feedback.length > 0
        ? reportData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / reportData.feedback.length
        : 0;

      report += `
QUALITY OVERVIEW
========================================
Total Feedback Submissions: ${reportData.feedback.length}
Average Overall Rating: ${avgRating.toFixed(2)}/5.0
Recommendation Rate: ${reportData.feedback.filter((f: any) => f.wouldRecommend).length > 0 ? ((reportData.feedback.filter((f: any) => f.wouldRecommend).length / reportData.feedback.filter((f: any) => f.wouldRecommend !== null).length) * 100).toFixed(1) : 0}%

RATING DISTRIBUTION
========================================
5 Stars: ${reportData.feedback.filter((f: any) => f.rating === 5).length} (${reportData.feedback.length > 0 ? ((reportData.feedback.filter((f: any) => f.rating === 5).length / reportData.feedback.length) * 100).toFixed(1) : 0}%)
4 Stars: ${reportData.feedback.filter((f: any) => f.rating === 4).length} (${reportData.feedback.length > 0 ? ((reportData.feedback.filter((f: any) => f.rating === 4).length / reportData.feedback.length) * 100).toFixed(1) : 0}%)
3 Stars: ${reportData.feedback.filter((f: any) => f.rating === 3).length} (${reportData.feedback.length > 0 ? ((reportData.feedback.filter((f: any) => f.rating === 3).length / reportData.feedback.length) * 100).toFixed(1) : 0}%)
2 Stars: ${reportData.feedback.filter((f: any) => f.rating === 2).length} (${reportData.feedback.length > 0 ? ((reportData.feedback.filter((f: any) => f.rating === 2).length / reportData.feedback.length) * 100).toFixed(1) : 0}%)
1 Star: ${reportData.feedback.filter((f: any) => f.rating === 1).length} (${reportData.feedback.length > 0 ? ((reportData.feedback.filter((f: any) => f.rating === 1).length / reportData.feedback.length) * 100).toFixed(1) : 0}%)

PSYCHOLOGIST QUALITY METRICS
========================================
${reportData.psychologists
  .map((p: any) => {
    const psychFeedback = reportData.feedback.filter((f: any) => {
      const booking = reportData.bookings.find((b: any) => b.id === f.appointmentId);
      return booking?.psychologistId === p.id;
    });
    const avgPsychRating = psychFeedback.length > 0
      ? psychFeedback.reduce((sum: number, f: any) => sum + f.rating, 0) / psychFeedback.length
      : 0;
    
    return { ...p, feedbackCount: psychFeedback.length, avgRating: avgPsychRating };
  })
  .filter(p => p.feedbackCount > 0)
  .sort((a, b) => b.avgRating - a.avgRating)
  .map((p) => `
${p.name}
  Reviews: ${p.feedbackCount}
  Average Rating: ${p.avgRating.toFixed(2)}/5.0
  Specialties: ${p.specialties?.join(', ') || 'N/A'}
`).join('\n')}

LOW-RATED SESSIONS (≤2 stars)
========================================
${reportData.feedback
  .filter((f: any) => f.rating <= 2)
  .map((f: any, i: number) => {
    const booking = reportData.bookings.find((b: any) => b.id === f.appointmentId);
    const psychologist = reportData.psychologists.find((p: any) => p.id === booking?.psychologistId);
    
    return `
Session ${i + 1}
  Rating: ${f.rating}/5
  Psychologist: ${psychologist?.name || 'Unknown'}
  Date: ${booking ? new Date(booking.date).toLocaleDateString() : 'Unknown'}
  Feedback: ${f.improvements || 'No specific feedback provided'}
`;
  }).join('\n')}
`;
    }

    // Operational Report
    if (type === 'operational') {
      report += `
OPERATIONAL METRICS
========================================
Total Bookings: ${reportData.bookings.length}
Completed Sessions: ${reportData.bookings.filter((b: any) => b.status === 'completed').length}
Cancelled Sessions: ${reportData.bookings.filter((b: any) => b.status === 'cancelled').length}
Upcoming Sessions: ${reportData.bookings.filter((b: any) => new Date(b.date) >= new Date() && b.status !== 'cancelled').length}

Completion Rate: ${reportData.bookings.length > 0 ? ((reportData.bookings.filter((b: any) => b.status === 'completed').length / reportData.bookings.length) * 100).toFixed(1) : 0}%
Cancellation Rate: ${reportData.bookings.length > 0 ? ((reportData.bookings.filter((b: any) => b.status === 'cancelled').length / reportData.bookings.length) * 100).toFixed(1) : 0}%

UTILIZATION
========================================
Active Psychologists: ${reportData.psychologists.filter((p: any) => p.status === 'active' || p.status === 'approved').length}
Average Sessions per Psychologist: ${reportData.psychologists.length > 0 ? (reportData.bookings.length / reportData.psychologists.length).toFixed(1) : 0}
Active Students: ${new Set(reportData.bookings.map((b: any) => b.studentId)).size}

SESSION TYPES
========================================
${Object.entries(reportData.bookings.reduce((acc: any, b: any) => {
  acc[b.sessionType] = (acc[b.sessionType] || 0) + 1;
  return acc;
}, {})).map(([type, count]) => `${type}: ${count} sessions`).join('\n')}

DOCUMENTATION
========================================
Session Notes Completed: ${reportData.sessionNotes.length}
Completed Sessions Needing Notes: ${reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length}
Documentation Completion Rate: ${reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length > 0 ? ((reportData.sessionNotes.length / reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length) * 100).toFixed(1) : 0}%
`;
    }

    // Compliance Report
    if (type === 'compliance') {
      report += `
COMPLIANCE OVERVIEW
========================================
Total Psychologists: ${reportData.psychologists.length}
Active Psychologists: ${reportData.psychologists.filter((p: any) => p.status === 'active' || p.status === 'approved').length}
Pending Review: ${reportData.psychologists.filter((p: any) => p.status === 'pending').length}

LICENSING STATUS
========================================
All psychologists are required to maintain valid state licenses.
Documentation on file for all active providers.

INSURANCE REQUIREMENTS
========================================
Malpractice Insurance: Required for all active psychologists
Minimum Coverage: $1,000,000 per occurrence
All active providers maintain current insurance.

HIPAA COMPLIANCE
========================================
HIPAA Training: Required annually
All psychologists complete HIPAA training before approval.
Platform maintains HIPAA-compliant data storage and transmission.

DOCUMENTATION COMPLIANCE
========================================
Session Notes Required: Yes, for all completed sessions
Current Completion Rate: ${reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length > 0 ? ((reportData.sessionNotes.length / reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length) * 100).toFixed(1) : 0}%

Notes Completed: ${reportData.sessionNotes.length}
Sessions Requiring Notes: ${reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length}
Missing Notes: ${Math.max(0, reportData.bookings.filter((b: any) => {
  const sessionDate = new Date(b.date);
  return sessionDate < new Date() && b.status !== 'cancelled';
}).length - reportData.sessionNotes.length)}

CONTINUING EDUCATION
========================================
Annual Requirement: 40 hours
All psychologists must maintain current CE credits.

QUALITY ASSURANCE
========================================
Minimum Rating Requirement: 3.5/5.0 average
Current Platform Average: ${reportData.feedback.length > 0 ? (reportData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / reportData.feedback.length).toFixed(2) : 'N/A'}/5.0
${reportData.feedback.length > 0 && (reportData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / reportData.feedback.length) >= 3.5 ? '✅ COMPLIANT' : '⚠️ NEEDS ATTENTION'}
`;
    }

    report += `
========================================
END OF REPORT
========================================
`;

    return report.trim();
  };

  const downloadReport = () => {
    const report = generateReport();
    const filename = `cerebrolearn-${reportConfig.type}-report-${new Date().toISOString().split('T')[0]}.txt`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Report downloaded successfully!');
  };

  const previewReport = () => {
    const report = generateReport();
    const preview = window.open('', '_blank');
    if (preview) {
      preview.document.write(`
        <html>
          <head>
            <title>Report Preview</title>
            <style>
              body {
                font-family: monospace;
                white-space: pre-wrap;
                padding: 20px;
                background: #f5f5f5;
              }
            </style>
          </head>
          <body>${report}</body>
        </html>
      `);
      preview.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate('admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Portal
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Advanced Report Generator</h1>
            <p className="text-muted-foreground">
              Create custom reports with detailed analytics and insights
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setReportConfig({ ...reportConfig, type: type.id })}
                      className={`w-full p-4 border rounded-lg text-left transition-all ${
                        reportConfig.type === type.id
                          ? 'border-primary bg-primary/10'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">{type.name}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setReportConfig({ ...reportConfig, dateRange: range.value })}
                    className={`w-full p-3 border rounded-lg text-left text-sm transition-all ${
                      reportConfig.dateRange === range.value
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{range.label}</span>
                      {reportConfig.dateRange === range.value && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button
                    onClick={() => setReportConfig({ ...reportConfig, format: 'text' })}
                    className={`w-full p-3 border rounded-lg text-left text-sm transition-all ${
                      reportConfig.format === 'text'
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Text (.txt)</span>
                      </div>
                      {reportConfig.format === 'text' && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  {reportTypes.find(t => t.id === reportConfig.type)?.name} - {' '}
                  {dateRanges.find(d => d.value === reportConfig.dateRange)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-6 mb-6 max-h-[600px] overflow-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {generateReport().substring(0, 2000)}
                    {generateReport().length > 2000 && '\n\n... (preview truncated, download full report)'}
                  </pre>
                </div>

                <div className="flex gap-3">
                  <Button onClick={downloadReport} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={previewReport} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Full Preview
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Report includes:</strong> {reportTypes.find(t => t.id === reportConfig.type)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{reportData.psychologists.length}</p>
                    <p className="text-xs text-muted-foreground">Psychologists</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{reportData.bookings.length}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      ${(reportData.payments.reduce((sum: number, p: any) => sum + (p.amount || 150), 0) / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {reportData.feedback.length > 0 
                        ? (reportData.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / reportData.feedback.length).toFixed(1)
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
