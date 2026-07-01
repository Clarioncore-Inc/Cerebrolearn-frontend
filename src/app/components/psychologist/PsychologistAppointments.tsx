import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { 
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  MessageSquare,
  Brain,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface PsychologistAppointmentsProps {
  onNavigate: (page: string, data?: any) => void;
  initialTab?: string;
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

export function PsychologistAppointments({ onNavigate, initialTab = 'pending' }: PsychologistAppointmentsProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadBookings();
  }, [user]);

  const loadBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const psychBookings = allBookings.filter((b: Booking) => b.psychologistEmail === user?.email);
    setBookings(psychBookings);
  };

  const handleAcceptBooking = (bookingId: string) => {
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const updatedBookings = allBookings.map((b: Booking) =>
      b.id === bookingId ? { ...b, status: 'confirmed', meetingLink: 'https://meet.cerebrolearn.com/' + bookingId } : b
    );
    localStorage.setItem('appointment_bookings', JSON.stringify(updatedBookings));
    loadBookings();
    toast.success('Appointment accepted and confirmed');
  };

  const handleRejectBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to reject this appointment request?')) {
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const updatedBookings = allBookings.map((b: Booking) =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    localStorage.setItem('appointment_bookings', JSON.stringify(updatedBookings));
    loadBookings();
    toast.success('Appointment request rejected');
  };

  const handleCompleteSession = (booking: Booking) => {
    setSelectedBooking(booking);
    setSessionNotes(booking.sessionNotes || '');
    setShowNotesDialog(true);
  };

  const handleSaveSessionNotes = () => {
    if (!selectedBooking) return;

    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const updatedBookings = allBookings.map((b: Booking) =>
      b.id === selectedBooking.id 
        ? { ...b, status: 'completed', sessionNotes } 
        : b
    );
    localStorage.setItem('appointment_bookings', JSON.stringify(updatedBookings));
    loadBookings();
    setShowNotesDialog(false);
    toast.success('Session completed and notes saved');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPast = (booking: Booking) => {
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    return bookingDate < now;
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(`${b.date} ${b.time}`) > new Date()
  ).sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

  const completedBookings = bookings.filter(b => b.status === 'completed')
    .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());

  const AppointmentCard = ({ booking }: { booking: Booking }) => {
    const past = isPast(booking);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg mb-1">{booking.studentName}</CardTitle>
                <CardDescription className="flex items-center gap-1 mb-2">
                  <Mail className="h-3 w-3" />
                  {booking.studentEmail}
                </CardDescription>
                <Badge variant="secondary">{booking.sessionType}</Badge>
              </div>
            </div>
            <div>
              {booking.status === 'pending' && <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>}
              {booking.status === 'confirmed' && <Badge variant="default" className="bg-green-500">Confirmed</Badge>}
              {booking.status === 'completed' && <Badge variant="secondary">Completed</Badge>}
              {booking.status === 'cancelled' && <Badge variant="destructive">Cancelled</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{booking.time} (60 min)</span>
            </div>
          </div>

          {booking.notes && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Student Notes:</p>
              <p className="text-sm text-muted-foreground">{booking.notes}</p>
            </div>
          )}

          {booking.sessionNotes && (
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-sm font-medium mb-1 text-primary">Your Session Notes:</p>
              <p className="text-sm text-muted-foreground">{booking.sessionNotes}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Session Fee:</span>
            <span className="font-semibold text-lg">${booking.hourlyRate}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {booking.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAcceptBooking(booking.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleRejectBooking(booking.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {booking.status === 'confirmed' && !past && (
              <>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(booking.meetingLink || '#', '_blank')}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Reschedule feature coming soon')}
                >
                  Reschedule
                </Button>
              </>
            )}

            {booking.status === 'confirmed' && past && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleCompleteSession(booking)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Complete & Add Notes
              </Button>
            )}

            {booking.status === 'completed' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setSessionNotes(booking.sessionNotes || '');
                    setShowNotesDialog(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Messaging feature coming soon')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('psychologist-sessions')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Appointment Management</h1>
        <p className="text-muted-foreground">Review and manage your session bookings</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingBookings.map((booking) => (
                <AppointmentCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                <p className="text-muted-foreground">
                  New appointment requests will appear here
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingBookings.map((booking) => (
                <AppointmentCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground">
                  Confirmed appointments will appear here
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedBookings.map((booking) => (
                <AppointmentCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No completed sessions</h3>
                <p className="text-muted-foreground">
                  Completed sessions will appear here
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Session Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Notes</DialogTitle>
            <DialogDescription>
              {selectedBooking?.status === 'completed' 
                ? 'View your session notes for this appointment'
                : 'Add notes and complete this session'}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Student:</span>
                  <span className="font-medium">{selectedBooking.studentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Session Type:</span>
                  <span className="font-medium">{selectedBooking.sessionType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">{formatDate(selectedBooking.date)} at {selectedBooking.time}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionNotes">Session Notes</Label>
                <Textarea
                  id="sessionNotes"
                  placeholder="Document key discussion points, observations, recommendations, and follow-up actions..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={10}
                  disabled={selectedBooking.status === 'completed'}
                />
                <p className="text-xs text-muted-foreground">
                  These notes are private and will help you track the student's progress.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
              Close
            </Button>
            {selectedBooking?.status !== 'completed' && (
              <Button onClick={handleSaveSessionNotes} disabled={!sessionNotes.trim()}>
                Complete Session & Save Notes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
