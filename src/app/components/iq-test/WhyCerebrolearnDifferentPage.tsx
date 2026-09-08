"use client";

import React from 'react';
import {
  Brain,
  UserCheck,
  Video,
  ClipboardList,
  BarChart3,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  ArrowDown,
  ArrowRight,
  Shield,
  Search,
  Calendar,
  DollarSign,
  Target,
  Sparkles,
  Quote,
  Accessibility,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useIQTestCheckout } from '../../hooks/useIQTestCheckout';

interface WhyCerebrolearnDifferentPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const officialComponents = [
  { icon: Brain, title: 'Standardized IQ Assessment', description: 'Your psychologist administers an appropriate standardized intelligence assessment.' },
  { icon: UserCheck, title: 'Qualified Psychologist', description: 'Your assessment is administered through a qualified psychology professional rather than an automated website.' },
  { icon: Video, title: 'Private Virtual Appointment', description: 'You meet with your psychologist through a private video appointment.' },
  { icon: ClipboardList, title: 'Professional Administration', description: "Your psychologist administers the assessment according to the requirements of the applicable instrument and professional procedures." },
  { icon: BarChart3, title: 'Professional Scoring & Interpretation', description: 'Your results are professionally scored and interpreted.' },
  { icon: TrendingUp, title: 'Official IQ Score', description: 'You receive a professionally derived IQ score from your assessment.' },
  { icon: FileText, title: 'Comprehensive IQ Report', description: 'You receive a comprehensive professional report documenting your assessment and results.' },
];

const competitors = [
  {
    name: '123test.com',
    description: 'provides a variety of online IQ and aptitude tests, including free tests, practice tests, and other products. Its website itself distinguishes practice/demo testing from professional IQ testing.',
  },
  {
    name: 'myiqtested.com',
    description: "provides an online, browser-scored IQ test based on ICAR items. Importantly, MyIQTested.com itself states that its online result is an estimate and explicitly says that an online test does not fully replicate a professional assessment administered one-on-one by a psychologist.",
  },
  {
    name: 'iqtest.com',
    description: 'provides an online IQ test that users take directly through its website. Its test is completed online and produces an online result.',
  },
];

const pricingBarriers = [
  'Psychologist time',
  'Testing sessions',
  'Professional scoring',
  'Interpretation',
  'Report preparation',
  'Administrative/intake time',
  'Office expenses',
  'Additional evaluation services',
];

const findPsychologistSteps = [
  'Search',
  'Call practices',
  'Ask whether they provide IQ testing',
  'Ask which assessment they administer',
  'Ask about pricing',
  'Complete intake procedures',
  'Wait for availability',
  'Travel to the psychologist if in-person testing is required',
  'Complete the assessment',
  'Wait for scoring/reporting',
];

const mensaSteps = [
  'Membership admission',
  'Find an available testing opportunity',
  'Travel to the testing location when required',
  'Take the admission examination',
  'Receive the result required for the admission process',
];

const experienceSteps = [
  'Purchase Online',
  'Schedule Psychologist',
  'Private Virtual Appointment',
  'Individualized Professional Assessment',
  'Professional Scoring & Interpretation',
  'Official IQ Score',
  'Comprehensive IQ Report',
];

const fakeFlowSteps = [
  'You visit a website.',
  'You answer questions independently.',
  'The website calculates a result.',
  'You receive an online score or estimate.',
];

const cerebrolearnFlowSteps = [
  'You purchase the assessment.',
  'You schedule a qualified psychologist.',
  'You attend a private virtual appointment.',
  'Your psychologist administers the standardized assessment.',
  'Your assessment is professionally scored.',
  'Your results are professionally interpreted.',
  'You receive your Official IQ Score.',
  'You receive your Comprehensive IQ Report.',
];

