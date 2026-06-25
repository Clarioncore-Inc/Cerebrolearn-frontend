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
import { Skeleton } from '../ui/skeleton';
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
import { creatorApi, coursesApi, storageApi } from '../../utils/api-client';
import svgPaths from '../../imports/svg-1fzm63qep0';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface MyCoursesPageProps {
  onNavigate: (page: string, data?: any) => void;
  onCreateCourse?: () => void;
}

function hasFilledText(value: any) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasFilledArray(value: any) {
  return Array.isArray(value) && value.some((item) => `${item ?? ''}`.trim());
}

function hasCurriculum(course: any) {
  if (Array.isArray(course.sections) && course.sections.length > 0) {
    const hasNamedSection = course.sections.some((section: any) =>
      hasFilledText(section?.title),
    );
    const hasLesson = course.sections.some(
      (section: any) =>
        Array.isArray(section?.lessons) && section.lessons.length > 0,
    );
    return hasNamedSection && hasLesson;
  }

  return Number(course.lessons || 0) > 0;
}

function hasPricingConfigured(course: any) {
  const price = Number(course.price ?? 0);
  return price === 0 || price > 0;
}

function calculateCourseSetupCompletion(course: any) {
  const checks = [
    hasFilledText(course.title),
    hasFilledText(course.description),
    hasFilledText(course.category),
    hasFilledText(course.level),
    !!course.cover_image,
    hasFilledArray(course.course_goals ?? course.courseGoals),
    hasFilledArray(course.learning_objectives ?? course.learningObjectives),
    hasFilledArray(course.prerequisites ?? course.requirements),
    hasFilledText(course.who_this_course_is_for ?? course.targetAudience),
    hasCurriculum(course),
    hasPricingConfigured(course),
  ];

  const completedChecks = checks.filter(Boolean).length;
  return Math.round((completedChecks / checks.length) * 100);
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
    setLoading(true);
    try {
      // Fetch creator's courses (both published and draft)
      const data = await creatorApi.getCourses();
      // Normalise API field names to what the UI expects
      const normalised = (data || []).map((c: any) => {
        return {
          ...c,
          reviews: c.reviews ?? c.total_reviews ?? 0,
          enrollments: Number(c.enrollments ?? c.total_enrollments ?? 0),
          is_public: c.is_public ?? c.public ?? false,
          duration: c.total_duration_text ?? '0h',
          lessons: c.total_lessons ?? 0,
          revenue: c.revenue ?? 0,
          completion:
            c.status === 'draft'
              ? calculateCourseSetupCompletion(c)
              : typeof c.completion === 'number'
                ? c.completion
                : 0,
          discount: c.discount ?? null,
          imageUrl: null as string | null,
        };
      });

      // Fetch image URLs in parallel for courses that have a cover_image storage ID.
      // cover_image may be a plain string ID or an object like { id, url, ... }
      const withImages = await Promise.all(
        normalised.map(async (course: any) => {
          if (!course.cover_image) return course;

          const coverImage = course.cover_image;

          // If the object already contains a URL, use it directly
          if (typeof coverImage === 'object' && coverImage.url) {
            return { ...course, imageUrl: coverImage.url };
          }

          // Extract the ID — handle both string and object forms
          const storageId =
            typeof coverImage === 'string' ? coverImage : coverImage.id;
          if (!storageId) return course;

          try {
            const storage = await storageApi.get(storageId);
            return { ...course, imageUrl: storage.url };
          } catch {
            return course; // silently fall back to gradient if fetch fails
          }
        }),
      );

      setCourses(withImages);
    } catch (error) {
      console.error('Error loading courses:', error);
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

  const handleEditCourse = (course: any) => {
    onNavigate('course-edit', course);
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

  const renderGridSkeletonCard = (key: number) => (
    <Card
      key={key}
      className='overflow-hidden border border-border/70 bg-card shadow-sm dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950'
    >
      <Skeleton className='h-[200px] w-full rounded-none' />
      <div className='p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-24 rounded-full' />
          <Skeleton className='h-5 w-16' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-5/6' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <div className='flex flex-wrap gap-2 border-b border-border/60 pb-3 dark:border-white/10'>
          <Skeleton className='h-7 w-24 rounded-md' />
          <Skeleton className='h-7 w-20 rounded-md' />
          <Skeleton className='h-7 w-24 rounded-md' />
        </div>
        <Skeleton className='h-16 w-full rounded-lg' />
        <div className='grid grid-cols-2 gap-2'>
          <Skeleton className='h-8 w-full rounded-md' />
          <Skeleton className='h-8 w-full rounded-md' />
        </div>
      </div>
    </Card>
  );

  const renderListSkeletonCard = (key: number) => (
    <Card
      key={key}
      className='border border-border/70 bg-card shadow-sm dark:border-white/10 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-950'
    >
      <CardContent className='p-6'>
        <div className='flex items-center gap-6'>
          <Skeleton className='h-32 w-32 rounded-lg flex-shrink-0' />
          <div className='flex-1 space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-7 w-1/2' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </div>
            <div className='flex gap-3'>
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-6 w-24 rounded-full' />
            </div>
            <div className='flex gap-2'>
              <Skeleton className='h-9 w-24 rounded-md' />
              <Skeleton className='h-9 w-24 rounded-md' />
              <Skeleton className='h-9 w-9 rounded-md' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-3'>
            <Skeleton className='h-10 w-56' />
            <Skeleton className='h-5 w-80 max-w-full' />
          </div>
          <Skeleton className='h-11 w-44' />
        </div>

        <div className='grid gap-4 md:grid-cols-5'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              className='border border-border/70 bg-card dark:border-white/10 dark:bg-slate-950'
            >
              <CardContent className='p-6'>
                <div className='space-y-3'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-8 w-16' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='border-2 shadow-none dark:border-white/10 dark:bg-slate-950/90'>
          <CardContent className='p-6'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center'>
              <Skeleton className='h-10 w-full flex-1' />
              <Skeleton className='h-10 w-full md:w-36' />
              <div className='flex gap-2 md:ml-auto'>
                <Skeleton className='h-10 w-10' />
                <Skeleton className='h-10 w-10' />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <div className='flex gap-2'>
            <Skeleton className='h-10 w-32 rounded-md' />
            <Skeleton className='h-10 w-32 rounded-md' />
            <Skeleton className='h-10 w-28 rounded-md' />
          </div>

          {viewMode === 'grid' ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => renderGridSkeletonCard(index))}
            </div>
          ) : (
            <div className='space-y-4'>
              {Array.from({ length: 4 }).map((_, index) => renderListSkeletonCard(index))}
            </div>
          )}
        </div>
      </div>
    );
  }

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
                  className='group cursor-pointer overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 dark:hover:border-primary/30 dark:hover:shadow-[0_20px_40px_rgba(2,6,23,0.6)]'
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
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/20'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'>
                            <BookOpen className='h-8 w-8 text-white drop-shadow-lg' />
                          </div>
                        </div>
                      </div>
                    )}

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
                      <div className='flex items-center gap-1 rounded-lg border border-white/50 bg-white/95 px-2 py-1 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-slate-950/85'>
                        <Users className='w-3.5 h-3.5 text-primary' />
                        <span className='text-xs font-bold text-gray-900 dark:text-slate-100'>
                          {course.enrollments || 0}
                        </span>
                      </div>
                      {course.rating > 0 && (
                        <div className='flex items-center gap-1 rounded-lg border border-white/50 bg-white/95 px-2 py-1 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-slate-950/85'>
                          <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                          <span className='text-xs font-bold text-gray-900 dark:text-slate-100'>
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
                        {course.price === 0 ? (
                          <span className='font-bold text-emerald-600'>
                            Free
                          </span>
                        ) : course.discount ? (
                          <>
                            <DollarSign className='w-3.5 h-3.5 text-emerald-600' />
                            <span className='font-bold text-gray-900 dark:text-slate-100'>
                              {course.discount}
                            </span>
                            <span className='text-sm text-muted-foreground line-through ml-1'>
                              ${course.price}
                            </span>
                          </>
                        ) : (
                          <>
                            <DollarSign className='w-3.5 h-3.5 text-emerald-600' />
                            <span className='font-bold text-gray-900 dark:text-slate-100'>
                              {course.price}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Title with Arrow */}
                    <div
                      className='flex items-start gap-2 mb-2 group/title cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCourse(course);
                      }}
                    >
                      <h3 className='flex-1 truncate text-lg font-bold leading-snug text-gray-900 transition-colors group-hover/title:text-primary dark:text-slate-50'>
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
                    <p className='mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400'>
                      {course.description}
                    </p>

                    {/* Stats Row */}
                    <div className='mb-3 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-3 text-xs text-muted-foreground dark:border-white/10 dark:text-slate-300'>
                      <div className='flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 dark:bg-white/[0.05]'>
                        <BookOpen className='w-3.5 h-3.5 text-primary' />
                        <span className='font-medium'>
                          {course.total_lessons || 0} lessons
                        </span>
                      </div>
                      <div className='flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 dark:bg-white/[0.05]'>
                        <Clock className='w-3.5 h-3.5 text-primary' />
                        <span className='font-medium'>
                          {course.total_duration_text || '0h'}
                        </span>
                      </div>
                      {course.reviews > 0 && (
                        <div className='flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 dark:bg-white/[0.05]'>
                          <UserCheck className='w-3.5 h-3.5 text-primary' />
                          <span className='font-medium'>
                            {course.reviews} reviews
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress (Draft courses) */}
                    {course.status === 'draft' && (
                      <div className='mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/60 dark:bg-amber-950/30'>
                        <div className='flex items-center justify-between text-xs mb-1.5'>
                          <span className='font-medium text-amber-700 dark:text-amber-300'>
                            Course Setup Progress
                          </span>
                          <span className='font-bold text-amber-900 dark:text-amber-100'>
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
                      <div className='mb-3 rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 shadow-sm dark:border-emerald-800/60 dark:from-emerald-950/50 dark:to-emerald-900/20'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center'>
                              <TrendingUp className='w-4 h-4 text-white' />
                            </div>
                            <div>
                              <p className='text-xs font-medium text-emerald-600 dark:text-emerald-300'>
                                Total Revenue
                              </p>
                              <p className='text-xl font-bold text-emerald-700 dark:text-emerald-100'>
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
                        className='h-8 w-full border-2 text-xs font-medium hover:border-primary hover:bg-primary/5 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                      >
                        <Edit className='mr-1.5 h-3.5 w-3.5' />
                        Edit Course
                      </Button>

                      {course.status === 'draft' ? (
                        <Button
                          size='sm'
                          className='h-8 w-full bg-primary text-xs font-medium shadow-sm hover:bg-primary/90'
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                          className='h-8 w-full bg-secondary text-xs font-medium hover:bg-secondary/80 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                        className='mt-2 h-8 w-full border-2 text-xs font-medium hover:border-primary hover:bg-primary/5 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                  className='border-2 bg-card transition-all hover:border-primary/50 dark:border-white/10 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-950 dark:hover:border-primary/30'
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-6'>
                      <div className='w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden'>
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center'>
                            <BookOpen className='w-12 h-12 text-primary opacity-50' />
                          </div>
                        )}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <h3 className='mb-1 text-xl font-bold dark:text-slate-50'>
                              {course.title}
                            </h3>
                            <p className='mb-3 line-clamp-1 text-sm text-muted-foreground dark:text-slate-400'>
                              {course.description}
                            </p>
                            <div className='flex items-center gap-4 text-sm text-muted-foreground dark:text-slate-300'>
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
                                {course.total_duration_text}
                              </span>
                            </div>
                          </div>

                          <div className='flex items-center gap-2 ml-4'>
                            <Button
                              variant='outline'
                              size='sm'
                              className='dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]'
                              onClick={() => handleEditCourse(course)}
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
                                className='dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
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
                              {course.completion}% setup complete
                            </p>
                          </div>
                        )}

                        {course.status === 'published' &&
                          course.revenue > 0 && (
                            <div className='flex items-center gap-6 mt-4 pt-4 border-t'>
                              <div>
                                <p className='text-xs text-muted-foreground dark:text-slate-400'>
                                  Revenue
                                </p>
                                <p className='text-lg font-bold text-emerald-600 dark:text-emerald-300'>
                                  ${(course.revenue || 0).toLocaleString()}
                                </p>
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
