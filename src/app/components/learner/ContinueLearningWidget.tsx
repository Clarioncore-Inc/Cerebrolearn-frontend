import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Play, Clock, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { coursesApi, enrollmentsApi } from '../../utils/api-client';

interface ContinueLearningWidgetProps {
  onNavigate: (page: string, data?: any) => void;
}

interface LastActivity {
  courseId: string;
  courseTitle: string;
  courseCategory?: string;
  courseSubcategory?: string;
  lessonId: string;
  lessonTitle: string;
  progress: number;
  thumbnail?: string;
  lastAccessed: Date;
  totalLessons: number;
  completedLessons: number;
  estimatedTimeLeft: string;
  lessonData: any | null;
  courseData: any;
}

export function ContinueLearningWidget({ onNavigate }: ContinueLearningWidgetProps) {
  const { user } = useAuth();
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);
  const [hasEnrollments, setHasEnrollments] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadLastActivity();
  }, [user]);

  const getCourseImageUrl = (course: any) => {
    const attachment = course?.cover_image ?? course?.thumbnail;
    if (!attachment) return undefined;
    if (typeof attachment === 'string') {
      return /^https?:\/\//i.test(attachment) ? attachment : undefined;
    }
    return attachment.url ?? undefined;
  };

  const getCourseLessons = (course: any) =>
    course?.lessons ||
    course?.sections?.flatMap((section: any) => section.lessons || []) ||
    [];

  const buildLastActivity = (
    course: any,
    lesson: any,
    progress: number,
    lastAccessedAt: string,
  ): LastActivity => {
    const totalLessons = Number(course?.total_lessons ?? getCourseLessons(course).length ?? 0);
    const boundedProgress = Math.max(0, Math.min(100, Number(progress ?? 0)));

    return {
      courseId: course.id,
      courseTitle: course.title || 'Your Course',
      courseCategory: course.category,
      courseSubcategory: course.subcategory,
      lessonId: lesson?.id || 'lesson-1',
      lessonTitle: lesson?.title || 'Introduction',
      progress: boundedProgress,
      thumbnail: getCourseImageUrl(course),
      lastAccessed: new Date(lastAccessedAt),
      totalLessons,
      completedLessons:
        totalLessons > 0 ? Math.round((boundedProgress / 100) * totalLessons) : 0,
      estimatedTimeLeft: course?.total_duration_text || course?.duration || '0m',
      lessonData: lesson || null,
      courseData: course,
    };
  };

  const loadLastActivity = async () => {
    try {
      if (!user) {
        setHasEnrollments(false);
        setLastActivity(null);
        return;
      }

      const enrollments = await enrollmentsApi.getMy();

      setHasEnrollments(enrollments.length > 0);

      if (enrollments.length === 0) {
        setLastActivity(null);
        return;
      }

      const activities = await Promise.all(
        enrollments.map(async (enrollment: any) => {
          const courseId = enrollment.course?.id ?? enrollment.course_id;
          if (!courseId) return null;

          try {
            const activity = await coursesApi.getActivity(courseId);
            return { enrollment, activity };
          } catch {
            return null;
          }
        }),
      );

      const latestActivity = activities
        .filter(Boolean)
        .sort(
          (a: any, b: any) =>
            new Date(b.activity.last_accessed_at).getTime() -
            new Date(a.activity.last_accessed_at).getTime(),
        )[0] as any;

      if (latestActivity) {
        const summaryCourse = latestActivity.enrollment.course || {};
        const courseDetail = await coursesApi
          .getById(summaryCourse.id)
          .catch(() => summaryCourse);
        const lesson = getCourseLessons(courseDetail).find(
          (item: any) => String(item.id) === String(latestActivity.activity.lesson_id),
        );

        setLastActivity(
          buildLastActivity(
            courseDetail,
            lesson,
            latestActivity.activity.progress,
            latestActivity.activity.last_accessed_at,
          ),
        );
        return;
      }

      const firstEnrollment = enrollments[0];
      const summaryCourse = firstEnrollment.course || {};
      const courseDetail = summaryCourse?.id
        ? await coursesApi.getById(summaryCourse.id).catch(() => summaryCourse)
        : summaryCourse;
      const firstLesson = getCourseLessons(courseDetail)[0] || null;

      if (summaryCourse?.id) {
        setLastActivity(
          buildLastActivity(
            courseDetail,
            firstLesson,
            firstEnrollment.progress ?? 0,
            firstEnrollment.last_accessed ??
              firstEnrollment.enrolled_at ??
              firstEnrollment.created_at ??
              new Date().toISOString(),
          ),
        );
      } else {
        setLastActivity(null);
      }
    } catch (error) {
      console.error('Error loading last activity:', error);
      setLastActivity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (lastActivity) {
      // Save navigation event
      const historyKey = `learningHistory_${user?.id || 'guest'}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      history.unshift({
        courseId: lastActivity.courseId,
        courseTitle: lastActivity.courseTitle,
        lessonId: lastActivity.lessonId,
        lessonTitle: lastActivity.lessonTitle,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));

      if (lastActivity.lessonData) {
        onNavigate('lesson', {
          lesson: lastActivity.lessonData,
          course: lastActivity.courseData,
        });
        return;
      }

      onNavigate('course-detail', {
        category: lastActivity.courseCategory || 'general',
        subcategory: lastActivity.courseSubcategory || 'general',
        courseId: lastActivity.courseId,
      });
    }
  };

  const handleStartFromBeginning = () => {
    if (lastActivity) {
      // Navigate to course detail page to start from the beginning
      onNavigate('course-detail', { 
        category: lastActivity.courseCategory || 'general',
        subcategory: lastActivity.courseSubcategory || 'general',
        courseId: lastActivity.courseId 
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!lastActivity) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            {hasEnrollments ? 'Keep Learning' : 'Start Your Learning Journey'}
          </CardTitle>
          <CardDescription>
            {hasEnrollments
              ? 'Browse your learning path or explore the course catalog'
              : 'Browse the course catalog and enroll in your first course'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => onNavigate('catalog')}
            className="w-full"
            size="lg"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Explore Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = Math.max(0, Math.min(100, Number(lastActivity.progress ?? 0)));

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Continue Learning</CardTitle>
            </div>
            <CardDescription>Pick up where you left off</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            <TrendingUp className="w-3 h-3 mr-1" />
            {Math.round(progressPercent)}% Complete
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Info */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            {lastActivity.thumbnail && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={lastActivity.thumbnail} 
                  alt={lastActivity.courseTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                {lastActivity.courseTitle}
              </h4>
              <p className="font-medium text-base line-clamp-2">
                {lastActivity.lessonTitle}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {lastActivity.completedLessons} of {lastActivity.totalLessons} lessons
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastActivity.estimatedTimeLeft} left
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {lastActivity.progress > 0 && `${lastActivity.progress}% of current lesson completed`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleContinue}
            className="flex-1"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
          <Button
            onClick={handleStartFromBeginning}
            variant="outline"
            size="lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Last accessed info */}
        <p className="text-xs text-center text-muted-foreground">
          Last accessed {formatLastAccessed(lastActivity.lastAccessed)}
        </p>
      </CardContent>
    </Card>
  );
}

function formatLastAccessed(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}