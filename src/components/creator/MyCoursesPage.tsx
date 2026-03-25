import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  Star,
  Edit,
  BarChart3,
  PlayCircle,
  MoreVertical,
  Trash2,
  Copy,
  Share2,
  Settings,
  Download,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  Grid3x3,
  List,
  Eye,
  DollarSign,
  Clock,
  TrendingUp,
  Heart,
  Bookmark,
  UserCheck,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
} from 'lucide-react';
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
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { creatorApi, coursesApi } from '../../utils/api-client';
import svgPaths from '../../imports/svg-1fzm63qep0';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface MyCoursesPageProps {
  onNavigate: (page: string, data?: any) => void;
  onCreateCourse?: () => void;
}

export function MyCoursesPage({
  onNavigate,
  onCreateCourse,
}: MyCoursesPageProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'revenue'>(
    'recent',
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'published' | 'draft'
  >('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedCourseForShare, setSelectedCourseForShare] =
    useState<any>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // Fetch creator's courses (both published and draft)
      const data = await creatorApi.getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Mock data for demo
      setCourses([
        {
          id: '1',
          title: 'Complete React Development Course',
          description: 'Master React from basics to advanced concepts',
          status: 'published',
          level: 'Intermediate',
          category: 'Technology',
          price: 49.99,
          enrollments: 1250,
          rating: 4.9,
          reviews: 324,
          revenue: 62487.5,
          lessons: 48,
          duration: '12 hours',
          lastUpdated: '2 days ago',
          completion: 100,
        },
        {
          id: '2',
          title: 'Advanced TypeScript Patterns',
          description: 'Learn advanced TypeScript patterns and best practices',
          status: 'published',
          level: 'Advanced',
          category: 'Technology',
          price: 39.99,
          enrollments: 890,
          rating: 4.8,
          reviews: 201,
          revenue: 35591.1,
          lessons: 36,
          duration: '8 hours',
          lastUpdated: '5 days ago',
          completion: 100,
        },
        {
          id: '3',
          title: 'Web Development Bootcamp 2024',
          description: 'Complete web development course from scratch',
          status: 'draft',
          level: 'Beginner',
          category: 'Technology',
          price: 79.99,
          enrollments: 0,
          rating: 0,
          reviews: 0,
          revenue: 0,
          lessons: 24,
          duration: '6 hours',
          lastUpdated: '1 day ago',
          completion: 65,
        },
        {
          id: '4',
          title: 'UI/UX Design Masterclass',
          description: 'Learn modern UI/UX design principles',
          status: 'published',
          level: 'Intermediate',
          category: 'Design',
          price: 59.99,
          enrollments: 567,
          rating: 4.7,
          reviews: 142,
          revenue: 34014.33,
          lessons: 32,
          duration: '10 hours',
          lastUpdated: '1 week ago',
          completion: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await coursesApi.update(courseId, { status: 'published' } as any);
      toast.success('Course published successfully! 🎉');
      loadCourses();
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this course? This action cannot be undone.',
      )
    )
      return;

    try {
      await coursesApi.delete(courseId);
      toast.success('Course deleted successfully');
      loadCourses();
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
      loadCourses();
    } catch (error) {
      console.error('Error duplicating course:', error);
      toast.error('Failed to duplicate course');
    }
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      if (filterStatus !== 'all' && course.status !== filterStatus)
        return false;
      if (
        searchQuery &&
        !course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular')
        return (b.enrollments || 0) - (a.enrollments || 0);
      if (sortBy === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
      return 0; // recent - default order
    });

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.status === 'published').length,
    draft: courses.filter((c) => c.status === 'draft').length,
    totalStudents: courses.reduce((sum, c) => sum + (c.enrollments || 0), 0),
    totalRevenue: courses.reduce((sum, c) => sum + (c.revenue || 0), 0),
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-bold gradient-text mb-2'>My Courses</h1>
          <p className='text-lg text-muted-foreground'>
            Manage and track all your courses in one place
          </p>
        </div>
        <Button
          size='lg'
          className='bg-primary hover:bg-primary/90 transition-colors'
          onClick={onCreateCourse}
        >
          <Plus className='mr-2 h-5 w-5' />
          Create New Course
        </Button>
      </div>

      {/* Quick Stats */}
      <div className='grid gap-4 md:grid-cols-5'>
        <Card className='border-2 hover:border-primary/50 transition-colors shadow-none hover:shadow-md'>
          <CardContent className='p-6 p-[24px]'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>
                  Total Courses
                </p>
                <p className='text-2xl font-bold'>{stats.total}</p>
              </div>
              <BookOpen className='w-10 h-10 text-purple-500 opacity-50' />
            </div>
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>Published</p>
              <p className='text-2xl font-bold text-green-600'>
                {stats.published}
              </p>
            </div>
            <CheckCircle2 className='w-10 h-10 text-green-500 opacity-50' />
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-yellow-200 dark:border-yellow-800'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>Drafts</p>
              <p className='text-2xl font-bold text-yellow-600'>
                {stats.draft}
              </p>
            </div>
            <AlertCircle className='w-10 h-10 text-yellow-500 opacity-50' />
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>
                Total Students
              </p>
              <p className='text-2xl font-bold text-blue-600'>
                {stats.totalStudents.toLocaleString()}
              </p>
            </div>
            <Users className='w-10 h-10 text-blue-500 opacity-50' />
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>
                Total Revenue
              </p>
              <p className='text-2xl font-bold text-emerald-600'>
                ${(stats.totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <DollarSign className='w-10 h-10 text-emerald-500 opacity-50' />
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className='border-2 shadow-none hover:shadow-md transition-all'>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
            {/* Search */}
            <div className='flex-1 relative w-full'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search courses...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10'
              />
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-full md:w-auto'>
                  <SortAsc className='mr-2 h-4 w-4' />
                  Sort:{' '}
                  {sortBy === 'recent'
                    ? 'Recent'
                    : sortBy === 'popular'
                      ? 'Popular'
                      : 'Revenue'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('popular')}>
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('revenue')}>
                  Highest Revenue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode */}
            <div className='flex gap-2 w-full md:w-auto justify-end'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size='icon'
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size='icon'
                onClick={() => setViewMode('list')}
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <Tabs
        value={filterStatus}
        onValueChange={(v) => setFilterStatus(v as any)}
      >
        <TabsList>
          <TabsTrigger value='all'>All Courses ({stats.total})</TabsTrigger>
          <TabsTrigger value='published'>
            Published ({stats.published})
          </TabsTrigger>
          <TabsTrigger value='draft'>Drafts ({stats.draft})</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className='mt-6'>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className='group overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 bg-white border hover:-translate-y-1 cursor-pointer'
                  onClick={() =>
                    onNavigate('course-detail', {
                      category: course.category,
                      subcategory: course.subcategory || 'general',
                      courseId: course.id,
                    })
                  }
                >
                  {/* Course Image */}
                  <div className='relative h-[200px] overflow-clip'>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/20'>
                      <div className='absolute inset-0 opacity-20'>
                        <div
                          className='absolute inset-0'
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                          }}
                        ></div>
                      </div>
                      {/* Animated gradient overlay */}
                      <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    </div>

                    {/* Centered Icon */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'>
                        <BookOpen className='h-8 w-8 text-white drop-shadow-lg' />
                      </div>
                    </div>

                    {/* Status Badge - Top Left */}
                    <div className='absolute top-3 left-3'>
                      <Badge
                        variant='secondary'
                        className={
                          course.status === 'published'
                            ? 'bg-emerald-500/90 text-white border-0 backdrop-blur-sm shadow-lg font-medium px-2.5 py-0.5'
                            : 'bg-amber-500/90 text-white border-0 backdrop-blur-sm shadow-lg font-medium px-2.5 py-0.5'
                        }
                      >
                        <CheckCircle2
                          className={`w-3 h-3 mr-1 ${course.status === 'published' ? 'block' : 'hidden'}`}
                        />
                        <Clock
                          className={`w-3 h-3 mr-1 ${course.status === 'draft' ? 'block' : 'hidden'}`}
                        />
                        {course.status === 'published' ? 'Live' : 'Draft'}
                      </Badge>
                    </div>

                    {/* Engagement Stats - Top Right */}
                    <div className='absolute top-3 right-3 flex flex-col gap-1.5'>
                      <div className='backdrop-blur-md bg-white/95 rounded-lg px-2 py-1 flex items-center gap-1 border border-white/50 shadow-md'>
                        <Users className='w-3.5 h-3.5 text-primary' />
                        <span className='text-xs font-bold text-gray-900'>
                          {course.enrollments || 0}
                        </span>
                      </div>
                      {course.rating > 0 && (
                        <div className='backdrop-blur-md bg-white/95 rounded-lg px-2 py-1 flex items-center gap-1 border border-white/50 shadow-md'>
                          <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                          <span className='text-xs font-bold text-gray-900'>
                            {course.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className='pt-[0px] pr-[16px] pb-[16px] pl-[16px]'>
                    {/* Category & Price Header */}
                    <div className='flex items-center justify-between mb-3'>
                      <Badge
                        variant='outline'
                        className='border-primary/30 text-primary bg-primary/5 font-semibold px-2.5 py-0.5'
                      >
                        {course.category}
                      </Badge>
                      <div className='flex items-baseline gap-1'>
                        <DollarSign className='w-3.5 h-3.5 text-emerald-600' />
                        <span className='font-bold text-gray-900'>
                          {course.price?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* Title with Arrow */}
                    <div
                      className='flex items-start gap-2 mb-2 group/title cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('course-edit', course);
                      }}
                    >
                      <h3 className='flex-1 font-bold text-lg text-gray-900 truncate group-hover/title:text-primary transition-colors leading-snug'>
                        {course.title}
                      </h3>
                      <div className='pt-1 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all duration-200'>
                        <svg
                          className='w-4 h-4 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                            d='M7 17L17 7M17 7H7M17 7V17'
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Description */}
                    <p className='text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed'>
                      {course.description}
                    </p>

                    {/* Stats Row */}
                    <div className='flex items-center flex-wrap gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-gray-200'>
                      <div className='flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1'>
                        <BookOpen className='w-3.5 h-3.5 text-primary' />
                        <span className='font-medium'>
                          {course.lessons || 0} lessons
                        </span>
                      </div>
                      <div className='flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1'>
                        <Clock className='w-3.5 h-3.5 text-primary' />
                        <span className='font-medium'>
                          {course.duration || '0h'}
                        </span>
                      </div>
                      {course.reviews > 0 && (
                        <div className='flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1'>
                          <UserCheck className='w-3.5 h-3.5 text-primary' />
                          <span className='font-medium'>
                            {course.reviews} reviews
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress (Draft courses) */}
                    {course.status === 'draft' && (
                      <div className='mb-3 bg-amber-50 rounded-lg p-3 border border-amber-200'>
                        <div className='flex items-center justify-between text-xs mb-1.5'>
                          <span className='font-medium text-amber-700'>
                            Course Completion
                          </span>
                          <span className='font-bold text-amber-900'>
                            {course.completion || 0}%
                          </span>
                        </div>
                        <Progress
                          value={course.completion || 0}
                          className='h-2 bg-amber-100'
                        />
                      </div>
                    )}

                    {/* Revenue (Published courses) */}
                    {course.status === 'published' && course.revenue > 0 && (
                      <div className='bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-3 mb-3 border border-emerald-200 shadow-sm'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center'>
                              <TrendingUp className='w-4 h-4 text-white' />
                            </div>
                            <div>
                              <p className='text-xs font-medium text-emerald-600'>
                                Total Revenue
                              </p>
                              <p className='text-xl font-bold text-emerald-700'>
                                ${(course.revenue || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full h-8 text-xs font-medium border-2 hover:border-primary hover:bg-primary/5'
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('course-edit', course);
                        }}
                      >
                        <Edit className='mr-1.5 h-3.5 w-3.5' />
                        Edit Course
                      </Button>

                      {course.status === 'draft' ? (
                        <Button
                          size='sm'
                          className='w-full h-8 text-xs font-medium bg-primary hover:bg-primary/90 shadow-sm'
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublishCourse(course.id);
                          }}
                        >
                          <PlayCircle className='mr-1.5 h-3.5 w-3.5' />
                          Publish Now
                        </Button>
                      ) : (
                        <Button
                          size='sm'
                          variant='secondary'
                          className='w-full h-8 text-xs font-medium bg-secondary hover:bg-secondary/80'
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('creator-analytics', course);
                          }}
                        >
                          <BarChart3 className='mr-1.5 h-3.5 w-3.5' />
                          View Stats
                        </Button>
                      )}
                    </div>

                    {/* Share Button (Published courses) */}
                    {course.status === 'published' && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full h-8 text-xs font-medium mt-2 border-2 hover:border-primary hover:bg-primary/5'
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourseForShare(course);
                          setShareDialogOpen(true);
                        }}
                      >
                        <Share2 className='mr-1.5 h-3.5 w-3.5' />
                        Share Course
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className='space-y-4'>
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className='border-2 hover:border-primary/50 transition-all'
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-6'>
                      <div className='w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <BookOpen className='w-12 h-12 text-primary opacity-50' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <h3 className='text-xl font-bold mb-1'>
                              {course.title}
                            </h3>
                            <p className='text-sm text-muted-foreground line-clamp-1 mb-3'>
                              {course.description}
                            </p>
                            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                              <Badge
                                className={
                                  course.status === 'published'
                                    ? 'bg-green-500'
                                    : 'bg-yellow-500'
                                }
                              >
                                {course.status}
                              </Badge>
                              <span className='flex items-center gap-1'>
                                <Users className='w-4 h-4' />
                                {course.enrollments} students
                              </span>
                              {course.rating > 0 && (
                                <span className='flex items-center gap-1'>
                                  <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                  {course.rating} ({course.reviews} reviews)
                                </span>
                              )}
                              <span className='flex items-center gap-1'>
                                <Clock className='w-4 h-4' />
                                {course.duration}
                              </span>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 ml-4'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => onNavigate('course-edit', course)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Edit
                            </Button>
                            {course.status === 'draft' ? (
                              <Button
                                size='sm'
                                className='bg-primary'
                                onClick={() => handlePublishCourse(course.id)}
                              >
                                <PlayCircle className='mr-2 h-4 w-4' />
                                Publish
                              </Button>
                            ) : (
                              <Button
                                size='sm'
                                variant='secondary'
                                onClick={() =>
                                  onNavigate('creator-analytics', course)
                                }
                              >
                                <BarChart3 className='mr-2 h-4 w-4' />
                                Analytics
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size='sm' variant='ghost'>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() => handleDuplicateCourse(course)}
                                >
                                  <Copy className='mr-2 h-4 w-4' />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCourseForShare(course);
                                    setShareDialogOpen(true);
                                  }}
                                >
                                  <Share2 className='mr-2 h-4 w-4' />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className='text-red-600'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {course.status === 'draft' && (
                          <div className='mt-4'>
                            <Progress
                              value={course.completion}
                              className='h-2'
                            />
                            <p className='text-xs text-muted-foreground mt-1'>
                              {course.completion}% complete
                            </p>
                          </div>
                        )}

                        {course.status === 'published' && (
                          <div className='flex items-center gap-6 mt-4 pt-4 border-t'>
                            <div>
                              <p className='text-xs text-muted-foreground'>
                                Revenue
                              </p>
                              <p className='text-lg font-bold text-emerald-600'>
                                ${(course.revenue || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-muted-foreground'>
                                Completion Rate
                              </p>
                              <p className='text-lg font-bold'>68%</p>
                            </div>
                            <div>
                              <p className='text-xs text-muted-foreground'>
                                Avg. Watch Time
                              </p>
                              <p className='text-lg font-bold'>8.5h</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <Card className='p-16 text-center border-2 border-dashed'>
              <div className='mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6'>
                <BookOpen className='h-10 w-10 text-primary' />
              </div>
              <h3 className='text-2xl font-bold mb-3'>
                {searchQuery ? 'No courses found' : 'No courses yet'}
              </h3>
              <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
                {searchQuery
                  ? `No courses match "${searchQuery}". Try a different search term.`
                  : 'Create your first course and start sharing your knowledge with learners around the world'}
              </p>
              <Button
                size='lg'
                onClick={onCreateCourse}
                className='bg-primary hover:bg-primary/90 transition-colors'
              >
                <Plus className='mr-2 h-5 w-5' />
                Create Your First Course
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Share Your Course</DialogTitle>
            <DialogDescription>
              Share &quot;{selectedCourseForShare?.title}&quot; with your
              audience
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {/* Copy Link Section */}
            <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <label className='text-sm font-medium mb-2 block'>
                Course Link
              </label>
              <div className='flex items-center gap-2'>
                <Input
                  type='text'
                  value={
                    selectedCourseForShare
                      ? `https://cerebrolearn.com/course/${selectedCourseForShare.id}`
                      : ''
                  }
                  readOnly
                  className='flex-1 bg-white'
                />
                <Button
                  size='sm'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://cerebrolearn.com/course/${selectedCourseForShare?.id}`,
                    );
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  <Copy className='h-4 w-4 mr-2' />
                  Copy
                </Button>
              </div>
            </div>

            {/* Social Media Sharing */}
            <div>
              <label className='text-sm font-medium mb-3 block'>
                Share on Social Media
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <Button variant='outline' className='justify-start' asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://cerebrolearn.com/course/${selectedCourseForShare?.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Facebook className='h-4 w-4 mr-2 text-blue-600' />
                    Facebook
                  </a>
                </Button>
                <Button variant='outline' className='justify-start' asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?url=https://cerebrolearn.com/course/${selectedCourseForShare?.id}&text=${encodeURIComponent(`Check out "${selectedCourseForShare?.title}" on CerebroLearn!`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Twitter className='h-4 w-4 mr-2 text-blue-400' />
                    Twitter
                  </a>
                </Button>
                <Button variant='outline' className='justify-start' asChild>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=https://cerebrolearn.com/course/${selectedCourseForShare?.id}&title=${encodeURIComponent(selectedCourseForShare?.title || '')}&summary=${encodeURIComponent(selectedCourseForShare?.description || '')}&source=CerebroLearn`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Linkedin className='h-4 w-4 mr-2 text-blue-700' />
                    LinkedIn
                  </a>
                </Button>
                <Button variant='outline' className='justify-start' asChild>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Check out "${selectedCourseForShare?.title}"`)}&body=${encodeURIComponent(`Hi there,\n\nI wanted to share this course with you:\n\n${selectedCourseForShare?.title}\n${selectedCourseForShare?.description}\n\nhttps://cerebrolearn.com/course/${selectedCourseForShare?.id}\n\nEnjoy learning!`)}`}
                  >
                    <Mail className='h-4 w-4 mr-2 text-gray-600' />
                    Email
                  </a>
                </Button>
              </div>
            </div>

            {/* Course Preview */}
            {selectedCourseForShare && (
              <div className='p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20'>
                <div className='flex items-start gap-3'>
                  <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0'>
                    <BookOpen className='h-6 w-6 text-white' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold mb-1 truncate'>
                      {selectedCourseForShare.title}
                    </h4>
                    <p className='text-xs text-muted-foreground line-clamp-2'>
                      {selectedCourseForShare.description}
                    </p>
                    <div className='flex items-center gap-3 mt-2 text-xs'>
                      <span className='flex items-center gap-1'>
                        <Users className='w-3 h-3' />
                        {selectedCourseForShare.enrollments} students
                      </span>
                      {selectedCourseForShare.rating > 0 && (
                        <span className='flex items-center gap-1'>
                          <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                          {selectedCourseForShare.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
