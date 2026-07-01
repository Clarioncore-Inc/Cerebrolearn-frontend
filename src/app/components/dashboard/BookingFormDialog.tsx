import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar as CalendarView } from '../ui/calendar';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import api, { SessionType } from '../../utils/api-client';

interface BookingPageProps {
  onNavigate: (page: string, data?: any) => void;
  backPage?: string;
}

type BookingType = 'standard' | 'emergency';
type Step = 'type-date' | 'time' | 'details' | 'success';
type IQTestType = 'culture_fair_intelligence_test' | 'weschler_intelligence_test';
const DEFAULT_BOOKING_TYPE: BookingType = 'standard';
const DEFAULT_IQ_SESSION_TYPE = 'IQ Test';

const IQ_TEST_TYPES: Array<{ value: IQTestType; label: string; description: string }> = [
  {
    value: 'culture_fair_intelligence_test',
    label: 'Culture Fair Intelligence Test',
    description:
      'A non-verbal assessment focused on pattern recognition, classification, series completion, and matrix reasoning to reduce the influence of language and cultural background.',
  },
  {
    value: 'weschler_intelligence_test',
    label: 'Weschler Intelligence Test',
    description:
      'A broad clinical intelligence assessment that reviews verbal comprehension, working memory, processing speed, and perceptual reasoning through structured psychologist-led tasks.',
  },
];

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const formatTimeLabel = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const isPastSameDaySlot = (dateStr: string, slot: string) => {
  if (!dateStr) return false;
  if (dateStr !== toIsoDate(today())) return false;

  const [hours, minutes] = slot.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const slotDateTime = new Date(`${dateStr}T00:00:00`);
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime <= new Date();
};

