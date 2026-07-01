"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Calendar,
  Clock,
  Brain,
  MessageSquare,
  TrendingUp,
  Target,
  BookOpen,
  Video,
  Bell,
  Heart,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight,
  Activity,
  Award,
  FileText,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface EnhancedTherapyDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function EnhancedTherapyDashboard({ onNavigate }: EnhancedTherapyDashboardProps) {
  const { user } = useAuth();

  // Load user's therapy data
  const appointments = useMemo(() => {
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    return bookings
      .filter((b: any) => b.studentId === user?.id)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [user]);

  const sessionNotes = useMemo(() => {
    // In a real app, students would have limited access to their notes
    const allNotes = JSON.parse(localStorage.getItem('session_notes') || '[]');
    return allNotes.filter((n: any) => n.studentId === user?.id);
  }, [user]);

  const myProgress = useMemo(() => {
    // Load student's self-reported progress
    return JSON.parse(localStorage.getItem(`student_progress_${user?.id}`) || JSON.stringify({
      moodJournal: [],
      goals: [],
      milestones: [],
      resources: []
    }));
  }, [user]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = appointments.filter((a: any) => 
      new Date(a.date) > now && a.status !== 'cancelled'
    );
    const completed = appointments.filter((a: any) => 
      new Date(a.date) < now || a.status === 'completed'
    );
    const nextSession = upcoming[0];

    return {
      totalSessions: completed.length,
      upcomingSessions: upcoming.length,
      nextSession,
      activePsychologists: new Set(appointments.map((a: any) => a.psychologistId)).size,
      goalsCompleted: myProgress.goals.filter((g: any) => g.completed).length,
      totalGoals: myProgress.goals.length
    };
  }, [appointments, myProgress]);

  // Recent mood entries
  const recentMoods = useMemo(() => {
    return myProgress.moodJournal
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  }, [myProgress]);

  // Upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a: any) => new Date(a.date) > now && a.status !== 'cancelled')
      .slice(0, 3);
  }, [appointments]);

  // Notifications
  const notifications = useMemo(() => {
    const notifs = [];
    
    // Check for upcoming sessions (within 24 hours)
    upcomingAppointments.forEach((apt: any) => {
      const aptDate = new Date(apt.date);
      const hoursUntil = (aptDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      if (hoursUntil <= 24 && hoursUntil > 0) {
        notifs.push({
          type: 'appointment',
          priority: 'high',
          message: `Session with ${apt.psychologistName} in ${Math.floor(hoursUntil)} hours`,
          action: 'Prepare',
          data: apt
        });
      }
    });

    // Check for unread messages (mock)
    const unreadCount = 3; // Mock data
    if (unreadCount > 0) {
      notifs.push({
        type: 'message',
        priority: 'medium',
        message: `${unreadCount} unread messages from your therapist`,
        action: 'Read',
        data: null
      });
    }

    // Check for incomplete homework (mock)
    const hasHomework = true;
    if (hasHomework) {
      notifs.push({
        type: 'homework',
        priority: 'medium',
        message: 'You have pending homework assignments',
        action: 'View',
        data: null
      });
    }

    return notifs;
  }, [upcomingAppointments]);

  const addMoodEntry = () => {
    const mood = prompt('How are you feeling today? (1-10)');
    if (mood && !isNaN(parseInt(mood))) {
      const moodValue = Math.max(1, Math.min(10, parseInt(mood)));
      const updatedProgress = {
        ...myProgress,
        moodJournal: [
          ...myProgress.moodJournal,
          {
            id: `mood_${Date.now()}`,
            date: new Date().toISOString(),
            rating: moodValue,
            note: prompt('Any notes about your mood? (optional)') || ''
          }
        ]
      };
      localStorage.setItem(`student_progress_${user?.id}`, JSON.stringify(updatedProgress));
      toast.success('Mood entry added!');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Therapy Journey</h1>
          <p className="text-muted-foreground">
            Track your progress, manage sessions, and access mental health resources
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold">{stats.totalSessions}</p>
                </div>
                <Activity className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
                  <p className="text-3xl font-bold">{stats.upcomingSessions}</p>
                </div>
                <Calendar className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Goals Progress</p>
                  <p className="text-3xl font-bold">
                    {stats.totalGoals > 0 
                      ? Math.round((stats.goalsCompleted / stats.totalGoals) * 100)
                      : 0}%
                  </p>
                </div>
                <Target className="h-10 w-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mood Today</p>
                  <p className="text-3xl font-bold">
                    {recentMoods[0]?.rating || '—'}{recentMoods[0] && '/10'}
                  </p>
                </div>
                <Heart className="h-10 w-10 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8 space-y-3">
            {notifications.map((notif, index) => (
              <Alert 
                key={index}
                variant={notif.priority === 'high' ? 'default' : 'default'}
                className={notif.priority === 'high' ? 'border-primary' : ''}
              >
                <Bell className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{notif.message}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (notif.type === 'appointment') {
                        onNavigate('session-preparation', { appointment: notif.data });
                      } else if (notif.type === 'message') {
                        onNavigate('therapy-messages');
                      } else if (notif.type === 'homework') {
                        onNavigate('therapy-resources');
                      }
                    }}
                  >
                    {notif.action}
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Session */}
            {stats.nextSession && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Next Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-semibold mb-1">
                          {stats.nextSession.psychologistName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {stats.nextSession.sessionType}
                        </p>
                      </div>
                      <Badge>{stats.nextSession.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(stats.nextSession.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{stats.nextSession.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => onNavigate('session-preparation', { appointment: stats.nextSession })}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Prepare for Session
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => onNavigate('appointment-manager')}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                    onClick={() => onNavigate('browse-psychologists')}
                  >
                    <Plus className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Book New Session</span>
                    <span className="text-xs text-muted-foreground">Find a therapist</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                    onClick={() => onNavigate('therapy-messages')}
                  >
                    <MessageSquare className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Messages</span>
                    <span className="text-xs text-muted-foreground">Chat with therapist</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                    onClick={() => onNavigate('my-progress')}
                  >
                    <TrendingUp className="h-5 w-5 mb-2" />
                    <span className="font-semibold">My Progress</span>
                    <span className="text-xs text-muted-foreground">Track improvement</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                    onClick={() => onNavigate('therapy-resources')}
                  >
                    <BookOpen className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Resources</span>
                    <span className="text-xs text-muted-foreground">Worksheets & tools</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('appointment-manager')}
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                    <Button onClick={() => onNavigate('browse-psychologists')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Book a Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt: any) => (
                      <div 
                        key={apt.id}
                        className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                        onClick={() => onNavigate('session-preparation', { appointment: apt })}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{apt.psychologistName}</p>
                            <p className="text-sm text-muted-foreground">{apt.sessionType}</p>
                          </div>
                          {apt.isRecurring && (
                            <Badge variant="outline">Recurring</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Sessions</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('session-history')}
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {appointments.filter((a: any) => 
                  new Date(a.date) < new Date() || a.status === 'completed'
                ).slice(-3).reverse().length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No completed sessions yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {appointments
                      .filter((a: any) => new Date(a.date) < new Date() || a.status === 'completed')
                      .slice(-3)
                      .reverse()
                      .map((apt: any) => (
                        <div key={apt.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{apt.psychologistName}</p>
                            <Badge variant="secondary" className="text-xs">Completed</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(apt.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Mood Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Mood Tracker
                </CardTitle>
                <CardDescription>Track your daily emotional wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {recentMoods.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Start tracking your mood
                    </p>
                  ) : (
                    recentMoods.slice(0, 5).map((mood: any) => (
                      <div key={mood.id} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">
                          {new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-4 relative">
                          <div
                            className={`h-4 rounded-full ${
                              mood.rating >= 7 ? 'bg-green-500' :
                              mood.rating >= 4 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(mood.rating / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-8">{mood.rating}/10</span>
                      </div>
                    ))
                  )}
                </div>
                <Button size="sm" className="w-full" onClick={addMoodEntry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Mood
                </Button>
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  My Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myProgress.goals.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      No goals set yet
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate('my-progress')}
                    >
                      Set Goals
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myProgress.goals.slice(0, 3).map((goal: any) => (
                      <div key={goal.id} className="flex items-start gap-2">
                        <CheckCircle2 
                          className={`h-4 w-4 mt-0.5 ${
                            goal.completed ? 'text-green-600' : 'text-muted-foreground'
                          }`}
                        />
                        <div className="flex-1">
                          <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {goal.title}
                          </p>
                          {goal.progress && (
                            <div className="mt-1 bg-muted rounded-full h-1">
                              <div 
                                className="bg-primary h-1 rounded-full"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => onNavigate('my-progress')}
                    >
                      View All Goals
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.totalSessions >= 1 && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">First Session Complete</span>
                    </div>
                  )}
                  {stats.totalSessions >= 5 && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Committed Journey (5 sessions)</span>
                    </div>
                  )}
                  {recentMoods.length >= 7 && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Mood Tracker (7 days)</span>
                    </div>
                  )}
                  {stats.goalsCompleted > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Goal Achiever</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Crisis Support */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Crisis Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p className="text-muted-foreground">
                  If you're experiencing a mental health crisis:
                </p>
                <div className="space-y-1">
                  <p><strong>Emergency:</strong> Call 911</p>
                  <p><strong>Crisis Hotline:</strong> 988</p>
                  <p><strong>Crisis Text:</strong> Text HOME to 741741</p>
                </div>
                <Button size="sm" variant="destructive" className="w-full mt-2">
                  <Phone className="h-3 w-3 mr-2" />
                  Get Help Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock Phone icon
function Phone({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
