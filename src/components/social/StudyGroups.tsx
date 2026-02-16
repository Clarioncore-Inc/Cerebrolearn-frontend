import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  Users,
  Search,
  Plus,
  Crown,
  Calendar,
  Clock,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Lock,
  Globe,
  UserPlus,
  Settings,
  MoreVertical,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface StudyGroupsProps {
  userId: string;
}

export function StudyGroups({ userId }: StudyGroupsProps) {
  const [selectedTab, setSelectedTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    privacy: 'public',
    course: '',
  });

  const myGroups = [
    {
      id: '1',
      name: 'JavaScript Mastery',
      description: 'Learning JavaScript together through practice and code reviews',
      course: 'JavaScript Fundamentals',
      members: 24,
      privacy: 'public',
      role: 'admin',
      lastActivity: '2024-01-15T14:30:00',
      stats: {
        discussions: 45,
        resources: 12,
        completedTasks: 8,
      },
      upcomingSession: {
        title: 'Code Review Session',
        date: '2024-01-16T18:00:00',
      },
    },
    {
      id: '2',
      name: 'React Study Circle',
      description: 'Advanced React patterns and best practices study group',
      course: 'Advanced React Patterns',
      members: 18,
      privacy: 'private',
      role: 'member',
      lastActivity: '2024-01-15T10:00:00',
      stats: {
        discussions: 32,
        resources: 8,
        completedTasks: 5,
      },
      upcomingSession: null,
    },
    {
      id: '3',
      name: 'System Design Crew',
      description: 'Preparing for system design interviews together',
      course: 'System Design Fundamentals',
      members: 15,
      privacy: 'public',
      role: 'member',
      lastActivity: '2024-01-14T16:45:00',
      stats: {
        discussions: 28,
        resources: 15,
        completedTasks: 12,
      },
      upcomingSession: {
        title: 'Mock Interview Practice',
        date: '2024-01-17T19:00:00',
      },
    },
  ];

  const discoverGroups = [
    {
      id: '4',
      name: 'Python Beginners',
      description: 'Start your Python journey with fellow beginners',
      course: 'Python Fundamentals',
      members: 42,
      privacy: 'public',
      joined: false,
    },
    {
      id: '5',
      name: 'Data Science Enthusiasts',
      description: 'Exploring data science concepts and tools together',
      course: 'Data Science Basics',
      members: 35,
      privacy: 'public',
      joined: false,
    },
    {
      id: '6',
      name: 'Machine Learning Study Group',
      description: 'Deep dive into ML algorithms and applications',
      course: 'Machine Learning Fundamentals',
      members: 28,
      privacy: 'public',
      joined: false,
    },
  ];

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Study group created successfully!');
    setShowCreateModal(false);
    setNewGroup({ name: '', description: '', privacy: 'public', course: '' });
  };

  const handleJoinGroup = (groupId: string) => {
    toast.success('Joined study group successfully!');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Study Groups</h2>
          <p className="text-muted-foreground">
            Learn together, grow together
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b">
        <button
          onClick={() => setSelectedTab('my-groups')}
          className={`pb-3 px-2 font-medium transition-colors ${
            selectedTab === 'my-groups'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          My Groups ({myGroups.length})
        </button>
        <button
          onClick={() => setSelectedTab('discover')}
          className={`pb-3 px-2 font-medium transition-colors ${
            selectedTab === 'discover'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Discover
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* My Groups Tab */}
      {selectedTab === 'my-groups' && (
        <div className="space-y-4">
          {myGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Group Avatar */}
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-white" />
                    </div>

                    {/* Group Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            {group.role === 'admin' && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                            {group.privacy === 'private' ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {group.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {group.members} members
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {group.course}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Active {formatTimeAgo(group.lastActivity)}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Group Stats */}
                      <div className="flex gap-6 mb-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">{group.stats.discussions}</div>
                          <div className="text-xs text-muted-foreground">Discussions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">{group.stats.resources}</div>
                          <div className="text-xs text-muted-foreground">Resources</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">{group.stats.completedTasks}</div>
                          <div className="text-xs text-muted-foreground">Tasks Done</div>
                        </div>
                      </div>

                      {/* Upcoming Session */}
                      {group.upcomingSession && (
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm">Upcoming Session</span>
                              </div>
                              <p className="text-sm mb-1">{group.upcomingSession.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(group.upcomingSession.date).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <Button size="sm">Join</Button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Discussions
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Target className="h-4 w-4 mr-2" />
                          Goals
                        </Button>
                        {group.role === 'admin' && (
                          <Button variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Discover Tab */}
      {selectedTab === 'discover' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {discoverGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {group.name}
                    {group.privacy === 'private' ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </div>
                      <Badge variant="outline">{group.course}</Badge>
                    </div>
                    <Button className="w-full" onClick={() => handleJoinGroup(group.id)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create Study Group</CardTitle>
                <CardDescription>
                  Start a new study group and invite learners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter group name..."
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="What is this group about?"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Privacy</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={newGroup.privacy}
                      onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value })}
                    >
                      <option value="public">Public - Anyone can join</option>
                      <option value="private">Private - Invite only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Related Course</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={newGroup.course}
                      onChange={(e) => setNewGroup({ ...newGroup, course: e.target.value })}
                    >
                      <option value="">Select a course (optional)</option>
                      <option value="js">JavaScript Fundamentals</option>
                      <option value="react">Advanced React</option>
                      <option value="system">System Design</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup}>
                    Create Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {selectedTab === 'my-groups' && myGroups.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Study Groups Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create or join a study group to learn with others
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setSelectedTab('discover')}>
                Discover Groups
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
