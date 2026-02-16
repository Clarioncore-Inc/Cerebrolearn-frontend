"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Calendar,
  Clock,
  Users,
  Bell,
  CheckCircle2,
  XCircle,
  Mail,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WaitlistManagerProps {
  onNavigate: (page: string, data?: any) => void;
  userRole?: 'student' | 'psychologist';
}

export function WaitlistManager({ onNavigate, userRole = 'student' }: WaitlistManagerProps) {
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  // Load waitlist from localStorage
  const waitlistEntries = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('psychologist_waitlist') || '[]');
    return stored.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, []);

  const handleRemoveFromWaitlist = (entryId: string) => {
    const updated = waitlistEntries.filter((entry: any) => entry.id !== entryId);
    localStorage.setItem('psychologist_waitlist', JSON.stringify(updated));
    toast.success('Removed from waitlist');
    window.location.reload();
  };

  const handleNotifyAvailability = (entry: any) => {
    // Simulate sending notification
    const notification = {
      id: `NOTIF${Date.now()}`,
      userId: entry.studentId,
      type: 'waitlist_slot_available',
      title: 'Appointment Slot Available!',
      message: `A slot is now available with your requested psychologist on ${new Date(entry.preferredDate).toLocaleDateString()} at ${entry.preferredTime}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Save notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Notification sent to student!');
  };

  const handleConvertToBooking = (entry: any) => {
    // Create a confirmed booking from waitlist entry
    const booking = {
      id: `BK${Date.now()}`,
      studentId: entry.studentId,
      psychologistId: entry.psychologistId,
      date: entry.preferredDate,
      time: entry.preferredTime,
      sessionType: entry.sessionType || 'Initial Consultation (60 min)',
      notes: entry.notes,
      status: 'confirmed',
      convertedFromWaitlist: true,
      createdAt: new Date().toISOString(),
      price: 150
    };

    // Add to bookings
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('psychologist_bookings', JSON.stringify(bookings));

    // Remove from waitlist
    handleRemoveFromWaitlist(entry.id);

    toast.success('Waitlist entry converted to confirmed booking!');
    onNavigate('psychologist-appointments');
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: waitlistEntries.length,
      thisWeek: waitlistEntries.filter((e: any) => {
        const entryDate = new Date(e.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
      }).length,
      pending: waitlistEntries.filter((e: any) => !e.notified).length
    };
  }, [waitlistEntries]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {userRole === 'psychologist' ? 'Waitlist Management' : 'My Waitlist Requests'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'psychologist' 
              ? 'Manage student waitlist requests and notify when slots become available'
              : 'Track your waitlist requests and get notified when slots open up'
            }
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Week</p>
                  <p className="text-3xl font-bold">{stats.thisWeek}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Bell className="h-10 w-10 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waitlist Entries */}
        {waitlistEntries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {userRole === 'psychologist' 
                  ? 'No waitlist entries yet'
                  : 'You haven\'t joined any waitlists'
                }
              </p>
              {userRole === 'student' && (
                <Button onClick={() => onNavigate('browse-psychologists')}>
                  Browse Psychologists
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {waitlistEntries.map((entry: any) => {
              const preferredDate = new Date(entry.preferredDate);
              const createdAt = new Date(entry.createdAt);
              const daysWaiting = Math.floor(
                (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card key={entry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              Waitlist Request #{entry.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Requested {createdAt.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} waiting
                            </Badge>
                            {entry.notified && (
                              <Badge variant="secondary">
                                <Bell className="h-3 w-3 mr-1" />
                                Notified
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Preferred: {preferredDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{entry.preferredTime}</span>
                          </div>
                          {entry.sessionType && (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>{entry.sessionType}</span>
                            </div>
                          )}
                        </div>

                        {entry.notes && (
                          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg mb-4">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p className="text-sm text-muted-foreground">{entry.notes}</p>
                          </div>
                        )}

                        {userRole === 'psychologist' && (
                          <Alert>
                            <Mail className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Student will be automatically notified when you mark this slot as available
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {userRole === 'psychologist' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConvertToBooking(entry)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Confirm Booking
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNotifyAvailability(entry)}
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              Notify Student
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveFromWaitlist(entry.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onNavigate('browse-psychologists')}
                            >
                              Find Alternative
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveFromWaitlist(entry.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Request
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              How Waitlist Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {userRole === 'psychologist' ? (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Students join the waitlist when their preferred time slot is unavailable</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>You can notify students when matching slots become available</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Convert waitlist requests directly to confirmed bookings</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Students receive email and push notifications automatically</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Join the waitlist when your preferred time slot is unavailable</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Receive notifications when a matching slot becomes available</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Priority booking access - you'll be contacted first</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>No commitment required - cancel your request anytime</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
