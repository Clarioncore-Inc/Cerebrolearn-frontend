import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MoreVertical,
  Flag,
  Edit,
  Trash2,
  CheckCircle2,
  Pin,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface LessonCommentsProps {
  lessonId: string;
  lessonTitle: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'Student' | 'Instructor' | 'TA';
    level: string;
  };
  content: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  replies: Reply[];
  isPinned: boolean;
  isInstructorAnswer: boolean;
  createdAt: string;
  edited: boolean;
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'Student' | 'Instructor' | 'TA';
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

export function LessonComments({ lessonId, lessonTitle }: LessonCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        role: 'Student',
        level: 'Advanced',
      },
      content: 'This lesson was incredibly helpful! The examples really clarified the concept for me. Could you provide more practice exercises on this topic?',
      likes: 24,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      isPinned: false,
      isInstructorAnswer: false,
      createdAt: '2024-01-15T10:30:00',
      edited: false,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Dr. Michael Chen',
            avatar: 'MC',
            role: 'Instructor',
          },
          content: 'Thanks Sarah! I\'ll add more practice exercises to the next lesson. In the meantime, check out the supplementary materials section.',
          likes: 12,
          isLiked: false,
          createdAt: '2024-01-15T11:15:00',
        },
        {
          id: '1-2',
          author: {
            name: 'Emily Rodriguez',
            avatar: 'ER',
            role: 'Student',
          },
          content: 'I agree! The examples were super clear. I also found the CodePen demos really useful.',
          likes: 5,
          isLiked: false,
          createdAt: '2024-01-15T12:00:00',
        },
      ],
    },
    {
      id: '2',
      author: {
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        role: 'Instructor',
        level: 'Expert',
      },
      content: '📌 Quick tip for this lesson: Make sure you understand the difference between synchronous and asynchronous operations before moving forward. This is crucial for the next section!',
      likes: 45,
      dislikes: 0,
      isLiked: true,
      isDisliked: false,
      isPinned: true,
      isInstructorAnswer: true,
      createdAt: '2024-01-14T09:00:00',
      edited: false,
      replies: [],
    },
    {
      id: '3',
      author: {
        name: 'David Kim',
        avatar: 'DK',
        role: 'Student',
        level: 'Beginner',
      },
      content: 'I\'m a bit confused about the callback function example at 5:32. Could someone explain why we need to pass the function as a parameter?',
      likes: 8,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      isPinned: false,
      isInstructorAnswer: false,
      createdAt: '2024-01-15T14:20:00',
      edited: false,
      replies: [
        {
          id: '3-1',
          author: {
            name: 'Lisa Anderson',
            avatar: 'LA',
            role: 'TA',
          },
          content: 'Great question! Callbacks are passed as parameters so they can be executed at a specific time, usually after an operation completes. Think of it like giving someone instructions to follow later.',
          likes: 15,
          isLiked: false,
          createdAt: '2024-01-15T14:45:00',
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'instructor'>('recent');

  const handlePostComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    toast.success('Comment posted successfully!');
    setNewComment('');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    toast.success('Reply posted successfully!');
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
          isDisliked: false,
        };
      }
      return comment;
    }));
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked,
              };
            }
            return reply;
          }),
        };
      }
      return comment;
    }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'instructor':
        if (a.isInstructorAnswer && !b.isInstructorAnswer) return -1;
        if (!a.isInstructorAnswer && b.isInstructorAnswer) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">Discussion</h3>
            <p className="text-sm text-muted-foreground">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="instructor">Instructor First</option>
          </select>
        </div>
      </div>

      {/* New Comment Form */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts or ask a question..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Be respectful and constructive in your comments
              </p>
              <Button onClick={handlePostComment}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={comment.isPinned ? 'border-primary' : ''}>
              <CardContent className="p-6">
                {/* Comment Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{comment.author.avatar}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.author.name}</span>
                      {comment.author.role === 'Instructor' && (
                        <Badge variant="secondary" className="text-xs">
                          Instructor
                        </Badge>
                      )}
                      {comment.author.role === 'TA' && (
                        <Badge variant="outline" className="text-xs">
                          TA
                        </Badge>
                      )}
                      {comment.isPinned && (
                        <Pin className="h-3 w-3 text-primary" />
                      )}
                      {comment.isInstructorAnswer && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.createdAt)}
                        {comment.edited && ' (edited)'}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <p className="text-sm mb-4 whitespace-pre-wrap">{comment.content}</p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id)}
                        className={comment.isLiked ? 'text-primary' : ''}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                      {replyingTo === comment.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handlePostReply(comment.id)}>
                              Post Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-6 space-y-4 pl-6 border-l-2 border-muted">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{reply.author.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{reply.author.name}</span>
                                {reply.author.role === 'Instructor' && (
                                  <Badge variant="secondary" className="text-xs">
                                    Instructor
                                  </Badge>
                                )}
                                {reply.author.role === 'TA' && (
                                  <Badge variant="outline" className="text-xs">
                                    TA
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm mb-2">{reply.content}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReplyLike(comment.id, reply.id)}
                                className={reply.isLiked ? 'text-primary' : ''}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {reply.likes}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* More Options */}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {comments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No comments yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your thoughts or ask a question!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
