import React, { useEffect, useState } from 'react';
import { progressApi } from '../../utils/api-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Trophy,
  BookOpen,
  Play,
  Pause,
  Volume2,
  Maximize,
  FileText,
  Image as ImageIcon,
  FileCode,
  Download,
  ExternalLink,
  Presentation,
  FileVideo,
  File,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { InteractiveQuiz } from './InteractiveQuiz';
import { toast } from 'sonner';

interface LessonPlayerProps {
  lesson: any;
  course: any;
  onNavigate: (page: string, data?: any) => void;
  onComplete?: () => void;
}

// Content type component renderers
function VideoContent({ content }: { content: any }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className='space-y-6'>
      <div className='aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden relative group'>
        {content.videoUrl ? (
          <>
            {content.videoUrl.includes('youtube.com') ||
            content.videoUrl.includes('youtu.be') ? (
              <iframe
                className='w-full h-full'
                src={content.videoUrl.replace('watch?v=', 'embed/')}
                title={content.title}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            ) : (
              <video
                className='w-full h-full'
                controls
                poster={content.thumbnail}
              >
                <source src={content.videoUrl} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center text-white space-y-4'>
              <div className='w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center'>
                <Play className='w-10 h-10' />
              </div>
              <div>
                <p className='text-xl font-semibold mb-2'>
                  {content.title || 'Video Lesson'}
                </p>
                <p className='text-white/70'>{content.duration || '15:30'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {content.transcript && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Video Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='prose prose-sm max-w-none text-muted-foreground'>
              {content.transcript}
            </div>
          </CardContent>
        </Card>
      )}

      {content.description && (
        <div className='prose max-w-none'>
          <p className='text-muted-foreground leading-relaxed'>
            {content.description}
          </p>
        </div>
      )}
    </div>
  );
}

function TextContent({ content }: { content: any }) {
  return (
    <div className='space-y-6'>
      {content.title && (
        <div>
          <h2 className='text-2xl font-bold mb-2'>{content.title}</h2>
          {content.subtitle && (
            <p className='text-lg text-muted-foreground'>{content.subtitle}</p>
          )}
        </div>
      )}

      <div className='prose prose-lg max-w-none dark:prose-invert'>
        {content.html ? (
          <div dangerouslySetInnerHTML={{ __html: content.html }} />
        ) : (
          <div className='space-y-4 text-muted-foreground leading-relaxed'>
            {content.text && <p>{content.text}</p>}
            {content.paragraphs &&
              content.paragraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
          </div>
        )}

        {content.keyPoints && (
          <Card className='my-6 border-l-4 border-l-primary'>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Lightbulb className='w-5 h-5 text-primary' />
                Key Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 list-disc list-inside'>
                {content.keyPoints.map((point: string, idx: number) => (
                  <li key={idx} className='text-muted-foreground'>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ImageContent({ content }: { content: any }) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className='space-y-6'>
      <div className='relative'>
        <div className='absolute top-4 right-4 z-10 flex gap-2'>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => setZoom(Math.min(zoom + 25, 200))}
            className='glass'
          >
            <ZoomIn className='w-4 h-4' />
          </Button>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => setZoom(Math.max(zoom - 25, 50))}
            className='glass'
          >
            <ZoomOut className='w-4 h-4' />
          </Button>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => setZoom(100)}
            className='glass'
          >
            Reset
          </Button>
        </div>

        <div className='overflow-auto bg-muted/30 rounded-xl p-8 max-h-[600px]'>
          <img
            src={
              content.imageUrl ||
              'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200'
            }
            alt={content.title || 'Lesson image'}
            className='mx-auto rounded-lg shadow-lg transition-transform'
            style={{ transform: `scale(${zoom / 100})` }}
          />
        </div>
      </div>

      {content.caption && (
        <Card className='bg-primary/5 border-primary/20'>
          <CardContent className='p-4'>
            <p className='text-sm text-muted-foreground italic'>
              {content.caption}
            </p>
          </CardContent>
        </Card>
      )}

      {content.description && (
        <div className='prose max-w-none'>
          <p className='text-muted-foreground leading-relaxed'>
            {content.description}
          </p>
        </div>
      )}

      {content.annotations && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Image Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {content.annotations.map((annotation: any, idx: number) => (
                <div key={idx} className='flex items-start gap-3'>
                  <Badge className='mt-0.5'>{idx + 1}</Badge>
                  <p className='text-sm text-muted-foreground'>{annotation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SlideContent({ content }: { content: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.slides || [content];

  return (
    <div className='space-y-6'>
      <Card className='border-2'>
        <CardContent className='p-8'>
          <div className='min-h-[400px] flex flex-col items-center justify-center space-y-6'>
            {slides[currentSlide].imageUrl ? (
              <img
                src={slides[currentSlide].imageUrl}
                alt={`Slide ${currentSlide + 1}`}
                className='max-h-[350px] rounded-lg shadow-lg'
              />
            ) : (
              <div className='text-center space-y-4 max-w-2xl'>
                {slides[currentSlide].title && (
                  <h2 className='text-3xl font-bold'>
                    {slides[currentSlide].title}
                  </h2>
                )}
                {slides[currentSlide].content && (
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    {slides[currentSlide].content}
                  </p>
                )}
                {slides[currentSlide].bullets && (
                  <ul className='text-left space-y-2 list-disc list-inside'>
                    {slides[currentSlide].bullets.map(
                      (bullet: string, idx: number) => (
                        <li key={idx} className='text-muted-foreground'>
                          {bullet}
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className='flex items-center justify-between'>
        <Button
          variant='outline'
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className='w-4 h-4 mr-2' />
          Previous Slide
        </Button>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <div className='flex gap-1'>
            {slides.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          variant='outline'
          onClick={() =>
            setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))
          }
          disabled={currentSlide === slides.length - 1}
        >
          Next Slide
          <ChevronRight className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </div>
  );
}

function DocumentContent({ content }: { content: any }) {
  return (
    <div className='space-y-6'>
      <Card className='border-2'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle>{content.title || 'Document'}</CardTitle>
                <p className='text-sm text-muted-foreground mt-1'>
                  {content.fileType || 'PDF'} • {content.fileSize || '2.5 MB'}
                </p>
              </div>
            </div>
            <div className='flex gap-2'>
              <Button size='sm' variant='outline'>
                <ExternalLink className='w-4 h-4 mr-2' />
                Open
              </Button>
              <Button size='sm'>
                <Download className='w-4 h-4 mr-2' />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {content.embedUrl ? (
            <div className='aspect-[4/5] bg-muted rounded-lg overflow-hidden'>
              <iframe
                src={content.embedUrl}
                className='w-full h-full'
                title={content.title}
              />
            </div>
          ) : (
            <div className='aspect-[4/5] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center'>
              <div className='text-center space-y-4'>
                <File className='w-16 h-16 mx-auto text-muted-foreground' />
                <div>
                  <p className='font-medium'>Document Preview</p>
                  <p className='text-sm text-muted-foreground'>
                    Click download to view the full document
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {content.summary && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Document Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground leading-relaxed'>
              {content.summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CodeContent({ content }: { content: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='space-y-6'>
      {content.description && (
        <div className='prose max-w-none'>
          <p className='text-muted-foreground leading-relaxed'>
            {content.description}
          </p>
        </div>
      )}

      <Card className='border-2'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                <FileCode className='w-5 h-5 text-primary' />
              </div>
              <div>
                <CardTitle className='text-lg'>
                  {content.title || 'Code Example'}
                </CardTitle>
                <p className='text-sm text-muted-foreground'>
                  {content.language || 'javascript'}
                </p>
              </div>
            </div>
            <Button size='sm' variant='outline' onClick={handleCopy}>
              {copied ? (
                <CheckCircle2 className='w-4 h-4 mr-2' />
              ) : (
                <FileCode className='w-4 h-4 mr-2' />
              )}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className='bg-slate-950 text-slate-50 p-6 rounded-lg overflow-x-auto'>
            <code className='text-sm font-mono'>{content.code}</code>
          </pre>
        </CardContent>
      </Card>

      {content.explanation && (
        <Card className='bg-primary/5 border-primary/20'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Lightbulb className='w-5 h-5 text-primary' />
              Code Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground leading-relaxed'>
              {content.explanation}
            </p>
          </CardContent>
        </Card>
      )}

      {content.output && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Expected Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className='bg-muted p-4 rounded-lg overflow-x-auto'>
              <code className='text-sm font-mono'>{content.output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InteractiveContent({ content }: { content: any }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className='space-y-6'>
      <Card className='bg-gradient-to-br from-primary/5 to-secondary/5 border-2'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='w-5 h-5 text-primary' />
            {content.title || 'Interactive Exercise'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='prose max-w-none'>
            <p className='text-muted-foreground leading-relaxed'>
              {content.description}
            </p>
          </div>

          {content.challenge && (
            <Card className='border-l-4 border-l-primary'>
              <CardContent className='p-4'>
                <p className='font-medium mb-2'>Challenge:</p>
                <p className='text-muted-foreground'>{content.challenge}</p>
              </CardContent>
            </Card>
          )}

          <div>
            <label className='block text-sm font-medium mb-2'>
              Your Solution
            </label>
            <textarea
              className='w-full min-h-[200px] p-4 rounded-lg border-2 bg-background font-mono text-sm focus:border-primary transition-colors'
              placeholder='Type your solution here...'
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          </div>

          <div className='flex gap-3'>
            <Button className='flex-1'>
              <CheckCircle2 className='w-4 h-4 mr-2' />
              Submit Answer
            </Button>
            <Button
              variant='outline'
              onClick={() => setShowSolution(!showSolution)}
            >
              <Lightbulb className='w-4 h-4 mr-2' />
              {showSolution ? 'Hide' : 'Show'} Solution
            </Button>
          </div>

          {showSolution && content.solution && (
            <Card className='bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'>
              <CardHeader>
                <CardTitle className='text-lg text-green-700 dark:text-green-400'>
                  Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className='bg-background p-4 rounded-lg overflow-x-auto'>
                  <code className='text-sm font-mono'>{content.solution}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MixedContent({ content }: { content: any }) {
  return (
    <div className='space-y-6'>
      <Tabs defaultValue='content' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='content'>Content</TabsTrigger>
          <TabsTrigger value='resources'>Resources</TabsTrigger>
          <TabsTrigger value='notes'>Notes</TabsTrigger>
          <TabsTrigger value='discussion'>Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value='content' className='mt-6 space-y-6'>
          {content.sections?.map((section: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className='prose max-w-none'>
                {section.type === 'text' && <TextContent content={section} />}
                {section.type === 'image' && <ImageContent content={section} />}
                {section.type === 'code' && <CodeContent content={section} />}
                {section.type === 'video' && <VideoContent content={section} />}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value='resources' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {content.resources?.map((resource: any, idx: number) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <FileText className='w-5 h-5 text-primary' />
                      <div>
                        <p className='font-medium'>{resource.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <Button size='sm' variant='ghost'>
                      <Download className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='notes' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Your Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className='w-full min-h-[300px] p-4 rounded-lg border bg-background'
                placeholder='Take notes while learning...'
              />
              <Button className='mt-4'>Save Notes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='discussion' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Discussion feature coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component
export function LessonPlayer({
  lesson,
  course,
  onNavigate,
  onComplete,
}: LessonPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadProgress();
  }, [lesson.id]);

  useEffect(() => {
    saveProgress();
  }, [currentStep]);

  const loadProgress = async () => {
    try {
      const data = await progressApi.get(lesson.id);
      const progressData = data?.progress ?? data;
      if (progressData) {
        setProgress(progressData.percent || 0);
        setCurrentStep(progressData.state?.currentStep || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    const totalSteps = getContentSteps().length;
    const newProgress = Math.round(((currentStep + 1) / totalSteps) * 100);

    try {
      await progressApi.save({
        lesson_id: lesson.id,
        percent: newProgress,
        state: { currentStep },
      });

      setProgress(newProgress);

      if (newProgress === 100 && !completed) {
        setCompleted(true);
        setXpEarned(10);
        toast.success('Lesson completed! +10 XP', {
          icon: <Trophy className='h-5 w-5 text-yellow-500' />,
        });
        onComplete?.();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getContentSteps = () => {
    if (lesson.kind === 'quiz' && lesson.content?.questions) {
      return lesson.content.questions;
    }
    if (lesson.content?.steps) {
      return lesson.content.steps;
    }
    return [lesson.content || { type: 'text', text: lesson.title }];
  };

  const steps = getContentSteps();
  const currentContent = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    setXpEarned(Math.floor(score / 10));
    toast.success(
      `Quiz completed! Score: ${score}% | +${Math.floor(score / 10)} XP`,
      {
        icon: <Trophy className='h-5 w-5 text-yellow-500' />,
      },
    );
  };

  const renderContent = (content: any) => {
    const contentType = content.type || lesson.kind || 'text';

    switch (contentType) {
      case 'video':
        return <VideoContent content={content} />;
      case 'text':
        return <TextContent content={content} />;
      case 'image':
        return <ImageContent content={content} />;
      case 'slides':
      case 'presentation':
        return <SlideContent content={content} />;
      case 'document':
      case 'pdf':
        return <DocumentContent content={content} />;
      case 'code':
        return <CodeContent content={content} />;
      case 'interactive':
      case 'exercise':
        return <InteractiveContent content={content} />;
      case 'mixed':
        return <MixedContent content={content} />;
      default:
        return <TextContent content={content} />;
    }
  };

  if (lesson.kind === 'quiz') {
    return (
      <div className='container max-w-4xl py-8'>
        <Button
          variant='ghost'
          onClick={() => onNavigate('course', course)}
          className='mb-6'
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Back to Course
        </Button>

        <InteractiveQuiz
          quiz={lesson.content}
          lessonId={lesson.id}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
      <div className='container max-w-5xl py-8 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <Button variant='ghost' onClick={() => onNavigate('course', course)}>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Back to Course
          </Button>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary' className='capitalize'>
              {currentContent?.type || lesson.kind}
            </Badge>
            {completed && (
              <Badge className='bg-green-500'>
                <CheckCircle2 className='w-3 h-3 mr-1' />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium'>Lesson Progress</span>
              <span className='text-sm font-medium'>{progress}%</span>
            </div>
            <Progress value={progress} className='h-2' />
            <div className='flex items-center justify-between mt-2 text-sm text-muted-foreground'>
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              {xpEarned > 0 && (
                <span className='flex items-center gap-1 text-yellow-600 font-medium'>
                  <Trophy className='h-4 w-4' />+{xpEarned} XP
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Title */}
        <div>
          <h1 className='text-4xl font-extrabold mb-2'>{lesson.title}</h1>
          <p className='text-lg text-muted-foreground'>{course.title}</p>
        </div>

        {/* Main Content */}
        <Card className='border-2'>
          <CardContent className='p-8'>
            {renderContent(currentContent)}
          </CardContent>
        </Card>

        {/* Hint Section */}
        {showHint && currentContent?.hint && (
          <Card className='bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 border-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Lightbulb className='h-5 w-5 text-blue-500' />
                Hint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {currentContent.hint}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className='flex items-center justify-between pt-4'>
          <Button
            variant='outline'
            size='lg'
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Previous
          </Button>

          <div className='flex items-center gap-2'>
            {currentContent?.hint && (
              <Button variant='ghost' onClick={() => setShowHint(!showHint)}>
                <Lightbulb className='mr-2 h-4 w-4' />
                {showHint ? 'Hide' : 'Show'} Hint
              </Button>
            )}

            {currentStep === steps.length - 1 && completed && (
              <Button
                variant='default'
                size='lg'
                onClick={() => onNavigate('course', course)}
                className='bg-green-600 hover:bg-green-700'
              >
                <CheckCircle2 className='mr-2 h-4 w-4' />
                Complete & Return
              </Button>
            )}
          </div>

          <Button
            size='lg'
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
