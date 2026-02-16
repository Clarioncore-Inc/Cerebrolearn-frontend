import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  Settings,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PsychologistSessionDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Booking {
  id: string;
  psychologistId: string;
  psychologistName: string;
  studentEmail: string;
  studentName: string;
  date: string;
  time: string;
  sessionType: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  hourlyRate: number;
  sessionNotes?: string;
  meetingLink?: string;
}

export function PsychologistSessionDashboard({ onNavigate }: PsychologistSessionDashboardProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    todaySessions: 0,
    upcomingSessions: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    completedSessions: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Load all bookings for this psychologist
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const psychBookings = allBookings.filter((b: Booking) => b.psychologistEmail === user.email);
    setBookings(psychBookings);

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = psychBookings.filter((b: Booking) => b.date === today && b.status !== 'cancelled').length;
    const upcomingSessions = psychBookings.filter((b: Booking) => {
      const bookingDate = new Date(b.date);
      const now = new Date();
      return bookingDate > now && b.status !== 'cancelled';
    }).length;
    const pendingRequests = psychBookings.filter((b: Booking) => b.status === 'pending').length;
    const completedSessions = psychBookings.filter((b: Booking) => b.status === 'completed').length;
    const totalEarnings = psychBookings
      .filter((b: Booking) => b.status === 'completed')
      .reduce((sum, b) => sum + b.hourlyRate, 0);

    setStats({
      todaySessions,
      upcomingSessions,
      pendingRequests,
      totalEarnings,
      completedSessions,
      averageRating: 4.8, // Mock rating
    });
  }, [user]);

  const getTodaysSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today && b.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return bookings.filter(b => {
      const bookingDate = new Date(`${b.date} ${b.time}`);
      return bookingDate > now && b.status !== 'cancelled';
    })
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
      .slice(0, 5);
  };

  const getPendingRequests = () => {
    return bookings.filter(b => b.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const todaysSessions = getTodaysSessions();
  const upcomingSessions = getUpcomingSessions();
  const pendingRequests = getPendingRequests();

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Session Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your appointments and track your practice
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Sessions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From completed sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => onNavigate('psychologist-appointments')}
        >
          <CalendarDays className="h-6 w-6 text-primary" />
          <div className="text-center">
            <div className="font-semibold">Manage Appointments</div>
            <div className="text-xs text-muted-foreground">View all bookings</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => onNavigate('psychologist-availability')}
        >
          <Settings className="h-6 w-6 text-primary" />
          <div className="text-center">
            <div className="font-semibold">Set Availability</div>
            <div className="text-xs text-muted-foreground">Manage your schedule</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => onNavigate('psychologist-dashboard')}
        >
          <User className="h-6 w-6 text-primary" />
          <div className="text-center">
            <div className="font-semibold">Profile Settings</div>
            <div className="text-xs text-muted-foreground">Update your profile</div>
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Sessions</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {todaysSessions.length > 0 ? (
              <div className="space-y-3">
                {todaysSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold truncate">{session.studentName}</p>
                        <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{session.sessionType}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.time}
                        </span>
                        <span>${session.hourlyRate}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No sessions scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Pending Requests
                  {stats.pendingRequests > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.pendingRequests}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>New appointment requests</CardDescription>
              </div>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate mb-1">{request.studentName}</p>
                      <p className="text-sm text-muted-foreground mb-1">{request.sessionType}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(request.date)}</span>
                        <span>{request.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingRequests.length > 3 && (
                  <Button
                    variant="link"
                    className="w-full"
                    onClick={() => onNavigate('psychologist-appointments', { tab: 'pending' })}
                  >
                    View all {pendingRequests.length} requests
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No pending requests</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Next {upcomingSessions.length} scheduled appointments</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('psychologist-appointments')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold mb-1">{session.studentName}</p>
                          <p className="text-sm text-muted-foreground">{session.sessionType}</p>
                        </div>
                        <Badge variant="secondary">{session.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(session.date)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {session.time}
                        </span>
                        <span className="font-semibold">${session.hourlyRate}</span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          Note: {session.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
