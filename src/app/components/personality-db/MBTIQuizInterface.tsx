"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { MBTI_QUIZ_QUESTIONS, computeMBTIType } from '../../data/mbtiQuizData';

interface MBTIQuizInterfaceProps {
  onNavigate: (page: string, data?: any) => void;
}

const TOTAL_QUESTIONS = MBTI_QUIZ_QUESTIONS.length;

export function MBTIQuizInterface({ onNavigate }: MBTIQuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(0 | 1 | null)[]>(new Array(TOTAL_QUESTIONS).fill(null));

  const currentQ = MBTI_QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  const handleAnswer = (optionIndex: 0 | 1) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered} unanswered questions. Are you sure you want to submit?`,
      );
      if (!confirmSubmit) return;
    }

    const computed = computeMBTIType(answers);

    const result = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: computed.type,
      scores: computed.scores,
      answers,
    };

    const existingResults = JSON.parse(localStorage.getItem('mbti_quiz_results') || '[]');
    existingResults.push(result);
    localStorage.setItem('mbti_quiz_results', JSON.stringify(existingResults));

    onNavigate('personality-test-results', { resultId: result.id });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#395192]/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#395192]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Personality Test</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2">
              {answeredCount}/{TOTAL_QUESTIONS} Answered
            </Badge>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>Progress: {Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.prompt}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index as 0 | 1)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-[#395192] bg-[#395192]/5'
                      : 'border-border hover:border-[#395192]/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-[#395192] bg-[#395192]' : 'border-border'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className={isSelected ? 'font-medium' : ''}>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === TOTAL_QUESTIONS - 1 ? (
            <Button onClick={handleSubmit} size="lg" className="px-8">
              See My Results
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
