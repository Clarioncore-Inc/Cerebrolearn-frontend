import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
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
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface AppointmentBookingProps {
  onNavigate: (page: string, data?: any) => void;
  psychologist?: any;
}

export function AppointmentBooking({ onNavigate, psychologist }: AppointmentBookingProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'calendar' | 'time' | 'details' | 'payment'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionType, setSessionType] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingId, setBookingId] = useState<string>('');

  // Generate next 14 days for calendar
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Generate available time slots for selected date
  const generateTimeSlots = () => {
    const slots = [];
    const times = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    // Mock some slots as booked
    const bookedSlots = ['10:00 AM', '02:00 PM'];
    
    return times.map(time => ({
      time,
      available: !bookedSlots.includes(time)
    }));
  };

  const handleBooking = () => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime || !sessionType) {
      toast.error('Please complete all required fields');
      return;
    }

    // Create booking
    const newBookingId = `booking_${Date.now()}`;
    const booking = {
      id: newBookingId,
      psychologistId: psychologist.id,
      psychologistName: psychologist.fullName,
      psychologistEmail: psychologist.email,
      studentEmail: user.email,
      studentName: user.user_metadata?.full_name || 'Student',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      sessionType,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      hourlyRate: psychologist.hourlyRate,
    };

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('appointment_bookings', JSON.stringify(bookings));

    setBookingId(newBookingId);
    setStep('payment');
    toast.success('Appointment booked successfully!');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  if (!psychologist) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            No psychologist selected. Please go back and select a psychologist.
          </AlertDescription>
        </Alert>
        <Button onClick={() => onNavigate('browse-psychologists')} className="mt-4">
          Browse Psychologists
        </Button>
      </div>
    );
  }

  // Confirmation Screen
  if (step === 'payment') {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
            <CardDescription>
              Your consultation has been scheduled successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Appointment Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between py-2 border-b">
                  <span className="text-muted-foreground">Psychologist</span>
                  <span className="font-medium text-right">{psychologist.fullName}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b">
                  <span className="text-muted-foreground">Session Type</span>
                  <span className="font-medium">{sessionType}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">60 minutes</span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-semibold text-lg">${psychologist.hourlyRate}</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Booking ID:</strong> {bookingId}
                <br />
                A confirmation email has been sent to <strong>{user?.email}</strong>
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">What's next?</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You'll receive a video call link 15 minutes before your appointment</li>
                <li>• Payment will be processed after the session is completed</li>
                <li>• You can reschedule or cancel up to 24 hours before the appointment</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onNavigate('my-bookings')}>
                View My Bookings
              </Button>
              <Button className="flex-1" onClick={() => onNavigate('browse-psychologists')}>
                Browse More Psychologists
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('browse-psychologists')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Psychologists
        </Button>
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-muted-foreground">Schedule a consultation session</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Psychologist Info Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 flex items-center gap-2">
                    {psychologist.fullName}
                    {psychologist.verified && (
                      <Badge variant="default" className="bg-cyan-500 text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{psychologist.rating?.toFixed(1)}</span>
                    <span className="text-muted-foreground">({psychologist.reviewCount})</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{psychologist.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{psychologist.yearsOfExperience} years experience</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>${psychologist.hourlyRate} per hour</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Badge variant="secondary" className="w-full justify-center">
                  {psychologist.specialization}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  1
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'time' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  2
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  3
                </div>
              </div>
              <CardTitle>
                {step === 'calendar' && 'Select Date'}
                {step === 'time' && 'Select Time'}
                {step === 'details' && 'Appointment Details'}
              </CardTitle>
              <CardDescription>
                {step === 'calendar' && 'Choose your preferred appointment date'}
                {step === 'time' && 'Pick an available time slot'}
                {step === 'details' && 'Provide additional information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Date Selection */}
              {step === 'calendar' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableDates.map((date) => (
                      <Button
                        key={date.toISOString()}
                        variant={selectedDate?.toDateString() === date.toDateString() ? 'default' : 'outline'}
                        className="h-auto py-3 flex flex-col items-center"
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-bold">
                          {date.getDate()}
                        </span>
                        <span className="text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setStep('time')}
                      disabled={!selectedDate}
                    >
                      Continue to Time Selection
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Time Selection */}
              {step === 'time' && (
                <div className="space-y-4">
                  <Alert>
                    <CalendarIcon className="h-4 w-4" />
                    <AlertDescription>
                      Selected date: <strong>{selectedDate && formatDate(selectedDate)}</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? 'default' : 'outline'}
                        className="h-auto py-3"
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="block text-xs text-muted-foreground mt-1">Booked</span>
                        )}
                      </Button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep('calendar')}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep('details')}
                      disabled={!selectedTime}
                    >
                      Continue to Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Appointment Details */}
              {step === 'details' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionType">Session Type *</Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IQ Test Results Discussion">IQ Test Results Discussion</SelectItem>
                        <SelectItem value="Career Counseling">Career Counseling</SelectItem>
                        <SelectItem value="Learning Assessment">Learning Assessment</SelectItem>
                        <SelectItem value="General Consultation">General Consultation</SelectItem>
                        <SelectItem value="Academic Performance">Academic Performance</SelectItem>
                        <SelectItem value="Cognitive Training">Cognitive Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Share any specific topics you'd like to discuss or questions you have..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">60 minutes</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-bold text-lg">${psychologist.hourlyRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep('time')}>
                      Back
                    </Button>
                    <Button
                      onClick={handleBooking}
                      disabled={!sessionType}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}