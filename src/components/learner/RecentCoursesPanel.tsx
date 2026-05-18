import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { enrollmentsApi } from '../../utils/api-client';
import { 
  BookOpen, 
  Clock, 
  Star, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Progress } from '../ui/progress';

interface RecentCoursesPanelProps {
  onNavigate: (page: string, data?: any) => void;
  maxItems?: number;
}

interface RecentCourse {
  id: string;
  title: string;
  thumbnail?: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: Date;
  rating?: number;
  category?: string;
  level?: string;
  subcategory?: string;
}

export function RecentCoursesPanel({ onNavigate, maxItems = 5 }: RecentCoursesPanelProps) {
  const { user } = useAuth();
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadRecentCourses();
  }, [user]);

  const getCourseImageUrl = (course: any) => {
    const attachment = course?.cover_image ?? course?.thumbnail;
    if (!attachment) return '';
    if (typeof attachment === 'string') {
      return /^https?:\/\//i.test(attachment) ? attachment : '';
    }
    return attachment.url ?? '';
  };

  const loadRecentCourses = async () => {
    if (!user) {
      setRecentCourses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const enrollments = await enrollmentsApi.getMy();

      const recent = (enrollments || [])
        .map((enrollment: any) => {
          const course = enrollment.course;
          if (!course?.id) return null;

          const totalLessons = Number(
            course.total_lessons ??
              course.lessons?.length ??
              course.sections?.reduce(
                (sum: number, section: any) => sum + (section.lessons?.length || 0),
                0,
              ) ??
              0,
          );
          const progress = Number(enrollment.progress ?? 0);
          const completedLessons = Math.round((progress / 100) * totalLessons);

          return {
            id: course.id,
            title: course.title,
            lastAccessed: new Date(
              enrollment.last_accessed ?? enrollment.enrolled_at ?? enrollment.created_at,
            ),
            progress,
            totalLessons,
            completedLessons,
            thumbnail: getCourseImageUrl(course),
            rating: Number(course.rating ?? 0),
            category: course.category,
            level: course.level,
            subcategory: course.subcategory,
          };
        })
        .filter(Boolean)
        .sort(
          (a: any, b: any) =>
            new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime(),
        )
        .slice(0, maxItems);

      setRecentCourses(recent as RecentCourse[]);
    } catch (error) {
      console.error('Error loading recent courses:', error);
      setRecentCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recentCourses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-3">No recent courses yet</p>
            <Button 
              onClick={() => onNavigate('catalog')}
              variant="outline"
              size="sm"
            >
              Browse Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Courses
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('my-learning-path')}
            className="text-xs"
          >
            View All
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] -mx-2 px-2">
          <div className="space-y-3">
            {recentCourses.map((course, index) => (
              (() => {
                const progressPercent =
                  course.totalLessons > 0
                    ? (course.completedLessons / course.totalLessons) * 100
                    : Number(course.progress ?? 0);

                return (
              <div
                key={course.id}
                className="group relative p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => onNavigate('course-detail', { 
                  category: course.category || 'general',
                  subcategory: course.subcategory || 'general',
                  courseId: course.id 
                })}
              >
                {/* New badge for recently accessed */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recent
                    </Badge>
                  </div>
                )}

                <div className="flex gap-3">
                  {/* Thumbnail */}
                  {course.thumbnail ? (
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                  )}

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    
                    {/* Meta info */}
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {course.category}
                        </Badge>
                      )}
                      {course.rating && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <Progress 
                        value={progressPercent} 
                        className="h-1.5"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="text-primary font-medium">
                          {Math.round(progressPercent)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('course-detail', { 
                        category: course.category || 'general',
                        subcategory: course.subcategory || 'general',
                        courseId: course.id 
                      });
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Last accessed */}
                <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Accessed {formatTimeAgo(course.lastAccessed)}</span>
                  {course.completedLessons === course.totalLessons && (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                      <Award className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
                );
              })()
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}