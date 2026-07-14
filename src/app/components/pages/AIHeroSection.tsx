import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AnimatedGradientBackground } from './AnimatedGradientBackground';
import { NeuralNetworkBackground } from './NeuralNetworkBackground';
import { IntelligenceMetrics } from './IntelligenceMetrics';
import { SlideInView } from './SlideInView';
import { ArrowRight, Sparkles, Brain, Rocket } from 'lucide-react';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';

const imgImage9 = '/assets/1b8ecf81cf4f7b4c4ad46fb87d38198fce6066e5.png';

interface AIHeroSectionProps {
  onNavigate: (page: string, data?: any) => void;
  isAuthenticated: boolean;
}

export function AIHeroSection({ onNavigate, isAuthenticated }: AIHeroSectionProps) {
  const { isIQOnlyMode } = useFeatureFlags();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedGradientBackground />
      <NeuralNetworkBackground />

      {/* Content Container */}
      <div className="container relative z-10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <SlideInView delay={0}>
                <Badge variant="outline" className="glass-ai border-primary/20 text-primary px-4 py-2 text-sm shadow-lg hover:shadow-xl transition-shadow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Powered by Artificial Intelligence
                </Badge>
              </SlideInView>

              {/* Main Headline */}
              <SlideInView delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight">
                  <span className="block gradient-ai-text mb-2">
                    AI-Powered
                  </span>
                  <span className="block text-foreground mb-2">
                    Intelligence
                  </span>
                  <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Enhancement
                  </span>
                </h1>
              </SlideInView>

              {/* Subheadline */}
              <SlideInView delay={200}>
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                  {isIQOnlyMode ? (
                    <>
                      Discover your cognitive strengths with{' '}
                      <span className="text-primary font-semibold">official IQ tests</span>,{' '}
                      <span className="text-secondary font-semibold">targeted practice</span>, and{' '}
                      <span className="text-primary font-semibold">certified insights</span> designed to measure how you think.
                    </>
                  ) : (
                    <>
                      Unlock your genius potential with{' '}
                      <span className="text-primary font-semibold">AI-driven learning</span>,{' '}
                      <span className="text-secondary font-semibold">IQ enhancement</span>, and join an{' '}
                      <span className="text-primary font-semibold">elite community of innovators</span>.
                    </>
                  )}
                </p>
              </SlideInView>

              {/* CTA Buttons */}
              <SlideInView delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {!isIQOnlyMode && (
                    <Button
                      size="lg"
                      onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
                      className="group relative bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-14 shadow-2xl hover:shadow-primary/50 transition-all duration-300 overflow-hidden ai-glow"
                    >
                      <span className="relative z-10 flex items-center">
                        <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Start Learning Free
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%] animate-[gradient-shift_3s_ease_infinite]"></div>
                    </Button>
                  )}

                  <Button
                    size="lg"
                    variant={isIQOnlyMode ? 'default' : 'outline'}
                    onClick={() => onNavigate('iq-test-overview')}
                    className={
                      isIQOnlyMode
                        ? 'group bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-14 shadow-2xl transition-all duration-300 w-full'
                        : 'group border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground text-lg px-8 h-14 shadow-lg transition-all duration-300'
                    }
                  >
                    <Rocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Test My IQ
                  </Button>
                </div>
              </SlideInView>

              {/* Feature Pills */}
              <SlideInView delay={400}>
                <div className="flex flex-wrap gap-3 pt-2">
                  {!isIQOnlyMode && (
                    <div className="glass-ai rounded-full px-4 py-2 text-sm flex items-center gap-2 border border-primary/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-muted-foreground">50,000+ Active Learners</span>
                    </div>
                  )}
                  {/* <div className="glass-ai rounded-full px-4 py-2 text-sm flex items-center gap-2 border border-secondary/20">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <span className="text-muted-foreground">AI-Powered Tutoring</span>
                  </div> */}
                  {!isIQOnlyMode && (
                    <div className="glass-ai rounded-full px-4 py-2 text-sm flex items-center gap-2 border border-yellow-500/20">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="text-muted-foreground">100% Free to Start</span>
                    </div>
                  )}
                </div>
              </SlideInView>
            </div>

            {/* Right Column - Visual Element */}
            <SlideInView delay={500} direction="right">
              <div className="relative hidden lg:block animate-float">
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-warning to-amber-400 rounded-2xl shadow-2xl rotate-12 animate-float"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-secondary to-cyan-400 rounded-full shadow-2xl animate-float animation-delay-2000"></div>
                  <img
                    src={imgImage9}
                    alt="Learning illustration"
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </SlideInView>
          </div>

          {/* Intelligence Metrics */}
          <SlideInView delay={600}>
            <div className="mt-16 lg:mt-20">
              <IntelligenceMetrics />
            </div>
          </SlideInView>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
}