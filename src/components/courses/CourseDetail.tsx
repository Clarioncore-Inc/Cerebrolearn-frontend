import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { coursesApi, enrollmentsApi } from '../../utils/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { addToComparison, isInComparison } from './CompareCoursesButton';
import {
  BookOpen,
  Play,
  Star,
  Users,
  Clock,
  CheckCircle2,
  Lock,
  Award,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Share2,
  Download,
  Globe,
  BarChart,
  GitCompare,
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface CourseDetailProps {
  course: any;
  onNavigate: (page: string, data?: any) => void;
  category?: string;
  subcategory?: string;
  courseId?: string;
}

const matchesEnrollmentCourse = (enrollment: any, targetCourseId: string) => {
  const enrolledCourseId =
    enrollment?.course_id ?? enrollment?.courseId ?? enrollment?.course?.id ?? null;
  return String(enrolledCourseId) === String(targetCourseId);
};

const formatCourseDuration = (course: any, lessons: any[]) => {
  if (course?.total_duration_text) return course.total_duration_text;
  if (Number(course?.total_duration_minutes) > 0) {
    return `${Number(course.total_duration_minutes)}m`;
  }
  if (Number(course?.estimated_hours) > 0) {
    return `${Number(course.estimated_hours)}h`;
  }
  const fallbackMinutes = lessons.length * 15;
  return fallbackMinutes > 0 ? `${fallbackMinutes}m` : '0h';
};

const buildCourseIncludes = (course: any, lessons: any[]) => {
  const interactiveCount = lessons.filter((lesson: any) =>
    ['quiz', 'exercise', 'project', 'assignment', 'interactive'].includes(
      String(lesson?.type || '').toLowerCase(),
    ),
  ).length;

  return [
    formatCourseDuration(course, lessons) !== '0h'
      ? `${formatCourseDuration(course, lessons)} total content`
      : null,
    lessons.length > 0 ? `${lessons.length} lesson${lessons.length === 1 ? '' : 's'}` : null,
    interactiveCount > 0
      ? `${interactiveCount} interactive activit${interactiveCount === 1 ? 'y' : 'ies'}`
      : null,
    course?.enable_discussions ? 'Discussions enabled' : null,
    course?.enable_reviews ? 'Course reviews enabled' : null,
    course?.enable_certificates ? 'Certificate of completion' : null,
  ].filter(Boolean) as string[];
};

export function CourseDetail({
  course,
  onNavigate,
  category,
  subcategory,
  courseId,
}: CourseDetailProps) {
  const { user } = useAuth();
  const [courseDetails, setCourseDetails] = useState<any>(course);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  useEffect(() => {
    loadCourseDetails();
  }, [course.id, user?.id]);

  const loadCourseDetails = async () => {
    setLoading(true);
    setCheckingEnrollment(!!user);
    try {
      const courseData = await coursesApi.getById(course.id);
      setCourseDetails(courseData);
      setLessons(
        courseData.lessons ||
          courseData.sections?.flatMap((section: any) => section.lessons || []) ||
          [],
      );

      if (user) {
        try {
          const enrollmentsData = await enrollmentsApi.getMy();
          const existingEnrollment = enrollmentsData.find(
            (e: any) => matchesEnrollmentCourse(e, course.id),
          );
          setEnrollment(existingEnrollment || null);
        } catch (error) {
          console.error('Error checking enrollment:', error);
        } finally {
          setCheckingEnrollment(false);
        }
      } else {
        setEnrollment(null);
        setCheckingEnrollment(false);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
      setCheckingEnrollment(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentsApi.enroll(course.id);

      const enrollmentsData = await enrollmentsApi.getMy();
      const existingEnrollment = enrollmentsData.find(
        (e: any) => matchesEnrollmentCourse(e, course.id),
      );
      setEnrollment(existingEnrollment || null);
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLesson = (lesson: any) => {
    if (!enrollment) {
      handleEnroll();
      return;
    }
    onNavigate('lesson', { lesson, course });
  };

  return (
    <div className='container py-8 space-y-8'>
      {/* Hero Section */}
      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Badge>{course.category || 'General'}</Badge>
              <Badge variant='secondary'>{course.level || 'All Levels'}</Badge>
            </div>
            <h1 className='mb-4'>{course.title}</h1>
            <p className='text-muted-foreground text-lg'>
              {course.description}
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
              <span className='font-medium'>
                {course.rating?.toFixed(1) || '4.5'}
              </span>
              <span className='text-muted-foreground'>(248 reviews)</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='h-5 w-5 text-muted-foreground' />
              <span>{course.enrollments || 0} students enrolled</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-muted-foreground' />
              <span>{formatCourseDuration(courseDetails, lessons)} total</span>
            </div>
          </div>

          {enrollment && (
            <Card className='bg-primary/5 border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium'>Your Progress</span>
                  <span className='font-medium'>
                    {enrollment.progress || 0}%
                  </span>
                </div>
                <Progress value={enrollment.progress || 0} className='h-2' />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className='sticky top-24'>
            <div className='aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
              <Play className='h-20 w-20 text-white/80' />
            </div>
            <CardContent className='p-6 space-y-4'>
              {checkingEnrollment ? (
                <Button className='w-full' size='lg' disabled>
                  Checking enrollment...
                </Button>
              ) : enrollment ? (
                <>
                  <Button
                    className='w-full'
                    size='lg'
                    onClick={() =>
                      lessons.length > 0 && handleStartLesson(lessons[0])
                    }
                  >
                    <Play className='mr-2 h-5 w-5' />
                    {enrollment.progress > 0
                      ? 'Continue Learning'
                      : 'Start Course'}
                  </Button>
                  <p className='text-center text-sm text-muted-foreground'>
                    {lessons.length} lessons available
                  </p>
                </>
              ) : (
                <>
                  <Button
                    className='w-full'
                    size='lg'
                    onClick={handleEnroll}
                    disabled={enrolling || loading}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                  {!user && (
                    <Alert>
                      <AlertDescription>
                        Sign in to enroll in this course
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              <Separator />

              <div className='space-y-3'>
                <h4>This course includes:</h4>
                <ul className='space-y-2 text-sm'>
                  {buildCourseIncludes(courseDetails, lessons).map((item) => (
                    <li key={item} className='flex items-center gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-500' />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <Button
                variant='outline'
                className='w-full'
                onClick={() => {
                  addToComparison(course);
                  // Trigger re-render by dispatching storage event
                  window.dispatchEvent(new Event('storage'));
                }}
                disabled={isInComparison(course.id)}
              >
                <GitCompare className='h-4 w-4 mr-2' />
                {isInComparison(course.id)
                  ? 'Added to Comparison'
                  : 'Add to Comparison'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <Tabs defaultValue='curriculum' className='w-full'>
        <TabsList>
          <TabsTrigger value='curriculum'>Curriculum</TabsTrigger>
          <TabsTrigger value='about'>About</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value='curriculum' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              <CardDescription>
                {lessons.length} lessons designed for progressive learning
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className='flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer'
                    onClick={() => handleStartLesson(lesson)}
                  >
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm'>
                        {index + 1}
                      </div>
                      <div>
                        <p className='font-medium'>{lesson.title}</p>
                        <div className='flex items-center gap-2 mt-1'>
                          <Badge variant='outline' className='text-xs'>
                            {lesson.kind}
                          </Badge>
                          <span className='text-xs text-muted-foreground'>
                            15 min
                          </span>
                        </div>
                      </div>
                    </div>
                    {enrollment ? (
                      <Play className='h-5 w-5 text-muted-foreground' />
                    ) : (
                      <Lock className='h-5 w-5 text-muted-foreground' />
                    )}
                  </div>
                ))
              ) : (
                <p className='text-center text-muted-foreground py-8'>
                  Course content is being prepared
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='about' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h4 className='mb-2'>What you'll learn</h4>
                <ul className='space-y-2 list-disc list-inside text-muted-foreground'>
                  <li>Master the fundamentals through interactive exercises</li>
                  <li>Build real-world projects to apply your knowledge</li>
                  <li>Develop problem-solving skills with guided practice</li>
                  <li>Gain confidence through step-by-step progression</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className='mb-2'>Requirements</h4>
                <ul className='space-y-2 list-disc list-inside text-muted-foreground'>
                  <li>No prior experience required</li>
                  <li>A computer with internet access</li>
                  <li>Dedication to practice regularly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='reviews' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <CardDescription>See what others are saying</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='border-b last:border-0 pb-4 last:pb-0'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className='h-4 w-4 fill-yellow-400 text-yellow-400'
                        />
                      ))}
                    </div>
                    <span className='font-medium'>Student {i}</span>
                    <span className='text-sm text-muted-foreground'>
                      2 days ago
                    </span>
                  </div>
                  <p className='text-muted-foreground'>
                    Excellent course! The interactive approach really helped me
                    understand the concepts better.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
