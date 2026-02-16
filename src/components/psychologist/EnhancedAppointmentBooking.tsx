import React, { useState, useMemo } from 'react';
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

interface EnhancedAppointmentBookingProps {
  onNavigate: (page: string, data?: any) => void;
  psychologist?: any;
}

export function EnhancedAppointmentBooking({ onNavigate, psychologist }: EnhancedAppointmentBookingProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'calendar' | 'time' | 'details' | 'payment'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingId, setBookingId] = useState<string>('');
  
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

  // Generate next 30 days for calendar (extended from 14)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      // Skip Sundays (unless emergency)
      if (date.getDay() !== 0 || isEmergency) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Enhanced time slots with emergency slots
  const generateTimeSlots = () => {
    const regularTimes = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    const emergencyTimes = [
      '08:00 AM', '12:00 PM', '06:00 PM', '07:00 PM'
    ];
    
    // Mock some slots as booked
    const bookedSlots = ['10:00 AM', '02:00 PM'];
    
    const times = isEmergency ? [...regularTimes, ...emergencyTimes] : regularTimes;
    
    return times.sort().map(time => ({
      time,
      available: !bookedSlots.includes(time),
      isEmergency: emergencyTimes.includes(time)
    }));
  };

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

  const handleBooking = () => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime || !sessionType) {
      toast.error('Please complete all required fields');
      return;
    }

    // Check cancellation policy acknowledgment
    const sessionDate = new Date(selectedDate);
    const now = new Date();
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Generate booking
    const newBookingId = `BK${Date.now()}`;
    const booking = {
      id: newBookingId,
      studentId: user.id,
      psychologistId: psychologist?.id,
      psychologistName: psychologist?.name,
      date: selectedDate.toISOString(),
      time: selectedTime,
      sessionType,
      notes,
      status: isEmergency ? 'emergency' : 'confirmed',
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null,
      recurringDates: isRecurring ? calculateRecurringDates.map(d => d.toISOString()) : [],
      reminderPreferences,
      createdAt: new Date().toISOString(),
      price: sessionType === 'Initial Consultation (60 min)' ? 150 : 200
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('psychologist_bookings', JSON.stringify(existingBookings));

    // Schedule reminders (mock)
    scheduleReminders(booking);

    setBookingId(newBookingId);
    setStep('payment');
    
    const appointmentText = isRecurring 
      ? `${calculateRecurringDates.length} recurring appointments` 
      : 'appointment';
    
    toast.success(`${isEmergency ? 'Emergency' : 'Standard'} ${appointmentText} booked successfully!`);
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
      psychologistId: psychologist?.id,
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
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      startDateTime.setHours(hour, parseInt(minutes), 0, 0);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour session

      const formatDate = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += `BEGIN:VEVENT
UID:${bookingId || 'TEMP'}-${index}@cerebrolearn.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:Therapy Session with ${psychologist?.name}
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

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

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
          <p className="text-muted-foreground">Schedule your session with {psychologist.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Psychologist Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {psychologist?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{psychologist?.name || 'Psychologist'}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{psychologist?.rating || 5.0}</span>
                      <span className="text-muted-foreground">({psychologist?.reviews || 0} reviews)</span>
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
                    <span>{psychologist.experience} years experience</span>
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
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-2">
                        {availableDates.map((date) => {
                          const isSelected = selectedDate?.toDateString() === date.toDateString();
                          return (
                            <button
                              key={date.toISOString()}
                              onClick={() => setSelectedDate(date)}
                              className={`p-3 border-2 rounded-lg transition-all text-center ${
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="text-xs text-muted-foreground">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="text-lg font-semibold">
                                {date.getDate()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
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
                                <span className="font-medium">{slot.time}</span>
                              </div>
                              {slot.isEmergency && (
                                <Badge variant="destructive" className="mt-1 text-xs">Emergency</Badge>
                              )}
                              {!slot.available && (
                                <div className="text-xs text-muted-foreground mt-1">Booked</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
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
                    <div>
                      <Label>Session Type</Label>
                      <Select value={sessionType} onValueChange={setSessionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Initial Consultation (60 min)">Initial Consultation (60 min) - $150</SelectItem>
                          <SelectItem value="Follow-up Session (50 min)">Follow-up Session (50 min) - $120</SelectItem>
                          <SelectItem value="Therapy Session (50 min)">Therapy Session (50 min) - $120</SelectItem>
                          <SelectItem value="IQ Test Review (45 min)">IQ Test Review (45 min) - $100</SelectItem>
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
                          <div>
                            <Label className="text-sm">Frequency</Label>
                            <RadioGroup value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as any)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="weekly" id="weekly" />
                                <Label htmlFor="weekly" className="cursor-pointer">Weekly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="biweekly" id="biweekly" />
                                <Label htmlFor="biweekly" className="cursor-pointer">Bi-weekly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="monthly" id="monthly" />
                                <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
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

                        <div className="mt-2">
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

                    <div>
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
                          <span className="font-medium">{psychologist.name}</span>
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
                          <span className="font-medium">{selectedTime}</span>
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
                        <span className="text-primary">
                          ${((sessionType === 'Initial Consultation (60 min)' ? 150 : 120) + (isEmergency ? 50 : 0)) * (isRecurring ? calculateRecurringDates.length : 1)}
                        </span>
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
                      <Button onClick={handleBooking} className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirm & Pay
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