import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { coursesApi, enrollmentsApi, progressApi, socialApi, storageApi } from '../../utils/api-client';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ReviewSystem } from '../courses/ReviewSystem';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Play,
  Star,
  Users,
  Clock,
  CheckCircle2,
  Award,
  Download,
  Share2,
  MessageSquare,
  Globe,
  Target,
  TrendingUp,
  BarChart,
  Lock,
    BookMarked,
    BookmarkPlus,
  Calendar,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react';

interface CourseDetailPageProps {
  category: string;
  subcategory: string;
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

const matchesEnrollmentCourse = (enrollment: any, targetCourseId: string) => {
  const enrolledCourseId =
    enrollment?.course_id ?? enrollment?.courseId ?? enrollment?.course?.id ?? null;
  return String(enrolledCourseId) === String(targetCourseId);
};

const formatCourseDuration = (data: any) => {
  if (data.total_duration_text) return data.total_duration_text;
  if (Number(data.total_duration_minutes) > 0) {
    return `${Number(data.total_duration_minutes)}m`;
  }
  if (Number(data.estimated_hours) > 0) {
    return `${Number(data.estimated_hours)}h`;
  }
  return '0h';
};

const getInitials = (name?: string, fallback = 'I') => {
  const initials =
    name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || fallback;

  return initials;
};

const formatCountLabel = (
  count: number,
  singular: string,
  plural = `${singular}s`,
) => `${count} ${count === 1 ? singular : plural}`;

const formatRoleLabel = (value?: string | null, fallback = 'Instructor') => {
  if (!value) return fallback;
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const getCourseLessons = (courseData: any) =>
  (courseData?.sections || []).flatMap((section: any) => section?.lessons || []);

const calculateCourseProgress = async (courseData: any, enrollment?: any) => {
  const lessons = getCourseLessons(courseData);
  const totalLessons =
    lessons.length || Number(courseData?.total_lessons ?? enrollment?.course?.total_lessons ?? 0);

  if (totalLessons <= 0) {
    return enrollment?.completed
      ? 100
      : Math.max(0, Math.min(100, Number(enrollment?.progress ?? 0)));
  }

  const progressEntries = await Promise.all(
    lessons.map(async (lesson: any) => {
      try {
        const progressRecord = await progressApi.get(String(lesson.id));
        return progressRecord?.progress ?? progressRecord ?? null;
      } catch {
        return null;
      }
    }),
  );

  const totalPercent = progressEntries.reduce(
    (sum, record) => sum + Math.min(Number(record?.percent ?? 0), 100),
    0,
  );

  const computedProgress = Math.round(totalPercent / totalLessons);
  if (computedProgress > 0) {
    return computedProgress;
  }

  return enrollment?.completed
    ? 100
    : Math.max(0, Math.min(100, Number(enrollment?.progress ?? 0)));
};

const buildInstructorRecord = (
  user: any,
  options: { title?: string; isLead?: boolean; students?: number; rating?: number } = {},
) => {
  const name = user?.full_name || user?.name || 'Course Instructor';
  return {
    id: user?.id || user?.email || name,
    name,
    title: options.title || formatRoleLabel(user?.role, 'Instructor'),
    avatar: getInitials(name),
    avatarUrl: user?.avatar || '',
    bio: user?.bio || '',
    email: user?.email || '',
    location: user?.location || user?.country || '',
    rating: options.rating ?? 0,
    students: options.students ?? 0,
    courses: 1,
    isLead: options.isLead ?? false,
  };
};

const buildInstructors = (data: any) => {
  const totalEnrollments = data.total_enrollments || 0;
  const rating = data.rating || 0;
  const seen = new Set<string>();
  const instructors: any[] = [];

  const pushInstructor = (record: any) => {
    const key = String(record?.id || record?.email || record?.name || '');
    if (!key || seen.has(key)) return;
    seen.add(key);
    instructors.push(record);
  };

  if (data.creator) {
    pushInstructor(
      buildInstructorRecord(data.creator, {
        title: 'Lead Instructor',
        isLead: true,
        students: totalEnrollments,
        rating,
      }),
    );
  }

  (data.collaborators || []).forEach((collaborator: any) => {
    if (!collaborator?.user) return;
    pushInstructor(
      buildInstructorRecord(collaborator.user, {
        title: formatRoleLabel(collaborator.role, 'Co Instructor'),
      }),
    );
  });

  if (instructors.length === 0) {
    instructors.push({
      id: data.id || 'course-instructor',
      name: 'Course Instructor',
      title: 'Instructor',
      avatar: getInitials(data.title, 'I'),
      avatarUrl: '',
      bio: '',
      email: '',
      location: '',
      rating,
      students: totalEnrollments,
      courses: 1,
      isLead: true,
    });
  }

  return instructors;
};

const buildCourseIncludes = (data: any, totalLessons: number) => {
  const sections: any[] = data.sections || [];
  const interactiveCount = sections
    .flatMap((section: any) => section.lessons || [])
    .filter((lesson: any) =>
      ['quiz', 'exercise', 'project', 'assignment', 'interactive'].includes(
        String(lesson.type || '').toLowerCase(),
      ),
    ).length;

  return [
    formatCourseDuration(data) !== '0h'
      ? `${formatCourseDuration(data)} total content`
      : null,
    totalLessons > 0 ? `${totalLessons} lesson${totalLessons === 1 ? '' : 's'}` : null,
    interactiveCount > 0
      ? `${interactiveCount} interactive activit${interactiveCount === 1 ? 'y' : 'ies'}`
      : null,
    data.enable_discussions ? 'Discussions enabled' : null,
    data.enable_reviews ? 'Course reviews enabled' : null,
    data.enable_certificates ? 'Certificate of completion' : null,
  ].filter(Boolean) as string[];
};

// Helper to normalise an API course response into the shape this page renders
function normaliseCourse(data: any, imageUrl = '') {
  const sections: any[] = data.sections || [];
  const instructors = buildInstructors(data);
  const totalLessons = sections.reduce(
    (acc: number, s: any) => acc + (s.lessons?.length || 0),
    0,
  );
  const buildDisplayLesson = (lesson: any) => ({
    ...lesson,
    type: lesson.kind || lesson.type || 'video',
    duration:
      lesson.duration ||
      (Number(lesson.duration_minutes) > 0 ? `${lesson.duration_minutes} min` : ''),
    locked: false,
  });

  return {
    title: data.title || '',
    subtitle: data.sub_title || '',
    description: data.description || '',
    level: data.level || 'Beginner',
    language: 'English',
    lastUpdated: data.updated_at
      ? new Date(data.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })
      : '',
    rating: data.rating || 0,
    reviewCount: data.total_reviews || 0,
    students: data.total_enrollments || 0,
    hours: formatCourseDuration(data),
    lessons: totalLessons,
    price: parseFloat(data.price) || 0,
    discount: data.discount ? parseFloat(data.discount) : null,
    image: imageUrl,
    instructor: instructors[0],
    instructors,
    whatYouWillLearn:
      (data.learning_objectives?.length > 0 && data.learning_objectives) ||
      (data.course_goals?.length > 0 && data.course_goals) ||
      [],
    requirements: data.prerequisites || [],
    includes: buildCourseIncludes(data, totalLessons),
    topics: sections.map((section: any) => ({
      title: section.title,
      lessons: section.lessons?.length || 0,
      duration: '',
      items: (section.lessons || []).map((lesson: any) => buildDisplayLesson(lesson)),
    })),
    reviews: [],
  };
}

async function resolveCourseImage(coverImage: any): Promise<string> {
  if (!coverImage) return '';

  if (typeof coverImage === 'string') {
    if (/^https?:\/\//i.test(coverImage)) return coverImage;
    try {
      const storage = await storageApi.get(coverImage);
      return storage.url || '';
    } catch {
      return '';
    }
  }

  if (typeof coverImage === 'object') {
    if (coverImage.url) return coverImage.url;
    if (coverImage.id) {
      try {
        const storage = await storageApi.get(coverImage.id);
        return storage.url || '';
      } catch {
        return '';
      }
    }
  }

  return '';
}

const EMPTY_COURSE = {
  title: '',
  subtitle: '',
  description: '',
  instructor: {
    name: '',
    title: '',
    avatar: 'I',
    avatarUrl: '',
    bio: '',
    email: '',
    location: '',
    rating: 0,
    students: 0,
    courses: 0,
    isLead: true,
  },
  instructors: [] as any[],
  level: '',
  rating: 0,
  reviewCount: 0,
  students: 0,
  hours: '',
  lessons: 0,
  price: 0,
  discount: null as number | null,
  language: 'English',
  lastUpdated: '',
  image: '',
  whatYouWillLearn: [],
  requirements: [],
  includes: [] as string[],
  topics: [] as any[],
  reviews: [] as any[],
};

export function CourseDetailPage({
  category,
  subcategory,
  courseId,
  onNavigate,
}: CourseDetailPageProps) {
  const { user, profile } = useAuth();
  const isInstructor =
    profile?.role === 'instructor' ||
    (profile?.role as string) === 'trainer' ||
    profile?.role === 'org_admin' ||
    profile?.role === 'admin';
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [courseProgress, setCourseProgress] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(EMPTY_COURSE);
  const [loading, setLoading] = useState(true);
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<Set<string>>(
    new Set(),
  );
  const [bookmarkingLessonId, setBookmarkingLessonId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setCheckingEnrollment(!!user);
      try {
        const [data, reviews, enrollments] = await Promise.all([
          user
            ? coursesApi.getById(courseId)
            : coursesApi.getPublishedById(courseId),
          coursesApi.getReviews(courseId).catch(() => []),
          user ? enrollmentsApi.getMy().catch(() => []) : Promise.resolve([]),
        ]);
        const imageUrl = await resolveCourseImage(data.cover_image);
        setCourse(normaliseCourse(data, imageUrl));
        setCourseReviews(reviews || []);

        const matchedEnrollment = (enrollments as any[]).find((e: any) =>
          matchesEnrollmentCourse(e, courseId),
        );
        setEnrolled(Boolean(matchedEnrollment));
        setCourseProgress(await calculateCourseProgress(data, matchedEnrollment));
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Failed to load course details');
        setCourseProgress(0);
      } finally {
        setLoading(false);
        setCheckingEnrollment(false);
      }
    };
    load();
  }, [courseId, user]);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) {
        setBookmarkedLessonIds(new Set());
        return;
      }

      try {
        const bookmarks = await socialApi.getBookmarks();
        setBookmarkedLessonIds(
          new Set(
            bookmarks
              .filter((bookmark) => bookmark.object_type === 'lesson')
              .map((bookmark) => String(bookmark.object_id)),
          ),
        );
      } catch (error) {
        console.error('Error loading lesson bookmarks:', error);
      }
    };

    loadBookmarks();
  }, [user]);

  const handleToggleLessonBookmark = async (lessonId: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark lessons');
      onNavigate('auth');
      return;
    }

    const normalizedLessonId = String(lessonId);
    const isBookmarked = bookmarkedLessonIds.has(normalizedLessonId);
    setBookmarkingLessonId(normalizedLessonId);

    try {
      if (isBookmarked) {
        await socialApi.unbookmarkLesson(normalizedLessonId);
      } else {
        await socialApi.bookmarkLesson(normalizedLessonId);
      }

      setBookmarkedLessonIds((current) => {
        const next = new Set(current);
        if (isBookmarked) {
          next.delete(normalizedLessonId);
        } else {
          next.add(normalizedLessonId);
        }
        return next;
      });

      toast.success(
        isBookmarked ? 'Lesson removed from bookmarks' : 'Lesson bookmarked',
      );
    } catch (error: any) {
      console.error('Error updating lesson bookmark:', error);
      toast.error(error?.message ?? 'Failed to update bookmark');
    } finally {
      setBookmarkingLessonId(null);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll in courses');
      onNavigate('auth');
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentsApi.enroll(courseId);

      const enrollments = await enrollmentsApi.getMy();
      const matchedEnrollment = (enrollments as any[]).find(
        (e: any) => matchesEnrollmentCourse(e, courseId),
      );
      setEnrolled(Boolean(matchedEnrollment));
      setCourseProgress(await calculateCourseProgress(course, matchedEnrollment));
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enrol. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-muted-foreground'>Loading course...</p>
        </div>
      </div>
    );
  }

  const handleStartLearning = () => {
    const firstTopic = course.topics?.[0];
    if (firstTopic && firstTopic.items && firstTopic.items.length > 0) {
      const firstLesson = firstTopic.items[0];
      onNavigate('lesson', {
        lesson: firstLesson,
        course: {
          id: courseId,
          title: course.title,
          instructor: course.instructor?.name || 'Instructor',
        },
      });
    } else {
      toast.error('No lessons available in this course yet');
    }
  };

  const handleOpenCourseNotes = () => {
    if (!user) {
      toast.error('Please sign in to write course notes');
      onNavigate('auth');
      return;
    }

    if (!isInstructor && !enrolled) {
      toast.error('Enroll in this course before adding course notes');
      return;
    }

    onNavigate('notes', {
      currentCourseId: courseId,
      currentCourseTitle: course.title,
      openCreate: true,
    });
  };

  const courseUrl = `https://cerebrolearn.com/course/${category}/${subcategory}/${courseId}`;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className='w-4 h-4' />;
      case 'quiz':
        return <CheckCircle2 className='w-4 h-4' />;
      case 'exercise':
        return <Target className='w-4 h-4' />;
      case 'project':
        return <Award className='w-4 h-4' />;
      case 'certificate':
        return <Award className='w-4 h-4' />;
      default:
        return <BookOpen className='w-4 h-4' />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
      {/* Hero Section */}
      <section className='relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/10 via-secondary/5 to-background'>
        <div className='container py-12 max-w-7xl'>
          <div className='grid lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-6'>
              <div>
                <div className='flex items-center gap-2 mb-4'>
                  <Badge className='bg-primary text-white'>
                    {course.level}
                  </Badge>
                  <Badge variant='outline'>
                    <Globe className='w-3 h-3 mr-1' />
                    {course.language}
                  </Badge>
                  <Badge variant='outline'>
                    <Calendar className='w-3 h-3 mr-1' />
                    Updated {course.lastUpdated}
                  </Badge>
                </div>

                <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                  {course.title}
                </h1>
                <p className='text-xl text-muted-foreground leading-relaxed'>
                  {course.subtitle}
                </p>
              </div>

              <p className='text-lg text-muted-foreground leading-relaxed'>
                {course.description}
              </p>

              <div className='flex flex-wrap items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                  <span className='font-bold text-lg'>{course.rating}</span>
                  <span className='text-muted-foreground'>
                    ({formatCountLabel(course.reviewCount, 'review')})
                  </span>
                </div>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Users className='w-5 h-5' />
                  <span>{formatCountLabel(course.students, 'student')}</span>
                </div>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Clock className='w-5 h-5' />
                  <span>{course.hours} total</span>
                </div>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <BookOpen className='w-5 h-5' />
                  <span>{formatCountLabel(course.lessons, 'lesson')}</span>
                </div>
              </div>

              {/* Instructor Card */}
              <Card className='border-2'>
                <CardContent className='p-6'>
                  <div className='flex items-start gap-4'>
                    <Avatar className='w-16 h-16'>
                      <AvatarFallback className='text-lg bg-primary text-white'>
                        {course.instructor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <h4 className='font-bold text-lg'>
                        {course.instructor.name}
                      </h4>
                      <p className='text-sm text-muted-foreground mb-3'>
                        {course.instructor.title}
                      </p>
                      <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
                        {course.instructor.bio}
                      </p>
                      <div className='flex items-center gap-6 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                          <span className='font-medium'>
                            {course.instructor.rating}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          <span>
                            {formatCountLabel(course.instructor.students, 'student')}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <BookOpen className='w-4 h-4' />
                          <span>
                            {formatCountLabel(course.instructor.courses, 'course')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Card */}
            <div>
              <Card className='sticky top-24 border-2 shadow-xl'>
                <div className='aspect-video relative overflow-hidden'>
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gradient-to-br from-primary/25 to-secondary/20 flex items-center justify-center'>
                      <BookOpen className='w-16 h-16 text-primary/50' />
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                    <div className='w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer'>
                      <Play className='w-10 h-10 text-primary ml-1' />
                    </div>
                  </div>
                </div>

                <CardContent className='p-6 space-y-4'>
                  <div className='flex items-baseline justify-between'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-bold'>
                        ${course.discount ?? course.price}
                      </span>
                      {course.discount && (
                        <span className='text-lg text-muted-foreground line-through'>
                          ${course.price}
                        </span>
                      )}
                    </div>
                    {course.discount && (
                      <Badge variant='secondary' className='text-xs'>
                        {Math.round((1 - course.discount / course.price) * 100)}
                        % OFF
                      </Badge>
                    )}
                  </div>

                  {!isInstructor &&
                    (checkingEnrollment ? (
                      <Button size='lg' className='w-full bg-primary' disabled>
                        Checking enrollment...
                      </Button>
                    ) : enrolled ? (
                      <>
                        <Button
                          size='lg'
                          className='w-full'
                          onClick={handleStartLearning}
                        >
                          <Play className='w-5 h-5 mr-2' />
                          Continue Learning
                        </Button>
                        <Card className='bg-primary/5 border-primary/20'>
                          <CardContent className='p-4'>
                            <div className='flex justify-between text-sm mb-2'>
                              <span>Your Progress</span>
                              <span className='font-medium'>{courseProgress}%</span>
                            </div>
                            <Progress value={courseProgress} className='h-2' />
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <>
                        <Button
                          size='lg'
                          className='w-full bg-primary'
                          onClick={handleEnroll}
                          disabled={enrolling}
                        >
                          {enrolling ? 'Enrolling...' : 'Enroll Now'}
                        </Button>
                        <Button size='lg' variant='outline' className='w-full'>
                          Add to Wishlist
                        </Button>
                      </>
                    ))}

                  <Separator />

                  <Button
                    variant='outline'
                    size='lg'
                    className='w-full'
                    onClick={handleOpenCourseNotes}
                    disabled={checkingEnrollment || (!isInstructor && !enrolled)}
                    title={
                      !isInstructor && !enrolled
                        ? 'Enroll in this course to add course notes'
                        : 'Open course notes'
                    }
                  >
                    <FileText className='w-4 h-4 mr-2' />
                    {!isInstructor && !enrolled ? 'Enroll to Take Notes' : 'Course Notes'}
                  </Button>

                  <Separator />

                  <div className='space-y-3'>
                    <p className='font-medium'>This course includes:</p>
                    <ul className='space-y-2 text-sm'>
                      {course.includes.map((item: string) => (
                        <li key={item} className='flex items-center gap-2'>
                          <CheckCircle2 className='w-4 h-4 text-green-500 flex-shrink-0' />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <Share2 className='w-4 h-4 mr-1' />
                      Share
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1'
                      disabled
                    >
                      <Download className='w-4 h-4 mr-1' />
                      Gift
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className='container py-12'>
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 lg:w-[600px]'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='topics'>Topics</TabsTrigger>
            <TabsTrigger value='reviews'>Reviews</TabsTrigger>
            <TabsTrigger value='instructor'>Instructors</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-8 space-y-8'>
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid md:grid-cols-2 gap-4'>
                  {course.whatYouWillLearn.map(
                    (item: string, index: number) => (
                      <div key={index} className='flex items-start gap-3'>
                        <CheckCircle2 className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-muted-foreground'>{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {course.requirements.map((req: string, index: number) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0' />
                      <span className='text-muted-foreground'>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-muted-foreground leading-relaxed'>
                <p>{course.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='topics' className='mt-8'>
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  {formatCountLabel(course.lessons, 'lesson')} • {course.hours} total length
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {course.topics.map((topic: any, topicIndex: number) => (
                  <div
                    key={topicIndex}
                    className='border rounded-lg overflow-hidden'
                  >
                    <div className='p-4 bg-muted/50 flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium'>{topic.title}</h4>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {formatCountLabel(topic.lessons, 'lesson')} • {topic.duration}
                        </p>
                      </div>
                      <Badge variant='secondary'>{topicIndex + 1}</Badge>
                    </div>
                    <div className='divide-y'>
                      {topic.items.map((item: any, itemIndex: number) => (
                        (() => {
                          const lessonId = String(item.id || itemIndex);
                          const isBookmarked = bookmarkedLessonIds.has(lessonId);
                          return (
                        <div
                          key={item.id || itemIndex}
                          className='p-4 flex items-center justify-between hover:bg-muted/30 transition-colors'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <p className='font-medium'>{item.title}</p>
                              <div className='flex items-center gap-2 mt-1'>
                                <Badge
                                  variant='outline'
                                  className='text-xs capitalize'
                                >
                                  {item.type}
                                </Badge>
                                <span className='text-xs text-muted-foreground'>
                                  {item.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              title={
                                isBookmarked
                                  ? 'Remove lesson bookmark'
                                  : 'Bookmark this lesson'
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleToggleLessonBookmark(lessonId);
                              }}
                              disabled={bookmarkingLessonId === lessonId}
                            >
                              {isBookmarked ? (
                                <BookMarked className='w-4 h-4 text-primary' />
                              ) : (
                                <BookmarkPlus className='w-4 h-4' />
                              )}
                            </Button>

                            {item.locked ? (
                              <Lock className='w-4 h-4 text-muted-foreground' />
                            ) : (
                              <Button
                                variant='ghost'
                                size='sm'
                                title='Open this lesson'
                                onClick={() =>
                                  onNavigate('lesson', {
                                    lesson: item,
                                    course: {
                                      id: courseId,
                                      title: course.title,
                                      instructor: course.instructor?.name || 'Instructor',
                                    },
                                  })
                                }
                              >
                                <Play className='w-4 h-4' />
                              </Button>
                            )}
                          </div>
                        </div>
                          );
                        })()
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='reviews' className='mt-8'>
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewSystem
                  courseId={courseId}
                  reviews={courseReviews}
                  onReviewsUpdate={(updated) => setCourseReviews(updated)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='instructor' className='mt-8'>
            <div className='space-y-6'>
              {(course.instructors?.length ? course.instructors : [course.instructor]).map(
                (instructor: any) => (
                  <Card key={instructor.id || instructor.name}>
                    <CardContent className='p-8'>
                      <div className='flex flex-col md:flex-row gap-8'>
                        <Avatar className='w-24 h-24 md:w-32 md:h-32'>
                          {instructor.avatarUrl ? (
                            <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                          ) : null}
                          <AvatarFallback className='text-3xl bg-primary text-white'>
                            {instructor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 space-y-5'>
                          <div>
                            <div className='flex flex-wrap items-center gap-3 mb-2'>
                              <h3 className='text-2xl font-bold'>{instructor.name}</h3>
                              <Badge variant={instructor.isLead ? 'default' : 'secondary'}>
                                {instructor.title}
                              </Badge>
                            </div>
                            <p className='text-muted-foreground leading-relaxed'>
                              {instructor.bio || 'No instructor bio available yet.'}
                            </p>
                          </div>

                          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            {instructor.email ? (
                              <div className='rounded-lg border p-4'>
                                <div className='flex items-center gap-2 mb-1 text-sm font-medium'>
                                  <Mail className='w-4 h-4 text-primary' />
                                  Email
                                </div>
                                <p className='text-sm text-muted-foreground break-all'>
                                  {instructor.email}
                                </p>
                              </div>
                            ) : null}

                            {instructor.location ? (
                              <div className='rounded-lg border p-4'>
                                <div className='flex items-center gap-2 mb-1 text-sm font-medium'>
                                  <MapPin className='w-4 h-4 text-primary' />
                                  Location
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                  {instructor.location}
                                </p>
                              </div>
                            ) : null}

                            {instructor.isLead ? (
                              <div className='rounded-lg border p-4'>
                                <div className='flex items-center gap-2 mb-1 text-sm font-medium'>
                                  <Users className='w-4 h-4 text-primary' />
                                  {instructor.students === 1
                                    ? 'Enrolled Student'
                                    : 'Enrolled Students'}
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                  {formatCountLabel(instructor.students, 'student')}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Share Course</DialogTitle>
            <DialogDescription>
              Share this course with your friends and colleagues.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='flex gap-2 items-center'>
              <Input
                id='url'
                value={courseUrl}
                className='flex-1 min-w-0'
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant='outline'
                size='sm'
                className='shrink-0'
                onClick={() => {
                  navigator.clipboard.writeText(courseUrl);
                  toast.success('Copied to clipboard!');
                }}
              >
                <Copy className='w-4 h-4 mr-1' />
                Copy
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 min-w-[calc(50%-4px)]'
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`,
                    '_blank',
                  );
                }}
              >
                <Facebook className='w-4 h-4 mr-1' />
                Facebook
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 min-w-[calc(50%-4px)]'
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(courseUrl)}`,
                    '_blank',
                  );
                }}
              >
                <Twitter className='w-4 h-4 mr-1' />
                Twitter
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 min-w-[calc(50%-4px)]'
                onClick={() => {
                  window.open(
                    `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(courseUrl)}`,
                    '_blank',
                  );
                }}
              >
                <Linkedin className='w-4 h-4 mr-1' />
                LinkedIn
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 min-w-[calc(50%-4px)]'
                onClick={() => {
                  window.open(
                    `mailto:?subject=Check out this course&body=${encodeURIComponent(courseUrl)}`,
                    '_blank',
                  );
                }}
              >
                <Mail className='w-4 h-4 mr-1' />
                Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
