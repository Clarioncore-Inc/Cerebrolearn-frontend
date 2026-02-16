import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { CourseCreatorSidebar, useSidebarWidth } from '../layout/CourseCreatorSidebar';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useCategories } from '../../hooks/useCategories';
import { cn } from '../ui/utils';
import { 
  BookOpen, 
  Target, 
  FileText, 
  Settings, 
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  Info,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  GripVertical,
  Eye,
  DollarSign,
  Save,
  Sparkles,
  AlertCircle,
  Clock,
  Users,
  CheckCircle2
} from 'lucide-react';
import * as dummyData from '../../utils/dummyData';

interface CourseCreationWizardPageProps {
  onNavigate: (page: string) => void;
}

interface LearningObjective {
  id: string;
  text: string;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  duration: number;
  type: 'video' | 'article' | 'quiz' | 'exercise';
}

export function CourseCreationWizardPage({ onNavigate }: CourseCreationWizardPageProps) {
  const sidebarWidth = useSidebarWidth();
  const { categories: categoryData } = useCategories();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    level: '',
    thumbnail: '',
    objectives: [] as LearningObjective[],
    sections: [] as CourseSection[],
    pricing: {
      model: 'free',
      price: 0,
      currency: 'USD'
    },
    language: 'english',
    prerequisites: '',
    targetAudience: ''
  });

  const [newObjective, setNewObjective] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Basic Info', icon: BookOpen, description: 'Course details & overview' },
    { id: 2, title: 'Objectives', icon: Target, description: 'Learning goals & audience' },
    { id: 3, title: 'Content', icon: FileText, description: 'Curriculum structure' },
    { id: 4, title: 'Settings', icon: Settings, description: 'Pricing & configuration' }
  ];

  const categories = categoryData.map(cat => cat.name);

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Portuguese'];

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('courseCreationDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData);
        setCurrentStep(draft.currentStep || 1);
        setLastSaved(new Date(draft.savedAt));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const draft = {
        formData,
        currentStep,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('courseCreationDraft', JSON.stringify(draft));
      setLastSaved(new Date());
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, currentStep]);

  // Validation functions
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length < 20) {
      newErrors.shortDescription = 'Short description must be at least 20 characters';
    }
    
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    } else if (formData.fullDescription.length < 50) {
      newErrors.fullDescription = 'Full description must be at least 50 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.level) {
      newErrors.level = 'Please select a difficulty level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.objectives.length < 3) {
      newErrors.objectives = 'Please add at least 3 learning objectives';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Please describe your target audience';
    } else if (formData.targetAudience.length < 20) {
      newErrors.targetAudience = 'Target audience description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.sections.length === 0) {
      newErrors.sections = 'Please add at least one section with lessons';
    } else {
      const totalLessons = formData.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      if (totalLessons < 3) {
        newErrors.sections = 'Please add at least 3 lessons total across all sections';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addObjective = () => {
    if (newObjective.trim() && newObjective.length >= 10) {
      setFormData({
        ...formData,
        objectives: [
          ...formData.objectives,
          { id: Date.now().toString(), text: newObjective.trim() }
        ]
      });
      setNewObjective('');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 2000);
    }
  };

  const removeObjective = (id: string) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter(obj => obj.id !== id)
    });
  };

  const addSection = () => {
    if (newSectionTitle.trim()) {
      setFormData({
        ...formData,
        sections: [
          ...formData.sections,
          { id: Date.now().toString(), title: newSectionTitle.trim(), lessons: [] }
        ]
      });
      setNewSectionTitle('');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 2000);
    }
  };

  const removeSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section and all its lessons?')) {
      setFormData({
        ...formData,
        sections: formData.sections.filter(s => s.id !== sectionId)
      });
    }
  };

  const addLessonToSection = (sectionId: string) => {
    setEditingSection(sectionId);
  };

  const saveLessonToSection = (sectionId: string, lesson: CourseLesson) => {
    setFormData({
      ...formData,
      sections: formData.sections.map(section =>
        section.id === sectionId
          ? { ...section, lessons: [...section.lessons, lesson] }
          : section
      )
    });
    setEditingSection(null);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 2000);
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.map(section =>
        section.id === sectionId
          ? { ...section, lessons: section.lessons.filter(l => l.id !== lessonId) }
          : section
      )
    });
  };

  const calculateTotalDuration = () => {
    return formData.sections.reduce((total, section) =>
      total + section.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
      0
    ) / 60;
  };

  const getTotalLessons = () => {
    return formData.sections.reduce((sum, section) => sum + section.lessons.length, 0);
  };

  const handleNext = () => {
    let isValid = true;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (!isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const newCourse = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.fullDescription,
      shortDescription: formData.shortDescription,
      instructor: 'Current User',
      instructorId: '1',
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      category: formData.category,
      level: formData.level,
      duration: `${Math.ceil(calculateTotalDuration())}h`,
      rating: 0,
      studentsCount: 0,
      lessonsCount: getTotalLessons(),
      price: formData.pricing.model === 'free' ? 0 : formData.pricing.price,
      isPaid: formData.pricing.model !== 'free',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      objectives: formData.objectives.map(o => o.text),
      prerequisites: formData.prerequisites,
      targetAudience: formData.targetAudience,
      language: formData.language,
      sections: formData.sections
    };

    dummyData.addCourse(newCourse);
    localStorage.removeItem('courseCreationDraft');
    onNavigate('creator-courses');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Your progress has been auto-saved as a draft.')) {
      onNavigate('creator-courses');
    }
  };

  const getCharacterCountColor = (current: number, min: number, max?: number) => {
    if (current < min) return 'text-muted-foreground';
    if (max && current > max) return 'text-destructive';
    return 'text-primary';
  };

  const getInputValidationClass = (fieldName: string, value: string, minLength: number) => {
    if (errors[fieldName]) return 'border-destructive';
    if (value.length >= minLength) return 'border-primary';
    return '';
  };

  return (
    <div className="flex">
      <CourseCreatorSidebar currentPage="creator-courses" onNavigate={onNavigate} />
      <div className={cn(
        "flex-1 transition-all duration-300",
        `lg:${sidebarWidth}`
      )}>
        <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background py-6 md:py-6 lg:py-12">
          <div className="container max-w-5xl px-4 md:px-6">
            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top duration-300">
                <Badge variant="outline" className="bg-background/95 backdrop-blur">
                  <Save className="h-3 w-3 mr-1.5" />
                  Saved {lastSaved.toLocaleTimeString()}
                </Badge>
              </div>
            )}

            {/* Success alert */}
            {showSuccessAlert && (
              <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top duration-300">
                <Alert className="bg-primary/10 border-primary">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertDescription>Successfully added!</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Header */}
            <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2">Create New Course</h1>
                  <p className="text-muted-foreground">
                    Build an engaging learning experience for your students
                  </p>
                </div>
                <Badge className="bg-primary text-white w-fit px-4 py-2">
                  Step {currentStep} of 4
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={(currentStep / 4) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {Math.round((currentStep / 4) * 100)}% Complete
                </p>
              </div>

              {/* Step Indicators */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 md:gap-3">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-primary text-white scale-110'
                            : isCompleted
                            ? 'bg-primary/20 text-primary border-2 border-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 md:h-6 md:w-6" />
                        ) : (
                          <StepIcon className="h-5 w-5 md:h-6 md:w-6" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs md:text-sm ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-border mb-8 md:mb-12" />

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Let&apos;s start with the fundamentals of your course
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Course Thumbnail */}
                    <div className="space-y-3">
                      <Label>Course Thumbnail (Optional)</Label>
                      <div className="flex items-start gap-4">
                        {formData.thumbnail ? (
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-primary">
                            <img
                              src={formData.thumbnail}
                              alt="Course thumbnail"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => setFormData({ ...formData, thumbnail: '' })}
                              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-48 h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors"
                          >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Upload Image</p>
                          </button>
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Add a compelling course image. Recommended size: 1280x720px
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>

                    {/* Course Title */}
                    <div className="space-y-3">
                      <Label htmlFor="title">
                        Course Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Complete Web Development Bootcamp 2024"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={getInputValidationClass('title', formData.title, 10)}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          A clear, descriptive title (10-100 characters)
                        </p>
                        <p className={`text-xs ${getCharacterCountColor(formData.title.length, 10, 100)}`}>
                          {formData.title.length}/100
                        </p>
                      </div>
                      {errors.title && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.title}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Short Description */}
                    <div className="space-y-3">
                      <Label htmlFor="shortDescription">
                        Short Description <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shortDescription"
                        placeholder="A brief one-liner that captures your course essence"
                        value={formData.shortDescription}
                        maxLength={150}
                        onChange={(e) =>
                          setFormData({ ...formData, shortDescription: e.target.value })
                        }
                        className={getInputValidationClass('shortDescription', formData.shortDescription, 20)}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Will appear in course cards and search results
                        </p>
                        <p className={`text-xs ${getCharacterCountColor(formData.shortDescription.length, 20, 150)}`}>
                          {formData.shortDescription.length}/150
                        </p>
                      </div>
                      {errors.shortDescription && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.shortDescription}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Full Description */}
                    <div className="space-y-3">
                      <Label htmlFor="fullDescription">
                        Full Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="fullDescription"
                        placeholder="Provide a comprehensive description of what students will learn, the skills they'll gain, and what makes this course unique..."
                        rows={6}
                        value={formData.fullDescription}
                        onChange={(e) =>
                          setFormData({ ...formData, fullDescription: e.target.value })
                        }
                        className={getInputValidationClass('fullDescription', formData.fullDescription, 50)}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Be detailed and engaging (minimum 50 characters)
                        </p>
                        <p className={`text-xs ${getCharacterCountColor(formData.fullDescription.length, 50)}`}>
                          {formData.fullDescription.length} characters
                        </p>
                      </div>
                      {errors.fullDescription && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.fullDescription}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Category and Level */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="category">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                        >
                          <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat.toLowerCase()}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-xs text-destructive">{errors.category}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="level">
                          Difficulty Level <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.level}
                          onValueChange={(value) =>
                            setFormData({ ...formData, level: value })
                          }
                        >
                          <SelectTrigger id="level" className={errors.level ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level.toLowerCase()}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.level && (
                          <p className="text-xs text-destructive">{errors.level}</p>
                        )}
                      </div>
                    </div>

                    <Alert className="bg-primary/5 border-primary/20">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Pro Tip:</strong> A compelling course title and description can increase enrollment by up to 40%. Be specific about the value students will gain!
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Learning Objectives */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Learning Objectives</CardTitle>
                        <CardDescription>
                          Define clear, measurable goals that students will achieve
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Objective */}
                    <div className="space-y-3">
                      <Label htmlFor="newObjective">
                        Add Learning Objective <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="newObjective"
                          placeholder="e.g., Build responsive websites using HTML, CSS, and JavaScript"
                          value={newObjective}
                          onChange={(e) => setNewObjective(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                          className="flex-1"
                        />
                        <Button
                          onClick={addObjective}
                          disabled={!newObjective.trim() || newObjective.length < 10}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Each objective should be specific and actionable (minimum 10 characters)
                      </p>
                    </div>

                    {/* Objectives List */}
                    {formData.objectives.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Your Learning Objectives ({formData.objectives.length})</Label>
                          <Badge variant="outline" className={formData.objectives.length >= 3 ? 'border-primary text-primary' : ''}>
                            {formData.objectives.length >= 3 ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Complete
                              </>
                            ) : (
                              `Need ${3 - formData.objectives.length} more`
                            )}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {formData.objectives.map((obj, index) => (
                            <div
                              key={obj.id}
                              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                            >
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-primary">{index + 1}</span>
                              </div>
                              <p className="flex-1 text-sm">{obj.text}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeObjective(obj.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.objectives && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.objectives}</AlertDescription>
                      </Alert>
                    )}

                    <div className="h-px bg-border" />

                    {/* Target Audience */}
                    <div className="space-y-3">
                      <Label htmlFor="targetAudience">
                        Target Audience <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="targetAudience"
                        placeholder="Who is this course designed for? e.g., Beginners with no coding experience, professionals looking to switch careers, etc."
                        rows={4}
                        value={formData.targetAudience}
                        onChange={(e) =>
                          setFormData({ ...formData, targetAudience: e.target.value })
                        }
                        className={getInputValidationClass('targetAudience', formData.targetAudience, 20)}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Be specific about who will benefit most from this course
                        </p>
                        <p className={`text-xs ${getCharacterCountColor(formData.targetAudience.length, 20)}`}>
                          {formData.targetAudience.length} characters
                        </p>
                      </div>
                      {errors.targetAudience && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.targetAudience}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Prerequisites */}
                    <div className="space-y-3">
                      <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
                      <Textarea
                        id="prerequisites"
                        placeholder="What should students know or have before taking this course? e.g., Basic computer skills, familiarity with Microsoft Office, etc."
                        rows={3}
                        value={formData.prerequisites}
                        onChange={(e) =>
                          setFormData({ ...formData, prerequisites: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Help students understand if they&apos;re ready for this course
                      </p>
                    </div>

                    <Alert className="bg-primary/5 border-primary/20">
                      <Users className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Best Practice:</strong> Clear objectives help students understand what they&apos;ll learn and increase course completion rates by 35%.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Course Content */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Course Content Structure</CardTitle>
                        <CardDescription>
                          Organize your course into sections and lessons
                        </CardDescription>
                      </div>
                      {getTotalLessons() > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Duration</p>
                          <p className="text-xl text-primary">
                            {Math.ceil(calculateTotalDuration())}h
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Section */}
                    <div className="space-y-3">
                      <Label htmlFor="newSection">
                        Add Course Section <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="newSection"
                          placeholder="e.g., Introduction to HTML & CSS"
                          value={newSectionTitle}
                          onChange={(e) => setNewSectionTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSection()}
                          className="flex-1"
                        />
                        <Button
                          onClick={addSection}
                          disabled={!newSectionTitle.trim()}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sections help organize your course into logical modules
                      </p>
                    </div>

                    {/* Sections List */}
                    {formData.sections.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Course Sections ({formData.sections.length})</Label>
                          <Badge variant="outline">
                            {getTotalLessons()} Lessons Total
                          </Badge>
                        </div>
                        <div className="space-y-4">
                          {formData.sections.map((section, sectionIndex) => (
                            <Card key={section.id} className="overflow-hidden">
                              <div className="bg-muted/50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm text-primary">{sectionIndex + 1}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{section.title}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}{' '}
                                      {section.lessons.length > 0 && `• ${Math.ceil(section.lessons.reduce((sum, l) => sum + l.duration, 0) / 60)}h`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addLessonToSection(section.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lesson
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSection(section.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              {/* Lessons */}
                              {section.lessons.length > 0 && (
                                <div className="p-4 space-y-2">
                                  {section.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted/30 transition-colors group"
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs">{lessonIndex + 1}</span>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm">{lesson.title}</p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                          {lesson.type} • {lesson.duration} min
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLesson(section.id, lesson.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add Lesson Form */}
                              {editingSection === section.id && (
                                <div className="p-4 border-t bg-muted/20">
                                  <LessonForm
                                    onSave={(lesson) => saveLessonToSection(section.id, lesson)}
                                    onCancel={() => setEditingSection(null)}
                                  />
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Start by adding your first section. Each section can contain multiple lessons.
                        </AlertDescription>
                      </Alert>
                    )}

                    {errors.sections && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.sections}</AlertDescription>
                      </Alert>
                    )}

                    <Alert className="bg-primary/5 border-primary/20">
                      <Clock className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Engagement Tip:</strong> Break content into 5-15 minute lessons for optimal engagement. Students prefer bite-sized, focused content!
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Course Settings</CardTitle>
                        <CardDescription>
                          Configure pricing, language, and access settings
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pricing Model */}
                    <div className="space-y-4">
                      <Label>Pricing Model <span className="text-destructive">*</span></Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            model: 'free',
                            icon: <Users className="h-5 w-5" />,
                            title: 'Free',
                            description: 'Maximize reach and build audience'
                          },
                          {
                            model: 'paid',
                            icon: <DollarSign className="h-5 w-5" />,
                            title: 'One-time Payment',
                            description: 'Single purchase for lifetime access'
                          },
                          {
                            model: 'subscription',
                            icon: <DollarSign className="h-5 w-5" />,
                            title: 'Subscription',
                            description: 'Recurring monthly/yearly payment'
                          }
                        ].map((option) => (
                          <button
                            key={option.model}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                pricing: { ...formData.pricing, model: option.model }
                              })
                            }
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              formData.pricing.model === option.model
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                formData.pricing.model === option.model
                                  ? 'bg-primary text-white'
                                  : 'bg-muted'
                              }`}>
                                {option.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{option.title}</h4>
                              </div>
                              {formData.pricing.model === option.model && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Input */}
                    {formData.pricing.model !== 'free' && (
                      <div className="space-y-3">
                        <Label htmlFor="price">
                          Price (USD) <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="49.99"
                            value={formData.pricing.price || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: { ...formData.pricing, price: parseFloat(e.target.value) || 0 }
                              })
                            }
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Set a competitive price. Average course price is $50-$150
                        </p>
                      </div>
                    )}

                    <div className="h-px bg-border" />

                    {/* Language */}
                    <div className="space-y-3">
                      <Label htmlFor="language">
                        Course Language <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) =>
                          setFormData({ ...formData, language: value })
                        }
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang.toLowerCase()}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Primary language used in course materials
                      </p>
                    </div>

                    {/* Course Summary */}
                    <Card className="bg-muted/30">
                      <CardHeader>
                        <CardTitle className="text-base">Course Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Title:</span>
                          <span className="font-medium">{formData.title || 'Not set'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium capitalize">{formData.category || 'Not set'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Level:</span>
                          <span className="font-medium capitalize">{formData.level || 'Not set'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sections:</span>
                          <span className="font-medium">{formData.sections.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Lessons:</span>
                          <span className="font-medium">{getTotalLessons()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Duration:</span>
                          <span className="font-medium">{Math.ceil(calculateTotalDuration())}h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Learning Objectives:</span>
                          <span className="font-medium">{formData.objectives.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Pricing:</span>
                          <span className="font-medium">
                            {formData.pricing.model === 'free'
                              ? 'Free'
                              : `$${formData.pricing.price.toFixed(2)} (${formData.pricing.model})`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Alert className="bg-primary/5 border-primary/20">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Ready to launch!</strong> Your course will be saved as a draft. You can edit it anytime before publishing.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-8 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <div className="flex flex-col-reverse sm:flex-row gap-3 order-1 sm:order-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="w-full sm:w-auto min-w-[140px]"
                  size="lg"
                >
                  {currentStep < 4 ? (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Course
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lesson Form Component
interface LessonFormProps {
  onSave: (lesson: CourseLesson) => void;
  onCancel: () => void;
}

function LessonForm({ onSave, onCancel }: LessonFormProps) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(10);
  const [type, setType] = useState<CourseLesson['type']>('video');

  const handleSave = () => {
    if (title.trim() && duration > 0) {
      onSave({
        id: Date.now().toString(),
        title: title.trim(),
        duration,
        type
      });
      setTitle('');
      setDuration(10);
      setType('video');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm">Add New Lesson</h4>
      
      <div className="space-y-3">
        <Input
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Duration (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 10)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Lesson Type</Label>
            <Select value={type} onValueChange={(value: CourseLesson['type']) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!title.trim()} size="sm" className="flex-1">
          <Check className="h-4 w-4 mr-2" />
          Save Lesson
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
}
