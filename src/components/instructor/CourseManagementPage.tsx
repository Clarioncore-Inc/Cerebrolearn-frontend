import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Video,
  FileText,
  CheckSquare,
  Puzzle,
  Link2,
  Download,
  ChevronDown,
  ChevronRight,
  Users,
  Star,
  Settings,
  Eye,
  BarChart3,
  Clock,
  Target,
  Award,
  MessageSquare,
  PlayCircle,
  Save,
  Upload,
  Lightbulb,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { enrollmentsApi, coursesApi } from '../../utils/api-client';
import { CourseLearnersTab } from './CourseLearnersTab';
import { ReviewSystem } from '../courses/ReviewSystem';

interface CourseManagementPageProps {
  course: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'problem' | 'file' | 'link';
  duration?: number;
  completed?: boolean;
  order: number;
  chapterId: string;
  content?: string;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
  expanded: boolean;
  order: number;
}

export function CourseManagementPage({
  course: initialCourse,
  onNavigate,
  onBack,
}: CourseManagementPageProps) {
  const [course, setCourse] = useState<any>(initialCourse);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Convert course sections to chapters format, or use default mock data
  const initialChapters =
    course?.sections?.length > 0
      ? course.sections.map((section: any, index: number) => ({
          id: section.id || `chapter-${index + 1}`,
          title: section.title || `Chapter ${index + 1}`,
          order: index + 1,
          expanded: index === 0, // First chapter expanded by default
          lessons:
            section.lessons?.map((lesson: any, lessonIndex: number) => ({
              id: lesson.id || `${section.id}-${lessonIndex + 1}`,
              title: lesson.title || `Lesson ${lessonIndex + 1}`,
              type: lesson.type || 'text',
              duration: lesson.duration || 10,
              order: lessonIndex + 1,
              chapterId: section.id || `chapter-${index + 1}`,
              content: lesson.content || '',
            })) || [],
        }))
      : [
          {
            id: '1',
            title: 'Introduction to Course',
            order: 1,
            expanded: true,
            lessons: [
              {
                id: '1-1',
                title: 'Welcome & Course Overview',
                type: 'video',
                duration: 5,
                order: 1,
                chapterId: '1',
              },
              {
                id: '1-2',
                title: 'Getting Started Guide',
                type: 'text',
                duration: 10,
                order: 2,
                chapterId: '1',
              },
              {
                id: '1-3',
                title: 'Prerequisites Check',
                type: 'quiz',
                duration: 15,
                order: 3,
                chapterId: '1',
              },
            ],
          },
          {
            id: '2',
            title: 'Core Concepts',
            order: 2,
            expanded: false,
            lessons: [
              {
                id: '2-1',
                title: 'Fundamental Principles',
                type: 'video',
                duration: 20,
                order: 1,
                chapterId: '2',
              },
              {
                id: '2-2',
                title: 'Interactive Exercise 1',
                type: 'interactive',
                duration: 30,
                order: 2,
                chapterId: '2',
              },
              {
                id: '2-3',
                title: 'Problem Set A',
                type: 'problem',
                duration: 45,
                order: 3,
                chapterId: '2',
              },
            ],
          },
        ];

  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);

  const [courseData, setCourseData] = useState({
    title: course.title || '',
    description: course.description || '',
    goals:
      (course.course_goals?.length > 0 ? course.course_goals : null) ||
      (course.goals?.length > 0 ? course.goals : null) ||
      [],
    requirements:
      (course.prerequisites?.length > 0 ? course.prerequisites : null) ||
      (course.requirements?.length > 0 ? course.requirements : null) ||
      [],
    category: course.category || 'Programming',
    level: course.level || 'Beginner',
    language: course.language || 'English',
  });

  const [courseReviews, setCourseReviews] = useState<any[]>([]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await coursesApi.update(course.id, {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level.toLowerCase() as any,
        course_goals: courseData.goals,
        prerequisites: courseData.requirements,
        sections: chapters.map((ch) => ({
          title: ch.title,
          lessons: ch.lessons.map((l) => ({
            title: l.title,
            type: l.type,
            duration: l.duration?.toString() || '',
            content: l.content || '',
          })),
        })),
      } as any);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch fresh course data via /course/{id} (no enrollments) on mount
  useEffect(() => {
    if (!initialCourse?.id) return;
    coursesApi
      .getForEdit(initialCourse.id)
      .then((raw) => {
        const fc = raw as any;
        setCourse(fc);
        setCourseData({
          title: fc.title || '',
          description: fc.description || '',
          goals:
            (fc.course_goals?.length > 0 ? fc.course_goals : null) ||
            (fc.goals?.length > 0 ? fc.goals : null) ||
            [],
          requirements:
            (fc.prerequisites?.length > 0 ? fc.prerequisites : null) ||
            (fc.requirements?.length > 0 ? fc.requirements : null) ||
            [],
          category: fc.category || 'Programming',
          level: fc.level || 'Beginner',
          language: fc.language || 'English',
        });
        if (fc.sections?.length > 0) {
          setChapters(
            fc.sections.map((section: any, index: number) => ({
              id: section.id || `chapter-${index + 1}`,
              title: section.title || `Chapter ${index + 1}`,
              order: index + 1,
              expanded: index === 0,
              lessons:
                section.lessons?.map((lesson: any, lessonIndex: number) => ({
                  id: lesson.id || `${section.id}-${lessonIndex + 1}`,
                  title: lesson.title || `Lesson ${lessonIndex + 1}`,
                  type: lesson.type || 'text',
                  duration: lesson.duration || 10,
                  order: lessonIndex + 1,
                  chapterId: section.id || `chapter-${index + 1}`,
                  content: lesson.content || '',
                })) || [],
            })),
          );
        }
      })
      .catch((err) => {
        console.error('Failed to fetch course for editing:', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCourse?.id]);

  const toggleChapter = (chapterId: string) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, expanded: !ch.expanded } : ch,
      ),
    );
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'New Chapter',
      lessons: [],
      expanded: true,
      order: chapters.length + 1,
    };
    setChapters([...chapters, newChapter]);
    toast.success('Chapter added successfully!');
  };

  const addLesson = (chapterId: string, type: Lesson['type']) => {
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return;

    const newLesson: Lesson = {
      id: `${chapterId}-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Lesson`,
      type,
      duration: 10,
      order: chapter.lessons.length + 1,
      chapterId,
    };

    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? { ...ch, lessons: [...ch.lessons, newLesson], expanded: true }
          : ch,
      ),
    );

    toast.success('Lesson added successfully!');
  };

  const deleteLesson = (chapterId: string, lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;

    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
          : ch,
      ),
    );

    toast.success('Lesson deleted');
  };

  const deleteChapter = (chapterId: string) => {
    if (!confirm('Delete this chapter and all its lessons?')) return;
    setChapters(chapters.filter((ch) => ch.id !== chapterId));
    toast.success('Chapter deleted');
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className='w-4 h-4' />;
      case 'text':
        return <FileText className='w-4 h-4' />;
      case 'quiz':
        return <CheckSquare className='w-4 h-4' />;
      case 'interactive':
        return <Puzzle className='w-4 h-4' />;
      case 'problem':
        return <Target className='w-4 h-4' />;
      case 'file':
        return <Download className='w-4 h-4' />;
      case 'link':
        return <Link2 className='w-4 h-4' />;
      default:
        return <FileText className='w-4 h-4' />;
    }
  };

  const totalLessons = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const totalDuration = chapters.reduce(
    (sum, ch) =>
      sum + ch.lessons.reduce((lSum, l) => lSum + (l.duration || 0), 0),
    0,
  );

  const avgRating =
    courseReviews.length > 0
      ? courseReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        courseReviews.length
      : 0;

  // Load enrolled students for this course
  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const response = await enrollmentsApi.getByCourse(course.id);
        if (response.enrollments) {
          const enrichedStudents = response.enrollments.map(
            (enrollment: any) => ({
              id: enrollment.user_id || enrollment.id,
              enrollmentId: enrollment.id,
              name: enrollment.user_name,
              email: enrollment.user_email,
              progress: enrollment.progress || 0,
              enrolled: new Date(enrollment.enrolled_at).toLocaleDateString(),
              lastActive: enrollment.last_active || '1 day ago',
              performance:
                enrollment.progress >= 80
                  ? 'Excellent'
                  : enrollment.progress >= 50
                    ? 'Good'
                    : 'Needs Help',
            }),
          );
          setEnrolledStudents(enrichedStudents);
        }
      } catch (error) {
        console.error('Error loading students:', error);
        toast.error('Failed to load enrolled students');
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [course.id]);

  // Remove a learner from the course
  const handleRemoveLearner = async (learner: any) => {
    if (
      !confirm(
        `Are you sure you want to remove ${learner.name} from this course?`,
      )
    ) {
      return;
    }

    try {
      // Call API to remove learner
      const response = await enrollmentsApi.remove(learner.enrollmentId);

      if (response.success) {
        setEnrolledStudents(
          enrolledStudents.filter(
            (s) => s.enrollmentId !== learner.enrollmentId,
          ),
        );
        toast.success(`${learner.name} has been removed from the course`);
      } else {
        toast.error('Failed to remove learner');
      }
    } catch (error) {
      console.error('Error removing learner:', error);
      toast.error('Failed to remove learner');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
      <div className='container py-8 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className='text-4xl font-extrabold'>{courseData.title}</h1>
              <div className='flex items-center gap-3 mt-2'>
                <Badge
                  variant={
                    course.status === 'published' ? 'default' : 'secondary'
                  }
                >
                  {course.status || 'Draft'}
                </Badge>
                <span className='text-sm text-muted-foreground'>
                  {courseData.category}
                </span>
                <span className='text-sm text-muted-foreground'>•</span>
                <span className='text-sm text-muted-foreground'>
                  {courseData.level}
                </span>
              </div>
            </div>
          </div>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              onClick={() =>
                onNavigate('course-detail', {
                  courseId: course.id,
                  category: course.category,
                  subcategory: course.subcategory,
                })
              }
            >
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </Button>
            <Button
              className='bg-primary'
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Save className='mr-2 h-4 w-4' />
              )}
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Total Learners
                  </p>
                  <p className='text-2xl font-bold'>
                    {course.enrollments || 0}
                  </p>
                </div>
                <Users className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Avg. Rating</p>
                  <p className='text-2xl font-bold'>{avgRating.toFixed(1)}</p>
                </div>
                <Star className='h-8 w-8 text-yellow-500' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Lessons</p>
                  <p className='text-2xl font-bold'>{totalLessons}</p>
                </div>
                <BookOpen className='h-8 w-8 text-purple-500' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Duration</p>
                  <p className='text-2xl font-bold'>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </p>
                </div>
                <Clock className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='curriculum'>Curriculum</TabsTrigger>
            <TabsTrigger value='learners'>Learners</TabsTrigger>
            <TabsTrigger value='reviews'>Reviews</TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Title
                  </label>
                  <Input
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData({ ...courseData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Description
                  </label>
                  <Textarea
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        description: e.target.value,
                      })
                    }
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>
                  What students will learn in this course
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {courseData.goals.map((goal, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 bg-accent rounded-lg'
                  >
                    <Target className='w-5 h-5 text-primary flex-shrink-0' />
                    <Input
                      value={goal}
                      onChange={(e) => {
                        const newGoals = [...courseData.goals];
                        newGoals[index] = e.target.value;
                        setCourseData({ ...courseData, goals: newGoals });
                      }}
                      className='border-0 bg-transparent'
                    />
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        const newGoals = courseData.goals.filter(
                          (_, i) => i !== index,
                        );
                        setCourseData({ ...courseData, goals: newGoals });
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  variant='outline'
                  onClick={() =>
                    setCourseData({
                      ...courseData,
                      goals: [...courseData.goals, 'New learning goal'],
                    })
                  }
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Goal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  Prerequisites for taking this course
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {courseData.requirements.map((req, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 bg-accent rounded-lg'
                  >
                    <Award className='w-5 h-5 text-primary flex-shrink-0' />
                    <Input
                      value={req}
                      onChange={(e) => {
                        const newReqs = [...courseData.requirements];
                        newReqs[index] = e.target.value;
                        setCourseData({ ...courseData, requirements: newReqs });
                      }}
                      className='border-0 bg-transparent'
                    />
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        const newReqs = courseData.requirements.filter(
                          (_, i) => i !== index,
                        );
                        setCourseData({ ...courseData, requirements: newReqs });
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  variant='outline'
                  onClick={() =>
                    setCourseData({
                      ...courseData,
                      requirements: [
                        ...courseData.requirements,
                        'New requirement',
                      ],
                    })
                  }
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Requirement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value='curriculum' className='space-y-6'>
            {/* Help Card - How to Add Content */}
            <Card className='bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
                    <Lightbulb className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-lg mb-2'>
                      📚 How to Add Lesson Content
                    </h3>
                    <p className='text-sm text-gray-700 mb-3'>
                      You've created your course structure! Now add actual
                      content to each lesson:
                    </p>
                    <div className='grid md:grid-cols-3 gap-4'>
                      <div className='bg-white p-4 rounded-lg border border-blue-200'>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className='w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold'>
                            1
                          </div>
                          <p className='font-semibold text-sm'>
                            Hover over a lesson
                          </p>
                        </div>
                        <p className='text-xs text-gray-600'>
                          The Edit button will appear when you hover
                        </p>
                      </div>
                      <div className='bg-white p-4 rounded-lg border border-purple-200'>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className='w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold'>
                            2
                          </div>
                          <p className='font-semibold text-sm'>
                            Click Edit button
                          </p>
                        </div>
                        <p className='text-xs text-gray-600'>
                          Opens the content editor for that lesson
                        </p>
                      </div>
                      <div className='bg-white p-4 rounded-lg border border-green-200'>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className='w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold'>
                            3
                          </div>
                          <p className='font-semibold text-sm'>
                            Add your content
                          </p>
                        </div>
                        <p className='text-xs text-gray-600'>
                          Upload videos, write text, create quizzes, etc.
                        </p>
                      </div>
                    </div>
                    <div className='mt-4 flex items-center gap-6 text-xs'>
                      <div className='flex items-center gap-2'>
                        <Video className='w-4 h-4 text-blue-500' />
                        <span>
                          Video lessons: Upload MP4 files or embed YouTube/Vimeo
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <FileText className='w-4 h-4 text-gray-500' />
                        <span>
                          Text lessons: Rich text editor with images &
                          formatting
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckSquare className='w-4 h-4 text-purple-500' />
                        <span>
                          Quizzes: Multiple choice, true/false, code challenges
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      {chapters.length} chapters • {totalLessons} lessons •{' '}
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                      total
                    </CardDescription>
                  </div>
                  <Button onClick={addChapter}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Chapter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {chapters.map((chapter) => (
                  <Card key={chapter.id} className='border-2'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3 flex-1'>
                          <GripVertical className='w-5 h-5 text-muted-foreground cursor-move' />
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => toggleChapter(chapter.id)}
                          >
                            {chapter.expanded ? (
                              <ChevronDown className='w-5 h-5' />
                            ) : (
                              <ChevronRight className='w-5 h-5' />
                            )}
                          </Button>
                          <Input
                            value={chapter.title}
                            onChange={(e) => {
                              setChapters(
                                chapters.map((ch) =>
                                  ch.id === chapter.id
                                    ? { ...ch, title: e.target.value }
                                    : ch,
                                ),
                              );
                            }}
                            placeholder='Chapter title'
                          />
                          <Badge variant='secondary'>
                            {chapter.lessons.length} lessons
                          </Badge>
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => deleteChapter(chapter.id)}
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {chapter.expanded && (
                      <CardContent className='space-y-2'>
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className='flex items-center gap-3 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors group'
                          >
                            <GripVertical className='w-4 h-4 text-muted-foreground cursor-move' />
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                lesson.type === 'video'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : lesson.type === 'quiz'
                                    ? 'bg-purple-500/10 text-purple-500'
                                    : lesson.type === 'interactive'
                                      ? 'bg-green-500/10 text-green-500'
                                      : 'bg-gray-500/10 text-gray-500'
                              }`}
                            >
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium truncate'>
                                {lesson.title}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {lesson.type} • {lesson.duration} min
                              </p>
                            </div>
                            <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  onNavigate('lesson-editor', {
                                    lesson,
                                    course,
                                  })
                                }
                              >
                                <Edit className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  deleteLesson(chapter.id, lesson.id)
                                }
                              >
                                <Trash2 className='w-4 h-4 text-red-500' />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className='flex gap-2 pt-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => addLesson(chapter.id, 'video')}
                          >
                            <Video className='mr-2 h-4 w-4' />
                            Video
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => addLesson(chapter.id, 'text')}
                          >
                            <FileText className='mr-2 h-4 w-4' />
                            Text
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => addLesson(chapter.id, 'quiz')}
                          >
                            <CheckSquare className='mr-2 h-4 w-4' />
                            Quiz
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => addLesson(chapter.id, 'interactive')}
                          >
                            <Puzzle className='mr-2 h-4 w-4' />
                            Interactive
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => addLesson(chapter.id, 'problem')}
                          >
                            <Target className='mr-2 h-4 w-4' />
                            Problem
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value='learners' className='space-y-6'>
            <CourseLearnersTab
              course={course}
              enrolledStudents={enrolledStudents}
              loadingStudents={loadingStudents}
              handleRemoveLearner={handleRemoveLearner}
              onNavigateToProfile={(learnerId, learnerName) => {
                onNavigate('learner-profile', { learnerId, learnerName });
              }}
            />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value='reviews' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Course Reviews</CardTitle>
                <CardDescription>
                  {courseReviews.length > 0 && (
                    <>
                      Average rating: {avgRating.toFixed(1)} ⭐ (
                      {courseReviews.length} reviews)
                    </>
                  )}
                  {courseReviews.length === 0 && <>No reviews yet</>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewSystem
                  courseId={course.id}
                  reviews={courseReviews}
                  onReviewsUpdate={(updated) => setCourseReviews(updated)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value='settings' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Configure how your course appears and behaves
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Category
                    </label>
                    <Input
                      value={courseData.category}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          category: e.target.value,
                        })
                      }
                      placeholder='e.g. Computer Science'
                    />
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium mb-2 block">Level</label>
                    <Select
                      value={courseData.level}
                      onValueChange={(value) => setCourseData({ ...courseData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Language
                    </label>
                    <Select
                      value={courseData.language}
                      onValueChange={(value) =>
                        setCourseData({ ...courseData, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select language' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='English'>English</SelectItem>
                        <SelectItem value='Spanish'>Spanish</SelectItem>
                        <SelectItem value='French'>French</SelectItem>
                        <SelectItem value='German'>German</SelectItem>
                        <SelectItem value='Chinese'>Chinese</SelectItem>
                        <SelectItem value='Japanese'>Japanese</SelectItem>
                        <SelectItem value='Portuguese'>Portuguese</SelectItem>
                        <SelectItem value='Russian'>Russian</SelectItem>
                        <SelectItem value='Arabic'>Arabic</SelectItem>
                        <SelectItem value='Hindi'>Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Price
                    </label>
                    <Input type='number' placeholder='49.99' />
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Course Thumbnail
                  </label>
                  <div className='border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent transition-colors cursor-pointer'>
                    <Upload className='w-12 h-12 mx-auto mb-3 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>
                      Click to upload or drag and drop
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>

                <div className='pt-6 border-t'>
                  <Button variant='destructive'>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
