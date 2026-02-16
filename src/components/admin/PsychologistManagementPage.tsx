import React, { useState, useEffect } from 'react';
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
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Award,
  Calendar
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

interface Application {
  id: string;
  fullName: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: string;
  bio: string;
  location: string;
  qualifications: string;
  certifications: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNotes: string;
}

export function PsychologistManagementPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, selectedStatus]);

  const loadApplications = () => {
    // Load from localStorage
    const stored = localStorage.getItem('psychologist_applications');
    let apps: Application[] = [];
    
    if (stored) {
      apps = JSON.parse(stored);
    } else {
      // Initialize with some demo data
      apps = [
        {
          id: 'app-1',
          fullName: 'Dr. Sarah Mitchell',
          email: 'sarah.mitchell@psych.com',
          licenseNumber: 'PSY-45678',
          specialization: 'Clinical Psychology',
          yearsOfExperience: '11-15',
          bio: 'Licensed clinical psychologist with over 12 years of experience specializing in cognitive behavioral therapy and anxiety disorders. Passionate about helping individuals achieve their mental health goals through evidence-based practices.',
          location: 'New York, NY',
          qualifications: 'Ph.D. in Clinical Psychology, Columbia University, 2011\nM.A. in Psychology, NYU, 2008\nB.A. in Psychology, Boston College, 2006',
          certifications: 'Licensed Clinical Psychologist (NY State)\nCertified CBT Therapist\nACT Therapy Certification',
          status: 'pending',
          submittedAt: '2026-02-10T14:30:00Z',
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: '',
        },
        {
          id: 'app-2',
          fullName: 'Dr. James Chen',
          email: 'james.chen@mindhealth.com',
          licenseNumber: 'PSY-98765',
          specialization: 'Neuropsychology',
          yearsOfExperience: '6-10',
          bio: 'Neuropsychologist specializing in cognitive assessment and rehabilitation. Experienced in working with diverse populations including students, professionals, and elderly individuals.',
          location: 'San Francisco, CA',
          qualifications: 'Ph.D. in Neuropsychology, Stanford University, 2016\nM.S. in Neuroscience, MIT, 2013\nB.S. in Psychology, UC Berkeley, 2011',
          certifications: 'Board Certified Neuropsychologist\nLicensed Psychologist (CA)\nSpecialist in IQ Testing and Assessment',
          status: 'pending',
          submittedAt: '2026-02-09T10:15:00Z',
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: '',
        },
        {
          id: 'app-3',
          fullName: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@therapy.com',
          licenseNumber: 'PSY-23456',
          specialization: 'Educational Psychology',
          yearsOfExperience: '16+',
          bio: 'Educational psychologist with 18 years of experience helping students optimize their learning potential. Specialized in learning disabilities, ADHD, and gifted education.',
          location: 'Austin, TX',
          qualifications: 'Ph.D. in Educational Psychology, University of Texas, 2005\nM.Ed. in Special Education, 2002\nB.A. in Psychology, Rice University, 1999',
          certifications: 'Licensed Educational Psychologist\nCertified School Psychologist\nNational Board Certified Teacher',
          status: 'approved',
          submittedAt: '2026-02-05T09:00:00Z',
          reviewedAt: '2026-02-07T16:30:00Z',
          reviewedBy: 'Admin',
          reviewNotes: 'Excellent credentials and extensive experience. Approved.',
        },
      ];
      localStorage.setItem('psychologist_applications', JSON.stringify(apps));
    }
    
    setApplications(apps);
    updateStats(apps);
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

    setFilteredApplications(filtered);
  };

  const handleReview = (application: Application, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewNotes('');
    setReviewDialogOpen(true);
  };

  const submitReview = (action: 'approve' | 'reject') => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Admin',
          reviewNotes,
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    localStorage.setItem('psychologist_applications', JSON.stringify(updatedApplications));
    updateStats(updatedApplications);

    toast.success(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    setReviewDialogOpen(false);
    setSelectedApplication(null);
    setReviewNotes('');
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
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold mb-2">Psychologist Management</h2>
        <p className="text-muted-foreground">Review and manage psychologist applications</p>
      </div>

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
              {filteredApplications.length === 0 ? (
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
                          <Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {selectedApplication?.id === application.id && (
                              <ApplicationDetailsDialog
                                application={application}
                                onClose={() => setSelectedApplication(null)}
                              />
                            )}
                          </Dialog>

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
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedApplication?.status === 'pending' ? 'Review Application' : 'Application Review'}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.fullName} - {selectedApplication?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add notes about your decision (optional but recommended for rejections)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => submitReview('reject')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
            <Button
              onClick={() => submitReview('approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Application Details Dialog Component
function ApplicationDetailsDialog({ application, onClose }: { application: Application; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{application.fullName}</DialogTitle>
          <DialogDescription>Complete application details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Status */}
          <div>
            <Label className="text-base font-semibold mb-2 block">Status</Label>
            <div className="flex items-center gap-2">
              {application.status === 'pending' && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Pending Review</Badge>
              )}
              {application.status === 'approved' && (
                <Badge variant="outline" className="bg-green-100 text-green-700">Approved</Badge>
              )}
              {application.status === 'rejected' && (
                <Badge variant="outline" className="bg-red-100 text-red-700">Rejected</Badge>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Contact Information</Label>
            <div className="grid grid-cols-2 gap-3 text-sm bg-muted/50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{application.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p className="font-medium">{application.location}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Professional Information</Label>
            <div className="grid grid-cols-2 gap-3 text-sm bg-muted/50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">License Number:</span>
                <p className="font-medium">{application.licenseNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Specialization:</span>
                <p className="font-medium">{application.specialization}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Experience:</span>
                <p className="font-medium">{application.yearsOfExperience} years</p>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <p className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Professional Bio</Label>
            <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
              {application.bio}
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Education & Qualifications</Label>
            <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
              {application.qualifications}
            </div>
          </div>

          {/* Certifications */}
          {application.certifications && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Certifications</Label>
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                {application.certifications}
              </div>
            </div>
          )}

          {/* Review Information */}
          {application.reviewedAt && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Review Information</Label>
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <div>
                  <span className="text-muted-foreground">Reviewed by:</span>
                  <p className="font-medium">{application.reviewedBy}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reviewed on:</span>
                  <p className="font-medium">{new Date(application.reviewedAt).toLocaleDateString()}</p>
                </div>
                {application.reviewNotes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="font-medium mt-1">{application.reviewNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}