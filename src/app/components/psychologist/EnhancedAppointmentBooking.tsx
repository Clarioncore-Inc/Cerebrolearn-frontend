import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Star,
  GraduationCap,
  DollarSign,
  MessageSquare,
  Award,
  Repeat,
  AlertTriangle,
  Bell,
  Download,
  Users,
  Zap,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import api, { SessionType } from '../../utils/api-client';

interface EnhancedAppointmentBookingProps {
  onNavigate: (page: string, data?: any) => void;
  psychologist?: any;
}

type AvailabilityDayKey =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

interface AvailabilityDaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

type SlotStatus = 'available' | 'pending' | 'confirmed';

interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
  status: SlotStatus;
  statusLabel?: string;
}

const DAY_KEYS_BY_INDEX: AvailabilityDayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const BOOKING_SLOT_INTERVAL_MINUTES = 30;

const getPsychologistDisplayName = (psychologist?: any) =>
  psychologist?.fullName || psychologist?.name || 'Psychologist';

const normalizeBookingDate = (value: string) => {
  if (!value) return '';
  if (value.includes('T')) return value.split('T')[0];

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return value;
};

const normalizeBookingTime = (value: string) => {
  if (!value) return '';

  const isoMatch = value.match(/^([01][0-9]|2[0-3]):([0-5][0-9])(?::[0-5][0-9])?$/);
  if (isoMatch) {
    return `${isoMatch[1]}:${isoMatch[2]}`;
  }

  const twelveHourMatch = value.match(/^([0]?[1-9]|1[0-2]):([0-5][0-9])\s*([AP]M)$/i);
  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = twelveHourMatch[2];
    const period = twelveHourMatch[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  return value;
};

const normalizeSlotStatus = (value: string): SlotStatus => {
  if (value === 'confirmed') return 'confirmed';
  if (value === 'pending' || value === 'emergency') return 'pending';
  return 'available';
};

const getSlotStatusLabel = (status: SlotStatus) => {
  switch (status) {
    case 'pending':
      return 'Pending confirmation';
    case 'confirmed':
      return 'Booked';
    default:
      return undefined;
  }
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatTimeLabel = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const isSameDate = (left: Date, right: Date) =>
  left.toDateString() === right.toDateString();

const getDayKey = (date: Date): AvailabilityDayKey => DAY_KEYS_BY_INDEX[date.getDay()];

const createTimeSlots = (
  daySchedule?: AvailabilityDaySchedule | null,
  bookedSlotStatuses?: Record<string, SlotStatus>,
  dateKey?: string,
): TimeSlot[] => {
  if (!daySchedule?.enabled) return [];

  const slots: TimeSlot[] = [];
  const startMinutes = toMinutes(daySchedule.start);
  const endMinutes = toMinutes(daySchedule.end);

  for (
    let currentMinutes = startMinutes;
    currentMinutes < endMinutes;
    currentMinutes += BOOKING_SLOT_INTERVAL_MINUTES
  ) {
    const time = fromMinutes(currentMinutes);
    const status =
      dateKey && bookedSlotStatuses
        ? bookedSlotStatuses[`${dateKey}|${time}`] ?? 'available'
        : 'available';

    slots.push({
      time,
      label: formatTimeLabel(time),
      available: status === 'available',
      status,
      statusLabel: getSlotStatusLabel(status),
    });
  }

  return slots;
};

export function EnhancedAppointmentBooking({ onNavigate, psychologist }: EnhancedAppointmentBookingProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'calendar' | 'time' | 'details' | 'payment'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingId, setBookingId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  
  // Phase 2 New Features
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [joinWaitlist, setJoinWaitlist] = useState(false);
  const [reminderPreferences, setReminderPreferences] = useState({
    email: true,
    sms: false,
    push: true,
    timing: '24h' // 1h, 24h, 48h
  });
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [availabilitySchedule, setAvailabilitySchedule] = useState<
    Partial<Record<AvailabilityDayKey, AvailabilityDaySchedule>>
  >({});
  const [bookedSlotStatuses, setBookedSlotStatuses] = useState<Record<string, SlotStatus>>({});

  // Session types from API
  const [sessionTypesList, setSessionTypesList] = useState<SessionType[]>([]);
  const [sessionTypesLoading, setSessionTypesLoading] = useState(false);
  const [selectedSessionTypePrice, setSelectedSessionTypePrice] = useState(0);

  useEffect(() => {
    setSessionTypesLoading(true);
    api.psychologist.listSessionTypes()
      .then((data) => setSessionTypesList(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load session types'))
      .finally(() => setSessionTypesLoading(false));
  }, []);

  const psychologistId =
    psychologist?.psychologistId || psychologist?.userId || psychologist?.id;
  const psychologistName = getPsychologistDisplayName(psychologist);

  useEffect(() => {
    if (!psychologistId) return;

    let isMounted = true;

    const loadAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        const response = await api.psychologist.getAvailability(psychologistId);

        if (!isMounted) return;
        setAvailabilitySchedule(
          (response?.schedule as Partial<Record<AvailabilityDayKey, AvailabilityDaySchedule>>) ?? {},
        );
      } catch (error: any) {
        if (!isMounted) return;

        const availabilityErrorMessage = String(error?.message || '').toLowerCase();
        const isNotFound =
          availabilityErrorMessage.includes('404') ||
          availabilityErrorMessage.includes('no availability') ||
          availabilityErrorMessage.includes('availability schedule');

        if (!isNotFound) {
          console.error('Error loading psychologist availability:', error);
          toast.error(error?.message ?? 'Failed to load psychologist availability');
        }

        setAvailabilitySchedule({});
      } finally {
        if (isMounted) {
          setAvailabilityLoading(false);
          setAvailabilityLoaded(true);
        }
      }
    };

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [psychologistId]);

  useEffect(() => {
    if (!psychologistId) return;

    const loadBookedSlotStatuses = () => {
      try {
        const storedBookings = [
          ...JSON.parse(localStorage.getItem('psychologist_bookings') || '[]'),
          ...JSON.parse(localStorage.getItem('appointment_bookings') || '[]'),
        ];

        const nextStatuses = storedBookings.reduce(
          (accumulator: Record<string, SlotStatus>, booking: any) => {
            const bookingPsychologistId =
              booking.psychologistId ?? booking.psychologist_id ?? '';
            if (bookingPsychologistId !== psychologistId) {
              return accumulator;
            }

            const normalizedStatus = normalizeSlotStatus(booking.status ?? '');
            if (normalizedStatus === 'available') {
              return accumulator;
            }

            const normalizedDate = normalizeBookingDate(booking.date ?? '');
            const normalizedTime = normalizeBookingTime(booking.time ?? '');

            if (!normalizedDate || !normalizedTime) {
              return accumulator;
            }

            const key = `${normalizedDate}|${normalizedTime}`;
            if (
              accumulator[key] !== 'confirmed' ||
              normalizedStatus === 'confirmed'
            ) {
              accumulator[key] = normalizedStatus;
            }

            return accumulator;
          },
          {},
        );

        setBookedSlotStatuses(nextStatuses);
      } catch (error) {
        console.error('Error loading stored booked slots:', error);
        setBookedSlotStatuses({});
      }
    };

    loadBookedSlotStatuses();
    window.addEventListener('storage', loadBookedSlotStatuses);

    return () => {
      window.removeEventListener('storage', loadBookedSlotStatuses);
    };
  }, [psychologistId]);

  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const daySchedule = availabilitySchedule[getDayKey(date)];

      if (daySchedule?.enabled) {
        dates.push(date);
      }
    }

    return dates;
  }, [availabilitySchedule]);

  const selectedDaySchedule = selectedDate
    ? availabilitySchedule[getDayKey(selectedDate)]
    : undefined;
  const selectedDateKey = selectedDate
    ? normalizeBookingDate(selectedDate.toISOString())
    : '';

  const timeSlots = useMemo(
    () =>
      createTimeSlots(
        selectedDaySchedule,
        bookedSlotStatuses,
        selectedDateKey,
      ),
    [bookedSlotStatuses, selectedDateKey, selectedDaySchedule],
  );

  const selectedTimeLabel = selectedTime ? formatTimeLabel(selectedTime) : '';

  useEffect(() => {
    if (selectedDate && !availableDates.some((date) => isSameDate(date, selectedDate))) {
      setSelectedDate(null);
      setSelectedTime('');
      setStep('calendar');
    }
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (
      selectedTime &&
      step !== 'payment' &&
      !timeSlots.some(
        (slot) => slot.time === selectedTime && slot.available,
      )
    ) {
      setSelectedTime('');
      if (step === 'details' || step === 'payment') {
        setStep('time');
      }
    }
  }, [selectedTime, step, timeSlots]);

  // Calculate recurring appointments
  const calculateRecurringDates = useMemo(() => {
    if (!isRecurring || !selectedDate || !recurringEndDate) return [];
    
    const dates = [];
    let currentDate = new Date(selectedDate);
    const endDate = new Date(recurringEndDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      
      switch (recurringFrequency) {
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
    
    return dates;
  }, [isRecurring, selectedDate, recurringEndDate, recurringFrequency]);

  const getSessionPrice = () => {
    return selectedSessionTypePrice + (isEmergency ? 50 : 0);
  };

  const bookingCount = isRecurring ? Math.max(calculateRecurringDates.length, 1) : 1;
  const totalPrice = getSessionPrice() * bookingCount;

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime || !sessionType) {
      toast.error('Please complete all required fields');
      return;
    }

    if (isRecurring && !recurringEndDate) {
      toast.error('Please select a recurring end date');
      return;
    }

    // Check cancellation policy acknowledgment
    const sessionDate = new Date(selectedDate);
    const now = new Date();
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (!psychologistId) {
      toast.error('Psychologist identifier is missing');
      return;
    }

    const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
    if (selectedSlot && !selectedSlot.available) {
      toast.error(
        selectedSlot.status === 'pending'
          ? 'This time is already pending confirmation. Please choose another slot.'
          : 'This time has already been booked. Please choose another slot.',
      );
      setStep('time');
      return;
    }

    const price = getSessionPrice();

    try {
      setSubmitting(true);

      const response = await api.psychologist.createBooking({
        psychologist_id: psychologistId,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        booking_type: isEmergency ? 'emergency' : 'standard',
        session_type: sessionType,
        notes,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : '',
        reminder_preferences: JSON.stringify(reminderPreferences),
        price,
      });

      const newBookingId = response?.id || response?.booking_id || `BK${Date.now()}`;
      const booking = {
        id: newBookingId,
        studentId: user.id,
        psychologistId,
        psychologistName,
        date: selectedDate.toISOString(),
        time: selectedTime,
        bookingType: isEmergency ? 'emergency' : 'standard',
        sessionType,
        notes,
        status: response?.status ?? 'pending',
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : null,
        recurringDates: isRecurring ? calculateRecurringDates.map(d => d.toISOString()) : [],
        reminderPreferences,
        createdAt: new Date().toISOString(),
        price,
      };

      const existingBookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('psychologist_bookings', JSON.stringify(existingBookings));
      setBookedSlotStatuses((current) => ({
        ...current,
        [`${normalizeBookingDate(booking.date)}|${normalizeBookingTime(booking.time)}`]: normalizeSlotStatus(
          booking.status,
        ),
      }));

      scheduleReminders(booking);

      setBookingId(newBookingId);
      setStep('payment');

      const appointmentText = isRecurring
        ? `${calculateRecurringDates.length} recurring appointments`
        : 'appointment';

      toast.success(`${isEmergency ? 'Emergency' : 'Standard'} ${appointmentText} booked successfully!`);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast.error(error?.message ?? 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const scheduleReminders = (booking: any) => {
    // Mock reminder scheduling
    const reminders = [];
    
    if (reminderPreferences.email) {
      reminders.push(`Email reminder set for ${reminderPreferences.timing} before appointment`);
    }
    if (reminderPreferences.sms) {
      reminders.push(`SMS reminder set for ${reminderPreferences.timing} before appointment`);
    }
    if (reminderPreferences.push) {
      reminders.push(`Push notification set for ${reminderPreferences.timing} before appointment`);
    }
    
    console.log('Reminders scheduled:', reminders);
  };

  const handleWaitlistJoin = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time first');
      return;
    }

    const waitlistEntry = {
      id: `WL${Date.now()}`,
      studentId: user?.id,
      psychologistId,
      preferredDate: selectedDate.toISOString(),
      preferredTime: selectedTime,
      sessionType,
      notes,
      createdAt: new Date().toISOString()
    };

    const waitlist = JSON.parse(localStorage.getItem('psychologist_waitlist') || '[]');
    waitlist.push(waitlistEntry);
    localStorage.setItem('psychologist_waitlist', JSON.stringify(waitlist));

    toast.success('Added to waitlist! We\'ll notify you when a slot becomes available.');
    setJoinWaitlist(true);
  };

  const downloadICS = () => {
    if (!selectedDate || !selectedTime) return;

    const appointments = isRecurring ? calculateRecurringDates : [selectedDate];
    
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CerebroLearn//Psychologist Booking//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH\n`;

    appointments.forEach((date, index) => {
      const startDateTime = new Date(date);
      const [hours, minutes] = selectedTime.split(':').map(Number);

      startDateTime.setHours(hours, minutes, 0, 0);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour session

      const formatDate = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += `BEGIN:VEVENT
UID:${bookingId || 'TEMP'}-${index}@cerebrolearn.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:Therapy Session with ${psychologistName}
DESCRIPTION:${sessionType}\\n${notes}
LOCATION:${psychologist?.location || 'Online'}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT${reminderPreferences.timing === '1h' ? '1H' : reminderPreferences.timing === '24h' ? '1D' : '2D'}
ACTION:DISPLAY
DESCRIPTION:Reminder: Therapy session in ${reminderPreferences.timing}
END:VALARM
END:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therapy-appointment-${bookingId || 'temp'}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Calendar event downloaded! Import to your calendar app.');
  };

  if (!psychologist) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Psychologist information not found</p>
            <Button onClick={() => onNavigate('browse-psychologists')} className="mt-4">
              Browse Psychologists
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => onNavigate('browse-psychologists')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Psychologists
          </Button>
          <h1 className="text-4xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Schedule your session with {psychologistName}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Psychologist Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {psychologistName.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{psychologistName}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{psychologist?.rating || 5.0}</span>
                      <span className="text-muted-foreground">({psychologist?.reviewCount || psychologist?.reviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{psychologist.specialization}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{psychologist.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{psychologist.yearsOfExperience || psychologist.experience || 'N/A'} years experience</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>${psychologist.hourlyRate}/hour</span>
                  </div>
                </div>

                {isEmergency && (
                  <Alert className="mt-4 border-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Emergency booking - Additional $50 fee applies
                    </AlertDescription>
                  </Alert>
                )}

                {isRecurring && calculateRecurringDates.length > 0 && (
                  <Alert className="mt-4 border-blue-500">
                    <Repeat className="h-4 w-4" />
                    <AlertDescription>
                      {calculateRecurringDates.length} sessions scheduled
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Complete the steps below to schedule your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Booking Type Selector */}
                <div className="mb-6">
                  <Label className="mb-3 block">Booking Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsEmergency(false)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        !isEmergency 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Calendar className="h-6 w-6 mb-2 mx-auto" />
                      <div className="font-semibold">Standard</div>
                      <div className="text-xs text-muted-foreground">Regular appointment</div>
                    </button>
                    <button
                      onClick={() => setIsEmergency(true)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        isEmergency 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-border hover:border-red-500/50'
                      }`}
                    >
                      <Zap className="h-6 w-6 mb-2 mx-auto text-red-600" />
                      <div className="font-semibold text-red-600">Emergency</div>
                      <div className="text-xs text-muted-foreground">Priority booking +$50</div>
                    </button>
                  </div>
                </div>

                <Tabs value={step} onValueChange={(v) => setStep(v as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="calendar">Date</TabsTrigger>
                    <TabsTrigger value="time" disabled={!selectedDate}>Time</TabsTrigger>
                    <TabsTrigger value="details" disabled={!selectedTime}>Details</TabsTrigger>
                    <TabsTrigger value="payment" disabled={!sessionType}>Review</TabsTrigger>
                  </TabsList>

                  {/* Step 1: Calendar */}
                  <TabsContent value="calendar" className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Select Date</Label>
                      {availabilityLoading ? (
                        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                          Loading psychologist availability...
                        </div>
                      ) : availableDates.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-2">
                          {availableDates.map((date) => {
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            return (
                              <button
                                key={date.toISOString()}
                                onClick={() => {
                                  setSelectedDate(date);
                                  setSelectedTime('');
                                }}
                                className={`p-3 border-2 rounded-lg transition-all text-center ${
                                  isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="text-xs text-muted-foreground">
                                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className="text-lg font-semibold">{date.getDate()}</div>
                                <div className="text-xs text-muted-foreground">
                                  {date.toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : availabilityLoaded ? (
                        <Alert>
                          <AlertDescription>
                            This psychologist has not set any available booking days yet.
                          </AlertDescription>
                        </Alert>
                      ) : null}
                    </div>

                    {selectedDate && (
                      <Button onClick={() => setStep('time')} className="w-full">
                        Continue to Time Selection
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>
                    )}
                  </TabsContent>

                  {/* Step 2: Time */}
                  <TabsContent value="time" className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Select Time</Label>
                      {selectedDate && selectedDaySchedule?.enabled ? (
                        <p className="mb-3 text-sm text-muted-foreground">
                          Available on this day: {formatTimeLabel(selectedDaySchedule.start)} - {formatTimeLabel(selectedDaySchedule.end)}
                        </p>
                      ) : null}

                      {timeSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {timeSlots.map((slot) => {
                            const isSelected = selectedTime === slot.time;
                            return (
                              <button
                                key={slot.time}
                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                disabled={!slot.available}
                                className={`p-3 border-2 rounded-lg transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/10'
                                    : slot.available
                                    ? 'border-border hover:border-primary/50'
                                    : 'border-border bg-muted opacity-50 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium">{slot.label}</span>
                                </div>
                                {!slot.available && slot.statusLabel && (
                                  <div
                                    className={`mt-1 text-xs ${
                                      slot.status === 'pending'
                                        ? 'text-yellow-700 dark:text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  >
                                    {slot.statusLabel}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <Alert>
                          <AlertDescription>
                            No time slots are available for the selected day.
                          </AlertDescription>
                        </Alert>
                      )}

                      {timeSlots.some((slot) => slot.status === 'pending') ||
                      timeSlots.some((slot) => slot.status === 'confirmed') ? (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Slots marked <span className="text-yellow-700 dark:text-yellow-400">Pending confirmation</span> are temporarily held, while <span className="font-medium">Booked</span> slots are already confirmed.
                        </p>
                      ) : null}
                    </div>

                    {/* Waitlist option */}
                    {selectedTime && !timeSlots.find(s => s.time === selectedTime)?.available && (
                      <Alert>
                        <Users className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                          <span>This time slot is full. Join the waitlist?</span>
                          <Button size="sm" onClick={handleWaitlistJoin} disabled={joinWaitlist}>
                            {joinWaitlist ? 'On Waitlist' : 'Join Waitlist'}
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('calendar')} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      {selectedTime && (
                        <Button onClick={() => setStep('details')} className="flex-1">
                          Continue to Details
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  {/* Step 3: Details */}
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Session Type</Label>
                      <Select
                        value={sessionType}
                        onValueChange={(val) => {
                          const st = sessionTypesList.find((s) => s.name === val);
                          setSessionType(val);
                          setSelectedSessionTypePrice(st ? Number(st.price) : 0);
                        }}
                        disabled={sessionTypesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={sessionTypesLoading ? 'Loading...' : 'Select session type'} />
                        </SelectTrigger>
                        <SelectContent>
                          {sessionTypesList.map((st) => (
                            <SelectItem key={st.id} value={st.name}>
                              {st.name} — ${Number(st.price).toFixed(2)}
                            </SelectItem>
                          ))}
                          {!sessionTypesLoading && sessionTypesList.length === 0 && (
                            <SelectItem value="_none" disabled>No session types available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Recurring Appointments */}
                    <div className="space-y-3 p-4 border-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="recurring" 
                          checked={isRecurring}
                          onCheckedChange={(checked) => setIsRecurring(!!checked)}
                        />
                        <Label htmlFor="recurring" className="cursor-pointer flex items-center gap-2">
                          <Repeat className="h-4 w-4" />
                          Make this a recurring appointment
                        </Label>
                      </div>

                      {isRecurring && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-sm">Frequency</Label>
                            <RadioGroup className="space-y-2" value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as any)}>
                              <div className="flex items-center space-x-3 rounded-md border border-border bg-muted/40 px-3 py-2">
                                <RadioGroupItem className="border-primary/50 bg-background" value="weekly" id="weekly" />
                                <Label htmlFor="weekly" className="cursor-pointer font-medium">Weekly</Label>
                              </div>
                              <div className="flex items-center space-x-3 rounded-md border border-border bg-muted/40 px-3 py-2">
                                <RadioGroupItem className="border-primary/50 bg-background" value="biweekly" id="biweekly" />
                                <Label htmlFor="biweekly" className="cursor-pointer font-medium">Bi-weekly</Label>
                              </div>
                              <div className="flex items-center space-x-3 rounded-md border border-border bg-muted/40 px-3 py-2">
                                <RadioGroupItem className="border-primary/50 bg-background" value="monthly" id="monthly" />
                                <Label htmlFor="monthly" className="cursor-pointer font-medium">Monthly</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">End Date</Label>
                            <Input
                              type="date"
                              min={selectedDate?.toISOString().split('T')[0]}
                              onChange={(e) => setRecurringEndDate(new Date(e.target.value))}
                            />
                          </div>

                          {calculateRecurringDates.length > 0 && (
                            <Alert>
                              <CheckCircle2 className="h-4 w-4" />
                              <AlertDescription>
                                {calculateRecurringDates.length} sessions will be scheduled
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reminder Preferences */}
                    <div className="space-y-3 p-4 border-2 rounded-lg">
                      <Label className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Appointment Reminders
                      </Label>
                      
                      <div className="space-y-2 ml-6">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="email-reminder"
                            checked={reminderPreferences.email}
                            onCheckedChange={(checked) => setReminderPreferences({
                              ...reminderPreferences,
                              email: !!checked
                            })}
                          />
                          <Label htmlFor="email-reminder" className="cursor-pointer">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="sms-reminder"
                            checked={reminderPreferences.sms}
                            onCheckedChange={(checked) => setReminderPreferences({
                              ...reminderPreferences,
                              sms: !!checked
                            })}
                          />
                          <Label htmlFor="sms-reminder" className="cursor-pointer">SMS</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="push-reminder"
                            checked={reminderPreferences.push}
                            onCheckedChange={(checked) => setReminderPreferences({
                              ...reminderPreferences,
                              push: !!checked
                            })}
                          />
                          <Label htmlFor="push-reminder" className="cursor-pointer">Push Notification</Label>
                        </div>

                        <div className="space-y-2 pt-2">
                          <Label className="text-sm">Remind me</Label>
                          <Select 
                            value={reminderPreferences.timing}
                            onValueChange={(v) => setReminderPreferences({
                              ...reminderPreferences,
                              timing: v
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1h">1 hour before</SelectItem>
                              <SelectItem value="24h">24 hours before</SelectItem>
                              <SelectItem value="48h">48 hours before</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        placeholder="Any specific concerns or topics you'd like to discuss..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('time')} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button onClick={() => setStep('payment')} className="flex-1">
                        Review Booking
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Step 4: Review & Payment */}
                  <TabsContent value="payment" className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <h3 className="font-semibold">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Psychologist:</span>
                          <span className="font-medium">{psychologistName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">
                            {selectedDate?.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{selectedTimeLabel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Session Type:</span>
                          <span className="font-medium">{sessionType}</span>
                        </div>
                        {isRecurring && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Recurring:</span>
                            <span className="font-medium">{recurringFrequency} ({calculateRecurringDates.length} sessions)</span>
                          </div>
                        )}
                        {isEmergency && (
                          <div className="flex justify-between text-red-600">
                            <span>Emergency Fee:</span>
                            <span className="font-medium">+$50</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                          <span className="text-primary">${totalPrice}</span>
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before appointment. 
                        Cancellations within 24 hours will incur a 50% fee. No-shows will be charged in full.
                      </AlertDescription>
                    </Alert>

                    {/* Calendar Export */}
                    <Button variant="outline" onClick={downloadICS} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Add to Calendar (.ics)
                    </Button>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button onClick={handleBooking} className="flex-1" disabled={submitting}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {submitting ? 'Booking...' : 'Confirm'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}