import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import { PDBComment, PDBCommentNode } from '../../types/personalityDatabase';
import { getCommentTree, nextCommentId } from '../../data/personalityDatabaseData';

interface CommentSectionProps {
  subjectId: string;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours > 0) return `${hours}h ago`;
  return 'just now';
}

function CommentItem({
  node,
  onReply,
}: {
  node: PDBCommentNode;
  onReply: (parentId: string, text: string, anonymous: boolean) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAnon, setReplyAnon] = useState(true);

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply(node.id, replyText.trim(), replyAnon);
    setReplyText('');
    setReplying(false);
  };

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs">
          {node.isAnonymous ? 'A' : node.authorName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-foreground">
              {node.isAnonymous ? 'Anonymous' : node.authorName}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo(node.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{node.text}</p>
        </div>
        <div className="flex items-center gap-4 mt-1.5 pl-3">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" />
            {node.upvotes}
          </button>
          <button
            onClick={() => setReplying(v => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Reply className="w-3.5 h-3.5" />
            Reply
          </button>
        </div>

        {replying && (
          <div className="mt-2 pl-3 space-y-2">
            <Textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-16 text-sm"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={replyAnon} onCheckedChange={v => setReplyAnon(v === true)} />
                Post anonymously
              </label>
              <Button size="sm" onClick={submitReply} disabled={!replyText.trim()}>
                Post Reply
              </Button>
            </div>
          </div>
        )}

        {node.replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-3 border-l-2 border-border">
            {node.replies.map(reply => (
              <CommentItem key={reply.id} node={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection({ subjectId }: CommentSectionProps) {
  const [comments, setComments] = useState<PDBComment[]>(() => getCommentTree(subjectId).flatMap(flatten));
  const [newComment, setNewComment] = useState('');
  const [postAnon, setPostAnon] = useState(true);

  function flatten(node: PDBCommentNode): PDBComment[] {
    const { replies, ...rest } = node;
    return [rest, ...replies.flatMap(flatten)];
  }

  const tree = getCommentTree(subjectId, comments);

  const addComment = (parentId: string | null, text: string, anonymous: boolean) => {
    setComments(prev => [
      ...prev,
      {
        id: nextCommentId(),
        subjectId,
        parentId,
        authorName: anonymous ? 'Anonymous' : 'You',
        isAnonymous: anonymous,
        text,
        createdAt: new Date().toISOString(),
        upvotes: 0,
      },
    ]);
  };

  const submitTopLevel = () => {
    if (!newComment.trim()) return;
    addComment(null, newComment.trim(), postAnon);
    setNewComment('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
          Discussion ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this typing..."
            className="min-h-20"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={postAnon} onCheckedChange={v => setPostAnon(v === true)} />
              Post anonymously
            </label>
            <Button onClick={submitTopLevel} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>

        {tree.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No comments yet. Start the discussion!
          </p>
        ) : (
          <div className="space-y-5">
            {tree.map(node => (
              <CommentItem key={node.id} node={node} onReply={addComment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
