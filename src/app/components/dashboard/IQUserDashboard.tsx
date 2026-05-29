import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  CreditCard,
  Flame,
  Play,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useIQTestCheckout } from '../../hooks/useIQTestCheckout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface IQUserDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface IQQuestion {
  type: 'pattern' | 'logical' | 'spatial' | 'mathematical' | 'verbal';
  correctAnswer: number;
}

interface TestResult {
  id: string;
  date: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  answers: Array<number | null>;
  questions: IQQuestion[];
}

interface ResumeState {
  completion: number;
  answeredCount: number;
  totalQuestions: number;
  currentQuestion: number;
  lastSavedAt?: string;
}

const glassCardClassName =
  'border-border/60 bg-background/75 backdrop-blur-xl shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] hover:scale-[1.02] transition-all duration-300';

const emptyRadarData = [
  { metric: 'Pattern Recognition', score: 54 },
  { metric: 'Working Memory', score: 50 },
  { metric: 'Processing Speed', score: 48 },
  { metric: 'Verbal Intelligence', score: 52 },
  { metric: 'Spatial Reasoning', score: 49 },
];

const comparisonRows = [
  {
    feature: 'Scoring model',
    automated: 'Instant automated scoring',
    official: 'Psychologist-reviewed interpretation',
  },
  {
    feature: 'Documentation',
    automated: 'Practice-only insight',
    official: 'Signed report for formal use',
  },
  {
    feature: 'Session format',
    automated: 'Self-guided',
    official: 'Live proctored session via video call',
  },
  {
    feature: 'Outcome',
    automated: 'Great for personal benchmarking',
    official: 'Best for admissions, scholarships, and documentation',
  },
];

const challengeCards = [
  {
    title: 'Daily Brain Sprint',
    description: 'A fast cognitive warmup to sharpen pattern spotting and mental agility.',
    badge: '5 min',
    cta: 'Continue Practice',
    action: 'practice',
    icon: Zap,
    accent: 'from-primary/15 to-secondary/15',
  },
  {
    title: 'Logic Drills',
    description: 'Tight reasoning reps focused on deduction, sequences, and analytical speed.',
    badge: 'Recommended',
    cta: 'Launch Drill',
    action: 'practice',
    icon: Brain,
    accent: 'from-secondary/15 to-primary/10',
  },
  {
    title: 'Genius Benchmark',
    description: 'See how your latest performance compares with the greatest minds in history.',
    badge: 'Compare',
    cta: 'View Rankings',
    action: 'rankings',
    icon: Trophy,
    accent: 'from-amber-500/15 to-primary/10',
  },
];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const readJsonFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const calculateIQScore = (percentageScore: number) => Math.round(100 + (percentageScore - 50) * 0.3);

const calculatePercentile = (iqScore: number) =>
  clamp(Math.round((1 - Math.exp(-(iqScore - 100) / 15)) * 50 + 50), 1, 99);

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const getMetricLabel = (metric: string) => {
  switch (metric) {
    case 'Pattern Recognition':
      return 'Pattern';
    case 'Working Memory':
      return 'Memory';
    case 'Processing Speed':
      return 'Speed';
    case 'Verbal Intelligence':
      return 'Verbal';
    case 'Spatial Reasoning':
      return 'Spatial';
    default:
      return metric;
  }
};

const getTierName = (level: number) => {
  const tiers = ['Foundation', 'Analyst', 'Strategist', 'Prodigy', 'Mastermind', 'Visionary'];
  return tiers[Math.min(tiers.length - 1, Math.max(0, level - 1))];
};

