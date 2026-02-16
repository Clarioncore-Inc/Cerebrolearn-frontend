import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Play, Clock, BookOpen, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ContinueLearningWidgetProps {
  onNavigate: (page: string, data?: any) => void;
}

interface LastActivity {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  progress: number;
  thumbnail?: string;
  lastAccessed: Date;
  totalLessons: number;
  completedLessons: number;
  estimatedTimeLeft: string;
}

export function ContinueLearningWidget({ onNavigate }: ContinueLearningWidgetProps) {
  const { user } = useAuth();
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLastActivity();
  }, [user]);

  const loadLastActivity = () => {
    try {
      // Get from localStorage - use the same key as CourseDetailPage
      const activityKey = `learning_activity_${user?.id || 'guest'}`;
      const stored = localStorage.getItem(activityKey);
      
      if (stored) {
        const activity = JSON.parse(stored);
        activity.lastAccessed = new Date(activity.lastAccessed);
        
        // Convert to LastActivity format if needed
        setLastActivity({
          courseId: activity.courseId,
          courseTitle: activity.courseTitle,
          lessonId: activity.lessonId,
          lessonTitle: activity.lessonTitle,
          progress: activity.progress || 0,
          lastAccessed: new Date(activity.lastAccessed),
          totalLessons: 10,
          completedLessons: 0,
          estimatedTimeLeft: '5h 30m'
        });
      } else {
        // If no activity, check enrollments and suggest first incomplete course
        const enrollmentsKey = `enrollments_${user?.id || 'guest'}`;
        const enrollments = JSON.parse(localStorage.getItem(enrollmentsKey) || '[]');
        
        if (enrollments.length > 0) {
          const firstEnrollment = enrollments[0];
          setLastActivity({
            courseId: firstEnrollment.course_id,
            courseTitle: firstEnrollment.course_title || 'Your Course',
            lessonId: 'lesson-1',
            lessonTitle: 'Introduction',
            progress: 0,
            lastAccessed: new Date(),
            totalLessons: 10,
            completedLessons: 0,
            estimatedTimeLeft: '5h 30m'
          });
        }
      }
    } catch (error) {
      console.error('Error loading last activity:', error);
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

      // Create lesson data for the player
      const lessonData = {
        id: lastActivity.lessonId,
        title: lastActivity.lessonTitle,
        type: 'video',
        duration: '15 min',
        content: {
          title: lastActivity.lessonTitle,
          duration: '15 min',
          description: `${lastActivity.lessonTitle} from ${lastActivity.courseTitle}`,
          videoUrl: '', // Will be handled by the player
        }
      };
      
      // Navigate to lesson with proper data structure
      onNavigate('lesson', {
        lesson: lessonData,
        course: {
          id: lastActivity.courseId,
          title: lastActivity.courseTitle,
          instructor: 'Instructor'
        }
      });
    }
  };

  const handleStartFromBeginning = () => {
    if (lastActivity) {
      // Navigate to course detail page to start from the beginning
      onNavigate('course-detail', { 
        category: 'science', // Default category
        subcategory: 'physics', // Default subcategory
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
            Start Your Learning Journey
          </CardTitle>
          <CardDescription>
            Browse the course catalog and enroll in your first course
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

  const progressPercent = (lastActivity.completedLessons / lastActivity.totalLessons) * 100;

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