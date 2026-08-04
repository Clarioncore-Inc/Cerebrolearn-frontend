import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { PDBComment, PDBCommentNode } from '../../types/personalityDatabase';
import { getCommentsForSubject, getCommentTree, nextCommentId } from '../../data/personalityDatabaseData';
import { useAuth } from '../../contexts/AuthContext';

interface CommentSectionProps {
  subjectId: string;
  onRequireSignIn: () => void;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours > 0) return `${hours}h ago`;
  return 'just now';
}

function countReplies(node: PDBCommentNode): number {
  return node.replies.reduce((sum, reply) => sum + 1 + countReplies(reply), 0);
}

function DiscussionItem({
  node,
  onReply,
  canInteract,
  onRequireSignIn,
}: {
  node: PDBCommentNode;
  onReply: (parentId: string, text: string) => void;
  canInteract: boolean;
  onRequireSignIn: () => void;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);

  const replyCount = countReplies(node);
  const likeCount = node.upvotes + (reaction === 'like' ? 1 : 0);
  const dislikeCount = (node.downvotes ?? 0) + (reaction === 'dislike' ? 1 : 0);

  const requireOrRun = (action: () => void) => {
    if (!canInteract) {
      onRequireSignIn();
      return;
    }
    action();
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply(node.id, replyText.trim());
    setReplyText('');
    setReplying(false);
  };

  const handleReaction = (nextReaction: 'like' | 'dislike') => {
    requireOrRun(() => setReaction(current => (current === nextReaction ? null : nextReaction)));
  };

  return (
    <div className="rounded-2xl border bg-card/70 p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="text-xs">
            {node.isAnonymous ? 'A' : node.authorName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-muted/40 px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {node.isAnonymous ? 'Anonymous' : node.authorName}
              </span>
              <span className="text-xs text-muted-foreground">{timeAgo(node.createdAt)}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{node.text}</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleReaction('like')}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                reaction === 'like'
                  ? 'border-[#395192] bg-[#395192]/10 text-[#395192]'
                  : 'text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              {likeCount}
            </button>

            <button
              onClick={() => handleReaction('dislike')}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                reaction === 'dislike'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              {dislikeCount}
            </button>

            <button
              onClick={() => requireOrRun(() => setReplying(value => !value))}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {replyCount > 0 ? replyCount : 'Comment'}
            </button>
          </div>

          {replying && canInteract && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-16 text-sm"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={submitReply} disabled={!replyText.trim()}>
                  Post Reply
                </Button>
              </div>
            </div>
          )}

          {node.replies.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-border/60 pl-4">
              {node.replies.map(reply => (
                <DiscussionItem
                  key={reply.id}
                  node={reply}
                  onReply={onReply}
                  canInteract={canInteract}
                  onRequireSignIn={onRequireSignIn}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ subjectId, onRequireSignIn }: CommentSectionProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<PDBComment[]>(() => getCommentsForSubject(subjectId));
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setComments(getCommentsForSubject(subjectId));
    setNewComment('');
  }, [subjectId]);

  const tree = getCommentTree(subjectId, comments);

  const addComment = (parentId: string | null, text: string) => {
    setComments(prev => [
      ...prev,
      {
        id: nextCommentId(),
        subjectId,
        parentId,
        authorName: profile?.full_name || 'You',
        isAnonymous: false,
        text,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      },
    ]);
  };

  const submitTopLevel = () => {
    if (!user) {
      onRequireSignIn();
      return;
    }
    if (!newComment.trim()) return;
    addComment(null, newComment.trim());
    setNewComment('');
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#06b6d4]" />
            Personality Analyses ({tree.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">Public discussion feed</p>
        </div>

        {user ? (
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this typing..."
              className="min-h-20"
            />
            <div className="flex justify-end">
              <Button onClick={submitTopLevel} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Browse the discussions below. Like, dislike, or comment.
            </p>
            <Button onClick={onRequireSignIn} className="sm:shrink-0">
              Comment
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          {tree.map(node => (
            <DiscussionItem
              key={node.id}
              node={node}
              onReply={addComment}
              canInteract={!!user}
              onRequireSignIn={onRequireSignIn}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
