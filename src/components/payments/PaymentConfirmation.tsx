import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CheckCircle,
  Download,
  Calendar,
  Clock,
  User,
  CreditCard,
  FileText,
  Home,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentConfirmationProps {
  onNavigate: (page: string, data?: any) => void;
  payment: any;
  booking: any;
}

export function PaymentConfirmation({ onNavigate, payment, booking }: PaymentConfirmationProps) {
  const handleDownloadReceipt = () => {
    // Generate receipt content
    const receiptContent = `
CEREBROLEARN PAYMENT RECEIPT
============================

Receipt Number: ${payment.receiptNumber}
Transaction Date: ${new Date(payment.transactionDate).toLocaleString()}

BOOKING DETAILS
---------------
Psychologist: ${booking.psychologistName}
Session Type: ${booking.sessionType}
Date: ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${booking.time}
Duration: 60 minutes

PAYMENT DETAILS
---------------
Amount Paid: $${payment.amount.toFixed(2)}
Payment Method: ${payment.paymentMethod === 'card' ? `Card ending in ${payment.cardLast4}` : payment.paymentMethod}
Status: ${payment.status}

Thank you for choosing CerebroLearn!
For support, contact: support@cerebrolearn.com
    `.trim();

    // Create and download receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${payment.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded');
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 mb-4">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground text-lg">
          Your session has been booked
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking Confirmed</CardTitle>
              <CardDescription>Receipt #{payment.receiptNumber}</CardDescription>
            </div>
            <Badge className="bg-green-500">Paid</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Session Details */}
          <div>
            <h3 className="font-semibold mb-4">Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Psychologist</p>
                  <p className="font-medium">{booking.psychologistName}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.psychologist?.specialization || 'Clinical Psychologist'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Session Type</p>
                  <p className="font-medium">{booking.sessionType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(booking.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{booking.time}</p>
                  <p className="text-xs text-muted-foreground">60 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                </div>
                <span className="font-medium">
                  {payment.paymentMethod === 'card' 
                    ? `Card ending in ${payment.cardLast4}`
                    : payment.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transaction Date:</span>
                <span className="font-medium">
                  {new Date(payment.transactionDate).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transaction ID:</span>
                <span className="font-medium font-mono text-xs">{payment.id}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-semibold">Amount Paid:</span>
                <span className="font-bold text-xl text-green-600 dark:text-green-400">
                  ${payment.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium">Confirmation Email Sent</p>
              <p className="text-sm text-muted-foreground">
                Check your email for booking confirmation and session details
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium">Psychologist Will Confirm</p>
              <p className="text-sm text-muted-foreground">
                Your psychologist will confirm the appointment within 24 hours
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium">Prepare for Your Session</p>
              <p className="text-sm text-muted-foreground">
                You can message your psychologist to discuss any specific topics
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">4</span>
            </div>
            <div>
              <p className="font-medium">Join Your Session</p>
              <p className="text-sm text-muted-foreground">
                A "Join Session" button will appear 15 minutes before your appointment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleDownloadReceipt}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onNavigate('session-messaging', { booking })}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message Psychologist
        </Button>
        <Button
          className="flex-1"
          onClick={() => onNavigate('student-sessions')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View My Sessions
        </Button>
      </div>

      <div className="text-center mt-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('dashboard')}
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
