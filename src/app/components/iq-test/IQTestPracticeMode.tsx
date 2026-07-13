"use client";

import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import {
  iqPracticeQuestionService,
  type IQPracticeQuestion,
} from '../../services/iqPracticeQuestionService';
import { normalizeIQKpiCategory } from '../../utils/iqKpis';
import { formatIQTestType, type IQTestType } from '../../utils/iqTestTypes';

interface IQTestPracticeModeProps {
  onNavigate: (page: string, data?: any) => void;
  allowedTestTypes?: IQTestType[];
  bookedTestLabel?: string;
}

type PracticeTestType = IQTestType;
type PracticeQuestion = IQPracticeQuestion;

const practiceTestOptions: Array<{
  value: PracticeTestType;
  title: string;
  description: string;
  highlights: string[];
}> = [
  {
    value: 'culture_fair_intelligence_test',
    title: 'Culture Fair Intelligence Test',
    description:
      'Practice with non-verbal, pattern-based, and spatial reasoning questions designed to reduce language bias.',
    highlights: [
      'Pattern and matrix-style reasoning',
      'Quantitative and spatial questions',
      'Lower emphasis on vocabulary and verbal analogies',
    ],
  },
  {
    value: 'weschler_intelligence_test',
    title: 'Wechsler Intelligence Test',
    description:
      'Practice with a broader mix of verbal, logical, numerical, and reasoning tasks inspired by Wechsler-style domains.',
    highlights: [
      'Verbal and logical reasoning prompts',
      'Working-memory-style numeric tasks',
      'Broader mix of question categories',
    ],
  },
  {
    value: 'wechsler_intelligence_scale_for_children',
    title: 'Wechsler Intelligence Scale for Children (WISC)',
    description:
      'Child-focused practice with age-appropriate verbal, reasoning, and working-memory-style questions inspired by the WISC.',
    highlights: [
      'Designed for children and younger learners',
      'Balanced verbal, pattern, and number tasks',
      'Friendly practice across core cognitive skills',
    ],
  },
  {
    value: 'stanford_binet',
    title: 'Stanford-Binet',
    description:
      'Practice with a broad mix of fluid reasoning, quantitative, verbal, and visual-spatial questions inspired by Stanford-Binet testing domains.',
    highlights: [
      'Fluid reasoning and knowledge-style prompts',
      'Quantitative and visual-spatial practice',
      'Wide-ranging cognitive skill coverage',
    ],
  },
  {
    value: 'ravens_progressive_matrices',
    title: "Raven's Progressive Matrices",
    description:
      'Practice with non-verbal matrix, pattern, and visual reasoning questions inspired by Raven-style assessments.',
    highlights: [
      'Strong focus on matrices and abstract patterns',
      'Minimal language demands',
      'Visual reasoning and spatial analysis',
    ],
  },
];

