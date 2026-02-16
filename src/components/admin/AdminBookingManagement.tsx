import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminBookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [dailyBookings, setDailyBookings] = useState<any[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    setBookings(allBookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));

    // Calculate stats
    const pending = allBookings.filter((b: any) => b.status === 'pending').length;
    const confirmed = allBookings.filter((b: any) => b.status === 'confirmed').length;
    const completed = allBookings.filter((b: any) => b.status === 'completed').length;
    const cancelled = allBookings.filter((b: any) => b.status === 'cancelled').length;

    setStats({
      total: allBookings.length,
      pending,
      confirmed,
      completed,
      cancelled,
    });

    // Calculate daily bookings for last 7 days
    const dailyData: { [key: string]: number } = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(dateStr);
      dailyData[dateStr] = 0;
    }

    allBookings.forEach((b: any) => {
      const dateStr = new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyData[dateStr] !== undefined) {
        dailyData[dateStr]++;
      }
    });

    const chartData = last7Days.map(date => ({
      date,
      count: dailyData[date] || 0,
    }));
    setDailyBookings(chartData);
  };

  const handleCancelBooking = (booking: any) => {
    if (!confirm(`Cancel booking for ${booking.studentName}?`)) {
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const updated = allBookings.map((b: any) =>
      b.id === booking.id
        ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() }
        : b
    );
    localStorage.setItem('appointment_bookings', JSON.stringify(updated));

    toast.success('Booking cancelled');
    loadBookings();
  };

  const filteredBookings = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b =>
      searchQuery === '' ||
      b.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.psychologistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.sessionType?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <p className="text-muted-foreground">
          Monitor and manage all appointment bookings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Bookings Chart */}
      {dailyBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Bookings (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyBookings.map((data: any, index: number) => {
                const maxCount = Math.max(...dailyBookings.map((d: any) => d.count), 1);
                const percentage = (data.count / maxCount) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.date}</span>
                      <span className="font-semibold">{data.count} bookings</span>
                    </div>
                    <div className="h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-end px-3"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-xs text-white font-medium">
                            {data.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            No bookings found
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking: any) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {booking.psychologistName} ↔ {booking.studentName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.sessionType}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Date</p>
                        <div className="flex items-center gap-1 font-medium">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Time</p>
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Student</p>
                        <div className="flex items-center gap-1 font-medium">
                          <User className="h-4 w-4" />
                          {booking.studentEmail}
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Psychologist</p>
                        <div className="flex items-center gap-1 font-medium">
                          <User className="h-4 w-4" />
                          {booking.psychologistEmail}
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-semibold mb-1">Notes:</p>
                        <p className="text-xs">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <span>
                        Created: {new Date(booking.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {booking.paymentStatus && (
                        <Badge variant="secondary" className="text-xs">
                          Payment: {booking.paymentStatus}
                        </Badge>
                      )}
                      {booking.hourlyRate && (
                        <span>Rate: ${booking.hourlyRate}/hr</span>
                      )}
                    </div>
                  </div>

                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}