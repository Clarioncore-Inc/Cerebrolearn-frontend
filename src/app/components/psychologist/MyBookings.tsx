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
import { psychologistApi } from '../../utils/api-client';

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
  rejectionReason?: string;
  sessionSummary?: string;
}

export function MyBookings({ onNavigate }: MyBookingsProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadBookings = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError(null);

        const data = await psychologistApi.getBookings(user.id);
        const list = Array.isArray(data)
          ? data
          : data.bookings ?? data.items ?? data.results ?? [];

        const normalizedBookings: Booking[] = list.map((item: any, index: number) => ({
          id: item.id ?? item._id ?? `booking-${index}`,
          psychologistId:
            item.psychologist?.id ?? item.psychologist_id ?? item.psychologistId ?? '',
          psychologistName:
            item.psychologist?.full_name ??
            item.psychologist_name ??
            item.psychologistName ??
            'Psychologist',
          psychologistEmail:
            item.psychologist?.email ??
            item.psychologist_email ??
            item.psychologistEmail ??
            '',
          studentEmail:
            item.student?.email ?? item.student_email ?? item.studentEmail ?? user.email,
          studentName:
            item.student?.full_name ?? item.student_name ?? item.studentName ?? 'Student',
          date: item.date ?? item.booking_date ?? item.session_date ?? '',
          time: item.time ?? item.booking_time ?? item.session_time ?? '',
          sessionType: item.session_type ?? item.sessionType ?? 'Session',
          notes: item.notes ?? '',
          status: item.status ?? 'pending',
          createdAt: item.created_at ?? item.createdAt ?? '',
          hourlyRate: Number(item.price ?? item.hourly_rate ?? item.hourlyRate ?? 0),
          meetingLink:
            item.session_notes?.meeting_link ?? item.sessionNotes?.meeting_link ?? '',
          rejectionReason: item.rejection_reason ?? item.rejectionReason ?? '',
          sessionSummary:
            item.session_notes?.session_summary ??
            item.sessionSummary ??
            '',
        }));

        if (!isMounted) return;
        setBookings(normalizedBookings);
      } catch (error) {
        if (!isMounted) return;

        console.error('[MyBookings] Error loading bookings:', error);
        setBookings([]);
        setBookingsError(
          error instanceof Error
            ? error.message
            : 'Failed to load your bookings. Please try again.',
        );
      } finally {
        if (isMounted) {
          setBookingsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCancelBooking = () => {
    toast.info('Booking cancellation from the learner side is not available yet.');
  };

  const handleReschedule = (booking: Booking) => {
    // In a real app, this would open a rescheduling modal
    toast.info('Rescheduling feature coming soon');
  };

  const handleJoinCall = (booking: Booking) => {
    if (booking.meetingLink) {
      window.open(booking.meetingLink, '_blank', 'noopener,noreferrer');
      return;
    }
    toast.info('Meeting link will appear here when it is available.');
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
        return <Badge variant="destructive">Rejected</Badge>;
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

          {booking.rejectionReason ? (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Reason provided:</strong> {booking.rejectionReason}
              </AlertDescription>
            </Alert>
          ) : null}

          {booking.sessionSummary ? (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Session summary:</strong> {booking.sessionSummary}
              </p>
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Session Fee:</span>
            <span className="font-semibold">${booking.hourlyRate}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {upcoming && !cancelled && booking.status === 'confirmed' && (
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
            {booking.status === 'pending' && (
              <div className="flex-1 rounded-lg border border-yellow-500/40 bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200">
                Waiting for the psychologist to confirm or reject this booking.
              </div>
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
          {bookingsLoading ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                Loading your bookings...
              </div>
            </Card>
          ) : bookingsError ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground space-y-2">
                <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                <p className="font-medium text-foreground">Unable to load bookings</p>
                <p>{bookingsError}</p>
              </div>
            </Card>
          ) : upcomingBookings.length > 0 ? (
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
          {bookingsLoading ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                Loading your bookings...
              </div>
            </Card>
          ) : bookingsError ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground space-y-2">
                <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                <p>{bookingsError}</p>
              </div>
            </Card>
          ) : pastBookings.length > 0 ? (
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
          {bookingsLoading ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                Loading your bookings...
              </div>
            </Card>
          ) : bookingsError ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground space-y-2">
                <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                <p>{bookingsError}</p>
              </div>
            </Card>
          ) : cancelledBookings.length > 0 ? (
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
