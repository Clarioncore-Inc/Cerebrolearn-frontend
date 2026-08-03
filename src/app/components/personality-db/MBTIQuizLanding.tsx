import React, { useMemo } from 'react';
import { Sparkles, Clock, Users, ShieldCheck, Brain, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { SlideInView } from '../pages/SlideInView';
import { MBTI_QUIZ_QUESTIONS } from '../../data/mbtiQuizData';
import { MBTI_PROFILES, getMBTITypeImagePath } from '../../data/mbtiData';

interface MBTIQuizLandingProps {
  onNavigate: (page: string, data?: any) => void;
}

interface StoredMBTIResult {
  id: string;
  type: string;
  date: string;
}

export function MBTIQuizLanding({ onNavigate }: MBTIQuizLandingProps) {
  const { hasResults, latestResult } = useMemo(() => {
    const results: StoredMBTIResult[] = JSON.parse(
      localStorage.getItem('mbti_quiz_results') || '[]',
    );
    return {
      hasResults: results.length > 0,
      latestResult: results.length > 0 ? results[results.length - 1] : null,
    };
  }, []);

  const features = [
    { icon: Clock, title: `${MBTI_QUIZ_QUESTIONS.length} Questions`, desc: 'About 5 minutes to complete' },
    { icon: Brain, title: '16 Personality Types', desc: 'Based on the Myers-Briggs framework' },
    { icon: ShieldCheck, title: 'No Sign-Up Required', desc: 'Take the test fully anonymously' },
    { icon: Users, title: 'Compare & Discuss', desc: 'See your type in the Personality Database' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="relative py-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#395192]/5 via-background to-[#06b6d4]/5"></div>
        <div className="absolute inset-0 neural-grid opacity-10"></div>
        <div className="container relative z-10">
          <SlideInView>
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              <Badge className="bg-[#395192] text-white border-0 shadow-lg">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Personality Test
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="block gradient-ai-text mb-2">What's Your Personality Type?</span>
                <span className="block text-foreground text-2xl md:text-3xl font-medium">
                  Take the free MBTI-style test and find out
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Answer {MBTI_QUIZ_QUESTIONS.length} quick questions to discover which of the 16 personality
                types fits you best — then compare notes with Einstein, Sherlock Holmes, and others in the
                Personality Database.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  size="lg"
                  onClick={() => onNavigate('personality-test-interface')}
                  className="text-lg px-8 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start the Test
                </Button>
                {hasResults && latestResult && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => onNavigate('personality-test-results', { resultId: latestResult.id })}
                    className="text-lg px-8 py-6"
                  >
                    <Layers className="w-5 h-5 mr-2" />
                    View Your Last Result ({latestResult.type})
                  </Button>
                )}
              </div>
            </div>
          </SlideInView>
        </div>
      </section>

      <div className="container py-12 space-y-12">
        <SlideInView delay={100}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-5 space-y-2">
                  <f.icon className="w-6 h-6 text-[#395192]" />
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SlideInView>

        <SlideInView delay={150}>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">The 16 Types</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(MBTI_PROFILES) as Array<keyof typeof MBTI_PROFILES>).map((code) => (
                <Card key={code} className="overflow-hidden">
                  <CardContent className="p-3 flex items-center gap-3">
                    <img
                      src={getMBTITypeImagePath(code)}
                      alt={code}
                      className="w-10 h-10 rounded-lg object-cover bg-muted flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground">{code}</div>
                      <div className="text-xs text-muted-foreground truncate">{MBTI_PROFILES[code].nickname}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SlideInView>
      </div>
    </div>
  );
}
