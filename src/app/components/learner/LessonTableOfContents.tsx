import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Lock,
  Play,
  BookOpen,
  Clock,
  Award,
  FileText,
  Video,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface LessonTableOfContentsProps {
  courseId: string;
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  collapsed?: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  duration: string;
  completed: number;
  total: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'interactive';
  duration: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
}

export function LessonTableOfContents({ 
  courseId, 
  currentLessonId, 
  onLessonSelect,
  collapsed = false 
}: LessonTableOfContentsProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseStructure();
  }, [courseId]);

  useEffect(() => {
    // Auto-expand module containing current lesson
    if (currentLessonId) {
      const moduleWithCurrentLesson = modules.find(m => 
        m.lessons.some(l => l.id === currentLessonId)
      );
      if (moduleWithCurrentLesson) {
        setExpandedModules(prev => new Set(prev).add(moduleWithCurrentLesson.id));
      }
    }
  }, [currentLessonId, modules]);

  const loadCourseStructure = () => {
    try {
      // Mock data - in real app, fetch from API
      const mockModules: Module[] = [
        {
          id: 'module-1',
          title: 'Introduction to the Course',
          description: 'Get started with the fundamentals',
          duration: '45 min',
          completed: 3,
          total: 4,
          lessons: [
            { 
              id: 'lesson-1', 
              title: 'Welcome & Course Overview', 
              type: 'video', 
              duration: '10 min', 
              completed: true, 
              locked: false 
            },
            { 
              id: 'lesson-2', 
              title: 'Setting Up Your Environment', 
              type: 'reading', 
              duration: '15 min', 
              completed: true, 
              locked: false 
            },
            { 
              id: 'lesson-3', 
              title: 'Basic Concepts', 
              type: 'interactive', 
              duration: '12 min', 
              completed: true, 
              locked: false 
            },
            { 
              id: 'lesson-4', 
              title: 'Module 1 Quiz', 
              type: 'quiz', 
              duration: '8 min', 
              completed: false, 
              locked: false,
              current: currentLessonId === 'lesson-4'
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Core Principles',
          description: 'Dive deeper into fundamental concepts',
          duration: '2h 15min',
          completed: 1,
          total: 6,
          lessons: [
            { 
              id: 'lesson-5', 
              title: 'Fundamental Theory', 
              type: 'video', 
              duration: '25 min', 
              completed: true, 
              locked: false 
            },
            { 
              id: 'lesson-6', 
              title: 'Practical Applications', 
              type: 'interactive', 
              duration: '30 min', 
              completed: false, 
              locked: false,
              current: currentLessonId === 'lesson-6'
            },
            { 
              id: 'lesson-7', 
              title: 'Case Studies', 
              type: 'reading', 
              duration: '20 min', 
              completed: false, 
              locked: false 
            },
            { 
              id: 'lesson-8', 
              title: 'Hands-on Exercise', 
              type: 'interactive', 
              duration: '35 min', 
              completed: false, 
              locked: false 
            },
            { 
              id: 'lesson-9', 
              title: 'Advanced Techniques', 
              type: 'video', 
              duration: '18 min', 
              completed: false, 
              locked: false 
            },
            { 
              id: 'lesson-10', 
              title: 'Module 2 Assessment', 
              type: 'quiz', 
              duration: '12 min', 
              completed: false, 
              locked: false 
            }
          ]
        },
        {
          id: 'module-3',
          title: 'Advanced Topics',
          description: 'Master advanced concepts and techniques',
          duration: '3h 30min',
          completed: 0,
          total: 8,
          lessons: [
            { id: 'lesson-11', title: 'Advanced Theory Part 1', type: 'video', duration: '28 min', completed: false, locked: false },
            { id: 'lesson-12', title: 'Advanced Theory Part 2', type: 'video', duration: '30 min', completed: false, locked: false },
            { id: 'lesson-13', title: 'Complex Problem Solving', type: 'interactive', duration: '40 min', completed: false, locked: false },
            { id: 'lesson-14', title: 'Real-world Projects', type: 'reading', duration: '25 min', completed: false, locked: true },
            { id: 'lesson-15', title: 'Industry Best Practices', type: 'video', duration: '22 min', completed: false, locked: true },
            { id: 'lesson-16', title: 'Optimization Strategies', type: 'interactive', duration: '35 min', completed: false, locked: true },
            { id: 'lesson-17', title: 'Final Project', type: 'interactive', duration: '45 min', completed: false, locked: true },
            { id: 'lesson-18', title: 'Final Assessment', type: 'quiz', duration: '20 min', completed: false, locked: true }
          ]
        }
      ];

      setModules(mockModules);
      
      // Auto-expand first module
      setExpandedModules(new Set(['module-1']));
    } catch (error) {
      console.error('Error loading course structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const getTotalProgress = () => {
    const totalLessons = modules.reduce((sum, m) => sum + m.total, 0);
    const completedLessons = modules.reduce((sum, m) => sum + m.completed, 0);
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'reading':
        return FileText;
      case 'quiz':
        return HelpCircle;
      case 'interactive':
        return Lightbulb;
      default:
        return BookOpen;
    }
  };

  if (loading) {
    return (
      <Card className={collapsed ? 'w-16' : 'w-80'}>
        <CardHeader>
          <div className="h-6 w-full bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (collapsed) {
    return (
      <Card className="w-16 border-r">
        <div className="py-4 flex flex-col items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            title="Course Contents"
          >
            <BookOpen className="w-5 h-5" />
          </Button>
          <div className="flex flex-col gap-2">
            {modules.map((module, index) => {
              const isExpanded = expandedModules.has(module.id);
              const progress = (module.completed / module.total) * 100;
              
              return (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className="group relative"
                  title={module.title}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    progress === 100 
                      ? 'bg-green-500/10 text-green-600' 
                      : progress > 0 
                        ? 'bg-blue-500/10 text-blue-600' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  {progress === 100 && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600 fill-green-100" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-80 border-r h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Course Contents
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {Math.round(getTotalProgress())}%
          </Badge>
        </div>
        <div className="space-y-1">
          <Progress value={getTotalProgress()} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {modules.reduce((sum, m) => sum + m.completed, 0)} of {modules.reduce((sum, m) => sum + m.total, 0)} lessons completed
          </p>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="p-3 space-y-2">
          {modules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(module.id);
            const progress = (module.completed / module.total) * 100;

            return (
              <Collapsible
                key={module.id}
                open={isExpanded}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-accent"
                  >
                    <div className="flex items-start gap-3 w-full">
                      {/* Module Number */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        progress === 100 
                          ? 'bg-green-500/10 text-green-600' 
                          : progress > 0 
                            ? 'bg-blue-500/10 text-blue-600' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {moduleIndex + 1}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {module.title}
                          </h4>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {module.completed}/{module.total}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <Progress value={progress} className="h-1 mt-2" />
                      </div>
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-1">
                  <div className="ml-11 space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const LessonIcon = getLessonIcon(lesson.type);
                      const isCurrent = lesson.id === currentLessonId || lesson.current;

                      return (
                        <Button
                          key={lesson.id}
                          variant={isCurrent ? 'secondary' : 'ghost'}
                          className={`w-full justify-start h-auto p-2 ${
                            isCurrent ? 'bg-primary/10 border border-primary/20' : ''
                          } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !lesson.locked && onLessonSelect(lesson.id)}
                          disabled={lesson.locked}
                        >
                          <div className="flex items-start gap-2 w-full">
                            {/* Status Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {lesson.locked ? (
                                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                              ) : lesson.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                              ) : isCurrent ? (
                                <Play className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-xs line-clamp-2 ${
                                  isCurrent ? 'font-medium text-primary' : ''
                                }`}>
                                  {lesson.title}
                                </p>
                                <LessonIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </CardContent>
      </ScrollArea>

      {/* Footer with completion badge */}
      <div className="p-3 border-t bg-muted/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="w-3 h-3" />
            <span>Complete all to earn certificate</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
