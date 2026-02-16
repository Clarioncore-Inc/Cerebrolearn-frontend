"use client";

import React, { useMemo, useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Award, 
  Target, 
  Users, 
  RefreshCw,
  Download,
  Share2,
  Calendar,
  BookOpen,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  BarChart3,
  History
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface EnhancedIQTestResultsProps {
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

export function EnhancedIQTestResults({ onNavigate, resultId }: EnhancedIQTestResultsProps) {
  const [showExplanations, setShowExplanations] = useState(false);

  // Load test result from localStorage
  const result = useMemo(() => {
    const results = JSON.parse(localStorage.getItem('iq_test_results') || '[]');
    return results.find((r: TestResult) => r.id === resultId) || null;
  }, [resultId]);

  // Load all results for historical comparison
  const allResults = useMemo(() => {
    const results = JSON.parse(localStorage.getItem('iq_test_results') || '[]');
    return results.sort((a: TestResult, b: TestResult) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

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
  const iqScore = Math.round(100 + (percentageScore - 50) * 0.3);
  
  // Calculate percentile
  const percentile = Math.round(
    (1 - Math.exp(-(iqScore - 100) / 15)) * 50 + 50
  );

  // Enhanced category analysis with detailed breakdown
  const categoryPerformance = useMemo(() => {
    const categories: { [key: string]: { 
      correct: number; 
      total: number;
      questions: any[];
      avgTime: number;
    } } = {
      'Pattern Recognition': { correct: 0, total: 0, questions: [], avgTime: 0 },
      'Logical Reasoning': { correct: 0, total: 0, questions: [], avgTime: 0 },
      'Spatial Awareness': { correct: 0, total: 0, questions: [], avgTime: 0 },
      'Mathematical': { correct: 0, total: 0, questions: [], avgTime: 0 },
      'Verbal Reasoning': { correct: 0, total: 0, questions: [], avgTime: 0 }
    };

    const typeMapping: { [key: string]: string } = {
      pattern: 'Pattern Recognition',
      logical: 'Logical Reasoning',
      spatial: 'Spatial Awareness',
      mathematical: 'Mathematical',
      verbal: 'Verbal Reasoning'
    };

    result.questions.forEach((q: any, index: number) => {
      const categoryName = typeMapping[q.type] || 'Pattern Recognition';
      categories[categoryName].total++;
      categories[categoryName].questions.push({
        ...q,
        userAnswer: result.answers[index],
        isCorrect: result.answers[index] === q.correctAnswer,
        index: index + 1
      });
      
      if (result.answers[index] === q.correctAnswer) {
        categories[categoryName].correct++;
      }
    });

    return Object.entries(categories)
      .filter(([_, data]) => data.total > 0)
      .map(([type, data]) => ({
        type,
        percentage: (data.correct / data.total) * 100,
        correct: data.correct,
        total: data.total,
        questions: data.questions
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [result]);

  // Identify strengths and weaknesses
  const strengths = categoryPerformance.filter(c => c.percentage >= 70);
  const weaknesses = categoryPerformance.filter(c => c.percentage < 70);

  // Historical comparison
  const historicalData = useMemo(() => {
    if (allResults.length <= 1) return null;

    const scores = allResults.map((r: TestResult) => {
      const score = Math.round(100 + (r.score - 50) * 0.3);
      return {
        date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score,
        id: r.id
      };
    }).reverse(); // Chronological order

    const improvement = scores.length >= 2 
      ? scores[scores.length - 1].score - scores[0].score 
      : 0;

    return { scores, improvement };
  }, [allResults]);

  const getIQLevel = (score: number) => {
    if (score >= 145) return { label: 'Genius', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' };
    if (score >= 130) return { label: 'Very Superior', color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/20' };
    if (score >= 120) return { label: 'Superior', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' };
    if (score >= 110) return { label: 'High Average', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/20' };
    if (score >= 90) return { label: 'Average', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' };
    if (score >= 80) return { label: 'Low Average', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Below Average', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/20' };
  };

  const level = getIQLevel(iqScore);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleShare = () => {
    const text = `I scored ${iqScore} (${level.label}) on the CerebroLearn IQ Test! 🧠`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My IQ Test Results',
        text: text,
        url: window.location.href
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text);
        toast.success('Result copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard!');
    }
  };

  const handleDownloadCertificate = () => {
    const certificate = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              🎓 CEREBROLEARN IQ TEST                     ║
║                 OFFICIAL CERTIFICATE                     ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Test Taker: ${localStorage.getItem('user_name') || 'Test Taker'}
║                                                          ║
║  IQ Score: ${iqScore}                                    
║  Classification: ${level.label}                          
║  Percentile: ${percentile}th                            
║                                                          ║
║  Test Date: ${new Date(result.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
║                                                          ║
║  Questions Answered: ${result.correctAnswers}/${result.totalQuestions}                         
║  Time Taken: ${formatTime(result.timeTaken)}                             
║                                                          ║
║  CATEGORY BREAKDOWN:                                     ║
${categoryPerformance.map(cat => 
  `║  • ${cat.type}: ${cat.correct}/${cat.total} (${cat.percentage.toFixed(0)}%)${' '.repeat(Math.max(0, 32 - cat.type.length))}║`
).join('\n')}
║                                                          ║
║  This certificate verifies the completion of the         ║
║  CerebroLearn IQ Assessment.                            ║
║                                                          ║
║  Certificate ID: ${result.id}                            
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IQ_Certificate_${iqScore}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Certificate downloaded!');
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'Pattern Recognition': return '🔷';
      case 'Logical Reasoning': return '🧩';
      case 'Spatial Awareness': return '📐';
      case 'Mathematical': return '🔢';
      case 'Verbal Reasoning': return '📝';
      default: return '🎯';
    }
  };

  const getCategoryDescription = (type: string) => {
    switch (type) {
      case 'Pattern Recognition': return 'Ability to identify and predict patterns in sequences';
      case 'Logical Reasoning': return 'Capacity for logical thinking and deductive reasoning';
      case 'Spatial Awareness': return 'Understanding of spatial relationships and visual processing';
      case 'Mathematical': return 'Numerical reasoning and mathematical problem-solving';
      case 'Verbal Reasoning': return 'Language comprehension and verbal analysis';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-6 shadow-lg">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Enhanced IQ Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Completed on {new Date(result.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Main Score Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-background border-2">
          <CardContent className="py-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="md:col-span-1">
                <div className="text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                  {iqScore}
                </div>
                <div className="text-sm text-muted-foreground mb-2">IQ Score</div>
                <Badge className={`${level.bgColor} ${level.color} border-0 px-4 py-1`}>
                  {level.label}
                </Badge>
              </div>
              
              <div>
                <div className="text-6xl font-bold text-secondary mb-3">
                  {percentile}
                  <span className="text-2xl align-super">th</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Percentile</div>
                <p className="text-xs text-muted-foreground">
                  Better than {percentile}% of test takers
                </p>
              </div>
              
              <div>
                <div className="text-6xl font-bold text-primary mb-3">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground mb-1">Correct Answers</div>
                <p className="text-xs text-muted-foreground">
                  {result.score.toFixed(1)}% accuracy
                </p>
              </div>

              <div>
                <div className="text-6xl font-bold text-cyan-600 mb-3">
                  {formatTime(result.timeTaken)}
                </div>
                <div className="text-sm text-muted-foreground mb-1">Time Taken</div>
                <p className="text-xs text-muted-foreground">
                  Avg: {Math.round(result.timeTaken / result.totalQuestions)}s/question
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button onClick={handleDownloadCertificate} size="lg">
            <Download className="h-5 w-5 mr-2" />
            Download Certificate
          </Button>
          <Button onClick={handleShare} variant="outline" size="lg">
            <Share2 className="h-5 w-5 mr-2" />
            Share Results
          </Button>
          <Button onClick={() => onNavigate('iq-test-landing')} variant="outline" size="lg">
            <RefreshCw className="h-5 w-5 mr-2" />
            Retake Test
          </Button>
          <Button onClick={() => onNavigate('browse-psychologists')} variant="secondary" size="lg">
            <Users className="h-5 w-5 mr-2" />
            Consult a Psychologist
          </Button>
        </div>

        {/* Tabs for Different Views */}
        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
            <TabsTrigger value="explanations">Question Review</TabsTrigger>
            <TabsTrigger value="history">Historical Progress</TabsTrigger>
            <TabsTrigger value="insights">Insights & Tips</TabsTrigger>
          </TabsList>

          {/* Category Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Detailed Category Analysis
                </CardTitle>
                <CardDescription>
                  Your performance across different cognitive domains
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoryPerformance.map((category) => (
                  <div key={category.type} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getCategoryIcon(category.type)}</span>
                        <div>
                          <h4 className="font-semibold text-lg">{category.type}</h4>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryDescription(category.type)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {category.percentage.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.correct}/{category.total} correct
                        </div>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Target className="h-5 w-5" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {strengths.map((cat) => (
                        <li key={cat.type} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{cat.type}</span>
                          <Badge variant="secondary">{cat.percentage.toFixed(0)}%</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Keep practicing to develop your strengths!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-orange-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingUp className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weaknesses.length > 0 ? (
                    <ul className="space-y-2">
                      {weaknesses.map((cat) => (
                        <li key={cat.type} className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">{cat.type}</span>
                          <Badge variant="outline">{cat.percentage.toFixed(0)}%</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Excellent! You're performing well across all categories.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Question Review Tab */}
          <TabsContent value="explanations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Question-by-Question Review
                </CardTitle>
                <CardDescription>
                  Review each question with explanations to learn from your answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryPerformance.map((category) => (
                  <div key={category.type} className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span>{getCategoryIcon(category.type)}</span>
                      {category.type}
                    </h3>
                    {category.questions.map((q: any) => (
                      <Card key={q.index} className={q.isCorrect ? 'border-green-500/30' : 'border-red-500/30'}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              q.isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                            }`}>
                              {q.isCorrect ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <X className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Question {q.index}</span>
                                <Badge variant={q.isCorrect ? 'default' : 'destructive'}>
                                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                                </Badge>
                              </div>
                              <p className="text-sm mb-3">{q.question}</p>
                              <div className="space-y-1 text-sm">
                                <p className="text-muted-foreground">
                                  Your answer: <span className={q.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                    {q.options[q.userAnswer]}
                                  </span>
                                </p>
                                {!q.isCorrect && (
                                  <p className="text-muted-foreground">
                                    Correct answer: <span className="text-green-600 font-medium">
                                      {q.options[q.correctAnswer]}
                                    </span>
                                  </p>
                                )}
                                <div className="flex items-start gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
                                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                                  <div className="text-xs">
                                    <p className="font-semibold mb-1">Explanation:</p>
                                    <p className="text-muted-foreground">
                                      {q.explanation || `This ${category.type.toLowerCase()} question tests your ability to ${getCategoryDescription(category.type).toLowerCase()}.`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historical Progress Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-6 w-6" />
                  Your Progress Over Time
                </CardTitle>
                <CardDescription>
                  Track your IQ score improvement across multiple test attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historicalData && historicalData.scores.length > 1 ? (
                  <div className="space-y-6">
                    {/* Improvement Summary */}
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {historicalData.scores.length}
                        </div>
                        <p className="text-xs text-muted-foreground">Tests Taken</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold mb-1 ${
                          historicalData.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {historicalData.improvement > 0 ? '+' : ''}{historicalData.improvement}
                        </div>
                        <p className="text-xs text-muted-foreground">IQ Points Change</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary mb-1">
                          {Math.max(...historicalData.scores.map(s => s.score))}
                        </div>
                        <p className="text-xs text-muted-foreground">Highest Score</p>
                      </div>
                    </div>

                    {/* Score Timeline */}
                    <div className="space-y-3">
                      {historicalData.scores.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-muted-foreground">
                            {item.date}
                          </div>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="h-10 bg-muted rounded-full overflow-hidden flex-1">
                              <div
                                className={`h-full rounded-full flex items-center justify-end px-3 ${
                                  item.id === resultId 
                                    ? 'bg-gradient-to-r from-primary to-secondary' 
                                    : 'bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/30'
                                }`}
                                style={{ width: `${(item.score / 150) * 100}%` }}
                              >
                                <span className="text-xs font-semibold text-white">
                                  {item.score}
                                </span>
                              </div>
                            </div>
                            {item.id === resultId && (
                              <Badge>Current</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Take more tests to track your progress over time!
                    </p>
                    <Button onClick={() => onNavigate('iq-test-landing')}>
                      Take Another Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights & Tips Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  Personalized Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Performance Insights */}
                <div>
                  <h3 className="font-semibold mb-3">📊 Your Performance Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <p className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      Your IQ score of <strong>{iqScore}</strong> places you in the <strong>{level.label}</strong> category,
                      which represents approximately the top <strong>{100 - percentile}%</strong> of the population.
                    </p>
                    {strengths.length > 0 && (
                      <p className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        You excel in <strong>{strengths[0].type}</strong>, demonstrating strong cognitive abilities in this area.
                      </p>
                    )}
                    {weaknesses.length > 0 && (
                      <p className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        Focusing on <strong>{weaknesses[0].type}</strong> could help you improve your overall score.
                      </p>
                    )}
                  </div>
                </div>

                {/* Improvement Tips */}
                <div>
                  <h3 className="font-semibold mb-3">💡 Tips for Improvement</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                      <span>Practice regularly with different types of cognitive puzzles and brain teasers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                      <span>Read widely to improve vocabulary and verbal reasoning skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                      <span>Engage in mathematical exercises to strengthen numerical reasoning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                      <span>Play strategy games like chess to enhance logical thinking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                      <span>Get adequate sleep and maintain a healthy lifestyle for optimal cognitive performance</span>
                    </li>
                  </ul>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="font-semibold mb-3">🎯 Recommended Next Steps</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto py-4"
                      onClick={() => onNavigate('iq-test-landing')}
                    >
                      <div className="text-left">
                        <div className="font-semibold mb-1">Retake the Test</div>
                        <div className="text-xs text-muted-foreground">
                          Practice to improve your score
                        </div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto py-4"
                      onClick={() => onNavigate('browse-psychologists')}
                    >
                      <div className="text-left">
                        <div className="font-semibold mb-1">Consult a Psychologist</div>
                        <div className="text-xs text-muted-foreground">
                          Get professional cognitive assessment
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
