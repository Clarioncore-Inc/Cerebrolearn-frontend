"use client";

import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Loader2, BookOpen, Target, Layers, Clock, CheckCircle, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface AICourseGeneratorProps {
  onGenerate: (courseData: any) => void;
  onCancel: () => void;
}

export function AICourseGenerator({ onGenerate, onCancel }: AICourseGeneratorProps) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    targetAudience: '',
    level: '',
    duration: '',
    category: '',
    learningGoals: '',
    format: 'comprehensive', // comprehensive, quick-start, deep-dive
    includeQuizzes: true,
    includeProjects: true,
    tone: 'professional' // professional, casual, academic
  });

  const [generatedCourse, setGeneratedCourse] = useState<any>(null);

  const categories = [
    'Programming', 'Mathematics', 'Science', 'Business', 
    'Design', 'Languages', 'Marketing', 'Data Science',
    'Engineering', 'Arts', 'Health', 'Personal Development'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  const formats = [
    { value: 'comprehensive', label: 'Comprehensive Course', description: 'In-depth coverage with multiple modules' },
    { value: 'quick-start', label: 'Quick Start Guide', description: 'Essential concepts to get started quickly' },
    { value: 'deep-dive', label: 'Deep Dive', description: 'Advanced, specialized topic exploration' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Clear and business-appropriate' },
    { value: 'casual', label: 'Casual & Friendly', description: 'Conversational and approachable' },
    { value: 'academic', label: 'Academic', description: 'Formal and research-oriented' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation with progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Generate course structure based on inputs
      const generated = {
        title: `Complete ${formData.topic} Course ${new Date().getFullYear()}`,
        subtitle: `Master ${formData.topic} from ${formData.level.toLowerCase()} to expert`,
        description: formData.description || `Learn ${formData.topic} with this ${formData.format.replace('-', ' ')} course designed for ${formData.targetAudience}. ${formData.learningGoals}`,
        category: formData.category,
        level: formData.level,
        language: 'English',
        
        // AI-generated learning objectives
        learningObjectives: [
          `Understand the core concepts and fundamentals of ${formData.topic}`,
          `Apply ${formData.topic} principles to real-world scenarios`,
          `Build practical projects using ${formData.topic}`,
          `Master advanced techniques and best practices`,
          `Develop problem-solving skills in ${formData.topic}`
        ],
        
        // AI-generated prerequisites
        prerequisites: formData.level === 'Beginner' 
          ? ['No prior experience required', 'Basic computer skills']
          : ['Basic understanding of related concepts', 'Familiarity with foundational principles'],
        
        // AI-generated course structure
        sections: generateCourseSections(formData),
        
        // Pricing suggestion
        priceType: 'paid',
        price: formData.level === 'Beginner' ? '29.99' : formData.level === 'Intermediate' ? '49.99' : '79.99',
        
        // Settings
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        
        // AI metadata
        generatedByAI: true,
        generationDate: new Date().toISOString()
      };

      setGeneratedCourse(generated);
      setIsGenerating(false);
      setShowPreview(true);
      toast.success('Course generated successfully!');
    }, 4000);
  };

  const generateCourseSections = (data: any) => {
    const sectionCount = data.format === 'quick-start' ? 3 : data.format === 'deep-dive' ? 8 : 5;
    const sections = [];

    for (let i = 0; i < sectionCount; i++) {
      const sectionTitles = [
        `Introduction to ${data.topic}`,
        `Core Concepts and Fundamentals`,
        `Intermediate Techniques`,
        `Advanced Applications`,
        `Best Practices and Patterns`,
        `Real-World Projects`,
        `Performance and Optimization`,
        `Expert-Level Mastery`
      ];

      const lessonCount = data.format === 'quick-start' ? 3 : 5;
      const lessons = [];

      for (let j = 0; j < lessonCount; j++) {
        lessons.push({
          id: `lesson-${i}-${j}`,
          title: `${sectionTitles[i]} - Part ${j + 1}`,
          type: j === lessonCount - 1 && data.includeQuizzes ? 'quiz' : j % 2 === 0 ? 'video' : 'text',
          duration: j % 2 === 0 ? '15 mins' : '10 mins',
          content: ''
        });
      }

      sections.push({
        id: `section-${i}`,
        title: sectionTitles[Math.min(i, sectionTitles.length - 1)],
        description: `Master ${sectionTitles[Math.min(i, sectionTitles.length - 1)].toLowerCase()}`,
        lessons
      });
    }

    return sections;
  };

  const handleAcceptGeneration = () => {
    onGenerate(generatedCourse);
  };

  const handleRegenerate = () => {
    setShowPreview(false);
    setGeneratedCourse(null);
    handleGenerate();
  };

  if (showPreview && generatedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              AI-Generated Course Preview
            </h2>
            <p className="text-muted-foreground">Review and customize your AI-generated course</p>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Basic Info */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium text-lg">{generatedCourse.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Subtitle</Label>
                <p>{generatedCourse.subtitle}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{generatedCourse.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{generatedCourse.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Level</Label>
                  <p className="font-medium">{generatedCourse.level}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium">${generatedCourse.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {generatedCourse.learningObjectives.map((obj: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Course Structure
              </CardTitle>
              <CardDescription>
                {generatedCourse.sections.length} sections, {generatedCourse.sections.reduce((acc: number, s: any) => acc + s.lessons.length, 0)} lessons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {generatedCourse.sections.map((section: any, index: number) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">Section {index + 1}: {section.title}</p>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <Badge variant="outline">{section.lessons.length} lessons</Badge>
                  </div>
                  <div className="ml-4 space-y-1">
                    {section.lessons.map((lesson: any, lIndex: number) => (
                      <div key={lesson.id} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="flex-1">{lesson.title}</span>
                        <Badge variant="secondary" className="text-xs">{lesson.type}</Badge>
                        <span className="text-muted-foreground text-xs">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is an AI-generated course structure. You can edit and customize every aspect after accepting it.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRegenerate}>
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button onClick={handleAcceptGeneration}>
              Accept & Customize
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-4xl font-extrabold">Generate Course with AI</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let AI create a complete course structure for you. Provide some details about your course, and we'll generate a comprehensive curriculum in seconds.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
            1
          </div>
          <span className="text-sm font-medium">Topic</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
            2
          </div>
          <span className="text-sm font-medium">Details</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
            3
          </div>
          <span className="text-sm font-medium">Generate</span>
        </div>
      </div>

      {/* Step 1: Topic & Basics */}
      {step === 1 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>What do you want to teach?</CardTitle>
            <CardDescription>Tell us about your course topic and target audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Course Topic *</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., React Development, Digital Marketing, Python Programming"
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Be specific about what you want to teach</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What makes this course unique? What will students learn?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level *</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Aspiring web developers, Marketing professionals, Students"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Course Details */}
      {step === 2 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Customize your course structure</CardTitle>
            <CardDescription>Choose the format and style that fits your teaching goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Course Format *</Label>
              <div className="grid gap-3">
                {formats.map(format => (
                  <Card 
                    key={format.value}
                    className={`cursor-pointer transition-all ${formData.format === format.value ? 'border-primary border-2 bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setFormData({ ...formData, format: format.value })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 ${formData.format === format.value ? 'border-primary bg-primary' : 'border-muted'}`}>
                          {formData.format === format.value && (
                            <CheckCircle className="w-full h-full text-white" fill="currentColor" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{format.label}</p>
                          <p className="text-sm text-muted-foreground">{format.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Teaching Tone *</Label>
              <div className="grid grid-cols-3 gap-3">
                {tones.map(tone => (
                  <Card
                    key={tone.value}
                    className={`cursor-pointer transition-all ${formData.tone === tone.value ? 'border-primary border-2 bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setFormData({ ...formData, tone: tone.value })}
                  >
                    <CardContent className="p-3 text-center">
                      <p className="font-medium text-sm">{tone.label}</p>
                      <p className="text-xs text-muted-foreground">{tone.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoals">Learning Goals (Optional)</Label>
              <Textarea
                id="learningGoals"
                value={formData.learningGoals}
                onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
                placeholder="What specific skills or knowledge should students gain?"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Additional Features</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeQuizzes}
                    onChange={(e) => setFormData({ ...formData, includeQuizzes: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include quizzes and assessments</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeProjects}
                    onChange={(e) => setFormData({ ...formData, includeProjects: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include hands-on projects</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generate */}
      {step === 3 && !isGenerating && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Ready to generate your course!</CardTitle>
            <CardDescription>Review your selections and let AI create your course structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Topic</Label>
                  <p className="font-medium">{formData.topic}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{formData.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Level</Label>
                  <p className="font-medium">{formData.level}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Format</Label>
                  <p className="font-medium capitalize">{formData.format.replace('-', ' ')}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Target Audience</Label>
                <p className="font-medium">{formData.targetAudience}</p>
              </div>

              {formData.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{formData.description}</p>
                </div>
              )}
            </div>

            <Alert className="bg-primary/10 border-primary/30">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription>
                AI will generate a complete course structure including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Course title and description</li>
                  <li>Learning objectives and prerequisites</li>
                  <li>Structured curriculum with sections and lessons</li>
                  <li>Suggested pricing and settings</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button onClick={handleGenerate} className="w-full" size="lg">
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Course with AI
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generation in Progress */}
      {isGenerating && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">AI is generating your course...</h3>
                <p className="text-muted-foreground">This will only take a few seconds</p>
              </div>
              <div className="space-y-2">
                <Progress value={generationProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">{generationProgress}% complete</p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {generationProgress < 30 && <p>✨ Analyzing your requirements...</p>}
                {generationProgress >= 30 && generationProgress < 60 && <p>📚 Creating course structure...</p>}
                {generationProgress >= 60 && generationProgress < 90 && <p>🎯 Generating learning objectives...</p>}
                {generationProgress >= 90 && <p>✅ Finalizing your course...</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation (not during generation or preview) */}
      {!isGenerating && !showPreview && (
        <div className="flex items-center justify-between max-w-2xl mx-auto pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onCancel();
            }}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={() => {
              if (step < 3) setStep(step + 1);
            }}
            disabled={
              (step === 1 && (!formData.topic || !formData.category || !formData.level || !formData.targetAudience)) ||
              (step === 2 && (!formData.format || !formData.tone))
            }
          >
            {step === 3 ? 'Review' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}