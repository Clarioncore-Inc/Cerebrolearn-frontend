"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Calendar,
  CheckCircle2,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AppointmentRemindersProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AppointmentReminders({ onNavigate }: AppointmentRemindersProps) {
  const [reminders, setReminders] = useState<any[]>([]);

  // Load and generate reminders
  useEffect(() => {
    generateReminders();
  }, []);

  const generateReminders = () => {
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    const now = new Date();
    const generatedReminders: any[] = [];

    bookings.forEach((booking: any) => {
      if (booking.status === 'cancelled') return;

      const appointmentDate = new Date(booking.date);
      const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Only create reminders for upcoming appointments
      if (hoursUntil > 0 && hoursUntil <= 72) { // Within 72 hours
        const reminderPrefs = booking.reminderPreferences || {
          email: true,
          sms: false,
          push: true,
          timing: '24h'
        };

        const timingHours = reminderPrefs.timing === '1h' ? 1 : 
                           reminderPrefs.timing === '24h' ? 24 : 48;

        // Check if reminder should be sent
        if (hoursUntil <= timingHours) {
          const reminderId = `REM${booking.id}${reminderPrefs.timing}`;
          
          // Check if already sent
          const sent = JSON.parse(localStorage.getItem('sent_reminders') || '[]');
          const alreadySent = sent.includes(reminderId);

          if (!alreadySent) {
            generatedReminders.push({
              id: reminderId,
              bookingId: booking.id,
              appointmentDate: booking.date,
              appointmentTime: booking.time,
              psychologistName: booking.psychologistName,
              sessionType: booking.sessionType,
              hoursUntil: Math.floor(hoursUntil),
              channels: {
                email: reminderPrefs.email,
                sms: reminderPrefs.sms,
                push: reminderPrefs.push
              },
              status: 'pending',
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    });

    setReminders(generatedReminders);
  };

  const sendReminder = (reminder: any) => {
    // Simulate sending reminder
    const channels = [];
    if (reminder.channels.email) channels.push('Email');
    if (reminder.channels.sms) channels.push('SMS');
    if (reminder.channels.push) channels.push('Push Notification');

    // Mark as sent
    const sent = JSON.parse(localStorage.getItem('sent_reminders') || '[]');
    sent.push(reminder.id);
    localStorage.setItem('sent_reminders', JSON.stringify(sent));

    // Create notification
    const notification = {
      id: `NOTIF${Date.now()}`,
      type: 'appointment_reminder',
      title: `Upcoming Appointment - ${reminder.hoursUntil}h`,
      message: `Your ${reminder.sessionType} with ${reminder.psychologistName} is scheduled for ${new Date(reminder.appointmentDate).toLocaleDateString()} at ${reminder.appointmentTime}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success(`Reminder sent via ${channels.join(', ')}!`);
    
    // Remove from pending reminders
    setReminders(reminders.filter(r => r.id !== reminder.id));
  };

  const sendAllReminders = () => {
    reminders.forEach(reminder => {
      setTimeout(() => sendReminder(reminder), 100);
    });
  };

  // Statistics
  const stats = useMemo(() => {
    const sent = JSON.parse(localStorage.getItem('sent_reminders') || '[]');
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    
    return {
      pending: reminders.length,
      sent: sent.length,
      scheduled: bookings.filter((b: any) => {
        const date = new Date(b.date);
        return date > new Date() && b.status !== 'cancelled';
      }).length
    };
  }, [reminders]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Appointment Reminders</h1>
          <p className="text-muted-foreground">
            Automated reminders for upcoming therapy sessions
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Reminders</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Bell className="h-10 w-10 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sent This Week</p>
                  <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Scheduled Appointments</p>
                  <p className="text-3xl font-bold text-primary">{stats.scheduled}</p>
                </div>
                <Calendar className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {reminders.length > 0 && (
          <Alert className="mb-6">
            <Bell className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{reminders.length} reminder{reminders.length !== 1 ? 's' : ''} ready to send</span>
              <Button size="sm" onClick={sendAllReminders}>
                Send All Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Reminders</TabsTrigger>
            <TabsTrigger value="settings">Reminder Settings</TabsTrigger>
          </TabsList>

          {/* Pending Reminders */}
          <TabsContent value="pending" className="space-y-4">
            {reminders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No pending reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Reminders will appear here 24-48 hours before appointments
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {reminders.map((reminder) => (
                  <Card key={reminder.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {reminder.sessionType}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                with {reminder.psychologistName}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
                              <Clock className="h-3 w-3 mr-1" />
                              {reminder.hoursUntil}h away
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {new Date(reminder.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{reminder.appointmentTime}</span>
                            </div>
                          </div>

                          {/* Channels */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-muted-foreground">Will send via:</span>
                            {reminder.channels.email && (
                              <Badge variant="secondary" className="text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                            {reminder.channels.sms && (
                              <Badge variant="secondary" className="text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                SMS
                              </Badge>
                            )}
                            {reminder.channels.push && (
                              <Badge variant="secondary" className="text-xs">
                                <Smartphone className="h-3 w-3 mr-1" />
                                Push
                              </Badge>
                            )}
                          </div>

                          <Alert>
                            <Bell className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Reminder will be sent automatically at the scheduled time, or you can send it now.
                            </AlertDescription>
                          </Alert>
                        </div>

                        <Button onClick={() => sendReminder(reminder)}>
                          <Bell className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Default Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure default reminder preferences for new appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Email Reminders</p>
                          <p className="text-xs text-muted-foreground">
                            Send email notifications before appointments
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Enabled by default</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">SMS Reminders</p>
                          <p className="text-xs text-muted-foreground">
                            Send text message reminders (requires phone verification)
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Optional</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-xs text-muted-foreground">
                            Browser and mobile app push notifications
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Enabled by default</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Reminder Timing</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>1 hour before</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Last-minute reminder</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">24 hours before</span>
                      </div>
                      <Badge>Recommended</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>48 hours before</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Early notice</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Studies show that 24-hour reminders reduce no-shows by up to 60%
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Reminder Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Email Open Rate</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">SMS Response Rate</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary rounded-full h-2" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Push Notification Click Rate</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 rounded-full h-2" style={{ width: '65%' }}></div>
                    </div>
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
