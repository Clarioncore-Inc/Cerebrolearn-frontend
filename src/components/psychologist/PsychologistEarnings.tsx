import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  Wallet,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface PsychologistEarningsProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PsychologistEarnings({ onNavigate }: PsychologistEarningsProps) {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0,
    available: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    loadEarnings();
  }, [user]);

  const loadEarnings = () => {
    // Load all payments
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    
    // Get bookings for this psychologist
    const myBookings = allBookings.filter((b: any) => b.psychologistEmail === user?.email);
    const myPayments = allPayments.filter((p: any) => 
      myBookings.some((b: any) => b.id === p.bookingId)
    );

    // Calculate earnings
    const completedPayments = myPayments.filter((p: any) => p.status === 'completed');
    const total = completedPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonth = completedPayments
      .filter((p: any) => new Date(p.transactionDate) >= startOfMonth)
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const lastMonth = completedPayments
      .filter((p: any) => {
        const date = new Date(p.transactionDate);
        return date >= startOfLastMonth && date <= endOfLastMonth;
      })
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    // Load payout requests
    const allPayouts = JSON.parse(localStorage.getItem('payout_requests') || '[]');
    const myPayouts = allPayouts.filter((p: any) => p.psychologistEmail === user?.email);
    setPayoutRequests(myPayouts);

    const pendingPayouts = myPayouts
      .filter((p: any) => p.status === 'pending')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const available = total - myPayouts
      .filter((p: any) => p.status === 'pending' || p.status === 'approved')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    setEarnings({
      total,
      thisMonth,
      lastMonth,
      pending: pendingPayouts,
      available,
    });

    // Prepare transaction list
    const txList = completedPayments.map((p: any) => {
      const booking = myBookings.find((b: any) => b.id === p.bookingId);
      return {
        ...p,
        booking,
      };
    }).sort((a: any, b: any) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    );
    setTransactions(txList);

    // Calculate monthly data for chart
    const monthlyEarnings: { [key: string]: number } = {};
    completedPayments.forEach((p: any) => {
      const month = new Date(p.transactionDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + p.amount;
    });

    const chartData = Object.entries(monthlyEarnings)
      .map(([month, amount]) => ({ month, amount }))
      .slice(-6); // Last 6 months
    setMonthlyData(chartData);
  };

  const handleRequestPayout = () => {
    if (earnings.available <= 0) {
      toast.error('No funds available for payout');
      return;
    }

    const payout = {
      id: `payout_${Date.now()}`,
      psychologistEmail: user?.email,
      psychologistName: user?.user_metadata?.full_name,
      amount: earnings.available,
      status: 'pending',
      requestDate: new Date().toISOString(),
      method: 'bank_transfer',
    };

    const allPayouts = JSON.parse(localStorage.getItem('payout_requests') || '[]');
    allPayouts.push(payout);
    localStorage.setItem('payout_requests', JSON.stringify(allPayouts));

    toast.success('Payout request submitted successfully');
    loadEarnings();
  };

  const handleDownloadReport = () => {
    const reportContent = `
CEREBROLEARN EARNINGS REPORT
============================
Psychologist: ${user?.user_metadata?.full_name}
Generated: ${new Date().toLocaleString()}

EARNINGS SUMMARY
----------------
Total Earnings: $${earnings.total.toFixed(2)}
This Month: $${earnings.thisMonth.toFixed(2)}
Last Month: $${earnings.lastMonth.toFixed(2)}
Pending Payouts: $${earnings.pending.toFixed(2)}
Available for Payout: $${earnings.available.toFixed(2)}

RECENT TRANSACTIONS
-------------------
${transactions.slice(0, 10).map((tx: any) => `
Date: ${new Date(tx.transactionDate).toLocaleDateString()}
Student: ${tx.booking?.studentName}
Session: ${tx.booking?.sessionType}
Amount: $${tx.amount.toFixed(2)}
`).join('\n')}

This is an automated report from CerebroLearn.
For questions, contact: support@cerebrolearn.com
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Earnings_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report downloaded');
  };

  const growthPercentage = earnings.lastMonth > 0
    ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100)
    : 0;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('psychologist-dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings</h1>
            <p className="text-muted-foreground">
              Track your income and request payouts
            </p>
          </div>
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">${earnings.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
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
            <div className="text-2xl font-bold mb-1">${earnings.thisMonth.toFixed(2)}</div>
            {growthPercentage !== 0 && (
              <div className={`flex items-center gap-1 text-xs ${growthPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-3 w-3" />
                {growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
              </div>
            )}
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
            <div className="text-2xl font-bold">${earnings.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">In review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${earnings.available.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Section */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Request Payout</p>
                <p className="text-sm text-muted-foreground">
                  You have <span className="font-semibold text-green-600">${earnings.available.toFixed(2)}</span> available to withdraw
                </p>
              </div>
            </div>
            <Button
              onClick={handleRequestPayout}
              disabled={earnings.available <= 0}
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Chart (Simple Bar Representation) */}
      {monthlyData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Earnings
            </CardTitle>
            <CardDescription>Last 6 months earnings overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((data: any, index: number) => {
                const maxAmount = Math.max(...monthlyData.map((d: any) => d.amount));
                const percentage = (data.amount / maxAmount) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <span className="font-semibold">${data.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-end px-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-xs text-white font-medium">
                            ${data.amount.toFixed(0)}
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

      {/* Tabs for Transactions and Payouts */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">
            Transaction History ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="payouts">
            Payout Requests ({payoutRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6 space-y-4">
          {transactions.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground">
                  Completed sessions will appear here
                </p>
              </div>
            </Card>
          ) : (
            transactions.map((tx: any) => (
              <Card key={tx.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{tx.booking?.studentName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {tx.booking?.sessionType}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(tx.transactionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tx.receiptNumber}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        +${tx.amount.toFixed(2)}
                      </div>
                      <Badge className="bg-green-500 mt-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="payouts" className="mt-6 space-y-4">
          {payoutRequests.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No payout requests</h3>
                <p className="text-muted-foreground">
                  Request a payout to see it here
                </p>
              </div>
            </Card>
          ) : (
            payoutRequests.map((payout: any) => (
              <Card key={payout.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Payout Request</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {payout.method === 'bank_transfer' ? 'Bank Transfer' : payout.method}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(payout.requestDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${payout.amount.toFixed(2)}
                      </div>
                      <Badge
                        variant={
                          payout.status === 'approved'
                            ? 'default'
                            : payout.status === 'pending'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="mt-1"
                      >
                        {payout.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {payout.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
