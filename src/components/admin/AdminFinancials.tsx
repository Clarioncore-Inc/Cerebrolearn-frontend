import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Calendar,
  Filter,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminFinancials() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonth: 0,
    pendingPayouts: 0,
    platformFees: 0,
    totalTransactions: 0,
    refundRequests: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = () => {
    // Load all payments
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const completedPayments = allPayments.filter((p: any) => p.status === 'completed');
    
    const totalRevenue = completedPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = completedPayments
      .filter((p: any) => new Date(p.transactionDate) >= startOfMonth)
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    // Platform fee is 10% of revenue
    const platformFees = totalRevenue * 0.1;

    // Load payout requests
    const allPayouts = JSON.parse(localStorage.getItem('payout_requests') || '[]');
    const pendingPayouts = allPayouts
      .filter((p: any) => p.status === 'pending')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    // Load refund requests
    const allRefunds = JSON.parse(localStorage.getItem('refund_requests') || '[]');
    const pendingRefunds = allRefunds.filter((r: any) => r.status === 'pending');

    setStats({
      totalRevenue,
      thisMonth,
      pendingPayouts,
      platformFees,
      totalTransactions: completedPayments.length,
      refundRequests: pendingRefunds.length,
    });

    // Prepare transactions list
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const txList = completedPayments.map((p: any) => {
      const booking = allBookings.find((b: any) => b.id === p.bookingId);
      return { ...p, booking };
    }).sort((a: any, b: any) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    );
    setTransactions(txList);

    setPayoutRequests(allPayouts.sort((a: any, b: any) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    setRefundRequests(allRefunds.sort((a: any, b: any) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    // Calculate daily revenue for last 7 days
    const dailyRevenue: { [key: string]: number } = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(dateStr);
      dailyRevenue[dateStr] = 0;
    }

    completedPayments.forEach((p: any) => {
      const dateStr = new Date(p.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyRevenue[dateStr] !== undefined) {
        dailyRevenue[dateStr] += p.amount;
      }
    });

    const chartData = last7Days.map(date => ({
      date,
      amount: dailyRevenue[date] || 0,
    }));
    setRevenueData(chartData);
  };

  const handleApprovePayout = (payout: any) => {
    if (!confirm(`Approve payout of $${payout.amount.toFixed(2)} to ${payout.psychologistName}?`)) {
      return;
    }

    const allPayouts = JSON.parse(localStorage.getItem('payout_requests') || '[]');
    const updated = allPayouts.map((p: any) =>
      p.id === payout.id
        ? { ...p, status: 'approved', approvedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('payout_requests', JSON.stringify(updated));
    
    toast.success('Payout approved successfully');
    loadFinancialData();
  };

  const handleRejectPayout = (payout: any) => {
    if (!confirm(`Reject payout of $${payout.amount.toFixed(2)} to ${payout.psychologistName}?`)) {
      return;
    }

    const allPayouts = JSON.parse(localStorage.getItem('payout_requests') || '[]');
    const updated = allPayouts.map((p: any) =>
      p.id === payout.id
        ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('payout_requests', JSON.stringify(updated));
    
    toast.success('Payout rejected');
    loadFinancialData();
  };

  const handleApproveRefund = (refund: any) => {
    if (!confirm(`Approve refund of $${refund.amount.toFixed(2)}?`)) {
      return;
    }

    const allRefunds = JSON.parse(localStorage.getItem('refund_requests') || '[]');
    const updated = allRefunds.map((r: any) =>
      r.id === refund.id
        ? { ...r, status: 'approved', approvedAt: new Date().toISOString() }
        : r
    );
    localStorage.setItem('refund_requests', JSON.stringify(updated));

    // Update payment status
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const updatedPayments = allPayments.map((p: any) =>
      p.id === refund.paymentId
        ? { ...p, status: 'refunded', refundedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    
    toast.success('Refund approved successfully');
    loadFinancialData();
  };

  const handleRejectRefund = (refund: any) => {
    if (!confirm('Reject this refund request?')) {
      return;
    }

    const allRefunds = JSON.parse(localStorage.getItem('refund_requests') || '[]');
    const updated = allRefunds.map((r: any) =>
      r.id === refund.id
        ? { ...r, status: 'rejected', rejectedAt: new Date().toISOString() }
        : r
    );
    localStorage.setItem('refund_requests', JSON.stringify(updated));
    
    toast.success('Refund request rejected');
    loadFinancialData();
  };

  const handleExportReport = () => {
    const reportContent = `
CEREBROLEARN FINANCIAL REPORT
==============================
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Revenue: $${stats.totalRevenue.toFixed(2)}
This Month: $${stats.thisMonth.toFixed(2)}
Platform Fees (10%): $${stats.platformFees.toFixed(2)}
Total Transactions: ${stats.totalTransactions}
Pending Payouts: $${stats.pendingPayouts.toFixed(2)}
Pending Refund Requests: ${stats.refundRequests}

RECENT TRANSACTIONS (Last 20)
------------------------------
${transactions.slice(0, 20).map((tx: any) => `
Date: ${new Date(tx.transactionDate).toLocaleDateString()}
Psychologist: ${tx.booking?.psychologistName || 'N/A'}
Student: ${tx.booking?.studentName || 'N/A'}
Amount: $${tx.amount.toFixed(2)}
Status: ${tx.status}
Receipt: ${tx.receiptNumber}
`).join('\n')}

PENDING PAYOUT REQUESTS
-----------------------
${payoutRequests.filter(p => p.status === 'pending').map((p: any) => `
Psychologist: ${p.psychologistName}
Amount: $${p.amount.toFixed(2)}
Requested: ${new Date(p.requestDate).toLocaleDateString()}
Method: ${p.method}
`).join('\n')}

PENDING REFUND REQUESTS
-----------------------
${refundRequests.filter(r => r.status === 'pending').map((r: any) => `
User: ${r.userId}
Amount: $${r.amount.toFixed(2)}
Requested: ${new Date(r.requestDate).toLocaleDateString()}
`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const filteredTransactions = transactions.filter(tx =>
    searchQuery === '' ||
    tx.booking?.psychologistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.booking?.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Management</h2>
          <p className="text-muted-foreground">
            Monitor revenue, approve payouts, and manage refunds
          </p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
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
              <Wallet className="h-4 w-4" />
              Platform Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.platformFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">10% of revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingPayouts.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refund Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.refundRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.map((data: any, index: number) => {
                const maxAmount = Math.max(...revenueData.map((d: any) => d.amount), 1);
                const percentage = (data.amount / maxAmount) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.date}</span>
                      <span className="font-semibold">${data.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-8 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-end px-3"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
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

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">
            Transactions ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="payouts">
            Payout Requests ({payoutRequests.filter(p => p.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="refunds">
            Refund Requests ({refundRequests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                No transactions found
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx: any) => (
                <Card key={tx.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{tx.booking?.psychologistName || 'N/A'}</h4>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-sm text-muted-foreground">{tx.booking?.studentName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(tx.transactionDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {tx.receiptNumber}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${tx.amount.toFixed(2)}
                        </div>
                        <Badge className="bg-green-500 mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          {payoutRequests.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                No payout requests
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {payoutRequests.map((payout: any) => (
                <Card key={payout.id} className={payout.status === 'pending' ? 'border-yellow-500/50' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{payout.psychologistName}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(payout.requestDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <span>{payout.method === 'bank_transfer' ? 'Bank Transfer' : payout.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xl font-bold">${payout.amount.toFixed(2)}</div>
                          <Badge
                            variant={
                              payout.status === 'approved'
                                ? 'default'
                                : payout.status === 'pending'
                                ? 'outline'
                                : 'destructive'
                            }
                            className="mt-1"
                          >
                            {payout.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {payout.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {payout.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </Badge>
                        </div>
                        {payout.status === 'pending' && (
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprovePayout(payout)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectPayout(payout)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="space-y-4">
          {refundRequests.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                No refund requests
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {refundRequests.map((refund: any) => {
                const payment = transactions.find(t => t.id === refund.paymentId);
                
                return (
                  <Card key={refund.id} className={refund.status === 'pending' ? 'border-yellow-500/50' : ''}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Refund Request</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            User: {refund.userId}
                          </p>
                          {payment && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Session: {payment.booking?.psychologistName} - {payment.booking?.sessionType}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(refund.requestDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xl font-bold">${refund.amount.toFixed(2)}</div>
                            <Badge
                              variant={
                                refund.status === 'approved'
                                  ? 'default'
                                  : refund.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                              }
                              className="mt-1"
                            >
                              {refund.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {refund.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {refund.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                            </Badge>
                          </div>
                          {refund.status === 'pending' && (
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRefund(refund)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRefund(refund)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
