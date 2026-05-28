'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  MessageSquare,
  History,
  Check,
  X,
  Eye,
  Edit,
  Shield,
  Trash2,
  MoreVertical,
  Edit2,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import {
  coursesApi,
  type CourseCommentRecord,
  type CourseHistoryRecord,
} from '../../../../utils/api-client';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'co-instructor' | 'reviewer' | 'verifier';
  addedAt: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: Comment[];
  courseId?: string;
  parentId?: string | null;
}

interface HistoryEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

interface CollaborationPanelProps {
  courseId?: string;
  isOwner?: boolean;
  initialCollaborators?: Array<{ email: string; role: string }>;
  onAddCollaborator?: (collaborator: Collaborator) => void;
  onRemoveCollaborator?: (id: string) => void;
  onCollaboratorsChange?: (
    collaborators: Array<{ email: string; role: string }>,
  ) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapCourseComment(record: CourseCommentRecord): Comment {
  return {
    id: record.id,
    userId: record.author?.id ?? '',
    userName:
      record.author?.full_name ||
      record.author?.email?.split('@')[0] ||
      'Unknown',
    content: record.content,
    timestamp:
      record.updated_at || record.created_at || new Date().toISOString(),
    resolved: record.resolved ?? false,
    replies: (record.replies || []).map(mapCourseComment),
    courseId: record.course_id,
    parentId: record.parent_id,
  };
}

function formatCourseHistoryAction(action?: string): string {
  if (!action) return 'Course updated';

  const normalized = action.trim().toLowerCase().replace(/[_-]+/g, ' ');

  const knownActions: Record<string, string> = {
    created: 'Course created',
    updated: 'Course updated',
    deleted: 'Course deleted',
    published: 'Course published',
    unpublished: 'Course unpublished',
    archived: 'Course archived',
    restored: 'Course restored',
  };

  if (knownActions[normalized]) {
    return knownActions[normalized];
  }

  const titleCased = normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  return normalized.startsWith('course ') ? titleCased : `Course ${normalized}`;
}

function mapCourseHistory(record: CourseHistoryRecord): HistoryEntry {
  return {
    id: record.id,
    user:
      record.changed_by?.full_name ||
      record.changed_by?.email?.split('@')[0] ||
      record.actor?.full_name ||
      record.actor?.email?.split('@')[0] ||
      record.actor_name ||
      record.user ||
      'Unknown',
    action: formatCourseHistoryAction(
      record.changes?.action ||
        record.action ||
        record.event ||
        record.description,
    ),
    timestamp:
      record.timestamp ||
      record.updated_at ||
      record.created_at ||
      new Date().toISOString(),
  };
}

export function CollaborationPanel({
  courseId,
  isOwner = true,
  initialCollaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  onCollaboratorsChange,
}: CollaborationPanelProps) {
  const { user, profile } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabEmailError, setNewCollabEmailError] = useState('');
  const [newCollabRole, setNewCollabRole] = useState<
    'co-instructor' | 'reviewer' | 'verifier'
  >('reviewer');

