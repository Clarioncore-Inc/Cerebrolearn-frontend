import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  Clock,
  Video,
  MessageSquare,
  FileText,
  Star,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface StudentSessionsDashboardProps {
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
  sessionNotes?: string;
  meetingLink?: string;
  psychologistSpecialization?: string;
  rating?: number;
  review?: string;
}

export function StudentSessionsDashboard({ onNavigate }: StudentSessionsDashboardProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
  });

  useEffect(() => {
    if (!user) return;
    loadBookings();
  }, [user]);

  const loadBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const userBookings = allBookings.filter((b: Booking) => b.studentEmail === user?.email);
    setBookings(userBookings);

    // Calculate stats
    const now = new Date();
    const upcoming = userBookings.filter((b: Booking) => {
      const bookingDate = new Date(`${b.date} ${b.time}`);
      return bookingDate > now && b.status === 'confirmed';
    }).length;
    const completed = userBookings.filter((b: Booking) => b.status === 'completed').length;
    const cancelled = userBookings.filter((b: Booking) => b.status === 'cancelled').length;
    const pending = userBookings.filter((b: Booking) => b.status === 'pending').length;

    setStats({ upcoming, completed, cancelled, pending });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const updatedBookings = allBookings.map((b: Booking) =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    localStorage.setItem('appointment_bookings', JSON.stringify(updatedBookings));
    loadBookings();
    toast.success('Appointment cancelled');
  };

  const handleSubmitFeedback = (booking: Booking) => {
    onNavigate('session-feedback', { booking });
  };

  const handleMessagePsychologist = (booking: Booking) => {
    onNavigate('session-messaging', { booking });
  };

  const handleJoinSession = (booking: Booking) => {
    onNavigate('video-call', { booking });
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

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isPast = (booking: Booking) => {
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    return bookingDate < now;
  };

  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(`${b.date} ${b.time}`);
    const now = new Date();
    return bookingDate > now && b.status === 'confirmed';
  }).sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

  const pendingBookings = bookings.filter(b => b.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const completedBookings = bookings.filter(b => b.status === 'completed')
    .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());

  const SessionCard = ({ booking }: { booking: Booking }) => {
    const past = isPast(booking);
    const today = isToday(booking.date);

    return (
      <Card className={`hover:shadow-md transition-shadow ${today && booking.status === 'confirmed' ? 'border-primary border-2' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg mb-1">{booking.psychologistName}</CardTitle>
                <CardDescription className="mb-2">
                  {booking.psychologistSpecialization || 'Clinical Psychologist'}
                </CardDescription>
                {today && booking.status === 'confirmed' && (
                  <Badge className="bg-green-500">Today's Session</Badge>
                )}
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking.time} (60 minutes)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{booking.sessionType}</span>
            </div>
          </div>

          {booking.notes && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Your Notes:</p>
              <p className="text-sm text-muted-foreground">{booking.notes}</p>
            </div>
          )}

          {booking.sessionNotes && booking.status === 'completed' && (
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-sm font-medium mb-1 text-primary">Psychologist's Notes:</p>
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
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Request
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleMessagePsychologist(booking)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </>
            )}

            {booking.status === 'confirmed' && !past && (
              <>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleJoinSession(booking)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMessagePsychologist(booking)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </>
            )}

            {booking.status === 'confirmed' && past && (
              <div className="w-full text-center py-2 text-sm text-muted-foreground">
                Waiting for psychologist to complete session
              </div>
            )}

            {booking.status === 'completed' && (
              <>
                {!booking.rating ? (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSubmitFeedback(booking)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rate Session
                  </Button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-1">
                    <span className="text-sm text-muted-foreground">Your rating:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < (booking.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMessagePsychologist(booking)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </>
            )}

            {booking.status === 'cancelled' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onNavigate('psychologist-browse')}
              >
                Book Another Session
              </Button>
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
          onClick={() => onNavigate('dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">My Sessions</h1>
        <p className="text-muted-foreground">
          Manage your psychologist consultations and appointments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      {upcomingBookings.length === 0 && completedBookings.length === 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">No sessions booked yet</p>
                  <p className="text-sm text-muted-foreground">
                    Book your first session with a verified psychologist
                  </p>
                </div>
              </div>
              <Button onClick={() => onNavigate('psychologist-browse')}>
                Browse Psychologists
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({stats.upcoming + stats.pending})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({stats.cancelled})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {pendingBookings.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Pending Confirmation
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingBookings.map((booking) => (
                  <SessionCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {upcomingBookings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Confirmed Sessions
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingBookings.map((booking) => (
                  <SessionCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {upcomingBookings.length === 0 && pendingBookings.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Book a session to get started
                </p>
                <Button onClick={() => onNavigate('psychologist-browse')}>
                  Browse Psychologists
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedBookings.map((booking) => (
                <SessionCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No completed sessions</h3>
                <p className="text-muted-foreground">
                  Completed sessions will appear here
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Cancelled Tab */}
        <TabsContent value="cancelled" className="space-y-4">
          {bookings.filter(b => b.status === 'cancelled').length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {bookings.filter(b => b.status === 'cancelled').map((booking) => (
                <SessionCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No cancelled sessions</h3>
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
