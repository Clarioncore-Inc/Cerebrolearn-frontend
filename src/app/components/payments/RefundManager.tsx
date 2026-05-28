import React, { useState } from 'react';
import { Search, Filter, DollarSign, AlertCircle, CheckCircle, X, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';

interface RefundManagerProps {
  userRole: 'admin' | 'creator';
}

export function RefundManager({ userRole }: RefundManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const refundRequests = [
    { 
      id: '1', 
      student: 'John Doe', 
      course: 'Advanced React Patterns', 
      amount: 49.99, 
      reason: 'Course content not as expected', 
      date: '2024-12-01',
      status: 'pending'
    },
    { 
      id: '2', 
      student: 'Jane Smith', 
      course: 'Data Analytics', 
      amount: 39.99, 
      reason: 'Technical issues with videos', 
      date: '2024-11-28',
      status: 'approved'
    },
    { 
      id: '3', 
      student: 'Bob Johnson', 
      course: 'UI/UX Design', 
      amount: 59.99, 
      reason: 'Duplicate purchase', 
      date: '2024-11-25',
      status: 'rejected'
    }
  ];

  const filteredRequests = refundRequests.filter(r => {
    const matchesSearch = r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    toast.success('Refund approved');
  };

  const handleReject = (id: string) => {
    toast.success('Refund rejected');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="mb-2">Refund Manager</h1>
        <p className="text-gray-600">Review and process refund requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{refundRequests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {refundRequests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {refundRequests.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ${refundRequests.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by transaction ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Refund Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{request.student}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    request.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Course: {request.course}</p>
                <p className="text-sm text-gray-600">Date: {request.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${request.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
              <p className="text-sm text-gray-600">{request.reason}</p>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Refund
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  Reject Request
                </button>
              </div>
            )}

            {request.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Refund processed successfully</span>
              </div>
            )}

            {request.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">Refund request rejected</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No refund requests found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}