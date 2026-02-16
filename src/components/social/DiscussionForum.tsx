import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Pin,
  Lock,
  TrendingUp,
  Eye,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Flag,
  BookOpen,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface DiscussionForumProps {
  courseId?: string;
  courseName?: string;
  isGeneralForum?: boolean;
}

export function DiscussionForum({ courseId, courseName, isGeneralForum = false }: DiscussionForumProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    category: 'discussion',
    content: '',
  });

  const categories = [
    { id: 'all', name: 'All Topics', icon: MessageSquare, count: 124 },
    { id: 'discussion', name: 'General Discussion', icon: MessageSquare, count: 45 },
    { id: 'questions', name: 'Questions', icon: AlertCircle, count: 38 },
    { id: 'resources', name: 'Resources', icon: BookOpen, count: 22 },
    { id: 'announcements', name: 'Announcements', icon: Pin, count: 12 },
    { id: 'solved', name: 'Solved', icon: CheckCircle2, count: 7 },
  ];

  const threads = [
    {
      id: '1',
      title: 'How to implement recursion in JavaScript?',
      author: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        role: 'Student',
        level: 'Advanced',
      },
      category: 'questions',
      content: 'I\'m having trouble understanding how recursion works in JavaScript. Can someone explain with examples?',
      replies: 12,
      views: 234,
      likes: 18,
      isPinned: false,
      isSolved: true,
      createdAt: '2024-01-15T10:30:00',
      lastActivity: '2024-01-15T14:22:00',
      tags: ['javascript', 'recursion', 'fundamentals'],
    },
    {
      id: '2',
      title: 'Welcome to the JavaScript Fundamentals Course!',
      author: {
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        role: 'Instructor',
        level: 'Expert',
      },
      category: 'announcements',
      content: 'Welcome everyone! This is your official course discussion forum. Feel free to ask questions, share resources, and help each other.',
      replies: 45,
      views: 892,
      likes: 67,
      isPinned: true,
      isSolved: false,
      createdAt: '2024-01-10T09:00:00',
      lastActivity: '2024-01-15T16:45:00',
      tags: ['welcome', 'introduction'],
    },
    {
      id: '3',
      title: 'Sharing my study notes on Async/Await',
      author: {
        name: 'Emily Rodriguez',
        avatar: 'ER',
        role: 'Student',
        level: 'Intermediate',
      },
      category: 'resources',
      content: 'I created comprehensive notes on async/await patterns. Hope this helps others!',
      replies: 8,
      views: 156,
      likes: 34,
      isPinned: false,
      isSolved: false,
      createdAt: '2024-01-14T15:20:00',
      lastActivity: '2024-01-15T11:30:00',
      tags: ['async', 'promises', 'notes'],
    },
    {
      id: '4',
      title: 'Best practices for error handling?',
      author: {
        name: 'David Kim',
        avatar: 'DK',
        role: 'Student',
        level: 'Beginner',
      },
      category: 'questions',
      content: 'What are the industry standard practices for handling errors in production applications?',
      replies: 15,
      views: 298,
      likes: 22,
      isPinned: false,
      isSolved: true,
      createdAt: '2024-01-13T11:45:00',
      lastActivity: '2024-01-15T13:15:00',
      tags: ['error-handling', 'best-practices'],
    },
    {
      id: '5',
      title: 'Weekly Challenge: Build a Todo App',
      author: {
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        role: 'Instructor',
        level: 'Expert',
      },
      category: 'discussion',
      content: 'This week\'s challenge: Build a todo app using what we\'ve learned so far. Share your solutions!',
      replies: 28,
      views: 445,
      likes: 41,
      isPinned: true,
      isSolved: false,
      createdAt: '2024-01-12T08:00:00',
      lastActivity: '2024-01-15T15:50:00',
      tags: ['challenge', 'project'],
    },
  ];

  const filteredThreads = threads.filter((thread) => {
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });

  const handleCreateThread = () => {
    if (!newThread.title || !newThread.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Discussion thread created successfully!');
    setShowNewThreadModal(false);
    setNewThread({ title: '', category: 'discussion', content: '' });
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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {isGeneralForum ? 'Community Forum' : `${courseName} Discussion`}
          </h2>
          <p className="text-muted-foreground">
            Ask questions, share knowledge, and connect with fellow learners
          </p>
        </div>
        <Button onClick={() => setShowNewThreadModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="gap-2">
              <category.icon className="h-4 w-4" />
              {category.name}
              <Badge variant="secondary">{category.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Thread List */}
      <div className="space-y-4">
        {sortedThreads.map((thread, index) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Thread Stats */}
                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{thread.replies}</div>
                      <div className="text-xs text-muted-foreground">replies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{thread.views}</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>

                  {/* Thread Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      {thread.isPinned && (
                        <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                          {thread.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {thread.content}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {thread.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Author and Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{thread.author.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{thread.author.name}</span>
                            {thread.author.role === 'Instructor' && (
                              <Badge variant="secondary" className="text-xs">
                                Instructor
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(thread.lastActivity)}
                          </div>
                          {thread.isSolved && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs font-medium">Solved</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thread Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {thread.likes}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sortedThreads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No discussions found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
            </p>
            <Button onClick={() => setShowNewThreadModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start a Discussion
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>Start a New Discussion</CardTitle>
                <CardDescription>
                  Ask a question, share resources, or start a conversation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter a descriptive title..."
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                  >
                    <option value="discussion">General Discussion</option>
                    <option value="questions">Question</option>
                    <option value="resources">Resource</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Share your thoughts, questions, or resources..."
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowNewThreadModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateThread}>
                    Create Thread
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Forum Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">124</div>
              <div className="text-sm text-muted-foreground">Total Threads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,234</div>
              <div className="text-sm text-muted-foreground">Total Replies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">456</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-sm text-muted-foreground">Solved Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
