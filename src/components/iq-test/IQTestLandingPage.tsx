import React from 'react';
import { Brain, Clock, Award, TrendingUp, Users, Shield, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface IQTestLandingPageProps {
  onNavigate: (page: string, data?: any) => void;
  handleStartTest: () => void;
  hasResults: boolean;
  latestResultId: string;
}

export function IQTestLandingPage({ onNavigate, handleStartTest, hasResults, latestResultId }: IQTestLandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Discover Your Cognitive Potential
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take our scientifically validated IQ test and unlock insights into your cognitive strengths. 
              Get personalized recommendations and optional professional review from certified psychologists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleStartTest}
                className="text-lg px-8 py-6"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Full IQ Test
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('iq-test-practice')}
                className="text-lg px-8 py-6"
              >
                <Target className="w-5 h-5 mr-2" />
                Practice Mode
              </Button>
              {hasResults && (
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => onNavigate('iq-test-results', { resultId: latestResultId })}
                  className="text-lg px-8 py-6"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Past Results
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Comprehensive Analysis</CardTitle>
                <CardDescription>
                  Receive a detailed breakdown of your cognitive abilities across multiple domains
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Percentile Ranking</CardTitle>
                <CardDescription>
                  See how you compare to others with standardized percentile scores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Professional Review</CardTitle>
                <CardDescription>
                  Optional consultation with certified psychologists for deeper insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Test Details Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Test Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The test takes approximately 30 minutes to complete. You can take breaks, 
                    but the timer will continue running.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Question Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The test includes pattern recognition, logical reasoning, spatial awareness, 
                    and mathematical problem-solving questions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your IQ score is calculated based on the number of correct answers and 
                    time taken, normalized against a standard distribution.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your results are completely private and only shared with psychologists 
                    if you choose to book a consultation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Psychologist Review CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">
                Want Professional Insights on Your Results?
              </CardTitle>
              <CardDescription className="text-base">
                After completing your test, you can book a consultation with certified psychologists 
                who will provide personalized analysis and recommendations based on your cognitive profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('browse-psychologists')}
              >
                <Users className="w-5 h-5 mr-2" />
                Learn About Psychologist Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is this test accurate?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our IQ test is based on scientifically validated methodologies and has been 
                    calibrated against standard IQ distributions. While it provides a good estimate 
                    of cognitive abilities, professional assessments may offer additional insights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I retake the test?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can retake the test after 30 days. We recommend waiting to avoid 
                    practice effects and to allow time for any cognitive development activities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How much does it cost?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The IQ test is completely free! Optional psychologist consultations are 
                    priced individually based on the professional's rates and session duration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take the first step in understanding your cognitive potential
          </p>
          <Button 
            size="lg"
            onClick={() => onNavigate('iq-test-interface')}
            className="text-lg px-12"
          >
            <Brain className="w-5 h-5 mr-2" />
            Start Your IQ Test Now
          </Button>
        </div>
      </div>
    </div>
  );
}