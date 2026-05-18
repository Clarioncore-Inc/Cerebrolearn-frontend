import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  Search,
  Plus,
  Clock,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import {
  discussionsApi,
  type DiscussionCategory,
  type DiscussionPostRecord,
  type DiscussionReplyRecord,
} from '../../utils/api-client';

interface DiscussionForumProps {
  courseId?: string;
  courseName?: string;
  isGeneralForum?: boolean;
}

type DiscussionCategoryFilter = 'all' | DiscussionCategory;

const CATEGORY_CONFIG: Array<{
  id: DiscussionCategoryFilter;
  name: string;
  icon: typeof MessageSquare;
}> = [
  { id: 'all', name: 'All Topics', icon: MessageSquare },
  { id: 'general_discussion', name: 'General Discussion', icon: MessageSquare },
  { id: 'question', name: 'Questions', icon: AlertCircle },
  { id: 'resource', name: 'Resources', icon: BookOpen },
];

const getDisplayName = (user?: { full_name?: string; name?: string; email?: string } | null) =>
  user?.full_name || user?.name || user?.email || 'Anonymous';

const getAvatarFallback = (user?: { full_name?: string; name?: string; email?: string } | null) => {
  const name = getDisplayName(user).trim();
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'A';
};

const countReplies = (replies: DiscussionReplyRecord[] = []): number =>
  replies.reduce((total, reply) => total + 1 + countReplies(reply.replies || []), 0);

const collectParticipantIds = (replies: DiscussionReplyRecord[] = [], ids = new Set<string>()) => {
  replies.forEach((reply) => {
    ids.add(reply.user_id);
    collectParticipantIds(reply.replies || [], ids);
  });
  return ids;
};

const normalizeDiscussionReplies = (
  replies: DiscussionReplyRecord[] = [],
): DiscussionReplyRecord[] => {
  const flatReplies = new Map<string, DiscussionReplyRecord>();

  const visit = (reply: DiscussionReplyRecord) => {
    const existing = flatReplies.get(reply.id);
    flatReplies.set(reply.id, {
      ...existing,
      ...reply,
      replies: [],
    });

    (reply.replies || []).forEach(visit);
  };

  replies.forEach(visit);

  const replyTree = new Map<string, DiscussionReplyRecord>();
  flatReplies.forEach((reply, id) => {
    replyTree.set(id, { ...reply, replies: [] });
  });

  const topLevelReplies: DiscussionReplyRecord[] = [];

  flatReplies.forEach((reply) => {
    const currentReply = replyTree.get(reply.id);
    if (!currentReply) return;

    if (reply.parent_id && replyTree.has(reply.parent_id)) {
      const parentReply = replyTree.get(reply.parent_id);
      if (parentReply && !parentReply.replies?.some((child) => child.id === currentReply.id)) {
        parentReply.replies = [...(parentReply.replies || []), currentReply];
      }
      return;
    }

    topLevelReplies.push(currentReply);
  });

  const sortReplies = (items: DiscussionReplyRecord[]): DiscussionReplyRecord[] =>
    [...items]
      .sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map((item) => ({
        ...item,
        replies: sortReplies(item.replies || []),
      }));

  return sortReplies(topLevelReplies);
};

const normalizeDiscussionPost = (post: DiscussionPostRecord): DiscussionPostRecord => ({
  ...post,
  replies: normalizeDiscussionReplies(post.replies || []),
});

const formatCategory = (category: DiscussionCategory) => {
  switch (category) {
    case 'general_discussion':
      return 'General Discussion';
    case 'question':
      return 'Question';
    case 'resource':
      return 'Resource';
    default:
      return category;
  }
};