  const ownerEmail = user?.email ?? profile?.email ?? '';
  const ownerName =
    profile?.full_name ?? (ownerEmail ? ownerEmail.split('@')[0] : 'You');

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: ownerName,
      email: ownerEmail,
      role: 'owner',
      addedAt: new Date().toISOString(),
    },
  ]);

  // Hydrate collaborators from server-provided list (owner is kept as first entry)
  useEffect(() => {
    if (!initialCollaborators || initialCollaborators.length === 0) return;
    setCollaborators((prev) => {
      const owner = prev.find((c) => c.role === 'owner');
      const rest = initialCollaborators
        .filter((c) => c.email && c.email !== ownerEmail)
        .map((c, i) => ({
          id: `seed-${i}`,
          name: c.email.split('@')[0],
          email: c.email,
          role: c.role as Collaborator['role'],
          addedAt: new Date().toISOString(),
        }));
      return owner ? [owner, ...rest] : rest;
    });
  }, [initialCollaborators, ownerEmail]);

  const notifyChange = (list: Collaborator[]) => {
    if (!onCollaboratorsChange) return;
    onCollaboratorsChange(
      list
        .filter((c) => c.role !== 'owner')
        .map((c) => ({ email: c.email, role: c.role })),
    );
  };

  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Edit/Delete comment state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [resolvingCommentId, setResolvingCommentId] = useState<string | null>(
    null,
  );
  const [versionHistory, setVersionHistory] = useState<HistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Hydrate existing comments from the server when courseId is available
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await coursesApi.getComments(courseId);
        if (cancelled) return;
        setComments((response.items || []).map(mapCourseComment));
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!courseId) {
      setVersionHistory([]);
      return;
    }

    let cancelled = false;
    setIsLoadingHistory(true);

    (async () => {
      try {
        const response = await coursesApi.getHistory(courseId);
        if (cancelled) return;

        const records = Array.isArray(response)
          ? response
          : (response.items ?? []);

        setVersionHistory(records.map(mapCourseHistory));
      } catch (err) {
        console.error('Error fetching course history:', err);
        if (!cancelled) setVersionHistory([]);
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const roleIcons = {
    owner: Shield,
    'co-instructor': Edit,
    reviewer: Eye,
    verifier: Check,
  };

  const roleDescriptions = {
    owner: 'Full control over course',
    'co-instructor': 'Can edit content',
    reviewer: 'Can comment only',
    verifier: 'Can approve credibility',
  };

  const roleColors = {
    owner: 'bg-purple-100 text-purple-700',
    'co-instructor': 'bg-blue-100 text-blue-700',
    reviewer: 'bg-green-100 text-green-700',
    verifier: 'bg-amber-100 text-amber-700',
  };

  const handleAddCollaborator = () => {
    const normalizedEmail = newCollabEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setNewCollabEmailError('Email is required');
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setNewCollabEmailError('Enter a valid email address');
      return;
    }

    if (
      collaborators.some(
        (collab) => collab.email.toLowerCase() === normalizedEmail,
      )
    ) {
      setNewCollabEmailError('This collaborator has already been added');
      return;
    }

    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: newCollabRole,
      addedAt: new Date().toISOString(),
    };

    const updated = [...collaborators, newCollab];
    setCollaborators(updated);
    notifyChange(updated);
    onAddCollaborator?.(newCollab);

    setNewCollabEmail('');
    setNewCollabEmailError('');
    setShowAddDialog(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!courseId) {
      toast.error('Cannot add comment without a course');
      return;
    }

    const content = newComment;
    const optimistic: Comment = {
      id: Date.now().toString(),
      userId: '1',
      userName: ownerName || 'You',
      content,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: [],
    };

    setComments((prev) => [...prev, optimistic]);
    setNewComment('');

    try {
      const created = await coursesApi.addComment(courseId, content);
      // Swap the optimistic local id for the server-assigned id
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimistic.id ? mapCourseComment(created) : c,
        ),
      );
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      toast.error('Failed to add comment');
    }
  };

  const toggleCommentResolved = async (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const nextResolved = !comment.resolved;
    setResolvingCommentId(commentId);

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, resolved: nextResolved } : c,
      ),
    );

    try {
      const updated = await coursesApi.updateComment(commentId, {
        content: comment.content,
        resolved: nextResolved,
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? mapCourseComment(updated) : c)),
      );
      toast.success(nextResolved ? 'Comment resolved' : 'Comment reopened');
    } catch (err) {
      console.error('Error toggling comment resolution:', err);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, resolved: comment.resolved } : c,
        ),
      );
      toast.error('Failed to update comment status');
    } finally {
      setResolvingCommentId((current) =>
        current === commentId ? null : current,
      );
    }
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditedContent(comment.content);
    }
  };

  const handleSaveEditComment = async () => {
    if (!editedContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }
    if (!editingCommentId) return;

    const targetId = editingCommentId;
    const previous = comments.find((c) => c.id === targetId);
    const newContent = editedContent;

    setComments((prev) =>
      prev.map((c) => (c.id === targetId ? { ...c, content: newContent } : c)),
    );
    setEditingCommentId(null);
    setEditedContent('');

    try {
      const updated = await coursesApi.updateComment(targetId, {
        content: newContent,
        resolved: previous?.resolved ?? false,
      });
      setComments((prev) =>
        prev.map((c) => (c.id === targetId ? mapCourseComment(updated) : c)),
      );
      toast.success('Comment updated successfully');
    } catch (err) {
      console.error('Error updating comment:', err);
      // Roll back
      if (previous) {
        setComments((prev) =>
          prev.map((c) => (c.id === targetId ? previous : c)),
        );
      }
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    const targetId = commentToDelete;
    const previous = comments.find((c) => c.id === targetId);
    const previousIndex = comments.findIndex((c) => c.id === targetId);

    setComments((prev) => prev.filter((c) => c.id !== targetId));
    setCommentToDelete(null);
    setShowDeleteDialog(false);

    try {
      await coursesApi.deleteComment(targetId);
      toast.success('Comment deleted successfully');
    } catch (err) {
      console.error('Error deleting comment:', err);
      // Roll back at original position
      if (previous) {
        setComments((prev) => {
          const next = [...prev];
          next.splice(Math.max(0, previousIndex), 0, previous);
          return next;
        });
      }
      toast.error('Failed to delete comment');
    }
  };

  return (
    <Card className='border-2'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5' />
            <CardTitle>Collaboration</CardTitle>
          </div>
          <Badge variant='secondary'>
            {collaborators.length}{' '}
            {collaborators.length === 1 ? 'member' : 'members'}
          </Badge>
        </div>
        <CardDescription>Work together with your team</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='team'>
          <TabsList
            className={`grid w-full ${courseId ? 'grid-cols-3' : 'grid-cols-1'}`}
          >
            <TabsTrigger value='team'>Team</TabsTrigger>
            {courseId && (
              <TabsTrigger value='comments'>
                Comments
                {comments.filter((c) => !c.resolved).length > 0 && (
                  <Badge
                    variant='destructive'
                    className='ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs'
                  >
                    {comments.filter((c) => !c.resolved).length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
            {courseId && <TabsTrigger value='history'>History</TabsTrigger>}
          </TabsList>

          {/* Team Tab */}
          <TabsContent value='team' className='space-y-4'>
            {isOwner && (
              <Button
                className='w-full'
                variant='outline'
                onClick={() => setShowAddDialog(true)}
              >
                <UserPlus className='w-4 h-4 mr-2' />
                Add Collaborator
              </Button>
            )}

            <div className='space-y-3'>
              {collaborators.map((collab) => {
                const RoleIcon = roleIcons[collab.role];
                return (
                  <div
                    key={collab.id}
                    className='flex items-center gap-3 p-3 border rounded-lg'
                  >
                    <Avatar>
                      <AvatarFallback>
                        {collab.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <p className='font-medium'>{collab.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {collab.email}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge className={roleColors[collab.role]}>
                        <RoleIcon className='w-3 h-3 mr-1' />
                        {collab.role}
                      </Badge>
                      {isOwner && collab.role !== 'owner' && (
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => {
                            const updated = collaborators.filter(
                              (c) => c.id !== collab.id,
                            );
                            setCollaborators(updated);
                            notifyChange(updated);
                            onRemoveCollaborator?.(collab.id);
                          }}
                        >
                          <X className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='mt-4 p-3 bg-muted rounded-lg'>
              <p className='font-medium text-sm mb-2'>Role Permissions:</p>
              <div className='space-y-1 text-xs text-muted-foreground'>
                {Object.entries(roleDescriptions).map(([role, desc]) => {
                  const RoleIcon = roleIcons[role as keyof typeof roleIcons];
                  return (
                    <div key={role} className='flex items-center gap-2'>
                      <RoleIcon className='w-3 h-3' />
                      <span className='font-medium'>{role}:</span>
                      <span>{desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Comments Tab */}
          {courseId && (
            <TabsContent value='comments' className='space-y-4'>
              <div className='space-y-2'>
                <Textarea
                  placeholder='Add a comment or suggestion...'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} className='w-full'>
                  <MessageSquare className='w-4 h-4 mr-2' />
                  Add Comment
                </Button>
              </div>

              <div className='space-y-3'>
                {comments.length === 0 ? (
                  <p className='text-center text-muted-foreground py-8'>
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 border rounded-lg ${comment.resolved ? 'bg-muted/50' : ''}`}
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <Avatar className='w-6 h-6'>
                            <AvatarFallback className='text-xs'>
                              {comment.userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='text-sm font-medium'>
                              {comment.userName}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          {/* Only show edit/delete for comment owner or course owner */}
                          {(comment.userId === '1' || isOwner) &&
                            editingCommentId !== comment.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    className='h-8 w-8 p-0'
                                  >
                                    <MoreVertical className='w-4 h-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditComment(comment.id)
                                    }
                                  >
                                    <Edit2 className='w-4 h-4 mr-2' />
                                    Edit Comment
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className='text-destructive'
                                  >
                                    <Trash2 className='w-4 h-4 mr-2' />
                                    Delete Comment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                        </div>
                      </div>

                      {editingCommentId === comment.id ? (
                        <div className='space-y-2 mt-3'>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={3}
                          />
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              onClick={handleSaveEditComment}
                              className='flex-1'
                            >
                              <Check className='w-4 h-4 mr-2' />
                              Save Changes
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditedContent('');
                              }}
                            >
                              <X className='w-4 h-4 mr-2' />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className='text-sm mb-3'>{comment.content}</p>
                          <div className='flex items-center gap-2'>
                            <Button
                              size='sm'
                              variant={comment.resolved ? 'outline' : 'default'}
                              onClick={() => toggleCommentResolved(comment.id)}
                              disabled={resolvingCommentId === comment.id}
                              aria-busy={resolvingCommentId === comment.id}
                            >
                              {resolvingCommentId === comment.id ? (
                                <>
                                  <div className='w-3 h-3 mr-1 rounded-full border-2 border-current border-t-transparent animate-spin' />
                                  {comment.resolved
                                    ? 'Reopening...'
                                    : 'Resolving...'}
                                </>
                              ) : comment.resolved ? (
                                <>
                                  <X className='w-3 h-3 mr-1' />
                                  Reopen
                                </>
                              ) : (
                                <>
                                  <Check className='w-3 h-3 mr-1' />
                                  Resolve
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          {/* History Tab */}
          {courseId && (
            <TabsContent value='history' className='space-y-3'>
              {isLoadingHistory ? (
                <p className='text-center text-muted-foreground py-8'>
                  Loading history...
                </p>
              ) : versionHistory.length === 0 ? (
                <p className='text-center text-muted-foreground py-8'>
                  No history yet.
                </p>
              ) : (
                versionHistory.map((version) => (
                  <div
                    key={version.id}
                    className='flex items-start gap-3 p-3 border rounded-lg'
                  >
                    <History className='w-4 h-4 mt-1 text-muted-foreground' />
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{version.action}</p>
                      <p className='text-xs text-muted-foreground'>
                        by {version.user} •{' '}
                        {new Date(version.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>

      {/* Add Collaborator Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Collaborator</DialogTitle>
            <DialogDescription>
              Invite someone to work on this course with you
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Email Address
              </label>
              <Input
                type='email'
                placeholder='collaborator@example.com'
                value={newCollabEmail}
                onChange={(e) => {
                  setNewCollabEmail(e.target.value);
                  if (newCollabEmailError) setNewCollabEmailError('');
                }}
                aria-invalid={!!newCollabEmailError}
              />
              {newCollabEmailError && (
                <p className='mt-1 text-sm text-red-600'>
                  {newCollabEmailError}
                </p>
              )}
            </div>

            <div>
              <label className='text-sm font-medium mb-2 block'>Role</label>
              <Select
                value={newCollabRole}
                onValueChange={(value: any) => setNewCollabRole(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='co-instructor'>
                    <div className='flex items-center gap-2'>
                      <Edit className='w-4 h-4' />
                      <div>
                        <p className='font-medium'>Co-instructor</p>
                        <p className='text-xs text-muted-foreground'>
                          Can edit content
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value='reviewer'>
                    <div className='flex items-center gap-2'>
                      <Eye className='w-4 h-4' />
                      <div>
                        <p className='font-medium'>Reviewer</p>
                        <p className='text-xs text-muted-foreground'>
                          Can comment only
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value='verifier'>
                    <div className='flex items-center gap-2'>
                      <Check className='w-4 h-4' />
                      <div>
                        <p className='font-medium'>Verifier</p>
                        <p className='text-xs text-muted-foreground'>
                          Can approve credibility
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowAddDialog(false);
                setNewCollabEmailError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCollaborator}>
              <UserPlus className='w-4 h-4 mr-2' />
              Add Collaborator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Comment Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteComment}>
              <Trash2 className='w-4 h-4 mr-2' />
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