const howItWorksSteps = [
  {
    number: 1,
    icon: DollarSign,
    title: 'Purchase Your Official IQ Test',
    description: 'Your purchase includes the complete professional assessment package.',
  },
  {
    number: 2,
    icon: Calendar,
    title: 'Schedule Your Psychologist',
    description:
      'After purchasing, schedule your appointment with an available qualified psychologist. Cerebrolearn organizes the process through one platform, so you do not have to spend hours searching for independent psychologists who offer IQ testing.',
  },
  {
    number: 3,
    icon: Video,
    title: 'Meet Your Psychologist Online',
    description:
      'At your scheduled time, you join your private virtual appointment and meet with a real psychologist through video. This is a real professional appointment — not an AI-generated assessment, not an automated score, not simply an online quiz.',
  },
  {
    number: 4,
    icon: ClipboardList,
    title: 'Complete Your Official IQ Assessment',
    description:
      'Your psychologist administers the appropriate standardized IQ assessment according to the requirements of the applicable instrument and professional procedures (e.g., Wechsler scales, Stanford-Binet).',
  },
  {
    number: 5,
    icon: BarChart3,
    title: 'Professional Scoring & Interpretation',
    description:
      'Your psychologist professionally scores and interprets your assessment according to the applicable procedures. The result is not simply an automatically generated number produced by a website.',
  },
  {
    number: 6,
    icon: FileText,
    title: 'Receive Your Official IQ Score & Report',
    description:
      'You receive your Official IQ Score, your Professional Interpretation, and your Comprehensive IQ Report — all included in the Cerebrolearn professional IQ assessment package.',
  },
];

const whyReasons = [
  { number: 1, title: 'Official IQ Testing', description: 'You receive a professionally administered standardized IQ assessment.' },
  { number: 2, title: 'Real Psychologists', description: 'You meet with a qualified psychology professional.' },
  { number: 3, title: 'Real IQ Score', description: 'Your IQ score is professionally derived from the standardized assessment.' },
  { number: 4, title: 'Comprehensive Report', description: 'Your assessment includes a professional report.' },
  {
    number: 5,
    title: 'Virtual',
    description:
      'You can complete your professional appointment online rather than traveling to a physical testing center when the selected assessment permits telepractice.',
  },
  { number: 6, title: 'Individualized', description: 'Your assessment is conducted as an individualized professional service.' },
  { number: 7, title: 'Accessible', description: 'Cerebrolearn brings the assessment process into one platform.' },
];

