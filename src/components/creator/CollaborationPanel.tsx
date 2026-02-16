"use client";

import React, { useState } from 'react';
import { Users, UserPlus, MessageSquare, History, Check, X, Eye, Edit, Shield, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'co-creator' | 'reviewer' | 'verifier';
  addedAt: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  location: string;
  timestamp: string;
  resolved: boolean;
  replies: any[];
}

interface CollaborationPanelProps {
  courseId?: string;
  isOwner?: boolean;
  onAddCollaborator?: (collaborator: Collaborator) => void;
  onRemoveCollaborator?: (id: string) => void;
}

export function CollaborationPanel({ 
  courseId, 
  isOwner = true,
  onAddCollaborator,
  onRemoveCollaborator 
}: CollaborationPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabRole, setNewCollabRole] = useState<'co-creator' | 'reviewer' | 'verifier'>('reviewer');
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'You',
      email: 'creator@cerebrolearn.com',
      role: 'owner',
      addedAt: new Date().toISOString()
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentLocation, setCommentLocation] = useState('General');
  
  // Edit/Delete comment state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const [versionHistory, setVersionHistory] = useState([
    { id: '1', user: 'You', action: 'Created course', timestamp: new Date().toISOString() },
    { id: '2', user: 'You', action: 'Updated course description', timestamp: new Date().toISOString() }
  ]);

  const roleIcons = {
    owner: Shield,
    'co-creator': Edit,
    reviewer: Eye,
    verifier: Check
  };

  const roleDescriptions = {
    owner: 'Full control over course',
    'co-creator': 'Can edit content',
    reviewer: 'Can comment only',
    verifier: 'Can approve credibility'
  };

  const roleColors = {
    owner: 'bg-purple-100 text-purple-700',
    'co-creator': 'bg-blue-100 text-blue-700',
    reviewer: 'bg-green-100 text-green-700',
    verifier: 'bg-amber-100 text-amber-700'
  };

  const handleAddCollaborator = () => {
    if (!newCollabEmail.trim()) return;
    
    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name: newCollabEmail.split('@')[0],
      email: newCollabEmail,
      role: newCollabRole,
      addedAt: new Date().toISOString()
    };
    
    setCollaborators([...collaborators, newCollab]);
    onAddCollaborator?.(newCollab);
    
    setNewCollabEmail('');
    setShowAddDialog(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'You',
      content: newComment,
      location: commentLocation,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added successfully');
  };

  const toggleCommentResolved = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    ));
    const comment = comments.find(c => c.id === commentId);
    toast.success(comment?.resolved ? 'Comment reopened' : 'Comment resolved');
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditedContent(comment.content);
      setEditedLocation(comment.location);
    }
  };

  const handleSaveEditComment = () => {
    if (!editedContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }
    
    setComments(comments.map(c => 
      c.id === editingCommentId ? { ...c, content: editedContent, location: editedLocation } : c
    ));
    
    setEditingCommentId(null);
    setEditedContent('');
    setEditedLocation('');
    toast.success('Comment updated successfully');
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      setComments(comments.filter(c => c.id !== commentToDelete));
      setCommentToDelete(null);
      setShowDeleteDialog(false);
      toast.success('Comment deleted successfully');
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <CardTitle>Collaboration</CardTitle>
          </div>
          <Badge variant="secondary">
            {collaborators.length} {collaborators.length === 1 ? 'member' : 'members'}
          </Badge>
        </div>
        <CardDescription>
          Work together with your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="team">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {comments.filter(c => !c.resolved).length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {comments.filter(c => !c.resolved).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            {isOwner && (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setShowAddDialog(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Collaborator
              </Button>
            )}

            <div className="space-y-3">
              {collaborators.map((collab) => {
                const RoleIcon = roleIcons[collab.role];
                return (
                  <div 
                    key={collab.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Avatar>
                      <AvatarFallback>
                        {collab.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{collab.name}</p>
                      <p className="text-sm text-muted-foreground">{collab.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={roleColors[collab.role]}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {collab.role}
                      </Badge>
                      {isOwner && collab.role !== 'owner' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCollaborators(collaborators.filter(c => c.id !== collab.id));
                            onRemoveCollaborator?.(collab.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="font-medium text-sm mb-2">Role Permissions:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {Object.entries(roleDescriptions).map(([role, desc]) => {
                  const RoleIcon = roleIcons[role as keyof typeof roleIcons];
                  return (
                    <div key={role} className="flex items-center gap-2">
                      <RoleIcon className="w-3 h-3" />
                      <span className="font-medium">{role}:</span>
                      <span>{desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Comment location (e.g., Module 1, Lesson 2)"
                value={commentLocation}
                onChange={(e) => setCommentLocation(e.target.value)}
              />
              <Textarea
                placeholder="Add a comment or suggestion..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment} className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </div>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                comments.map((comment) => (
                  <div 
                    key={comment.id}
                    className={`p-3 border rounded-lg ${comment.resolved ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {comment.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{comment.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={comment.resolved ? 'secondary' : 'default'} className="text-xs">
                          {comment.location}
                        </Badge>
                        {/* Only show edit/delete for comment owner or course owner */}
                        {(comment.userId === '1' || isOwner) && editingCommentId !== comment.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditComment(comment.id)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Comment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Comment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2 mt-3">
                        <Input
                          placeholder="Comment location (e.g., Module 1, Lesson 2)"
                          value={editedLocation}
                          onChange={(e) => setEditedLocation(e.target.value)}
                        />
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEditComment} className="flex-1">
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditedContent('');
                              setEditedLocation('');
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm mb-3">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={comment.resolved ? 'outline' : 'default'}
                            onClick={() => toggleCommentResolved(comment.id)}
                          >
                            {comment.resolved ? (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Reopen
                              </>
                            ) : (
                              <>
                                <Check className="w-3 h-3 mr-1" />
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

          {/* History Tab */}
          <TabsContent value="history" className="space-y-3">
            {versionHistory.map((version) => (
              <div key={version.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <History className="w-4 h-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{version.action}</p>
                  <p className="text-xs text-muted-foreground">
                    by {version.user} • {new Date(version.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
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
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <Input
                type="email"
                placeholder="collaborator@example.com"
                value={newCollabEmail}
                onChange={(e) => setNewCollabEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={newCollabRole} onValueChange={(value: any) => setNewCollabRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co-creator">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Co-Creator</p>
                        <p className="text-xs text-muted-foreground">Can edit content</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="reviewer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Reviewer</p>
                        <p className="text-xs text-muted-foreground">Can comment only</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="verifier">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Verifier</p>
                        <p className="text-xs text-muted-foreground">Can approve credibility</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCollaborator}>
              <UserPlus className="w-4 h-4 mr-2" />
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
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDeleteComment}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}