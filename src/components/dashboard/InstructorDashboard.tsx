import React, { useEffect, useState } from 'react';
import { coursesApi } from '../../utils/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CourseCreationWizard } from '../courses/CourseCreationWizard';
import { CourseManagementPage } from '../instructor/CourseManagementPage';
import {
  BookOpen,
  Plus,
  Users,
  TrendingUp,
  Edit,
  BarChart3,
  PlayCircle,
  DollarSign,
  Star,
  Eye,
  MessageSquare,
  Clock,
  Award,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Trash2,
  Copy,
  Settings,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface InstructorDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function InstructorDashboard({ onNavigate }: InstructorDashboardProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    '7d' | '30d' | '90d' | 'all'
  >('30d');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  useEffect(() => {
    loadInstructorCourses();
  }, []);

  const loadInstructorCourses = async () => {
    try {
      const data = await coursesApi.getAll();
      // Filter to show only courses created by this instructor
      setCourses(data.items || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await coursesApi.update(courseId, { status: 'published' } as any);

      toast.success('Course published successfully!');
      loadInstructorCourses();
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await coursesApi.delete(courseId);

      toast.success('Course deleted successfully!');
      loadInstructorCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleDuplicateCourse = async (course: any) => {
    try {
      const newCourse = {
        ...course,
        title: `${course.title} (Copy)`,
        status: 'draft',
      };
      delete newCourse.id;

      await coursesApi.create(newCourse);

      toast.success('Course duplicated successfully!');
      loadInstructorCourses();
    } catch (error) {
      console.error('Error duplicating course:', error);
      toast.error('Failed to duplicate course');
    }
  };

  // Mock analytics data
  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.enrollments || 0),
    0,
  );
  const totalRevenue = totalStudents * 49.99; // Mock revenue
  const avgRating = 4.7;
  const totalReviews = Math.floor(totalStudents * 0.4);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      description: 'vs last month',
    },
    {
      title: 'Total Students',
      value: totalStudents.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'vs last month',
    },
    {
      title: 'Active Courses',
      value: courses.filter((c) => c.status === 'published').length,
      change:
        courses.length > 0
          ? `${courses.filter((c) => c.status === 'published').length}/${courses.length}`
          : '0/0',
      trend: 'neutral',
      icon: BookOpen,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'published',
    },
    {
      title: 'Average Rating',
      value: avgRating.toFixed(1),
      change: totalReviews > 0 ? `${totalReviews} reviews` : 'No reviews',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'overall rating',
    },
  ];

  const recentActivity = [
    {
      type: 'enrollment',
      course: 'Introduction to Python',
      student: 'John Doe',
      time: '2 hours ago',
    },
    {
      type: 'review',
      course: 'Web Development Bootcamp',
      rating: 5,
      time: '5 hours ago',
    },
    {
      type: 'completion',
      course: 'React Masterclass',
      student: 'Jane Smith',
      time: '1 day ago',
    },
    {
      type: 'question',
      course: 'Data Science Fundamentals',
      student: 'Mike Johnson',
      time: '2 days ago',
    },
  ];

  const topPerformingCourses = [...courses]
    .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
    .slice(0, 3);

  // If showing create wizard, render it full-screen
  if (showCreateWizard) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
        <div className='container py-6'>
          <CourseCreationWizard
            onComplete={(course) => {
              setCourses([...courses, course]);
              setShowCreateWizard(false);
            }}
            onCancel={() => setShowCreateWizard(false)}
          />
        </div>
      </div>
    );
  }

  // If a course is selected, show the Course Management Page
  if (selectedCourse) {
    return (
      <CourseManagementPage
        course={selectedCourse}
        onNavigate={onNavigate}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
      <div className='py-6 px-4 md:py-6 md:px-6 lg:py-12 lg:px-12 space-y-6'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-bold mb-2 gradient-text'>
              Instructor Dashboard
            </h1>
            <p className='text-lg text-muted-foreground'>
              Manage your courses and track your teaching performance
            </p>
          </div>

          <div className='flex gap-3'>
            <Button variant='outline' size='lg'>
              <BarChart3 className='mr-2 h-5 w-5' />
              Analytics
            </Button>
            <Button
              onClick={() => setShowCreateWizard(true)}
              size='lg'
              className='bg-primary'
            >
              <Plus className='mr-2 h-5 w-5' />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className='relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 shadow-none hover:shadow-md'
            >
              <div
                className='absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20'
                style={{ background: stat.color.replace('text-', '') }}
              ></div>
              <CardContent className='p-6 relative'>
                <div className='flex items-start justify-between mb-4'>
                  <div
                    className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.trend === 'up' && (
                    <Badge className='bg-green-500/10 text-green-700 border-0'>
                      <ArrowUp className='w-3 h-3 mr-1' />
                      {stat.change}
                    </Badge>
                  )}
                  {stat.trend === 'down' && (
                    <Badge
                      variant='destructive'
                      className='bg-red-500/10 text-red-700 border-0'
                    >
                      <ArrowDown className='w-3 h-3 mr-1' />
                      {stat.change}
                    </Badge>
                  )}
                  {stat.trend === 'neutral' && (
                    <Badge variant='secondary'>{stat.change}</Badge>
                  )}
                </div>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    {stat.title}
                  </p>
                  <p className='text-3xl font-bold mb-1'>{stat.value}</p>
                  <p className='text-xs text-muted-foreground'>
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Top Performing */}
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Top Performing Courses */}
          <Card className='lg:col-span-2 border-2 shadow-none hover:shadow-md transition-all'>
            <CardHeader className='border-b bg-accent/30'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-2xl'>
                    Top Performing Courses
                  </CardTitle>
                  <CardDescription>
                    Your most popular courses this month
                  </CardDescription>
                </div>
                <Button variant='ghost' size='sm'>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {topPerformingCourses.length > 0 ? (
                  topPerformingCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className='flex items-center gap-4 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors'
                    >
                      <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg'>
                        #{index + 1}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-semibold truncate'>
                          {course.title}
                        </h4>
                        <div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <Users className='w-3 h-3' />
                            {course.enrollments || 0} students
                          </span>
                          <span className='flex items-center gap-1'>
                            <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                            {course.rating || 4.5}
                          </span>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-primary'>
                          ${((course.enrollments || 0) * 49.99).toFixed(0)}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          revenue
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-12 text-muted-foreground'>
                    <BarChart3 className='w-12 h-12 mx-auto mb-3 opacity-50' />
                    <p>No course data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className='border-2 shadow-none hover:shadow-md transition-all'>
            <CardHeader className='border-b bg-accent/30'>
              <CardTitle className='text-xl'>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0'
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'enrollment'
                          ? 'bg-blue-500/10 text-blue-500'
                          : activity.type === 'review'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : activity.type === 'completion'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-purple-500/10 text-purple-500'
                      }`}
                    >
                      {activity.type === 'enrollment' && (
                        <Users className='w-4 h-4' />
                      )}
                      {activity.type === 'review' && (
                        <Star className='w-4 h-4' />
                      )}
                      {activity.type === 'completion' && (
                        <CheckCircle2 className='w-4 h-4' />
                      )}
                      {activity.type === 'question' && (
                        <MessageSquare className='w-4 h-4' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        {activity.course}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {activity.type === 'enrollment' &&
                          `${activity.student} enrolled`}
                        {activity.type === 'review' &&
                          `New ${activity.rating}-star review`}
                        {activity.type === 'completion' &&
                          `${activity.student} completed`}
                        {activity.type === 'question' &&
                          `${activity.student} asked a question`}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Management */}
        <Card className='border-2 shadow-none hover:shadow-md transition-all'>
          <CardHeader className='border-b bg-accent/30'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div>
                <CardTitle className='text-2xl'>My Courses</CardTitle>
                <CardDescription>
                  Manage and track all your courses
                </CardDescription>
              </div>
              <Tabs
                value={selectedPeriod}
                onValueChange={(v) => setSelectedPeriod(v as any)}
                className='w-auto'
              >
                <TabsList>
                  <TabsTrigger value='7d'>7 Days</TabsTrigger>
                  <TabsTrigger value='30d'>30 Days</TabsTrigger>
                  <TabsTrigger value='90d'>90 Days</TabsTrigger>
                  <TabsTrigger value='all'>All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='all' className='w-full'>
              <TabsList className='mb-6'>
                <TabsTrigger value='all'>
                  All Courses ({courses.length})
                </TabsTrigger>
                <TabsTrigger value='published'>
                  Published (
                  {courses.filter((c) => c.status === 'published').length})
                </TabsTrigger>
                <TabsTrigger value='draft'>
                  Draft ({courses.filter((c) => c.status === 'draft').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value='all'>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className='group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300'
                    >
                      <div className='relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-success/20 flex items-center justify-center overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10'></div>
                        <BookOpen className='h-20 w-20 text-white/40 relative z-0' />

                        <div className='absolute top-4 left-4 right-4 z-20 flex items-start justify-between'>
                          <Badge
                            className={
                              course.status === 'published'
                                ? 'bg-green-500'
                                : 'bg-yellow-500'
                            }
                          >
                            {course.status === 'published' ? (
                              <>
                                <CheckCircle2 className='w-3 h-3 mr-1' />{' '}
                                Published
                              </>
                            ) : (
                              <>
                                <AlertCircle className='w-3 h-3 mr-1' /> Draft
                              </>
                            )}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size='sm'
                                variant='ghost'
                                className='h-8 w-8 p-0 bg-white/90 hover:bg-white'
                              >
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => onNavigate('course', course)}
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicateCourse(course)}
                              >
                                <Copy className='mr-2 h-4 w-4' />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className='mr-2 h-4 w-4' />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className='mr-2 h-4 w-4' />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Settings className='mr-2 h-4 w-4' />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteCourse(course.id)}
                                className='text-red-600 focus:text-red-600'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className='absolute bottom-4 left-4 right-4 z-20'>
                          <Badge
                            variant='secondary'
                            className='bg-white/90 text-foreground'
                          >
                            {course.level || 'All Levels'}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className='line-clamp-2 text-lg group-hover:text-primary transition-colors'>
                          {course.title}
                        </CardTitle>
                        <CardDescription className='line-clamp-2'>
                          {course.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className='space-y-4'>
                        {/* Stats */}
                        <div className='grid grid-cols-3 gap-3 text-center'>
                          <div>
                            <div className='text-xl font-bold text-primary'>
                              {course.enrollments || 0}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              Students
                            </div>
                          </div>
                          <div>
                            <div className='text-xl font-bold text-primary'>
                              {course.rating || 4.5}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              Rating
                            </div>
                          </div>
                          <div>
                            <div className='text-xl font-bold text-primary'>
                              {course.lessons?.length || 0}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              Lessons
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar (for draft courses) */}
                        {course.status === 'draft' && (
                          <div>
                            <div className='flex items-center justify-between text-sm mb-2'>
                              <span className='text-muted-foreground'>
                                Course Completion
                              </span>
                              <span className='font-medium'>45%</span>
                            </div>
                            <Progress value={45} className='h-2' />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className='flex gap-2 pt-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex-1'
                            onClick={() => setSelectedCourse(course)}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Manage
                          </Button>
                          {course.status === 'draft' ? (
                            <Button
                              size='sm'
                              className='flex-1 bg-primary'
                              onClick={() => handlePublishCourse(course.id)}
                            >
                              <PlayCircle className='mr-2 h-4 w-4' />
                              Publish
                            </Button>
                          ) : (
                            <Button
                              size='sm'
                              variant='secondary'
                              className='flex-1'
                            >
                              <BarChart3 className='mr-2 h-4 w-4' />
                              Analytics
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Create New Course Card */}
                  <Card
                    className='border-2 border-dashed hover:border-primary transition-all duration-300 cursor-pointer group'
                    onClick={() => setShowCreateWizard(true)}
                  >
                    <CardContent className='flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8'>
                      <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                        <Plus className='w-10 h-10 text-primary' />
                      </div>
                      <h3 className='text-xl font-bold mb-2 group-hover:text-primary transition-colors'>
                        Create New Course
                      </h3>
                      <p className='text-muted-foreground mb-6'>
                        Share your expertise and start teaching today
                      </p>
                      <Button className='bg-primary'>
                        <Plus className='mr-2 h-4 w-4' />
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {courses.length === 0 && (
                  <Card className='p-12 text-center border-2 border-dashed'>
                    <div className='mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <BookOpen className='h-10 w-10 text-primary' />
                    </div>
                    <h3 className='text-2xl font-bold mb-2'>No courses yet</h3>
                    <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                      Create your first course and start sharing your knowledge
                      with students around the world
                    </p>
                    <Button
                      size='lg'
                      onClick={() => setShowCreateWizard(true)}
                      className='bg-primary'
                    >
                      <Plus className='mr-2 h-5 w-5' />
                      Create Your First Course
                    </Button>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value='published'>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {courses
                    .filter((c) => c.status === 'published')
                    .map((course) => (
                      <Card
                        key={course.id}
                        className='border-2 hover:border-primary/50 transition-all'
                      >
                        <CardHeader>
                          <CardTitle className='line-clamp-2'>
                            {course.title}
                          </CardTitle>
                          <CardDescription>
                            {course.enrollments || 0} students enrolled
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full'
                          >
                            <BarChart3 className='mr-2 h-4 w-4' />
                            View Analytics
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value='draft'>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {courses
                    .filter((c) => c.status === 'draft')
                    .map((course) => (
                      <Card
                        key={course.id}
                        className='border-2 hover:border-primary/50 transition-all'
                      >
                        <CardHeader>
                          <CardTitle className='line-clamp-2'>
                            {course.title}
                          </CardTitle>
                          <CardDescription>
                            Draft - Not published yet
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                          <div>
                            <div className='flex justify-between text-sm mb-2'>
                              <span className='text-muted-foreground'>
                                Completion
                              </span>
                              <span className='font-medium'>45%</span>
                            </div>
                            <Progress value={45} className='h-2' />
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              className='flex-1'
                              onClick={() => onNavigate('course', course)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Edit
                            </Button>
                            <Button
                              size='sm'
                              className='flex-1'
                              onClick={() => handlePublishCourse(course.id)}
                            >
                              <PlayCircle className='mr-2 h-4 w-4' />
                              Publish
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
