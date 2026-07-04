import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Calendar,
  CheckCircle2,
  Clock,
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
import { psychologistApi, publicGeniusApi, type GeniusApiResponse } from '../../utils/api-client';
import { calculateIQScoreFromCognitiveProfile } from './IQCertificate';
import type {
  IQSessionBooking,
  IQSessionCognitiveProfile,
  IQSessionNotes,
} from './IQSessionDetailPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface IQUserDashboardProps {
  onNavigate: (page: string, data?: any) => void;
  initialSessionTab?: 'upcoming' | 'past';
  focusSection?: 'sessions';
  refreshIQSessionsKey?: number;
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

interface DashboardGeniusProfile {
  id: string;
  name: string;
  iqScore: number | null;
  field: string;
  era: string;
  notableWork: string;
  description: string;
}

interface BenchmarkGeniusProfile extends DashboardGeniusProfile {
  benchmarkPercent: number;
}

const glassCardClassName =
  'border-border/60 bg-background/75 backdrop-blur-xl shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] hover:scale-[1.02] transition-all duration-300';
const SESSIONS_PAGE_SIZE = 4;

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

const formatProfileType = (value?: string) => {
  if (!value) return 'Profile';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const mapDashboardGeniusProfile = (profile: GeniusApiResponse): DashboardGeniusProfile => ({
  id: profile.id,
  name: profile.full_name,
  iqScore: profile.iq_score,
  field: formatProfileType(profile.profile_type),
  era: profile.era,
  notableWork: profile.short_description,
  description: profile.iq_score_note || profile.editorial_note || profile.short_description,
});

const hasVisibleResults = (notes?: IQSessionNotes | null) =>
  Boolean(
    notes?.cognitive_profile?.pattern_recognition != null ||
      notes?.cognitive_profile?.working_memory != null ||
      notes?.cognitive_profile?.processing_speed != null ||
      notes?.cognitive_profile?.verbal_intelligence != null ||
      notes?.cognitive_profile?.spatial_reasoning != null ||
      notes?.cognitive_profile_notes?.pattern_recognition ||
      notes?.cognitive_profile_notes?.working_memory ||
      notes?.cognitive_profile_notes?.processing_speed ||
      notes?.cognitive_profile_notes?.verbal_intelligence ||
      notes?.cognitive_profile_notes?.spatial_reasoning ||
    notes?.session_summary ||
      notes?.follow_up_plan ||
      notes?.homework_assigned ||
      notes?.next_session_focus,
  );

const getCognitiveProfileScore = (
  profile: IQSessionCognitiveProfile | null | undefined,
  key: keyof IQSessionCognitiveProfile,
) => {
  const value = profile?.[key];
  return typeof value === 'number' && !Number.isNaN(value) ? clamp(value, 0, 100) : null;
};

const buildRadarDataFromCognitiveProfile = (
  profile: IQSessionCognitiveProfile | null | undefined,
  fallback: Array<{ metric: string; score: number }>,
) => {
  const scoreByMetric: Record<string, number | null> = {
    'Pattern Recognition': getCognitiveProfileScore(profile, 'pattern_recognition'),
    'Working Memory': getCognitiveProfileScore(profile, 'working_memory'),
    'Processing Speed': getCognitiveProfileScore(profile, 'processing_speed'),
    'Verbal Intelligence': getCognitiveProfileScore(profile, 'verbal_intelligence'),
    'Spatial Reasoning': getCognitiveProfileScore(profile, 'spatial_reasoning'),
  };

  return fallback.map((item) => ({
    metric: item.metric,
    score: scoreByMetric[item.metric] ?? item.score,
  }));
};

const getCertificateEligibleProfile = (profile?: IQSessionCognitiveProfile | null) => {
  if (
    typeof profile?.pattern_recognition !== 'number' ||
    typeof profile?.working_memory !== 'number' ||
    typeof profile?.processing_speed !== 'number' ||
    typeof profile?.verbal_intelligence !== 'number' ||
    typeof profile?.spatial_reasoning !== 'number'
  ) {
    return null;
  }

  return {
    pattern_recognition: profile.pattern_recognition,
    working_memory: profile.working_memory,
    processing_speed: profile.processing_speed,
    verbal_intelligence: profile.verbal_intelligence,
    spatial_reasoning: profile.spatial_reasoning,
  };
};

const getOfficialIQScoreFromSession = (session?: IQSessionBooking | null) => {
  const profile = getCertificateEligibleProfile(session?.sessionNotes?.cognitive_profile);
  return profile ? calculateIQScoreFromCognitiveProfile(profile) : null;
};

const formatIQTestType = (testType?: string) => {
  switch (testType) {
    case 'weschler_intelligence_test':
      return 'Wechsler Intelligence Test';
    case 'culture_fair_intelligence_test':
      return 'Culture Fair Intelligence Test';
    default:
      return testType?.trim() || 'Official IQ Test';
  }
};

const formatSessionDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const getSessionDateTime = (session: IQSessionBooking) => new Date(`${session.date} ${session.time}`);

const getSessionLatestTimestamp = (session: IQSessionBooking) => {
  if (session.createdAt) {
    const createdAtTime = new Date(session.createdAt).getTime();
    if (!Number.isNaN(createdAtTime)) {
      return createdAtTime;
    }
  }

  return getSessionDateTime(session).getTime();
};

const isAcknowledgedSession = (session: IQSessionBooking) => session.status !== 'pending';

const normalizeIQSessionBooking = (item: any, index: number, fallbackEmail = ''): IQSessionBooking => ({
  id: item.id ?? item._id ?? `iq-session-${index}`,
  psychologistName:
    item.psychologist?.full_name ??
    item.psychologist_name ??
    item.psychologistName ??
    'Psychologist',
  psychologistEmail:
    item.psychologist?.email ?? item.psychologist_email ?? item.psychologistEmail ?? '',
  psychologistSpecialization:
    item.psychologist_specialization ??
    item.psychologist?.specialization ??
    item.psychologistSpecialization ??
    '',
  psychologistSignatureImage:
    item.psychologist_signature_image ??
    item.psychologist?.psychologist_profile?.signature_image ??
    item.psychologistSignatureImage ??
    '',
  date: item.date ?? item.booking_date ?? item.session_date ?? '',
  time: item.time ?? item.booking_time ?? item.session_time ?? '',
  sessionType: item.session_type ?? item.sessionType ?? 'IQ Session',
  testType: item.test_type ?? item.testType ?? '',
  certificateId: item.certificate_id ?? item.certificateId ?? '',
  status: item.status ?? 'pending',
  createdAt: item.created_at ?? item.createdAt ?? '',
  price: Number(item.price ?? item.hourly_rate ?? item.hourlyRate ?? 0),
  rejectionReason: item.rejection_reason ?? item.rejectionReason ?? '',
  sessionNotes: (item.session_notes ?? item.sessionNotes ?? null) as IQSessionNotes | null,
  studentEmail: item.student?.email ?? item.student_email ?? item.studentEmail ?? fallbackEmail,
});

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

const OFFICIAL_IQ_MIN = calculateIQScore(0);
const OFFICIAL_IQ_MAX = calculateIQScore(100);

const getScalePositionPercent = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return 0;
  if (max <= min) return 50;
  return clamp(Math.round(((value - min) / (max - min)) * 100), 0, 100);
};

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

