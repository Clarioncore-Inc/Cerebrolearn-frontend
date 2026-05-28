import React from 'react';
import { Sparkles, Zap, Target, BookOpen, LucideIcon } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

interface HowItWorksSectionProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    number: '01',
    title: 'Sign Up and Explore',
    description: 'Create your account and get instant access to our entire course library',
    icon: Target,
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    number: '02',
    title: 'Choose Your Path',
    description: 'Browse courses tailored to your goals and start learning at your own pace',
    icon: BookOpen,
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    number: '03',
    title: 'Learn and Grow',
    description: 'Engage with interactive lessons, earn XP, and track your progress',
    icon: Zap,
    gradient: 'from-emerald-500 to-teal-500'
  }
];

export function HowItWorksSection({
  title = 'Your Learning Journey Made Simple',
  subtitle = 'Start learning in just three easy steps and transform your future',
  badgeText = 'How It Works',
  steps = defaultSteps
}: HowItWorksSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container relative py-20">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{badgeText}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Steps Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-1/2 w-full h-0.5 border-t-2 border-dashed border-primary/20 -z-10"></div>
                )}
                
                <div className="relative h-full p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover-lift">
                  {/* Icon and Number */}
                  <div className="relative inline-flex mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background flex items-center justify-center font-bold text-white shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
