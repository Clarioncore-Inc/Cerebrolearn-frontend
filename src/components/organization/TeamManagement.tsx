import React, { useState } from 'react';
import { Users, Search, Plus, MoreVertical, Trash2, Edit, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TeamManagementProps {
  organizationId: string;
}

export function TeamManagement({ organizationId }: TeamManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);

  // Mock data - replace with API calls
  const teams = [
    {
      id: '1',
      name: 'Engineering',
      description: 'Software development and technical teams',
      memberCount: 45,
      teamLead: 'Sarah Chen',
      coursesAssigned: 12,
      avgProgress: 78,
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'Marketing',
      description: 'Marketing, content, and growth teams',
      memberCount: 28,
      teamLead: 'Mike Johnson',
      coursesAssigned: 8,
      avgProgress: 82,
      created: '2024-01-20'
    },
    {
      id: '3',
      name: 'Sales',
      description: 'Sales and business development',
      memberCount: 52,
      teamLead: 'Emily Davis',
      coursesAssigned: 10,
      avgProgress: 71,
      created: '2024-02-01'
    },
    {
      id: '4',
      name: 'Design',
      description: 'Product design and UX teams',
      memberCount: 22,
      teamLead: 'James Wilson',
      coursesAssigned: 15,
      avgProgress: 85,
      created: '2024-02-05'
    },
    {
      id: '5',
      name: 'Product',
      description: 'Product management and strategy',
      memberCount: 31,
      teamLead: 'Lisa Anderson',
      coursesAssigned: 11,
      avgProgress: 74,
      created: '2024-02-10'
    },
    {
      id: '6',
      name: 'HR',
      description: 'Human resources and people operations',
      memberCount: 15,
      teamLead: 'David Kim',
      coursesAssigned: 6,
      avgProgress: 88,
      created: '2024-02-15'
    }
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    toast.success('Team created successfully!');
    setShowCreateModal(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      toast.success('Team deleted successfully!');
    }
  };

  const handleAddMembers = () => {
    toast.success('Members added to team!');
    setShowAddMembersModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Team Management</h1>
          <p className="text-gray-600">Create and manage teams within your organization</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Team
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Teams</p>
          <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Members</p>
          <p className="text-2xl font-bold text-gray-900">{teams.reduce((sum, t) => sum + t.memberCount, 0)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Avg Team Size</p>
          <p className="text-2xl font-bold text-gray-900">{Math.round(teams.reduce((sum, t) => sum + t.memberCount, 0) / teams.length)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Avg Progress</p>
          <p className="text-2xl font-bold text-gray-900">{Math.round(teams.reduce((sum, t) => sum + t.avgProgress, 0) / teams.length)}%</p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#395192] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{team.name}</h3>
              <p className="text-sm text-gray-600">{team.description}</p>
            </div>

            {/* Card Stats */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Members</p>
                  <p className="text-xl font-semibold text-gray-900">{team.memberCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Courses</p>
                  <p className="text-xl font-semibold text-gray-900">{team.coursesAssigned}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Avg Progress</span>
                  <span className="font-semibold text-gray-900">{team.avgProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#395192] rounded-full h-2 transition-all"
                    style={{ width: `${team.avgProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                  {team.teamLead.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{team.teamLead}</p>
                  <p className="text-xs text-gray-500">Team Lead</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTeam(team.id);
                    setShowAddMembersModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Members
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or create a new team</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
          >
            Create Team
          </button>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Create New Team</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Engineering Team"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Brief description of the team"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Lead
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sarah Chen</SelectItem>
                    <SelectItem value="2">Mike Johnson</SelectItem>
                    <SelectItem value="3">Emily Davis</SelectItem>
                    <SelectItem value="4">James Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="flex-1 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Add Members to Team</h2>
                <button
                  onClick={() => setShowAddMembersModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search members..."
                    className="w-full pl-10"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson'].map((name) => (
                  <label key={name} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#395192] rounded" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-900">{name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => setShowAddMembersModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                className="flex-1 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
              >
                Add Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}