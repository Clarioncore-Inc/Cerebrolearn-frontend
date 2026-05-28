import React, { useState, useEffect } from 'react';
import api from '../../utils/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  UserCheck,
  Ban,
  ArrowLeft,
  Mail,
  MapPin,
  FileText,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  User,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';

interface Application {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  hourlyRate: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: string;
  bio: string;
  location: string;
  qualifications: string;
  certifications: string;
  status: 'pending' | 'approved' | 'rejected';
  accountStatus: 'active' | 'suspended';
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNotes: string;
}

interface Booking {
  id: string;
  studentName: string;
  date: string;
  time: string;
  sessionType: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingType: string;
  price: number;
}

interface Props {
  onNavigate: (page: string, data?: any) => void;
  application: Application;
}

function StatusBadge({ status }: { status: Application['status'] }) {
  if (status === 'pending')
    return (
      <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-300 dark:border-yellow-700">
        <Clock className="h-3 w-3 mr-1" /> Pending
      </Badge>
    );
  if (status === 'approved')
    return (
      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border-green-300 dark:border-green-700">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 border-red-300 dark:border-red-700">
      <XCircle className="h-3 w-3 mr-1" /> Rejected
    </Badge>
  );
}

function BookingStatusBadge({ status }: { status: Booking['status'] }) {
  const map: Record<Booking['status'], { label: string; className: string }> = {
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 border-green-300' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700 border-blue-300' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-300' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  };
  const { label, className } = map[status] ?? map.pending;
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

export function PsychologistDetailPage({ onNavigate, application }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [accountStatus, setAccountStatus] = useState<Application['accountStatus']>(
    application.accountStatus,
  );

  useEffect(() => {
    loadBookings();
  }, []);

const loadBookings = async () => {
  setBookingsLoading(true);
  try {
    const data = await api.psychologist.getBookings(application.userId);
    const list: any[] = Array.isArray(data)
      ? data
      : (data as any).bookings ?? (data as any).items ?? (data as any).results ?? [];

    const mapped: Booking[] = list
      .filter((b: any) => b.psychologist?.id === application.userId)
      .map((b: any) => ({
        id: b.id ?? '',
        studentName: b.student?.full_name ?? 'Unknown',
        date: b.date ?? '',
        time: b.time ?? '',
        sessionType: b.session_type ?? '',
        status: b.status ?? 'pending',
        bookingType: b.booking_type ?? '',
        price: Number(b.price ?? 0),
      }));

    setBookings(mapped);
  } catch (error: any) {
    toast.error(error?.message ?? 'Failed to load bookings');
  } finally {
    setBookingsLoading(false);
  }
};

  const handleAccountStatusChange = async (suspend: boolean) => {
    if (!application.userId) {
      toast.error('Unable to update account status for this psychologist');
      return;
    }
    try {
      setStatusSubmitting(true);
      await api.admin.updateUserStatus(application.userId, suspend);
      const next: Application['accountStatus'] = suspend ? 'suspended' : 'active';
      setAccountStatus(next);
      toast.success(`Account ${suspend ? 'suspended' : 'activated'} successfully`);
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to update account status');
    } finally {
      setStatusSubmitting(false);
    }
  };

  return (
    <div className="container space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('admin-psychologist-management')}
            className="gap-1 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{application.fullName}</h1>
            <p className="text-muted-foreground text-sm">{application.specialization}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={application.status} />
          <Badge
            variant="outline"
            className={
              accountStatus === 'active'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 border-red-300'
            }
          >
            {accountStatus === 'active' ? 'Account Active' : 'Account Suspended'}
          </Badge>
          {accountStatus === 'active' ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleAccountStatusChange(true)}
              disabled={statusSubmitting}
            >
              <Ban className="h-4 w-4 mr-2" />
              {statusSubmitting ? 'Suspending...' : 'Suspend Account'}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleAccountStatusChange(false)}
              disabled={statusSubmitting}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {statusSubmitting ? 'Activating...' : 'Activate Account'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          {/* Contact & Professional at-a-glance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="break-all">{application.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>{application.location || '—'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>
                    Submitted {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>License: {application.licenseNumber || '—'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>{application.yearsOfExperience} years of experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>${application.hourlyRate} / hour</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Professional Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{application.bio || '—'}</p>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Education &amp; Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{application.qualifications || '—'}</p>
            </CardContent>
          </Card>

          {/* Certifications */}
          {application.certifications && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Certifications &amp; Additional Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{application.certifications}</p>
              </CardContent>
            </Card>
          )}

          {/* Review history */}
          {application.reviewedAt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">Reviewed by</Label>
                  <p className="font-medium">{application.reviewedBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reviewed on</Label>
                  <p className="font-medium">
                    {new Date(application.reviewedAt).toLocaleDateString()}
                  </p>
                </div>
                {application.reviewNotes && (
                  <Alert>
                    <AlertDescription>{application.reviewNotes}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Bookings ── */}
        <TabsContent value="bookings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>Sessions booked with {application.fullName}</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <p className="text-center text-muted-foreground py-10">Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">No bookings found</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-lg p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{booking.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.date} {booking.time && `· ${booking.time}`}
                          {booking.sessionType && ` · ${booking.sessionType}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">${booking.price}</span>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
