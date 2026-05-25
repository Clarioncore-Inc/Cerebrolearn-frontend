import { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  MessageCircle,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import { reviewsApi } from '../../utils/api-client';

interface ReviewThread {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likeCount: number;
  dislikeCount: number;
  parentId?: string | null;
  replies: ReviewThread[];
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  threads: ReviewThread[];
  edited?: boolean;
  editedAt?: string;
}

interface ReviewSystemProps {
  courseId: string;
  reviews: Review[];
  onReviewsUpdate?: (reviews: Review[]) => void;
  allowReviewSubmission?: boolean;
}

export function ReviewSystem({
  courseId,
  reviews: initialReviews,
  onReviewsUpdate,
  allowReviewSubmission = true,
}: ReviewSystemProps) {
  const { user, profile } = useAuth();

  const mapThread = (thread: any): ReviewThread => ({
    id: thread.id,
    reviewId: thread.review_id ?? thread.reviewId,
    userId: thread.user_id ?? thread.userId,
    userName:
      thread.user?.full_name ?? thread.user?.name ?? thread.userName ?? user?.email ?? 'Anonymous',
    userAvatar:
      thread.user?.full_name?.charAt(0).toUpperCase() ??
      thread.user?.name?.charAt(0).toUpperCase() ??
      thread.userAvatar ??
      'A',
    content: thread.content ?? '',
    date: thread.created_at ?? thread.date ?? new Date().toISOString(),
    likeCount: Number(thread.like_count ?? thread.likeCount ?? 0),
    dislikeCount: Number(thread.dislike_count ?? thread.dislikeCount ?? 0),
    parentId: thread.parent_id ?? thread.parentId ?? null,
    replies: (thread.replies ?? []).map(mapThread),
  });

  const mapReview = (review: any): Review => ({
    id: review.id,
    userId: review.user_id ?? review.userId,
    userName:
      review.user?.full_name ?? review.user?.name ?? review.userName ?? user?.email ?? 'Anonymous',
    userAvatar:
      review.user?.full_name?.charAt(0).toUpperCase() ??
      review.user?.name?.charAt(0).toUpperCase() ??
      review.userAvatar ??
      'A',
    rating: Number(review.rating ?? 0),
    comment: review.comment ?? '',
    date: review.created_at ?? review.date ?? new Date().toISOString(),
    threads: (review.threads ?? []).map(mapThread),
    edited: review.edited,
    editedAt: review.editedAt ?? review.updated_at,
  });

  const [reviews, setReviews] = useState<Review[]>(initialReviews.map(mapReview));
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [replyTarget, setReplyTarget] = useState<{ reviewId: string; parentId?: string | null } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [savingReviewEdit, setSavingReviewEdit] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [loadingThreads, setLoadingThreads] = useState<Record<string, boolean>>({});
  const [threadActionLoading, setThreadActionLoading] = useState<Record<string, boolean>>({});
  const [threadReactionState, setThreadReactionState] = useState<Record<string, 'like' | 'dislike' | null>>({});

  const isAdmin = profile?.role === 'admin' || profile?.role === 'org_admin';
  const currentUserId = user?.id || 'anonymous';

  useEffect(() => {
    setReviews(initialReviews.map(mapReview));
  }, [courseId, initialReviews]);

  const saveReviews = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    onReviewsUpdate?.(updatedReviews);
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

  const countThreads = (threads: ReviewThread[]): number =>
    threads.reduce((sum, thread) => sum + 1 + countThreads(thread.replies), 0);

  const updateReviewThreads = (reviewId: string, threads: ReviewThread[]) => {
    const updated = reviews.map((review) =>
      review.id === reviewId ? { ...review, threads } : review,
    );
    saveReviews(updated);
  };

  const loadThreadsForReview = async (reviewId: string) => {
    setLoadingThreads((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const threads = await reviewsApi.getThreads(reviewId);
      updateReviewThreads(reviewId, (threads || []).map(mapThread));
    } catch (error: any) {
      console.error('Error loading review threads:', error);
      toast.error(error?.message ?? 'Failed to load replies');
    } finally {
      setLoadingThreads((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const toggleReplies = async (reviewId: string) => {
    const isExpanded = expandedReviews.has(reviewId);
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (isExpanded) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });

    if (!isExpanded) {
      await loadThreadsForReview(reviewId);
    }
  };

  const handleCreateReview = async () => {
    if (!allowReviewSubmission) {
      toast.error('Review submission is not available here');
      return;
    }
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }
    if (newRating < 1 || newRating > 5) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      const created = await reviewsApi.create({
        course_id: courseId,
        rating: newRating,
        comment: newComment.trim(),
      });
      saveReviews([mapReview(created), ...reviews]);
      setNewRating(0);
      setNewComment('');
      toast.success('Review posted successfully');
    } catch (error: any) {
      console.error('Error creating review:', error);
      toast.error(error?.message ?? 'Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) return;

    if (!isAdmin && review.userId !== currentUserId) {
      toast.error('Only the review creator can delete this review');
      return;
    }

    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await reviewsApi.delete(reviewId);
      saveReviews(reviews.filter((item) => item.id !== reviewId));
      toast.success('Review deleted');
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error(error?.message ?? 'Failed to delete review');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) return;
    setEditingReview(reviewId);
    setEditText(review.comment);
    setEditRating(review.rating);
  };

  const handleSaveReviewEdit = async (reviewId: string) => {
    if (!editText.trim()) {
      toast.error('Review cannot be empty');
      return;
    }
    if (editRating < 1 || editRating > 5) {
      toast.error('Please select a rating');
      return;
    }

    setSavingReviewEdit(true);
    try {
      const updated = await reviewsApi.update(reviewId, {
        rating: editRating,
        comment: editText.trim(),
      });

      const nextReviews = reviews.map((review) =>
        review.id === reviewId
          ? {
              ...mapReview(updated),
              threads: review.threads,
              edited: true,
              editedAt: updated.updated_at ?? new Date().toISOString(),
            }
          : review,
      );
      saveReviews(nextReviews);
      setEditingReview(null);
      setEditText('');
      setEditRating(0);
      toast.success('Review updated!');
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error(error?.message ?? 'Failed to update review');
    } finally {
      setSavingReviewEdit(false);
    }
  };

  const handleOpenReply = async (reviewId: string, parentId: string | null = null) => {
    if (!user) {
      toast.error('Please log in to reply');
      return;
    }
    setReplyTarget({ reviewId, parentId });
    setReplyText('');
    setExpandedReviews((prev) => new Set([...prev, reviewId]));
    await loadThreadsForReview(reviewId);
  };

  const handleSubmitReply = async () => {
    if (!replyTarget) return;
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const { reviewId, parentId } = replyTarget;
    setThreadActionLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await reviewsApi.createThread(reviewId, {
        content: replyText.trim(),
        ...(parentId ? { parent_id: parentId } : {}),
      });
      await loadThreadsForReview(reviewId);
      setReplyTarget(null);
      setReplyText('');
      toast.success('Reply posted!');
    } catch (error: any) {
      console.error('Error posting reply:', error);
      toast.error(error?.message ?? 'Failed to post reply');
    } finally {
      setThreadActionLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleThreadReaction = async (
    reviewId: string,
    threadId: string,
    reaction: 'like' | 'dislike',
  ) => {
    if (!user) {
      toast.error('Please log in to react');
      return;
    }

    setThreadActionLoading((prev) => ({ ...prev, [threadId]: true }));
    try {
      await reviewsApi.reactToThread(threadId, { reaction });
      setThreadReactionState((prev) => ({
        ...prev,
        [threadId]: prev[threadId] === reaction ? null : reaction,
      }));
      await loadThreadsForReview(reviewId);
    } catch (error: any) {
      console.error('Error reacting to thread:', error);
      toast.error(error?.message ?? 'Failed to react');
    } finally {
      setThreadActionLoading((prev) => ({ ...prev, [threadId]: false }));
    }
  };

  const renderThread = (reviewId: string, thread: ReviewThread, depth = 0): JSX.Element => {
    const currentReaction = threadReactionState[thread.id];
    const isReplyingHere = replyTarget?.reviewId === reviewId && replyTarget?.parentId === thread.id;

    return (
      <div key={thread.id} className='space-y-3' style={{ marginLeft: depth * 24 }}>
        <div className='border-l-2 border-slate-200 pl-4'>
          <div className='flex items-start gap-3'>
            <Avatar className='w-8 h-8'>
              <AvatarFallback className='bg-secondary text-white text-sm'>
                {thread.userAvatar}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-2'>
              <div className='flex items-center gap-2'>
                <p className='font-medium text-sm'>{thread.userName}</p>
                <span className='text-xs text-muted-foreground'>{formatDate(thread.date)}</span>
              </div>
              <p className='text-sm text-slate-700'>{thread.content}</p>
              <div className='flex flex-wrap items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={`h-7 text-xs ${currentReaction === 'like' ? 'text-primary' : ''}`}
                  onClick={() => handleThreadReaction(reviewId, thread.id, 'like')}
                  disabled={!!threadActionLoading[thread.id]}
                >
                  <ThumbsUp className={`w-3 h-3 mr-1 ${currentReaction === 'like' ? 'fill-primary' : ''}`} />
                  {thread.likeCount}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className={`h-7 text-xs ${currentReaction === 'dislike' ? 'text-red-500' : ''}`}
                  onClick={() => handleThreadReaction(reviewId, thread.id, 'dislike')}
                  disabled={!!threadActionLoading[thread.id]}
                >
                  <ThumbsDown className={`w-3 h-3 mr-1 ${currentReaction === 'dislike' ? 'fill-current' : ''}`} />
                  {thread.dislikeCount}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => handleOpenReply(reviewId, thread.id)}
                >
                  <MessageCircle className='w-3 h-3 mr-1' />
                  Reply
                </Button>
              </div>

              {isReplyingHere && (
                <div className='space-y-2'>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder='Write your reply...'
                    className='w-full p-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    rows={3}
                  />
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      onClick={handleSubmitReply}
                      disabled={!!threadActionLoading[reviewId]}
                    >
                      Post Reply
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
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

        {thread.replies.map((reply) => renderThread(reviewId, reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {allowReviewSubmission && (
        <div className='border rounded-lg p-6 bg-white space-y-4'>
          <div>
            <h3 className='font-semibold'>Write a review</h3>
            <p className='text-sm text-muted-foreground mt-1'>Share your experience with this course.</p>
          </div>

          <div className='flex items-center gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                className='transition-transform hover:scale-110'
                onClick={() => setNewRating(star)}
                aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
              >
                <Star className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Write your review...'
            className='w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary'
            rows={4}
          />

          <div className='flex justify-end'>
            <Button onClick={handleCreateReview} disabled={submittingReview || !user}>
              {submittingReview ? 'Posting...' : 'Post Review'}
            </Button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className='text-center py-12'>
          <MessageCircle className='h-16 w-16 mx-auto text-muted-foreground/50 mb-4' />
          <p className='text-lg font-medium text-muted-foreground'>No reviews yet</p>
          <p className='text-sm text-muted-foreground mt-1'>
            {allowReviewSubmission
              ? 'Be the first to review this course!'
              : 'Reviews from learners will appear here.'}
          </p>
        </div>
      ) : (
        reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const isTopLevelReplying = replyTarget?.reviewId === review.id && !replyTarget?.parentId;
          const canDelete = isAdmin || review.userId === currentUserId;
          const canEdit = review.userId === currentUserId;

          return (
            <div key={review.id} className='border rounded-lg p-6 bg-white border-slate-200'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-start gap-4'>
                  <Avatar className='w-12 h-12'>
                    <AvatarFallback className='bg-primary text-white text-lg'>
                      {review.userAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>{review.userName}</p>
                    <p className='text-sm text-muted-foreground'>{formatDate(review.date)}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>

                  {(canEdit || canDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => handleEditReview(review.id)}>
                            <Edit className='w-4 h-4 mr-2' />
                            Edit Review
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteReview(review.id)}
                            className='text-red-600'
                            disabled={deletingReviewId === review.id}
                          >
                            <Trash2 className='w-4 h-4 mr-2' />
                            {deletingReviewId === review.id ? 'Deleting...' : 'Delete Review'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {editingReview === review.id ? (
                <div className='space-y-3 mb-4'>
                  <div className='flex items-center gap-2'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type='button'
                        className='transition-transform hover:scale-110'
                        onClick={() => setEditRating(star)}
                        aria-label={`Edit review rating to ${star}`}
                      >
                        <Star className={`w-5 h-5 ${star <= editRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className='w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary'
                    rows={4}
                  />
                  <div className='flex gap-2'>
                    <Button size='sm' onClick={() => handleSaveReviewEdit(review.id)} disabled={savingReviewEdit}>
                      <Check className='w-4 h-4 mr-1' />
                      {savingReviewEdit ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setEditingReview(null);
                        setEditText('');
                        setEditRating(0);
                      }}
                      disabled={savingReviewEdit}
                    >
                      <X className='w-4 h-4 mr-1' />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='mb-4'>
                  <p className='text-slate-700'>{review.comment}</p>
                  {review.edited && (
                    <p className='text-xs text-muted-foreground mt-1 italic'>
                      Edited {formatDate(review.editedAt || review.date)}
                    </p>
                  )}
                </div>
              )}

              <div className='flex flex-wrap items-center gap-4'>
                <Button variant='ghost' size='sm' onClick={() => handleOpenReply(review.id)}>
                  <MessageCircle className='w-4 h-4 mr-2' />
                  Reply
                </Button>

                <Button variant='ghost' size='sm' onClick={() => toggleReplies(review.id)}>
                  {isExpanded ? <ChevronUp className='w-4 h-4 mr-2' /> : <ChevronDown className='w-4 h-4 mr-2' />}
                  {countThreads(review.threads)} {countThreads(review.threads) === 1 ? 'Reply' : 'Replies'}
                </Button>
              </div>

              {isTopLevelReplying && (
                <div className='mt-4 ml-16 space-y-3'>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder='Write your reply...'
                    className='w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary'
                    rows={3}
                  />
                  <div className='flex gap-2'>
                    <Button size='sm' onClick={handleSubmitReply} disabled={!!threadActionLoading[review.id]}>
                      Post Reply
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
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

              {isExpanded && (
                <div className='mt-6 ml-16 space-y-4'>
                  {loadingThreads[review.id] ? (
                    <p className='text-sm text-muted-foreground'>Loading replies...</p>
                  ) : review.threads.length > 0 ? (
                    review.threads.map((thread) => renderThread(review.id, thread))
                  ) : (
                    <p className='text-sm text-muted-foreground'>No replies yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
