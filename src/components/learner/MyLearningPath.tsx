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

interface MyLearningPathProps {
  onNavigate: (page: string, data?: any) => void;
}

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
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
  };
}

export function MyLearningPath({ onNavigate }: MyLearningPathProps) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    loadEnrolledCourses();
  }, [user]);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchQuery, statusFilter, sortBy]);

  const loadEnrolledCourses = () => {
    try {
      // Get enrollments from localStorage
      const enrollmentsKey = `enrollments_${user?.id || 'guest'}`;
      const enrollments = JSON.parse(localStorage.getItem(enrollmentsKey) || '[]');

      // Mock course data (in real app, fetch from API)
      const mockCourses: EnrolledCourse[] = enrollments.map((enrollment: any, index: number) => {
        const completed = Math.floor(Math.random() * 10);
        const total = 10;
        const progress = (completed / total) * 100;
        
        return {
          id: enrollment.course_id,
          title: enrollment.course_title || `Course ${index + 1}`,
          description: enrollment.description || 'Learn the fundamentals and advanced concepts',
          category: enrollment.category || 'Science',
          level: enrollment.level || 'Intermediate',
          totalLessons: total,
          completedLessons: completed,
          enrolledDate: new Date(enrollment.enrolled_at || Date.now()),
          lastAccessed: enrollment.last_accessed ? new Date(enrollment.last_accessed) : undefined,
          estimatedTime: '12h 30m',
          rating: 4.8,
          instructor: 'Dr. Sarah Johnson',
          progress: progress,
          status: completed === 0 ? 'not-started' : completed === total ? 'completed' : 'in-progress',
          nextLesson: completed < total ? {
            id: `lesson-${completed + 1}`,
            title: `Lesson ${completed + 1}: Next Topic`
          } : undefined,
          thumbnail: enrollment.thumbnail
        };
      });

      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
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
      <div onClick={() => onNavigate('course-detail', { 
        category: 'science', // Default category
        subcategory: 'physics', // Default subcategory
        courseId: course.id 
      })}>
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
                  onNavigate('lesson', { 
                    lessonId: course.nextLesson!.id,
                    courseId: course.id 
                  });
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
                  onNavigate('course-detail', { 
                    category: 'science', // Default category
                    subcategory: 'physics', // Default subcategory
                    courseId: course.id 
                  });
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
                  onNavigate('course-detail', { 
                    category: 'science', // Default category
                    subcategory: 'physics', // Default subcategory
                    courseId: course.id 
                  });
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
                onNavigate('course-detail', { 
                  category: 'science', // Default category
                  subcategory: 'physics', // Default subcategory
                  courseId: course.id 
                });
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
      onClick={() => onNavigate('course-detail', { 
        category: 'science', // Default category
        subcategory: 'physics', // Default subcategory
        courseId: course.id 
      })}
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
                      onNavigate('lesson', { 
                        lessonId: course.nextLesson!.id,
                        courseId: course.id 
                      });
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
                      onNavigate('course-detail', { 
                        category: 'science', // Default category
                        subcategory: 'physics', // Default subcategory
                        courseId: course.id 
                      });
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