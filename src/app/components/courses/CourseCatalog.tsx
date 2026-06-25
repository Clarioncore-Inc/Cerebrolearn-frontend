import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { coursesApi, enrollmentsApi, socialApi } from '../../utils/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { SmartSearchBar } from './SmartSearchBar';
import { CompareCoursesButton } from './CompareCoursesButton';
import {
  BookOpen,
  Search,
  Star,
  Users,
  Clock,
  Filter,
  Sparkles,
  Play,
  Award,
  TrendingUp,
  PlusCircle,
  BookMarked,
  SlidersHorizontal,
  X,
  BookmarkPlus,
  ArrowUpDown,
  DollarSign,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

interface CourseCatalogProps {
  onNavigate: (page: string, data?: any) => void;
  userRole?: 'student' | 'course_creator' | 'instructor' | 'admin';
}

export function CourseCatalog({
  onNavigate,
  userRole = 'student',
}: CourseCatalogProps) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [bookmarkedCourseIds, setBookmarkedCourseIds] = useState<Set<string>>(
    new Set(),
  );
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadCourses();
  }, [user]);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) {
        setBookmarkedCourseIds(new Set());
        return;
      }

      try {
        const bookmarks = await socialApi.getBookmarks();
        setBookmarkedCourseIds(
          new Set(
            bookmarks
              .filter((bookmark) => bookmark.object_type === 'course')
              .map((bookmark) => String(bookmark.object_id)),
          ),
        );
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, [user]);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!user) {
        setEnrolledCourseIds(new Set());
        return;
      }

      try {
        const enrollments = await enrollmentsApi.getMy();
        setEnrolledCourseIds(
          new Set(
            (enrollments || [])
              .map(
                (enrollment: any) =>
                  enrollment?.course_id ??
                  enrollment?.courseId ??
                  enrollment?.course?.id ??
                  null,
              )
              .filter(Boolean)
              .map((id: string) => String(id)),
          ),
        );
      } catch (error) {
        console.error('Error loading enrollments:', error);
      }
    };

    void loadEnrollments();
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, categoryFilter, levelFilter, courses]);

  const handleToggleCourseBookmark = async (
    event: React.MouseEvent,
    course: any,
  ) => {
    event.stopPropagation();

    if (!user) {
      toast.error('Please sign in to bookmark courses');
      onNavigate('auth');
      return;
    }

    const courseId = String(course.id);
    const isBookmarked = bookmarkedCourseIds.has(courseId);

    try {
      if (isBookmarked) {
        await socialApi.unbookmarkCourse(courseId);
      } else {
        await socialApi.bookmarkCourse(courseId);
      }

      setBookmarkedCourseIds((current) => {
        const next = new Set(current);
        if (isBookmarked) {
          next.delete(courseId);
        } else {
          next.add(courseId);
        }
        return next;
      });

      toast.success(
        isBookmarked ? 'Course removed from bookmarks' : 'Course bookmarked',
      );
    } catch (error: any) {
      console.error('Error updating course bookmark:', error);
      toast.error(error?.message ?? 'Failed to update bookmark');
    }
  };

  const handleOpenCourse = (course: any) => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    onNavigate('course', course);
  };

  const formatCategoryLabel = (value: string = '') =>
    value
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

  const getCategoryIcon = (category: string) => {
    const normalized = category.toLowerCase();

    if (normalized.includes('math')) return TrendingUp;
    if (normalized.includes('business') || normalized.includes('finance')) return Award;
    return BookOpen;
  };

  const getImageUrl = (course: any) => {
    const attachment = course.thumbnail ?? course.cover_image;
    if (!attachment) return '';
    if (typeof attachment === 'string') {
      return /^https?:\/\//i.test(attachment) ? attachment : '';
    }
    return attachment.url ?? '';
  };

  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    courses.forEach((course) => {
      const rawCategory = typeof course.category === 'string' ? course.category.trim() : '';
      if (!rawCategory) return;
      counts.set(rawCategory, (counts.get(rawCategory) ?? 0) + 1);
    });

    const dynamicCategories = Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        value,
        label: formatCategoryLabel(value),
        icon: getCategoryIcon(value),
        description: `${count} course${count === 1 ? '' : 's'} available`,
        count,
      }));

    return [{ value: 'all', label: 'All Categories', icon: BookOpen, count: courses.length }, ...dynamicCategories];
  }, [courses]);

  const loadCourses = async () => {
    try {
      const allCourses: any[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const data = user
          ? await coursesApi.getAll(page, 100)
          : await coursesApi.getPublished(page, 100);
        allCourses.push(...(data.items || []));
        totalPages = data.pages || 1;
        page += 1;
      } while (page <= totalPages);

      setCourses(allCourses);
      setFilteredCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (course) => course.category === categoryFilter,
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter((course) => course.level === levelFilter);
    }

    setFilteredCourses(filtered);
  };

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const levelGradients = {
    beginner: 'from-emerald-500 to-teal-500',
    intermediate: 'from-amber-500 to-orange-500',
    advanced: 'from-rose-500 to-pink-500',
  };

  const renderCourseSkeletonCard = (key: number) => (
    <Card
      key={key}
      className='overflow-hidden border border-border/70 bg-card/95 shadow-sm dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950'
    >
      <Skeleton className='h-48 w-full rounded-none' />
      <CardHeader className='space-y-3 pb-4'>
        <div className='flex items-start justify-between gap-2'>
          <Skeleton className='h-6 w-20 rounded-full' />
          <Skeleton className='h-6 w-24 rounded-full' />
        </div>
        <Skeleton className='h-6 w-5/6' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-xl border border-border/60 bg-muted/40 px-3 py-3 dark:border-white/8 dark:bg-white/[0.04]'>
          <div className='flex items-center justify-between gap-3'>
            <Skeleton className='h-4 w-14' />
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-10' />
          </div>
        </div>
        <div className='flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3 py-3 dark:border-white/8 dark:bg-slate-900/60'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-3 w-14' />
              <Skeleton className='h-3 w-18' />
            </div>
          </div>
          <Skeleton className='h-9 w-24 rounded-md' />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className='min-h-screen'>
        <div className='relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-white'>
          <div className='container py-16 md:py-24'>
            <div className='mx-auto max-w-3xl space-y-6 text-center'>
              <div className='flex justify-center'>
                <Skeleton className='h-8 w-48 rounded-full bg-white/20' />
              </div>
              <div className='space-y-3'>
                <Skeleton className='mx-auto h-12 w-3/4 bg-white/20' />
                <Skeleton className='mx-auto h-5 w-2/3 bg-white/15' />
                <Skeleton className='mx-auto h-5 w-1/2 bg-white/15' />
              </div>
            </div>
          </div>
        </div>

        <div className='container py-8 space-y-8'>
          <div className='max-w-4xl mx-auto -mt-16 relative z-20'>
            <Card className='border-0 bg-card/95 shadow-2xl backdrop-blur-sm dark:bg-slate-950/90'>
              <CardContent className='p-6 md:p-8'>
                <div className='grid gap-4 md:grid-cols-3'>
                  <Skeleton className='h-11 w-full' />
                  <Skeleton className='h-11 w-full' />
                  <Skeleton className='h-11 w-full' />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-44' />
            <Skeleton className='h-6 w-24 rounded-full' />
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3, 4, 5, 6].map((i) => renderCourseSkeletonCard(i))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Header */}
      <div className='relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-white'>
        <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px] animate-gradient'></div>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>

        <div className='container relative py-16 md:py-24'>
          <div className='text-center space-y-6 max-w-3xl mx-auto animate-slide-up'>
            <Badge
              variant='secondary'
              className='bg-white/20 border-white/30 text-white'
            >
              <Sparkles className='w-3 h-3 mr-1' />
              {courses.length}+ Expert-Designed Courses
            </Badge>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold'>
              Explore Our Course Catalog
            </h1>
            <p className='text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed'>
              Discover interactive courses designed to help you master new
              skills through engaging, step-by-step learning experiences from
              world-class instructors
            </p>
          </div>
        </div>
      </div>

      <div className='container py-8 space-y-8'>
        {/* Smart Search Bar */}
        <div className='max-w-4xl mx-auto -mt-16 relative z-20'>
          <SmartSearchBar
            onSearch={(query) => setSearchQuery(query)}
            onCourseSelect={handleOpenCourse}
            courses={courses}
          />
        </div>

        {/* Browse by Category Section */}
        <div className='space-y-6'>
          <div className='text-center space-y-2'>
            <h2 className='text-4xl font-extrabold'>Browse by Category</h2>
            <p className='text-muted-foreground'>
              Explore courses organized by subject area
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {categories
              .filter((cat) => cat.value !== 'all')
              .map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.value}
                    className='group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5 border-2'
                    onClick={() =>
                      onNavigate('category', { category: category.value })
                    }
                  >
                    <CardContent className='p-6 text-center space-y-3'>
                      <div className='mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <Icon className='w-6 h-6 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-lg mb-1 group-hover:text-primary transition-colors'>
                          {category.label}
                        </h3>
                        {category.description && (
                          <p className='text-xs text-muted-foreground line-clamp-2'>
                            {category.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className='border-2'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Filter className='h-5 w-5 text-primary' />
              <h3 className='font-semibold'>Filter Courses</h3>
            </div>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10' />
                <Input
                  placeholder='Search courses...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9 h-11 border-2 focus:border-primary transition-colors'
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='h-11 border-2'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className='h-11 border-2'>
                  <SelectValue placeholder='Level' />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            {(searchQuery ||
              categoryFilter !== 'all' ||
              levelFilter !== 'all') && (
              <div className='flex flex-wrap items-center gap-2 mt-4 pt-4 border-t'>
                <span className='text-sm text-muted-foreground'>
                  Active filters:
                </span>
                {searchQuery && (
                  <Badge variant='secondary' className='gap-1'>
                    Search: {searchQuery}
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant='secondary'>
                    Category:{' '}
                    {categories.find((c) => c.value === categoryFilter)?.label}
                  </Badge>
                )}
                {levelFilter !== 'all' && (
                  <Badge variant='secondary'>
                    Level: {levels.find((l) => l.value === levelFilter)?.label}
                  </Badge>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setLevelFilter('all');
                  }}
                  className='text-xs'
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Showing{' '}
              <span className='font-semibold text-foreground'>
                {filteredCourses.length}
              </span>{' '}
              of{' '}
              <span className='font-semibold text-foreground'>
                {courses.length}
              </span>{' '}
              courses
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='gap-1'>
              <TrendingUp className='h-3 w-3' />
              Most Popular
            </Badge>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredCourses.map((course) => (
              (() => {
                const isBookmarked = bookmarkedCourseIds.has(String(course.id));
                const isEnrolled = enrolledCourseIds.has(String(course.id));
                return (
              <Card
                key={course.id}
                className='group cursor-pointer overflow-hidden border border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover-lift card-glow hover:border-primary/30 hover:shadow-xl dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] dark:hover:border-primary/40 dark:hover:shadow-[0_20px_40px_rgba(2,6,23,0.6)]'
                onClick={() => handleOpenCourse(course)}
              >
                <div
                  className={`h-48 bg-gradient-to-br ${levelGradients[course.level as keyof typeof levelGradients] || 'from-indigo-500 to-purple-500'} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 dark:from-slate-950/85 dark:via-slate-950/20 dark:to-slate-900/45'></div>
                  {getImageUrl(course) ? (
                    <img
                      src={getImageUrl(course)}
                      alt={course.title}
                      className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                  ) : (
                    <BookOpen className='h-20 w-20 text-white/90 relative z-10 group-hover:scale-110 transition-transform' />
                  )}

                  <Button
                    type='button'
                    variant='secondary'
                    size='icon'
                    className='absolute right-4 top-4 z-30 h-9 w-9 border border-white/25 bg-background/90 backdrop-blur-sm hover:bg-background dark:border-white/10 dark:bg-slate-950/85 dark:text-slate-100 dark:hover:bg-slate-900'
                    title={
                      isBookmarked
                        ? 'Remove course bookmark'
                        : 'Bookmark this course'
                    }
                    onClick={(event) => handleToggleCourseBookmark(event, course)}
                  >
                    {isBookmarked ? (
                      <BookMarked className='h-4 w-4 text-primary' />
                    ) : (
                      <BookmarkPlus className='h-4 w-4' />
                    )}
                  </Button>

                  {/* Overlay on hover */}
                  <div className='absolute inset-0 z-20 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100 dark:from-slate-950/90 dark:via-slate-950/25'>
                    <Button
                      size='sm'
                      className='w-full bg-background/95 text-foreground shadow-lg hover:bg-background dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-white'
                    >
                      <Play className='mr-2 h-4 w-4' />
                      View Course
                    </Button>
                  </div>
                </div>

                <CardHeader className='space-y-3 pb-4'>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <Badge
                      variant={
                        course.level === 'beginner' ? 'secondary' : 'default'
                      }
                      className={`border-0 text-xs shadow-sm bg-gradient-to-r ${levelGradients[course.level as keyof typeof levelGradients]} text-white`}
                    >
                      {course.level}
                    </Badge>
                    <Badge variant='outline' className='text-xs border-border/70 bg-background/70 dark:border-white/10 dark:bg-white/5'>
                      {course.category}
                    </Badge>
                  </div>

                  <CardTitle className='line-clamp-2 text-lg leading-snug transition-colors group-hover:text-primary dark:text-slate-50'>
                    {course.title}
                  </CardTitle>
                  <CardDescription className='line-clamp-2 leading-6 text-muted-foreground dark:text-slate-400/95'>
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {/* Course Meta */}
                  <div className='flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground dark:border-white/8 dark:bg-white/[0.04] dark:text-slate-300'>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4' />
                      <span>{Math.floor(Math.random() * 10000)}+</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='h-4 w-4' />
                      <span>{Math.floor(Math.random() * 12) + 4}h</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                      <span className='font-medium'>
                        4.{Math.floor(Math.random() * 3) + 7}
                      </span>
                    </div>
                  </div>

                  {/* Instructor & Price */}
                  <div className='flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3 py-3 dark:border-white/8 dark:bg-slate-900/60'>
                    <div className='flex items-center gap-3'>
                      <div className='h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm'>
                        <Award className='h-4 w-4 text-white' />
                      </div>
                      <div className='text-xs'>
                        <p className='font-semibold text-foreground dark:text-slate-100'>Expert</p>
                        <p className='text-muted-foreground dark:text-slate-400'>Instructor</p>
                      </div>
                    </div>
                    <Button size='sm' variant='outline' className='group/btn border-border/70 bg-background/80 hover:bg-muted dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'>
                      {isEnrolled ? 'Continue' : 'View Course'}
                      <Play className='ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
                );
              })()
            ))}
          </div>
        ) : (
          <Card className='p-12 text-center'>
            <div className='mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6'>
              <Search className='h-10 w-10 text-muted-foreground' />
            </div>
            <h3 className='text-2xl mb-3'>No courses found</h3>
            <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
              Try adjusting your filters or search terms to find what you're
              looking for
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setLevelFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        )}

        {/* Call to Action */}
        <Card className='relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl'></div>
          {userRole === 'course_creator' ||
          userRole === 'instructor' ||
          userRole === 'admin' ? (
            <CardContent className='relative p-8 md:p-12 text-center space-y-6'>
              <div className='mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4'>
                <PlusCircle className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl md:text-3xl font-bold'>
                Ready to Create Your Next Course?
              </h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                Turn your expertise into engaging learning experiences. Create
                interactive courses that inspire thousands of learners
                worldwide.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button
                  size='lg'
                  onClick={() => onNavigate('creator-create-course')}
                >
                  <PlusCircle className='mr-2 h-5 w-5' />
                  Create New Course
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  onClick={() => onNavigate('creator-dashboard')}
                >
                  <BookMarked className='mr-2 h-5 w-5' />
                  View My Courses
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className='relative p-8 md:p-12 text-center space-y-6'>
              <div className='mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4'>
                <Sparkles className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl md:text-3xl font-bold'>
                Can't find what you're looking for?
              </h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                We're constantly adding new courses. Request a topic or become a
                course creator to share your expertise!
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button size='lg' onClick={() => onNavigate('auth')}>
                  Request a Course
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  onClick={() => onNavigate('auth')}
                >
                  Become a Course Creator
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Floating Comparison Button */}
      <CompareCoursesButton
        onViewComparison={() => onNavigate('course-comparison')}
      />
    </div>
  );
}
