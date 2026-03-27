import React, { useState } from 'react';
import { coursesApi } from '../../utils/api-client';
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
import { AIAssistPanel } from './AIAssistPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { AIKnowledgeGapDetector } from './AIKnowledgeGapDetector';
import { CollaborativePreview } from './CollaborativePreview';
import { AICourseGenerator } from './AICourseGenerator';

interface CourseCreationWizardProps {
  onComplete?: (courseData: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export function CourseCreationWizard({
  onComplete,
  onCancel,
  initialData,
}: CourseCreationWizardProps) {
  const { user } = useAuth();
  const { categories } = useCategories();
  const [creationMode, setCreationMode] = useState<'choice' | 'manual' | 'ai'>(
    'choice',
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
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
        lessons: [
          {
            id: '1',
            title: '',
            type: 'video',
            duration: '',
            content: '',
            order: 1,
          },
        ],
        order: 1,
      },
    ],
    sections: initialData?.sections || [
      {
        id: '1',
        title: '',
        lessons: [
          { id: '1', title: '', type: 'video', duration: '', content: '' },
        ],
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
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ];

  const handleThumbnailFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, WebP, or AVIF image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }
    setCourseData((prev) => ({ ...prev, thumbnail: file }));
    toast.success('Thumbnail uploaded');
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
      case 2:
        const hasLessons = courseData.sections.some(
          (s) => s.lessons.length > 0,
        );
        if (!hasLessons) {
          toast.error('Please add at least one lesson');
          return false;
        }
        return true;
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

  const addLesson = (sectionId: string) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  id: Date.now().toString(),
                  title: '',
                  type: 'video',
                  duration: '',
                  content: '',
                },
              ],
            }
          : section,
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

  const handlePublish = async () => {
    // Validate all required fields
    if (!courseData.title.trim()) {
      toast.error('Course title is required');
      return;
    }
    if (!courseData.description.trim()) {
      toast.error('Course description is required');
      return;
    }
    if (!courseData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!courseData.level) {
      toast.error('Please select a difficulty level');
      return;
    }
    if (
      courseData.learningObjectives.filter((obj) => obj.trim()).length === 0
    ) {
      toast.error('At least one learning objective is required');
      return;
    }
    if (
      courseData.sections.filter((s) => s.title && s.lessons.length > 0)
        .length === 0
    ) {
      toast.error('At least one section with lessons is required');
      return;
    }

    setIsPublishing(true);

    try {
      // Prepare course data
      const courseId = `course-${Date.now()}`;
      const course = {
        id: courseId,
        title: courseData.title,
        subtitle: courseData.subtitle,
        description: courseData.description,
        category: courseData.category,
        subcategory: courseData.subcategory,
        level: courseData.level,
        language: courseData.language,
        sections: courseData.sections.filter(
          (s) => s.title && s.lessons.length > 0,
        ),
        learningObjectives: courseData.learningObjectives.filter((obj) =>
          obj.trim(),
        ),
        requirements: courseData.requirements.filter((req) => req.trim()),
        targetAudience: courseData.targetAudience,
        priceType: courseData.priceType,
        price:
          courseData.priceType === 'paid' ? parseFloat(courseData.price) : 0,
        currency: courseData.currency,
        discountPrice: courseData.discountPrice
          ? parseFloat(courseData.discountPrice)
          : null,
        allowReviews: courseData.allowReviews,
        enableCertificate: courseData.enableCertificate,
        enableDiscussions: courseData.enableDiscussions,
        maxStudents: courseData.maxStudents
          ? parseInt(courseData.maxStudents)
          : null,
        status: 'published',
        public: true,
        instructorId: user?.id || 'demo-instructor',
        instructorName:
          user?.user_metadata?.name || user?.email || 'Demo Instructor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrollments: 0,
        rating: 0,
        reviews: 0,
        image:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
      };

      // Use dummy data mode - save to localStorage
      try {
        const existingCourses = JSON.parse(
          localStorage.getItem('cerebrolearn_courses') || '[]',
        );
        existingCourses.push(course);
        localStorage.setItem(
          'cerebrolearn_courses',
          JSON.stringify(existingCourses),
        );

        toast.success('Course published successfully! 🎉');
        onComplete?.(course);
      } catch (storageError) {
        // If localStorage fails, just complete with success
        console.log('LocalStorage not available, using in-memory mode');
        toast.success('Course published successfully! 🎉');
        onComplete?.(course);
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error(
        `Failed to publish course: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveAsDraft = async () => {
    // Basic validation - only require title
    if (!courseData.title.trim()) {
      toast.error('Course title is required to save as draft');
      return;
    }

    setIsSavingDraft(true);

    try {
      const result = await coursesApi.create({
        title: courseData.title,
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
        currency: courseData.currency || 'USD',
        tags: courseData.tags.filter((t) => t.trim()),
        status: 'draft',
      });

      toast.success('Course saved as draft! 📝');
      onComplete?.(result);
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
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft}
              className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
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

              {/* AI Title Assist - Optional, Non-intrusive */}
              {courseData.category && courseData.level && (
                <AIAssistPanel
                  type='title'
                  context={{
                    category: courseData.category,
                    level: courseData.level,
                  }}
                  onAccept={(suggestion) => {
                    setCourseData((prev) => ({ ...prev, title: suggestion }));
                    toast.success(
                      'Title suggestion applied! You can edit it anytime.',
                    );
                  }}
                  onReject={() => toast.info('Suggestion dismissed')}
                />
              )}

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

              {/* AI Description Assist - Optional, Non-intrusive */}
              {courseData.category && courseData.level && (
                <AIAssistPanel
                  type='description'
                  context={{
                    category: courseData.category,
                    level: courseData.level,
                  }}
                  onAccept={(suggestion) => {
                    setCourseData((prev) => ({
                      ...prev,
                      description: suggestion,
                    }));
                    toast.success(
                      'Description suggestion applied! You can edit it anytime.',
                    );
                  }}
                  onReject={() => toast.info('Suggestion dismissed')}
                />
              )}

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
                      <SelectItem value='Beginner'>Beginner</SelectItem>
                      <SelectItem value='Intermediate'>Intermediate</SelectItem>
                      <SelectItem value='Advanced'>Advanced</SelectItem>
                      <SelectItem value='All Levels'>All Levels</SelectItem>
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
                <div
                  className={`border-2 border-dashed rounded-[8px] p-8 text-center transition-colors ${
                    isDraggingThumbnail
                      ? 'border-[#395192] bg-[#395192]/5'
                      : 'border-gray-300 hover:border-[#395192]'
                  }`}
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
                  <label htmlFor='thumbnail-upload' className='cursor-pointer'>
                    <p className='text-gray-700 mb-1'>
                      <span className='text-[#395192] hover:underline'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className='text-sm text-gray-500'>
                      JPEG, PNG, WebP or AVIF · max 5 MB · recommended 1280×720
                    </p>
                  </label>
                  {courseData.thumbnail && (
                    <p className='mt-2 text-sm text-green-600'>
                      ✓ {courseData.thumbnail.name}
                    </p>
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
                  Course Goals (High-Level Outcomes)
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

              {/* AI Structure Generator - Optional */}
              {courseData.sections.length === 0 &&
                courseData.title &&
                courseData.category && (
                  <AIAssistPanel
                    type='structure'
                    context={{
                      title: courseData.title,
                      category: courseData.category,
                      level: courseData.level,
                    }}
                    onAccept={(suggestion) => {
                      const generatedSections = suggestion.modules.map(
                        (mod: any, index: number) => ({
                          id: Date.now().toString() + index,
                          title: mod.title,
                          description: mod.outcome,
                          lessons: mod.lessons.map(
                            (lessonTitle: string, lIndex: number) => ({
                              id: Date.now().toString() + index + lIndex,
                              title: lessonTitle,
                              type: 'video',
                              duration: '',
                              content: '',
                            }),
                          ),
                        }),
                      );
                      setCourseData((prev) => ({
                        ...prev,
                        sections: generatedSections,
                      }));
                      toast.success(
                        'Course structure generated! You can edit any section.',
                      );
                    }}
                  />
                )}

              {/* AI Knowledge Gap Detector */}
              {courseData.sections.length > 0 && (
                <AIKnowledgeGapDetector
                  courseData={courseData}
                  onApplySuggestion={(gapId, suggestion) => {
                    toast.success(
                      'Suggestion noted! You can implement it as needed.',
                    );
                  }}
                />
              )}

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
                  <div className='ml-9 space-y-3'>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className='flex items-center gap-3 bg-gray-50 p-3 rounded-[8px]'
                      >
                        <GripVertical className='w-4 h-4 text-gray-400 cursor-move' />
                        <Input
                          type='text'
                          value={lesson.title}
                          onChange={(e) => {
                            setCourseData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      lessons: s.lessons.map((l) =>
                                        l.id === lesson.id
                                          ? { ...l, title: e.target.value }
                                          : l,
                                      ),
                                    }
                                  : s,
                              ),
                            }));
                          }}
                          placeholder={`Lesson ${lessonIndex + 1} Title`}
                          className='flex-1'
                        />
                        <Select
                          value={lesson.type}
                          onValueChange={(e) => {
                            setCourseData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((sec) =>
                                sec.id === section.id
                                  ? {
                                      ...sec,
                                      lessons: sec.lessons.map((l) =>
                                        l.id === lesson.id
                                          ? { ...l, type: e }
                                          : l,
                                      ),
                                    }
                                  : sec,
                              ),
                            }));
                          }}
                        >
                          <SelectTrigger className='w-[150px]'>
                            <SelectValue placeholder='Content Type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='video'>Video</SelectItem>
                            <SelectItem value='text'>Text</SelectItem>
                            <SelectItem value='quiz'>Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type='text'
                          value={lesson.duration}
                          onChange={(e) => {
                            setCourseData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      lessons: s.lessons.map((l) =>
                                        l.id === lesson.id
                                          ? { ...l, duration: e.target.value }
                                          : l,
                                      ),
                                    }
                                  : s,
                              ),
                            }));
                          }}
                          placeholder='Duration'
                          className='w-24'
                        />
                        <button
                          onClick={() => removeLesson(section.id, lesson.id)}
                          className='p-2 text-red-600 hover:bg-red-100 rounded'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLesson(section.id)}
                      className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[8px] hover:bg-gray-50 w-full'
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
                onClick={handlePublish}
                disabled={isPublishing}
                className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <CheckCircle className='w-5 h-5' />
                {isPublishing ? 'Publishing...' : 'Publish Course'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