export function IQTestPracticeMode({ onNavigate, allowedTestTypes = [], bookedTestLabel }: IQTestPracticeModeProps) {
  const hasPracticeAccess = allowedTestTypes.length > 0;
  const [selectedTestType, setSelectedTestType] =
    useState<PracticeTestType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        const questions = await iqPracticeQuestionService.listPublic();
        if (!isMounted) return;
        setPracticeQuestions(questions);
        setQuestionsError(null);
      } catch (error) {
        if (!isMounted) return;
        setQuestionsError(
          error instanceof Error
            ? error.message
            : 'Unable to load practice questions right now.',
        );
      } finally {
        if (isMounted) {
          setIsLoadingQuestions(false);
        }
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const availablePracticeTestOptions = hasPracticeAccess
    ? practiceTestOptions.filter((option) => allowedTestTypes.includes(option.value))
    : [];

  const activeQuestions = selectedTestType
    ? practiceQuestions.filter((question) =>
        question.tests.includes(selectedTestType),
      )
    : [];
  const selectedTest = practiceTestOptions.find(
    (option) => option.value === selectedTestType,
  );
  const question = activeQuestions[currentQuestion];
  const totalQuestions = activeQuestions.length;
  const progress = totalQuestions
    ? ((currentQuestion + 1) / totalQuestions) * 100
    : 0;
  const isLastQuestion = totalQuestions > 0 && currentQuestion === totalQuestions - 1;
  const isCorrect = question ? selectedAnswer === question.correctAnswer : false;

  const startPractice = (testType: PracticeTestType) => {
    const questionCount = practiceQuestions.filter((question) =>
      question.tests.includes(testType),
    ).length;

    if (!questionCount) {
      toast.error('No practice questions are configured for this test yet.');
      return;
    }

    setSelectedTestType(testType);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(new Array(questionCount).fill(false));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (!question) return;

    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    setShowFeedback(true);

    // Update score if correct and not already answered
    if (isCorrect && !answeredQuestions[currentQuestion]) {
      setScore(score + 1);
      toast.success('Correct! 🎉');
    } else if (!isCorrect) {
      toast.error('Not quite. Check the explanation below.');
    }

    // Mark question as answered
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      toast.success(`Practice complete! Score: ${score}/${totalQuestions}`);
      handleChangeTest();
      return;
    }

    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
    toast.success('Practice mode restarted!');
  };

  const handleChangeTest = () => {
    setSelectedTestType(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!hasPracticeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background py-10">
        <div className="mx-auto max-w-3xl px-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <Brain className="h-10 w-10 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Book an IQ test to unlock practice</h2>
                <p className="text-muted-foreground">
                  Practice test becomes available after you book an IQ test. Once booked, you will see the practice test that matches your booking.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => onNavigate('book-psychologist', { backPage: 'dashboard' })}>
                  Book IQ Test
                </Button>
                <Button variant="outline" onClick={() => onNavigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedTestType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-3 text-4xl font-bold text-foreground">
              Select Your Practice Test
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {availablePracticeTestOptions.length === 1
                ? `Your practice track is ${bookedTestLabel ?? formatIQTestType(availablePracticeTestOptions[0]?.value)}.`
                : 'Choose the practice track that matches your booked IQ test.'}
            </p>
          </div>

          {questionsError ? (
            <p className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {questionsError}
            </p>
          ) : null}

          <div className={`grid gap-8 ${availablePracticeTestOptions.length === 1 ? 'justify-items-center' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
            {availablePracticeTestOptions.map((option) => {
              const questionCount = practiceQuestions.filter((question) =>
                question.tests.includes(option.value),
              ).length;

              return (
                <div
                  key={option.value}
                  onClick={() => startPractice(option.value)}
                  className={`group cursor-pointer rounded-2xl border-2 border-border bg-gradient-to-br from-card to-muted/30 p-8 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-xl dark:from-slate-900 dark:to-slate-950 ${availablePracticeTestOptions.length === 1 ? 'w-full max-w-2xl text-center' : ''}`}
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
                    {option.value === 'culture_fair_intelligence_test' ||
                    option.value === 'ravens_progressive_matrices' ? (
                      <Target className="h-10 w-10" />
                    ) : (
                      <Brain className="h-10 w-10" />
                    )}
                  </div>

                  <h2 className="mb-3 text-2xl font-bold text-foreground">
                    {option.title}
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    {option.description}
                  </p>

                  <p className="mb-4 text-sm font-medium text-primary/80">
                    {isLoadingQuestions ? 'Loading questions…' : `${questionCount} question${questionCount === 1 ? '' : 's'} available`}
                  </p>

                  <ul className={`space-y-2 text-sm text-foreground/80 ${availablePracticeTestOptions.length === 1 ? 'mx-auto max-w-xl text-center' : 'text-left'}`}>
                    {option.highlights.map((highlight) => (
                      <li key={highlight} className={`flex gap-2 ${availablePracticeTestOptions.length === 1 ? 'justify-center text-center' : 'items-start'}`}>
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-8 inline-flex items-center gap-2 font-semibold text-primary transition-all group-hover:gap-3 ${availablePracticeTestOptions.length === 1 ? 'justify-center' : ''}`}>
                    Start Practice
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button variant="ghost" onClick={() => onNavigate('/dashboard')}>
              ← Back to IQ Test Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto max-w-3xl px-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <Brain className="h-10 w-10 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">No questions available</h2>
                <p className="text-muted-foreground">
                  This test track does not have any practice questions configured right now.
                </p>
              </div>
              <Button variant="outline" onClick={handleChangeTest}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Test Choice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{selectedTest?.title}</h1>
          <p className="text-muted-foreground">
            Practice with instant feedback and explanations when available
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleChangeTest}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Test Choice
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Score: {score}/{totalQuestions}
                </span>
                <Button size="sm" variant="ghost" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </Badge>
              <Badge variant="outline">{normalizeIQKpiCategory(question.category)}</Badge>
            </div>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answer Options */}
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption = index === question.correctAnswer;
                  const showCorrect = showFeedback && isCorrectOption;
                  const showIncorrect = showFeedback && isSelected && !isCorrect;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        showCorrect
                          ? 'border-green-500 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950/45 dark:text-green-50'
                          : showIncorrect
                          ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/45 dark:text-red-50'
                          : isSelected
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border text-foreground hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex flex-1 cursor-pointer items-center justify-between"
                      >
                        <span>{option}</span>
                        {showCorrect && (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                        )}
                        {showIncorrect && (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
                        )}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Feedback Section */}
            {showFeedback && (
              <div className={`p-4 rounded-lg border-2 ${
                isCorrect 
                  ? 'border-green-500 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950/45 dark:text-green-50' 
                  : 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/45 dark:text-red-50'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 dark:text-green-300" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-0.5 dark:text-red-300" />
                  )}
                  <div>
                    <h4 className="font-semibold mb-1">
                      {isCorrect ? 'Excellent! That\'s correct!' : 'Not quite right'}
                    </h4>
                    {!isCorrect && (
                      <p className="mb-2 text-sm opacity-90">
                        The correct answer is: <strong>{question.options[question.correctAnswer]}</strong>
                      </p>
                    )}
                  </div>
                </div>
                
                {question.explanation ? (
                  <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900 dark:border-blue-800 dark:bg-slate-900/80 dark:text-slate-100">
                    <Lightbulb className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-300" />
                    <div>
                      <p className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-200">Explanation:</p>
                      <p className="text-sm text-blue-800 dark:text-slate-200">{question.explanation}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {!showFeedback ? (
                <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {isLastQuestion ? (
                    <>
                      <Trophy className="h-4 w-4 mr-2" />
                      Finish Practice
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">{score}</div>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-muted-foreground mb-1">
                  {answeredQuestions.filter(a => a).length - score}
                </div>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-1">
                  {answeredQuestions.filter(a => a).length > 0
                    ? Math.round((score / answeredQuestions.filter(a => a).length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => onNavigate('/dashboard')}>
            ← Back to IQ Test Home
          </Button>
        </div>
      </div>
    </div>
  );
}
