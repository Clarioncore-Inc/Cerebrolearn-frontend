import React, { useState } from 'react';
import { coursesApi, lessonsApi } from '../../utils/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Info,
  DollarSign,
  Clock,
  Target,
  FileText,
  Layers,
  GripVertical,
  Trash2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AIAssistPanel } from '../creator/AIAssistPanel';
import { CollaborationPanel } from '../creator/CollaborationPanel';
import { AIKnowledgeGapDetector } from '../creator/AIKnowledgeGapDetector';
import { CollaborativePreview } from '../creator/CollaborativePreview';

interface CourseCreationWizardProps {
  onComplete: (course: any) => void;
  onCancel: () => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content_type: 'text' | 'video' | 'interactive';
  order: number;
}

interface LearningObjective {
  id: string;
  text: string;
}

interface Prerequisite {
  id: string;
  text: string;
}

export function CourseCreationWizard({
  onComplete,
  onCancel,
}: CourseCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Basic Information
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  // Step 2: Learning Objectives & Prerequisites
  const [learningObjectives, setLearningObjectives] = useState<
    LearningObjective[]
  >([{ id: '1', text: '' }]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([
    { id: '1', text: '' },
  ]);

  // Step 3: Course Content
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: '1', title: '', description: '', content_type: 'text', order: 1 },
  ]);

  // Step 4: Settings & Pricing
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [pricing, setPricing] = useState<'free' | 'paid'>('free');
  const [price, setPrice] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Basic Info', icon: BookOpen },
    { number: 2, title: 'Objectives', icon: Target },
    { number: 3, title: 'Content', icon: Layers },
    { number: 4, title: 'Settings', icon: FileText },
  ];

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Course title is required';
    else if (title.length < 10)
      newErrors.title = 'Title must be at least 10 characters';

    if (!shortDescription.trim())
      newErrors.shortDescription = 'Short description is required';
    else if (shortDescription.length < 20)
      newErrors.shortDescription =
        'Short description must be at least 20 characters';

    if (!fullDescription.trim())
      newErrors.fullDescription = 'Full description is required';
    else if (fullDescription.length < 50)
      newErrors.fullDescription =
        'Full description must be at least 50 characters';

    if (!category) newErrors.category = 'Please select a category';
    if (!level) newErrors.level = 'Please select a difficulty level';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    const filledObjectives = learningObjectives.filter((obj) =>
      obj.text.trim(),
    );
    if (filledObjectives.length === 0) {
      newErrors.objectives = 'At least one learning objective is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    const validLessons = lessons.filter((lesson) => lesson.title.trim());
    if (validLessons.length === 0) {
      newErrors.lessons = 'At least one lesson is required';
    }

    lessons.forEach((lesson, index) => {
      if (lesson.title.trim() && !lesson.description.trim()) {
        newErrors[`lesson_${index}`] = 'Lesson description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};

    if (!estimatedDuration.trim()) {
      newErrors.estimatedDuration = 'Estimated duration is required';
    }

    if (pricing === 'paid') {
      const priceNum = parseFloat(price);
      if (!price || isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Valid price is required for paid courses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Learning Objectives handlers
  const addObjective = () => {
    setLearningObjectives([
      ...learningObjectives,
      { id: Date.now().toString(), text: '' },
    ]);
  };

  const removeObjective = (id: string) => {
    if (learningObjectives.length > 1) {
      setLearningObjectives(learningObjectives.filter((obj) => obj.id !== id));
    }
  };

  const updateObjective = (id: string, text: string) => {
    setLearningObjectives(
      learningObjectives.map((obj) => (obj.id === id ? { ...obj, text } : obj)),
    );
  };

  // Prerequisites handlers
  const addPrerequisite = () => {
    setPrerequisites([
      ...prerequisites,
      { id: Date.now().toString(), text: '' },
    ]);
  };

  const removePrerequisite = (id: string) => {
    if (prerequisites.length > 1) {
      setPrerequisites(prerequisites.filter((pre) => pre.id !== id));
    }
  };

  const updatePrerequisite = (id: string, text: string) => {
    setPrerequisites(
      prerequisites.map((pre) => (pre.id === id ? { ...pre, text } : pre)),
    );
  };

  // Lesson handlers
  const addLesson = () => {
    const newOrder = lessons.length + 1;
    setLessons([
      ...lessons,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        content_type: 'text',
        order: newOrder,
      },
    ]);
  };

  const removeLesson = (id: string) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((lesson) => lesson.id !== id));
    }
  };

  const updateLesson = (id: string, field: keyof Lesson, value: any) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, [field]: value } : lesson,
      ),
    );
  };

  const moveLessonUp = (index: number) => {
    if (index > 0) {
      const newLessons = [...lessons];
      [newLessons[index - 1], newLessons[index]] = [
        newLessons[index],
        newLessons[index - 1],
      ];
      newLessons.forEach((lesson, idx) => (lesson.order = idx + 1));
      setLessons(newLessons);
    }
  };

  const moveLessonDown = (index: number) => {
    if (index < lessons.length - 1) {
      const newLessons = [...lessons];
      [newLessons[index], newLessons[index + 1]] = [
        newLessons[index + 1],
        newLessons[index],
      ];
      newLessons.forEach((lesson, idx) => (lesson.order = idx + 1));
      setLessons(newLessons);
    }
  };

  // Tag handlers
  const addTag = () => {
    if (
      tagInput.trim() &&
      !tags.includes(tagInput.trim()) &&
      tags.length < 10
    ) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Navigation
  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setLoading(true);
    try {
      // Create the course — fields mapped to the POST /api/courses/ schema
      const courseData = {
        title,
        description: fullDescription,
        category,
        level,
        org_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        is_public: isPublic,
        price: pricing === 'paid' ? parseFloat(price) : 0,
        currency: 'USD',
        estimated_hours: estimatedDuration
          ? parseFloat(estimatedDuration)
          : undefined,
        tags: tags,
        status: 'draft',
      };

      const result = await coursesApi.create(courseData);

      // Create lessons for the course
      const validLessons = lessons.filter((lesson) => lesson.title.trim());
      if (validLessons.length > 0 && result.id) {
        await Promise.all(
          validLessons.map((lesson) =>
            lessonsApi.create({
              course_id: result.id,
              title: lesson.title,
              kind: lesson.content_type || 'text',
              content: {
                text: 'Lesson content will be added here.',
                steps: [],
              },
              position: lesson.order,
            }),
          ),
        );
      }

      toast.success('Course created successfully!');
      onComplete(result);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Progress Header */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl'>Create New Course</h2>
          <Badge variant='secondary'>
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        <Progress value={progressPercentage} className='h-2' />

        {/* Steps Indicator */}
        <div className='flex justify-between'>
          {steps.map((step) => (
            <div key={step.number} className='flex flex-col items-center gap-2'>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep > step.number
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === step.number
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className='h-5 w-5' />
                ) : (
                  <step.icon className='h-5 w-5' />
                )}
              </div>
              <p
                className={`text-sm ${currentStep === step.number ? 'font-medium' : 'text-muted-foreground'}`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Step Content */}
      <div className='min-h-[500px]'>
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5' />
                Basic Information
              </CardTitle>
              <CardDescription>
                Start with the fundamentals of your course
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Course Title *</Label>
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g., Introduction to Web Development'
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.title}
                  </p>
                )}
                <p className='text-xs text-muted-foreground'>
                  A clear, descriptive title (minimum 10 characters)
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='shortDescription'>Short Description *</Label>
                <Input
                  id='shortDescription'
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder='A brief one-liner about your course'
                  className={
                    errors.shortDescription ? 'border-destructive' : ''
                  }
                />
                {errors.shortDescription && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.shortDescription}
                  </p>
                )}
                <p className='text-xs text-muted-foreground'>
                  {shortDescription.length}/100 characters (minimum 20)
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fullDescription'>Full Description *</Label>
                <Textarea
                  id='fullDescription'
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder='Provide a detailed description of what students will learn...'
                  rows={6}
                  className={errors.fullDescription ? 'border-destructive' : ''}
                />
                {errors.fullDescription && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.fullDescription}
                  </p>
                )}
                <p className='text-xs text-muted-foreground'>
                  {fullDescription.length} characters (minimum 50)
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='category'>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      className={errors.category ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='programming'>Programming</SelectItem>
                      <SelectItem value='mathematics'>Mathematics</SelectItem>
                      <SelectItem value='science'>Science</SelectItem>
                      <SelectItem value='business'>Business</SelectItem>
                      <SelectItem value='design'>Design</SelectItem>
                      <SelectItem value='languages'>Languages</SelectItem>
                      <SelectItem value='marketing'>Marketing</SelectItem>
                      <SelectItem value='data-science'>Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className='text-sm text-destructive'>
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='level'>Difficulty Level *</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger
                      className={errors.level ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder='Select level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.level && (
                    <p className='text-sm text-destructive'>{errors.level}</p>
                  )}
                </div>
              </div>

              <Alert>
                <Info className='h-4 w-4' />
                <AlertDescription>
                  Choose the category and level that best match your course
                  content. This helps students find your course.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5' />
                Learning Objectives & Prerequisites
              </CardTitle>
              <CardDescription>
                Define what students will learn and what they need to know
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Learning Objectives */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label>Learning Objectives *</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addObjective}
                  >
                    <Plus className='h-4 w-4 mr-1' />
                    Add Objective
                  </Button>
                </div>

                {errors.objectives && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.objectives}
                  </p>
                )}

                <div className='space-y-2'>
                  {learningObjectives.map((objective, index) => (
                    <div key={objective.id} className='flex gap-2'>
                      <div className='flex-1 flex gap-2 items-start'>
                        <div className='mt-3 text-muted-foreground font-medium'>
                          {index + 1}.
                        </div>
                        <Input
                          value={objective.text}
                          onChange={(e) =>
                            updateObjective(objective.id, e.target.value)
                          }
                          placeholder='e.g., Build responsive web applications'
                        />
                      </div>
                      {learningObjectives.length > 1 && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeObjective(objective.id)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Prerequisites */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label>Prerequisites (Optional)</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addPrerequisite}
                  >
                    <Plus className='h-4 w-4 mr-1' />
                    Add Prerequisite
                  </Button>
                </div>

                <div className='space-y-2'>
                  {prerequisites.map((prereq, index) => (
                    <div key={prereq.id} className='flex gap-2'>
                      <div className='flex-1 flex gap-2 items-start'>
                        <div className='mt-3 text-muted-foreground font-medium'>
                          {index + 1}.
                        </div>
                        <Input
                          value={prereq.text}
                          onChange={(e) =>
                            updatePrerequisite(prereq.id, e.target.value)
                          }
                          placeholder='e.g., Basic understanding of HTML'
                        />
                      </div>
                      {prerequisites.length > 1 && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removePrerequisite(prereq.id)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Sparkles className='h-4 w-4' />
                <AlertDescription>
                  Clear objectives help students understand what they'll
                  achieve. Prerequisites help them determine if they're ready.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Layers className='h-5 w-5' />
                Course Content Structure
              </CardTitle>
              <CardDescription>
                Outline the lessons in your course (you can add detailed content
                later)
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <Label>Lessons *</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addLesson}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add Lesson
                </Button>
              </div>

              {errors.lessons && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.lessons}
                </p>
              )}

              <div className='space-y-4'>
                {lessons.map((lesson, index) => (
                  <Card key={lesson.id} className='border-2'>
                    <CardContent className='p-4 space-y-4'>
                      <div className='flex items-start gap-3'>
                        <div className='flex flex-col gap-1 pt-2'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6'
                            onClick={() => moveLessonUp(index)}
                            disabled={index === 0}
                          >
                            <GripVertical className='h-4 w-4' />
                          </Button>
                        </div>

                        <div className='flex-1 space-y-3'>
                          <div className='flex items-center gap-2'>
                            <Badge variant='secondary'>
                              Lesson {index + 1}
                            </Badge>
                            {lessons.length > 1 && (
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6 ml-auto'
                                onClick={() => removeLesson(lesson.id)}
                              >
                                <Trash2 className='h-4 w-4 text-destructive' />
                              </Button>
                            )}
                          </div>

                          <div className='space-y-2'>
                            <Input
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(lesson.id, 'title', e.target.value)
                              }
                              placeholder='Lesson title'
                            />
                          </div>

                          <div className='space-y-2'>
                            <Textarea
                              value={lesson.description}
                              onChange={(e) =>
                                updateLesson(
                                  lesson.id,
                                  'description',
                                  e.target.value,
                                )
                              }
                              placeholder='Lesson description'
                              rows={2}
                              className={
                                errors[`lesson_${index}`]
                                  ? 'border-destructive'
                                  : ''
                              }
                            />
                            {errors[`lesson_${index}`] && (
                              <p className='text-xs text-destructive'>
                                {errors[`lesson_${index}`]}
                              </p>
                            )}
                          </div>

                          <Select
                            value={lesson.content_type}
                            onValueChange={(value: any) =>
                              updateLesson(lesson.id, 'content_type', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='text'>Text Lesson</SelectItem>
                              <SelectItem value='video'>
                                Video Lesson
                              </SelectItem>
                              <SelectItem value='interactive'>
                                Interactive Lesson
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert>
                <Info className='h-4 w-4' />
                <AlertDescription>
                  You can reorder lessons by using the grip icon. Detailed
                  lesson content can be added after creating the course.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Course Settings & Pricing
              </CardTitle>
              <CardDescription>
                Configure final details for your course
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='estimatedDuration'>Estimated Hours *</Label>
                <div className='flex gap-2'>
                  <Clock className='h-5 w-5 mt-2 text-muted-foreground' />
                  <Input
                    id='estimatedDuration'
                    type='number'
                    min='0'
                    step='0.5'
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder='e.g., 10'
                    className={
                      errors.estimatedDuration ? 'border-destructive' : ''
                    }
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Total course duration in hours
                </p>
                {errors.estimatedDuration && (
                  <p className='text-sm text-destructive'>
                    {errors.estimatedDuration}
                  </p>
                )}
              </div>

              <Separator />

              <div className='space-y-4'>
                <Label>Pricing</Label>
                <div className='grid grid-cols-2 gap-4'>
                  <Card
                    className={`cursor-pointer transition-all ${pricing === 'free' ? 'border-primary border-2' : ''}`}
                    onClick={() => setPricing('free')}
                  >
                    <CardContent className='p-4 text-center'>
                      <Sparkles className='h-8 w-8 mx-auto mb-2 text-primary' />
                      <p className='font-medium'>Free</p>
                      <p className='text-xs text-muted-foreground'>
                        No charge to students
                      </p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${pricing === 'paid' ? 'border-primary border-2' : ''}`}
                    onClick={() => setPricing('paid')}
                  >
                    <CardContent className='p-4 text-center'>
                      <DollarSign className='h-8 w-8 mx-auto mb-2 text-primary' />
                      <p className='font-medium'>Paid</p>
                      <p className='text-xs text-muted-foreground'>
                        Set a price
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {pricing === 'paid' && (
                  <div className='space-y-2'>
                    <Label htmlFor='price'>Price (USD) *</Label>
                    <div className='flex gap-2'>
                      <DollarSign className='h-5 w-5 mt-2 text-muted-foreground' />
                      <Input
                        id='price'
                        type='number'
                        step='0.01'
                        min='0'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder='29.99'
                        className={errors.price ? 'border-destructive' : ''}
                      />
                    </div>
                    {errors.price && (
                      <p className='text-sm text-destructive'>{errors.price}</p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className='space-y-4'>
                <Label>Tags (Optional)</Label>
                <div className='flex gap-2'>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder='Add a tag...'
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type='button' variant='outline' onClick={addTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {tags.map((tag) => (
                      <Badge key={tag} variant='secondary'>
                        {tag}
                        <button
                          type='button'
                          onClick={() => removeTag(tag)}
                          className='ml-1 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className='text-xs text-muted-foreground'>
                  {tags.length}/10 tags
                </p>
              </div>

              <Separator />

              <div className='space-y-4'>
                <Label>Course Options</Label>

                <div className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <p className='font-medium'>Public Course</p>
                    <p className='text-sm text-muted-foreground'>
                      Make this course visible to everyone
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className='h-5 w-5'
                  />
                </div>

                <div className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <p className='font-medium'>Certificate Enabled</p>
                    <p className='text-sm text-muted-foreground'>
                      Award certificate upon completion
                    </p>
                  </div>
                  <input
                    type='checkbox'
                    checked={certificateEnabled}
                    onChange={(e) => setCertificateEnabled(e.target.checked)}
                    className='h-5 w-5'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className='flex items-center justify-between pt-6 border-t'>
        <Button
          type='button'
          variant='outline'
          onClick={currentStep === 1 ? onCancel : handleBack}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
            <Check className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
