import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Target,
  Filter,
  Search,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Star,
  Calendar,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { coursesApi, enrollmentsApi, progressApi } from '../../utils/api-client';
import { toast } from 'sonner@2.0.3';

interface MyLearningPathProps {
  onNavigate: (page: string, data?: any) => void;
}

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  subcategory?: string | null;
  level: string;
  totalLessons: number;
  completedLessons: number;
  enrolledDate: Date;
  lastAccessed?: Date;
  estimatedTime: string;
  rating?: number;
  instructor: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  nextLesson?: {
    id: string;
    title: string;
    lesson: any;
  };
}

const formatLevel = (value?: string) => {
  if (!value) return 'Beginner';
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const getCourseImageUrl = (course: any) => {
  const attachment = course?.thumbnail ?? course?.cover_image;
  if (!attachment) return '';
  if (typeof attachment === 'string') {
    return /^https?:\/\//i.test(attachment) ? attachment : '';
  }
  return attachment.url ?? '';
};

const getEstimatedTime = (course: any) => {
  if (course?.total_duration_text) return String(course.total_duration_text);
  if (Number(course?.total_duration_minutes) > 0) {
    return `${Number(course.total_duration_minutes)}m`;
  }
  if (Number(course?.estimated_hours) > 0) {
    return `${Number(course.estimated_hours)}h`;
  }
  return '0m';
};

const getEnrollmentCourseId = (enrollment: any) =>
  String(enrollment?.course?.id ?? enrollment?.course_id ?? '');

const getSortedLessons = (course: any) => {
  const sections = Array.isArray(course?.sections) ? [...course.sections] : [];

  return sections
    .sort((a: any, b: any) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
    .flatMap((section: any, sectionIndex: number) => {
      const lessons = Array.isArray(section?.lessons) ? [...section.lessons] : [];

      return lessons
        .sort((a: any, b: any) => Number(a?.position ?? 0) - Number(b?.position ?? 0))
        .map((lesson: any, lessonIndex: number) => ({
          ...lesson,
          lessonIndex:
            typeof lesson?.lessonIndex === 'number'
              ? lesson.lessonIndex
              : typeof lesson?.position === 'number'
                ? lesson.position
                : sectionIndex * 1000 + lessonIndex,
        }));
    });
};

const navigateToCourseDetail = (
  onNavigate: (page: string, data?: any) => void,
  course: EnrolledCourse,
) => {
  onNavigate('course-detail', {
    category: course.category,
    subcategory: course.subcategory || 'general',
    courseId: course.id,
  });
};

const navigateToLesson = (
  onNavigate: (page: string, data?: any) => void,
  course: EnrolledCourse,
) => {
  if (!course.nextLesson) return;

  onNavigate('lesson', {
    lesson: course.nextLesson.lesson,
    course: {
      id: course.id,
      title: course.title,
      instructor: course.instructor,
    },
  });
};

export function MyLearningPath({ onNavigate }: MyLearningPathProps) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    void loadEnrolledCourses();
  }, [user]);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchQuery, statusFilter, sortBy]);

  const loadEnrolledCourses = async () => {
    if (!user) {
      setCourses([]);
      setFilteredCourses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const enrollments = await enrollmentsApi.getMy();

      const courseResults = await Promise.allSettled(
        (enrollments || []).map(async (enrollment: any) => {
          const courseId = getEnrollmentCourseId(enrollment);
          if (!courseId) return null;

          const enrollmentCourse = enrollment?.course ?? {};

          const [courseDetail, courseActivity] = await Promise.all([
            coursesApi.getById(courseId).catch(() => enrollmentCourse),
            coursesApi.getActivity(courseId).catch(() => null),
          ]);

          const lessons = getSortedLessons(courseDetail);
          const progressEntries = await Promise.all(
            lessons.map(async (lesson: any) => {
              try {
                const progressRecord = await progressApi.get(String(lesson.id));
                return [String(lesson.id), progressRecord] as const;
              } catch {
                return [String(lesson.id), null] as const;
              }
            }),
          );

          const progressByLessonId = new Map(progressEntries);
          const totalLessons =
            lessons.length ||
            Number(courseDetail?.total_lessons ?? enrollmentCourse?.total_lessons ?? 0);

          const totalPercent = lessons.reduce((sum, lesson) => {
            const record = progressByLessonId.get(String(lesson.id));
            return sum + Math.min(Number(record?.percent ?? 0), 100);
          }, 0);

          const completedLessons = lessons.filter((lesson) => {
            const record = progressByLessonId.get(String(lesson.id));
            return Boolean(record?.completed) || Number(record?.percent ?? 0) >= 100;
          }).length;

          const progress =
            totalLessons > 0
              ? Math.round(
                  lessons.length > 0
                    ? totalPercent / totalLessons
                    : Number(courseActivity?.progress ?? enrollment?.progress ?? 0),
                )
              : 0;

          const activityLesson = courseActivity?.lesson_id
            ? lessons.find((lesson) => String(lesson.id) === String(courseActivity.lesson_id))
            : undefined;
          const activityLessonProgress = activityLesson
            ? Number(
                progressByLessonId.get(String(activityLesson.id))?.percent ??
                  courseActivity?.progress ??
                  0,
              )
            : 0;
          const firstIncompleteLesson =
            lessons.find(
              (lesson) =>
                Number(progressByLessonId.get(String(lesson.id))?.percent ?? 0) < 100,
            ) ?? lessons[0];
          const targetLesson =
            activityLesson && activityLessonProgress < 100
              ? activityLesson
              : firstIncompleteLesson;

          const status: EnrolledCourse['status'] =
            totalLessons > 0 && completedLessons >= totalLessons
              ? 'completed'
              : progress > 0 || Boolean(courseActivity)
                ? 'in-progress'
                : 'not-started';

          return {
            id: courseId,
            title: courseDetail?.title ?? enrollmentCourse?.title ?? 'Untitled Course',
            description:
              courseDetail?.description ??
              enrollmentCourse?.description ??
              'Continue your learning journey.',
            thumbnail: getCourseImageUrl(courseDetail),
            category: courseDetail?.category ?? enrollmentCourse?.category ?? 'General',
            subcategory: courseDetail?.subcategory ?? enrollmentCourse?.subcategory ?? null,
            level: formatLevel(courseDetail?.level ?? enrollmentCourse?.level),
            totalLessons,
            completedLessons,
            enrolledDate: new Date(enrollment?.enrolled_at ?? enrollment?.created_at ?? Date.now()),
            lastAccessed: courseActivity?.last_accessed_at
              ? new Date(courseActivity.last_accessed_at)
              : enrollment?.last_accessed
                ? new Date(enrollment.last_accessed)
                : undefined,
            estimatedTime: getEstimatedTime(courseDetail),
            rating: Number(courseDetail?.rating ?? enrollmentCourse?.rating ?? 0),
            instructor:
              courseDetail?.creator?.full_name ??
              enrollmentCourse?.creator?.full_name ??
              'Instructor',
            progress,
            status,
            nextLesson:
              targetLesson && status !== 'completed'
                ? {
                    id: String(targetLesson.id),
                    title: targetLesson.title ?? 'Continue lesson',
                    lesson: targetLesson,
                  }
                : undefined,
          } satisfies EnrolledCourse;
        }),
      );

      const loadedCourses = courseResults
        .filter(
          (result): result is PromiseFulfilledResult<EnrolledCourse | null> =>
            result.status === 'fulfilled',
        )
        .map((result) => result.value)
        .filter((course): course is EnrolledCourse => Boolean(course));

      setCourses(loadedCourses);
      setFilteredCourses(loadedCourses);
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      toast.error('Failed to load your learning path');
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0);
        case 'progress':
          return b.progress - a.progress;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'enrolled':
          return b.enrolledDate.getTime() - a.enrolledDate.getTime();
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  };

  const stats = {
    total: courses.length,
    inProgress: courses.filter(c => c.status === 'in-progress').length,
    completed: courses.filter(c => c.status === 'completed').length,
    notStarted: courses.filter(c => c.status === 'not-started').length,
    totalProgress: courses.length > 0 
      ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
      : 0
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Learning Path</h1>
        <p className="text-muted-foreground">
          Track your progress and continue your learning journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Courses</CardDescription>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled in total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>In Progress</CardDescription>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Completed</CardDescription>
              <Award className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Finished courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Overall Progress</CardDescription>
              <Target className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <BarChart3 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Accessed</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="enrolled">Enrollment Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Courses List */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-2">No courses found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Start your learning journey by enrolling in courses'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={() => onNavigate('catalog')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-3">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-2">No courses found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Start your learning journey by enrolling in courses'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={() => onNavigate('catalog')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map(course => (
              <CourseListItem
                key={course.id}
                course={course}
                onNavigate={onNavigate}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Course Card Component for Grid View
function CourseCard({ course, onNavigate }: { course: EnrolledCourse; onNavigate: (page: string, data?: any) => void }) {
  const statusConfig = {
    'not-started': { label: 'Not Started', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: Circle },
    'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Play },
    'completed': { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2 }
  };

  const config = statusConfig[course.status];
  const StatusIcon = config.icon;

  return (
    <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
      <div onClick={() => navigateToCourseDetail(onNavigate, course)}>
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary/30" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={config.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
            {course.rating && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{course.rating}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{Math.round(course.progress)}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {course.completedLessons} of {course.totalLessons} lessons completed
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.estimatedTime}
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            {course.status !== 'completed' && course.nextLesson ? (
              <Button 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToLesson(onNavigate, course);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Continue
              </Button>
            ) : course.status === 'completed' ? (
              <Button 
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToCourseDetail(onNavigate, course);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Review
              </Button>
            ) : (
              <Button 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToCourseDetail(onNavigate, course);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCourseDetail(onNavigate, course);
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Course List Item Component for List View
function CourseListItem({ course, onNavigate }: { course: EnrolledCourse; onNavigate: (page: string, data?: any) => void }) {
  const statusConfig = {
    'not-started': { label: 'Not Started', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: Circle },
    'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Play },
    'completed': { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2 }
  };

  const config = statusConfig[course.status];
  const StatusIcon = config.icon;

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigateToCourseDetail(onNavigate, course)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 overflow-hidden">
            {course.thumbnail ? (
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge className={`text-xs ${config.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <h3 className="font-semibold text-base line-clamp-1 hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {course.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {course.status !== 'completed' && course.nextLesson ? (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToLesson(onNavigate, course);
                    }}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Continue
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToCourseDetail(onNavigate, course);
                    }}
                  >
                    View Course
                  </Button>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={course.progress} className="h-1.5" />
              </div>
              <span className="text-sm font-medium text-primary whitespace-nowrap">
                {Math.round(course.progress)}%
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {course.completedLessons}/{course.totalLessons} lessons
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.estimatedTime}
              </div>
              {course.lastAccessed && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Last accessed {formatDate(course.lastAccessed)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}