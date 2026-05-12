import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import {
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Loader2,
  Save,
  Star,
  UserCheck,
  FileText,
  Upload,
  GraduationCap,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { psychologistApi } from '../../utils/api-client';

interface PsychologistDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface AvailabilityRecord {
  id: string;
  psychologist_id: string;
  schedule: Record<string, { enabled: boolean; start: string; end: string }>;
  created_at?: string;
  updated_at?: string;
  working_days?: number;
  total_hours?: number;
}

interface DashboardBooking {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  time: string;
  sessionType: string;
  bookingType: string;
  status: string;
  notes: string;
  rejectionReason: string;
  sessionNotes: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  price: number;
  rating: number | null;
  isRecurring: boolean;
  recurringFrequency: string;
}

interface BookingNotesForm {
  meetingPlatform: 'zoom' | 'google_meet' | 'other';
  meetingLink: string;
  sessionSummary: string;
  presentingConcerns: string;
  observations: string;
  interventionsUsed: string;
  riskAssessment: string;
  homeworkAssigned: string;
  followUpPlan: string;
  nextSessionFocus: string;
  privateNotes: string;
  nextSessionRecommended: boolean;
}

interface ClientHistoryItem {
  studentEmail: string;
  studentName: string;
  bookings: DashboardBooking[];
  completedSessions: number;
  cancelledSessions: number;
  pendingSessions: number;
  latestBookingAt: number;
}

interface ProfessionalProfileForm {
  bio: string;
  hourlyRate: string;
  defaultSessionDuration: string;
  defaultBookingType: 'standard' | 'emergency';
  allowEmergencyBookings: boolean;
  isProfilePublic: boolean;
  acceptingNewClients: boolean;
  visibleProfileFields: {
    bio: boolean;
    location: boolean;
    phone_number: boolean;
    hourly_rate: boolean;
  };
}

const AVAILABILITY_DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_VISIBLE_PROFILE_FIELDS = {
  bio: true,
  location: true,
  phone_number: false,
  hourly_rate: true,
};

const DEFAULT_BOOKING_NOTES_FORM: BookingNotesForm = {
  meetingPlatform: 'zoom',
  meetingLink: '',
  sessionSummary: '',
  presentingConcerns: '',
  observations: '',
  interventionsUsed: '',
  riskAssessment: '',
  homeworkAssigned: '',
  followUpPlan: '',
  nextSessionFocus: '',
  privateNotes: '',
  nextSessionRecommended: false,
};

const createProfessionalProfileForm = (
  source: any,
  currentProfile?: any,
): ProfessionalProfileForm => ({
  bio: source?.bio ?? currentProfile?.bio ?? '',
  hourlyRate:
    source?.hourly_rate != null
      ? String(source.hourly_rate)
      : source?.hourlyRate != null
        ? String(source.hourlyRate)
        : '',
  defaultSessionDuration:
    source?.default_session_duration != null
      ? String(source.default_session_duration)
      : source?.defaultSessionDuration != null
        ? String(source.defaultSessionDuration)
        : '60',
  defaultBookingType:
    source?.default_booking_type === 'emergency' ||
    source?.defaultBookingType === 'emergency'
      ? 'emergency'
      : 'standard',
  allowEmergencyBookings:
    source?.allow_emergency_bookings ?? source?.allowEmergencyBookings ?? false,
  isProfilePublic: source?.is_profile_public ?? source?.isProfilePublic ?? true,
  acceptingNewClients:
    source?.accepting_new_clients ?? source?.acceptingNewClients ?? true,
  visibleProfileFields: {
    ...DEFAULT_VISIBLE_PROFILE_FIELDS,
    ...(source?.visible_profile_fields ?? source?.visibleProfileFields ?? {}),
  },
});

export function PsychologistDashboard({
  onNavigate,
}: PsychologistDashboardProps) {
  const { user } = useAuth();
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<
    'incomplete' | 'pending' | 'approved' | 'rejected'
  >('incomplete');
  const [application, setApplication] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    reviewCount: 0,
  });
  const [qualifications, setQualifications] = useState('');
  const [certifications, setCertifications] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isReapplying, setIsReapplying] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityRecord, setAvailabilityRecord] = useState<AvailabilityRecord | null>(null);
  const [hasAvailabilityRecord, setHasAvailabilityRecord] = useState(false);
  const [professionalProfile, setProfessionalProfile] =
    useState<ProfessionalProfileForm>(createProfessionalProfileForm(null));
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<DashboardBooking | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [doneDialogOpen, setDoneDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionReasonDialogOpen, setRejectionReasonDialogOpen] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState('');
  const [bookingNotes, setBookingNotes] = useState<BookingNotesForm>(
    DEFAULT_BOOKING_NOTES_FORM,
  );
  const [bookingActionLoadingId, setBookingActionLoadingId] = useState<
    string | null
  >(null);
  const [clientHistoryOpen, setClientHistoryOpen] = useState(false);
  const [selectedClientEmail, setSelectedClientEmail] = useState<string | null>(null);

  const getBookingDateTime = (booking: DashboardBooking) => {
    const isoTimeMatch = booking.time?.match(
      /^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
    );
    const withIsoTime = isoTimeMatch
      ? new Date(
          `${booking.date}T${booking.time.length === 5 ? `${booking.time}:00` : booking.time}`,
        )
      : null;

    if (withIsoTime && !Number.isNaN(withIsoTime.getTime())) {
      return withIsoTime;
    }

    const fallback = new Date(`${booking.date} ${booking.time}`);
    if (!Number.isNaN(fallback.getTime())) {
      return fallback;
    }

    return new Date(booking.date);
  };

  const formatBookingDate = (booking: DashboardBooking) => {
    const date = getBookingDateTime(booking);
    if (Number.isNaN(date.getTime())) {
      return `${booking.date || 'Date not set'} ${booking.time || ''}`.trim();
    }

    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const createBookingNotesForm = (source?: Record<string, any> | null): BookingNotesForm => ({
    meetingPlatform:
      source?.meeting_platform === 'google_meet' || source?.meeting_platform === 'other'
        ? source.meeting_platform
        : 'zoom',
    meetingLink: source?.meeting_link ?? '',
    sessionSummary: source?.session_summary ?? '',
    presentingConcerns: source?.presenting_concerns ?? '',
    observations: source?.observations ?? '',
    interventionsUsed: Array.isArray(source?.interventions_used)
      ? source.interventions_used.join('\n')
      : '',
    riskAssessment: source?.risk_assessment ?? '',
    homeworkAssigned: source?.homework_assigned ?? '',
    followUpPlan: source?.follow_up_plan ?? '',
    nextSessionFocus: source?.next_session_focus ?? '',
    privateNotes: source?.private_notes ?? '',
    nextSessionRecommended: Boolean(source?.next_session_recommended),
  });

  const normalizeDashboardBooking = (
    item: any,
    index: number,
  ): DashboardBooking => ({
    id: item.id ?? item._id ?? `booking-${index}`,
    studentName:
      item.student?.full_name ??
      item.student?.name ??
      item.student_name ??
      item.studentName ??
      item.user?.full_name ??
      item.user?.name ??
      'Student',
    studentEmail:
      item.student?.email ??
      item.student_email ??
      item.studentEmail ??
      item.user?.email ??
      '',
    date: item.date ?? item.booking_date ?? item.session_date ?? '',
    time: item.time ?? item.booking_time ?? item.session_time ?? '',
    sessionType: item.session_type ?? item.sessionType ?? 'Session',
    bookingType: item.booking_type ?? item.bookingType ?? 'standard',
    status: item.status ?? 'pending',
    notes: item.notes ?? '',
    rejectionReason: item.rejection_reason ?? item.rejectionReason ?? '',
    sessionNotes: item.session_notes ?? item.sessionNotes ?? null,
    createdAt: item.created_at ?? item.createdAt ?? '',
    updatedAt: item.updated_at ?? item.updatedAt ?? '',
    price: Number(item.price ?? item.hourly_rate ?? item.hourlyRate ?? 0),
    rating:
      item.rating != null
        ? Number(item.rating)
        : item.review_rating != null
          ? Number(item.review_rating)
          : null,
    isRecurring: Boolean(item.is_recurring ?? item.isRecurring),
    recurringFrequency: item.recurring_frequency ?? item.recurringFrequency ?? '',
  });

  const updateBookingStats = (normalizedBookings: DashboardBooking[]) => {
    const now = new Date();
    const upcomingBookings = normalizedBookings.filter((booking) => {
      const bookingDateTime = getBookingDateTime(booking);
      return (
        !Number.isNaN(bookingDateTime.getTime()) &&
        bookingDateTime > now &&
        booking.status !== 'cancelled' &&
        booking.status !== 'completed'
      );
    });

    const completedBookings = normalizedBookings.filter(
      (booking) => booking.status === 'completed',
    );
    const ratingValues = normalizedBookings
      .map((booking) => booking.rating)
      .filter((rating): rating is number => rating != null && !Number.isNaN(rating));

    setStats({
      totalBookings: normalizedBookings.length,
      upcomingBookings: upcomingBookings.length,
      completedSessions: completedBookings.length,
      totalEarnings: completedBookings.reduce((sum, booking) => sum + booking.price, 0),
      averageRating: ratingValues.length
        ? Number(
            (
              ratingValues.reduce((sum, rating) => sum + rating, 0) /
              ratingValues.length
            ).toFixed(1),
          )
        : 0,
      reviewCount: ratingValues.length,
    });
  };

  const loadBookings = async () => {
    if (!user) return;

    try {
      setBookingsLoading(true);
      setBookingsError(null);

      const data = await psychologistApi.getBookings();
      const list = Array.isArray(data)
        ? data
        : data.bookings ?? data.items ?? data.results ?? [];

      const normalizedBookings = list.map(normalizeDashboardBooking);

      setBookings(normalizedBookings);
      updateBookingStats(normalizedBookings);
    } catch (error: any) {
      console.error('[PsychologistDashboard] Error loading bookings:', error);
      setBookings([]);
      setStats((current) => ({
        ...current,
        totalBookings: 0,
        upcomingBookings: 0,
        completedSessions: 0,
        totalEarnings: 0,
        averageRating: 0,
        reviewCount: 0,
      }));
      setBookingsError(
        error?.message && error.message !== '[object Object]'
          ? error.message
          : 'Failed to load bookings. Please try again.',
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadPsychologistState = async () => {
      setApplicationLoading(true);
      setSettingsLoading(true);
      setProfessionalProfile(createProfessionalProfileForm(null, profile));

      // Load psychologist profile using email as key
      const profileData = localStorage.getItem(
        `psychologist_profile_${user.email}`,
      );
      const parsedProfile = profileData ? JSON.parse(profileData) : null;

      if (parsedProfile) {
        if (!isMounted) return;

        setProfile(parsedProfile);
        setProfessionalProfile(createProfessionalProfileForm(parsedProfile, parsedProfile));
        setQualifications(parsedProfile.qualifications || '');
        setCertifications(parsedProfile.certifications || '');
      } else {
        console.log(
          '[PsychologistDashboard] No local profile found for email:',
          user.email,
        );
      }

      try {
        const data = await psychologistApi.list();
        const list = Array.isArray(data) ? data : data.items ?? data.results ?? [];
        const userApp = list.find((item: any) => item.user?.email === user.email || item.email === user.email);

        if (!isMounted) return;

        if (userApp) {
          const normalizedApplication = {
            id: userApp.id ?? userApp._id ?? '',
            email: userApp.user?.email ?? userApp.email ?? user.email,
            fullName: userApp.user?.full_name ?? userApp.full_name ?? user.user_metadata?.full_name ?? 'Psychologist',
            licenseNumber: userApp.license_number ?? userApp.licenseNumber ?? '',
            specialization: userApp.specialization ?? '',
            yearsOfExperience: userApp.years_of_experience ?? userApp.yearsOfExperience ?? '',
            bio: userApp.bio ?? '',
            location: userApp.location ?? userApp.user?.location ?? '',
            hourlyRate: userApp.hourly_rate ?? userApp.hourlyRate ?? '',
            avatar: userApp.user?.avatar ?? user.avatar ?? '',
            phoneNumber:
              userApp.user?.phone_number ?? user.phone_number ?? '',
            qualifications:
              userApp.education_and_qualifications ?? userApp.qualifications ?? qualifications,
            certifications:
              userApp.certification_and_additional_training ?? userApp.certifications ?? certifications,
            status: userApp.status ?? (userApp.is_approved ? 'approved' : 'pending'),
            submittedAt: userApp.submitted_at ?? userApp.created_at ?? null,
            reviewedAt: userApp.reviewed_at ?? userApp.updated_at ?? null,
            reviewedBy: userApp.reviewed_by ?? null,
            reviewNotes: userApp.review_notes ?? userApp.reviewNotes ?? '',
          };

          setApplication(normalizedApplication);
          setApplicationStatus(normalizedApplication.status);
          setProfessionalProfile(
            createProfessionalProfileForm(normalizedApplication, parsedProfile),
          );

          setQualifications((current) =>
            current || normalizedApplication.qualifications || '',
          );
          setCertifications((current) =>
            current || normalizedApplication.certifications || '',
          );
          setProfile((current: any) =>
            current || {
              email: normalizedApplication.email,
              fullName: normalizedApplication.fullName,
              licenseNumber: normalizedApplication.licenseNumber,
              specialization: normalizedApplication.specialization,
              yearsOfExperience: normalizedApplication.yearsOfExperience,
              bio: normalizedApplication.bio,
              location: normalizedApplication.location,
              hourlyRate: normalizedApplication.hourlyRate,
              avatar: normalizedApplication.avatar,
              phoneNumber: normalizedApplication.phoneNumber,
              status: normalizedApplication.status,
            },
          );
        } else if (parsedProfile) {
          setApplication(null);
          setApplicationStatus('incomplete');
          setProfessionalProfile(createProfessionalProfileForm(parsedProfile, parsedProfile));
        } else {
          setApplication(null);
          setApplicationStatus('incomplete');
          setProfessionalProfile(createProfessionalProfileForm(null, null));
        }
      } catch (error) {
        console.error('[PsychologistDashboard] Error loading application status:', error);

        if (!isMounted) return;

        const apps = JSON.parse(
          localStorage.getItem('psychologist_applications') || '[]',
        );
        const userApp = apps.find((app: any) => app.email === user.email);

        if (userApp) {
          setApplication(userApp);
          setApplicationStatus(userApp.status);
          setProfessionalProfile(createProfessionalProfileForm(userApp, parsedProfile));
        } else {
          setApplicationStatus(parsedProfile ? 'incomplete' : 'incomplete');
          setProfessionalProfile(createProfessionalProfileForm(parsedProfile, parsedProfile));
        }
      } finally {
        if (isMounted) {
          setApplicationLoading(false);
          setSettingsLoading(false);
        }
      }
    };

    loadPsychologistState();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadBookings();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        const response = await psychologistApi.getAvailability(user.id);

        if (!isMounted) return;

        setAvailabilityRecord(response);
        setHasAvailabilityRecord(true);
      } catch (error: any) {
        if (!isMounted) return;

        const availabilityErrorMessage = String(error?.message || '').toLowerCase();
        const isNotFound =
          availabilityErrorMessage.includes('404') ||
          availabilityErrorMessage.includes('no availability') ||
          availabilityErrorMessage.includes('availability schedule');

        if (!isNotFound) {
          console.error('[PsychologistDashboard] Error loading availability:', error);
          toast.error(error?.message ?? 'Failed to load availability');
        }

        setAvailabilityRecord(null);
        setHasAvailabilityRecord(false);
      } finally {
        if (isMounted) {
          setAvailabilityLoading(false);
        }
      }
    };

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSubmitCredentials = async () => {
    if (!qualifications.trim()) {
      toast.error('Please add your qualifications before submitting');
      return;
    }

    if (!user) {
      toast.error('No user session found. Please log in again.');
      return;
    }

    setSubmitting(true);

    try {
      await psychologistApi.updateProfile({
        qualifications,
        certifications: certifications.trim() || undefined,
        is_approved: false,
      });

      // If profile doesn't exist, create a minimal one from user data
      let currentProfile = profile;
      if (!currentProfile) {
        currentProfile = {
          email: user.email,
          fullName: user.user_metadata?.full_name || 'Psychologist',
          licenseNumber: '',
          specialization: '',
          yearsOfExperience: '',
          bio: '',
          location: '',
          createdAt: new Date().toISOString(),
          status: 'incomplete',
        };
        setProfile(currentProfile);
      }

      // Create application for admin review
      const applicationId = `psych_app_${Date.now()}`;
      const applications = JSON.parse(
        localStorage.getItem('psychologist_applications') || '[]',
      );

      const newApplication = {
        id: applicationId,
        email: user.email,
        fullName: currentProfile.fullName,
        licenseNumber: currentProfile.licenseNumber,
        specialization: currentProfile.specialization,
        yearsOfExperience: currentProfile.yearsOfExperience,
        bio: currentProfile.bio,
        location: currentProfile.location,
        qualifications,
        certifications,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        reviewNotes: '',
      };

      applications.push(newApplication);
      localStorage.setItem(
        'psychologist_applications',
        JSON.stringify(applications),
      );

      // Update profile with credentials
      const updatedProfile = {
        ...currentProfile,
        qualifications,
        certifications,
        status: 'pending',
        applicationId,
      };
      localStorage.setItem(
        `psychologist_profile_${user.email}`,
        JSON.stringify(updatedProfile),
      );

      setProfile(updatedProfile);
      setApplication(newApplication);
      setApplicationStatus('pending');
      setIsReapplying(false);

      toast.success('Credentials submitted for verification!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit credentials';
      toast.error(errorMessage);
      console.error(
        '[PsychologistDashboard] Error submitting credentials:',
        err,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNewApplication = () => {
    setQualifications(application?.qualifications || qualifications || '');
    setCertifications(application?.certifications || certifications || '');
    setIsReapplying(true);
    setApplicationStatus('incomplete');
  };

  const handleCancelNewApplication = () => {
    setIsReapplying(false);
    setApplicationStatus('rejected');
  };

  const handleProfessionalProfileFieldChange = (
    field: keyof ProfessionalProfileForm,
    value: ProfessionalProfileForm[keyof ProfessionalProfileForm],
  ) => {
    setProfessionalProfile((current) => ({ ...current, [field]: value }));
  };

  const handleVisibleProfileFieldChange = (
    field: keyof ProfessionalProfileForm['visibleProfileFields'],
    checked: boolean,
  ) => {
    setProfessionalProfile((current) => ({
      ...current,
      visibleProfileFields: {
        ...current.visibleProfileFields,
        [field]: checked,
      },
    }));
  };

  const handleSaveProfessionalProfile = async () => {
    const trimmedHourlyRate = professionalProfile.hourlyRate.trim();
    if (trimmedHourlyRate && Number.isNaN(Number(trimmedHourlyRate))) {
      toast.error('Hourly rate must be a valid number');
      return;
    }

    setSettingsSaving(true);

    try {
      const updatedProfile = await psychologistApi.updateProfile({
        bio: professionalProfile.bio.trim() || undefined,
        hourly_rate: trimmedHourlyRate ? Number(trimmedHourlyRate) : undefined,
        default_session_duration: Number(professionalProfile.defaultSessionDuration),
        default_booking_type: professionalProfile.defaultBookingType,
        allow_emergency_bookings: professionalProfile.allowEmergencyBookings,
        is_profile_public: professionalProfile.isProfilePublic,
        accepting_new_clients: professionalProfile.acceptingNewClients,
        visible_profile_fields: professionalProfile.visibleProfileFields,
      });

      const nextForm = createProfessionalProfileForm(updatedProfile, profile);
      setProfessionalProfile(nextForm);
      setProfile((current: any) => ({
        ...(current || {}),
        bio: updatedProfile?.bio ?? nextForm.bio,
        hourlyRate: nextForm.hourlyRate,
        defaultSessionDuration: nextForm.defaultSessionDuration,
        defaultBookingType: nextForm.defaultBookingType,
        allowEmergencyBookings: nextForm.allowEmergencyBookings,
        isProfilePublic: nextForm.isProfilePublic,
        acceptingNewClients: nextForm.acceptingNewClients,
        visibleProfileFields: nextForm.visibleProfileFields,
      }));
      setApplication((current: any) =>
        current
          ? {
              ...current,
              bio: updatedProfile?.bio ?? nextForm.bio,
              hourlyRate: nextForm.hourlyRate,
              defaultSessionDuration: nextForm.defaultSessionDuration,
              defaultBookingType: nextForm.defaultBookingType,
              allowEmergencyBookings: nextForm.allowEmergencyBookings,
              isProfilePublic: nextForm.isProfilePublic,
              acceptingNewClients: nextForm.acceptingNewClients,
              visibleProfileFields: nextForm.visibleProfileFields,
            }
          : current,
      );

      if (user?.email) {
        localStorage.setItem(
          `psychologist_profile_${user.email}`,
          JSON.stringify({
            ...(profile || {}),
            bio: updatedProfile?.bio ?? nextForm.bio,
            hourlyRate: nextForm.hourlyRate,
            defaultSessionDuration: nextForm.defaultSessionDuration,
            defaultBookingType: nextForm.defaultBookingType,
            allowEmergencyBookings: nextForm.allowEmergencyBookings,
            isProfilePublic: nextForm.isProfilePublic,
            acceptingNewClients: nextForm.acceptingNewClients,
            visibleProfileFields: nextForm.visibleProfileFields,
          }),
        );
      }

      toast.success('Professional profile updated successfully');
    } catch (error) {
      console.error('[PsychologistDashboard] Error updating professional profile:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update professional profile',
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  const resetBookingActionState = () => {
    setSelectedBooking(null);
    setRejectionReason('');
    setBookingNotes({ ...DEFAULT_BOOKING_NOTES_FORM });
  };

  const handleRejectDialogChange = (open: boolean) => {
    setRejectDialogOpen(open);
    if (!open) {
      resetBookingActionState();
    }
  };

  const handleDoneDialogChange = (open: boolean) => {
    setDoneDialogOpen(open);
    if (!open) {
      resetBookingActionState();
    }
  };

  const handleClientHistoryDialogChange = (open: boolean) => {
    setClientHistoryOpen(open);
    if (!open) {
      setSelectedClientEmail(null);
    }
  };

  const openRejectDialog = (booking: DashboardBooking) => {
    setSelectedBooking(booking);
    setRejectionReason(booking.rejectionReason || '');
    setRejectDialogOpen(true);
  };

  const openDoneDialog = (booking: DashboardBooking) => {
    setSelectedBooking(booking);
    setBookingNotes(createBookingNotesForm(booking.sessionNotes));
    setDoneDialogOpen(true);
  };

  const openRejectionReasonDialog = (reason: string) => {
    setSelectedRejectionReason(reason);
    setRejectionReasonDialogOpen(true);
  };

  const openClientHistoryDialog = (studentEmail: string) => {
    setSelectedClientEmail(studentEmail);
    setClientHistoryOpen(true);
  };

  const handleBookingNotesFieldChange = (
    field: keyof BookingNotesForm,
    value: BookingNotesForm[keyof BookingNotesForm],
  ) => {
    setBookingNotes((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleConfirmBooking = async (booking: DashboardBooking) => {
    setBookingActionLoadingId(booking.id);

    try {
      await psychologistApi.updateBooking({
        booking_id: booking.id,
        status: 'confirmed',
      });
      await loadBookings();
      toast.success('Booking confirmed successfully');
    } catch (error) {
      console.error('[PsychologistDashboard] Error confirming booking:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to confirm booking',
      );
    } finally {
      setBookingActionLoadingId(null);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking) return;

    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setBookingActionLoadingId(selectedBooking.id);

    try {
      await psychologistApi.updateBooking({
        booking_id: selectedBooking.id,
        status: 'cancelled',
        rejection_reason: trimmedReason,
      });
      handleRejectDialogChange(false);
      await loadBookings();
      toast.success('Booking rejected and client notified');
    } catch (error) {
      console.error('[PsychologistDashboard] Error rejecting booking:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject booking',
      );
    } finally {
      setBookingActionLoadingId(null);
    }
  };

  const handleCompleteBooking = async () => {
    if (!selectedBooking) return;

    const trimmedSummary = bookingNotes.sessionSummary.trim();
    if (!trimmedSummary) {
      toast.error('Session summary is required before marking this booking done');
      return;
    }

    setBookingActionLoadingId(selectedBooking.id);

    try {
      await psychologistApi.updateBookingNotes(selectedBooking.id, {
        meeting_platform: bookingNotes.meetingPlatform,
        meeting_link: bookingNotes.meetingLink.trim() || undefined,
        session_summary: trimmedSummary,
        presenting_concerns: bookingNotes.presentingConcerns.trim() || undefined,
        observations: bookingNotes.observations.trim() || undefined,
        interventions_used: bookingNotes.interventionsUsed
          .split(/\r?\n|,/)
          .map((item) => item.trim())
          .filter(Boolean),
        risk_assessment: bookingNotes.riskAssessment.trim() || undefined,
        homework_assigned: bookingNotes.homeworkAssigned.trim() || undefined,
        follow_up_plan: bookingNotes.followUpPlan.trim() || undefined,
        next_session_focus: bookingNotes.nextSessionFocus.trim() || undefined,
        private_notes: bookingNotes.privateNotes.trim() || undefined,
        next_session_recommended: bookingNotes.nextSessionRecommended,
      });

      await psychologistApi.updateBooking({
        booking_id: selectedBooking.id,
        status: 'completed',
      });

      handleDoneDialogChange(false);
      await loadBookings();
      toast.success('Session marked as done and notes saved');
    } catch (error) {
      console.error('[PsychologistDashboard] Error completing booking:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to complete booking',
      );
    } finally {
      setBookingActionLoadingId(null);
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge>Confirmed</Badge>;
      case 'pending':
        return (
          <Badge variant='outline' className='border-yellow-500 text-yellow-700'>
            Pending
          </Badge>
        );
      case 'completed':
        return <Badge variant='secondary'>Done</Badge>;
      case 'cancelled':
        return <Badge variant='destructive'>Rejected</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const enabledAvailabilityDays = availabilityRecord
    ? AVAILABILITY_DAYS.filter(
        ({ key }) => availabilityRecord.schedule?.[key]?.enabled,
      )
    : [];

  const computedWorkingDays = availabilityRecord?.working_days ?? enabledAvailabilityDays.length;
  const computedTotalHours =
    availabilityRecord?.total_hours ??
    enabledAvailabilityDays.reduce((total, { key }) => {
      const day = availabilityRecord?.schedule?.[key];
      if (!day?.enabled || !day.start || !day.end) return total;

      const [startHour, startMinute] = day.start.split(':').map(Number);
      const [endHour, endMinute] = day.end.split(':').map(Number);
      const startValue = startHour + startMinute / 60;
      const endValue = endHour + endMinute / 60;
      return total + Math.max(endValue - startValue, 0);
    }, 0);

  const nextUpcomingBooking = bookings
    .filter((booking) => {
      const bookingDateTime = getBookingDateTime(booking);
      return (
        !Number.isNaN(bookingDateTime.getTime()) &&
        bookingDateTime > new Date() &&
        booking.status !== 'cancelled' &&
        booking.status !== 'completed'
      );
    })
    .sort(
      (a, b) => getBookingDateTime(a).getTime() - getBookingDateTime(b).getTime(),
    )[0];

  const clientHistory = Object.values(
    bookings.reduce<Record<string, ClientHistoryItem>>((accumulator, booking) => {
      const key = booking.studentEmail || booking.studentName || booking.id;
      if (!accumulator[key]) {
        accumulator[key] = {
          studentEmail: booking.studentEmail,
          studentName: booking.studentName,
          bookings: [],
          completedSessions: 0,
          cancelledSessions: 0,
          pendingSessions: 0,
          latestBookingAt: Number.NEGATIVE_INFINITY,
        };
      }

      accumulator[key].bookings.push(booking);
      accumulator[key].latestBookingAt = Math.max(
        accumulator[key].latestBookingAt,
        getBookingDateTime(booking).getTime(),
      );

      if (booking.status === 'completed') {
        accumulator[key].completedSessions += 1;
      } else if (booking.status === 'cancelled') {
        accumulator[key].cancelledSessions += 1;
      } else if (booking.status === 'pending') {
        accumulator[key].pendingSessions += 1;
      }

      return accumulator;
    }, {}),
  )
    .map((client) => ({
      ...client,
      bookings: [...client.bookings].sort(
        (a, b) => getBookingDateTime(b).getTime() - getBookingDateTime(a).getTime(),
      ),
    }))
    .sort((a, b) => b.latestBookingAt - a.latestBookingAt);

  const selectedClientHistory =
    clientHistory.find((client) => client.studentEmail === selectedClientEmail) ?? null;

  if (applicationLoading) {
    return (
      <div className='container max-w-4xl mx-auto py-12 px-4'>
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            Loading application status...
          </CardContent>
        </Card>
      </div>
    );
  }

  // Incomplete profile view - need to upload credentials
  if (applicationStatus === 'incomplete') {
    return (
      <div className='container max-w-4xl mx-auto py-12 px-4'>
        <Card className='border-2 border-primary/20'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
              <GraduationCap className='h-8 w-8 text-primary' />
            </div>
            <CardTitle className='text-2xl'>Complete Your Profile</CardTitle>
            <CardDescription>
              Upload your qualifications and certifications to get verified
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                You need to submit your credentials for verification before you
                can accept consultation bookings.
              </AlertDescription>
            </Alert>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='qualifications'>
                  Education & Qualifications *
                </Label>
                <Textarea
                  id='qualifications'
                  placeholder='Ph.D. in Clinical Psychology, Harvard University, 2015&#10;M.A. in Psychology, Stanford University, 2010&#10;B.A. in Psychology, UCLA, 2008'
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  rows={6}
                  required
                />
                <p className='text-xs text-muted-foreground'>
                  List your degrees, universities, and graduation years
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='certifications'>
                  Certifications & Additional Training
                </Label>
                <Textarea
                  id='certifications'
                  placeholder='Licensed Clinical Psychologist (State of NY)&#10;Certified Cognitive Behavioral Therapist&#10;EMDR Therapy Certification'
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  rows={4}
                />
                <p className='text-xs text-muted-foreground'>
                  List any professional licenses, certifications, or specialized
                  training
                </p>
              </div>
            </div>

            <div className='bg-muted/50 rounded-lg p-6 space-y-3'>
              <h4 className='font-semibold'>What happens after submission:</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>
                    Our team will review your credentials within 2-3 business
                    days
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>
                    You'll receive an email notification once reviewed
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>
                    If approved, you'll gain full access to accept bookings
                  </span>
                </li>
              </ul>
            </div>

            <div className='flex gap-3'>
              {isReapplying ? (
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={handleCancelNewApplication}
                  disabled={submitting}
                >
                  Back
                </Button>
              ) : null}
              <Button
                onClick={handleSubmitCredentials}
                className='w-full flex-1'
                disabled={submitting || !qualifications.trim()}
              >
                {submitting ? (
                  <>
                    <Clock className='mr-2 h-4 w-4 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-4 w-4' />
                    Submit for Verification
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending approval view
  if (applicationStatus === 'pending') {
    return (
      <div className='container max-w-4xl mx-auto py-12 px-4'>
        <Card className='border-2 border-amber-200/70 dark:border-amber-800/70'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40'>
              <Clock className='h-8 w-8 text-amber-700 dark:text-amber-300' />
            </div>
            <CardTitle className='text-2xl'>Application Under Review</CardTitle>
            <CardDescription>
              Your psychologist account application is being reviewed by our
              team
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='bg-muted/50 rounded-lg p-6 space-y-4'>
              <h3 className='font-semibold text-lg'>Application Status</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between py-2 border-b'>
                  <span className='text-muted-foreground'>Status</span>
                  <Badge
                    variant='outline'
                    className='border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                  >
                    <Clock className='h-3 w-3 mr-1' />
                    Pending Review
                  </Badge>
                </div>
                <div className='flex items-center justify-between py-2 border-b'>
                  <span className='text-muted-foreground'>Submitted</span>
                  <span className='font-medium'>
                    {application?.submittedAt
                      ? new Date(application.submittedAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span className='text-muted-foreground'>
                    Expected Response
                  </span>
                  <span className='font-medium'>2-3 business days</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                You'll receive an email notification at{' '}
                <strong>{application?.email}</strong> once your application has
                been reviewed.
              </AlertDescription>
            </Alert>

            <div className='bg-muted/50 rounded-lg p-6'>
              <h4 className='font-semibold mb-3'>What's being verified:</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Professional license and credentials</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Educational qualifications and certifications</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Professional background and experience</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Compliance with platform standards</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rejected view
  if (applicationStatus === 'rejected') {
    return (
      <div className='container max-w-4xl mx-auto py-12 px-4'>
        <Card className='border-2 border-red-200 dark:border-red-900'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
              <XCircle className='h-8 w-8 text-red-600 dark:text-red-500' />
            </div>
            <CardTitle className='text-2xl'>Application Not Approved</CardTitle>
            <CardDescription>
              Unfortunately, your application did not meet our current
              requirements
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {application?.reviewNotes && (
              <Alert variant='destructive'>
                <AlertDescription>
                  <strong>Reason:</strong> {application.reviewNotes}
                </AlertDescription>
              </Alert>
            )}

            <div className='bg-muted/50 rounded-lg p-6 space-y-3'>
              <h4 className='font-semibold'>What you can do:</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Review the feedback provided above</li>
                <li>• Ensure all credentials are current and valid</li>
                <li>• Update your qualifications if needed</li>
                <li>• Contact support if you have questions</li>
              </ul>
            </div>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => window.open('mailto:support@cerebrolearn.com', '_blank')}
              >
                Contact Support
              </Button>
              <Button className='flex-1' onClick={handleStartNewApplication}>
                Submit New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Approved - Full Dashboard
  return (
    <div className='container max-w-7xl mx-auto py-8 px-4'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <h1 className='text-3xl font-bold'>Psychologist Dashboard</h1>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => onNavigate('psychologist-earnings')}
            >
              <DollarSign className='h-4 w-4 mr-2' />
              View Earnings
            </Button>
            <Button onClick={() => onNavigate('psychologist-availability')}>
              <Calendar className='h-4 w-4 mr-2' />
              Manage Availability
            </Button>
          </div>
        </div>
        <p className='text-muted-foreground'>
          Manage your consultations and track your impact
        </p>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Upcoming Sessions
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.upcomingBookings}</div>
            <p className='text-xs text-muted-foreground mt-1'>
              {nextUpcomingBooking
                ? `Next: ${nextUpcomingBooking.date} at ${nextUpcomingBooking.time}`
                : 'No upcoming sessions'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Sessions
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.completedSessions}</div>
            <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
              <TrendingUp className='h-3 w-3 text-green-500' />
              {stats.totalBookings > 0
                ? `${stats.totalBookings} total bookings`
                : 'No sessions yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Earnings
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${stats.totalEarnings.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {stats.completedSessions > 0
                ? `$${(stats.totalEarnings / stats.completedSessions).toFixed(0)} per session avg`
                : 'No completed sessions yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Client Rating
            </CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold flex items-center gap-2'>
              {stats.reviewCount > 0 ? stats.averageRating.toFixed(1) : '—'}
              <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {stats.reviewCount > 0
                ? `Based on ${stats.reviewCount} reviews`
                : 'No reviews yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='bookings' className='space-y-6'>
        <div className='flex items-center justify-between mb-4'>
          <TabsList className='grid w-full grid-cols-4 lg:w-auto'>
            <TabsTrigger value='bookings'>Bookings</TabsTrigger>
            <TabsTrigger value='availability'>Availability</TabsTrigger>
            <TabsTrigger value='clients'>Clients</TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
          </TabsList>
          <Button onClick={() => onNavigate('psychologist-sessions')}>
            <Calendar className='h-4 w-4 mr-2' />
            Session Dashboard
          </Button>
        </div>

        {/* Bookings Tab */}
        <TabsContent value='bookings' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Consultations</CardTitle>
              <CardDescription>
                Your scheduled sessions with students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className='text-center py-12 text-muted-foreground'>
                  <Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>Loading bookings...</p>
                </div>
              ) : bookingsError ? (
                <div className='text-center py-12 text-muted-foreground space-y-2'>
                  <AlertCircle className='h-12 w-12 mx-auto opacity-50' />
                  <p className='font-medium text-foreground'>Unable to load bookings</p>
                  <p>{bookingsError}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className='text-center py-12 text-muted-foreground'>
                  <Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>No bookings found yet</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className='flex flex-col justify-between gap-4 overflow-hidden rounded-lg border p-4 transition-colors hover:bg-muted/50 lg:flex-row lg:items-start'
                    >
                      <div className='min-w-0 flex-1 space-y-2'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                            <UserCheck className='h-5 w-5 text-primary' />
                          </div>
                          <div>
                            <h4 className='font-semibold'>{booking.studentName}</h4>
                            <p className='text-sm text-muted-foreground'>
                              {booking.studentEmail || 'No student email'}
                            </p>
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-4 text-sm text-muted-foreground ml-13'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {booking.date || 'Date not set'}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-4 w-4' />
                            {booking.time || 'Time not set'}
                          </span>
                          <span className='flex items-center gap-1'>
                            <FileText className='h-4 w-4' />
                            {booking.sessionType}
                          </span>
                        </div>
                        {booking.notes ? (
                          <div className='ml-13 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground'>
                            <span className='font-medium text-foreground'>Client note:</span>{' '}
                            {booking.notes}
                          </div>
                        ) : null}
                        {booking.status === 'cancelled' && booking.rejectionReason ? (
                          <div className='ml-13'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => openRejectionReasonDialog(booking.rejectionReason)}
                            >
                              <AlertCircle className='mr-2 h-4 w-4' />
                              View rejection reason
                            </Button>
                          </div>
                        ) : null}
                        {booking.status === 'completed' &&
                        booking.sessionNotes?.session_summary ? (
                          <div className='ml-13 rounded-lg border bg-muted/30 p-3 text-sm'>
                            <span className='font-medium'>Session summary:</span>{' '}
                            {booking.sessionNotes.session_summary}
                          </div>
                        ) : null}
                        <div className='flex items-center gap-2 ml-13'>
                          <Badge variant='secondary'>
                            {booking.bookingType}
                          </Badge>
                          {booking.price > 0 ? (
                            <Badge variant='outline'>${booking.price}</Badge>
                          ) : null}
                          {booking.isRecurring && booking.recurringFrequency ? (
                            <Badge variant='outline'>
                              {booking.recurringFrequency}
                            </Badge>
                          ) : null}
                          {getBookingStatusBadge(booking.status)}
                        </div>
                      </div>
                      <div className='mt-4 flex flex-wrap gap-2 lg:mt-0 lg:max-w-[320px] lg:shrink-0 lg:justify-end'>
                        {booking.status === 'pending' ? (
                          <>
                            <Button
                              size='sm'
                              onClick={() => handleConfirmBooking(booking)}
                              disabled={bookingActionLoadingId === booking.id}
                            >
                              {bookingActionLoadingId === booking.id ? (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              ) : (
                                <CheckCircle2 className='mr-2 h-4 w-4' />
                              )}
                              Confirm
                            </Button>
                            <Button
                              size='sm'
                              variant='destructive'
                              onClick={() => openRejectDialog(booking)}
                              disabled={bookingActionLoadingId === booking.id}
                            >
                              <XCircle className='mr-2 h-4 w-4' />
                              Reject
                            </Button>
                          </>
                        ) : null}

                        {booking.status === 'confirmed' ? (
                          <Button
                            size='sm'
                            onClick={() => openDoneDialog(booking)}
                            disabled={bookingActionLoadingId === booking.id}
                          >
                            <FileText className='mr-2 h-4 w-4' />
                            Done
                          </Button>
                        ) : null}

                        {booking.status === 'completed' ? (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => openDoneDialog(booking)}
                            disabled={bookingActionLoadingId === booking.id}
                          >
                            <FileText className='mr-2 h-4 w-4' />
                            View Notes
                          </Button>
                        ) : null}

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={rejectDialogOpen} onOpenChange={handleRejectDialogChange}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject booking</DialogTitle>
                <DialogDescription>
                  Provide a reason for the rejection. This will be shown to the
                  client and included in the Slack notification.
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-2'>
                <Label htmlFor='booking-rejection-reason'>Rejection reason</Label>
                <Textarea
                  id='booking-rejection-reason'
                  rows={5}
                  placeholder='Explain briefly why this booking cannot be accepted.'
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleRejectDialogChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  onClick={handleRejectBooking}
                  disabled={
                    !selectedBooking || bookingActionLoadingId === selectedBooking.id
                  }
                >
                  {selectedBooking && bookingActionLoadingId === selectedBooking.id ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : null}
                  Submit rejection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={rejectionReasonDialogOpen}
            onOpenChange={setRejectionReasonDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rejection reason</DialogTitle>
                <DialogDescription>
                  This is the reason shared for the rejected booking.
                </DialogDescription>
              </DialogHeader>

              <div className='rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap break-words'>
                {selectedRejectionReason}
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setRejectionReasonDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={doneDialogOpen} onOpenChange={handleDoneDialogChange}>
            <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Session completion notes</DialogTitle>
                <DialogDescription>
                  Capture what happened during the session before marking this
                  booking as done.
                </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='meeting-platform'>Meeting platform</Label>
                  <Select
                    value={bookingNotes.meetingPlatform}
                    onValueChange={(value: 'zoom' | 'google_meet' | 'other') =>
                      handleBookingNotesFieldChange('meetingPlatform', value)
                    }
                  >
                    <SelectTrigger id='meeting-platform'>
                      <SelectValue placeholder='Select platform' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='zoom'>Zoom</SelectItem>
                      <SelectItem value='google_meet'>Google Meet</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='meeting-link'>Meeting link</Label>
                  <Input
                    id='meeting-link'
                    placeholder='https://...'
                    value={bookingNotes.meetingLink}
                    onChange={(e) =>
                      handleBookingNotesFieldChange('meetingLink', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='session-summary'>Session summary</Label>
                  <Textarea
                    id='session-summary'
                    rows={4}
                    placeholder='Summarize what transpired during the session.'
                    value={bookingNotes.sessionSummary}
                    onChange={(e) =>
                      handleBookingNotesFieldChange('sessionSummary', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='presenting-concerns'>Presenting concerns</Label>
                  <Textarea
                    id='presenting-concerns'
                    rows={3}
                    value={bookingNotes.presentingConcerns}
                    onChange={(e) =>
                      handleBookingNotesFieldChange(
                        'presentingConcerns',
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='observations'>Observations</Label>
                  <Textarea
                    id='observations'
                    rows={3}
                    value={bookingNotes.observations}
                    onChange={(e) =>
                      handleBookingNotesFieldChange('observations', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='interventions-used'>Interventions used</Label>
                  <Textarea
                    id='interventions-used'
                    rows={3}
                    placeholder='One per line or comma separated'
                    value={bookingNotes.interventionsUsed}
                    onChange={(e) =>
                      handleBookingNotesFieldChange(
                        'interventionsUsed',
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='risk-assessment'>Risk assessment</Label>
                  <Textarea
                    id='risk-assessment'
                    rows={3}
                    value={bookingNotes.riskAssessment}
                    onChange={(e) =>
                      handleBookingNotesFieldChange(
                        'riskAssessment',
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='homework-assigned'>Homework assigned</Label>
                  <Textarea
                    id='homework-assigned'
                    rows={3}
                    value={bookingNotes.homeworkAssigned}
                    onChange={(e) =>
                      handleBookingNotesFieldChange(
                        'homeworkAssigned',
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='follow-up-plan'>Follow-up plan</Label>
                  <Textarea
                    id='follow-up-plan'
                    rows={3}
                    value={bookingNotes.followUpPlan}
                    onChange={(e) =>
                      handleBookingNotesFieldChange('followUpPlan', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='next-session-focus'>Next session focus</Label>
                  <Textarea
                    id='next-session-focus'
                    rows={3}
                    value={bookingNotes.nextSessionFocus}
                    onChange={(e) =>
                      handleBookingNotesFieldChange(
                        'nextSessionFocus',
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='private-notes'>Private notes</Label>
                  <Textarea
                    id='private-notes'
                    rows={3}
                    value={bookingNotes.privateNotes}
                    onChange={(e) =>
                      handleBookingNotesFieldChange('privateNotes', e.target.value)
                    }
                  />
                </div>

                <div className='md:col-span-2 flex items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-1'>
                    <Label>Recommend a follow-up session</Label>
                    <p className='text-sm text-muted-foreground'>
                      Toggle this if the client should schedule another session.
                    </p>
                  </div>
                  <Switch
                    checked={bookingNotes.nextSessionRecommended}
                    onCheckedChange={(checked) =>
                      handleBookingNotesFieldChange(
                        'nextSessionRecommended',
                        checked,
                      )
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleDoneDialogChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  onClick={handleCompleteBooking}
                  disabled={
                    !selectedBooking || bookingActionLoadingId === selectedBooking.id
                  }
                >
                  {selectedBooking && bookingActionLoadingId === selectedBooking.id ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : null}
                  Save notes and mark done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value='availability' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>
                Set your working hours and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className='text-center py-12 text-muted-foreground'>
                  <Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>Loading availability...</p>
                </div>
              ) : !hasAvailabilityRecord ? (
                <div className='text-center py-12 text-muted-foreground space-y-4'>
                  <Calendar className='h-12 w-12 mx-auto opacity-50' />
                  <div className='space-y-1'>
                    <p className='font-medium text-foreground'>No availability set yet</p>
                    <p>
                      You haven&apos;t configured your working hours yet. Add your schedule so students can book sessions.
                    </p>
                  </div>
                  <Button onClick={() => onNavigate('psychologist-availability')}>
                    <Calendar className='h-4 w-4 mr-2' />
                    Set Availability
                  </Button>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card>
                      <CardContent className='pt-6'>
                        <p className='text-sm text-muted-foreground'>Working Days</p>
                        <p className='text-2xl font-bold mt-1'>{computedWorkingDays}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className='pt-6'>
                        <p className='text-sm text-muted-foreground'>Total Hours</p>
                        <p className='text-2xl font-bold mt-1'>{Number(computedTotalHours).toFixed(1)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {enabledAvailabilityDays.length > 0 ? (
                    <div className='space-y-3'>
                      {enabledAvailabilityDays.map(({ key, label }) => {
                        const day = availabilityRecord.schedule[key];
                        return (
                          <div
                            key={key}
                            className='flex items-center justify-between rounded-lg border p-4'
                          >
                            <div>
                              <p className='font-medium'>{label}</p>
                              <p className='text-sm text-muted-foreground'>Available for sessions</p>
                            </div>
                            <Badge variant='outline'>
                              {day.start} - {day.end}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Your availability record exists, but no working days are currently enabled.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className='flex justify-end'>
                    <Button onClick={() => onNavigate('psychologist-availability')}>
                      <Calendar className='h-4 w-4 mr-2' />
                      Manage Availability
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value='clients' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Client History</CardTitle>
              <CardDescription>
                View your current clients and open each client&apos;s booking notes history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className='py-12 text-center text-muted-foreground'>
                  <Users className='mx-auto mb-4 h-12 w-12 opacity-50' />
                  <p>Loading clients...</p>
                </div>
              ) : clientHistory.length === 0 ? (
                <div className='py-12 text-center text-muted-foreground'>
                  <Users className='mx-auto mb-4 h-12 w-12 opacity-50' />
                  <p>No clients found yet</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {clientHistory.map((client) => (
                    <div
                      key={client.studentEmail || client.studentName}
                      className='flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4'
                    >
                      <div className='flex min-w-0 flex-1 items-center gap-3'>
                        <Avatar className='h-12 w-12'>
                          <AvatarFallback>
                            {(client.studentName || 'C').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                          <p className='truncate font-semibold'>{client.studentName}</p>
                          <p className='truncate text-sm text-muted-foreground'>
                            {client.studentEmail || 'No client email'}
                          </p>
                          <div className='mt-2 flex flex-wrap gap-2'>
                            <Badge variant='outline'>
                              {client.bookings.length} booking{client.bookings.length === 1 ? '' : 's'}
                            </Badge>
                            <Badge variant='secondary'>
                              {client.completedSessions} completed
                            </Badge>
                            {client.pendingSessions > 0 ? (
                              <Badge variant='outline' className='border-yellow-500 text-yellow-700'>
                                {client.pendingSessions} pending
                              </Badge>
                            ) : null}
                            {client.cancelledSessions > 0 ? (
                              <Badge variant='destructive'>
                                {client.cancelledSessions} rejected
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className='flex shrink-0 justify-end'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => openClientHistoryDialog(client.studentEmail)}
                        >
                          <FileText className='mr-2 h-4 w-4' />
                          View History
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={clientHistoryOpen} onOpenChange={handleClientHistoryDialogChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {selectedClientHistory?.studentName || 'Client'} history
                </DialogTitle>
                <DialogDescription>
                  Review the client&apos;s bookings and the notes captured for each session.
                </DialogDescription>
              </DialogHeader>

              {selectedClientHistory ? (
                <div className='space-y-4'>
                  {selectedClientHistory.bookings.map((booking) => (
                    <div key={booking.id} className='space-y-3 rounded-lg border p-4'>
                      <div className='flex flex-wrap items-start justify-between gap-2'>
                        <div>
                          <p className='font-medium'>{booking.sessionType}</p>
                          <p className='text-sm text-muted-foreground'>
                            {formatBookingDate(booking)}
                          </p>
                        </div>
                        {getBookingStatusBadge(booking.status)}
                      </div>

                      {booking.notes ? (
                        <div className='rounded-lg bg-muted/40 p-3 text-sm'>
                          <span className='font-medium'>Client booking note:</span>{' '}
                          {booking.notes}
                        </div>
                      ) : null}

                      {booking.rejectionReason ? (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='w-fit'
                          onClick={() => openRejectionReasonDialog(booking.rejectionReason)}
                        >
                          <AlertCircle className='mr-2 h-4 w-4' />
                          View rejection reason
                        </Button>
                      ) : null}

                      {booking.sessionNotes ? (
                        <div className='grid gap-3 md:grid-cols-2'>
                          {booking.sessionNotes.session_summary ? (
                            <div className='rounded-lg border bg-muted/20 p-3 text-sm md:col-span-2'>
                              <span className='font-medium'>Session summary:</span>{' '}
                              {booking.sessionNotes.session_summary}
                            </div>
                          ) : null}
                          {booking.sessionNotes.presenting_concerns ? (
                            <div className='rounded-lg border p-3 text-sm'>
                              <span className='font-medium'>Presenting concerns:</span>{' '}
                              {booking.sessionNotes.presenting_concerns}
                            </div>
                          ) : null}
                          {booking.sessionNotes.observations ? (
                            <div className='rounded-lg border p-3 text-sm'>
                              <span className='font-medium'>Observations:</span>{' '}
                              {booking.sessionNotes.observations}
                            </div>
                          ) : null}
                          {booking.sessionNotes.follow_up_plan ? (
                            <div className='rounded-lg border p-3 text-sm'>
                              <span className='font-medium'>Follow-up plan:</span>{' '}
                              {booking.sessionNotes.follow_up_plan}
                            </div>
                          ) : null}
                          {booking.sessionNotes.next_session_focus ? (
                            <div className='rounded-lg border p-3 text-sm'>
                              <span className='font-medium'>Next session focus:</span>{' '}
                              {booking.sessionNotes.next_session_focus}
                            </div>
                          ) : null}
                          {booking.sessionNotes.homework_assigned ? (
                            <div className='rounded-lg border p-3 text-sm md:col-span-2'>
                              <span className='font-medium'>Homework assigned:</span>{' '}
                              {booking.sessionNotes.homework_assigned}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground'>
                          No session notes recorded for this booking yet.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>No client selected.</p>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>
                Manage psychologist-only settings that appear on your professional profile
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Name, email, phone number, location, avatar, and password stay on the shared Profile Settings page. Only psychologist-specific settings live here.
                </AlertDescription>
              </Alert> */}

              {settingsLoading ? (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Loading professional profile...
                </div>
              ) : (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='professional-bio'>Professional Bio</Label>
                    <Textarea
                      id='professional-bio'
                      rows={6}
                      placeholder='Tell clients about your background, approach, and areas of expertise.'
                      value={professionalProfile.bio}
                      onChange={(e) =>
                        handleProfessionalProfileFieldChange('bio', e.target.value)
                      }
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='professional-hourly-rate'>Hourly Rate</Label>
                      <Input
                        id='professional-hourly-rate'
                        type='number'
                        min='0'
                        step='0.01'
                        placeholder='75'
                        value={professionalProfile.hourlyRate}
                        onChange={(e) =>
                          handleProfessionalProfileFieldChange(
                            'hourlyRate',
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='default-session-duration'>Default Session Duration</Label>
                      <Select
                        value={professionalProfile.defaultSessionDuration}
                        onValueChange={(value) =>
                          handleProfessionalProfileFieldChange(
                            'defaultSessionDuration',
                            value,
                          )
                        }
                      >
                        <SelectTrigger id='default-session-duration'>
                          <SelectValue placeholder='Select duration' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='30'>30 minutes</SelectItem>
                          <SelectItem value='45'>45 minutes</SelectItem>
                          <SelectItem value='60'>60 minutes</SelectItem>
                          <SelectItem value='90'>90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2 md:col-span-2'>
                      <Label htmlFor='default-booking-type'>Default Booking Type</Label>
                      <Select
                        value={professionalProfile.defaultBookingType}
                        onValueChange={(value: 'standard' | 'emergency') =>
                          handleProfessionalProfileFieldChange(
                            'defaultBookingType',
                            value,
                          )
                        }
                      >
                        <SelectTrigger id='default-booking-type'>
                          <SelectValue placeholder='Select booking type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='standard'>Standard</SelectItem>
                          <SelectItem value='emergency'>Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-1'>
                        <Label>Allow Emergency Bookings</Label>
                        <p className='text-sm text-muted-foreground'>
                          Let clients request emergency sessions when needed.
                        </p>
                      </div>
                      <Switch
                        checked={professionalProfile.allowEmergencyBookings}
                        onCheckedChange={(checked) =>
                          handleProfessionalProfileFieldChange(
                            'allowEmergencyBookings',
                            checked,
                          )
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-1'>
                        <Label>Profile Publicly Visible</Label>
                        <p className='text-sm text-muted-foreground'>
                          Let clients discover your profile in psychologist listings.
                        </p>
                      </div>
                      <Switch
                        checked={professionalProfile.isProfilePublic}
                        onCheckedChange={(checked) =>
                          handleProfessionalProfileFieldChange('isProfilePublic', checked)
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-1'>
                        <Label>Currently Accepting New Clients</Label>
                        <p className='text-sm text-muted-foreground'>
                          Turn this off when you want to pause new consultation requests.
                        </p>
                      </div>
                      <Switch
                        checked={professionalProfile.acceptingNewClients}
                        onCheckedChange={(checked) =>
                          handleProfessionalProfileFieldChange(
                            'acceptingNewClients',
                            checked,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <Label>Visible Public Profile Fields</Label>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Choose which profile fields should be shown to students.
                      </p>
                    </div>

                    <div className='grid gap-3 md:grid-cols-2'>
                      {[
                        { key: 'bio', label: 'Bio' },
                        { key: 'location', label: 'Location' },
                        { key: 'phone_number', label: 'Phone Number' },
                        { key: 'hourly_rate', label: 'Hourly Rate' },
                      ].map((field) => (
                        <label
                          key={field.key}
                          className='flex cursor-pointer items-center gap-3 rounded-lg border p-4'
                        >
                          <Checkbox
                            checked={
                              professionalProfile.visibleProfileFields[
                                field.key as keyof ProfessionalProfileForm['visibleProfileFields']
                              ]
                            }
                            onCheckedChange={(checked) =>
                              handleVisibleProfileFieldChange(
                                field.key as keyof ProfessionalProfileForm['visibleProfileFields'],
                                checked === true,
                              )
                            }
                          />
                          <span className='text-sm font-medium'>{field.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <Button onClick={handleSaveProfessionalProfile} disabled={settingsSaving}>
                      {settingsSaving ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Professional Profile
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Use the shared profile page for generic account information and password management
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 sm:flex-row'>
              <Button onClick={() => onNavigate('profile')}>
                Open Profile Settings
              </Button>
              <Button variant='outline' onClick={() => onNavigate('psychologist-availability')}>
                Manage Availability
              </Button>
            </CardContent>
          </Card> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
