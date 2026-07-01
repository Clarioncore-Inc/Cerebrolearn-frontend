"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import {
  Calendar,
  Clock,
  Edit,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MessageSquare,
  DollarSign,
  Repeat,
  Video,
  FileText
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AppointmentManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AppointmentManager({ onNavigate }: AppointmentManagerProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'recurring'>('all');

  // Load appointments from localStorage
  const appointments = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    return stored.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter((apt: any) => {
      if (filter === 'upcoming') {
        return new Date(apt.date) >= now && apt.status !== 'cancelled';
      }
      if (filter === 'past') {
        return new Date(apt.date) < now || apt.status === 'completed';
      }
      if (filter === 'recurring') {
        return apt.isRecurring;
      }
      return true;
    });
  }, [appointments, filter]);

  const calculateCancellationFee = (appointment: any) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntil >= 24) {
      return 0; // Free cancellation
    } else if (hoursUntil >= 0) {
      return appointment.price * 0.5; // 50% fee within 24 hours
    } else {
      return appointment.price; // Full fee for no-shows
    }
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select both date and time');
      return;
    }

    const appointmentDate = new Date(selectedAppointment.date);
    const now = new Date();
    const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check if rescheduling is allowed (24 hours notice)
    if (hoursUntil < 24) {
      toast.error('Cannot reschedule within 24 hours of appointment. Please cancel and rebook.');
      return;
    }

    // Check for conflicts
    const newDateTime = new Date(rescheduleDate + ' ' + rescheduleTime);
    const hasConflict = appointments.some((apt: any) => 
      apt.id !== selectedAppointment.id &&
      new Date(apt.date).toDateString() === newDateTime.toDateString() &&
      apt.time === rescheduleTime &&
      apt.status !== 'cancelled'
    );

    if (hasConflict) {
      toast.error('Time slot conflict detected. Please choose another time.');
      return;
    }

    // Update appointment
    const updatedAppointments = appointments.map((apt: any) => {
      if (apt.id === selectedAppointment.id) {
        return {
          ...apt,
          date: newDateTime.toISOString(),
          time: rescheduleTime,
          rescheduledAt: new Date().toISOString(),
          rescheduledFrom: apt.date
        };
      }
      return apt;
    });

    localStorage.setItem('psychologist_bookings', JSON.stringify(updatedAppointments));
    
    toast.success('Appointment rescheduled successfully!');
    setShowRescheduleDialog(false);
    setRescheduleDate('');
    setRescheduleTime('');
    window.location.reload(); // Refresh to show updated data
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    const cancellationFee = calculateCancellationFee(selectedAppointment);
    
    // Update appointment status
    const updatedAppointments = appointments.map((apt: any) => {
      if (apt.id === selectedAppointment.id) {
        return {
          ...apt,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancelReason,
          cancellationFee
        };
      }
      return apt;
    });

    localStorage.setItem('psychologist_bookings', JSON.stringify(updatedAppointments));

    if (cancellationFee > 0) {
      toast.error(`Appointment cancelled. Cancellation fee: $${cancellationFee}`);
    } else {
      toast.success('Appointment cancelled successfully. No fees charged.');
    }

    setShowCancelDialog(false);
    setCancelReason('');
    window.location.reload();
  };

  const handleCancelRecurringSeries = () => {
    if (!selectedAppointment.isRecurring) return;

    const updatedAppointments = appointments.map((apt: any) => {
      // Cancel all appointments in the recurring series
      if (apt.isRecurring && 
          apt.psychologistId === selectedAppointment.psychologistId &&
          apt.time === selectedAppointment.time &&
          apt.recurringFrequency === selectedAppointment.recurringFrequency) {
        return {
          ...apt,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancelReason: 'Recurring series cancelled'
        };
      }
      return apt;
    });

    localStorage.setItem('psychologist_bookings', JSON.stringify(updatedAppointments));
    toast.success('Recurring appointment series cancelled');
    setShowCancelDialog(false);
    window.location.reload();
  };

  const getStatusBadge = (appointment: any) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();

    if (appointment.status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (appointment.status === 'completed') {
      return <Badge variant="secondary">Completed</Badge>;
    }
    if (appointment.status === 'emergency') {
      return <Badge className="bg-red-500">Emergency</Badge>;
    }
    if (appointmentDate < now) {
      return <Badge variant="outline">Past</Badge>;
    }
    return <Badge>Confirmed</Badge>;
  };

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Appointments</h1>
          <p className="text-muted-foreground">
            Reschedule, cancel, or view details of your appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Appointments
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
          <Button
            variant={filter === 'recurring' ? 'default' : 'outline'}
            onClick={() => setFilter('recurring')}
          >
            <Repeat className="h-4 w-4 mr-2" />
            Recurring
          </Button>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No appointments found</p>
              <Button onClick={() => onNavigate('browse-psychologists')}>
                Book New Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((appointment: any) => {
              const appointmentDate = new Date(appointment.date);
              const now = new Date();
              const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
              const canReschedule = hoursUntil >= 24 && appointment.status !== 'cancelled';
              const cancellationFee = calculateCancellationFee(appointment);

              return (
                <Card key={appointment.id} className={
                  appointment.status === 'cancelled' ? 'opacity-60' : ''
                }>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {appointment.psychologistName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.sessionType}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment)}
                            {appointment.isRecurring && (
                              <Badge variant="outline">
                                <Repeat className="h-3 w-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointmentDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>${appointment.price}</span>
                          </div>
                          {appointment.isRecurring && (
                            <div className="flex items-center gap-2">
                              <Repeat className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize">{appointment.recurringFrequency}</span>
                            </div>
                          )}
                        </div>

                        {appointment.rescheduledFrom && (
                          <Alert className="mb-4">
                            <RefreshCw className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Rescheduled from {new Date(appointment.rescheduledFrom).toLocaleDateString()}
                            </AlertDescription>
                          </Alert>
                        )}

                        {appointment.status === 'cancelled' && (
                          <Alert variant="destructive" className="mb-4">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Cancelled: {appointment.cancelReason}
                              {appointment.cancellationFee > 0 && (
                                <span className="block mt-1">
                                  Cancellation fee: ${appointment.cancellationFee}
                                </span>
                              )}
                            </AlertDescription>
                          </Alert>
                        )}

                        {appointment.notes && (
                          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {appointment.status !== 'cancelled' && appointmentDate >= now && (
                        <div className="flex flex-col gap-2">
                          {hoursUntil <= 24 && hoursUntil > 0 && (
                            <Button size="sm" onClick={() => onNavigate('video-call', { appointmentId: appointment.id })}>
                              <Video className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                          )}

                          <Dialog open={showRescheduleDialog && selectedAppointment?.id === appointment.id}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!canReschedule}
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowRescheduleDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Reschedule
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reschedule Appointment</DialogTitle>
                                <DialogDescription>
                                  Select a new date and time for your appointment
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>New Date</Label>
                                  <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>New Time</Label>
                                  <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableTimes.map(time => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Alert>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    Free rescheduling available (24+ hours notice)
                                  </AlertDescription>
                                </Alert>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleReschedule}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Confirm Reschedule
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={showCancelDialog && selectedAppointment?.id === appointment.id}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowCancelDialog(true);
                                }}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Appointment</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel this appointment?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Alert variant={cancellationFee > 0 ? 'destructive' : 'default'}>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    {cancellationFee === 0 ? (
                                      'Free cancellation (24+ hours notice)'
                                    ) : hoursUntil >= 0 ? (
                                      `50% cancellation fee will apply: $${cancellationFee}`
                                    ) : (
                                      `Full charge for no-show: $${cancellationFee}`
                                    )}
                                  </AlertDescription>
                                </Alert>

                                <div>
                                  <Label>Cancellation Reason</Label>
                                  <Textarea
                                    placeholder="Please provide a reason for cancellation..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    rows={3}
                                  />
                                </div>

                                {appointment.isRecurring && (
                                  <Alert>
                                    <Repeat className="h-4 w-4" />
                                    <AlertDescription>
                                      This is a recurring appointment. You can cancel just this instance or the entire series.
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                              <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="w-full sm:w-auto">
                                  Keep Appointment
                                </Button>
                                {appointment.isRecurring && (
                                  <Button variant="destructive" onClick={handleCancelRecurringSeries} className="w-full sm:w-auto">
                                    Cancel Series
                                  </Button>
                                )}
                                <Button variant="destructive" onClick={handleCancel} className="w-full sm:w-auto">
                                  Cancel Appointment
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => onNavigate('browse-psychologists')}>
              <Calendar className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Print Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
