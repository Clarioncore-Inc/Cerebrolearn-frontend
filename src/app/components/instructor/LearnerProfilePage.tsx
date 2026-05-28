import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  BarChart3,
  Target,
  Users,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';

interface LearnerProfilePageProps {
  learnerId: string;
  learnerName?: string;
  onBack: () => void;
  onRemove?: (learnerId: string) => void;
}

interface CourseEnrollment {
  id: string;
  courseId: string;
  courseName: string;
  courseCategory: string;
  progress: number;
  enrolledAt: string;
  lastAccessed: string;
  completed: boolean;
  performance: 'Excellent' | 'Good' | 'Needs Help';
}

interface LearnerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joinedAt: string;
  totalCourses: number;
  completedCourses: number;
  averageProgress: number;
  totalLearningTime: number;
  enrollments: CourseEnrollment[];
}

export function LearnerProfilePage({
  learnerId,
  learnerName,
  onBack,
  onRemove,
}: LearnerProfilePageProps) {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearnerProfile();
  }, [learnerId]);

  const loadLearnerProfile = async () => {
    try {
      setLoading(true);

      console.log('Loading learner profile for ID:', learnerId);

      // Get user info
      const usersJson = localStorage.getItem('cerebrolearn_users') || '[]';
      const users = JSON.parse(usersJson);
      console.log('Total users in database:', users.length);

      const user = users.find((u: any) => u.id === learnerId);

      if (!user) {
        console.error('Learner not found with ID:', learnerId);
        console.log(
          'Available user IDs:',
          users.map((u: any) => u.id),
        );
        toast.error('Learner not found');
        setLoading(false);
        return;
      }

      console.log('Found user:', user);

      // Get all enrollments for this learner
      const enrollmentsJson =
        localStorage.getItem('cerebrolearn_enrollments') || '[]';
      const allEnrollments = JSON.parse(enrollmentsJson);
      const userEnrollments = allEnrollments.filter(
        (e: any) => e.user_id === learnerId,
      );

      console.log('User enrollments:', userEnrollments.length);

      // Get course details for each enrollment
      const coursesJson = localStorage.getItem('cerebrolearn_courses') || '[]';
      const courses = JSON.parse(coursesJson);

      const enrollments: CourseEnrollment[] = userEnrollments.map(
        (enrollment: any) => {
          const course = courses.find(
            (c: any) => c.id === enrollment.course_id,
          );
          const performance =
            enrollment.progress >= 80
              ? 'Excellent'
              : enrollment.progress >= 50
                ? 'Good'
                : 'Needs Help';

          const enrolledDate = new Date(enrollment.enrolled_at);
          const daysSince = Math.floor(
            (Date.now() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          const lastAccessed =
            daysSince === 0
              ? 'Today'
              : daysSince === 1
                ? 'Yesterday'
                : `${daysSince} days ago`;

          return {
            id: enrollment.id,
            courseId: enrollment.course_id,
            courseName: course?.title || 'Unknown Course',
            courseCategory: course?.category || 'General',
            progress: enrollment.progress || 0,
            enrolledAt: enrollment.enrolled_at,
            lastAccessed,
            completed: enrollment.completed || false,
            performance,
          };
        },
      );

      const completedCount = enrollments.filter((e) => e.completed).length;
      const avgProgress =
        enrollments.length > 0
          ? Math.round(
              enrollments.reduce((sum, e) => sum + e.progress, 0) /
                enrollments.length,
            )
          : 0;

      // Calculate approximate learning time based on progress
      const totalTime = enrollments.reduce(
        (sum, e) => sum + e.progress * 1.2,
        0,
      );

      setProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        joinedAt:
          enrollments.length > 0
            ? new Date(
                Math.min(
                  ...enrollments.map((e) => new Date(e.enrolledAt).getTime()),
                ),
              ).toISOString()
            : new Date().toISOString(),
        totalCourses: enrollments.length,
        completedCourses: completedCount,
        averageProgress: avgProgress,
        totalLearningTime: Math.round(totalTime),
        enrollments: enrollments.sort((a, b) => b.progress - a.progress),
      });
    } catch (error) {
      console.error('Error loading learner profile:', error);
      toast.error('Failed to load learner profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLearner = () => {
    if (!profile) return;

    if (
      confirm(
        `Are you sure you want to remove ${profile.name} from all courses? This action cannot be undone.`,
      )
    ) {
      if (onRemove) {
        onRemove(learnerId);
      }
      onBack();
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-[#fafbff] via-[rgba(240,249,255,0.3)] to-[#fafbff] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading learner profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-[#fafbff] via-[rgba(240,249,255,0.3)] to-[#fafbff] flex items-center justify-center'>
        <div className='text-center'>
          <Users className='h-16 w-16 text-muted-foreground/50 mx-auto mb-4' />
          <p className='text-lg font-medium text-muted-foreground'>
            Learner not found
          </p>
          <Button onClick={onBack} className='mt-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#fafbff] via-[rgba(240,249,255,0.3)] to-[#fafbff]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button variant='ghost' onClick={onBack} className='mb-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Learners
          </Button>

          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-6'>
              <div className='w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary'>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className='text-4xl font-extrabold text-slate-900'>
                  {profile.name}
                </h1>
                <div className='flex items-center gap-4 mt-2 text-slate-600'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    <span>{profile.email}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    <span>Joined {formatJoinDate(profile.joinedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={() => toast.info('Messaging feature coming soon!')}
              >
                <MessageSquare className='mr-2 h-4 w-4' />
                Send Message
              </Button>
              {onRemove && (
                <Button
                  variant='outline'
                  onClick={handleRemoveLearner}
                  className='text-red-600 hover:text-red-700 hover:bg-red-50'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Remove Learner
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardDescription>Total Courses</CardDescription>
                <BookOpen className='h-5 w-5 text-blue-500' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{profile.totalCourses}</div>
              <p className='text-xs text-muted-foreground mt-1'>
                {profile.completedCourses} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {profile.averageProgress}%
              </div>
              <Progress value={profile.averageProgress} className='mt-2' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Learning Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {profile.totalLearningTime}h
              </div>
              <p className='text-xs text-muted-foreground mt-1'>Total hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {profile.totalCourses > 0
                  ? Math.round(
                      (profile.completedCourses / profile.totalCourses) * 100,
                    )
                  : 0}
                %
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                {profile.completedCourses}/{profile.totalCourses} courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Enrolled Courses</CardTitle>
            <CardDescription>
              All courses this learner is currently enrolled in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile.enrollments.length === 0 ? (
              <div className='text-center py-12'>
                <BookOpen className='h-16 w-16 mx-auto text-muted-foreground/50 mb-4' />
                <p className='text-lg font-medium text-muted-foreground'>
                  No enrollments yet
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  This learner hasn't enrolled in any courses
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {profile.enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className='flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-accent transition-colors'
                  >
                    <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <BookOpen className='h-6 w-6 text-primary' />
                    </div>

                    <div className='flex-1'>
                      <h3 className='font-semibold text-slate-900'>
                        {enrollment.courseName}
                      </h3>
                      <div className='flex items-center gap-3 mt-1'>
                        <span className='text-sm text-slate-500'>
                          {enrollment.courseCategory}
                        </span>
                        <span className='text-slate-300'>•</span>
                        <span className='text-sm text-slate-500'>
                          Last accessed: {enrollment.lastAccessed}
                        </span>
                      </div>
                    </div>

                    <div className='text-right min-w-[200px]'>
                      <div className='flex items-center justify-end gap-3 mb-2'>
                        <span className='text-lg font-bold text-slate-900'>
                          {enrollment.progress}%
                        </span>
                        <Badge
                          variant={
                            enrollment.performance === 'Excellent'
                              ? 'default'
                              : enrollment.performance === 'Good'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {enrollment.performance}
                        </Badge>
                        {enrollment.completed && (
                          <Badge
                            variant='outline'
                            className='bg-green-50 text-green-700 border-green-200'
                          >
                            <Award className='w-3 h-3 mr-1' />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <Progress
                        value={enrollment.progress}
                        className='w-full'
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>
                How the learner is performing across courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  {
                    label: 'Excellent',
                    count: profile.enrollments.filter(
                      (e) => e.performance === 'Excellent',
                    ).length,
                    color: 'bg-primary',
                    textColor: 'text-primary',
                  },
                  {
                    label: 'Good',
                    count: profile.enrollments.filter(
                      (e) => e.performance === 'Good',
                    ).length,
                    color: 'bg-secondary',
                    textColor: 'text-secondary',
                  },
                  {
                    label: 'Needs Help',
                    count: profile.enrollments.filter(
                      (e) => e.performance === 'Needs Help',
                    ).length,
                    color: 'bg-destructive',
                    textColor: 'text-destructive',
                  },
                ].map((item) => {
                  const percentage =
                    profile.totalCourses > 0
                      ? (item.count / profile.totalCourses) * 100
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-slate-700'>
                          {item.label}
                        </span>
                        <span className={`text-sm font-bold ${item.textColor}`}>
                          {item.count} course{item.count !== 1 ? 's' : ''} (
                          {Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className='w-full bg-slate-100 rounded-full h-2'>
                        <div
                          className={`${item.color} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest course interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {profile.enrollments.slice(0, 5).map((enrollment) => (
                  <div key={enrollment.id} className='flex items-center gap-3'>
                    <div className='w-2 h-2 rounded-full bg-primary'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-slate-900'>
                        {enrollment.courseName}
                      </p>
                      <p className='text-xs text-slate-500'>
                        Last accessed {enrollment.lastAccessed}
                      </p>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      {enrollment.progress}%
                    </Badge>
                  </div>
                ))}
                {profile.enrollments.length === 0 && (
                  <p className='text-sm text-muted-foreground text-center py-4'>
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
