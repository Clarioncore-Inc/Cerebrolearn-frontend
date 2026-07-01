import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Check, Download, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreatorPayoutsProps {
  creatorId: string;
}

export function CreatorPayouts({ creatorId }: CreatorPayoutsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  // Mock data
  const payoutStats = {
    totalEarnings: 12450.50,
    availableBalance: 3240.75,
    pendingPayouts: 1850.00,
    thisMonth: 4120.30
  };

  const payouts = [
    { id: '1', amount: 1250.50, status: 'completed', date: '2024-12-01', method: 'Stripe', reference: 'po_abc123' },
    { id: '2', amount: 890.25, status: 'completed', date: '2024-11-15', method: 'Bank Transfer', reference: 'po_def456' },
    { id: '3', amount: 1850.00, status: 'pending', date: '2024-12-15', method: 'Stripe', reference: 'po_ghi789' },
    { id: '4', amount: 2100.00, status: 'completed', date: '2024-11-01', method: 'Stripe', reference: 'po_jkl012' }
  ];

  const filteredPayouts = filterStatus === 'all' 
    ? payouts 
    : payouts.filter(p => p.status === filterStatus);

  const handleRequestPayout = () => {
    toast.success('Payout request submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="mb-2">Creator Payouts</h1>
        <p className="text-gray-600">Track and manage your earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-gray-900">${payoutStats.totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#395192]" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-gray-900">${payoutStats.availableBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Pending Payouts</p>
          <p className="text-3xl font-bold text-gray-900">${payoutStats.pendingPayouts.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold text-gray-900">${payoutStats.thisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Request Payout */}
      <div className="bg-gradient-to-br from-[#395192] to-[#4a63a8] p-6 rounded-lg mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Ready to withdraw?</h3>
            <p className="text-blue-100 text-sm">${payoutStats.availableBalance.toLocaleString()} available for payout</p>
          </div>
          <button
            onClick={handleRequestPayout}
            className="px-6 py-3 bg-white text-[#395192] rounded-lg hover:bg-blue-50 transition-colors font-medium"
            disabled={payoutStats.availableBalance < 50}
          >
            Request Payout
          </button>
        </div>
        {payoutStats.availableBalance < 50 && (
          <p className="text-blue-100 text-sm mt-2">Minimum payout amount is $50</p>
        )}
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Payout History</h3>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{payout.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${payout.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{payout.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{payout.reference}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      payout.status === 'completed' ? 'bg-green-100 text-green-700' :
                      payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payout.status === 'completed' && <Check className="w-3 h-3" />}
                      {payout.status === 'pending' && <Clock className="w-3 h-3" />}
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
