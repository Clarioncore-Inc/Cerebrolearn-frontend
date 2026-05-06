import React, { useEffect, useState } from 'react';
import api from '../../utils/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Search, UserCog, Ban, CheckCircle, Mail, Award, Brain } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User } from '../../types/database';

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: User;
    newRole: string;
  } | null>(null);
  const [pendingSuspensionUser, setPendingSuspensionUser] = useState<{
    user: User;
    currentlySuspended: boolean;
  } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getUsers();
      setUsers(response.users || response.items || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter === 'suspended') {
      filtered = filtered.filter(isUserSuspended);
    } else if (statusFilter === 'active') {
      filtered = filtered.filter((user) => !isUserSuspended(user));
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateRole = async (user: User, newRole: string) => {
    try {
      await api.admin.updateUserRole(user.id, newRole);
      toast.success('User role updated successfully');
      setSelectedRole(newRole);
      setPendingRoleChange(null);
      setEditDialogOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleRequestRoleChange = (user: User, newRole: string) => {
    if (user.role === newRole) {
      return;
    }

    setPendingRoleChange({ user, newRole });
  };

  const handleToggleSuspension = async (userId: string, currentlySuspended: boolean) => {
    try {
      await api.admin.updateUserStatus(userId, !currentlySuspended);
      toast.success(
        currentlySuspended ? 'User activated successfully' : 'User suspended successfully'
      );
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleSuspensionAction = (user: User, currentlySuspended: boolean) => {
    setPendingSuspensionUser({ user, currentlySuspended });
  };

  const isUserSuspended = (user: User) => {
    if (typeof user.suspended === 'boolean') return user.suspended;
    if (typeof user.is_suspended === 'boolean') return user.is_suspended;
    if (typeof user.is_active === 'boolean') return !user.is_active;
    return false;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'instructor':
      case 'creator':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'psychologist':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'psychologist_pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'org_admin':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'Instructor';
      case 'creator':
        return 'Course Creator';
      case 'psychologist':
        return 'Psychologist';
      case 'psychologist_pending':
        return 'Psychologist Pending';
      case 'org_admin':
        return 'Org Admin';
      case 'admin':
        return 'Platform Admin';
      case 'learner':
        return 'Learner';
      default:
        return role
          .split('_')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
    }
  };

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: UserCog,
    },
    {
      label: 'Instructors',
      value: users.filter((u) => u.role === 'creator' || u.role === 'instructor').length,
      icon: Award,
    },
    {
      label: 'Psychologists',
      value: users.filter((u) => u.role === 'psychologist' || u.role === 'psychologist_pending').length,
      icon: Brain,
    },
    {
      label: 'Learners',
      value: users.filter((u) => u.role === 'learner').length,
      icon: CheckCircle,
    },
    {
      label: 'Suspended',
      value: users.filter(isUserSuspended).length,
      icon: Ban,
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and access permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="learner">Learners</SelectItem>
                <SelectItem value="instructor">Instructors</SelectItem>
                <SelectItem value="creator">Course Creators</SelectItem>
                <SelectItem value="psychologist">Psychologists</SelectItem>
                <SelectItem value="psychologist_pending">Pending Psychologists</SelectItem>
                <SelectItem value="org_admin">Org Admins</SelectItem>
                <SelectItem value="admin">Platform Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const suspended = isUserSuspended(user);

                    return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.full_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>{user.xp || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{user.streak || 0} days</span>
                      </TableCell>
                      <TableCell>
                        {suspended ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            Suspended
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setSelectedRole(user.role);
                              setEditDialogOpen(true);
                            }}
                          >
                            <UserCog className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant={suspended ? 'default' : 'destructive'}
                            size="sm"
                            onClick={() => handleSuspensionAction(user, suspended)}
                          >
                            {suspended ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setPendingRoleChange(null);
            setSelectedUser(null);
            setSelectedRole('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">User Role</label>
                <Select
                  value={selectedRole || selectedUser.role}
                  onValueChange={(value) => handleRequestRoleChange(selectedUser, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learner">Learner</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="creator">Course Creator</SelectItem>
                    <SelectItem value="psychologist">Psychologist</SelectItem>
                    <SelectItem value="psychologist_pending">Psychologist Pending</SelectItem>
                    <SelectItem value="org_admin">Organization Admin</SelectItem>
                    <SelectItem value="admin">Platform Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingRoleChange}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRoleChange(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm role change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRoleChange
                ? `Are you sure you want to change ${pendingRoleChange.user.full_name}'s role from ${getRoleDisplayName(pendingRoleChange.user.role)} to ${getRoleDisplayName(pendingRoleChange.newRole)}?`
                : 'Are you sure you want to change this user role?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRoleChange) {
                  handleUpdateRole(pendingRoleChange.user, pendingRoleChange.newRole);
                }
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!pendingSuspensionUser}
        onOpenChange={(open) => {
          if (!open) {
            setPendingSuspensionUser(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingSuspensionUser?.currentlySuspended ? 'Confirm activation' : 'Confirm suspension'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingSuspensionUser
                ? pendingSuspensionUser.currentlySuspended
                  ? `Are you sure you want to activate ${pendingSuspensionUser.user.full_name}'s account?`
                  : `Are you sure you want to suspend ${pendingSuspensionUser.user.full_name}'s account?`
                : 'Are you sure you want to change this account status?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingSuspensionUser) {
                  const pendingStatusChange = pendingSuspensionUser;
                  setPendingSuspensionUser(null);
                  handleToggleSuspension(
                    pendingStatusChange.user.id,
                    pendingStatusChange.currentlySuspended,
                  );
                }
              }}
              className={
                pendingSuspensionUser?.currentlySuspended
                  ? ''
                  : 'bg-destructive hover:bg-destructive/90'
              }
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}