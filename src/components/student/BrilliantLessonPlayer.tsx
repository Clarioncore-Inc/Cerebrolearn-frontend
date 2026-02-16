import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Eye,
  EyeOff,
  Code,
  Play,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface Step {
  id: string;
  type: 'text' | 'question' | 'code' | 'drag-drop' | 'fill-blank' | 'explanation';
  content: any;
  hints?: string[];
  solution?: any;
  points: number;
}

interface BrilliantLessonPlayerProps {
  lessonId: string;
  steps: Step[];
  onComplete: (totalPoints: number) => void;
  onExit: () => void;
}

export function BrilliantLessonPlayer({
  lessonId,
  steps,
  onComplete,
  onExit,
}: BrilliantLessonPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: '',
  });
  const [pointsEarned, setPointsEarned] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState<Record<string, number>>({});

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    // Reset feedback when changing steps
    setFeedback({ show: false, correct: false, message: '' });
    setShowHint(false);
    setHintIndex(0);
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Lesson complete
      onComplete(pointsEarned);
      toast.success(`Lesson Complete! You earned ${pointsEarned} XP! 🎉`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleShowHint = () => {
    if (currentStep.hints && hintIndex < currentStep.hints.length) {
      setShowHint(true);
      setHintIndex(hintIndex + 1);
    }
  };

  const handleSubmitAnswer = () => {
    const userAnswer = userAnswers[currentStep.id];
    const attempts = attemptsUsed[currentStep.id] || 0;

    // Check answer based on step type
    let isCorrect = false;
    let message = '';

    switch (currentStep.type) {
      case 'question':
        if (currentStep.content.type === 'multiple-choice') {
          isCorrect = userAnswer === currentStep.solution;
          message = isCorrect
            ? 'Correct! Well done! 🎉'
            : 'Not quite right. Try again or use a hint.';
        } else if (currentStep.content.type === 'text') {
          const normalizedAnswer = userAnswer?.toLowerCase().trim();
          const normalizedSolution = currentStep.solution?.toLowerCase().trim();
          isCorrect = normalizedAnswer === normalizedSolution;
          message = isCorrect
            ? 'Perfect answer! 🎉'
            : 'Not quite. Check your answer and try again.';
        }
        break;

      case 'fill-blank':
        const allBlanksCorrect = currentStep.content.blanks.every(
          (blank: any, index: number) => {
            const userBlankAnswer = userAnswer?.[index]?.toLowerCase().trim();
            const correctAnswer = blank.answer.toLowerCase().trim();
            return userBlankAnswer === correctAnswer;
          }
        );
        isCorrect = allBlanksCorrect;
        message = isCorrect
          ? 'All blanks filled correctly! 🎉'
          : 'Some answers need correction. Try again!';
        break;

      case 'code':
        // Simple code validation (in real app, would run tests)
        isCorrect = userAnswer?.includes(currentStep.solution.keyword);
        message = isCorrect
          ? 'Code works perfectly! 🎉'
          : 'Code needs some adjustments. Check the requirements.';
        break;

      default:
        isCorrect = true;
        message = 'Great work!';
    }

    // Calculate points (reduce by 20% for each hint used)
    const pointReduction = hintIndex * 0.2;
    const pointsForThisStep = Math.floor(
      currentStep.points * (1 - pointReduction)
    );

    if (isCorrect) {
      setPointsEarned(pointsEarned + pointsForThisStep);
      setFeedback({ show: true, correct: true, message });
      
      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setFeedback({ show: true, correct: false, message });
      setAttemptsUsed({ ...attemptsUsed, [currentStep.id]: attempts + 1 });
    }
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'text':
        return <TextStep content={currentStep.content} />;
      
      case 'question':
        return (
          <QuestionStep
            content={currentStep.content}
            userAnswer={userAnswers[currentStep.id]}
            onAnswerChange={(answer) =>
              setUserAnswers({ ...userAnswers, [currentStep.id]: answer })
            }
          />
        );
      
      case 'code':
        return (
          <CodeStep
            content={currentStep.content}
            userAnswer={userAnswers[currentStep.id] || ''}
            onAnswerChange={(code) =>
              setUserAnswers({ ...userAnswers, [currentStep.id]: code })
            }
          />
        );
      
      case 'fill-blank':
        return (
          <FillBlankStep
            content={currentStep.content}
            userAnswers={userAnswers[currentStep.id] || {}}
            onAnswerChange={(answers) =>
              setUserAnswers({ ...userAnswers, [currentStep.id]: answers })
            }
          />
        );
      
      case 'explanation':
        return <ExplanationStep content={currentStep.content} />;
      
      default:
        return <div>Unknown step type</div>;
    }
  };

  const canSubmit = () => {
    const answer = userAnswers[currentStep.id];
    if (!answer) return false;

    switch (currentStep.type) {
      case 'question':
        return true;
      case 'code':
        return answer.trim().length > 0;
      case 'fill-blank':
        return Object.keys(answer).length === currentStep.content.blanks.length;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-500/5">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" onClick={onExit}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Exit Lesson
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{pointsEarned} XP</span>
              </div>
              <Badge variant="outline">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardContent className="p-8">
                  {renderStepContent()}
                </CardContent>
              </Card>

              {/* Feedback */}
              <AnimatePresence>
                {feedback.show && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card
                      className={`mb-6 ${
                        feedback.correct
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          {feedback.correct ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                          <p className="font-medium">{feedback.message}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hints */}
              {currentStep.hints && currentStep.hints.length > 0 && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShowHint}
                        disabled={hintIndex >= currentStep.hints.length || feedback.correct}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        {showHint ? 'Next Hint' : 'Show Hint'}
                        {showHint && ` (${hintIndex}/${currentStep.hints.length})`}
                      </Button>
                      {showHint && (
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            💡 {currentStep.hints[hintIndex - 1]}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep.type !== 'text' && currentStep.type !== 'explanation' && !feedback.correct && (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!canSubmit()}
                    >
                      Submit Answer
                    </Button>
                  )}
                  
                  {(currentStep.type === 'text' || 
                    currentStep.type === 'explanation' || 
                    feedback.correct) && (
                    <Button onClick={handleNext}>
                      {currentStepIndex === steps.length - 1 ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Complete Lesson
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Step Components

function TextStep({ content }: { content: any }) {
  return (
    <div className="prose max-w-none">
      <h2 className="mb-4">{content.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: content.body }} />
    </div>
  );
}

function QuestionStep({
  content,
  userAnswer,
  onAnswerChange,
}: {
  content: any;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
}) {
  if (content.type === 'multiple-choice') {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">{content.question}</h3>
        <div className="space-y-3">
          {content.options.map((option: any, index: number) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                userAnswer === index
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onAnswerChange(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      userAnswer === index
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {userAnswer === index && (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (content.type === 'text') {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{content.question}</h3>
        <Input
          placeholder="Type your answer here..."
          value={userAnswer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="text-lg"
        />
      </div>
    );
  }

  return null;
}

function CodeStep({
  content,
  userAnswer,
  onAnswerChange,
}: {
  content: any;
  userAnswer: string;
  onAnswerChange: (code: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">{content.title}</h3>
      <p className="text-muted-foreground mb-4">{content.description}</p>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="text-sm font-medium">{content.language || 'JavaScript'}</span>
        </div>
        <Textarea
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={content.placeholder || '// Write your code here...'}
          className="font-mono text-sm min-h-[300px] border-0 rounded-none"
        />
      </div>
      
      {content.expectedOutput && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Expected Output:</p>
          <code className="text-sm">{content.expectedOutput}</code>
        </div>
      )}
    </div>
  );
}

function FillBlankStep({
  content,
  userAnswers,
  onAnswerChange,
}: {
  content: any;
  userAnswers: Record<number, string>;
  onAnswerChange: (answers: Record<number, string>) => void;
}) {
  const handleBlankChange = (index: number, value: string) => {
    onAnswerChange({ ...userAnswers, [index]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">{content.title}</h3>
      <p className="text-lg leading-relaxed">
        {content.text.split('___').map((part: string, index: number) => (
          <React.Fragment key={index}>
            {part}
            {index < content.blanks.length && (
              <Input
                value={userAnswers[index] || ''}
                onChange={(e) => handleBlankChange(index, e.target.value)}
                className="inline-block w-32 mx-2 text-center"
                placeholder="?"
              />
            )}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}

function ExplanationStep({ content }: { content: any }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">{content.title}</h3>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content.explanation }} />
      </div>
      
      {content.solution && (
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowSolution(!showSolution)}
            className="mb-4"
          >
            {showSolution ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Solution
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Solution
              </>
            )}
          </Button>
          
          {showSolution && (
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <p className="font-medium mb-2">Solution:</p>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: content.solution }} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