export function IQUserDashboard({
  onNavigate,
  initialSessionTab = 'upcoming',
  focusSection,
  refreshIQSessionsKey,
}: IQUserDashboardProps) {
  const { user, profile, isFirstLogin } = useAuth();
  const { formattedIQTestPrice } = useAppSettings();
  const { isStartingCheckout, startCheckout } = useIQTestCheckout(onNavigate);
  const sessionsSectionRef = useRef<HTMLDivElement | null>(null);
  const [iqSessions, setIqSessions] = useState<IQSessionBooking[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [geniusProfiles, setGeniusProfiles] = useState<DashboardGeniusProfile[]>([]);
  const [geniusLoading, setGeniusLoading] = useState(true);
  const [geniusError, setGeniusError] = useState<string | null>(null);
  const [activeSessionTab, setActiveSessionTab] = useState<'upcoming' | 'past'>(initialSessionTab);
  const [visibleSessionCounts, setVisibleSessionCounts] = useState<Record<'upcoming' | 'past', number>>({
    upcoming: SESSIONS_PAGE_SIZE,
    past: SESSIONS_PAGE_SIZE,
  });

  const focusSessionsSection = (tab: 'upcoming' | 'past' = 'upcoming') => {
    setActiveSessionTab(tab);
    window.requestAnimationFrame(() => {
      sessionsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const sessionActions = [
    {
      label: 'Book My IQ Test',
      icon: Users,
      onClick: () => onNavigate('book-psychologist', { backPage: 'dashboard' }),
    },
    {
      label: 'Upcoming Tests',
      icon: Calendar,
      onClick: () => focusSessionsSection('upcoming'),
      variant: 'outline' as const,
    },
    {
      label: 'Practice Test',
      icon: Play,
      onClick: () => onNavigate('iq-test-practice'),
      variant: 'outline' as const,
    },
  ];

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
  const greeting = isFirstLogin ? 'Welcome' : 'Welcome back';

  const latestIQScore = latestResult ? calculateIQScore(latestResult.score) : null;
  const previousIQScore = previousResult ? calculateIQScore(previousResult.score) : null;
  const estimatedPercentile = latestIQScore ? calculatePercentile(latestIQScore) : null;
  const iqDelta = latestIQScore && previousIQScore ? latestIQScore - previousIQScore : 0;
  const latestCompletedOfficialSessionResult = useMemo(
    () =>
      [...iqSessions]
        .filter((session) => session.status === 'completed')
        .map((session) => ({
          session,
          iqScore: getOfficialIQScoreFromSession(session),
        }))
        .filter(
          (item): item is { session: IQSessionBooking; iqScore: number } =>
            typeof item.iqScore === 'number' && !Number.isNaN(item.iqScore),
        )
        .sort((a, b) => getSessionLatestTimestamp(b.session) - getSessionLatestTimestamp(a.session))[0] ?? null,
    [iqSessions],
  );
  const latestOfficialIQScore = latestCompletedOfficialSessionResult?.iqScore ?? null;
  const rankedGeniusProfiles = useMemo(
    () =>
      [...geniusProfiles]
        .filter((profile) => typeof profile.iqScore === 'number')
        .sort((a, b) => (b.iqScore ?? 0) - (a.iqScore ?? 0)),
    [geniusProfiles],
  );
  const geniusScoreBounds = useMemo(() => {
    const scores = rankedGeniusProfiles
      .map((profile) => profile.iqScore)
      .filter((score): score is number => typeof score === 'number' && !Number.isNaN(score));

    if (!scores.length) return null;
    return {
      min: Math.min(...scores),
      max: Math.max(...scores),
    };
  }, [rankedGeniusProfiles]);
  const latestOfficialBenchmarkPercent = useMemo(
    () =>
      latestOfficialIQScore == null
        ? null
        : getScalePositionPercent(latestOfficialIQScore, OFFICIAL_IQ_MIN, OFFICIAL_IQ_MAX),
    [latestOfficialIQScore],
  );
  const benchmarkGeniusProfiles = useMemo<BenchmarkGeniusProfile[]>(() => {
    if (!geniusScoreBounds) return [];

    return rankedGeniusProfiles.map((profile) => ({
      ...profile,
      benchmarkPercent: getScalePositionPercent(
        profile.iqScore ?? geniusScoreBounds.min,
        geniusScoreBounds.min,
        geniusScoreBounds.max,
      ),
    }));
  }, [geniusScoreBounds, rankedGeniusProfiles]);

  const closestGeniusProfile = useMemo(() => {
    if (latestOfficialBenchmarkPercent == null || !benchmarkGeniusProfiles.length) return null;

    return benchmarkGeniusProfiles.reduce((closest, profile) => {
      const currentGap = Math.abs(profile.benchmarkPercent - latestOfficialBenchmarkPercent);
      const bestGap = Math.abs(closest.benchmarkPercent - latestOfficialBenchmarkPercent);
      return currentGap < bestGap ? profile : closest;
    });
  }, [benchmarkGeniusProfiles, latestOfficialBenchmarkPercent]);

  const geniusProfilesAscending = useMemo(
    () => [...benchmarkGeniusProfiles].sort((a, b) => a.benchmarkPercent - b.benchmarkPercent),
    [benchmarkGeniusProfiles],
  );

  const nextGeniusAbove = useMemo(() => {
    if (latestOfficialBenchmarkPercent == null) return null;
    return (
      geniusProfilesAscending.find(
        (profile) => profile.benchmarkPercent >= latestOfficialBenchmarkPercent,
      ) ?? null
    );
  }, [geniusProfilesAscending, latestOfficialBenchmarkPercent]);

  const nextGeniusBelow = useMemo(() => {
    if (latestOfficialBenchmarkPercent == null) return null;
    return (
      [...geniusProfilesAscending]
        .reverse()
        .find((profile) => profile.benchmarkPercent <= latestOfficialBenchmarkPercent) ?? null
    );
  }, [geniusProfilesAscending, latestOfficialBenchmarkPercent]);

  const geniusProfilesBelowUser = useMemo(() => {
    if (latestOfficialBenchmarkPercent == null) return 0;
    return benchmarkGeniusProfiles.filter(
      (profile) => latestOfficialBenchmarkPercent >= profile.benchmarkPercent,
    ).length;
  }, [benchmarkGeniusProfiles, latestOfficialBenchmarkPercent]);

  const geniusStandingPercent = rankedGeniusProfiles.length
    ? Math.round((geniusProfilesBelowUser / rankedGeniusProfiles.length) * 100)
    : null;

  const geniusComparisonCards = useMemo(() => {
    const cards: Array<{
      key: string;
      label: string;
      profile: DashboardGeniusProfile;
    }> = [];
    const seen = new Set<string>();

    const addCard = (label: string, profile: DashboardGeniusProfile | null) => {
      if (!profile || seen.has(profile.id)) return;
      seen.add(profile.id);
      cards.push({ key: `${label}-${profile.id}`, label, profile });
    };

    addCard('Closest profile', closestGeniusProfile);
    addCard('Next target', nextGeniusAbove);

    return cards;
  }, [closestGeniusProfile, nextGeniusAbove, nextGeniusBelow]);

  const completedIQSessionCount = useMemo(
    () => iqSessions.filter((session) => session.status === 'completed').length,
    [iqSessions],
  );

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

  const latestSessionWithCognitiveProfile = useMemo(
    () =>
      [...iqSessions]
        .filter((session) =>
          Boolean(
            session.sessionNotes?.cognitive_profile &&
              Object.values(session.sessionNotes.cognitive_profile).some(
                (value) => typeof value === 'number' && !Number.isNaN(value),
              ),
          ),
        )
        .sort((a, b) => getSessionLatestTimestamp(b) - getSessionLatestTimestamp(a))[0] ?? null,
    [iqSessions],
  );

  const displayedRadarData = latestSessionWithCognitiveProfile
    ? buildRadarDataFromCognitiveProfile(
        latestSessionWithCognitiveProfile.sessionNotes?.cognitive_profile,
        completedTests > 0 ? radarData : emptyRadarData,
      )
    : completedTests > 0
      ? radarData
      : emptyRadarData;
  const strongestMetric = displayedRadarData.reduce((best, item) =>
    item.score > best.score ? item : best,
  );
  const breakdownMetrics = [...displayedRadarData].sort((a, b) => b.score - a.score);
  const cognitiveAnalyticsMode = latestSessionWithCognitiveProfile
    ? 'Latest session result'
    : completedTests > 0
      ? 'Live data'
      : 'Preview mode';

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
      value: completedIQSessionCount.toString(),
      sublabel:
        completedIQSessionCount > 0
          ? 'Completed IQ sessions'
          : 'No completed IQ sessions yet',
      icon: Brain,
    },
  ];

  useEffect(() => {
    setActiveSessionTab(initialSessionTab);
  }, [initialSessionTab]);

  useEffect(() => {
    let isMounted = true;

    const loadGeniusProfiles = async () => {
      try {
        setGeniusLoading(true);
        setGeniusError(null);

        const response = await publicGeniusApi.list();

        if (!isMounted) return;
        setGeniusProfiles((response.items || []).map(mapDashboardGeniusProfile));
      } catch (error: any) {
        if (!isMounted) return;
        setGeniusProfiles([]);
        setGeniusError(
          error?.message && error.message !== '[object Object]'
            ? error.message
            : 'Unable to load genius comparison data right now.',
        );
      } finally {
        if (isMounted) {
          setGeniusLoading(false);
        }
      }
    };

    loadGeniusProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (focusSection === 'sessions') {
      focusSessionsSection(initialSessionTab);
    }
  }, [focusSection, initialSessionTab]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadSessions = async () => {
      try {
        setSessionsLoading(true);
        setSessionsError(null);

        const data = await psychologistApi.getBookings(user.id);
        const list = Array.isArray(data) ? data : data.bookings ?? data.items ?? data.results ?? [];
        const normalized = list
          .map((item: any, index: number) => normalizeIQSessionBooking(item, index, user.email))
          .filter((booking: any) => booking.studentEmail === user.email);

        if (!isMounted) return;
        setIqSessions(normalized);
      } catch (error: any) {
        if (!isMounted) return;
        setIqSessions([]);
        setSessionsError(
          error?.message && error.message !== '[object Object]'
            ? error.message
            : 'Failed to load your booked sessions. Please try again.',
        );
      } finally {
        if (isMounted) {
          setSessionsLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [user, refreshIQSessionsKey]);

  const upcomingSessions = useMemo(
    () =>
      iqSessions
        .filter((session) => session.status !== 'completed' && session.status !== 'cancelled' && getSessionDateTime(session) >= new Date())
        .sort((a, b) => getSessionLatestTimestamp(b) - getSessionLatestTimestamp(a)),
    [iqSessions],
  );

  const pastSessions = useMemo(
    () =>
      iqSessions
        .filter((session) => session.status === 'completed' || session.status === 'cancelled' || getSessionDateTime(session) < new Date())
        .sort((a, b) => getSessionLatestTimestamp(b) - getSessionLatestTimestamp(a)),
    [iqSessions],
  );

  const visibleUpcomingSessions = useMemo(
    () => upcomingSessions.slice(0, visibleSessionCounts.upcoming),
    [upcomingSessions, visibleSessionCounts.upcoming],
  );

  const visiblePastSessions = useMemo(
    () => pastSessions.slice(0, visibleSessionCounts.past),
    [pastSessions, visibleSessionCounts.past],
  );

  const sessionResultsCount = useMemo(
    () => iqSessions.filter((session) => hasVisibleResults(session.sessionNotes)).length,
    [iqSessions],
  );
  const isInitialSessionsLoading = sessionsLoading && iqSessions.length === 0;
  const isInitialGeniusLoading = geniusLoading && geniusProfiles.length === 0;

  const openSessionDetail = (session: IQSessionBooking, tab: 'upcoming' | 'past') => {
    onNavigate('iq-session-detail', {
      booking: session,
      initialSessionTab: tab,
    });
  };

  const showMoreSessions = (tab: 'upcoming' | 'past') => {
    setVisibleSessionCounts((current) => ({
      ...current,
      [tab]: current[tab] + SESSIONS_PAGE_SIZE,
    }));
  };

  const showFewerSessions = (tab: 'upcoming' | 'past') => {
    setVisibleSessionCounts((current) => ({
      ...current,
      [tab]: SESSIONS_PAGE_SIZE,
    }));
  };

  const renderSessionPagination = (
    tab: 'upcoming' | 'past',
    totalSessions: IQSessionBooking[],
    visibleSessions: IQSessionBooking[],
  ) => {
    if (totalSessions.length <= SESSIONS_PAGE_SIZE) return null;

    return (
      <div className='flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Showing {visibleSessions.length} of {totalSessions.length} sessions
        </p>
        <div className='flex flex-wrap gap-2'>
          {visibleSessionCounts[tab] > SESSIONS_PAGE_SIZE ? (
            <Button variant='outline' size='sm' onClick={() => showFewerSessions(tab)}>
              Show less
            </Button>
          ) : null}
          {visibleSessions.length < totalSessions.length ? (
            <Button variant='outline' size='sm' onClick={() => showMoreSessions(tab)}>
              Load more
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  const renderSessionCard = (session: IQSessionBooking, tab: 'upcoming' | 'past') => {
    const statusLabel = session.status === 'pending' ? 'Pending acknowledgement' : 'Acknowledged';
    const isAcknowledged = isAcknowledgedSession(session);

    return (
      <div
        key={session.id}
        role='button'
        tabIndex={0}
        onClick={() => openSessionDetail(session, tab)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openSessionDetail(session, tab);
          }
        }}
        className='cursor-pointer rounded-2xl border border-border/60 bg-background/70 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-background/90 hover:shadow-lg'
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-3'>
            <div>
              <p className='text-lg font-semibold'>{session.sessionType}</p>
              {isAcknowledged ? (
                <p className='text-sm text-muted-foreground'>
                  {session.psychologistName}
                  {session.psychologistSpecialization ? ` · ${session.psychologistSpecialization}` : ''}
                </p>
              ) : (
                <div className='relative mt-1 max-w-sm overflow-hidden rounded-md'>
              
                 
                </div>
              )}
            </div>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-primary' />
                <span>{formatSessionDate(session.date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-primary' />
                <span>{session.time}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-start gap-2 sm:items-end'>
            <Badge variant={session.status === 'pending' ? 'outline' : 'secondary'}>{statusLabel}</Badge>
            {hasVisibleResults(session.sessionNotes) ? (
              <Badge className='border-0 bg-emerald-500/10 text-emerald-600'>Results available</Badge>
            ) : null}
            <p className='text-sm font-medium text-primary'>View details</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(57,81,146,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_28%)]'>
      <div className='container max-w-7xl py-8 md:py-10 space-y-6'>
        <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-4'>
            <Badge className='w-fit border-0 bg-primary/10 text-primary'>
              <Sparkles className='mr-2 h-4 w-4' />
              Cognitive Command Center
            </Badge>
            <div className='space-y-2'>
              <h1 className='text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight whitespace-nowrap'>
                {greeting}, {userName} 👋
              </h1>
              <p className='max-w-2xl text-base md:text-lg text-muted-foreground'>
                Track your latest IQ signals, measure growth over time, and decide when to step up to
                a psychologist-signed official assessment.
              </p>
            </div>
          </div>

          <div className='flex shrink-0 flex-col gap-3 sm:flex-row'>
            {sessionActions.map((action) => (
              <Button
                key={action.label}
                size='lg'
                variant={action.variant}
                className='shadow-lg'
                onClick={action.onClick}
              >
                <action.icon className='mr-2 h-5 w-5' />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3'>
          {isInitialSessionsLoading
            ? Array.from({ length: quickStats.length }).map((_, index) => (
                <div
                  key={`quick-stat-skeleton-${index}`}
                  className='rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-sm'
                >
                  <div className='mb-4 flex items-center justify-between'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='h-10 w-10 rounded-xl' />
                  </div>
                  <Skeleton className='h-8 w-20' />
                  <Skeleton className='mt-2 h-3 w-36' />
                </div>
              ))
            : quickStats.map((stat) => (
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

        <div className='grid gap-6 lg:grid-cols-12'>
          {/* <Card className={`lg:col-span-6 lg:order-2 ${glassCardClassName}`}>
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
          </Card> */}

          <Card className={`lg:col-span-12 lg:order-1 ${glassCardClassName}`}>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Brain className='h-5 w-5 text-primary' />
                    Cognitive Profile Analytics
                  </CardTitle>
                  <CardDescription>
                    {latestSessionWithCognitiveProfile
                      ? 'Previewed from the KPI results entered by your psychologist in your latest completed IQ session.'
                      : 'Estimated from your completed IQ assessments and recent performance patterns.'}
                  </CardDescription>
                </div>
                <Badge variant='secondary'>{cognitiveAnalyticsMode}</Badge>
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
                  {latestSessionWithCognitiveProfile
                    ? 'These KPI scores were entered by your psychologist and give you a live preview of your latest cognitive profile.'
                    : completedTests > 0
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

          <Card className={`lg:col-span-12 lg:order-3 ${glassCardClassName}`}>
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
                  <Button className='mt-5' onClick={() => onNavigate('iq-test-practice')}>
                    <Play className='mr-2 h-4 w-4' />
                    Take First Practice Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className='lg:col-span-12'>
            <Card className='border-border/60 bg-gradient-to-br from-amber-500/15 to-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]'>
              <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Trophy className='h-5 w-5 text-amber-500' />
                    Genius Benchmark
                  </CardTitle>
                  <CardDescription>
                    Compare your latest psychologist-led IQ result against the genius dataset on an aligned benchmark scale.
                  </CardDescription>
                </div>
                <Button variant='outline' className='w-full sm:w-auto' onClick={() => onNavigate('genius-rankings')}>
                  View Full Rankings
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                {!latestOfficialIQScore ? (
                  <div className='rounded-2xl border border-dashed border-border/70 bg-background/80 p-6 text-center'>
                    <Trophy className='mx-auto mb-4 h-10 w-10 text-amber-500' />
                    <p className='text-xl font-semibold'>No completed official IQ result yet</p>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      Once a psychologist has completed and scored your IQ session, we will show which published genius profiles your official result is closest to.
                    </p>
                    <Button className='mt-5' onClick={() => focusSessionsSection('past')}>
                      <Calendar className='mr-2 h-4 w-4' />
                      View IQ Sessions
                    </Button>
                  </div>
                ) : isInitialGeniusLoading ? (
                  <div className='space-y-4 rounded-2xl border border-border/60 bg-background/80 p-5'>
                    <div className='flex flex-wrap gap-2'>
                      <Skeleton className='h-6 w-24 rounded-full' />
                      <Skeleton className='h-6 w-40 rounded-full' />
                      <Skeleton className='h-6 w-36 rounded-full' />
                    </div>
                    <Skeleton className='h-8 w-72' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-4/5' />
                    <div className='grid gap-4 md:grid-cols-3'>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={`genius-benchmark-skeleton-${index}`}
                          className='rounded-2xl border border-border/60 bg-background/80 p-4'
                        >
                          <div className='flex items-start justify-between gap-3'>
                            <div className='space-y-2'>
                              <Skeleton className='h-3 w-24' />
                              <Skeleton className='h-6 w-40' />
                              <Skeleton className='h-4 w-32' />
                            </div>
                            <Skeleton className='h-6 w-16 rounded-full' />
                          </div>
                          <Skeleton className='mt-4 h-4 w-full' />
                          <div className='mt-4 rounded-xl border border-border/60 bg-muted/20 p-3'>
                            <Skeleton className='h-3 w-24' />
                            <Skeleton className='mt-3 h-4 w-36' />
                            <Skeleton className='mt-2 h-3 w-full' />
                            <Skeleton className='mt-2 h-3 w-5/6' />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : geniusError ? (
                  <div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm'>
                    <p className='font-semibold'>Unable to load benchmark profiles</p>
                    <p className='mt-1 text-muted-foreground'>{geniusError}</p>
                  </div>
                ) : rankedGeniusProfiles.length > 0 ? (
                  <>
                    <div className='grid gap-4'>
                      <div className='rounded-2xl border border-border/60 bg-background/80 p-5'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <Badge className='border-0 bg-primary/10 text-primary'>Latest official IQ: {latestOfficialIQScore}</Badge>
                          {latestOfficialBenchmarkPercent !== null ? (
                            <Badge variant='outline'>Aligned benchmark: {latestOfficialBenchmarkPercent}%</Badge>
                          ) : null}
                          <Badge variant='outline'>
                            {formatIQTestType(latestCompletedOfficialSessionResult?.session.testType)}
                          </Badge>
                          {geniusStandingPercent !== null ? (
                            <Badge variant='secondary'>Ahead of {geniusProfilesBelowUser}/{rankedGeniusProfiles.length} aligned profiles</Badge>
                          ) : null}
                        </div>
                        <p className='mt-4 text-2xl font-bold'>
                          {closestGeniusProfile
                            ? `Closest aligned benchmark: ${closestGeniusProfile.name}`
                            : 'Your benchmark is getting ready'}
                        </p>
                        <p className='mt-2 text-sm text-muted-foreground'>
                          {closestGeniusProfile
                            ? Math.abs(closestGeniusProfile.benchmarkPercent - (latestOfficialBenchmarkPercent ?? 0)) === 0
                              ? `On the aligned benchmark scale, your latest result lands in the same band as ${closestGeniusProfile.name}.`
                              : (latestOfficialBenchmarkPercent ?? 0) > closestGeniusProfile.benchmarkPercent
                                ? `On the aligned benchmark scale, you are ${Math.abs((latestOfficialBenchmarkPercent ?? 0) - closestGeniusProfile.benchmarkPercent)} point(s) ahead of ${closestGeniusProfile.name}.`
                                : `On the aligned benchmark scale, you are ${Math.abs(closestGeniusProfile.benchmarkPercent - (latestOfficialBenchmarkPercent ?? 0))} point(s) away from ${closestGeniusProfile.name}.`
                            : 'As more genius profiles are published, your closest comparison will appear here.'}
                        </p>
                        <p className='mt-2 text-xs text-muted-foreground text-red-700'>
                          * Genius profile IQ values here are published estimates, so this benchmark aligns positions across the two scales instead of comparing raw IQ numbers directly.
                        </p>
                      </div>
                        {/* <div className='grid gap-4'>
                      {geniusComparisonCards.map((item) => {
                        const benchmarkGap = (latestOfficialBenchmarkPercent ?? 0) - item.profile.benchmarkPercent;
                        const isAhead = benchmarkGap >= 0;

                        return (
                          <div
                            key={item.key}
                            className='rounded-2xl border border-border/60 bg-background/80 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg'
                          >
                            <div className='flex items-start justify-between gap-3'>
                              <div>
                                <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>{item.label}</p>
                                <p className='mt-2 text-lg font-semibold'>{item.profile.name}</p>
                                <p className='text-sm text-muted-foreground'>
                                  {item.profile.field} · {item.profile.era}
                                </p>
                              </div>
                              <Badge className='border-0 bg-background/90 text-primary'>
                               Est IQ {item.profile.iqScore ?? '—'}
                              </Badge>
                            </div>
                            <p className='mt-4 text-sm text-muted-foreground'>{item.profile.notableWork}</p>
                          </div>
                        );
                      })}
                    </div> */}
                    </div>

                  
                  </>
                ) : (
                  <div className='rounded-2xl border border-dashed border-border/70 bg-background/70 p-6 text-center'>
                    <p className='text-lg font-semibold'>No published genius profiles available yet</p>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      Once profiles are published from the backend, your comparison cards will appear here automatically.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div ref={sessionsSectionRef} className='lg:col-span-12 scroll-mt-24'>
            <Card className={glassCardClassName}>
              <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-primary' />
                    IQ Test Sessions
                  </CardTitle>
                  <CardDescription>
                    Track your upcoming and past psychologist-led IQ sessions directly from your dashboard.
                  </CardDescription>
                </div>
                {isInitialSessionsLoading ? (
                  <Skeleton className='h-6 w-36 rounded-full' />
                ) : (
                  <Badge variant='secondary'>Results available: {sessionResultsCount}</Badge>
                )}
              </CardHeader>
              <CardContent className='space-y-4'>
                {sessionsError ? (
                  <div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm'>
                    <p className='font-semibold'>Unable to load sessions</p>
                    <p className='mt-1 text-muted-foreground'>{sessionsError}</p>
                  </div>
                ) : null}

                {isInitialSessionsLoading ? (
                  <div className='space-y-4'>
                    <div className='grid w-full grid-cols-2 gap-2 md:w-fit'>
                      <Skeleton className='h-10 w-full md:w-36' />
                      <Skeleton className='h-10 w-full md:w-32' />
                    </div>
                    <div className='grid gap-4 lg:grid-cols-2'>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={`session-skeleton-${index}`}
                          className='rounded-2xl border border-border/60 bg-background/70 p-5'
                        >
                          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                            <div className='flex-1 space-y-3'>
                              <div className='space-y-2'>
                                <Skeleton className='h-6 w-40' />
                                <Skeleton className='h-4 w-56' />
                              </div>
                              <div className='space-y-2'>
                                <Skeleton className='h-4 w-44' />
                                <Skeleton className='h-4 w-24' />
                              </div>
                            </div>
                            <div className='flex flex-col gap-2 sm:items-end'>
                              <Skeleton className='h-6 w-28 rounded-full' />
                              <Skeleton className='h-4 w-24' />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Tabs value={activeSessionTab} onValueChange={(value) => setActiveSessionTab(value as 'upcoming' | 'past')}>
                    <TabsList className='grid w-full grid-cols-2 md:w-fit'>
                      <TabsTrigger value='upcoming'>Upcoming ({upcomingSessions.length})</TabsTrigger>
                      <TabsTrigger value='past'>Past ({pastSessions.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value='upcoming' className='mt-6'>
                      {upcomingSessions.length > 0 ? (
                        <div className='space-y-4'>
                          <div className='grid gap-4 lg:grid-cols-2'>
                            {visibleUpcomingSessions.map((session) => renderSessionCard(session, 'upcoming'))}
                          </div>
                          {renderSessionPagination('upcoming', upcomingSessions, visibleUpcomingSessions)}
                        </div>
                      ) : (
                        <div className='rounded-2xl border border-dashed border-border/70 bg-muted/20 p-8 text-center'>
                          <p className='text-lg font-semibold'>No upcoming sessions</p>
                          <p className='mt-2 text-sm text-muted-foreground'>
                            Book an IQ test session when you are ready for a psychologist-led assessment.
                          </p>
                          <Button className='mt-4' onClick={() => onNavigate('book-psychologist', { backPage: 'dashboard' })}>
                            <Users className='mr-2 h-4 w-4' />
                            Book IQ Test
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value='past' className='mt-6'>
                      {pastSessions.length > 0 ? (
                        <div className='space-y-4'>
                          <div className='grid gap-4 lg:grid-cols-2'>
                            {visiblePastSessions.map((session) => renderSessionCard(session, 'past'))}
                          </div>
                          {renderSessionPagination('past', pastSessions, visiblePastSessions)}
                        </div>
                      ) : (
                        <div className='rounded-2xl border border-dashed border-border/70 bg-muted/20 p-8 text-center'>
                          <p className='text-lg font-semibold'>No past sessions yet</p>
                          <p className='mt-2 text-sm text-muted-foreground'>
                            Completed psychologist-led IQ session results will appear here after your sessions take place.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>

          {/* <Card className={`lg:col-span-7 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 ${glassCardClassName}`}>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5 text-primary' />
                    Proctored Path
                  </CardTitle>
                  <CardDescription>
                    Upgrade from automated feedback to a live session with a certified psychologist when you need
                    formal guidance and official documentation.
                  </CardDescription>
                </div>
                <Badge className='border-0 bg-primary text-primary-foreground'>
                  {formattedIQTestPrice} certified session
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
                    Book a live session, meet with a certified psychologist over secure video call, and receive
                    your official follow-up summary within 24–48 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className={`lg:col-span-5 ${glassCardClassName}`}>
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
          </Card> */}
        </div>
      </div>
    </div>
  );
}
