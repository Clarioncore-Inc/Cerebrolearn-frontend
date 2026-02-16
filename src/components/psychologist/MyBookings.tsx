import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Calendar,
  Clock,
  Video,
  X,
  RefreshCw,
  MessageSquare,
  FileText,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface MyBookingsProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Booking {
  id: string;
  psychologistId: string;
  psychologistName: string;
  psychologistEmail: string;
  studentEmail: string;
  studentName: string;
  date: string;
  time: string;
  sessionType: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  hourlyRate: number;
  meetingLink?: string;
}

export function MyBookings({ onNavigate }: MyBookingsProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) return;

    // Load bookings for current user
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const userBookings = allBookings.filter((b: Booking) => b.studentEmail === user.email);
    setBookings(userBookings);
  }, [user]);

  const handleCancelBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const updatedBookings = allBookings.map((b: Booking) =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    localStorage.setItem('appointment_bookings', JSON.stringify(updatedBookings));

    setBookings(updatedBookings.filter((b: Booking) => b.studentEmail === user?.email));
    toast.success('Appointment cancelled successfully');
  };

  const handleReschedule = (booking: Booking) => {
    // In a real app, this would open a rescheduling modal
    toast.info('Rescheduling feature coming soon');
  };

  const handleJoinCall = (booking: Booking) => {
    // In a real app, this would open the video call
    toast.success('Joining video call...');
  };

  const isUpcoming = (booking: Booking) => {
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    return bookingDate > now && booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  const isPast = (booking: Booking) => {
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    return bookingDate <= now || booking.status === 'completed';
  };

  const isCancelled = (booking: Booking) => {
    return booking.status === 'cancelled';
  };

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter(isPast);
  const cancelledBookings = bookings.filter(isCancelled);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const upcoming = isUpcoming(booking);
    const past = isPast(booking);
    const cancelled = isCancelled(booking);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg mb-1">{booking.psychologistName}</CardTitle>
                <CardDescription>{booking.sessionType}</CardDescription>
              </div>
            </div>
            <div>
              {getStatusBadge(booking.status)}
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
              <p className="text-sm text-muted-foreground">
                <strong>Notes:</strong> {booking.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Session Fee:</span>
            <span className="font-semibold">${booking.hourlyRate}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {upcoming && !cancelled && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => handleJoinCall(booking)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReschedule(booking)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            {past && !cancelled && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onNavigate('book-appointment', { psychologist: { id: booking.psychologistId, fullName: booking.psychologistName } })}
                >
                  Book Again
                </Button>
                <Button
                  size="sm"
                  variant="default"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Leave Review
                </Button>
              </>
            )}
            {cancelled && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onNavigate('browse-psychologists')}
              >
                Book New Appointment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your bookings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
        <p className="text-muted-foreground">
          Manage your consultation bookings and sessions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastBookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledBookings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Bookings */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">
                  Book a consultation with a psychologist to get started
                </p>
                <Button onClick={() => onNavigate('browse-psychologists')}>
                  Browse Psychologists
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Past Bookings */}
        <TabsContent value="past" className="space-y-4 mt-6">
          {pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No past appointments</h3>
                <p className="text-muted-foreground">
                  Your completed sessions will appear here
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Cancelled Bookings */}
        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelledBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No cancelled appointments</h3>
                <p className="text-muted-foreground">
                  Cancelled sessions will appear here
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
