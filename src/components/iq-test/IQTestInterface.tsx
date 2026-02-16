"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Brain, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface IQTestInterfaceProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Question {
  id: number;
  type: 'pattern' | 'logical' | 'spatial' | 'mathematical';
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const IQ_TEST_QUESTIONS: Question[] = [
  // Pattern Recognition (Questions 1-8)
  {
    id: 1,
    type: 'pattern',
    question: 'Complete the sequence: 2, 4, 8, 16, __',
    options: ['20', '24', '32', '64'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 2,
    type: 'pattern',
    question: 'What comes next in the series: A, C, E, G, __',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 3,
    type: 'pattern',
    question: 'Complete the pattern: 1, 1, 2, 3, 5, 8, __',
    options: ['11', '12', '13', '15'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 4,
    type: 'pattern',
    question: 'Find the next number: 100, 50, 25, 12.5, __',
    options: ['6.25', '5', '10', '7.5'],
    correctAnswer: 0,
    difficulty: 'medium'
  },
  {
    id: 5,
    type: 'pattern',
    question: 'Complete: 3, 6, 12, 24, 48, __',
    options: ['72', '84', '96', '108'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 6,
    type: 'pattern',
    question: 'What number completes the sequence: 2, 6, 12, 20, 30, __',
    options: ['38', '40', '42', '44'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 7,
    type: 'pattern',
    question: 'Find the pattern: 1, 4, 9, 16, 25, __',
    options: ['30', '35', '36', '49'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 8,
    type: 'pattern',
    question: 'Next in series: 5, 10, 20, 40, 80, __',
    options: ['120', '140', '160', '200'],
    correctAnswer: 2,
    difficulty: 'easy'
  },

  // Logical Reasoning (Questions 9-16)
  {
    id: 9,
    type: 'logical',
    question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.',
    options: ['True', 'False', 'Cannot be determined', 'Sometimes true'],
    correctAnswer: 0,
    difficulty: 'medium'
  },
  {
    id: 10,
    type: 'logical',
    question: 'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.20'],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 11,
    type: 'logical',
    question: 'Which word does not belong: Book, Magazine, Novel, Newspaper',
    options: ['Book', 'Magazine', 'Novel', 'Newspaper'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 12,
    type: 'logical',
    question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
    correctAnswer: 0,
    difficulty: 'hard'
  },
  {
    id: 13,
    type: 'logical',
    question: 'What is the next logical item: January, March, May, __',
    options: ['June', 'July', 'August', 'September'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 14,
    type: 'logical',
    question: 'If some Smaugs are Thors and some Thors are Thrains, then some Smaugs are definitely Thrains.',
    options: ['True', 'False', 'Cannot be determined', 'Always true'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 15,
    type: 'logical',
    question: 'Mary\'s father has 5 daughters: Nana, Nene, Nini, Nono. What is the 5th daughter\'s name?',
    options: ['Nunu', 'Mary', 'Nina', 'Nana'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 16,
    type: 'logical',
    question: 'A farmer has 15 sheep, and all but 8 die. How many are left?',
    options: ['7', '8', '0', '15'],
    correctAnswer: 1,
    difficulty: 'easy'
  },

  // Spatial Awareness (Questions 17-22)
  {
    id: 17,
    type: 'spatial',
    question: 'How many sides does a hexagon have?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 18,
    type: 'spatial',
    question: 'If you fold a square piece of paper in half twice and cut off a corner, how many holes will there be when unfolded?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 3,
    difficulty: 'medium'
  },
  {
    id: 19,
    type: 'spatial',
    question: 'A cube has how many edges?',
    options: ['6', '8', '10', '12'],
    correctAnswer: 3,
    difficulty: 'medium'
  },
  {
    id: 20,
    type: 'spatial',
    question: 'Which 3D shape has no vertices?',
    options: ['Cube', 'Pyramid', 'Sphere', 'Cylinder'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 21,
    type: 'spatial',
    question: 'How many faces does a rectangular prism have?',
    options: ['4', '5', '6', '8'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 22,
    type: 'spatial',
    question: 'If you rotate a square 90 degrees clockwise four times, what is its final orientation?',
    options: ['Same as original', '90 degrees rotated', '180 degrees rotated', '270 degrees rotated'],
    correctAnswer: 0,
    difficulty: 'medium'
  },

  // Mathematical (Questions 23-30)
  {
    id: 23,
    type: 'mathematical',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 24,
    type: 'mathematical',
    question: 'If x + 5 = 12, what is x?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 25,
    type: 'mathematical',
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 26,
    type: 'mathematical',
    question: 'What is 7 × 8?',
    options: ['54', '56', '58', '60'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 27,
    type: 'mathematical',
    question: 'If a train travels 60 miles in 1.5 hours, what is its average speed?',
    options: ['30 mph', '40 mph', '45 mph', '90 mph'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 28,
    type: 'mathematical',
    question: 'What is 3/4 + 1/2?',
    options: ['1', '1.25', '1.5', '2'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 29,
    type: 'mathematical',
    question: 'If 2x - 3 = 7, what is x?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 30,
    type: 'mathematical',
    question: 'What is 20% of 150?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    difficulty: 'easy'
  }
];

export function IQTestInterface({ onNavigate }: IQTestInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(IQ_TEST_QUESTIONS.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [startTime] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time runs out
          return 0;
        }
        if (prev === 300 && !showWarning) { // 5 minutes warning
          setShowWarning(true);
          toast.warning('5 minutes remaining!');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < IQ_TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = (autoSubmit = false) => {
    const unanswered = answers.filter(a => a === null).length;
    
    if (!autoSubmit && unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirm) return;
    }

    // Calculate score
    let correctCount = 0;
    IQ_TEST_QUESTIONS.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const percentageScore = (correctCount / IQ_TEST_QUESTIONS.length) * 100;

    // Save test result
    const result = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: percentageScore,
      correctAnswers: correctCount,
      totalQuestions: IQ_TEST_QUESTIONS.length,
      timeTaken,
      answers,
      questions: IQ_TEST_QUESTIONS
    };

    // Store in localStorage
    const existingResults = JSON.parse(localStorage.getItem('iq_test_results') || '[]');
    existingResults.push(result);
    localStorage.setItem('iq_test_results', JSON.stringify(existingResults));

    // Navigate to completion screen
    onNavigate('iq-test-completion', { resultId: result.id });
  };

  const currentQ = IQ_TEST_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / IQ_TEST_QUESTIONS.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">IQ Test</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {IQ_TEST_QUESTIONS.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant={timeRemaining < 300 ? 'destructive' : 'secondary'} className="text-base px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                {answeredCount}/{IQ_TEST_QUESTIONS.length} Answered
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress: {Math.round(progress)}%</span>
              <span className="capitalize">{currentQ.type} · {currentQ.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl flex-1">
                {currentQ.question}
              </CardTitle>
              <Badge variant="outline" className="capitalize ml-4">
                {currentQ.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <span className={isSelected ? 'font-medium' : ''}>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {currentQuestion === IQ_TEST_QUESTIONS.length - 1 ? (
              <Button
                onClick={() => handleSubmit(false)}
                size="lg"
                className="px-8"
              >
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNext}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Navigation Grid */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {IQ_TEST_QUESTIONS.map((_, index) => {
                const isAnswered = answers[index] !== null;
                const isCurrent = index === currentQuestion;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`aspect-square rounded-md text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isAnswered
                        ? 'bg-success/20 text-success hover:bg-success/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Warning if time is low */}
        {timeRemaining < 300 && (
          <Card className="mt-6 border-warning bg-warning/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                Less than 5 minutes remaining! The test will auto-submit when time runs out.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}