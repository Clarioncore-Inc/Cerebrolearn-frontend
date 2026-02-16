import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Calendar,
  DollarSign,
  BarChart3,
  Award,
  MapPin,
  Mail,
  Ban,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminPsychologistManagement() {
  const [psychologists, setPsychologists] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    suspended: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load psychologist profiles
    const allProfiles = JSON.parse(localStorage.getItem('psychologist_profiles') || '[]');
    setPsychologists(allProfiles);

    // Load applications
    const allApplications = JSON.parse(localStorage.getItem('psychologist_applications') || '[]');
    setApplications(allApplications);

    // Calculate stats
    const verified = allProfiles.filter((p: any) => p.status === 'verified').length;
    const pending = allApplications.filter((a: any) => a.status === 'pending').length;
    const suspended = allProfiles.filter((p: any) => p.status === 'suspended').length;

    setStats({
      total: allProfiles.length,
      verified,
      pending,
      suspended,
    });
  };

  const handleApproveApplication = (application: any) => {
    if (!confirm(`Approve application for ${application.fullName}?`)) {
      return;
    }

    // Update application status
    const allApplications = JSON.parse(localStorage.getItem('psychologist_applications') || '[]');
    const updatedApplications = allApplications.map((a: any) =>
      a.id === application.id
        ? { ...a, status: 'approved', reviewedAt: new Date().toISOString() }
        : a
    );
    localStorage.setItem('psychologist_applications', JSON.stringify(updatedApplications));

    // Update or create psychologist profile
    const allProfiles = JSON.parse(localStorage.getItem('psychologist_profiles') || '[]');
    const existingProfile = allProfiles.find((p: any) => p.email === application.email);

    if (existingProfile) {
      // Update existing profile
      const updatedProfiles = allProfiles.map((p: any) =>
        p.email === application.email
          ? { ...p, status: 'verified', verifiedAt: new Date().toISOString() }
          : p
      );
      localStorage.setItem('psychologist_profiles', JSON.stringify(updatedProfiles));
    } else {
      // Create new profile
      const newProfile = {
        id: `psych_${Date.now()}`,
        email: application.email,
        fullName: application.fullName,
        licenseNumber: application.licenseNumber,
        specialization: application.specialization,
        yearsOfExperience: application.yearsOfExperience,
        bio: application.bio,
        location: application.location,
        hourlyRate: application.hourlyRate || 150,
        rating: 0,
        reviewCount: 0,
        totalSessions: 0,
        status: 'verified',
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
      };
      allProfiles.push(newProfile);
      localStorage.setItem('psychologist_profiles', JSON.stringify(allProfiles));
    }

    toast.success('Application approved successfully');
    loadData();
  };

  const handleRejectApplication = (application: any) => {
    if (!confirm(`Reject application for ${application.fullName}?`)) {
      return;
    }

    const allApplications = JSON.parse(localStorage.getItem('psychologist_applications') || '[]');
    const updatedApplications = allApplications.map((a: any) =>
      a.id === application.id
        ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString() }
        : a
    );
    localStorage.setItem('psychologist_applications', JSON.stringify(updatedApplications));

    toast.success('Application rejected');
    loadData();
  };

  const handleSuspendPsychologist = (psychologist: any) => {
    if (!confirm(`Suspend ${psychologist.fullName}?`)) {
      return;
    }

    const allProfiles = JSON.parse(localStorage.getItem('psychologist_profiles') || '[]');
    const updated = allProfiles.map((p: any) =>
      p.email === psychologist.email
        ? { ...p, status: 'suspended', suspendedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('psychologist_profiles', JSON.stringify(updated));

    toast.success('Psychologist suspended');
    loadData();
  };

  const handleActivatePsychologist = (psychologist: any) => {
    if (!confirm(`Activate ${psychologist.fullName}?`)) {
      return;
    }

    const allProfiles = JSON.parse(localStorage.getItem('psychologist_profiles') || '[]');
    const updated = allProfiles.map((p: any) =>
      p.email === psychologist.email
        ? { ...p, status: 'verified', activatedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('psychologist_profiles', JSON.stringify(updated));

    toast.success('Psychologist activated');
    loadData();
  };

  const calculatePsychologistStats = (psychologist: any) => {
    const allBookings = JSON.parse(localStorage.getItem('appointment_bookings') || '[]');
    const myBookings = allBookings.filter((b: any) => b.psychologistEmail === psychologist.email);
    
    const completed = myBookings.filter((b: any) => b.status === 'completed').length;
    const upcoming = myBookings.filter((b: any) => 
      b.status === 'confirmed' && new Date(b.date) > new Date()
    ).length;

    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    const myPayments = allPayments.filter((p: any) => 
      myBookings.some((b: any) => b.id === p.bookingId) && p.status === 'completed'
    );
    const earnings = myPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

    return { completed, upcoming, earnings };
  };

  const filteredPsychologists = psychologists.filter(p =>
    searchQuery === '' ||
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApplications = applications.filter(a =>
    searchQuery === '' ||
    a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Psychologist Management</h2>
        <p className="text-muted-foreground">
          Manage psychologists, review applications, and monitor performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Psychologists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Suspended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Psychologists ({psychologists.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.filter(a => a.status === 'pending').length})
          </TabsTrigger>
        </TabsList>

        {/* All Psychologists Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search psychologists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredPsychologists.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                No psychologists found
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPsychologists.map((psychologist: any) => {
                const pstats = calculatePsychologistStats(psychologist);
                
                return (
                  <Card key={psychologist.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={psychologist.avatar} />
                          <AvatarFallback>
                            {psychologist.fullName?.charAt(0).toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{psychologist.fullName}</h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                {psychologist.specialization}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {psychologist.email}
                                </div>
                                {psychologist.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {psychologist.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                psychologist.status === 'verified'
                                  ? 'default'
                                  : psychologist.status === 'suspended'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {psychologist.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {psychologist.status === 'suspended' && <Ban className="h-3 w-3 mr-1" />}
                              {psychologist.status.charAt(0).toUpperCase() + psychologist.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Rating</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">
                                  {psychologist.rating?.toFixed(1) || '0.0'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({psychologist.reviewCount || 0})
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Completed</p>
                              <p className="font-semibold">{pstats.completed} sessions</p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Upcoming</p>
                              <p className="font-semibold">{pstats.upcoming} sessions</p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
                              <p className="font-semibold">${pstats.earnings.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {psychologist.status === 'verified' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleSuspendPsychologist(psychologist)}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )}
                            {psychologist.status === 'suspended' && (
                              <Button
                                size="sm"
                                onClick={() => handleActivatePsychologist(psychologist)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredApplications.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                No applications found
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application: any) => (
                <Card 
                  key={application.id}
                  className={application.status === 'pending' ? 'border-yellow-500/50' : ''}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{application.fullName}</h3>
                          <Badge
                            variant={
                              application.status === 'approved'
                                ? 'default'
                                : application.status === 'pending'
                                ? 'outline'
                                : 'destructive'
                            }
                          >
                            {application.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {application.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {application.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-32">Email:</span>
                            <span>{application.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-32">License:</span>
                            <span>{application.licenseNumber}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-32">Specialization:</span>
                            <span>{application.specialization}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-32">Experience:</span>
                            <span>{application.yearsOfExperience} years</span>
                          </div>
                          {application.location && (
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-muted-foreground w-32">Location:</span>
                              <span>{application.location}</span>
                            </div>
                          )}
                        </div>

                        {application.qualifications && (
                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-xs font-semibold mb-1">Qualifications:</p>
                            <p className="text-xs whitespace-pre-line">{application.qualifications}</p>
                          </div>
                        )}

                        {application.certifications && (
                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-xs font-semibold mb-1">Certifications:</p>
                            <p className="text-xs whitespace-pre-line">{application.certifications}</p>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(application.submittedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {application.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveApplication(application)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectApplication(application)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}