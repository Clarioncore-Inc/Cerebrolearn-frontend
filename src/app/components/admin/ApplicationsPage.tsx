import { useState, useEffect } from 'react';
import {
  UserPlus,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  FileText,
  Filter,
  Search,
  Download,
  MessageSquare,
  Eye,
  AlertCircle,
  Building2,
  Star,
  TrendingUp,
  MoreVertical,
  Send,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner@2.0.3';

interface Application {
  id: string;
  type: 'instructor' | 'course' | 'organization';
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  priority: 'low' | 'medium' | 'high';
  
  // Instructor-specific fields
  expertise?: string[];
  experience?: string;
  education?: string;
  linkedin?: string;
  portfolio?: string;
  bio?: string;
  
  // Course-specific fields
  category?: string;
  level?: string;
  price?: number;
  estimatedHours?: number;
  syllabus?: string;
  
  // Organization-specific fields
  organizationName?: string;
  industry?: string;
  size?: string;
  website?: string;
  licenseNumber?: string;
}

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Load mock applications
  useEffect(() => {
    const mockApplications: Application[] = [
      // Instructor Applications
      {
        id: 'inst-001',
        type: 'instructor',
        applicantName: 'Dr. Sarah Johnson',
        applicantEmail: 'sarah.johnson@email.com',
        applicantPhone: '+1 (555) 123-4567',
        title: 'Data Science Instructor Application',
        description: 'Experienced data scientist with 10+ years in industry and academia.',
        status: 'pending',
        submittedDate: '2024-12-15T10:30:00Z',
        priority: 'high',
        expertise: ['Data Science', 'Machine Learning', 'Python', 'Statistics'],
        experience: '10+ years in data science and AI research',
        education: 'Ph.D. in Computer Science from MIT',
        linkedin: 'linkedin.com/in/sarahjohnson',
        portfolio: 'sarahjohnson.com',
        bio: 'Passionate about making complex data concepts accessible to everyone.',
      },
      {
        id: 'inst-002',
        type: 'instructor',
        applicantName: 'Michael Chen',
        applicantEmail: 'mchen@email.com',
        applicantPhone: '+1 (555) 987-6543',
        title: 'Web Development Instructor',
        description: 'Full-stack developer with expertise in modern web technologies.',
        status: 'under_review',
        submittedDate: '2024-12-14T14:20:00Z',
        priority: 'medium',
        expertise: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        experience: '8 years as full-stack developer',
        education: 'B.S. in Software Engineering',
        linkedin: 'linkedin.com/in/michaelchen',
        bio: 'Love teaching and helping students build real-world projects.',
      },
      {
        id: 'inst-003',
        type: 'instructor',
        applicantName: 'Emma Rodriguez',
        applicantEmail: 'emma.r@email.com',
        title: 'UX/UI Design Instructor',
        description: 'Award-winning designer with focus on user-centered design.',
        status: 'approved',
        submittedDate: '2024-12-10T09:15:00Z',
        reviewedDate: '2024-12-12T16:00:00Z',
        reviewedBy: 'Admin User',
        priority: 'high',
        expertise: ['UI Design', 'UX Research', 'Figma', 'Adobe XD'],
        experience: '12 years in product design',
        education: 'M.A. in Interaction Design',
        portfolio: 'emmarodriguez.design',
      },
      
      // Course Applications
      {
        id: 'course-001',
        type: 'course',
        applicantName: 'Dr. Robert Taylor',
        applicantEmail: 'r.taylor@university.edu',
        title: 'Advanced Quantum Computing',
        description: 'Comprehensive course covering quantum algorithms and applications.',
        status: 'pending',
        submittedDate: '2024-12-16T11:45:00Z',
        priority: 'high',
        category: 'Science',
        level: 'Advanced',
        price: 199,
        estimatedHours: 40,
        syllabus: '12 modules covering quantum mechanics to practical applications',
      },
      {
        id: 'course-002',
        type: 'course',
        applicantName: 'Jessica Lee',
        applicantEmail: 'jessica.lee@email.com',
        title: 'Photography Masterclass',
        description: 'From basics to professional photography techniques.',
        status: 'under_review',
        submittedDate: '2024-12-13T08:30:00Z',
        priority: 'medium',
        category: 'Photography',
        level: 'All Levels',
        price: 79,
        estimatedHours: 25,
      },
      {
        id: 'course-003',
        type: 'course',
        applicantName: 'Alex Kumar',
        applicantEmail: 'alex.kumar@email.com',
        title: 'Blockchain Development Fundamentals',
        description: 'Learn to build decentralized applications from scratch.',
        status: 'rejected',
        submittedDate: '2024-12-08T15:20:00Z',
        reviewedDate: '2024-12-11T10:30:00Z',
        reviewedBy: 'Admin User',
        rejectionReason: 'Content overlaps significantly with existing courses. Please revise to focus on unique aspects.',
        priority: 'low',
        category: 'Programming',
        level: 'Intermediate',
        price: 149,
      },
      
      // Organization Applications
      {
        id: 'org-001',
        type: 'organization',
        applicantName: 'David Martinez',
        applicantEmail: 'david@techcorp.com',
        applicantPhone: '+1 (555) 234-5678',
        title: 'TechCorp Enterprise Training',
        description: 'Large tech company seeking enterprise LMS access for 500+ employees.',
        status: 'pending',
        submittedDate: '2024-12-17T09:00:00Z',
        priority: 'high',
        organizationName: 'TechCorp International',
        industry: 'Technology',
        size: '500-1000 employees',
        website: 'techcorp.com',
        licenseNumber: 'TC-2024-1234',
      },
      {
        id: 'org-002',
        type: 'organization',
        applicantName: 'Lisa Anderson',
        applicantEmail: 'lisa@healthplus.org',
        title: 'HealthPlus Medical Training',
        description: 'Healthcare organization requiring compliance training platform.',
        status: 'approved',
        submittedDate: '2024-12-12T13:45:00Z',
        reviewedDate: '2024-12-14T11:20:00Z',
        reviewedBy: 'Admin User',
        priority: 'high',
        organizationName: 'HealthPlus Medical Group',
        industry: 'Healthcare',
        size: '100-500 employees',
        website: 'healthplus.org',
      },
    ];

    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Filter by tab (type)
    if (activeTab !== 'all') {
      filtered = filtered.filter(app => app.type === activeTab);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, activeTab, statusFilter, searchQuery]);

  const getStatusBadge = (status: Application['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      under_review: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      under_review: AlertCircle,
    };

    const Icon = icons[status];
    
    return (
      <Badge variant="outline" className={variants[status]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Application['priority']) => {
    const variants = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700',
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getTypeIcon = (type: Application['type']) => {
    const icons = {
      instructor: GraduationCap,
      course: BookOpen,
      organization: Building2,
    };
    return icons[type];
  };

  const handleApprove = (application: Application) => {
    const updatedApplications = applications.map(app =>
      app.id === application.id
        ? {
            ...app,
            status: 'approved' as const,
            reviewedDate: new Date().toISOString(),
            reviewedBy: 'Current Admin',
          }
        : app
    );
    setApplications(updatedApplications);
    setShowDetailsDialog(false);
    toast.success(`${application.type} application approved!`);
  };

  const handleReject = () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    const updatedApplications = applications.map(app =>
      app.id === selectedApplication.id
        ? {
            ...app,
            status: 'rejected' as const,
            reviewedDate: new Date().toISOString(),
            reviewedBy: 'Current Admin',
            rejectionReason,
          }
        : app
    );
    setApplications(updatedApplications);
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
    setRejectionReason('');
    toast.success('Application rejected');
  };

  const handleMarkUnderReview = (application: Application) => {
    const updatedApplications = applications.map(app =>
      app.id === application.id
        ? { ...app, status: 'under_review' as const }
        : app
    );
    setApplications(updatedApplications);
    toast.success('Application marked as under review');
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    toast.success('Message sent to applicant');
    setShowMessageDialog(false);
    setMessageText('');
  };

  const handleDelete = (application: Application) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    const updatedApplications = applications.filter(app => app.id !== application.id);
    setApplications(updatedApplications);
    setShowDetailsDialog(false);
    toast.success('Application deleted');
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    underReview: applications.filter(app => app.status === 'under_review').length,
    instructorApps: applications.filter(app => app.type === 'instructor').length,
    courseApps: applications.filter(app => app.type === 'course').length,
    orgApps: applications.filter(app => app.type === 'organization').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Applications Management</h1>
          <p className="text-muted-foreground">
            Review and manage instructor, course, and organization applications
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your decision
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview}</div>
            <p className="text-xs text-muted-foreground">
              Being evaluated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table with Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="instructor">
                <GraduationCap className="w-4 h-4 mr-2" />
                Instructors ({stats.instructorApps})
              </TabsTrigger>
              <TabsTrigger value="course">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses ({stats.courseApps})
              </TabsTrigger>
              <TabsTrigger value="organization">
                <Building2 className="w-4 h-4 mr-2" />
                Organizations ({stats.orgApps})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">No applications found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => {
                      const TypeIcon = getTypeIcon(application.type);
                      return (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="capitalize">{application.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {application.applicantName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{application.applicantName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {application.applicantEmail}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{application.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {application.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatDate(application.submittedDate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(application.priority)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowDetailsDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {application.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleApprove(application)}
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedApplication(application);
                                        setShowRejectDialog(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleMarkUnderReview(application)}
                                    >
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Mark Under Review
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowMessageDialog(true);
                                  }}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(application)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Tabs>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl mb-2">
                      {selectedApplication.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedApplication.status)}
                      {getPriorityBadge(selectedApplication.priority)}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Applicant Info */}
                <div>
                  <h3 className="font-semibold mb-3">Applicant Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-white">
                          {selectedApplication.applicantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedApplication.applicantName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {selectedApplication.applicantEmail}
                        </div>
                        {selectedApplication.applicantPhone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {selectedApplication.applicantPhone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {formatDate(selectedApplication.submittedDate)}
                      </p>
                      {selectedApplication.reviewedDate && (
                        <>
                          <p className="text-sm text-muted-foreground mt-2">Reviewed</p>
                          <p className="font-medium">
                            {formatDate(selectedApplication.reviewedDate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {selectedApplication.reviewedBy}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplication.description}
                  </p>
                </div>

                {/* Instructor-specific details */}
                {selectedApplication.type === 'instructor' && (
                  <>
                    {selectedApplication.expertise && (
                      <div>
                        <h3 className="font-semibold mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedApplication.experience && (
                        <div>
                          <h3 className="font-semibold mb-2">Experience</h3>
                          <p className="text-sm">{selectedApplication.experience}</p>
                        </div>
                      )}
                      {selectedApplication.education && (
                        <div>
                          <h3 className="font-semibold mb-2">Education</h3>
                          <p className="text-sm">{selectedApplication.education}</p>
                        </div>
                      )}
                    </div>
                    {selectedApplication.bio && (
                      <div>
                        <h3 className="font-semibold mb-2">Bio</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedApplication.bio}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3">
                      {selectedApplication.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://${selectedApplication.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            LinkedIn Profile
                          </a>
                        </Button>
                      )}
                      {selectedApplication.portfolio && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://${selectedApplication.portfolio}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Portfolio
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {/* Course-specific details */}
                {selectedApplication.type === 'course' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{selectedApplication.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="font-medium">{selectedApplication.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">${selectedApplication.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Hours</p>
                      <p className="font-medium">
                        {selectedApplication.estimatedHours} hours
                      </p>
                    </div>
                    {selectedApplication.syllabus && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Syllabus</p>
                        <p className="font-medium">{selectedApplication.syllabus}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Organization-specific details */}
                {selectedApplication.type === 'organization' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Organization Name</p>
                      <p className="font-medium">
                        {selectedApplication.organizationName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Industry</p>
                      <p className="font-medium">{selectedApplication.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company Size</p>
                      <p className="font-medium">{selectedApplication.size}</p>
                    </div>
                    {selectedApplication.website && (
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a
                            href={`https://${selectedApplication.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedApplication.website}
                          </a>
                        </Button>
                      </div>
                    )}
                    {selectedApplication.licenseNumber && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">License Number</p>
                        <p className="font-medium">
                          {selectedApplication.licenseNumber}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedApplication.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold mb-2 text-red-900">
                      Rejection Reason
                    </h3>
                    <p className="text-sm text-red-700">
                      {selectedApplication.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleMarkUnderReview(selectedApplication)}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Mark Under Review
                    </Button>
                    <Button onClick={() => handleApprove(selectedApplication)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Application
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMessageDialog(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Applicant
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will be sent to
              the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this application is being rejected..."
                className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Applicant</DialogTitle>
            <DialogDescription>
              {selectedApplication &&
                `Send a message to ${selectedApplication.applicantName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}