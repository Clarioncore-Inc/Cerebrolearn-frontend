import React, { useState } from 'react';
import { quizApi } from '../../utils/api-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface InteractiveQuizProps {
  quiz: any;
  lessonId: string;
  onComplete: (score: number) => void;
}

export function InteractiveQuiz({
  quiz,
  lessonId,
  onComplete,
}: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quiz?.questions || [];
  const question = questions[currentQuestion];

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmitAnswer = () => {
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    setAnswers({ ...answers, [currentQuestion]: selectedAnswer });
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      const correctAnswers =
        Object.entries(answers).filter(([index, answer]) => {
          const q = questions[parseInt(index)];
          return answer === q.correctAnswer;
        }).length + (isCorrect ? 1 : 0);

      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      setQuizComplete(true);

      // Save quiz attempt
      saveQuizAttempt(finalScore);
      onComplete(finalScore);
    }
  };

  const saveQuizAttempt = async (finalScore: number) => {
    try {
      await quizApi.submitAttempt({
        quiz_id: lessonId,
        answers,
        score: finalScore,
      });
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setAnswers({});
    setShowResult(false);
    setQuizComplete(false);
    setScore(0);
  };

  if (quizComplete) {
    return (
      <Card className='max-w-2xl mx-auto'>
        <CardContent className='p-12 text-center space-y-6'>
          <div className='mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center'>
            <Trophy className='h-10 w-10 text-white' />
          </div>

          <div>
            <h2 className='mb-2'>Quiz Complete!</h2>
            <p className='text-4xl font-bold text-primary mb-2'>{score}%</p>
            <p className='text-muted-foreground'>
              You got{' '}
              {Object.entries(answers).filter(([index, answer]) => {
                const q = questions[parseInt(index)];
                return answer === q.correctAnswer;
              }).length + (isCorrect ? 1 : 0)}{' '}
              out of {questions.length} questions correct
            </p>
          </div>

          <div className='flex items-center justify-center gap-4'>
            <Button onClick={handleRetry} variant='outline'>
              Try Again
            </Button>
            <Button onClick={() => onComplete(score)}>Continue</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <p className='text-muted-foreground'>No questions available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium'>Progress</span>
            <span className='text-sm font-medium'>
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            <div className='space-y-3'>
              {question.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                    showResult
                      ? option === question.correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : option === selectedAnswer
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-border'
                      : selectedAnswer === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    disabled={showResult}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className='flex-1 cursor-pointer'
                  >
                    {option}
                  </Label>
                  {showResult && option === question.correctAnswer && (
                    <CheckCircle2 className='h-5 w-5 text-green-500' />
                  )}
                  {showResult &&
                    option === selectedAnswer &&
                    option !== question.correctAnswer && (
                      <XCircle className='h-5 w-5 text-red-500' />
                    )}
                </div>
              ))}
            </div>
          </RadioGroup>

          {showResult && (
            <Card
              className={
                isCorrect
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200'
              }
            >
              <CardContent className='p-4'>
                <p className='font-medium mb-2'>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                {question.explanation && (
                  <p className='text-sm text-muted-foreground'>
                    {question.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className='flex justify-end'>
            {!showResult ? (
              <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestion < questions.length - 1
                  ? 'Next Question'
                  : 'View Results'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
