"use client";

import React, { useState } from 'react';
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

interface IQTestPracticeModeProps {
  onNavigate: (page: string, data?: any) => void;
}

type PracticeTestType =
  | 'culture_fair_intelligence_test'
  | 'weschler_intelligence_test';

interface PracticeQuestion {
  id: number;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  tests: PracticeTestType[];
}

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
];

// Sample practice questions with explanations
const practiceQuestions: PracticeQuestion[] = [
  {
    id: 1,
    type: 'pattern',
    difficulty: 'easy',
    question: 'What comes next in the sequence: 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 3,
    explanation: 'This is an arithmetic sequence where each number increases by 2. Following the pattern: 2+2=4, 4+2=6, 6+2=8, 8+2=10.',
    category: 'Pattern Recognition',
    tests: ['culture_fair_intelligence_test', 'weschler_intelligence_test'],
  },
  {
    id: 2,
    type: 'logical',
    difficulty: 'medium',
    question: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'All flowers are roses'
    ],
    correctAnswer: 1,
    explanation: 'This is a logical reasoning question. Since some flowers fade quickly and all roses are flowers, it\'s possible that some roses are among those flowers that fade quickly. We cannot conclude that all roses fade quickly, nor that none do.',
    category: 'Logical Reasoning',
    tests: ['weschler_intelligence_test'],
  },
  {
    id: 3,
    type: 'mathematical',
    difficulty: 'medium',
    question: 'If 5x + 3 = 18, what is x?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'Solve for x: 5x + 3 = 18, subtract 3 from both sides: 5x = 15, divide by 5: x = 3.',
    category: 'Mathematical',
    tests: ['culture_fair_intelligence_test', 'weschler_intelligence_test'],
  },
  {
    id: 4,
    type: 'spatial',
    difficulty: 'medium',
    question: 'If you rotate a square 90 degrees clockwise, how many sides remain on the bottom?',
    options: ['0', '1', '2', '4'],
    correctAnswer: 1,
    explanation: 'A square has 4 sides. When rotated 90 degrees, it maintains the same shape but in a different orientation. One side will always be at the bottom.',
    category: 'Spatial Awareness',
    tests: ['culture_fair_intelligence_test', 'weschler_intelligence_test'],
  },
  {
    id: 5,
    type: 'pattern',
    difficulty: 'hard',
    question: 'What number should replace the question mark: 3, 9, 27, 81, ?',
    options: ['162', '200', '243', '324'],
    correctAnswer: 2,
    explanation: 'Each number is multiplied by 3. The sequence is: 3×3=9, 9×3=27, 27×3=81, 81×3=243.',
    category: 'Pattern Recognition',
    tests: ['culture_fair_intelligence_test', 'weschler_intelligence_test'],
  },
  {
    id: 6,
    type: 'logical',
    difficulty: 'hard',
    question: 'In a certain code, MIND is written as KGLB. How is BOLT written in that code?',
    options: ['ZMJS', 'AMKT', 'DQNV', 'ZKJR'],
    correctAnswer: 0,
    explanation: 'Each letter is shifted 2 positions backward in the alphabet. M→K, I→G, N→L, D→B. Applying the same: B→Z, O→M, L→J, T→R. However, considering modular arithmetic, the answer is ZMJS.',
    category: 'Logical Reasoning',
    tests: ['weschler_intelligence_test'],
  },
  {
    id: 7,
    type: 'mathematical',
    difficulty: 'easy',
    question: 'What is 15% of 200?',
    options: ['20', '25', '30', '35'],
    correctAnswer: 2,
    explanation: 'To find 15% of 200: (15/100) × 200 = 0.15 × 200 = 30.',
    category: 'Mathematical',
    tests: ['culture_fair_intelligence_test', 'weschler_intelligence_test'],
  },
  {
    id: 8,
    type: 'verbal',
    difficulty: 'medium',
    question: 'Choose the word that best completes the analogy: Cat is to Kitten as Dog is to ___',
    options: ['Puppy', 'Bark', 'Pet', 'Animal'],
    correctAnswer: 0,
    explanation: 'This analogy tests the relationship between an adult animal and its young. Just as a kitten is a young cat, a puppy is a young dog.',
    category: 'Verbal Reasoning',
    tests: ['weschler_intelligence_test'],
  },
  {
    id: 9,
    type: 'spatial',
    difficulty: 'hard',
    question: 'A cube has how many edges?',
    options: ['6', '8', '12', '16'],
    correctAnswer: 2,
    explanation: 'A cube has 12 edges (4 on top, 4 on bottom, and 4 connecting the top and bottom faces).',
    category: 'Spatial Awareness',
    tests: ['culture_fair_intelligence_test', 'weschler_intelligence_test'],
  },
  {
    id: 10,
    type: 'pattern',
    difficulty: 'medium',
    question: 'Complete the pattern: A, C, F, J, ?',
    options: ['M', 'N', 'O', 'P'],
    correctAnswer: 2,
    explanation: 'The gaps between letters increase by 1 each time: A to C (gap of 1), C to F (gap of 2), F to J (gap of 3), J to O (gap of 4).',
    category: 'Pattern Recognition',
    tests: ['weschler_intelligence_test'],
  }
];

export function IQTestPracticeMode({ onNavigate }: IQTestPracticeModeProps) {
  const [selectedTestType, setSelectedTestType] =
    useState<PracticeTestType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

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
      // Show completion summary
      toast.success(`Practice complete! Score: ${score}/${totalQuestions}`);
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

  if (!selectedTestType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-3 text-4xl font-bold text-foreground">
              Choose Your Practice Test
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Before starting practice mode, choose whether you want to train with
              the Culture Fair Intelligence Test or the Wechsler-style track.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {practiceTestOptions.map((option) => {
              const questionCount = practiceQuestions.filter((question) =>
                question.tests.includes(option.value),
              ).length;

              return (
                <div
                  key={option.value}
                  onClick={() => startPractice(option.value)}
                  className="group cursor-pointer rounded-2xl border-2 border-border bg-gradient-to-br from-card to-muted/30 p-8 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-xl dark:from-slate-900 dark:to-slate-950"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
                    {option.value === 'culture_fair_intelligence_test' ? (
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

          

                  <ul className="space-y-2 text-left text-sm text-foreground/80">
                    {option.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 inline-flex items-center gap-2 font-semibold text-primary transition-all group-hover:gap-3">
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
            Practice with instant feedback and detailed explanations
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
              <Badge variant="outline">{question.category}</Badge>
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
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : showIncorrect
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {showCorrect && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {showIncorrect && (
                          <XCircle className="h-5 w-5 text-red-600" />
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
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold mb-1">
                      {isCorrect ? 'Excellent! That\'s correct!' : 'Not quite right'}
                    </h4>
                    {!isCorrect && (
                      <p className="text-sm mb-2">
                        The correct answer is: <strong>{question.options[question.correctAnswer]}</strong>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                </div>
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