export function BookingPage({ onNavigate, backPage = 'dashboard' }: BookingPageProps) {
  const [step, setStep] = useState<Step>('type-date');
  const [calendarMonth, setCalendarMonth] = useState<Date>(today());

  // Step 1
  const [bookingDate, setBookingDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableDatesLoading, setAvailableDatesLoading] = useState(false);
  const [availableDatesError, setAvailableDatesError] = useState<string | null>(null);

  // Step 2
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Step 3
  const [testType, setTestType] = useState<IQTestType>('culture_fair_intelligence_test');
  const [notes, setNotes] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>('');
  const [sessionTypesList, setSessionTypesList] = useState<SessionType[]>([]);
  const [sessionTypesLoading, setSessionTypesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load session types on mount
  useEffect(() => {
    setSessionTypesLoading(true);
    api.psychologist
      .listSessionTypes()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSessionTypesList(list);
      })
      .catch(() => {})
      .finally(() => setSessionTypesLoading(false));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAvailableDates = async () => {
      try {
        setAvailableDatesLoading(true);
        setAvailableDatesError(null);

        const response = await api.psychologist.getAvailableDates(
          toMonthKey(calendarMonth),
          DEFAULT_BOOKING_TYPE,
        );

        if (!isMounted) return;
        setAvailableDates(response?.available_dates ?? []);
      } catch {
        if (!isMounted) return;
        setAvailableDates([]);
        setAvailableDatesError('Failed to load available dates. Please try again.');
      } finally {
        if (isMounted) {
          setAvailableDatesLoading(false);
        }
      }
    };

    loadAvailableDates();

    return () => {
      isMounted = false;
    };
  }, [calendarMonth]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onNavigate(backPage);
    }
  };

  const fetchAvailableSlots = async (date: string) => {
    setSlotsLoading(true);
    setSlotsError(null);
    setAvailableSlots([]);
    setSelectedTime('');
    try {
      const res = await api.psychologist.getAvailableSlots(date, DEFAULT_BOOKING_TYPE);
      const slots = res?.available_slots ?? [];
      setAvailableSlots(slots);
      if (slots.length === 0) {
        setSlotsError('No available time slots for the selected date. Try a different date.');
      }
    } catch {
      setSlotsError('Failed to load available slots. Please try again.');
    } finally {
      setSlotsLoading(false);
    }
  };

  // Auto-fetch slots and advance when the date changes
  useEffect(() => {
    if (!bookingDate) return;
    setStep('time');
    fetchAvailableSlots(bookingDate);
  }, [bookingDate]);

  const handleProceedToDetails = () => {
    if (!selectedTime) {
      toast.error('Please select a time slot.');
      return;
    }
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!testType) {
      toast.error('Please select an IQ test type.');
      return;
    }

    setSubmitting(true);
    try {
      await api.psychologist.createBooking({
        psychologist_id: null as any,
        date: bookingDate,
        time: selectedTime,
        booking_type: DEFAULT_BOOKING_TYPE,
        session_type: selectedSessionType?.name ?? DEFAULT_IQ_SESSION_TYPE,
        test_type: testType,
        notes,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : '',
        reminder_preferences: '',
        price: selectedSessionType?.price ?? 0,
      });
      setStep('success');
    } catch (err: any) {
      const message = err?.message || 'Failed to create booking. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const navigateAfterSuccess = (page: string, data?: Record<string, any>) => {
    const refreshIQSessionsKey = Date.now();
    onNavigate(page, {
      ...(data || {}),
      refreshIQSessionsKey,
    });
  };

  const availableDateSet = new Set(availableDates);
  const selectedTestType = IQ_TEST_TYPES.find((test) => test.value === testType);
  const selectedSessionType =
    sessionTypesList.find(
      (item) => item.name?.trim().toLowerCase() === DEFAULT_IQ_SESSION_TYPE.toLowerCase(),
    ) ?? null;
  const selectedDate = bookingDate ? new Date(`${bookingDate}T00:00:00`) : undefined;
  const availableDateObjects = availableDates.map((dateValue) => new Date(`${dateValue}T00:00:00`));
  const selectableSlots = availableSlots.filter((slot) => !isPastSameDaySlot(bookingDate, slot));
  const displayedSlotsError =
    slotsError ||
    (!slotsLoading && bookingDate && availableSlots.length > 0 && selectableSlots.length === 0
      ? 'No remaining time slots are available for today. Please choose another date.'
      : null);

  const isUnavailableDate = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    if (normalizedDate < today()) {
      return true;
    }

    return !availableDateSet.has(toIsoDate(normalizedDate));
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        overlayClassName='bg-black/45 backdrop-blur-sm'
        className='max-w-2xl border-none bg-transparent p-0 shadow-none sm:max-w-2xl'
      >
        <Card className='border-border/60 bg-background/95 backdrop-blur-xl shadow-lg'>
          <CardHeader>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <CardTitle className='flex items-center gap-2 text-xl'>
                  <Calendar className='h-5 w-5 text-primary' />
                  Book a Consultation
                </CardTitle>
                <CardDescription className='mt-1'>
                  {step === 'type-date' && 'Choose your preferred date.'}
                  {step === 'time' && 'Select an available time slot for your session.'}
                  {step === 'details' && 'Provide any additional details for your session.'}
                  {step === 'success' && 'Your booking has been received.'}
                </CardDescription>
              </div>
            </div>

            {/* Step indicator */}
            {step !== 'success' && (
              <div className='flex items-center gap-2 pt-2 text-xs text-muted-foreground'>
                {(['type-date', 'time', 'details'] as Step[]).map((s, i) => (
                  <React.Fragment key={s}>
                    <span
                      className={`font-medium ${step === s ? 'text-primary' : i < ['type-date', 'time', 'details'].indexOf(step) ? 'text-emerald-600' : ''}`}
                    >
                      {i + 1}. {s === 'type-date' ? 'Date' : s === 'time' ? 'Time' : 'Details'}
                    </span>
                    {i < 2 && <span>›</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>

        {/* ── Step 1: Type + Date ── */}
        {step === 'type-date' && (
          <div className='space-y-5 pt-1'>
            <div className='space-y-2'>
              <Label>Preferred Date</Label>
              <div className='relative flex justify-center rounded-xl border border-border/60 bg-background p-3'>
                <CalendarView
                  mode='single'
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (!date || isUnavailableDate(date)) return;
                    setBookingDate(toIsoDate(date));
                  }}
                  disabled={(date) => availableDatesLoading || isUnavailableDate(date)}
                  modifiers={{ available: availableDateObjects }}
                  modifiersClassNames={{
                    available:
                      'bg-emerald-500/10 text-emerald-700 font-medium hover:bg-emerald-500/20',
                  }}
                  classNames={{
                    day_disabled: 'text-muted-foreground opacity-35 line-through',
                  }}
                  className='mx-auto w-fit'
                />
                {availableDatesLoading ? (
                  <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/75 backdrop-blur-[1px]'>
                    <div className='flex items-center gap-2 rounded-full border border-border/60 bg-background/95 px-4 py-2 text-sm text-muted-foreground shadow-sm'>
                      <Loader2 className='h-4 w-4 animate-spin text-primary' />
                      Loading availability...
                    </div>
                  </div>
                ) : null}
              </div>
              <p className='text-xs text-muted-foreground'>
                Only dates with psychologist availability can be selected.
              </p>
              {availableDatesError ? (
                <Alert variant='destructive'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>{availableDatesError}</AlertDescription>
                </Alert>
              ) : null}
            </div>
          </div>
        )}

        {/* ── Step 2: Time slots ── */}
        {step === 'time' && (
          <div className='space-y-4 pt-1'>
            <div className='rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm'>
              <p className='text-muted-foreground'>
                <span className='font-medium text-foreground'>{formatDisplayDate(bookingDate)}</span>
              </p>
            </div>

            {slotsLoading && (
              <div className='flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground'>
                <Loader2 className='h-5 w-5 animate-spin' />
                Loading available slots…
              </div>
            )}

            {!slotsLoading && displayedSlotsError && (
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>{displayedSlotsError}</AlertDescription>
              </Alert>
            )}

            {!slotsLoading && selectableSlots.length > 0 && (
              <div className='space-y-2'>
                <Label>Select a Time</Label>
                <div className='grid grid-cols-3 gap-2'>
                  {selectableSlots.map((slot) => (
                    <button
                      key={slot}
                      type='button'
                      onClick={() => setSelectedTime(slot)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                        selectedTime === slot
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 hover:border-primary/40'
                      }`}
                    >
                      <Clock className='h-3.5 w-3.5' />
                      {formatTimeLabel(slot)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className='flex justify-between pt-2'>
              <Button variant='outline' onClick={() => setStep('type-date')}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
              <div className='flex gap-2'>
                {!slotsLoading && (slotsError || availableSlots.length === 0) && (
                  <Button
                    variant='outline'
                    onClick={() => fetchAvailableSlots(bookingDate)}
                  >
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Retry
                  </Button>
                )}
                {!slotsLoading && availableSlots.length === 0 && slotsError && (
                  <Button variant='outline' onClick={() => setStep('type-date')}>
                    Modify Filters
                  </Button>
                )}
                {availableSlots.length > 0 && (
                  <Button onClick={handleProceedToDetails} disabled={!selectedTime}>
                    Continue
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Details ── */}
        {step === 'details' && (
          <div className='space-y-4 pt-1'>
            <div className='rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm'>
              <p className='text-muted-foreground'>
                <span className='font-medium text-foreground'>{formatDisplayDate(bookingDate)}</span>
                {' at '}
                <span className='font-medium text-foreground'>{formatTimeLabel(selectedTime)}</span>
              </p>
            </div>

            {/* <div className='space-y-2'>
              <Label>Session Type</Label>
              <div className='rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
                <p className='font-medium text-foreground'>
                  {selectedSessionType?.name ?? DEFAULT_IQ_SESSION_TYPE}
                </p>
                <p className='mt-1'>This booking flow is reserved for psychologist-led IQ test sessions.</p>
              </div>
            </div> */}

            <div className='space-y-2'>
              <Label>IQ Test Type</Label>
              <Select value={testType} onValueChange={(value) => setTestType(value as IQTestType)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select an IQ test type' />
                </SelectTrigger>
                <SelectContent>
                  {IQ_TEST_TYPES.map((test) => (
                    <SelectItem key={test.value} value={test.value}>
                      {test.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTestType ? (
                <div className='rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
                  <p className='font-medium text-foreground'>{selectedTestType.label}</p>
                  <p className='mt-1'>{selectedTestType.description}</p>
                </div>
              ) : null}
            </div>

            {/* <div className='space-y-2'>
              <Label htmlFor='notes'>Notes <span className='text-muted-foreground text-xs'>(optional)</span></Label>
              <Textarea
                id='notes'
                placeholder="Briefly describe what you'd like to discuss…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div> */}

            <div className='space-y-2'>
              {/* <div className='flex items-center gap-2'>
                <input
                  id='recurring'
                  type='checkbox'
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className='h-4 w-4 rounded border-border/60 accent-primary'
                />
                <Label htmlFor='recurring' className='cursor-pointer font-normal'>
                  Recurring session
                </Label>
              </div> */}
              {isRecurring && (
                <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select frequency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='biweekly'>Bi-weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className='flex justify-between pt-2'>
              <Button variant='outline' onClick={() => setStep('time')}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Booking…
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 'success' && (
          <div className='flex flex-col items-center gap-4 py-10 text-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10'>
              <CheckCircle2 className='h-8 w-8 text-emerald-500' />
            </div>
            <div>
              <p className='text-xl font-semibold'>Booking Received</p>
              <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                Your consultation request for{' '}
                <span className='font-medium text-foreground'>{formatDisplayDate(bookingDate)}</span>{' '}
                at{' '}
                <span className='font-medium text-foreground'>{formatTimeLabel(selectedTime)}</span>{' '}
                is pending confirmation. You'll be notified once it's confirmed.
              </p>
            </div>
            <div className='flex flex-wrap justify-center gap-2'>
              <Badge variant='secondary' className='rounded-full'>
                Status: Pending acknowledgement
              </Badge>
            </div>
            <div className='flex gap-3 mt-2'>
              <Button
                variant='outline'
                onClick={() =>
                  navigateAfterSuccess('student-sessions', {
                    initialSessionTab: 'upcoming',
                    focusSection: 'sessions',
                  })
                }
              >
                View My Sessions
              </Button>
              <Button
                onClick={() =>
                  navigateAfterSuccess(backPage, {
                    initialSessionTab: 'upcoming',
                    focusSection: 'sessions',
                  })
                }
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