export function IQUserDashboard({ onNavigate }: IQUserDashboardProps) {
  const { profile } = useAuth();
  const { formattedIQTestPrice } = useAppSettings();
  const { isStartingCheckout, startCheckout } = useIQTestCheckout(onNavigate);

  const allResults = useMemo(() => {
    const results = readJsonFromStorage<TestResult[]>('iq_test_results', []);
    return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const resumeState = useMemo(() => {
    const progress =
      readJsonFromStorage<Partial<ResumeState> | null>('iq_test_in_progress', null) ??
      readJsonFromStorage<Partial<ResumeState> | null>('iq_test_progress', null);

    if (!progress) return null;

    const totalQuestions = progress.totalQuestions || 30;
    const answeredCount = progress.answeredCount || 0;
    const completion = progress.completion || Math.round((answeredCount / totalQuestions) * 100);

    return {
      completion: clamp(completion),
      answeredCount,
      totalQuestions,
      currentQuestion: progress.currentQuestion || answeredCount + 1,
      lastSavedAt: progress.lastSavedAt,
    } satisfies ResumeState;
  }, []);

  const latestResult = allResults[allResults.length - 1] || null;
  const previousResult = allResults[allResults.length - 2] || null;
  const completedTests = allResults.length;
  const currentStreak = profile?.streak || 0;
  const userName = profile?.full_name?.split(' ')[0] || 'Explorer';

  const latestIQScore = latestResult ? calculateIQScore(latestResult.score) : null;
  const previousIQScore = previousResult ? calculateIQScore(previousResult.score) : null;
  const estimatedPercentile = latestIQScore ? calculatePercentile(latestIQScore) : null;
  const iqDelta = latestIQScore && previousIQScore ? latestIQScore - previousIQScore : 0;

  const categoryTotals = useMemo(() => {
    const totals = {
      pattern: { correct: 0, total: 0 },
      logical: { correct: 0, total: 0 },
      spatial: { correct: 0, total: 0 },
      mathematical: { correct: 0, total: 0 },
    };

    allResults.forEach((result) => {
      result.questions?.forEach((question, index) => {
        const type = question.type;
        if (!(type in totals)) return;

        totals[type as keyof typeof totals].total += 1;

        if (result.answers[index] === question.correctAnswer) {
          totals[type as keyof typeof totals].correct += 1;
        }
      });
    });

    return totals;
  }, [allResults]);

  const radarData = useMemo(() => {
    const latestAccuracy = latestResult?.score || 52;
    const getCategoryPercent = (key: keyof typeof categoryTotals, fallbackOffset = 0) => {
      const category = categoryTotals[key];
      if (!category.total) return clamp(latestAccuracy + fallbackOffset, 35, 92);
      return clamp((category.correct / category.total) * 100, 20, 100);
    };

    const pattern = getCategoryPercent('pattern', 6);
    const logical = getCategoryPercent('logical', 2);
    const spatial = getCategoryPercent('spatial', -2);
    const mathematical = getCategoryPercent('mathematical', 4);

    const totalQuestionsAttempted = allResults.reduce((sum, result) => sum + result.totalQuestions, 0);
    const totalTimeSpent = allResults.reduce((sum, result) => sum + result.timeTaken, 0);
    const avgTimePerQuestion = totalQuestionsAttempted ? totalTimeSpent / totalQuestionsAttempted : 42;
    const processingSpeed = clamp(100 - ((avgTimePerQuestion - 22) / 25) * 60, 35, 95);

    return [
      { metric: 'Pattern Recognition', score: Math.round(pattern) },
      { metric: 'Working Memory', score: Math.round((logical + mathematical) / 2) },
      { metric: 'Processing Speed', score: Math.round(processingSpeed) },
      { metric: 'Verbal Intelligence', score: Math.round(logical * 0.85 + latestAccuracy * 0.15) },
      { metric: 'Spatial Reasoning', score: Math.round(spatial) },
    ];
  }, [allResults, categoryTotals, latestResult]);

  const displayedRadarData = completedTests > 0 ? radarData : emptyRadarData;
  const strongestMetric = displayedRadarData.reduce((best, item) =>
    item.score > best.score ? item : best,
  );
  const breakdownMetrics = [...displayedRadarData].sort((a, b) => b.score - a.score);

  const trendData = useMemo(
    () =>
      allResults.map((result) => {
        const iqScore = calculateIQScore(result.score);
        return {
          date: formatShortDate(result.date),
          score: iqScore,
          percentile: calculatePercentile(iqScore),
        };
      }),
    [allResults],
  );

  const derivedXP = Math.max(
    profile?.xp || 0,
    completedTests * 35 + Math.max(0, iqDelta) * 10 + Math.round((latestResult?.score || 0) * 0.8),
  );
  const tierStep = 120;
  const currentTierLevel = Math.max(1, Math.floor(derivedXP / tierStep) + 1);
  const currentTierName = getTierName(currentTierLevel);
  const tierFloor = (currentTierLevel - 1) * tierStep;
  const tierProgress = clamp(((derivedXP - tierFloor) / tierStep) * 100, 0, 100);
  const xpToNextTier = Math.max(0, tierStep - (derivedXP - tierFloor));

  const unlockedBadges = useMemo(() => {
    const badges: string[] = [];

    if (completedTests >= 1) badges.push('Baseline Established');
    if (strongestMetric.metric === 'Pattern Recognition' && strongestMetric.score >= 70) {
      badges.push('Pattern Master');
    }
    if (displayedRadarData.find((item) => item.metric === 'Processing Speed')?.score >= 72) {
      badges.push('Fast Thinker');
    }
    if (completedTests >= 3) badges.push('Consistency Builder');
    if (iqDelta >= 5) badges.push('Upward Momentum');
    if ((latestIQScore || 0) >= 120) badges.push('High Performer');

    return badges.slice(0, 4);
  }, [completedTests, displayedRadarData, iqDelta, latestIQScore, strongestMetric]);

  const activityTimeline = useMemo(() => {
    if (!completedTests) {
      return [
        {
          id: 'start',
          title: 'Your cognitive baseline is ready to be created',
          subtitle: 'Take your first practice test to unlock live analytics and trend data.',
          icon: Sparkles,
          tone: 'text-primary',
        },
        {
          id: 'badge-preview',
          title: 'Unlock badges like Pattern Master and Fast Thinker',
          subtitle: 'Achievements appear automatically as soon as results come in.',
          icon: Star,
          tone: 'text-amber-500',
        },
      ];
    }

    const items = [
      latestResult
        ? {
            id: `latest-${latestResult.id}`,
            title: `Scored ${latestIQScore} on your latest assessment`,
            subtitle: `${formatShortDate(latestResult.date)} · ${estimatedPercentile}th percentile estimated`,
            icon: TrendingUp,
            tone: 'text-primary',
          }
        : null,
      currentStreak > 0
        ? {
            id: 'streak',
            title: `${currentStreak}-day cognitive streak active`,
            subtitle: 'Daily momentum helps stabilize performance gains.',
            icon: Flame,
            tone: 'text-orange-500',
          }
        : null,
      unlockedBadges[0]
        ? {
            id: 'badge-1',
            title: `Unlocked badge: ${unlockedBadges[0]}`,
            subtitle: 'Your dashboard updates each time a milestone is reached.',
            icon: Trophy,
            tone: 'text-amber-500',
          }
        : null,
      completedTests > 1
        ? {
            id: 'trend',
            title: `${iqDelta >= 0 ? '+' : ''}${iqDelta} IQ-point change across recorded attempts`,
            subtitle: `Based on ${completedTests} completed assessments in your history.`,
            icon: BarChart3,
            tone: iqDelta >= 0 ? 'text-emerald-500' : 'text-rose-500',
          }
        : null,
    ].filter(Boolean) as Array<{
      id: string;
      title: string;
      subtitle: string;
      icon: React.ComponentType<{ className?: string }>;
      tone: string;
    }>;

    return items;
  }, [completedTests, currentStreak, estimatedPercentile, iqDelta, latestIQScore, latestResult, unlockedBadges]);

  const quickStats = [
    {
      label: 'Tests Completed',
      value: completedTests.toString(),
      sublabel: completedTests > 0 ? 'Recorded attempts' : 'Start your first run',
      icon: Brain,
    },
    {
      label: 'Strongest Category',
      value: completedTests > 0 ? getMetricLabel(strongestMetric.metric) : 'Pending',
      sublabel: completedTests > 0 ? `${strongestMetric.score}% current signal` : 'Awaiting data',
      icon: Target,
    },
    {
      label: 'Estimated Percentile',
      value: estimatedPercentile ? `${estimatedPercentile}th` : '—',
      sublabel: latestIQScore ? `From IQ ${latestIQScore}` : 'Complete a test',
      icon: TrendingUp,
    },
    {
      label: 'Current Streak',
      value: `${currentStreak}`,
      sublabel: currentStreak > 0 ? 'Days of momentum' : 'Start a streak today',
      icon: Flame,
    },
  ];

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(57,81,146,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_28%)]'>
      <div className='container max-w-7xl py-8 md:py-10 space-y-6'>
        <div className='grid gap-6 lg:grid-cols-12'>
          <Card className={`lg:col-span-8 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 ${glassCardClassName}`}>
            <CardContent className='p-6 md:p-8'>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between'>
                  <div className='space-y-4'>
                    <Badge className='w-fit border-0 bg-primary/10 text-primary'>
                      <Sparkles className='mr-2 h-4 w-4' />
                      Cognitive Command Center
                    </Badge>
                    <div className='space-y-2'>
                      <h1 className='text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight whitespace-nowrap'>
                        Welcome back, {userName} 👋
                      </h1>
                      <p className='max-w-2xl text-base md:text-lg text-muted-foreground'>
                        Track your latest IQ signals, measure growth over time, and decide when to step up to
                        a psychologist-signed official assessment.
                      </p>
                    </div>
                  </div>

                  <div className='flex shrink-0 flex-col gap-3 sm:flex-row'>
                    <Button size='lg' className='shadow-lg' onClick={() => onNavigate('iq-test-landing')}>
                      <Play className='mr-2 h-5 w-5' />
                      Continue Practice
                    </Button>
                    <Button size='lg' variant='outline' onClick={() => onNavigate('genius-rankings')}>
                      <Trophy className='mr-2 h-5 w-5' />
                      View Rankings
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                  {quickStats.map((stat) => (
                    <div
                      key={stat.label}
                      className='rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300'
                    >
                      <div className='mb-4 flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground'>{stat.label}</span>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                          <stat.icon className='h-5 w-5' />
                        </div>
                      </div>
                      <p className='text-3xl font-bold tracking-tight'>{stat.value}</p>
                      <p className='mt-1 text-xs text-muted-foreground'>{stat.sublabel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-4 ${glassCardClassName}`}>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Zap className='h-5 w-5 text-primary' />
                    Cognitive Tier
                  </CardTitle>
                  <CardDescription>Progress toward your next command level.</CardDescription>
                </div>
                <Badge variant='secondary'>Lv. {currentTierLevel}</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 to-secondary/10 p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Current tier</p>
                    <p className='text-2xl font-bold'>{currentTierName}</p>
                  </div>
                  <div className='rounded-xl bg-background/80 px-3 py-2 text-sm font-semibold text-primary'>
                    {derivedXP} XP
                  </div>
                </div>
                <div className='mt-4 space-y-2'>
                  <Progress value={tierProgress} className='h-2.5' />
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{Math.round(tierProgress)}% to next tier</span>
                    <span>{xpToNextTier} XP remaining</span>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <p className='text-sm font-semibold text-foreground'>Quick access</p>
                <Button variant='outline' className='w-full justify-between' onClick={() => onNavigate('genius-rankings')}>
                  Benchmark against genius rankings
                  <ArrowRight className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-between'
                  onClick={startCheckout}
                  disabled={isStartingCheckout}
                >
                  {isStartingCheckout ? 'Redirecting to checkout…' : 'Explore official assessment'}
                  <CreditCard className='h-4 w-4' />
                </Button>
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-semibold text-foreground'>Unlocked signals</p>
                <div className='flex flex-wrap gap-2'>
                  {(unlockedBadges.length ? unlockedBadges : ['Starter Profile']).map((badge) => (
                    <Badge key={badge} variant='secondary' className='rounded-full'>
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-7 ${glassCardClassName}`}>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Brain className='h-5 w-5 text-primary' />
                    Cognitive Profile Analytics
                  </CardTitle>
                  <CardDescription>
                    Estimated from your completed IQ assessments and recent performance patterns.
                  </CardDescription>
                </div>
                <Badge variant='secondary'>{completedTests > 0 ? 'Live data' : 'Preview mode'}</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='rounded-2xl border border-border/60 bg-background/70 p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Top current signal</p>
                    <p className='text-2xl font-bold'>{strongestMetric.metric}</p>
                  </div>
                  <Badge className='border-0 bg-emerald-500/10 text-emerald-600'>{strongestMetric.score}%</Badge>
                </div>
                <p className='mt-3 text-sm text-muted-foreground'>
                  {completedTests > 0
                    ? 'This area currently leads your profile and represents your strongest performance pattern.'
                    : 'Complete your first assessment to replace this preview with your live cognitive signature.'}
                </p>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Target className='h-4 w-4 text-primary' />
                  <p className='font-semibold'>Strength vs. Opportunity</p>
                </div>
                {breakdownMetrics.map((metric, index) => {
                  const isStrength = index < 2;
                  return (
                    <div key={metric.metric} className='space-y-2'>
                      <div className='flex items-center justify-between gap-3 text-sm'>
                        <span className='font-medium'>{metric.metric}</span>
                        <span className={isStrength ? 'text-emerald-600' : 'text-amber-600'}>
                          {isStrength ? 'Strength' : 'Opportunity'} · {metric.score}%
                        </span>
                      </div>
                      <Progress value={metric.score} className='h-2.5' />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-5 ${glassCardClassName}`}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-primary' />
                Improvement Trend
              </CardTitle>
              <CardDescription>Score growth over time across your recorded IQ attempts.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              {completedTests > 0 ? (
                <>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='rounded-2xl border border-border/60 bg-muted/20 p-3 text-center'>
                      <p className='text-xs text-muted-foreground'>Latest IQ</p>
                      <p className='text-2xl font-bold'>{latestIQScore}</p>
                    </div>
                    <div className='rounded-2xl border border-border/60 bg-muted/20 p-3 text-center'>
                      <p className='text-xs text-muted-foreground'>Best score</p>
                      <p className='text-2xl font-bold'>
                        {Math.max(...trendData.map((item) => item.score))}
                      </p>
                    </div>
                    <div className='rounded-2xl border border-border/60 bg-muted/20 p-3 text-center'>
                      <p className='text-xs text-muted-foreground'>Change</p>
                      <p className={`text-2xl font-bold ${iqDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {iqDelta >= 0 ? '+' : ''}
                        {iqDelta}
                      </p>
                    </div>
                  </div>

                  <ResponsiveContainer width='100%' height={280}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id='iqTrendFill' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.45} />
                          <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
                      <XAxis dataKey='date' tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis domain={[80, 140]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='score'
                        stroke='hsl(var(--primary))'
                        strokeWidth={3}
                        fill='url(#iqTrendFill)'
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className='flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-center'>
                  <BarChart3 className='mb-4 h-10 w-10 text-primary' />
                  <p className='text-xl font-semibold'>No trend line yet</p>
                  <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                    Complete your first practice test to unlock score growth analytics, percentile tracking,
                    and momentum insights.
                  </p>
                  <Button className='mt-5' onClick={() => onNavigate('iq-test-landing')}>
                    <Play className='mr-2 h-4 w-4' />
                    Take First Practice Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`lg:col-span-12 ${glassCardClassName}`}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Sparkles className='h-5 w-5 text-primary' />
                Challenge Carousel
              </CardTitle>
              <CardDescription>Curated drills and comparison experiences to keep your cognitive edge sharp.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex gap-4 overflow-x-auto pb-2'>
                {challengeCards.map((challenge) => (
                  <Card
                    key={challenge.title}
                    className={`min-w-[280px] max-w-[320px] flex-1 border-border/60 bg-gradient-to-br ${challenge.accent} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
                  >
                    <CardContent className='flex h-full flex-col gap-4 p-5'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 text-primary'>
                          <challenge.icon className='h-6 w-6' />
                        </div>
                        <Badge variant='secondary'>{challenge.badge}</Badge>
                      </div>
                      <div>
                        <p className='text-lg font-semibold'>{challenge.title}</p>
                        <p className='mt-2 text-sm text-muted-foreground'>{challenge.description}</p>
                      </div>
                      <div className='mt-auto'>
                        <Button
                          variant='outline'
                          className='w-full justify-between bg-background/70'
                          onClick={() =>
                            onNavigate(
                              challenge.action === 'rankings' ? 'genius-rankings' : 'iq-test-landing',
                            )
                          }
                        >
                          {challenge.cta}
                          <ArrowRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-7 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 ${glassCardClassName}`}>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5 text-primary' />
                    Proctored Path
                  </CardTitle>
                  <CardDescription>
                    Upgrade from automated feedback to a formal psychologist-signed assessment when you need
                    official documentation.
                  </CardDescription>
                </div>
                <Badge className='border-0 bg-primary text-primary-foreground'>
                  {formattedIQTestPrice} official path
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='rounded-2xl border border-border/60 bg-background/80 overflow-hidden'>
                <div className='grid grid-cols-[1.1fr_1fr_1fr] bg-muted/40 px-4 py-3 text-sm font-semibold'>
                  <div>Feature</div>
                  <div>Automated Scoring</div>
                  <div>Psychologist-Signed Report</div>
                </div>
                {comparisonRows.map((row) => (
                  <div
                    key={row.feature}
                    className='grid grid-cols-[1.1fr_1fr_1fr] border-t border-border/60 px-4 py-3 text-sm'
                  >
                    <div className='font-medium'>{row.feature}</div>
                    <div className='text-muted-foreground'>{row.automated}</div>
                    <div className='font-medium text-foreground'>{row.official}</div>
                  </div>
                ))}
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='rounded-2xl border border-border/60 bg-background/70 p-4'>
                  <p className='text-sm font-semibold'>Why users upgrade</p>
                  <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                      Admissions and scholarship-ready documentation
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                      Personalized interpretation beyond raw scores
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                      Live video-call assessment with certified follow-up
                    </li>
                  </ul>
                </div>

                <div className='rounded-2xl border border-primary/20 bg-primary/5 p-4'>
                  <p className='text-sm font-semibold'>What happens next</p>
                  <p className='mt-3 text-sm text-muted-foreground'>
                    Book a live proctored session, complete the assessment over secure video call, and receive
                    your official signed report within 24–48 hours.
                  </p>
                </div>
              </div>

              <Button size='lg' className='w-full sm:w-auto' onClick={startCheckout} disabled={isStartingCheckout}>
                <CreditCard className='mr-2 h-5 w-5' />
                {isStartingCheckout ? 'Redirecting to checkout…' : 'Book Official Assessment'}
              </Button>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-5 ${glassCardClassName}`}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Star className='h-5 w-5 text-primary' />
                Activity Timeline
              </CardTitle>
              <CardDescription>Recent performance moments and milestone unlocks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-5'>
                {activityTimeline.map((item, index) => (
                  <div key={item.id} className='relative pl-10'>
                    {index < activityTimeline.length - 1 && (
                      <div className='absolute left-[15px] top-8 h-[calc(100%+12px)] w-px bg-border' />
                    )}
                    <div className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-muted ${item.tone}`}>
                      <item.icon className='h-4 w-4' />
                    </div>
                    <div className='rounded-2xl border border-border/60 bg-background/70 p-4'>
                      <p className='font-semibold'>{item.title}</p>
                      <p className='mt-1 text-sm text-muted-foreground'>{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
