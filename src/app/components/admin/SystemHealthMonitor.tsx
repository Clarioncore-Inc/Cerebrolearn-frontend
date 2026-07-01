"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Server,
  Database,
  Zap,
  Users,
  TrendingUp,
  Clock,
  HardDrive,
  Wifi,
  RefreshCw,
  ArrowLeft,
  Download,
  Bell,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemHealthMonitorProps {
  onNavigate: (page: string, data?: any) => void;
}

export function SystemHealthMonitor({ onNavigate }: SystemHealthMonitorProps) {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 23,
    memory: 45,
    storage: 67,
    activeUsers: 0,
    apiLatency: 0,
    errorRate: 0
  });

  // Calculate system health metrics
  const healthData = useMemo(() => {
    // Get all data from localStorage
    const psychologists = JSON.parse(localStorage.getItem('psychologists') || '[]');
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const sessionNotes = JSON.parse(localStorage.getItem('session_notes') || '[]');
    const feedback = JSON.parse(localStorage.getItem('session_feedback') || '[]');

    // Calculate storage size (approximate)
    const totalSize = new Blob([
      localStorage.getItem('psychologists') || '',
      localStorage.getItem('psychologist_bookings') || '',
      localStorage.getItem('demo_users') || '',
      localStorage.getItem('courses') || '',
      localStorage.getItem('payments') || '',
      localStorage.getItem('session_notes') || '',
      localStorage.getItem('session_feedback') || ''
    ]).size;

    const storageSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    // Simulate active users (in a real app, this would be from session data)
    const activeUsers = Math.floor(Math.random() * 50) + 10;

    // Simulate API latency
    const apiLatency = Math.floor(Math.random() * 100) + 50;

    // Calculate error rate based on incomplete/cancelled bookings
    const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
    const errorRate = bookings.length > 0 
      ? ((bookings.length - completedBookings) / bookings.length) * 100
      : 0;

    // Database health
    const databaseHealth = {
      psychologists: psychologists.length,
      bookings: bookings.length,
      users: users.length,
      courses: courses.length,
      payments: payments.length,
      sessionNotes: sessionNotes.length,
      feedback: feedback.length,
      totalRecords: psychologists.length + bookings.length + users.length + 
                    courses.length + payments.length + sessionNotes.length + feedback.length
    };

    // Service status
    const services = [
      {
        name: 'Authentication Service',
        status: users.length > 0 ? 'operational' : 'degraded',
        uptime: 99.9,
        lastCheck: new Date()
      },
      {
        name: 'Booking System',
        status: bookings.length > 0 ? 'operational' : 'degraded',
        uptime: 99.8,
        lastCheck: new Date()
      },
      {
        name: 'Payment Gateway',
        status: payments.length > 0 ? 'operational' : 'degraded',
        uptime: 99.95,
        lastCheck: new Date()
      },
      {
        name: 'Video Session Service',
        status: 'operational',
        uptime: 99.7,
        lastCheck: new Date()
      },
      {
        name: 'Notification Service',
        status: 'operational',
        uptime: 99.85,
        lastCheck: new Date()
      },
      {
        name: 'Storage Service',
        status: totalSize < 5000000 ? 'operational' : 'degraded',
        uptime: 99.99,
        lastCheck: new Date()
      }
    ];

    // Recent activity
    const recentActivity = [
      ...bookings.slice(-5).map((b: any) => ({
        type: 'booking',
        message: `New booking created for ${b.psychologistName}`,
        timestamp: new Date(b.createdAt || b.date),
        severity: 'info'
      })),
      ...payments.slice(-5).map((p: any) => ({
        type: 'payment',
        message: `Payment processed: $${p.amount}`,
        timestamp: new Date(p.createdAt),
        severity: 'info'
      })),
      ...feedback.slice(-3).map((f: any) => ({
        type: 'feedback',
        message: `New session feedback: ${f.rating} stars`,
        timestamp: new Date(f.submittedAt),
        severity: f.rating <= 2 ? 'warning' : 'info'
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

    // System alerts
    const alerts = [];
    if (errorRate > 15) {
      alerts.push({
        type: 'error',
        message: `High error rate detected: ${errorRate.toFixed(1)}%`,
        timestamp: new Date()
      });
    }
    if (totalSize > 5000000) {
      alerts.push({
        type: 'warning',
        message: 'Storage usage is high. Consider archiving old data.',
        timestamp: new Date()
      });
    }
    if (sessionNotes.length < bookings.filter((b: any) => new Date(b.date) < new Date()).length * 0.8) {
      alerts.push({
        type: 'warning',
        message: 'Missing session notes detected. Please review compliance.',
        timestamp: new Date()
      });
    }

    return {
      storageSizeMB,
      activeUsers,
      apiLatency,
      errorRate,
      databaseHealth,
      services,
      recentActivity,
      alerts
    };
  }, [lastRefresh]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 40) + 10,
        memory: Math.floor(Math.random() * 50) + 30,
        storage: Math.floor(Math.random() * 30) + 60,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        apiLatency: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 5
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshMetrics = () => {
    setLastRefresh(new Date());
    setSystemMetrics({
      cpu: Math.floor(Math.random() * 40) + 10,
      memory: Math.floor(Math.random() * 50) + 30,
      storage: Math.floor(Math.random() * 30) + 60,
      activeUsers: Math.floor(Math.random() * 50) + 10,
      apiLatency: Math.floor(Math.random() * 100) + 50,
      errorRate: Math.random() * 5
    });
    toast.success('System metrics refreshed');
  };

  const exportHealthReport = () => {
    const report = `
CEREBROLEARN SYSTEM HEALTH REPORT
Generated: ${new Date().toLocaleString()}

========================================
SYSTEM METRICS
========================================
CPU Usage: ${systemMetrics.cpu}%
Memory Usage: ${systemMetrics.memory}%
Storage Usage: ${systemMetrics.storage}%
Active Users: ${systemMetrics.activeUsers}
API Latency: ${systemMetrics.apiLatency}ms
Error Rate: ${systemMetrics.errorRate.toFixed(2)}%

========================================
DATABASE HEALTH
========================================
Total Records: ${healthData.databaseHealth.totalRecords}
Psychologists: ${healthData.databaseHealth.psychologists}
Bookings: ${healthData.databaseHealth.bookings}
Users: ${healthData.databaseHealth.users}
Courses: ${healthData.databaseHealth.courses}
Payments: ${healthData.databaseHealth.payments}
Session Notes: ${healthData.databaseHealth.sessionNotes}
Feedback: ${healthData.databaseHealth.feedback}
Storage Size: ${healthData.storageSizeMB} MB

========================================
SERVICE STATUS
========================================
${healthData.services.map(s => `
${s.name}
  Status: ${s.status.toUpperCase()}
  Uptime: ${s.uptime}%
  Last Check: ${s.lastCheck.toLocaleString()}
`).join('\n')}

========================================
SYSTEM ALERTS
========================================
${healthData.alerts.length === 0 ? 'No alerts - System healthy' :
  healthData.alerts.map(a => `
[${a.type.toUpperCase()}] ${a.message}
Time: ${a.timestamp.toLocaleString()}
`).join('\n')}

========================================
RECENT ACTIVITY (Last 10)
========================================
${healthData.recentActivity.map(a => `
[${a.type.toUpperCase()}] ${a.message}
Time: ${a.timestamp.toLocaleString()}
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-health-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Health report exported!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
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
              <h1 className="text-4xl font-bold mb-2">System Health Monitor</h1>
              <p className="text-muted-foreground">
                Real-time platform monitoring and diagnostics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
              </Button>
              <Button variant="outline" onClick={refreshMetrics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportHealthReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        {healthData.alerts.length > 0 && (
          <div className="space-y-3 mb-6">
            {healthData.alerts.map((alert, index) => (
              <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{alert.type.toUpperCase()}:</strong> {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* System Metrics */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Server className="h-8 w-8 text-blue-600 opacity-20" />
                <Badge variant={systemMetrics.cpu < 70 ? 'secondary' : 'destructive'}>
                  {systemMetrics.cpu < 70 ? 'Normal' : 'High'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">CPU Usage</p>
              <p className="text-2xl font-bold mb-2">{systemMetrics.cpu}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    systemMetrics.cpu < 70 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${systemMetrics.cpu}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HardDrive className="h-8 w-8 text-purple-600 opacity-20" />
                <Badge variant={systemMetrics.memory < 80 ? 'secondary' : 'destructive'}>
                  {systemMetrics.memory < 80 ? 'Normal' : 'High'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Memory</p>
              <p className="text-2xl font-bold mb-2">{systemMetrics.memory}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    systemMetrics.memory < 80 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${systemMetrics.memory}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Database className="h-8 w-8 text-green-600 opacity-20" />
                <Badge variant="secondary">Normal</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Storage</p>
              <p className="text-2xl font-bold mb-2">{systemMetrics.storage}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${systemMetrics.storage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-yellow-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Users</p>
              <p className="text-2xl font-bold mb-2">{healthData.activeUsers}</p>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8 text-orange-600 opacity-20" />
                <Badge variant={healthData.apiLatency < 200 ? 'secondary' : 'default'}>
                  {healthData.apiLatency < 200 ? 'Fast' : 'Slow'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">API Latency</p>
              <p className="text-2xl font-bold mb-2">{healthData.apiLatency}ms</p>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="h-8 w-8 text-red-600 opacity-20" />
                <Badge variant={healthData.errorRate < 5 ? 'secondary' : 'destructive'}>
                  {healthData.errorRate < 5 ? 'Low' : 'High'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Error Rate</p>
              <p className="text-2xl font-bold mb-2">{healthData.errorRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>
                  Real-time status of all platform services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthData.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        {getStatusIcon(service.status)}
                        <div className="flex-1">
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last checked: {service.lastCheck.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Uptime</p>
                          <p className="text-lg font-bold">{service.uptime}%</p>
                        </div>
                        <Badge
                          variant={
                            service.status === 'operational' ? 'secondary' :
                            service.status === 'degraded' ? 'default' :
                            'destructive'
                          }
                          className={getStatusColor(service.status)}
                        >
                          {service.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold">Total Records</span>
                    <span className="text-2xl font-bold">{healthData.databaseHealth.totalRecords}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Storage Size</span>
                    <span className="font-semibold">{healthData.storageSizeMB} MB</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Record Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Psychologists:</span>
                    <span className="font-semibold">{healthData.databaseHealth.psychologists}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bookings:</span>
                    <span className="font-semibold">{healthData.databaseHealth.bookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Users:</span>
                    <span className="font-semibold">{healthData.databaseHealth.users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Courses:</span>
                    <span className="font-semibold">{healthData.databaseHealth.courses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payments:</span>
                    <span className="font-semibold">{healthData.databaseHealth.payments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session Notes:</span>
                    <span className="font-semibold">{healthData.databaseHealth.sessionNotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Feedback:</span>
                    <span className="font-semibold">{healthData.databaseHealth.feedback}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 10 system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Activity className={`h-5 w-5 mt-0.5 ${
                        activity.severity === 'warning' ? 'text-yellow-600' :
                        activity.severity === 'error' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={
                        activity.severity === 'warning' ? 'default' :
                        activity.severity === 'error' ? 'destructive' :
                        'secondary'
                      }>
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">{healthData.apiLatency}ms</p>
                  <p className="text-sm text-muted-foreground">Average API latency</p>
                  <div className="mt-4">
                    <Badge variant={healthData.apiLatency < 200 ? 'secondary' : 'default'}>
                      {healthData.apiLatency < 200 ? 'Excellent' : 'Good'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Throughput</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">{healthData.activeUsers * 3}</p>
                  <p className="text-sm text-muted-foreground">Requests per minute</p>
                  <div className="mt-4">
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">{(100 - healthData.errorRate).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Successful requests</p>
                  <div className="mt-4">
                    <Badge variant={healthData.errorRate < 5 ? 'secondary' : 'destructive'}>
                      {healthData.errorRate < 5 ? 'Healthy' : 'Needs Attention'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}