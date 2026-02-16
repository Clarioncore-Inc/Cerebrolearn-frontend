import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiCall } from '../../utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
  GitCompare
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface CourseDetailProps {
  course: any;
  onNavigate: (page: string, data?: any) => void;
  category?: string;
  subcategory?: string;
  courseId?: string;
}

export function CourseDetail({ course, onNavigate, category, subcategory, courseId }: CourseDetailProps) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCourseDetails();
  }, [course.id]);

  const loadCourseDetails = async () => {
    try {
      const courseData = await apiCall(`/courses/${course.id}`);
      setLessons(courseData.lessons || []);

      if (user) {
        try {
          const enrollmentsData = await apiCall('/enrollments');
          const existingEnrollment = enrollmentsData.enrollments?.find(
            (e: any) => e.course_id === course.id
          );
          setEnrollment(existingEnrollment || null);
        } catch (error) {
          console.error('Error checking enrollment:', error);
        }
      }
    } catch (error) {
      console.error('Error loading course details:', error);
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
      const result = await apiCall('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ course_id: course.id }),
      });
      setEnrollment(result.enrollment);
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
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{course.category || 'General'}</Badge>
              <Badge variant="secondary">{course.level || 'All Levels'}</Badge>
            </div>
            <h1 className="mb-4">{course.title}</h1>
            <p className="text-muted-foreground text-lg">
              {course.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-muted-foreground">(248 reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{course.enrollments || 0} students enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{lessons.length * 15} minutes total</span>
            </div>
          </div>

          {enrollment && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Your Progress</span>
                  <span className="font-medium">{enrollment.progress || 0}%</span>
                </div>
                <Progress value={enrollment.progress || 0} className="h-2" />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-24">
            <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Play className="h-20 w-20 text-white/80" />
            </div>
            <CardContent className="p-6 space-y-4">
              {enrollment ? (
                <>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => lessons.length > 0 && handleStartLesson(lessons[0])}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {lessons.length} lessons available
                  </p>
                </>
              ) : (
                <>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
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

              <div className="space-y-3">
                <h4>This course includes:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {lessons.length} interactive lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Hands-on exercises
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Quizzes and assessments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Lifetime access
                  </li>
                </ul>
              </div>

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  addToComparison(course);
                  // Trigger re-render by dispatching storage event
                  window.dispatchEvent(new Event('storage'));
                }}
                disabled={isInComparison(course.id)}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                {isInComparison(course.id) ? 'Added to Comparison' : 'Add to Comparison'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              <CardDescription>
                {lessons.length} lessons designed for progressive learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleStartLesson(lesson)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {lesson.kind}
                          </Badge>
                          <span className="text-xs text-muted-foreground">15 min</span>
                        </div>
                      </div>
                    </div>
                    {enrollment ? (
                      <Play className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Course content is being prepared
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2">What you'll learn</h4>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Master the fundamentals through interactive exercises</li>
                  <li>Build real-world projects to apply your knowledge</li>
                  <li>Develop problem-solving skills with guided practice</li>
                  <li>Gain confidence through step-by-step progression</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2">Requirements</h4>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>No prior experience required</li>
                  <li>A computer with internet access</li>
                  <li>Dedication to practice regularly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <CardDescription>See what others are saying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-medium">Student {i}</span>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-muted-foreground">
                    Excellent course! The interactive approach really helped me understand the concepts better.
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