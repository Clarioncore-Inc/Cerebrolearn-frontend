import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Star,
  Settings,
  UserCheck,
  FileText,
  MessageSquare,
  Upload,
  GraduationCap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface PsychologistDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PsychologistDashboard({ onNavigate }: PsychologistDashboardProps) {
  const { user } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');
  const [application, setApplication] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    reviewCount: 0,
  });
  const [qualifications, setQualifications] = useState('');
  const [certifications, setCertifications] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Load psychologist profile using email as key
    const profileData = localStorage.getItem(`psychologist_profile_${user.email}`);
    
    if (profileData) {
      const parsedProfile = JSON.parse(profileData);
      setProfile(parsedProfile);
      setQualifications(parsedProfile.qualifications || '');
      setCertifications(parsedProfile.certifications || '');
      
      // Check if application has been submitted
      const apps = JSON.parse(localStorage.getItem('psychologist_applications') || '[]');
      const userApp = apps.find((app: any) => app.email === user.email);
      
      if (userApp) {
        setApplication(userApp);
        setApplicationStatus(userApp.status);
      } else {
        // Profile exists but no application submitted yet
        setApplicationStatus('incomplete');
      }
    } else {
      console.log('[PsychologistDashboard] No profile found for email:', user.email);
      // No profile found - this shouldn't happen if signup worked correctly
      setApplicationStatus('incomplete');
    }

    // Load bookings (mock data for now)
    const mockBookings = [
      {
        id: 'booking-1',
        studentName: 'John Doe',
        studentEmail: 'john@example.com',
        date: '2026-02-15',
        time: '10:00 AM',
        duration: '60 min',
        type: 'IQ Test Results Discussion',
        status: 'confirmed',
        iqScore: 128,
      },
      {
        id: 'booking-2',
        studentName: 'Sarah Johnson',
        studentEmail: 'sarah@example.com',
        date: '2026-02-15',
        time: '2:00 PM',
        duration: '60 min',
        type: 'Career Counseling',
        status: 'confirmed',
        iqScore: 135,
      },
      {
        id: 'booking-3',
        studentName: 'Mike Chen',
        studentEmail: 'mike@example.com',
        date: '2026-02-16',
        time: '11:00 AM',
        duration: '60 min',
        type: 'Learning Assessment',
        status: 'pending',
        iqScore: 122,
      },
    ];
    
    setBookings(mockBookings);

    // Calculate stats
    setStats({
      totalBookings: 47,
      upcomingBookings: 3,
      completedSessions: 44,
      totalEarnings: 6600,
      averageRating: 4.8,
      reviewCount: 38,
    });
  }, [user]);

  const handleSubmitCredentials = async () => {
    if (!qualifications.trim()) {
      toast.error('Please add your qualifications before submitting');
      return;
    }

    if (!user) {
      toast.error('No user session found. Please log in again.');
      return;
    }

    setSubmitting(true);

    try {
      // If profile doesn't exist, create a minimal one from user data
      let currentProfile = profile;
      if (!currentProfile) {
        currentProfile = {
          email: user.email,
          fullName: user.user_metadata?.full_name || 'Psychologist',
          licenseNumber: '',
          specialization: '',
          yearsOfExperience: '',
          bio: '',
          location: '',
          createdAt: new Date().toISOString(),
          status: 'incomplete',
        };
        setProfile(currentProfile);
      }

      // Create application for admin review
      const applicationId = `psych_app_${Date.now()}`;
      const applications = JSON.parse(localStorage.getItem('psychologist_applications') || '[]');
      
      const newApplication = {
        id: applicationId,
        email: user.email,
        fullName: currentProfile.fullName,
        licenseNumber: currentProfile.licenseNumber,
        specialization: currentProfile.specialization,
        yearsOfExperience: currentProfile.yearsOfExperience,
        bio: currentProfile.bio,
        location: currentProfile.location,
        qualifications,
        certifications,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        reviewNotes: '',
      };
      
      applications.push(newApplication);
      localStorage.setItem('psychologist_applications', JSON.stringify(applications));
      
      // Update profile with credentials
      const updatedProfile = {
        ...currentProfile,
        qualifications,
        certifications,
        status: 'pending',
        applicationId,
      };
      localStorage.setItem(`psychologist_profile_${user.email}`, JSON.stringify(updatedProfile));
      
      setProfile(updatedProfile);
      setApplication(newApplication);
      setApplicationStatus('pending');
      
      toast.success('Credentials submitted for verification!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit credentials';
      toast.error(errorMessage);
      console.error('[PsychologistDashboard] Error submitting credentials:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Incomplete profile view - need to upload credentials
  if (applicationStatus === 'incomplete') {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Upload your qualifications and certifications to get verified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to submit your credentials for verification before you can accept consultation bookings.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qualifications">Education & Qualifications *</Label>
                <Textarea
                  id="qualifications"
                  placeholder="Ph.D. in Clinical Psychology, Harvard University, 2015&#10;M.A. in Psychology, Stanford University, 2010&#10;B.A. in Psychology, UCLA, 2008"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  List your degrees, universities, and graduation years
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Additional Training</Label>
                <Textarea
                  id="certifications"
                  placeholder="Licensed Clinical Psychologist (State of NY)&#10;Certified Cognitive Behavioral Therapist&#10;EMDR Therapy Certification"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  List any professional licenses, certifications, or specialized training
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold">What happens after submission:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Our team will review your credentials within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email notification once reviewed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>If approved, you'll gain full access to accept bookings</span>
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmitCredentials} 
              className="w-full"
              disabled={submitting || !qualifications.trim()}
            >
              {submitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit for Verification
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending approval view
  if (applicationStatus === 'pending') {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="border-2 border-yellow-200 dark:border-yellow-900">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription>
              Your psychologist account application is being reviewed by our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Application Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-300 dark:border-yellow-700">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="font-medium">
                    {application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Expected Response</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You'll receive an email notification at <strong>{application?.email}</strong> once your application has been reviewed.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">What's being verified:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Professional license and credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Educational qualifications and certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Professional background and experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Compliance with platform standards</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rejected view
  if (applicationStatus === 'rejected') {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="border-2 border-red-200 dark:border-red-900">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <CardTitle className="text-2xl">Application Not Approved</CardTitle>
            <CardDescription>
              Unfortunately, your application did not meet our current requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {application?.reviewNotes && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Reason:</strong> {application.reviewNotes}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold">What you can do:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Review the feedback provided above</li>
                <li>• Ensure all credentials are current and valid</li>
                <li>• Update your qualifications if needed</li>
                <li>• Contact support if you have questions</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
              <Button className="flex-1">
                Submit New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Approved - Full Dashboard
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Psychologist Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('psychologist-earnings')}>
              <DollarSign className="h-4 w-4 mr-2" />
              View Earnings
            </Button>
            <Button onClick={() => onNavigate('psychologist-availability')}>
              <Calendar className="h-4 w-4 mr-2" />
              Manage Availability
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Manage your consultations and track your impact</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next session today at 10:00 AM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${(stats.totalEarnings / stats.completedSessions).toFixed(0)} per session avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Client Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {stats.averageRating}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {stats.reviewCount} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Button onClick={() => onNavigate('psychologist-sessions')}>
            <Calendar className="h-4 w-4 mr-2" />
            Session Dashboard
          </Button>
        </div>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Consultations</CardTitle>
              <CardDescription>Your scheduled sessions with students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.studentName}</h4>
                          <p className="text-sm text-muted-foreground">{booking.studentEmail}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-13">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time} ({booking.duration})
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {booking.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-13">
                        <Badge variant="secondary">IQ Score: {booking.iqScore}</Badge>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 lg:mt-0">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Set your working hours and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Availability management coming in Phase 3</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client History</CardTitle>
              <CardDescription>View your past and current clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Client management coming in Phase 3</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your professional profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Profile settings coming in Phase 4</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}