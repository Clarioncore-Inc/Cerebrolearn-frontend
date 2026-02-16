import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, UserCheck, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SignupChoiceProps {
  onSelectRegular: () => void;
  onSelectPsychologist: () => void;
  onToggleMode: () => void;
}

export function SignupChoice({ onSelectRegular, onSelectPsychologist, onToggleMode }: SignupChoiceProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Join CerebroLearn</h1>
        <p className="text-muted-foreground">Choose the account type that's right for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regular Signup Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50" onClick={onSelectRegular}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Regular Account</CardTitle>
            <CardDescription>For learners, instructors, and organizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Perfect for:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Students wanting to learn and take IQ tests</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Instructors creating and teaching courses</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Organizations managing team learning</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Access to full course catalog and features</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full" size="lg" onClick={onSelectRegular}>
                Create Regular Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Psychologist Signup Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-cyan-500/50 relative overflow-hidden" onClick={onSelectPsychologist}>
          <div className="absolute top-0 right-0 bg-cyan-500 text-white px-3 py-1 text-xs font-semibold">
            Professional
          </div>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-cyan-500" />
            </div>
            <CardTitle className="text-2xl">Psychologist Account</CardTitle>
            <CardDescription>For licensed mental health professionals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">Perfect for:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Licensed psychologists and therapists</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Provide IQ test result consultations</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Offer career and educational counseling</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Manage your practice and appointments</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span>
                  Requires verification of professional credentials. 
                  Application review typically takes 2-3 business days.
                </span>
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-600" 
                size="lg"
                onClick={onSelectPsychologist}
              >
                Apply as Psychologist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}