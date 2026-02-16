import { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  MessageCircle, 
  Star, 
  MoreVertical,
  Flag,
  Trash2,
  EyeOff,
  Eye,
  ChevronDown,
  ChevronUp,
  Edit,
  Check,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  likedBy: string[];
  replies: Reply[];
  hidden: boolean;
  reported: boolean;
  edited?: boolean;
  editedAt?: string;
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  comment: string;
  date: string;
  likes: number;
  likedBy: string[];
  edited?: boolean;
  editedAt?: string;
}

interface ReviewSystemProps {
  courseId: string;
  reviews: Review[];
  onReviewsUpdate?: (reviews: Review[]) => void;
}

export function ReviewSystem({ courseId, reviews: initialReviews, onReviewsUpdate }: ReviewSystemProps) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const isAdmin = profile?.role === 'admin' || profile?.role === 'org_admin';
  const currentUserId = user?.id || 'anonymous';

  useEffect(() => {
    // Load reviews from localStorage
    const loadReviews = () => {
      const reviewsKey = `cerebrolearn_reviews_${courseId}`;
      const storedReviews = localStorage.getItem(reviewsKey);
      
      if (storedReviews) {
        try {
          const parsed = JSON.parse(storedReviews);
          setReviews(parsed);
        } catch (error) {
          console.error('Error loading reviews:', error);
        }
      } else {
        // Initialize with provided reviews
        const enhancedReviews = initialReviews.map(review => ({
          ...review,
          id: review.id || `review-${Date.now()}-${Math.random()}`,
          likes: review.likes || 0,
          likedBy: review.likedBy || [],
          replies: review.replies || [],
          hidden: review.hidden || false,
          reported: review.reported || false
        }));
        setReviews(enhancedReviews);
        localStorage.setItem(reviewsKey, JSON.stringify(enhancedReviews));
      }
    };

    loadReviews();
  }, [courseId]);

  const saveReviews = (updatedReviews: Review[]) => {
    const reviewsKey = `cerebrolearn_reviews_${courseId}`;
    localStorage.setItem(reviewsKey, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    if (onReviewsUpdate) {
      onReviewsUpdate(updatedReviews);
    }
  };

  const handleLike = (reviewId: string, isReply: boolean = false, parentReviewId?: string) => {
    if (!user) {
      toast.error('Please log in to like reviews');
      return;
    }

    const updatedReviews = reviews.map(review => {
      if (!isReply && review.id === reviewId) {
        const hasLiked = review.likedBy.includes(currentUserId);
        return {
          ...review,
          likes: hasLiked ? review.likes - 1 : review.likes + 1,
          likedBy: hasLiked 
            ? review.likedBy.filter(id => id !== currentUserId)
            : [...review.likedBy, currentUserId]
        };
      }
      
      if (isReply && review.id === parentReviewId) {
        return {
          ...review,
          replies: review.replies.map(reply => {
            if (reply.id === reviewId) {
              const hasLiked = reply.likedBy.includes(currentUserId);
              return {
                ...reply,
                likes: hasLiked ? reply.likes - 1 : reply.likes + 1,
                likedBy: hasLiked
                  ? reply.likedBy.filter(id => id !== currentUserId)
                  : [...reply.likedBy, currentUserId]
              };
            }
            return reply;
          })
        };
      }
      
      return review;
    });

    saveReviews(updatedReviews);
    toast.success(isReply ? 'Reply liked!' : 'Review liked!');
  };

  const handleReply = (reviewId: string) => {
    if (!user) {
      toast.error('Please log in to reply');
      return;
    }

    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const newReply: Reply = {
      id: `reply-${Date.now()}-${Math.random()}`,
      userId: currentUserId,
      userName: profile?.name || user.email || 'Anonymous',
      userAvatar: profile?.name?.charAt(0).toUpperCase() || 'A',
      comment: replyText,
      date: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          replies: [...review.replies, newReply]
        };
      }
      return review;
    });

    saveReviews(updatedReviews);
    setReplyText('');
    setReplyingTo(null);
    setExpandedReviews(prev => new Set([...prev, reviewId]));
    toast.success('Reply posted!');
  };

  const handleHideReview = (reviewId: string) => {
    if (!isAdmin) {
      toast.error('Only admins can hide reviews');
      return;
    }

    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, hidden: !review.hidden };
      }
      return review;
    });

    saveReviews(updatedReviews);
    toast.success(`Review ${updatedReviews.find(r => r.id === reviewId)?.hidden ? 'hidden' : 'shown'}`);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete reviews');
      return;
    }

    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    saveReviews(updatedReviews);
    toast.success('Review deleted');
  };

  const handleReportReview = (reviewId: string) => {
    if (!user) {
      toast.error('Please log in to report reviews');
      return;
    }

    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, reported: true };
      }
      return review;
    });

    saveReviews(updatedReviews);
    toast.success('Review reported. Our team will review it shortly.');
  };

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setEditingReview(reviewId);
      setEditText(review.comment);
    }
  };

  const handleSaveReviewEdit = (reviewId: string) => {
    if (!editText.trim()) {
      toast.error('Review cannot be empty');
      return;
    }

    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          comment: editText,
          edited: true,
          editedAt: new Date().toISOString()
        };
      }
      return review;
    });

    saveReviews(updatedReviews);
    setEditingReview(null);
    setEditText('');
    toast.success('Review updated!');
  };

  const handleEditReply = (replyId: string, parentReviewId: string) => {
    const review = reviews.find(r => r.id === parentReviewId);
    const reply = review?.replies.find(r => r.id === replyId);
    if (reply) {
      setEditingReply(replyId);
      setEditText(reply.comment);
    }
  };

  const handleSaveReplyEdit = (replyId: string, parentReviewId: string) => {
    if (!editText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    const updatedReviews = reviews.map(review => {
      if (review.id === parentReviewId) {
        return {
          ...review,
          replies: review.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                comment: editText,
                edited: true,
                editedAt: new Date().toISOString()
              };
            }
            return reply;
          })
        };
      }
      return review;
    });

    saveReviews(updatedReviews);
    setEditingReply(null);
    setEditText('');
    toast.success('Reply updated!');
  };

  const toggleReplies = (reviewId: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const visibleReviews = isAdmin ? reviews : reviews.filter(r => !r.hidden);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">No reviews yet</p>
        <p className="text-sm text-muted-foreground mt-1">Be the first to review this course!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {visibleReviews.map((review) => {
        const hasLiked = review.likedBy.includes(currentUserId);
        const isExpanded = expandedReviews.has(review.id);
        const isReplying = replyingTo === review.id;

        return (
          <div 
            key={review.id} 
            className={`border rounded-lg p-6 ${review.hidden ? 'bg-slate-50 opacity-60' : 'bg-white'} ${review.reported ? 'border-yellow-300' : 'border-slate-200'}`}
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {review.userAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.userName}</p>
                    {review.hidden && (
                      <Badge variant="outline" className="bg-slate-100">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </Badge>
                    )}
                    {review.reported && isAdmin && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Flag className="w-3 h-3 mr-1" />
                        Reported
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Admin Menu */}
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleHideReview(review.id)}>
                        {review.hidden ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Show Review
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide Review
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* User's own review menu (can edit) */}
                {!isAdmin && review.userId === currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditReview(review.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Report Menu for others' reviews */}
                {!isAdmin && review.userId !== currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleReportReview(review.id)}>
                        <Flag className="w-4 h-4 mr-2" />
                        Report Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Review Content */}
            {editingReview === review.id ? (
              <div className="space-y-3 mb-4">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveReviewEdit(review.id)}>
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setEditingReview(null);
                      setEditText('');
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-slate-700">{review.comment}</p>
                {review.edited && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Edited {formatDate(review.editedAt || review.date)}
                  </p>
                )}
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(review.id)}
                className={hasLiked ? 'text-primary' : ''}
              >
                <ThumbsUp className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-primary' : ''}`} />
                {review.likes > 0 && <span>{review.likes}</span>}
                {review.likes === 0 && 'Like'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(isReplying ? null : review.id)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Reply
              </Button>

              {review.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReplies(review.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  )}
                  {review.replies.length} {review.replies.length === 1 ? 'Reply' : 'Replies'}
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {isReplying && (
              <div className="mt-4 ml-16 space-y-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReply(review.id)}>
                    Post Reply
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Threaded Replies */}
            {isExpanded && review.replies.length > 0 && (
              <div className="mt-6 ml-16 space-y-4">
                {review.replies.map((reply) => {
                  const replyHasLiked = reply.likedBy.includes(currentUserId);
                  const isOwner = reply.userId === currentUserId;
                  
                  return (
                    <div key={reply.id} className="border-l-2 border-slate-200 pl-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-secondary text-white text-sm">
                              {reply.userAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{reply.userName}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.date)}
                              </span>
                            </div>
                            
                            {editingReply === reply.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full p-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" className="h-7 text-xs" onClick={() => handleSaveReplyEdit(reply.id, review.id)}>
                                    <Check className="w-3 h-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => {
                                      setEditingReply(null);
                                      setEditText('');
                                    }}
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-slate-700 mb-1">{reply.comment}</p>
                                {reply.edited && (
                                  <p className="text-xs text-muted-foreground italic mb-2">
                                    Edited {formatDate(reply.editedAt || reply.date)}
                                  </p>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(reply.id, true, review.id)}
                                  className={`h-7 text-xs ${replyHasLiked ? 'text-primary' : ''}`}
                                >
                                  <ThumbsUp className={`w-3 h-3 mr-1 ${replyHasLiked ? 'fill-primary' : ''}`} />
                                  {reply.likes > 0 && <span>{reply.likes}</span>}
                                  {reply.likes === 0 && 'Like'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Edit button for reply owner */}
                        {isOwner && editingReply !== reply.id && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7"
                            onClick={() => handleEditReply(reply.id, review.id)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}