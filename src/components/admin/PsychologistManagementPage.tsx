import React, { useState, useEffect } from 'react';
import api from '../../utils/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
	Ban,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Award,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

interface Application {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  hourlyRate: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: string;
  bio: string;
  location: string;
  qualifications: string;
  certifications: string;
  status: 'pending' | 'approved' | 'rejected';
  accountStatus: 'active' | 'suspended';
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNotes: string;
}

export function PsychologistManagementPage({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReviewApplication, setSelectedReviewApplication] = useState<Application | null>(null);
  const [selectedReviewAction, setSelectedReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, selectedStatus, sortOrder]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.psychologist.list();
      const list = Array.isArray(data) ? data : data.items ?? data.results ?? [];

      const apps: Application[] = list.map((item: any) => ({
        id: item.id ?? item._id ?? '',
        userId: item.user?.id ?? item.userId ?? '',
        fullName: toTitleCase(item.user?.full_name ?? item.full_name ?? item.fullName ?? ''),
        email: item.user?.email ?? item.email ?? '',
        hourlyRate: item.hourly_rate ?? item.hourlyRate ?? '0.0',
        licenseNumber: item.license_number ?? item.licenseNumber ?? '',
        specialization: item.specialization ?? '',
        yearsOfExperience: item.years_of_experience ?? item.yearsOfExperience ?? '',
        bio: item.bio ?? '',
        location: item.location ?? item.user?.location ?? '',
        qualifications:
          item.education_and_qualifications ?? item.qualifications ?? '',
        certifications:
          item.certification_and_additional_training ?? item.certifications ?? '',
        status: item.status ?? (item.is_approved ? 'approved' : 'pending'),
        accountStatus:
          item.user?.is_suspended || item.user?.is_active === false ? 'suspended' : 'active',
        submittedAt: item.submitted_at ?? item.submittedAt ?? item.created_at ?? '',
        reviewedAt: item.reviewed_at ?? item.reviewedAt ?? null,
        reviewedBy: item.reviewed_by ?? item.reviewedBy ?? null,
        reviewNotes: item.review_notes ?? item.reviewNotes ?? '',
      }));

      setApplications(apps);
      updateStats(apps);
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (apps: Application[]) => {
    setStats({
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      approved: apps.filter(a => a.status === 'approved').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    });
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.fullName.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.licenseNumber.toLowerCase().includes(query) ||
        app.specialization.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(
      filtered.slice().sort((a, b) => {
        const dateA = new Date(a.submittedAt).getTime();
        const dateB = new Date(b.submittedAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }),
    );
  };

  const handleReview = (application: Application, action: 'approve' | 'reject') => {
    setSelectedReviewApplication(application);
    setSelectedReviewAction(action);
    setReviewNotes('');
    setReviewDialogOpen(true);
  };

  const submitReview = async (action: 'approve' | 'reject') => {
    if (!selectedReviewApplication) return;

    try {
      setReviewSubmitting(true);
      await api.psychologist.updateStatus(
        selectedReviewApplication.id,
        action === 'approve' ? 'approved' : 'rejected',
      );

      toast.success(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setReviewDialogOpen(false);
      setSelectedReviewApplication(null);
      setSelectedReviewAction(null);
      setReviewNotes('');
      await loadApplications();
    } catch (error: any) {
      console.error(`Error trying to ${action} application:`, error);
      toast.error(error?.message ?? `Failed to ${action} application`);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const validateInviteEmail = (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return 'Email is required';
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return 'Please enter a valid email address';
    }

    return '';
  };

  const handleInvitePsychologist = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateInviteEmail(inviteEmail);
    if (validationError) {
      setInviteError(validationError);
      return;
    }

    try {
      setInviteSubmitting(true);
      setInviteError('');
      await api.psychologist.invite({ email: inviteEmail.trim() });
      toast.success('Psychologist invitation sent successfully');
      setInviteEmail('');
      setInviteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to send psychologist invitation');
    } finally {
      setInviteSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-300 dark:border-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border-green-300 dark:border-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 border-red-300 dark:border-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2">Psychologist Management</h1>
          <p className="text-muted-foreground">
            Review and manage psychologist applications
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <Mail className="mr-2 h-4 w-4" />
          Invite Psychologist
        </Button>
      </div>

      <Dialog open={inviteDialogOpen} onOpenChange={(open: boolean) => {
        setInviteDialogOpen(open);
        if (!open) { setInviteEmail(''); setInviteError(''); }
      }}>
        <DialogContent className="xs:max-w-xs">
          <DialogHeader>
            <DialogTitle>Invite Psychologist</DialogTitle>
            <DialogDescription>Send a psychologist invitation by email</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvitePsychologist} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setInviteEmail(nextValue);
                    if (inviteError) {
                      setInviteError(validateInviteEmail(nextValue));
                    }
                  }}
                  className="pl-9"
                  required
                  aria-invalid={!!inviteError}
                />
              </div>
              {inviteError ? (
                <p className="text-sm text-destructive">{inviteError}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={inviteSubmitting}>
                {inviteSubmitting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Review psychologist applications and credentials</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or license..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                Date: {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found</p>
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left - Basic Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <UserCheck className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{application.fullName}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {getStatusBadge(application.status)}
                                  <Badge variant="secondary">{application.specialization}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {application.email}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {application.location}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              License: {application.licenseNumber}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Award className="h-4 w-4" />
                              {application.yearsOfExperience} years experience
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Bio Preview */}
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.bio}
                            </p>
                          </div>

                          {/* Review Info (if reviewed) */}
                          {application.reviewedAt && (
                            <Alert>
                              <AlertDescription>
                                <strong>Reviewed by {application.reviewedBy}</strong> on{' '}
                                {new Date(application.reviewedAt).toLocaleDateString()}
                                {application.reviewNotes && (
                                  <div className="mt-2 text-sm">
                                    <strong>Notes:</strong> {application.reviewNotes}
                                  </div>
                                )}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        {/* Right - Actions */}
                        <div className="flex flex-col gap-2 lg:w-40">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate('admin-psychologist-detail', { application })}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>

                          {application.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleReview(application, 'approve')}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReview(application, 'reject')}
                                className="w-full"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onOpenChange={(open) => {
          setReviewDialogOpen(open);
          if (!open) {
            setSelectedReviewApplication(null);
            setSelectedReviewAction(null);
            setReviewNotes('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReviewAction === 'approve'
                ? 'Approve Application'
                : selectedReviewAction === 'reject'
                  ? 'Reject Application'
                  : 'Review Application'}
            </DialogTitle>
            <DialogDescription>
              {selectedReviewApplication?.fullName} - {selectedReviewApplication?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Textarea
                id="reviewNotes"
                placeholder={
                  selectedReviewAction === 'reject'
                    ? 'Add notes about why you are rejecting this application (recommended)'
                    : 'Add notes about this approval (optional)'
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)} disabled={reviewSubmitting}>
              Cancel
            </Button>
            {selectedReviewAction === 'reject' ? (
              <Button
                variant="destructive"
                onClick={() => submitReview('reject')}
                disabled={reviewSubmitting}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {reviewSubmitting ? 'Rejecting...' : 'Reject Application'}
              </Button>
            ) : (
              <Button
                onClick={() => submitReview('approve')}
                className="bg-green-600 hover:bg-green-700"
                disabled={reviewSubmitting}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {reviewSubmitting ? 'Approving...' : 'Approve Application'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
        