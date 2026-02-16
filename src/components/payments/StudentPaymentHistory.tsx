import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  ArrowLeft,
  Download,
  Search,
  Filter,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface StudentPaymentHistoryProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'refunded' | 'failed';
  transactionDate: string;
  cardLast4?: string;
  receiptNumber: string;
}

export function StudentPaymentHistory({ onNavigate }: StudentPaymentHistoryProps) {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    if (!user) return;
    loadPayments();
  }, [user]);

  const loadPayments = () => {
    // Load payments
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const userPayments = allPayments.filter((p: Payment) => p.userId === user?.email);
    setPayments(userPayments);

    // Load bookings for payment details
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    setBookings(allBookings);

    // Calculate stats
    const total = userPayments.reduce((sum: number, p: Payment) => 
      p.status === 'completed' ? sum + p.amount : sum, 0
    );
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = userPayments
      .filter((p: Payment) => new Date(p.transactionDate) >= startOfMonth && p.status === 'completed')
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    const completed = userPayments.filter((p: Payment) => p.status === 'completed').length;
    const pending = userPayments.filter((p: Payment) => p.status === 'pending').length;

    setStats({ total, thisMonth, completed, pending });
  };

  const handleDownloadReceipt = (payment: Payment) => {
    const booking = bookings.find(b => b.id === payment.bookingId);
    if (!booking) return;

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

PAYMENT DETAILS
---------------
Amount Paid: $${payment.amount.toFixed(2)}
Payment Method: ${payment.paymentMethod === 'card' ? `Card ending in ${payment.cardLast4}` : payment.paymentMethod}
Status: ${payment.status}

Thank you for choosing CerebroLearn!
    `.trim();

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

  const handleRequestRefund = (payment: Payment) => {
    if (!confirm('Are you sure you want to request a refund? This will be reviewed by our team.')) {
      return;
    }

    // Create refund request
    const refundRequest = {
      id: `refund_${Date.now()}`,
      paymentId: payment.id,
      userId: user?.email,
      amount: payment.amount,
      reason: '',
      status: 'pending',
      requestDate: new Date().toISOString(),
    };

    const refundRequests = JSON.parse(localStorage.getItem('refund_requests') || '[]');
    refundRequests.push(refundRequest);
    localStorage.setItem('refund_requests', JSON.stringify(refundRequests));

    toast.success('Refund request submitted. Our team will review it within 48 hours.');
  };

  const filteredPayments = payments
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => {
      if (!searchQuery) return true;
      const booking = bookings.find(b => b.id === p.bookingId);
      return (
        p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking?.psychologistName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground">
          View and manage your payment transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.thisMonth.toFixed(2)}</div>
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
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by receipt number or psychologist..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No payments found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Your payment history will appear here'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => onNavigate('browse-psychologists')}>
                Book a Session
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            const booking = bookings.find(b => b.id === payment.bookingId);
            if (!booking) return null;

            return (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {booking.psychologistName}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {booking.sessionType}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              {payment.paymentMethod === 'card' 
                                ? `•••• ${payment.cardLast4}`
                                : payment.paymentMethod}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {payment.receiptNumber}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(payment.status)}
                          <p className="text-2xl font-bold mt-2">
                            ${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(payment.transactionDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 md:flex-col">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReceipt(payment)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                      {payment.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestRefund(payment)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
