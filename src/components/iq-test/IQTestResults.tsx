"use client";

import React, { useMemo } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Award, 
  Target, 
  Users, 
  RefreshCw,
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';

interface IQTestResultsProps {
  onNavigate: (page: string, data?: any) => void;
  resultId: string;
}

interface TestResult {
  id: string;
  date: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  answers: (number | null)[];
  questions: any[];
}

export function IQTestResults({ onNavigate, resultId }: IQTestResultsProps) {
  // Load test result from localStorage
  const result = useMemo(() => {
    const results = JSON.parse(localStorage.getItem('iq_test_results') || '[]');
    return results.find((r: TestResult) => r.id === resultId) || null;
  }, [resultId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Result Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find your test results. Please try taking the test again.
            </p>
            <Button onClick={() => onNavigate('iq-test-landing')}>
              Back to IQ Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate IQ score (normalized)
  const percentageScore = result.score;
  const iqScore = Math.round(100 + (percentageScore - 50) * 0.3); // Simple normalization
  
  // Calculate percentile
  const percentile = Math.round(
    (1 - Math.exp(-(iqScore - 100) / 15)) * 50 + 50
  );

  // Analyze performance by category
  const categoryPerformance = useMemo(() => {
    const categories: { [key: string]: { correct: number; total: number } } = {
      pattern: { correct: 0, total: 0 },
      logical: { correct: 0, total: 0 },
      spatial: { correct: 0, total: 0 },
      mathematical: { correct: 0, total: 0 }
    };

    result.questions.forEach((q: any, index: number) => {
      categories[q.type].total++;
      if (result.answers[index] === q.correctAnswer) {
        categories[q.type].correct++;
      }
    });

    return Object.entries(categories).map(([type, data]) => ({
      type,
      percentage: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      correct: data.correct,
      total: data.total
    }));
  }, [result]);

  // Identify strengths and weaknesses
  const strengths = categoryPerformance
    .filter(c => c.percentage >= 70)
    .sort((a, b) => b.percentage - a.percentage);
  
  const weaknesses = categoryPerformance
    .filter(c => c.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage);

  const getIQLevel = (score: number) => {
    if (score >= 130) return { label: 'Very Superior', color: 'text-purple-600 dark:text-purple-400' };
    if (score >= 120) return { label: 'Superior', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 110) return { label: 'High Average', color: 'text-cyan-600 dark:text-cyan-400' };
    if (score >= 90) return { label: 'Average', color: 'text-green-600 dark:text-green-400' };
    if (score >= 80) return { label: 'Low Average', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Below Average', color: 'text-orange-600 dark:text-orange-400' };
  };

  const level = getIQLevel(iqScore);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const handleShare = () => {
    toast.success('Result sharing coming soon!');
  };

  const handleDownload = () => {
    toast.success('PDF download coming soon!');
  };

  const categoryLabels: { [key: string]: string } = {
    pattern: 'Pattern Recognition',
    logical: 'Logical Reasoning',
    spatial: 'Spatial Awareness',
    mathematical: 'Mathematical'
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Your IQ Test Results</h1>
          <p className="text-muted-foreground text-lg">
            Completed on {new Date(result.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Score Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <CardContent className="py-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-6xl font-bold gradient-text mb-2">
                  {iqScore}
                </div>
                <div className="text-sm text-muted-foreground mb-1">IQ Score</div>
                <Badge className={level.color + ' border-0'}>
                  {level.label}
                </Badge>
              </div>
              
              <div>
                <div className="text-6xl font-bold text-secondary mb-2">
                  {percentile}
                  <span className="text-2xl">th</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Percentile</div>
                <p className="text-xs text-muted-foreground">
                  Better than {percentile}% of test takers
                </p>
              </div>
              
              <div>
                <div className="text-6xl font-bold text-success mb-2">
                  {result.correctAnswers}
                  <span className="text-2xl">/{result.totalQuestions}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Correct Answers</div>
                <p className="text-xs text-muted-foreground">
                  Time: {formatTime(result.timeTaken)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Your Strengths
              </CardTitle>
              <CardDescription>
                Areas where you performed exceptionally well
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {strengths.length > 0 ? (
                strengths.map((category) => (
                  <div key={category.type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">
                        {categoryLabels[category.type]}
                      </span>
                      <span className="text-sm text-success font-medium">
                        {Math.round(category.percentage)}%
                      </span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.correct} out of {category.total} correct
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No categories reached 70% accuracy. Keep practicing!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-warning" />
                Areas for Improvement
              </CardTitle>
              <CardDescription>
                Focus on these to boost your cognitive skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weaknesses.length > 0 ? (
                weaknesses.map((category) => (
                  <div key={category.type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">
                        {categoryLabels[category.type]}
                      </span>
                      <span className="text-sm text-warning font-medium">
                        {Math.round(category.percentage)}%
                      </span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.correct} out of {category.total} correct
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Excellent! All categories performed above 70%. Keep up the great work!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Performance by Category</CardTitle>
            <CardDescription>
              Breakdown of your performance across all cognitive domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {categoryPerformance.map((category) => (
                <div 
                  key={category.type} 
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold capitalize">
                      {categoryLabels[category.type]}
                    </h4>
                    <Badge variant={category.percentage >= 70 ? 'default' : 'secondary'}>
                      {Math.round(category.percentage)}%
                    </Badge>
                  </div>
                  <Progress value={category.percentage} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {category.correct} correct out of {category.total} questions
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Want Deeper Insights?</CardTitle>
            <CardDescription className="text-base">
              Book a session with a certified psychologist to discuss your results 
              and get personalized cognitive development recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onNavigate('browse-psychologists')}
              >
                <Users className="w-5 h-5 mr-2" />
                Book a Psychologist
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('iq-test-landing')}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retake Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button onClick={() => onNavigate('browse-psychologists')} size="lg" className="bg-cyan-500 hover:bg-cyan-600">
            <Users className="w-4 h-4 mr-2" />
            Book a Psychologist
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Results
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            <Calendar className="w-4 h-4 mr-2" />
            View All Tests
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-muted">
          <CardContent className="py-6">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This IQ test provides an estimate of cognitive abilities 
              and should not be used for clinical diagnosis or official purposes. For comprehensive 
              psychological assessment, please consult with a licensed psychologist.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}