"use client";

import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  Award, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Shield,
  Users,
  Sparkles,
  BarChart3,
  Lightbulb,
  Star,
  Trophy,
  ChevronRight,
  Play,
  BookOpen,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useIQTestCheckout } from '../../hooks/useIQTestCheckout';
import { publicGeniusApi, type GeniusApiResponse } from '../../utils/api-client';

interface IQTestOverviewPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface TopGeniusPreview {
  id: string;
  name: string;
  iq: number | null;
  field: string;
}

const formatGeniusProfileType = (value?: string) => {
  if (!value) return 'Profile';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const mapTopGeniusPreview = (profile: GeniusApiResponse): TopGeniusPreview => ({
  id: profile.id,
  name: profile.full_name,
  iq: profile.iq_score,
  field: formatGeniusProfileType(profile.profile_type),
});

const benefits = [
  {
    icon: Target,
    title: 'Self-Awareness',
    description: 'Gain deep insights into your cognitive strengths and areas for development'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your cognitive performance over time with detailed analytics'
  },
  {
    icon: Award,
    title: 'Compare Rankings',
    description: 'See how you rank against the general population and historical geniuses'
  },
  {
    icon: Lightbulb,
    title: 'Personalized Insights',
    description: 'Receive tailored recommendations based on your cognitive profile'
  },
  {
    icon: BarChart3,
    title: 'Detailed Breakdown',
    description: 'Understand performance across pattern recognition, logic, and reasoning'
  },
  {
    icon: Shield,
    title: 'Scientifically Validated',
    description: 'Based on standardized IQ testing methodologies used by professionals'
  }
];

const testFeatures = [
  {
    icon: Clock,
    title: '60-Minute Test',
    description: 'Comprehensive assessment with timed sections'
  },
  {
    icon: Brain,
    title: 'Multiple Categories',
    description: 'Pattern recognition, logical reasoning, verbal & spatial intelligence'
  },
  {
    icon: CheckCircle,
    title: 'Instant Results',
    description: 'Get your score and detailed analysis immediately after completion'
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive charts showing your cognitive strengths'
  }
];

const methodology = [
  {
    step: '1',
    title: 'Standardized Questions',
    description: 'Questions based on established psychometric principles and validated against population norms'
  },
  {
    step: '2',
    title: 'Adaptive Scoring',
    description: 'Your score is calculated using statistical models that account for question difficulty and accuracy'
  },
  {
    step: '3',
    title: 'Percentile Ranking',
    description: 'Compare your performance against a normalized distribution of test-takers worldwide'
  },
  {
    step: '4',
    title: 'Category Analysis',
    description: 'Detailed breakdown across multiple cognitive dimensions for comprehensive insights'
  }
];

const psychologistBookingProcess = [
  {
    step: '1',
    title: 'Schedule',
    description: 'Choose a date and time that fits your schedule through our integrated booking calendar.'
  },
  {
    step: '2',
    title: 'Confirmation',
    description: 'Receive a confirmation email with preparation instructions and your booked session details.'
  },
  {
    step: '3',
    title: 'Live Session',
    description: 'Join a secure 60-minute video call with your psychologist using the link sent 15 minutes before start time.'
  },
  {
    step: '4',
    title: 'Certified Report',
    description: 'Get your official psychologist-signed IQ report and personalized consultation within 24-48 hours.'
  }
];

export function IQTestOverviewPage({ onNavigate }: IQTestOverviewPageProps) {
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  const [topGeniuses, setTopGeniuses] = useState<TopGeniusPreview[]>([]);
  const [isLoadingTopGeniuses, setIsLoadingTopGeniuses] = useState(true);
  const { formattedIQTestPrice } = useAppSettings();
  const { isStartingCheckout, startCheckout } = useIQTestCheckout(onNavigate);

  useEffect(() => {
    let isMounted = true;

    const loadTopGeniuses = async () => {
      setIsLoadingTopGeniuses(true);

      try {
        const response = await publicGeniusApi.list();
        if (!isMounted) return;

        const rankedProfiles = (response.items || [])
          .map(mapTopGeniusPreview)
          .sort((a, b) => (b.iq ?? -1) - (a.iq ?? -1))
          .slice(0, 5);

        setTopGeniuses(rankedProfiles);
      } catch (error) {
        console.error('[IQTestOverviewPage] Failed to load top genius profiles:', error);
        if (isMounted) setTopGeniuses([]);
      } finally {
        if (isMounted) setIsLoadingTopGeniuses(false);
      }
    };

    loadTopGeniuses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_45%)]" />
        
        <div className="container relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <Badge className="mb-4 border-0 bg-white/20 text-white hover:bg-white/30 dark:bg-white/10 dark:text-slate-50 dark:hover:bg-white/15">
                <Sparkles className="w-4 h-4 mr-1" />
                Official IQ Package • Only {formattedIQTestPrice}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                 Proctored IQ Test Performed by Registered Certified Psychologist
                 <br/> ONLY {formattedIQTestPrice}!
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-white/90 dark:text-slate-200">
                Includes your results on an <strong>Official</strong> IQ <strong>Certification</strong> <strong>Document</strong> and <strong>Unlimited Practice Tests</strong> before your final IQ exam.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full text-lg px-8"
                  onClick={startCheckout}
                  disabled={isStartingCheckout}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {isStartingCheckout ? 'Preparing booking…' : 'Order an IQ Test'}
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur dark:bg-white/5 dark:border dark:border-white/10">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">60</p>
                  <p className="text-sm">Minutes</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur dark:bg-white/5 dark:border dark:border-white/10">
                  <Brain className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">Included</p>
                  <p className="text-sm">Practice Access</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur dark:bg-white/5 dark:border dark:border-white/10">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{formattedIQTestPrice}</p>
                  <p className="text-sm">Certified Session</p>
                </div>
              </div>
            </div>

            {/* Right Column - Top Geniuses Preview */}
            <div>
              <Card className="border-white/20 bg-white/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white dark:text-slate-50">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    Top 5 Genius Rankings
                  </CardTitle>
                  <CardDescription className="text-white/80 dark:text-slate-300">
                    See how you compare to history's greatest minds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoadingTopGeniuses ? (
                    <div className="rounded-lg bg-white/5 p-4 text-center text-sm text-white/80 dark:bg-white/5 dark:text-slate-300">
                      Loading genius profiles…
                    </div>
                  ) : topGeniuses.length > 0 ? (
                    topGeniuses.map((genius, index) => (
                    <div 
                      key={genius.id}
                      className="flex items-center gap-4 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-800' :
                        index === 2 ? 'bg-amber-600 text-white' :
                          'bg-white/20 text-white dark:bg-white/10 dark:text-slate-100'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white dark:text-slate-100">{genius.name}</p>
                        <p className="text-sm text-white/70 dark:text-slate-400">{genius.field}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white dark:text-slate-100">{genius.iq ?? '—'}</p>
                        <p className="text-xs text-white/70 dark:text-slate-400">IQ Score</p>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-white/5 p-4 text-center text-sm text-white/80 dark:bg-white/5 dark:text-slate-300">
                      Genius profiles are not available yet.
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full border-white/30 bg-transparent text-white hover:bg-white/10 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5"
                    onClick={() => onNavigate('genius-rankings')}
                  >
                    View Full Rankings
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-6">
        {/* Why Take the Test */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-4 h-4 mr-1" />
              Benefits
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Why Take the IQ Test?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock valuable insights about your cognitive abilities and discover your intellectual potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  hoveredBenefit === index ? 'border-primary shadow-lg scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredBenefit(index)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    hoveredBenefit === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-muted/50 -mx-6 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">
                <Zap className="w-4 h-4 mr-1" />
                Process
              </Badge>
              <h2 className="text-4xl font-bold mb-4">How the Test Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive assessment designed to measure your cognitive abilities across multiple dimensions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {testFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Test Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Test Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Pattern Recognition (10 questions)</p>
                      <p className="text-sm text-muted-foreground">Identify sequences and visual patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Logical Reasoning (10 questions)</p>
                      <p className="text-sm text-muted-foreground">Solve logical puzzles and deductions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Verbal Intelligence (10 questions)</p>
                      <p className="text-sm text-muted-foreground">Vocabulary, analogies, and comprehension</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Spatial Intelligence (10 questions)</p>
                      <p className="text-sm text-muted-foreground">Mental rotation and spatial visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    After Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Instant Score Calculation</p>
                      <p className="text-sm text-muted-foreground">Get your IQ score immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Percentile Ranking</p>
                      <p className="text-sm text-muted-foreground">See where you stand globally</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Detailed Analytics</p>
                      <p className="text-sm text-muted-foreground">Category-by-category breakdown</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Compare with Geniuses</p>
                      <p className="text-sm text-muted-foreground">See how you rank against historical figures</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Psychologist Assessment */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Users className="w-4 h-4 mr-1" />
              Psychologist Path
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Need Official, Human-Reviewed Results?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The guided practice experience helps you prepare, but a certified psychologist session is ideal when you need
              formal interpretation, personalized guidance, and official documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Best For
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">Students preparing for admissions or scholarship assessments</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">Professionals who need a structured cognitive profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">Anyone seeking a validated report beyond automated scoring</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  What You Get For {formattedIQTestPrice}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">Live one-on-one session with a qualified psychologist</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">Certified written summary with structured interpretation</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">Clear recommendations for learning and performance growth</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">How the Booking Process Works</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                From booking to follow-up delivery, the {formattedIQTestPrice} psychologist session is designed to be
                simple, secure, and fully guided.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {psychologistBookingProcess.map((item, index) => (
                <div key={index} className="relative">
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold mb-4">
                        {item.step}
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <h4 className="font-bold">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  {index < psychologistBookingProcess.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            <Card className="border-primary/20 bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Booking Logistics & Policies
                </CardTitle>
                <CardDescription>
                  Key details to know before reserving your session with a certified psychologist.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Your session is conducted live via secure video call and lasts approximately 60 minutes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    A confirmation email is sent after booking, and your video call link arrives 15 minutes before the session.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    You can reschedule or cancel your appointment up to 24 hours before the booked time.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    After the session, you receive a certified written summary plus personalized follow-up guidance within 24-48 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Included Practice vs Certified Psychologist Session
              </CardTitle>
              <CardDescription>
                Choose the path that matches your goal right now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="font-semibold mb-2">Included Practice Access</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Speed and accessibility</p>
                      <Progress value={95} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Depth of interpretation</p>
                      <Progress value={45} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-2">Certified Psychologist Session</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Clinical-level validation</p>
                      <Progress value={95} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Personalized guidance</p>
                      <Progress value={90} />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={startCheckout}
                disabled={isStartingCheckout}
              >
                <Users className="w-5 h-5 mr-2" />
                {isStartingCheckout ? 'Preparing booking…' : 'Book Certified Psychologist Session'}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Methodology & Trust */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Shield className="w-4 h-4 mr-1" />
              Methodology
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Scientifically Validated Approach</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our IQ test is based on established psychometric principles and validated testing methodologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {methodology.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < methodology.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <Card className="border-0 bg-gradient-to-br from-muted/50 to-muted/30 dark:from-slate-900/80 dark:to-slate-900/50">
            <CardContent className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">98% Accuracy</h3>
                  <p className="text-muted-foreground">Validated against professional IQ assessments</p>
                </div>
                <div>
                  <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
                  <h3 className="text-2xl font-bold mb-2">1M+ Users</h3>
                  <p className="text-muted-foreground">Trusted by over a million test-takers worldwide</p>
                </div>
                <div>
                  <Award className="w-12 h-12 mx-auto mb-4 text-success" />
                  <h3 className="text-2xl font-bold mb-2">Research-Based</h3>
                  <p className="text-muted-foreground">Developed with cognitive psychology experts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Card className="border-0 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground dark:from-slate-900 dark:to-slate-800 dark:text-slate-50 dark:border dark:border-white/10">
            <CardContent className="py-16 text-center">
              <Brain className="w-20 h-20 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Ready to Discover Your IQ?</h2>
              <p className="mb-8 max-w-2xl mx-auto text-xl text-primary-foreground/90 dark:text-slate-300">
                Unlock unlimited practice tests, then complete your certified psychologist session for guided insight,
                official documentation, and expert follow-up.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8"
                  onClick={startCheckout}
                  disabled={isStartingCheckout}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {isStartingCheckout ? 'Preparing booking…' : 'Unlock Practice Tests'}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-lg text-primary-foreground hover:bg-white/10 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5"
                  onClick={() => onNavigate('browse-psychologists')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Find Certified Psychologists
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/70">
                Unlimited practice tests included • Certified psychologist session {formattedIQTestPrice} • Guided follow-up
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