export function DiscussionForum({ courseName, isGeneralForum = false }: DiscussionForumProps) {
  const { user, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<DiscussionCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [posts, setPosts] = useState<DiscussionPostRecord[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [creatingThread, setCreatingThread] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [loadingPostDetails, setLoadingPostDetails] = useState<Record<string, boolean>>({});
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ postId: string; parentId?: string | null } | null>(
    null,
  );
  const [replyText, setReplyText] = useState('');
  const [submittingReplyForPost, setSubmittingReplyForPost] = useState<string | null>(null);
  const [newThread, setNewThread] = useState({
    title: '',
    category: 'general_discussion' as DiscussionCategory,
    content: '',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPosts([]);
      setLoadingPosts(false);
      return;
    }

    const loadPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await discussionsApi.list();
        setPosts(response.map(normalizeDiscussionPost));
      } catch (error: any) {
        console.error('Error loading discussions:', error);
        toast.error(error?.message ?? 'Failed to load discussions');
      } finally {
        setLoadingPosts(false);
      }
    };

    loadPosts();
  }, [authLoading, user]);

  const categories = useMemo(
    () =>
      CATEGORY_CONFIG.map((category) => ({
        ...category,
        count:
          category.id === 'all'
            ? posts.length
            : posts.filter((post) => post.category === category.id).length,
      })),
    [posts],
  );

  const filteredThreads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const authorName = getDisplayName(post.user).toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.content.toLowerCase().includes(normalizedQuery) ||
        authorName.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const sortedThreads = useMemo(
    () =>
      [...filteredThreads].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      ),
    [filteredThreads],
  );

  const totalReplies = useMemo(
    () => posts.reduce((sum, post) => sum + countReplies(post.replies || []), 0),
    [posts],
  );

  const activeMembers = useMemo(() => {
    const ids = new Set<string>();
    posts.forEach((post) => {
      ids.add(post.user_id);
      collectParticipantIds(post.replies || [], ids);
    });
    return ids.size;
  }, [posts]);

  const totalLikes = useMemo(
    () => posts.reduce((sum, post) => sum + Number(post.like_count || 0), 0),
    [posts],
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) return `${Math.max(diffInMinutes, 0)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const updatePostInState = (updatedPost: DiscussionPostRecord) => {
    const normalizedPost = normalizeDiscussionPost(updatedPost);

    setPosts((currentPosts) => {
      const exists = currentPosts.some((post) => post.id === normalizedPost.id);
      if (!exists) return [normalizedPost, ...currentPosts];
      return currentPosts.map((post) => (post.id === normalizedPost.id ? normalizedPost : post));
    });
  };

  const refreshPost = async (postId: string) => {
    setLoadingPostDetails((prev) => ({ ...prev, [postId]: true }));
    try {
      const refreshedPost = await discussionsApi.get(postId);
      updatePostInState(refreshedPost);
    } catch (error: any) {
      console.error('Error loading discussion details:', error);
      toast.error(error?.message ?? 'Failed to load replies');
    } finally {
      setLoadingPostDetails((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleExpand = async (postId: string) => {
    const isExpanded = expandedPosts.has(postId);

    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (isExpanded) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    if (!isExpanded) {
      await refreshPost(postId);
    }
  };

  const handleCreateThread = async () => {
    if (!user) {
      toast.error('Please log in to start a discussion');
      return;
    }

    if (!newThread.title.trim() || !newThread.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreatingThread(true);
    try {
      const createdPost = await discussionsApi.create({
        title: newThread.title.trim(),
        category: newThread.category,
        content: newThread.content.trim(),
      });
      setPosts((currentPosts) => [normalizeDiscussionPost(createdPost), ...currentPosts]);
      setSelectedCategory('all');
      setShowNewThreadModal(false);
      setNewThread({ title: '', category: 'general_discussion', content: '' });
      toast.success('Discussion thread created successfully!');
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      toast.error(error?.message ?? 'Failed to create discussion');
    } finally {
      setCreatingThread(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please log in to like discussions');
      return;
    }

    setLikingPostId(postId);
    try {
      const updatedPost = await discussionsApi.like(postId);
      updatePostInState(updatedPost);
    } catch (error: any) {
      console.error('Error liking discussion:', error);
      toast.error(error?.message ?? 'Failed to like discussion');
    } finally {
      setLikingPostId(null);
    }
  };

  const openReplyForm = async (postId: string, parentId?: string | null) => {
    if (!user) {
      toast.error('Please log in to reply');
      return;
    }

    setReplyTarget({ postId, parentId });
    setReplyText('');
    setExpandedPosts((prev) => new Set([...prev, postId]));
    await refreshPost(postId);
  };

  const handleSubmitReply = async () => {
    if (!replyTarget) return;
    if (!user) {
      toast.error('Please log in to reply');
      return;
    }
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmittingReplyForPost(replyTarget.postId);
    try {
      await discussionsApi.reply(replyTarget.postId, {
        content: replyText.trim(),
        ...(replyTarget.parentId ? { parent_id: replyTarget.parentId } : {}),
      });
      await refreshPost(replyTarget.postId);
      setReplyText('');
      setReplyTarget(null);
      toast.success('Reply posted successfully');
    } catch (error: any) {
      console.error('Error posting reply:', error);
      toast.error(error?.message ?? 'Failed to post reply');
    } finally {
      setSubmittingReplyForPost(null);
    }
  };

  const renderReplies = (
    postId: string,
    replies: DiscussionReplyRecord[] = [],
    depth = 0,
  ): JSX.Element[] =>
    replies.map((reply) => {
      const isReplyingHere =
        replyTarget?.postId === postId && replyTarget?.parentId === reply.id;

      return (
        <div key={reply.id} className="space-y-3" style={{ marginLeft: depth * 24 }}>
          <div className="border-l-2 border-slate-200 pl-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getAvatarFallback(reply.user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1 text-sm">
                  <span className="font-medium text-foreground">
                    {getDisplayName(reply.user)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatTimeAgo(reply.updated_at || reply.created_at)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => openReplyForm(postId, reply.id)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>

                {isReplyingHere && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSubmitReply}
                        disabled={submittingReplyForPost === postId}
                      >
                        {submittingReplyForPost === postId ? 'Posting...' : 'Post Reply'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyTarget(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(reply.replies || []).length > 0 && renderReplies(postId, reply.replies || [], depth + 1)}
        </div>
      );
    });

  if (authLoading || loadingPosts) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Loading discussions...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-12 text-center space-y-3">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold">Sign in to access the forum</h3>
          <p className="text-muted-foreground">
            Discussions are available to authenticated learners, so please sign in to view and participate.
          </p>
        </CardContent>
      </Card>
    );
  }

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
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
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
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Thread Stats */}
                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {countReplies(thread.replies || [])}
                      </div>
                      <div className="text-xs text-muted-foreground">replies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{thread.like_count}</div>
                      <div className="text-xs text-muted-foreground">likes</div>
                    </div>
                  </div>

                  {/* Thread Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{thread.title}</h3>
                          <Badge variant="outline">{formatCategory(thread.category)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                          {thread.content}
                        </p>

                        {/* Author and Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getAvatarFallback(thread.user)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                              {getDisplayName(thread.user)}
                            </span>
                            {thread.user?.role === 'instructor' && (
                              <Badge variant="secondary" className="text-xs">
                                Instructor
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(thread.updated_at || thread.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thread Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleToggleLike(thread.id)}
                      disabled={likingPostId === thread.id}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {thread.like_count}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => openReplyForm(thread.id)}
                    >
                      <MessageSquare className="h-3 w-3" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleToggleExpand(thread.id)}
                    >
                      {expandedPosts.has(thread.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                      {expandedPosts.has(thread.id) ? 'Hide' : 'View'} Replies
                    </Button>
                  </div>
                </div>

                {expandedPosts.has(thread.id) && (
                  <div className="mt-6 border-t pt-4 space-y-4">
                    {replyTarget?.postId === thread.id && !replyTarget?.parentId && (
                      <div className="space-y-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="min-h-[120px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSubmitReply}
                            disabled={submittingReplyForPost === thread.id}
                          >
                            {submittingReplyForPost === thread.id ? 'Posting...' : 'Post Reply'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyTarget(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {loadingPostDetails[thread.id] ? (
                      <p className="text-sm text-muted-foreground">Loading replies...</p>
                    ) : (thread.replies || []).length > 0 ? (
                      <div className="space-y-4">{renderReplies(thread.id, thread.replies || [])}</div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No replies yet. Start the conversation.</p>
                    )}
                  </div>
                )}
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
                    onChange={(e) =>
                      setNewThread({
                        ...newThread,
                        category: e.target.value as DiscussionCategory,
                      })
                    }
                  >
                    <option value="general_discussion">General Discussion</option>
                    <option value="question">Question</option>
                    <option value="resource">Resource</option>
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
                  <Button onClick={handleCreateThread} disabled={creatingThread}>
                    {creatingThread ? 'Creating...' : 'Create Thread'}
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
              <div className="text-2xl font-bold text-primary">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Total Threads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalReplies}</div>
              <div className="text-sm text-muted-foreground">Total Replies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{activeMembers}</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalLikes}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