function FlowSteps({ steps, variant = 'neutral' }: { steps: string[]; variant?: 'neutral' | 'negative' | 'positive' }) {
  const stepStyles = {
    neutral: 'border-border bg-muted/30',
    negative: 'border-destructive/20 bg-destructive/5 dark:bg-destructive/10',
    positive: 'border-primary/20 bg-primary/5 dark:bg-primary/10',
  };

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`rounded-lg border px-4 py-3 text-sm text-foreground text-center flex items-center justify-center min-h-[48px] ${stepStyles[variant]}`}>
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function WhyCerebrolearnDifferentPage({ onNavigate }: WhyCerebrolearnDifferentPageProps) {
  const { formattedIQTestPrice } = useAppSettings();
  const { isStartingCheckout, startCheckout } = useIQTestCheckout(onNavigate);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_45%)]" />
        <div className="container relative max-w-5xl mx-auto px-6 py-20 text-center">
          <Badge className="mb-4 border-0 bg-white/20 text-white hover:bg-white/30 dark:bg-white/10 dark:text-slate-50 dark:hover:bg-white/15">
            <Shield className="w-4 h-4 mr-1" />
            Why Cerebrolearn Is Different
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Real Official IQ Testing. Not a Fake Online IQ Test.
          </h1>
          <p className="text-xl leading-relaxed text-white/90 dark:text-slate-200 max-w-3xl mx-auto">
            There is a fundamental difference between taking an online IQ test by yourself and receiving
            Official IQ Testing from a qualified psychologist. Cerebrolearn is built around the second model.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-6">
        {/* What Makes Cerebrolearn Official */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-4 h-4 mr-1" />
              What Makes It Official
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Makes Cerebrolearn an Official IQ Testing Service?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Cerebrolearn's Official IQ Testing service combines the components that distinguish
              professional IQ assessment from ordinary self-administered online testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialComponents.map((item, index) => (
              <Card
                key={index}
                className={`h-full ${
                  index === officialComponents.length - 1
                    ? 'md:col-span-2 lg:col-span-1 lg:col-start-2'
                    : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8 max-w-3xl mx-auto">
            The complete package is what makes Cerebrolearn an Official IQ Testing service rather than a
            basic online IQ quiz.
          </p>
        </section>

        {/* Not a Fake Quiz */}
        <section className="py-20">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <Badge className="mb-4 mx-auto" variant="secondary">
                <Shield className="w-4 h-4 mr-1" />
                Not a Fake Online IQ Quiz
              </Badge>
              <CardTitle className="text-3xl md:text-4xl">
                This Is Not a {formattedIQTestPrice} Fake Online IQ Quiz
              </CardTitle>
              <CardDescription className="text-lg">
                {formattedIQTestPrice} includes the complete professional IQ assessment:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
                {officialComponents.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      index === officialComponents.length - 1 ? 'md:col-span-2 md:justify-center' : ''
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{item.title}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mb-6">
                <Button size="lg" onClick={startCheckout} disabled={isStartingCheckout}>
                  <Brain className="w-5 h-5 mr-2" />
                  {isStartingCheckout ? 'Preparing booking…' : 'Schedule Your Assessment'}
                </Button>
              </div>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                You are not paying {formattedIQTestPrice} simply to access an online questionnaire. You are
                paying {formattedIQTestPrice} for the complete Cerebrolearn Official IQ Testing service.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cerebrolearn vs Fake Online IQ Testing */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <XCircle className="w-4 h-4 mr-1" />
              The Comparison
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cerebrolearn vs. Fake Online IQ Testing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The Internet is filled with websites offering Fake IQ tests that users can take
              independently. Examples include:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {competitors.map((c, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{c.name} {c.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h3 className="text-xl font-bold">The Cerebrolearn Difference</h3>
            <p className="text-muted-foreground">
              These websites may provide useful online testing, estimates, practice, research-based
              measures, or other forms of cognitive testing. But they are not the same thing as
              Cerebrolearn psychologist-administered Official IQ Testing services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
            <Card className="border-destructive/30 h-full flex flex-col">
              <CardHeader className="min-h-[88px] justify-center pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-base leading-snug text-center">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  Cerebrolearn Product Is Not
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex items-start justify-center">
                <p className="text-sm font-medium text-center">
                  Website → Questions → Automatic Score
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/30 h-full flex flex-col">
              <CardHeader className="min-h-[88px] justify-center pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-base leading-snug text-center">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Cerebrolearn Is
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex items-start justify-center">
                <p className="text-sm font-medium text-center">
                  Purchase → Psychologist Appointment → Professional Administration → Standardized IQ
                  Assessment → Professional Scoring → Professional Interpretation → Official IQ Score →
                  Comprehensive Report
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center font-semibold mt-8">That is the distinction.</p>
        </section>

        {/* Real vs Fake Flow Comparison */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real IQ Testing vs. a Fake Online IQ Test
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <Card className="h-full flex flex-col border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
              <CardHeader className="min-h-[96px] justify-center text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-center text-lg text-muted-foreground leading-snug">
                  Fake/Self-Administered Online IQ Test Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <FlowSteps steps={fakeFlowSteps} variant="negative" />
              </CardContent>
            </Card>
            <Card className="h-full flex flex-col border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-lg">
              <CardHeader className="min-h-[96px] justify-center text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-center text-lg text-primary leading-snug">
                  Cerebrolearn Official IQ Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <FlowSteps steps={cerebrolearnFlowSteps} variant="positive" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Target className="w-4 h-4 mr-1" />
              The Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Cerebrolearn's Official IQ Test Works
            </h2>
          </div>
          <div className="space-y-6">
            {howItWorksSteps.map((step) => (
              <Card key={step.number}>
                <CardContent className="pt-6 flex flex-col md:flex-row gap-4 md:items-start">
                  <div className="flex items-center gap-3 md:w-72 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex items-center gap-2">
                      <step.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.title === 'Purchase Your Official IQ Test'
                      ? `Purchase the Cerebrolearn Official IQ Assessment for ${formattedIQTestPrice}. ${step.description}`
                      : step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why $299 */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <DollarSign className="w-4 h-4 mr-1" />
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Is Cerebrolearn {formattedIQTestPrice}?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional IQ testing without the $1,500&ndash;$5,000+ price barrier. Traditional
              psychologist-administered IQ assessment can be expensive. Depending on the provider,
              assessment instrument, location, and scope of service, professional assessment can reach
              $1,500&ndash;$5,000+. The customer may be paying for:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
            {pricingBarriers.map((item, index) => (
              <div key={index} className="rounded-lg border bg-muted/30 px-3 py-3 text-center text-sm">
                {item}
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Cerebrolearn's objective is to make the professional IQ-testing experience dramatically
            more accessible.
          </p>

          <Card className="max-w-2xl mx-auto border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-semibold text-primary mb-2">CEREBROLEARN</p>
              <p className="text-4xl font-bold mb-2">{formattedIQTestPrice}</p>
              <p className="font-medium mb-4">Complete Official IQ Testing</p>
              <p className="text-sm text-muted-foreground">
                Psychologist + Assessment + Professional Administration + Scoring + Interpretation +
                Official IQ Score + Comprehensive Report
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why Not Find a Psychologist Yourself */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Search className="w-4 h-4 mr-1" />
              The Alternative
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Cerebrolearn Instead of Finding a Psychologist Yourself?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Finding an independent psychologist can be difficult. You may have to:
            </p>
          </div>
          <div className="max-w-xl mx-auto mb-12">
            <FlowSteps steps={findPsychologistSteps} />
          </div>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-2">
            For some clinical psychology practices, psychological testing is also part of a broader
            evaluation process connected to clinical, educational, disability, or other referral needs.
          </p>
          <p className="text-center font-semibold max-w-3xl mx-auto">
            Cerebrolearn is designed around a much simpler proposition: you want an Official IQ Test.
            Cerebrolearn provides the professional IQ-testing service directly.
          </p>
        </section>

        {/* Cerebrolearn vs Mensa */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <GraduationCap className="w-4 h-4 mr-1" />
              A Different Purpose
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cerebrolearn vs. Mensa Testing</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Why choose Cerebrolearn instead of simply taking a Mensa admission test? Mensa testing
              serves a specific purpose: determining eligibility for Mensa membership. American Mensa
              explains that its admission test is intended for membership admission rather than
              providing an individual's detailed IQ measurement, and its standard admission testing does
              not provide candidates with a detailed IQ report. For someone seeking a personalized
              professional IQ assessment, that creates a fundamentally different experience.
            </p>
          </div>
          <Card className="max-w-xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-center text-lg">Mensa Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <FlowSteps steps={mensaSteps} />
            </CardContent>
          </Card>
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-center">
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              Not a psychologist appointment
            </div>
            <div className="flex items-center justify-center gap-2 text-sm rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-center">
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              Not a comprehensive individualized psychologist report
            </div>
            <div className="flex items-center justify-center gap-2 text-sm rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-center">
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              Not the same personalized professional IQ-assessment experience
            </div>
          </div>
        </section>

        {/* The Cerebrolearn Experience */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Cerebrolearn Experience</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional IQ assessment, brought directly to you.
            </p>
          </div>
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-6">
              <FlowSteps steps={experienceSteps} />
            </CardContent>
          </Card>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-8">
            You do not have to make a potentially long drive to a Mensa testing location simply to take
            an admission examination. Cerebrolearn brings the professional IQ assessment directly to you
            virtually.
          </p>
        </section>

        {/* Disability Accommodations */}
        <section className="py-20">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <Badge className="mb-4 mx-auto" variant="secondary">
                <Accessibility className="w-4 h-4 mr-1" />
                Accommodations
              </Badge>
              <CardTitle className="text-3xl md:text-4xl">
                Individualized IQ Testing & Disability Accommodations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cerebrolearn's professional, individualized testing model is designed to allow
                appropriate disability-related accommodation requests to be evaluated by the
                psychologist. If you have a documented disability or disorder, you can request
                appropriate accommodations and provide verification from an appropriate doctor,
                psychologist, psychiatrist, or other qualified professional.
              </p>
              <p className="text-muted-foreground">The psychologist can evaluate the accommodation request based on:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>the individual's documented needs</li>
                <li>the applicable assessment's requirements</li>
                <li>professional standards</li>
                <li>whether the accommodation can be provided without invalidating the assessment</li>
              </ul>
              <p className="text-muted-foreground">
                This is fundamentally different from a one-size-fits-all Fake Online IQ quiz, or
                In-Person Mensa test. Your assessment is conducted as an individualized professional
                service. All accommodation requests are subject to professional review, documentation
                requirements, the selected assessment instrument, and applicable professional standards.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why Cerebrolearn - 8 reasons */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Cerebrolearn?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyReasons.map((item) => (
              <Card key={item.number} className="h-full">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {item.number}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="h-full border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  8
                </div>
                <h3 className="font-bold mb-2">{formattedIQTestPrice}</h3>
                <p className="text-sm text-muted-foreground">
                  The complete service is designed to provide substantially greater accessibility than
                  many traditional professional IQ assessment options.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Cerebrolearn Difference - quote */}
        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
            <Card className="border-destructive/30 h-full">
              <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center">
                <Quote className="w-6 h-6 text-destructive mb-3" />
                <p className="text-sm font-medium mb-2">A Fake/Self-Administered Online IQ Test:</p>
                <p className="italic text-muted-foreground">
                  "Take this quiz and we'll calculate your score."
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/30 h-full">
              <CardContent className="pt-6 h-full flex flex-col items-center justify-center text-center">
                <Quote className="w-6 h-6 text-primary mb-3" />
                <p className="text-sm font-medium mb-2">Cerebrolearn:</p>
                <p className="italic text-muted-foreground">
                  "Meet your psychologist and receive your Official IQ Assessment."
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center font-semibold mt-8 max-w-2xl mx-auto">
            That difference is the entire reason Cerebrolearn exists.
          </p>
        </section>
      </div>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50 py-20">
        <div className="container relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            This Is Real Official IQ Testing. Not a Fake Online IQ Test.
          </h2>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/90 dark:text-slate-200 mb-8 text-sm font-medium uppercase tracking-wide">
            <span>Real Psychologist</span>
            <span>Real Standardized Assessment</span>
            <span>Real Professional Administration</span>
            <span>Real Professional Scoring</span>
            <span>Real IQ Score</span>
            <span>Real Comprehensive Report</span>
          </div>
          <p className="text-5xl font-bold mb-8">{formattedIQTestPrice}</p>
          <Button
            size="lg"
            variant="secondary"
            onClick={startCheckout}
            disabled={isStartingCheckout}
          >
            <Brain className="w-5 h-5 mr-2" />
            {isStartingCheckout ? 'Preparing booking…' : 'Schedule Your Official IQ Assessment'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-white/70 dark:text-slate-400 mt-10 max-w-2xl mx-auto">
            The exact assessment instrument, psychologist qualifications, telepractice procedures,
            accommodations, report contents, and permitted uses are subject to the requirements of the
            selected assessment, the administering professional, applicable professional standards, and
            applicable law.
          </p>
        </div>
      </section>
    </div>
  );
}
