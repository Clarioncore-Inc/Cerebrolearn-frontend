import React, { useState } from 'react';
import { Search, UserPlus, Mail, MoreVertical, Filter, Download, Shield, Users, X, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MemberManagementProps {
  organizationId: string;
}

export function MemberManagement({ organizationId }: MemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Mock data - replace with API calls
  const members = [
    { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Admin', team: 'Engineering', status: 'Active', joined: '2024-01-15', lastActive: '2 hours ago', coursesCompleted: 12 },
    { id: '2', name: 'Mike Johnson', email: 'mike@company.com', role: 'Manager', team: 'Product', status: 'Active', joined: '2024-01-20', lastActive: '5 hours ago', coursesCompleted: 10 },
    { id: '3', name: 'Emily Davis', email: 'emily@company.com', role: 'Manager', team: 'Sales', status: 'Active', joined: '2024-02-01', lastActive: '1 day ago', coursesCompleted: 11 },
    { id: '4', name: 'James Wilson', email: 'james@company.com', role: 'Member', team: 'Design', status: 'Active', joined: '2024-02-05', lastActive: '3 hours ago', coursesCompleted: 9 },
    { id: '5', name: 'Lisa Anderson', email: 'lisa@company.com', role: 'Member', team: 'Marketing', status: 'Active', joined: '2024-02-10', lastActive: '30 mins ago', coursesCompleted: 8 },
    { id: '6', name: 'David Kim', email: 'david@company.com', role: 'Member', team: 'HR', status: 'Inactive', joined: '2024-02-15', lastActive: '1 week ago', coursesCompleted: 3 },
    { id: '7', name: 'Anna Martinez', email: 'anna@company.com', role: 'Member', team: 'Engineering', status: 'Active', joined: '2024-02-20', lastActive: '1 hour ago', coursesCompleted: 7 },
    { id: '8', name: 'Tom Brown', email: 'tom@company.com', role: 'Manager', team: 'Engineering', status: 'Active', joined: '2024-03-01', lastActive: '4 hours ago', coursesCompleted: 6 }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInvite = () => {
    toast.success('Invitations sent successfully!');
    setShowInviteModal(false);
  };

  const handleBulkAction = (action: string) => {
    if (selectedMembers.length === 0) {
      toast.error('Please select members first');
      return;
    }
    toast.success(`${action} applied to ${selectedMembers.length} members`);
    setSelectedMembers([]);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleAllMembers = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Member Management</h1>
          <p className="text-gray-600">Manage organization members and permissions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleBulkAction('Export')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Invite Members
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Members</p>
          <p className="text-2xl font-bold text-gray-900">{members.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Active Members</p>
          <p className="text-2xl font-bold text-gray-900">{members.filter(m => m.status === 'Active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Admins</p>
          <p className="text-2xl font-bold text-gray-900">{members.filter(m => m.role === 'Admin').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Managers</p>
          <p className="text-2xl font-bold text-gray-900">{members.filter(m => m.role === 'Manager').length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div className="bg-[#395192] text-white p-4 rounded-lg mb-6 flex items-center justify-between">
          <span className="font-medium">{selectedMembers.length} members selected</span>
          <div className="flex gap-3">
            <button
              onClick={() => handleBulkAction('Assign to Team')}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Assign to Team
            </button>
            <button
              onClick={() => handleBulkAction('Change Role')}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Change Role
            </button>
            <button
              onClick={() => setSelectedMembers([])}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                    onChange={toggleAllMembers}
                    className="w-4 h-4 text-[#395192] rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMemberSelection(member.id)}
                      className="w-4 h-4 text-[#395192] rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#395192] rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      member.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {member.role === 'Admin' && <Shield className="w-3 h-3" />}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{member.team}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'
                      }`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.lastActive}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {member.coursesCompleted}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mt-6">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or invite new members</p>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Invite Members</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Addresses *
                </label>
                <textarea
                  placeholder="Enter email addresses, one per line"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">You can invite multiple people at once</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Role *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                  <option value="Member">Member</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Team
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                  <option value="">No team (assign later)</option>
                  <option value="1">Engineering</option>
                  <option value="2">Marketing</option>
                  <option value="3">Sales</option>
                  <option value="4">Design</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
              >
                Send Invitations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}