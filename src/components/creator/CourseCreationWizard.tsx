import React, { useState } from 'react';
import { coursesApi, storageApi, lessonsApi } from '../../utils/api-client';
import {
  BookOpen,
  Video,
  FileText,
  Code,
  CheckCircle,
  DollarSign,
  Settings,
  Eye,
  Upload,
  X,
  Plus,
  GripVertical,
  Image as ImageIcon,
  Info,
  ArrowRight,
  Heading,
  Type,
  Trash2,
  Save,
  Edit,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  AlertCircle,
  Lightbulb,
  Calculator,
  ChevronDown,
  ChevronUp,
  Copy,
  Play,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { CollaborationPanel } from './CollaborationPanel';
import { CollaborativePreview } from './CollaborativePreview';
import { AICourseGenerator } from './AICourseGenerator';

interface CourseCreationWizardProps {
  onSaveDraftComplete?: (courseData: any) => void;
  onPublishComplete?: (courseData: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

// ─── helper: map a wizard lesson + its blocks → /lessons/ POST body ──────────
function buildLessonApiPayload(
  lesson: any,
  sectionId: string,
  position: number,
) {
  const blocks: any[] = lesson.blocks || [];

  const blocksOfType = (type: string) => blocks.filter((b) => b.type === type);

  // Determine the primary kind from the lesson's blocks (first block wins)
  const primaryBlock = blocks[0];
  const kind: string = primaryBlock?.type ?? lesson.type ?? 'text';

  return {
    section_id: sectionId,
    title: lesson.title || 'Untitled Lesson',
    kind,
    content: '',
    position,
    duration_minutes: lesson.duration
      ? parseInt(String(lesson.duration), 10) || 0
      : 0,
    is_free: false,
    xp_reward: lesson.xp ?? 100,
    difficulty: (lesson.difficulty || 'beginner').toLowerCase(),

    heading_content: blocksOfType('heading').map((b, i) => ({
      position: i,
      text: b.content.text || '',
      level: b.content.level || 1,
    })),

    text_content: blocksOfType('text').map((b, i) => ({
      position: i,
      body: b.content.text || '',
      estimated_read_minutes: 0,
      attachment_ids: [],
    })),

    video_content: blocksOfType('video').map((b, i) => ({
      position: i,
      external_url: b.content.url || '',
      duration_seconds: 0,
      allow_download: true,
      ...(b.content.videoId ? { video_id: b.content.videoId } : {}),
    })),

    image_content: blocksOfType('image').map((b, i) => ({
      position: i,
      caption: b.content.caption || '',
      alt_text: b.content.alt || '',
      ...(b.content.imageId ? { image_id: b.content.imageId } : {}),
    })),

    code_content: blocksOfType('code').map((b, i) => ({
      position: i,
      code: b.content.code || '',
      language: b.content.language || 'javascript',
      show_line_numbers: true,
    })),

    hint_content: blocksOfType('hint').map((b, i) => ({
      position: i,
      text: b.content.text || '',
      is_collapsible: true,
    })),

    callout_content: blocksOfType('callout').map((b, i) => ({
      position: i,
      text: b.content.text || '',
      callout_type: b.content.type || 'info',
    })),

    quiz_content: blocksOfType('quiz').map((b, i) => ({
      position: i,
      passing_score: 70,
      max_attempts: 3,
      time_limit_minutes: 0,
      shuffle_questions: false,
      show_correct_answers: true,
      questions: [
        {
          position: 0,
          question_type: b.content.questionType || 'single_choice',
          text: b.content.question || '',
          explanation: b.content.explanation || '',
          points: b.content.points || 1,
          options: (b.content.options || []).map((opt: string, j: number) => ({
            text: opt,
            is_correct: (b.content.correctAnswers || []).includes(j),
          })),
        },
      ],
    })),

    problem_content: blocksOfType('problem').map((b, i) => ({
      position: i,
      statement: b.content.question || '',
      starter_code: '',
      solution_code: b.content.solution || '',
      language: 'python',
      time_limit_seconds: 30,
      memory_limit_mb: 256,
      hints: b.content.hints || [],
      test_cases: [],
    })),
  };
}

export function CourseCreationWizard({
  onSaveDraftComplete,
  onPublishComplete,
  onCancel,
  initialData,
}: CourseCreationWizardProps) {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [creationMode, setCreationMode] = useState<'choice' | 'manual' | 'ai'>(
    'choice',
  );
  const [currentStep, setCurrentStep] = useState(1);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Lesson editor modal state
  const [editingLessonModal, setEditingLessonModal] = useState<{
    sectionId: string;
    lesson: any;
    isNew?: boolean;
  } | null>(null);
  // Local object-URL used only for the <img> preview (revoked when cleared)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [courseData, setCourseData] = useState({
    // Step 1: Basic Info
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    level: initialData?.level || '',
    language: initialData?.language || 'English',
    thumbnail: initialData?.thumbnail || (null as File | null),
    // Presigned POST data returned by storages/start — S3 upload happens at save time
    thumbnailStorage: null as {
      id: string;
      url: string;
      fields: Record<string, string>;
    } | null,
    previewVideo: initialData?.previewVideo || (null as File | null),
    tags: initialData?.tags || [''], // New: Course tags

    // Step 2: Content Details (Enhanced)
    courseGoals: initialData?.courseGoals || [''], // New: High-level learner outcomes
    learningObjectives: initialData?.learningObjectives || [''],
    prerequisites: initialData?.prerequisites || [''], // New: Enhanced prerequisites field
    requirements: initialData?.requirements || [''],
    targetAudience: initialData?.targetAudience || '',

    // Step 3: Curriculum (Enhanced with module support)
    useModules: initialData?.useModules || false, // Toggle between sections and modules
    modules: initialData?.modules || [
      // New: Enhanced module structure
      {
        id: '1',
        title: '',
        description: '',
        outcome: '',
        lessons: [],
        order: 1,
      },
    ],
    sections: initialData?.sections || [
      {
        id: '1',
        title: '',
        lessons: [],
      },
    ],
    assessments: initialData?.assessments || [], // New: Course-level assessments

    // Step 4: Pricing
    priceType: initialData?.priceType || 'paid',
    price: initialData?.price || '',
    currency: initialData?.currency || 'USD',
    discountPrice: initialData?.discountPrice || '',

    // Step 5: Settings
    published: initialData?.published || false,
    allowReviews: initialData?.allowReviews || true,
    enableCertificate: initialData?.enableCertificate || true,
    enableDiscussions: initialData?.enableDiscussions || true,
    maxStudents: initialData?.maxStudents || '',
  });

  const [collaborators, setCollaborators] = useState<
    Array<{ email: string; role: string }>
  >(
    Array.isArray(initialData?.collaborators)
      ? initialData.collaborators
          .map((c: any) => ({
            email: c.user?.email ?? c.email ?? '',
            role: c.role,
          }))
          .filter((c: { email: string }) => c.email)
      : [],
  );

  const steps = [
    { id: 1, name: 'Basic Info', icon: BookOpen },
    { id: 2, name: 'Content Details', icon: Settings },
    { id: 3, name: 'Curriculum', icon: FileText },
    { id: 4, name: 'Pricing', icon: DollarSign },
    { id: 5, name: 'Publish', icon: CheckCircle },
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const contentTypes = ['Video', 'Text', 'Quiz', 'Code Exercise', 'Assignment'];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ];

  const handleThumbnailFile = async (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, WebP, or AVIF image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    // Revoke any previous preview URL to avoid memory leaks
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    setCourseData((prev) => ({
      ...prev,
      thumbnail: file,
      thumbnailStorage: null,
    }));
    setIsUploadingThumbnail(true);

    try {
      // Call storages/start — get the presigned S3 details (id, url, fields)
      // The actual S3 upload happens when the user clicks Save / Publish
      const storageResult = await storageApi.start({
        file_type: file.type.split('/')[0], // e.g. "image"
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });
      setCourseData((prev) => ({ ...prev, thumbnailStorage: storageResult }));
    } catch (error) {
      console.error('Error preparing thumbnail:', error);
      toast.error('Failed to prepare thumbnail. Please try again.');
      URL.revokeObjectURL(previewUrl);
      setThumbnailPreview(null);
      setCourseData((prev) => ({
        ...prev,
        thumbnail: null,
        thumbnailStorage: null,
      }));
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!courseData.title.trim()) {
          toast.error('Course title is required');
          return false;
        }
        if (!courseData.description.trim()) {
          toast.error('Course description is required');
          return false;
        }
        if (!courseData.category) {
          toast.error('Please select a category');
          return false;
        }
        if (!courseData.level) {
          toast.error('Please select a level');
          return false;
        }
        return true;
      case 2: {
        const hasGoal = courseData.courseGoals.some((g) => g.trim());
        if (!hasGoal) {
          toast.error('Please add at least one course goal');
          return false;
        }
        const hasObjective = courseData.learningObjectives.some((o) =>
          o.trim(),
        );
        if (!hasObjective) {
          toast.error('Please add at least one learning objective');
          return false;
        }
        return true;
      }
      case 3: {
        const hasSection = courseData.sections.some((s) => s.title.trim());
        if (!hasSection) {
          toast.error('Please add at least one section');
          return false;
        }
        const hasLessons = courseData.sections.some(
          (s) => s.lessons.length > 0,
        );
        if (!hasLessons) {
          toast.error('Please add at least one lesson to a section');
          return false;
        }
        return true;
      }
      case 4:
        if (courseData.priceType === 'paid' && !courseData.price) {
          toast.error('Please set a price');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const addSection = () => {
    setCourseData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now().toString(),
          title: '',
          lessons: [],
        },
      ],
    }));
  };

  // Track which lessons are expanded to show content blocks
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(),
  );
  const toggleLessonExpand = (lessonId: string) =>
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });

  const addLesson = (sectionId: string, type = 'video') => {
    const newId = Date.now().toString();
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  id: newId,
                  title: `New ${label} Lesson`,
                  type,
                  duration: '',
                  content: '',
                  blocks: [] as { id: string; type: string; content: string }[],
                },
              ],
            }
          : section,
      ),
    }));
    // Auto-expand the new lesson so user can start editing
    setExpandedLessons((prev) => new Set(prev).add(newId));
  };

  const addBlockToLesson = (
    sectionId: string,
    lessonId: string,
    blockType: string,
  ) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l: any) =>
                l.id === lessonId
                  ? {
                      ...l,
                      blocks: [
                        ...(l.blocks || []),
                        {
                          id: Date.now().toString(),
                          type: blockType,
                          content: '',
                        },
                      ],
                    }
                  : l,
              ),
            }
          : s,
      ),
    }));
  };

  const updateLessonBlock = (
    sectionId: string,
    lessonId: string,
    blockId: string,
    content: string,
  ) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l: any) =>
                l.id === lessonId
                  ? {
                      ...l,
                      blocks: (l.blocks || []).map((b: any) =>
                        b.id === blockId ? { ...b, content } : b,
                      ),
                    }
                  : l,
              ),
            }
          : s,
      ),
    }));
  };

  const removeLessonBlock = (
    sectionId: string,
    lessonId: string,
    blockId: string,
  ) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l: any) =>
                l.id === lessonId
                  ? {
                      ...l,
                      blocks: (l.blocks || []).filter(
                        (b: any) => b.id !== blockId,
                      ),
                    }
                  : l,
              ),
            }
          : s,
      ),
    }));
  };

  const removeSection = (sectionId: string) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter((l) => l.id !== lessonId),
            }
          : section,
      ),
    }));
  };

  // Save changes from the lesson editor modal back into wizard state
  const saveLessonFromModal = (updatedLesson: any) => {
    if (!editingLessonModal) return;
    const { sectionId, isNew } = editingLessonModal;
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((s: any) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: isNew
                ? [...s.lessons, { ...updatedLesson }]
                : s.lessons.map((l: any) =>
                    l.id === updatedLesson.id ? { ...l, ...updatedLesson } : l,
                  ),
            }
          : s,
      ),
    }));
    setEditingLessonModal(null);
    toast.success(isNew ? 'Lesson added' : 'Lesson updated');
  };

  const handleSubmitCourse = async (mode: 'draft' | 'publish') => {
    // Basic validation - only require title
    if (!courseData.title.trim()) {
      toast.error('Course title is required to save as draft');
      return;
    }

    setIsSavingDraft(true);

    try {
      // Upload thumbnail to S3 if the user selected one
      let coverImageId: string | undefined;
      if (courseData.thumbnail && courseData.thumbnailStorage) {
        const { id, url, fields } = courseData.thumbnailStorage;
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) =>
          formData.append(key, value),
        );
        formData.append('file', courseData.thumbnail);
        await fetch(url, { method: 'POST', body: formData });
        coverImageId = id;
      }

      const result = await coursesApi.create({
        title: courseData.title,
        sub_title: courseData.subtitle || undefined,
        description: courseData.description || courseData.subtitle || '',
        category: courseData.category || 'general',
        level: courseData.level || undefined,
        org_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        is_public: false,
        subcategory: courseData.subcategory || undefined,
        price:
          courseData.priceType === 'paid' && courseData.price
            ? parseFloat(courseData.price)
            : 0,
        discount:
          courseData.priceType === 'paid' && courseData.discountPrice
            ? parseFloat(courseData.discountPrice)
            : undefined,
        cover_image: coverImageId,
        currency: courseData.currency || 'USD',
        estimated_hours: 0,
        tags: courseData.tags.filter((t) => t.trim()),
        status: 'draft',
        course_goals: courseData.courseGoals.filter((g) => g.trim()),
        learning_objectives: courseData.learningObjectives.filter((o) =>
          o.trim(),
        ),
        prerequisites: courseData.requirements.filter((p) => p.trim()),
        who_this_course_is_for: courseData.targetAudience || undefined,
        enable_discussions: courseData.enableDiscussions,
        enable_reviews: courseData.allowReviews,
        enable_certificates: courseData.enableCertificate,
        maximum_students: courseData.maxStudents
          ? parseInt(courseData.maxStudents)
          : 0,
        collaborators: collaborators,
        sections: courseData.sections
          .filter((s: any) => s.title.trim())
          .map((s: any) => ({ title: s.title })),
      });

      // ── Create lessons for each section ──────────────────────────
      // Prefer sections returned by the bulk create response. If the backend
      // does not embed sections there, fetch the created course to obtain
      // section ids needed for lesson creation.
      let createdSections: any[] = (result as any).sections ?? [];
      const createdCourseId = (result as any)?.id;

      if (createdSections.length === 0 && createdCourseId) {
        try {
          const createdCourse = await coursesApi.getForEdit(createdCourseId);
          createdSections = (createdCourse as any)?.sections ?? [];
        } catch (fetchSectionsError) {
          console.error(
            'Error fetching created course sections for lesson creation:',
            fetchSectionsError,
          );
        }
      }

      if (createdSections.length > 0) {
        const filteredSections = courseData.sections.filter((s: any) =>
          s.title.trim(),
        );

        for (let si = 0; si < filteredSections.length; si++) {
          const wizardSection = filteredSections[si];
          const backendSection = createdSections[si];
          if (!backendSection?.id) continue;

          const lessonsToCreate = wizardSection.lessons;

          await Promise.all(
            lessonsToCreate.map((lesson: any, li: number) =>
              lessonsApi.create(
                buildLessonApiPayload(lesson, backendSection.id, li),
              ),
            ),
          );
        }
      }

      if (mode === 'draft') {
        toast.success('Course saved as draft!');
        onSaveDraftComplete?.(result);
      } else {
        toast.success(
          'Course saved as draft! Please edit the course to add your content and publish when ready.',
          { duration: 6000 },
        );
        onPublishComplete?.(result);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(
        `Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='mb-8 flex items-start justify-between'>
          <div>
            <h1 className='text-4xl font-extrabold text-gray-900 mb-2'>
              Create New Course
            </h1>
            <p className='text-gray-600'>
              Follow the steps below to create your course
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => handleSubmitCourse('draft')}
              disabled={isSavingDraft}
              className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              {isSavingDraft ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
              title='Close wizard'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-6'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className='flex flex-col items-center flex-1'>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      currentStep === step.id
                        ? 'bg-[#395192] text-white'
                        : currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className='w-6 h-6' />
                    ) : (
                      <step.icon className='w-6 h-6' />
                    )}
                  </div>
                  <span className='text-sm font-medium text-gray-700 text-center'>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-6'>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Basic Information
              </h2>

              {/* Course Title */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Course Title *
                </Label>
                <Input
                  type='text'
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder='e.g., Complete React Developer Course 2024'
                />
              </div>

              {/* Subtitle */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subtitle
                </Label>
                <Input
                  type='text'
                  value={courseData.subtitle}
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder='Brief tagline for your course'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent'
                />
              </div>

              {/* Description */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Course Description *
                </Label>
                <textarea
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={6}
                  placeholder='Describe what students will learn in this course...'
                  className='w-full px-4 py-3 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none'
                />
              </div>

              {/* Category & Subcategory */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category *
                  </Label>
                  <Select
                    value={courseData.category}
                    onValueChange={(value) =>
                      setCourseData((prev) => ({
                        ...prev,
                        category: value,
                        subcategory: '',
                      }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className='block text-sm font-medium text-gray-700 mb-2'>
                    Subcategory
                  </Label>
                  <Select
                    value={courseData.subcategory}
                    onValueChange={(value) =>
                      setCourseData((prev) => ({ ...prev, subcategory: value }))
                    }
                    disabled={!courseData.category}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a subcategory' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find((cat) => cat.name === courseData.category)
                        ?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Level & Language */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium text-gray-700 mb-2'>
                    Level *
                  </Label>
                  <Select
                    value={courseData.level}
                    onValueChange={(value) =>
                      setCourseData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select difficulty level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                      <SelectItem value='all_levels'>All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className='block text-sm font-medium text-gray-700 mb-2'>
                    Language
                  </Label>
                  <Select
                    value={courseData.language}
                    onValueChange={(value) =>
                      setCourseData((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='English'>English</SelectItem>
                      <SelectItem value='Spanish'>Spanish</SelectItem>
                      <SelectItem value='French'>French</SelectItem>
                      <SelectItem value='German'>German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Course Thumbnail
                </Label>

                {/* Preview: show selected image before upload */}
                {thumbnailPreview && (
                  <div className='relative mb-3 rounded-[8px] overflow-hidden border border-gray-200 w-full max-w-sm'>
                    <img
                      src={thumbnailPreview}
                      alt='Course thumbnail preview'
                      className='w-full object-cover aspect-video'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        URL.revokeObjectURL(thumbnailPreview);
                        setThumbnailPreview(null);
                        setCourseData((prev) => ({
                          ...prev,
                          thumbnail: null,
                          thumbnailStorage: null,
                        }));
                      }}
                      className='absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                )}

                <div
                  className={`border-2 border-dashed rounded-[8px] p-8 text-center transition-colors ${
                    isDraggingThumbnail
                      ? 'border-[#395192] bg-[#395192]/5'
                      : 'border-gray-300 hover:border-[#395192]'
                  } ${isUploadingThumbnail ? 'opacity-60 pointer-events-none' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingThumbnail(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDraggingThumbnail(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingThumbnail(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingThumbnail(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleThumbnailFile(file);
                  }}
                >
                  {isUploadingThumbnail ? (
                    <div className='flex flex-col items-center gap-2'>
                      <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#395192]' />
                      <p className='text-sm text-gray-500'>
                        Preparing thumbnail…
                      </p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                      <input
                        type='file'
                        accept='image/jpeg,image/png,image/webp,image/avif'
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            handleThumbnailFile(e.target.files[0]);
                        }}
                        className='hidden'
                        id='thumbnail-upload'
                      />
                      <label
                        htmlFor='thumbnail-upload'
                        className='cursor-pointer'
                      >
                        <p className='text-gray-700 mb-1'>
                          <span className='text-[#395192] hover:underline'>
                            {thumbnailPreview
                              ? 'Replace image'
                              : 'Click to upload'}
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p className='text-sm text-gray-500'>
                          JPEG, PNG, WebP or AVIF · max 5 MB · recommended
                          1280×720
                        </p>
                      </label>
                      {courseData.thumbnail && thumbnailPreview && (
                        <p className='mt-2 text-sm text-green-600'>
                          ✓ {courseData.thumbnail.name}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content Details */}
          {currentStep === 2 && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Content Details
              </h2>

              {/* Course Goals */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Course Goals (High-Level Outcomes) *
                </Label>
                <p className='text-sm text-gray-500 mb-3'>
                  What will learners be able to do by the end of this course?
                </p>
                {courseData.courseGoals.map((goal, index) => (
                  <div key={index} className='flex gap-2 mb-2'>
                    <Input
                      type='text'
                      value={goal}
                      onChange={(e) => {
                        setCourseData((prev) => ({
                          ...prev,
                          courseGoals: prev.courseGoals.map((g, i) =>
                            i === index ? e.target.value : g,
                          ),
                        }));
                      }}
                      placeholder={`Course goal ${index + 1}`}
                      className='flex-1'
                    />
                    {courseData.courseGoals.length > 1 && (
                      <button
                        onClick={() => {
                          setCourseData((prev) => ({
                            ...prev,
                            courseGoals: prev.courseGoals.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }}
                        className='p-2 text-red-600 hover:bg-red-50 rounded'
                      >
                        <X className='w-5 h-5' />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCourseData((prev) => ({
                      ...prev,
                      courseGoals: [...prev.courseGoals, ''],
                    }));
                  }}
                  className='text-[#395192] hover:underline text-sm'
                >
                  + Add more course goals
                </button>
              </div>

              {/* Learning Objectives */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Learning Objectives *
                </Label>
                <p className='text-sm text-gray-500 mb-3'>
                  Specific skills and knowledge students will gain
                </p>
                {courseData.learningObjectives.map((obj, index) => (
                  <div key={index} className='flex gap-2 mb-2'>
                    <Input
                      type='text'
                      value={obj}
                      onChange={(e) => {
                        setCourseData((prev) => ({
                          ...prev,
                          learningObjectives: prev.learningObjectives.map(
                            (o, i) => (i === index ? e.target.value : o),
                          ),
                        }));
                      }}
                      placeholder={`Learning objective ${index + 1}`}
                      className='flex-1'
                    />
                    {courseData.learningObjectives.length > 1 && (
                      <button
                        onClick={() => {
                          setCourseData((prev) => ({
                            ...prev,
                            learningObjectives: prev.learningObjectives.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }}
                        className='p-2 text-red-600 hover:bg-red-50 rounded'
                      >
                        <X className='w-5 h-5' />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCourseData((prev) => ({
                      ...prev,
                      learningObjectives: [...prev.learningObjectives, ''],
                    }));
                  }}
                  className='text-[#395192] hover:underline text-sm'
                >
                  + Add more objectives
                </button>
              </div>

              {/* Requirements */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Prerequisites/Requirements
                </Label>
                {courseData.requirements.map((req, index) => (
                  <div key={index} className='flex gap-2 mb-2'>
                    <Input
                      type='text'
                      value={req}
                      onChange={(e) => {
                        setCourseData((prev) => ({
                          ...prev,
                          requirements: prev.requirements.map((r, i) =>
                            i === index ? e.target.value : r,
                          ),
                        }));
                      }}
                      placeholder={`Requirement ${index + 1}`}
                      className='flex-1'
                    />
                    {courseData.requirements.length > 1 && (
                      <button
                        onClick={() => {
                          setCourseData((prev) => ({
                            ...prev,
                            requirements: prev.requirements.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }}
                        className='p-2 text-red-600 hover:bg-red-50 rounded'
                      >
                        <X className='w-5 h-5' />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCourseData((prev) => ({
                      ...prev,
                      requirements: [...prev.requirements, ''],
                    }));
                  }}
                  className='text-[#395192] hover:underline text-sm'
                >
                  + Add more requirements
                </button>
              </div>

              {/* Target Audience */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Who is this course for?
                </Label>
                <textarea
                  value={courseData.targetAudience}
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      targetAudience: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder='Describe your ideal student...'
                  className='w-full px-4 py-3 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-[#395192] resize-none'
                />
              </div>
            </div>
          )}

          {/* Step 3: Curriculum */}
          {currentStep === 3 && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Course Curriculum
                  </h2>
                  <p className='text-gray-600'>
                    Structure your course into sections and lessons
                  </p>
                </div>
                <button
                  onClick={addSection}
                  className='flex items-center gap-2 px-4 py-2 bg-[#395192] text-white rounded-[8px] hover:bg-[#2d4178]'
                >
                  <Plus className='w-5 h-5' />
                  Add Section
                </button>
              </div>

              {courseData.sections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className='border border-gray-200 rounded-[8px] p-6'
                >
                  <div className='flex items-start gap-4 mb-4'>
                    <GripVertical className='w-5 h-5 text-gray-400 mt-3 cursor-move' />
                    <div className='flex-1'>
                      <Input
                        type='text'
                        value={section.title}
                        onChange={(e) => {
                          setCourseData((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s) =>
                              s.id === section.id
                                ? { ...s, title: e.target.value }
                                : s,
                            ),
                          }));
                        }}
                        placeholder={`Section ${sectionIndex + 1} Title (e.g., Introduction to React)`}
                      />
                    </div>
                    <button
                      onClick={() => removeSection(section.id)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className='ml-9 space-y-2'>
                    {section.lessons.map((lesson: any) => {
                      const blocks: any[] = lesson.blocks || [];

                      return (
                        <div
                          key={lesson.id}
                          className='rounded-lg border border-gray-200 bg-white'
                        >
                          {/* Compact lesson row */}
                          <div className='flex items-center gap-3 p-3 group'>
                            <GripVertical className='w-4 h-4 text-gray-400 cursor-move' />
                            <div className='w-8 h-8 rounded-lg flex items-center justify-center bg-[#395192]/10 text-[#395192]'>
                              <BookOpen className='w-4 h-4' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium truncate text-sm'>
                                {lesson.title || 'Untitled Lesson'}
                              </p>
                              {lesson.duration && (
                                <p className='text-xs text-gray-500'>
                                  {lesson.duration}
                                </p>
                              )}
                            </div>
                            <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                              <button
                                type='button'
                                onClick={() =>
                                  setEditingLessonModal({
                                    sectionId: section.id,
                                    lesson,
                                  })
                                }
                                className='p-1.5 rounded hover:bg-gray-100 text-gray-500'
                                title='Edit lesson'
                              >
                                <Edit className='w-4 h-4' />
                              </button>
                              <button
                                type='button'
                                onClick={() =>
                                  removeLesson(section.id, lesson.id)
                                }
                                className='p-1.5 rounded hover:bg-red-50 text-red-500'
                                title='Delete'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </div>
                          </div>

                          {/* Expanded editor — now handled by WizardLessonModal */}
                          {false && (
                            <div className='px-4 pb-4 pt-2 border-t border-gray-100 space-y-3'>
                              {/* Title + type + duration row */}
                              <div className='flex gap-3'>
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => {
                                    setCourseData((prev) => ({
                                      ...prev,
                                      sections: prev.sections.map((s: any) =>
                                        s.id === section.id
                                          ? {
                                              ...s,
                                              lessons: s.lessons.map(
                                                (l: any) =>
                                                  l.id === lesson.id
                                                    ? {
                                                        ...l,
                                                        title: e.target.value,
                                                      }
                                                    : l,
                                              ),
                                            }
                                          : s,
                                      ),
                                    }));
                                  }}
                                  placeholder='Lesson title'
                                  className='flex-1'
                                />
                                <Input
                                  value={lesson.duration}
                                  onChange={(e) => {
                                    setCourseData((prev) => ({
                                      ...prev,
                                      sections: prev.sections.map((s: any) =>
                                        s.id === section.id
                                          ? {
                                              ...s,
                                              lessons: s.lessons.map(
                                                (l: any) =>
                                                  l.id === lesson.id
                                                    ? {
                                                        ...l,
                                                        duration:
                                                          e.target.value,
                                                      }
                                                    : l,
                                              ),
                                            }
                                          : s,
                                      ),
                                    }));
                                  }}
                                  placeholder='Duration (e.g. 10 min)'
                                  className='w-36'
                                />
                              </div>

                              {/* Content blocks */}
                              {blocks.map((block: any) => (
                                <div
                                  key={block.id}
                                  className='flex items-start gap-2'
                                >
                                  <div className='mt-2 shrink-0'>
                                    {block.type === 'heading' && (
                                      <Heading className='w-4 h-4 text-purple-500' />
                                    )}
                                    {block.type === 'text' && (
                                      <Type className='w-4 h-4 text-blue-500' />
                                    )}
                                    {block.type === 'video' && (
                                      <Video className='w-4 h-4 text-red-500' />
                                    )}
                                    {block.type === 'code' && (
                                      <Code className='w-4 h-4 text-green-500' />
                                    )}
                                  </div>
                                  {block.type === 'heading' ? (
                                    <Input
                                      value={block.content}
                                      onChange={(e) =>
                                        updateLessonBlock(
                                          section.id,
                                          lesson.id,
                                          block.id,
                                          e.target.value,
                                        )
                                      }
                                      placeholder='Heading text…'
                                      className='flex-1 font-semibold'
                                    />
                                  ) : block.type === 'text' ? (
                                    <textarea
                                      value={block.content}
                                      onChange={(e) =>
                                        updateLessonBlock(
                                          section.id,
                                          lesson.id,
                                          block.id,
                                          e.target.value,
                                        )
                                      }
                                      placeholder='Write your content…'
                                      rows={3}
                                      className='flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#395192]'
                                    />
                                  ) : block.type === 'video' ? (
                                    <Input
                                      value={block.content}
                                      onChange={(e) =>
                                        updateLessonBlock(
                                          section.id,
                                          lesson.id,
                                          block.id,
                                          e.target.value,
                                        )
                                      }
                                      placeholder='Video URL (YouTube, Vimeo, etc.)'
                                      className='flex-1'
                                    />
                                  ) : block.type === 'code' ? (
                                    <textarea
                                      value={block.content}
                                      onChange={(e) =>
                                        updateLessonBlock(
                                          section.id,
                                          lesson.id,
                                          block.id,
                                          e.target.value,
                                        )
                                      }
                                      placeholder='// Enter your code…'
                                      rows={4}
                                      className='flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono resize-y bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#395192]'
                                    />
                                  ) : null}
                                  <button
                                    type='button'
                                    onClick={() =>
                                      removeLessonBlock(
                                        section.id,
                                        lesson.id,
                                        block.id,
                                      )
                                    }
                                    className='mt-2 p-1 text-gray-400 hover:text-red-500 rounded'
                                  >
                                    <Trash2 className='w-3.5 h-3.5' />
                                  </button>
                                </div>
                              ))}

                              {/* Add block buttons */}
                              <div className='flex items-center gap-2 pt-1'>
                                <span className='text-xs text-gray-400 mr-1'>
                                  Add:
                                </span>
                                {[
                                  {
                                    type: 'heading',
                                    icon: Heading,
                                    label: 'Heading',
                                  },
                                  { type: 'text', icon: Type, label: 'Text' },
                                  {
                                    type: 'video',
                                    icon: Video,
                                    label: 'Video',
                                  },
                                  { type: 'code', icon: Code, label: 'Code' },
                                ].map((b) => (
                                  <button
                                    key={b.type}
                                    type='button'
                                    onClick={() =>
                                      addBlockToLesson(
                                        section.id,
                                        lesson.id,
                                        b.type,
                                      )
                                    }
                                    className='flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors'
                                  >
                                    <b.icon className='w-3 h-3' />
                                    {b.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Lesson button */}
                    <button
                      type='button'
                      onClick={() => {
                        setEditingLessonModal({
                          sectionId: section.id,
                          isNew: true,
                          lesson: {
                            id: Date.now().toString(),
                            title: '',
                            type: 'video',
                            duration: '',
                            blocks: [],
                          },
                        });
                      }}
                      className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      <Plus className='w-4 h-4' />
                      Add Lesson
                    </button>
                  </div>
                </div>
              ))}

              {courseData.sections.length === 0 && (
                <div className='text-center py-12 bg-gray-50 rounded-[8px]'>
                  <FileText className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                  <p className='text-gray-600 mb-4'>
                    No sections yet. Add your first section to get started.
                  </p>
                  <button
                    onClick={addSection}
                    className='px-4 py-2 bg-[#395192] text-white rounded-[8px] hover:bg-[#2d4178]'
                  >
                    Add Section
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Pricing</h2>

              {/* Price Type */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-3'>
                  Course Type *
                </Label>
                <div className='grid grid-cols-2 gap-4'>
                  <button
                    onClick={() =>
                      setCourseData((prev) => ({ ...prev, priceType: 'free' }))
                    }
                    className={`p-4 border-2 rounded-[8px] text-left transition-all ${
                      courseData.priceType === 'free'
                        ? 'border-[#395192] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className='font-semibold text-gray-900 mb-1'>Free</h3>
                    <p className='text-sm text-gray-600'>
                      Anyone can enroll for free
                    </p>
                  </button>
                  <button
                    onClick={() =>
                      setCourseData((prev) => ({ ...prev, priceType: 'paid' }))
                    }
                    className={`p-4 border-2 rounded-[8px] text-left transition-all ${
                      courseData.priceType === 'paid'
                        ? 'border-[#395192] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className='font-semibold text-gray-900 mb-1'>Paid</h3>
                    <p className='text-sm text-gray-600'>
                      Students must pay to enroll
                    </p>
                  </button>
                </div>
              </div>

              {/* Pricing Details */}
              {courseData.priceType === 'paid' && (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='block text-sm font-medium text-gray-700 mb-2'>
                        Price
                      </Label>
                      <div className='flex gap-2'>
                        <Select
                          value={courseData.currency}
                          onValueChange={(value) =>
                            setCourseData((prev) => ({
                              ...prev,
                              currency: value,
                            }))
                          }
                        >
                          <SelectTrigger className='w-[100px]'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='USD'>USD</SelectItem>
                            <SelectItem value='EUR'>EUR</SelectItem>
                            <SelectItem value='GBP'>GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type='number'
                          value={courseData.price}
                          onChange={(e) =>
                            setCourseData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          placeholder='49.99'
                          className='flex-1'
                        />
                      </div>
                    </div>
                    <div>
                      <Label className='block text-sm font-medium text-gray-700 mb-2'>
                        Discount Price (Optional)
                      </Label>
                      <Input
                        type='number'
                        value={courseData.discountPrice}
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            discountPrice: e.target.value,
                          }))
                        }
                        placeholder='29.99'
                        className='w-full'
                      />
                    </div>
                  </div>

                  {/* Pricing Preview */}
                  {courseData.price && (
                    <div className='bg-green-50 border border-green-200 rounded-[8px] p-4'>
                      <p className='text-sm text-green-800 mb-2'>
                        Pricing Preview
                      </p>
                      <div className='flex items-center gap-3'>
                        {courseData.discountPrice && (
                          <span className='text-gray-500 line-through'>
                            {courseData.currency} {courseData.price}
                          </span>
                        )}
                        <span className='text-2xl font-bold text-gray-900'>
                          {courseData.currency}{' '}
                          {courseData.discountPrice || courseData.price}
                        </span>
                        {courseData.discountPrice && (
                          <span className='px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded'>
                            {Math.round(
                              (1 -
                                parseFloat(courseData.discountPrice) /
                                  parseFloat(courseData.price)) *
                                100,
                            )}
                            % OFF
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 5 && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Publish Settings
              </h2>

              {/* Collaboration Panel */}
              <CollaborationPanel
                isOwner={true}
                initialCollaborators={collaborators}
                onCollaboratorsChange={setCollaborators}
                onAddCollaborator={(collab) => {
                  toast.success(`${collab.name} added as ${collab.role}`);
                }}
              />

              {/* Collaborative Preview */}
              <CollaborativePreview
                courseData={courseData}
                onClose={() => {}}
              />

              {/* Course Settings */}
              <div className='space-y-4'>
                <label className='flex items-center justify-between p-4 border border-gray-200 rounded-[8px] cursor-pointer hover:bg-gray-50'>
                  <div>
                    <p className='font-medium text-gray-900'>Enable Reviews</p>
                    <p className='text-sm text-gray-600'>
                      Allow students to leave reviews
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    checked={courseData.allowReviews}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        allowReviews: e.target.checked,
                      }))
                    }
                    className='w-5 h-5 text-[#395192] rounded'
                  />
                </label>

                <label className='flex items-center justify-between p-4 border border-gray-200 rounded-[8px] cursor-pointer hover:bg-gray-50'>
                  <div>
                    <p className='font-medium text-gray-900'>
                      Enable Certificate
                    </p>
                    <p className='text-sm text-gray-600'>
                      Award certificates upon completion
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    checked={courseData.enableCertificate}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        enableCertificate: e.target.checked,
                      }))
                    }
                    className='w-5 h-5 text-[#395192] rounded'
                  />
                </label>

                <label className='flex items-center justify-between p-4 border border-gray-200 rounded-[8px] cursor-pointer hover:bg-gray-50'>
                  <div>
                    <p className='font-medium text-gray-900'>
                      Enable Discussions
                    </p>
                    <p className='text-sm text-gray-600'>
                      Allow course discussions and Q&A
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    checked={courseData.enableDiscussions}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        enableDiscussions: e.target.checked,
                      }))
                    }
                    className='w-5 h-5 text-[#395192] rounded'
                  />
                </label>
              </div>

              {/* Max Students */}
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  Maximum Students (Optional)
                </Label>
                <Input
                  type='number'
                  value={courseData.maxStudents}
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      maxStudents: e.target.value,
                    }))
                  }
                  placeholder='Leave empty for unlimited'
                  className='w-full px-4 py-3 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-[#395192]'
                />
              </div>

              {/* Course Summary */}
              <div className='bg-blue-50 border border-blue-200 rounded-[8px] p-6'>
                <h3 className='font-semibold text-blue-900 mb-4'>
                  Course Summary
                </h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-blue-600 mb-1'>Title</p>
                    <p className='text-blue-900 font-medium'>
                      {courseData.title || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-600 mb-1'>Category</p>
                    <p className='text-blue-900 font-medium'>
                      {courseData.category || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-600 mb-1'>Level</p>
                    <p className='text-blue-900 font-medium'>
                      {courseData.level || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-600 mb-1'>Sections</p>
                    <p className='text-blue-900 font-medium'>
                      {courseData.sections.length}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-600 mb-1'>Total Lessons</p>
                    <p className='text-blue-900 font-medium'>
                      {courseData.sections.reduce(
                        (sum, s) => sum + s.lessons.length,
                        0,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='text-blue-600 mb-1'>Price</p>
                    <p className='text-blue-900 font-medium'>
                      {courseData.priceType === 'free'
                        ? 'Free'
                        : `${courseData.currency} ${courseData.price}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className='flex items-center justify-between'>
          <button
            onClick={onCancel}
            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2'
          >
            <X className='w-5 h-5' />
            Close Wizard
          </button>

          <div className='text-sm text-gray-600'>
            Step {currentStep} of {steps.length}
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className='px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className='px-6 py-3 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178]'
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => handleSubmitCourse('publish')}
                disabled={isSavingDraft}
                className='px-6 py-3 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <CheckCircle className='w-5 h-5' />
                {isSavingDraft ? 'Creating...' : 'Create Course'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Lesson Editor Modal ─────────────────────────────────── */}
      {editingLessonModal && (
        <WizardLessonModal
          lesson={editingLessonModal.lesson}
          isNew={editingLessonModal.isNew}
          onSave={saveLessonFromModal}
          onClose={() => setEditingLessonModal(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Inline lesson editor modal — full LessonEditor experience but
   saves locally (no backend calls) since the course is not yet created.
   ══════════════════════════════════════════════════════════════════ */
interface WizardLessonModalProps {
  lesson: any;
  isNew?: boolean;
  onSave: (lesson: any) => void;
  onClose: () => void;
}

function WizardLessonModal({
  lesson,
  isNew = false,
  onSave,
  onClose,
}: WizardLessonModalProps) {
  type BlockType =
    | 'heading'
    | 'text'
    | 'image'
    | 'video'
    | 'code'
    | 'quiz'
    | 'hint'
    | 'callout'
    | 'problem';

  interface Block {
    id: string;
    type: BlockType;
    content: any;
    order: number;
  }

  const [title, setTitle] = useState<string>(lesson?.title || '');
  const [duration, setDuration] = useState<string>(lesson?.duration || '');
  const [xp, setXp] = useState<number>(lesson?.xp ?? 100);
  const [difficulty, setDifficulty] = useState<string>(
    lesson?.difficulty || 'Beginner',
  );
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [blocks, setBlocks] = useState<Block[]>(
    lesson?.blocks?.length
      ? lesson.blocks
      : [
          {
            id: '1',
            type: 'heading',
            content: { text: '', level: 1 },
            order: 1,
          },
          { id: '2', type: 'text', content: { text: '' }, order: 2 },
        ],
  );

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoStorage, setVideoStorage] = useState<{
    id: string;
    url: string;
    fields: Record<string, string>;
  } | null>(null);
  const [isPreparingVideo, setIsPreparingVideo] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageStorage, setImageStorage] = useState<{
    id: string;
    url: string;
    fields: Record<string, string>;
  } | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [currentImageBlockId, setCurrentImageBlockId] = useState<string | null>(
    null,
  );

  const uploadToStorage = async (
    result: {
      id: string;
      url: string;
      fields: Record<string, string>;
    },
    file: File,
  ) => {
    const formData = new FormData();
    Object.entries(result.fields).forEach(([key, value]) =>
      formData.append(key, value),
    );
    formData.append('file', file);

    const response = await fetch(result.url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Storage upload failed with status ${response.status}${errorText ? `: ${errorText}` : ''}`,
      );
    }

    return result.id;
  };

  /* ── block helpers ─────────────────────────────────────────────── */
  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case 'heading':
        return { text: '', level: 2 };
      case 'text':
        return { text: '' };
      case 'image':
        return {
          url: '',
          alt: '',
          caption: '',
          imageId: '',
          uploadedImageUrl: '',
          imageFileName: '',
        };
      case 'video':
        return {
          url: '',
          title: '',
          videoFileName: '',
          videoReady: false,
          videoId: '',
          uploadedVideoUrl: '',
        };
      case 'code':
        return { code: '// Write your code here', language: 'javascript' };
      case 'quiz':
        return {
          questionType: 'single_choice', // single_choice or multiple_choice
          question: '',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswers: [], // Array of indices for correct answers (supports multiple)
          points: 1,
          mandatory: true,
          explanation: '',
        };
      case 'hint':
        return { text: 'Hint text' };
      case 'callout':
        return { text: 'Important note', type: 'info' };
      case 'problem':
        return {
          question: 'Problem statement',
          steps: ['Step 1', 'Step 2'],
          solution: '',
          hints: [],
        };
      default:
        return {};
    }
  };

  const handleVideoFile = async (file: File, blockId: string) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file (MP4, WebM, MOV, AVI)');
      return;
    }
    setVideoFile(file);
    setVideoStorage(null);
    setIsPreparingVideo(true);
    try {
      const result = await storageApi.start({
        file_type: 'video',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });
      setVideoStorage(result);

      const id = await uploadToStorage(result, file);

      // Update block with video info
      updateBlock(blockId, {
        url: '',
        title: '',
        videoFileName: file.name,
        videoReady: true,
        videoId: id,
        uploadedVideoUrl: URL.createObjectURL(file),
      });

      toast.success('Video uploaded successfully!');
    } catch (err) {
      console.error('Error uploading video:', err);
      toast.error('Failed to upload video. Please try again.');
      setVideoFile(null);
      setVideoStorage(null);
    } finally {
      setIsPreparingVideo(false);
    }
  };

  const handleImageFile = async (file: File, blockId: string) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, GIF, WebP)');
      return;
    }
    setImageFile(file);
    setImageStorage(null);
    setCurrentImageBlockId(blockId);
    setIsPreparingImage(true);
    try {
      const result = await storageApi.start({
        file_type: 'image',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });
      setImageStorage(result);

      const id = await uploadToStorage(result, file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);

      // Update the block with image info
      updateBlock(blockId, {
        url: '',
        alt: '',
        caption: '',
        imageId: id,
        uploadedImageUrl: previewUrl,
        imageFileName: file.name,
      });

      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image. Please try again.');
      setImageFile(null);
      setImageStorage(null);
    } finally {
      setIsPreparingImage(false);
      setCurrentImageBlockId(null);
    }
  };

  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type,
        order: prev.length + 1,
        content: getDefaultContent(type),
      },
    ]);
  };

  const updateBlock = (id: string, content: any) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));

  const deleteBlock = (id: string) =>
    setBlocks((prev) => prev.filter((b) => b.id !== id));

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === blocks.length - 1) return;
    const next = [...blocks];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[target]] = [next[target], next[idx]];
    setBlocks(next.map((b, i) => ({ ...b, order: i + 1 })));
  };

  const duplicateBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    setBlocks((prev) => [
      ...prev,
      { ...block, id: Date.now().toString(), order: prev.length + 1 },
    ]);
  };

  const getBlockIcon = (type: BlockType, level?: number) => {
    switch (type) {
      case 'heading':
        return level === 3 ? (
          <Heading3 className='w-4 h-4' />
        ) : level === 2 ? (
          <Heading2 className='w-4 h-4' />
        ) : (
          <Heading1 className='w-4 h-4' />
        );
      case 'text':
        return <Type className='w-4 h-4' />;
      case 'image':
        return <ImageIcon className='w-4 h-4' />;
      case 'video':
        return <Video className='w-4 h-4' />;
      case 'code':
        return <Code className='w-4 h-4' />;
      case 'quiz':
        return <CheckSquare className='w-4 h-4' />;
      case 'hint':
        return <Lightbulb className='w-4 h-4' />;
      case 'callout':
        return <AlertCircle className='w-4 h-4' />;
      case 'problem':
        return <Calculator className='w-4 h-4' />;
      default:
        return <FileText className='w-4 h-4' />;
    }
  };

  /* ── block editor renderer ─────────────────────────────────────── */
  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className='space-y-3'>
            <div className='flex gap-2'>
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type='button'
                  onClick={() =>
                    updateBlock(block.id, { ...block.content, level: lvl })
                  }
                  className={`px-3 py-1 rounded border text-sm font-bold ${block.content.level === lvl ? 'bg-[#395192] text-white border-[#395192]' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  H{lvl}
                </button>
              ))}
            </div>
            <input
              value={block.content.text}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  text: e.target.value,
                })
              }
              className='w-full px-3 py-2 border rounded-md text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#395192]'
              placeholder='Heading text'
            />
          </div>
        );

      case 'text':
        return (
          <textarea
            value={block.content.text}
            onChange={(e) =>
              updateBlock(block.id, { ...block.content, text: e.target.value })
            }
            rows={5}
            className='w-full px-3 py-2 border rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#395192]'
            placeholder='Write your content here…'
          />
        );

      case 'image':
        return (
          <div className='space-y-3'>
            {/* Show uploaded image preview */}
            {block.content.uploadedImageUrl && (
              <div className='space-y-3'>
                <div className='relative rounded-lg overflow-hidden border'>
                  <img
                    src={block.content.uploadedImageUrl}
                    alt={block.content.alt || 'Uploaded image'}
                    className='w-full object-cover'
                  />
                </div>
                <div className='flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <ImageIcon className='w-5 h-5 text-green-600 shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-green-700 truncate'>
                      {block.content.imageFileName}
                    </p>
                    <p className='text-xs text-green-600 mt-0.5'>
                      ✓ Ready to upload
                    </p>
                  </div>
                  <button
                    type='button'
                    title='Remove image'
                    onClick={() => {
                      updateBlock(block.id, {
                        url: '',
                        alt: '',
                        caption: '',
                        imageId: '',
                        uploadedImageUrl: '',
                        imageFileName: '',
                      });
                    }}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}

            {/* Upload button */}
            {!block.content.uploadedImageUrl && (
              <div
                className='border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer'
                onClick={() =>
                  document.getElementById(`image-upload-${block.id}`)?.click()
                }
              >
                {isPreparingImage && currentImageBlockId === block.id ? (
                  <div className='flex flex-col items-center gap-2'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                    <p className='text-sm text-muted-foreground'>
                      Preparing image...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className='w-8 h-8 mx-auto mb-1 text-gray-400' />
                    <p className='text-sm text-gray-600'>
                      Click to upload image
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                      PNG, JPG, GIF, WebP up to 10MB
                    </p>
                  </>
                )}
                <input
                  id={`image-upload-${block.id}`}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageFile(file, block.id);
                    }
                  }}
                />
              </div>
            )}

            {/* Divider */}
            {!block.content.uploadedImageUrl && (
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-white px-2 text-gray-400'>or</span>
                </div>
              </div>
            )}

            {/* External URL */}
            {!block.content.uploadedImageUrl && (
              <input
                value={block.content.url}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    url: e.target.value,
                  })
                }
                className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
                placeholder='https://example.com/image.jpg'
              />
            )}

            {/* Alt text and Caption */}
            <input
              value={block.content.alt}
              onChange={(e) =>
                updateBlock(block.id, { ...block.content, alt: e.target.value })
              }
              className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
              placeholder='Alt text (for accessibility)'
            />
            <input
              value={block.content.caption}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  caption: e.target.value,
                })
              }
              className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
              placeholder='Caption'
            />
          </div>
        );

      case 'video':
        return (
          <div className='space-y-4'>
            {/* Uploaded video preview */}
            {block.content.videoFileName ? (
              <div className='space-y-3'>
                <div className='flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <Video className='w-5 h-5 text-green-600 shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-green-700 truncate'>
                      {block.content.videoFileName}
                    </p>
                    <p className='text-xs text-green-600 mt-0.5'>
                      ✓ Ready to upload
                    </p>
                  </div>
                  {isPreparingVideo && (
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                      Preparing…
                    </div>
                  )}
                  <button
                    type='button'
                    title='Remove video'
                    onClick={() => {
                      setVideoFile(null);
                      setVideoStorage(null);
                      updateBlock(block.id, {
                        url: '',
                        title: '',
                        videoFileName: '',
                        videoReady: false,
                        videoId: '',
                        uploadedVideoUrl: '',
                      });
                    }}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>

                {/* Video preview if available */}
                {block.content.uploadedVideoUrl && (
                  <div className='relative aspect-video bg-black rounded-lg overflow-hidden'>
                    <video
                      src={block.content.uploadedVideoUrl}
                      controls
                      className='w-full h-full'
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            ) : (
              <div
                className='border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer'
                onClick={() =>
                  document.getElementById(`video-upload-${block.id}`)?.click()
                }
              >
                <Upload className='w-8 h-8 mx-auto mb-1 text-gray-400' />
                <p className='text-sm text-gray-600'>Click to upload a video</p>
                <p className='text-xs text-gray-400 mt-1'>
                  MP4, WebM, MOV, AVI
                </p>
                <input
                  id={`video-upload-${block.id}`}
                  type='file'
                  accept='video/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleVideoFile(file, block.id);
                    }
                  }}
                />
              </div>
            )}

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white px-2 text-gray-400'>or</span>
              </div>
            </div>

            {/* External URL */}
            <div className='flex items-center gap-2'>
              <Link2 className='w-4 h-4 text-gray-400 shrink-0' />
              <input
                value={block.content.url}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    url: e.target.value,
                  })
                }
                className='flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
                placeholder='YouTube, Vimeo, or direct video URL'
              />
            </div>
          </div>
        );

      case 'code':
        return (
          <div className='space-y-2'>
            <select
              value={block.content.language}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  language: e.target.value,
                })
              }
              className='px-3 py-2 rounded-md border bg-white text-sm'
            >
              {['javascript', 'python', 'java', 'cpp', 'html', 'css'].map(
                (lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ),
              )}
            </select>
            <textarea
              value={block.content.code}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  code: e.target.value,
                })
              }
              rows={8}
              className='w-full px-3 py-2 border rounded-md text-sm font-mono resize-y bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#395192]'
              placeholder='// Write your code here'
            />
          </div>
        );

      case 'quiz':
        const questionType = block.content.questionType || 'single_choice';
        const correctAnswers = block.content.correctAnswers || [];
        const isSingleChoice = questionType === 'single_choice';
        const isMultipleChoice = questionType === 'multiple_choice';
        const showOptions = isSingleChoice || isMultipleChoice;

        const updateCorrectAnswer = (index: number, checked: boolean) => {
          if (isSingleChoice) {
            if (!checked) return;
            // For single choice, only one answer can be correct.
            updateBlock(block.id, {
              ...block.content,
              correctAnswers: [index],
            });
          } else if (isMultipleChoice) {
            // For multiple choice, each checkbox can be toggled independently.
            const newCorrectAnswers = checked
              ? [...correctAnswers, index]
              : correctAnswers.filter((i: number) => i !== index);
            updateBlock(block.id, {
              ...block.content,
              correctAnswers: newCorrectAnswers,
            });
          }
        };

        return (
          <div className='space-y-4'>
            {/* Header with question type label and mandatory toggle */}
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-medium text-gray-700'>
                {questionType === 'single_choice' &&
                  'Single choice (Radio button)'}
                {questionType === 'multiple_choice' &&
                  'Multiple choice (Checkboxes)'}
              </h4>
              <label className='flex items-center gap-2 text-sm text-gray-600'>
                <span>Mandatory</span>
                <button
                  type='button'
                  onClick={() =>
                    updateBlock(block.id, {
                      ...block.content,
                      mandatory: !block.content.mandatory,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    block.content.mandatory ? 'bg-[#395192]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      block.content.mandatory
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Question type and points selectors */}
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>
                  Question type
                </label>
                <select
                  value={questionType}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      ...block.content,
                      questionType: e.target.value,
                      // Reset correct answers when changing type
                      correctAnswers: [],
                    })
                  }
                  className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192] bg-white'
                >
                  <option value='single_choice'>
                    Single choice (Radio button)
                  </option>
                  <option value='multiple_choice'>
                    Multiple choice (Checkboxes)
                  </option>
                </select>
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>
                  Points
                </label>
                <select
                  value={block.content.points || 1}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      ...block.content,
                      points: parseInt(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192] bg-white'
                >
                  <option value='1'>1 point</option>
                  <option value='2'>2 points</option>
                  <option value='3'>3 points</option>
                  <option value='5'>5 points</option>
                  <option value='10'>10 points</option>
                </select>
              </div>
            </div>

            {/* Question text area */}
            <div>
              <textarea
                value={block.content.question || ''}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    question: e.target.value,
                  })
                }
                rows={3}
                className='w-full px-3 py-2 border rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#395192]'
                placeholder='Enter your question here...'
              />
            </div>

            {/* Options (only for single and multiple choice) */}
            {showOptions && (
              <div className='space-y-2'>
                {block.content.options.map((opt: string, i: number) => (
                  <div key={i}>
                    <label className='block text-xs font-medium text-gray-600 mb-1'>
                      Option {i + 1}
                    </label>
                    <div className='flex items-center gap-3'>
                      <input
                        type={isSingleChoice ? 'radio' : 'checkbox'}
                        name={`quiz-correct-${block.id}`}
                        checked={correctAnswers.includes(i)}
                        onChange={(e) =>
                          updateCorrectAnswer(i, e.target.checked)
                        }
                        className='h-4 w-4 accent-[#395192]'
                      />
                      <input
                        value={opt}
                        onChange={(e) => {
                          const opts = [...block.content.options];
                          opts[i] = e.target.value;
                          updateBlock(block.id, {
                            ...block.content,
                            options: opts,
                          });
                        }}
                        className='flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
                        placeholder={`Option ${i + 1}`}
                      />
                    </div>
                  </div>
                ))}

                {/* Add another option button */}
                <button
                  type='button'
                  onClick={() =>
                    updateBlock(block.id, {
                      ...block.content,
                      options: [
                        ...block.content.options,
                        `Option ${block.content.options.length + 1}`,
                      ],
                    })
                  }
                  className='text-sm text-[#395192] hover:underline flex items-center gap-1 font-medium'
                >
                  Add another option
                </button>
              </div>
            )}

            {/* Explanation */}
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Explanation (optional)
              </label>
              <textarea
                value={block.content.explanation || ''}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    explanation: e.target.value,
                  })
                }
                rows={2}
                className='w-full px-3 py-2 border rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#395192]'
                placeholder='Explanation shown after answering (optional)'
              />
            </div>
          </div>
        );

      case 'hint':
        return (
          <div className='p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded'>
            <div className='flex items-start gap-2'>
              <Lightbulb className='w-4 h-4 text-yellow-600 shrink-0 mt-1' />
              <textarea
                value={block.content.text}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    text: e.target.value,
                  })
                }
                rows={3}
                className='flex-1 bg-transparent border-0 text-sm resize-y focus:outline-none'
                placeholder='Hint text'
              />
            </div>
          </div>
        );

      case 'callout':
        return (
          <div className='space-y-2'>
            <select
              value={block.content.type}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  type: e.target.value,
                })
              }
              className='px-3 py-2 rounded-md border bg-white text-sm'
            >
              {['info', 'warning', 'success', 'error'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div
              className={`p-4 border-l-4 rounded ${block.content.type === 'info' ? 'bg-blue-50 border-blue-400' : block.content.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : block.content.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}
            >
              <textarea
                value={block.content.text}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    text: e.target.value,
                  })
                }
                rows={3}
                className='w-full bg-transparent border-0 text-sm resize-y focus:outline-none'
                placeholder='Callout text'
              />
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className='space-y-3'>
            <input
              value={block.content.question}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  question: e.target.value,
                })
              }
              className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
              placeholder='Problem statement'
            />
            {block.content.steps.map((step: string, i: number) => (
              <input
                key={i}
                value={step}
                onChange={(e) => {
                  const steps = [...block.content.steps];
                  steps[i] = e.target.value;
                  updateBlock(block.id, { ...block.content, steps });
                }}
                className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
                placeholder={`Step ${i + 1}`}
              />
            ))}
            <button
              type='button'
              onClick={() =>
                updateBlock(block.id, {
                  ...block.content,
                  steps: [
                    ...block.content.steps,
                    `Step ${block.content.steps.length + 1}`,
                  ],
                })
              }
              className='text-xs text-[#395192] hover:underline flex items-center gap-1'
            >
              <Plus className='w-3 h-3' /> Add step
            </button>
            <textarea
              value={block.content.solution}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  solution: e.target.value,
                })
              }
              rows={4}
              className='w-full px-3 py-2 border rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#395192]'
              placeholder='Final solution'
            />
          </div>
        );

      default:
        return <p className='text-gray-400 text-sm'>Unknown block type</p>;
    }
  };

  /* ── preview renderer ──────────────────────────────────────────── */
  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case 'heading': {
        const sizes: Record<number, string> = {
          1: 'text-3xl',
          2: 'text-2xl',
          3: 'text-xl',
        };
        return (
          <p className={`font-bold ${sizes[block.content.level] || 'text-xl'}`}>
            {block.content.text}
          </p>
        );
      }
      case 'text':
        return (
          <p className='whitespace-pre-wrap text-sm'>{block.content.text}</p>
        );
      case 'image':
        return block.content.url ? (
          <img
            src={block.content.url}
            alt={block.content.alt}
            className='rounded-lg w-full'
          />
        ) : (
          <div className='border-2 border-dashed rounded-lg p-8 text-center text-gray-400'>
            <ImageIcon className='w-8 h-8 mx-auto mb-1' />
            <p className='text-sm'>Image</p>
          </div>
        );
      case 'video':
        return block.content.url ? (
          <div className='aspect-video bg-black rounded-lg flex items-center justify-center'>
            <Play className='w-12 h-12 text-white' />
          </div>
        ) : (
          <div className='aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400'>
            <Video className='w-8 h-8 mb-1' />
            <p className='text-sm'>Video</p>
          </div>
        );
      case 'code':
        return (
          <div className='bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto'>
            <div className='text-gray-400 text-xs mb-2'>
              {block.content.language}
            </div>
            <pre>{block.content.code}</pre>
          </div>
        );
      case 'quiz':
        const previewCorrectAnswers: number[] =
          block.content.correctAnswers || [];
        return (
          <div className='border rounded-lg p-4 space-y-2'>
            <p className='font-semibold text-sm'>{block.content.question}</p>
            {block.content.options.map((opt: string, i: number) => (
              <div
                key={i}
                className={`p-2 rounded border text-sm ${previewCorrectAnswers.includes(i) ? 'border-green-500 bg-green-50' : ''}`}
              >
                {opt}
              </div>
            ))}
          </div>
        );
      case 'hint':
        return (
          <div className='p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded flex gap-2'>
            <Lightbulb className='w-4 h-4 text-yellow-600 shrink-0 mt-0.5' />
            <p className='text-sm'>{block.content.text}</p>
          </div>
        );
      case 'callout':
        return (
          <div
            className={`p-4 border-l-4 rounded text-sm ${block.content.type === 'info' ? 'bg-blue-50 border-blue-400' : block.content.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : block.content.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}
          >
            {block.content.text}
          </div>
        );
      case 'problem':
        return (
          <div className='border rounded-lg p-4 space-y-1'>
            <p className='font-semibold text-sm'>{block.content.question}</p>
            {block.content.steps.map((s: string, i: number) => (
              <p key={i} className='text-sm text-gray-600'>
                • {s}
              </p>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    if (isPreparingVideo || isPreparingImage) {
      toast.error('Please wait for media uploads to finish before saving.');
      return;
    }

    onSave({
      id: lesson.id,
      title,
      type: lesson.type,
      duration,
      xp,
      difficulty,
      blocks,
    });
  };

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8'>
        {/* Modal header */}
        <div className='flex items-center justify-between px-6 py-4 border-b'>
          <div className='flex items-center gap-3'>
            <h2 className='text-lg font-semibold'>
              {isNew ? 'Add Lesson' : 'Edit Lesson'}
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() =>
                setActiveView(activeView === 'edit' ? 'preview' : 'edit')
              }
              className='flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50'
            >
              <Eye className='w-4 h-4' />
              {activeView === 'edit' ? 'Preview' : 'Edit'}
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={isPreparingVideo || isPreparingImage}
              className='flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#395192] text-white rounded-lg hover:bg-[#2d4178]'
            >
              <Save className='w-4 h-4' />
              {isPreparingVideo || isPreparingImage
                ? 'Uploading media...'
                : 'Save Lesson'}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='p-1.5 rounded-lg hover:bg-gray-100'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='grid lg:grid-cols-12 gap-0'>
          {/* ── Main content ───────────────────────────────────── */}
          <div className='lg:col-span-8 p-6 space-y-4 border-r'>
            {/* Title row */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full text-2xl font-bold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-[#395192]'
              placeholder='Lesson Title'
            />

            {activeView === 'edit' ? (
              <>
                {/* Content blocks */}
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className='border rounded-xl bg-white group'
                  >
                    {/* Block header */}
                    <div className='flex items-center justify-between px-4 py-2 border-b bg-gray-50 rounded-t-xl'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${block.type === 'heading' ? 'bg-blue-500/10 text-blue-500' : block.type === 'quiz' ? 'bg-purple-500/10 text-purple-500' : block.type === 'code' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}
                        >
                          {getBlockIcon(block.type, block.content?.level)}
                        </div>
                        <span className='text-sm font-medium capitalize'>
                          {block.type}
                        </span>
                      </div>
                      <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button
                          type='button'
                          onClick={() => moveBlock(block.id, 'up')}
                          className='p-1 rounded hover:bg-gray-200'
                        >
                          <ChevronUp className='w-3.5 h-3.5' />
                        </button>
                        <button
                          type='button'
                          onClick={() => moveBlock(block.id, 'down')}
                          className='p-1 rounded hover:bg-gray-200'
                        >
                          <ChevronDown className='w-3.5 h-3.5' />
                        </button>
                        <button
                          type='button'
                          onClick={() => duplicateBlock(block.id)}
                          className='p-1 rounded hover:bg-gray-200'
                        >
                          <Copy className='w-3.5 h-3.5' />
                        </button>
                        <button
                          type='button'
                          onClick={() => deleteBlock(block.id)}
                          className='p-1 rounded hover:bg-red-50 text-red-500'
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </div>
                    {/* Block editor */}
                    <div className='p-4'>{renderBlockEditor(block)}</div>
                  </div>
                ))}

                {/* Add block toolbar */}
                <div className='border-2 border-dashed rounded-xl p-4'>
                  <p className='text-xs font-medium text-gray-500 mb-3'>
                    Add Content Block:
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {(
                      [
                        { type: 'heading', icon: Heading1, label: 'Heading' },
                        { type: 'text', icon: Type, label: 'Text' },
                        { type: 'image', icon: ImageIcon, label: 'Image' },
                        { type: 'video', icon: Video, label: 'Video' },
                        { type: 'code', icon: Code, label: 'Code' },
                        { type: 'quiz', icon: CheckSquare, label: 'Quiz' },
                        { type: 'hint', icon: Lightbulb, label: 'Hint' },
                        {
                          type: 'callout',
                          icon: AlertCircle,
                          label: 'Callout',
                        },
                        { type: 'problem', icon: Calculator, label: 'Problem' },
                      ] as {
                        type: BlockType;
                        icon: React.ElementType;
                        label: string;
                      }[]
                    ).map((b) => (
                      <button
                        key={b.type}
                        type='button'
                        onClick={() => addBlock(b.type)}
                        className='flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50 transition-colors'
                      >
                        <b.icon className='w-3.5 h-3.5' />
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Preview */
              <div className='space-y-4 p-2'>
                <h1 className='text-3xl font-extrabold'>{title}</h1>
                {blocks.map((block) => (
                  <div key={block.id}>{renderBlockPreview(block)}</div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ────────────────────────────────────────── */}
          <div className='lg:col-span-4 p-6 space-y-6'>
            <div>
              <h3 className='text-sm font-semibold mb-3'>Lesson Settings</h3>
              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-gray-600 mb-1 block'>
                    Duration
                  </label>
                  <input
                    type='text'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
                    placeholder='e.g. 15 min'
                  />
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-600 mb-1 block'>
                    XP Reward
                  </label>
                  <input
                    type='number'
                    value={xp}
                    onChange={(e) => setXp(Number(e.target.value))}
                    className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192]'
                    placeholder='100'
                    min={0}
                  />
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-600 mb-1 block'>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className='w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#395192] bg-white'
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-sm font-semibold mb-3'>Quick Tips</h3>
              <div className='space-y-2 text-xs text-gray-500'>
                <div className='flex gap-2'>
                  <Lightbulb className='w-4 h-4 text-yellow-500 shrink-0' />
                  <p>Add hints for challenging problems</p>
                </div>
                <div className='flex gap-2'>
                  <Lightbulb className='w-4 h-4 text-yellow-500 shrink-0' />
                  <p>Include code examples with explanations</p>
                </div>
                <div className='flex gap-2'>
                  <Lightbulb className='w-4 h-4 text-yellow-500 shrink-0' />
                  <p>Break long lessons into shorter sections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
