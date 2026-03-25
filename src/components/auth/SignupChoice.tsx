import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SignupChoiceProps {
  onSelectRegular: () => void;
  onSelectPsychologist: () => void;
  onToggleMode: () => void;
}

export function SignupChoice({
  onSelectRegular,
  onToggleMode,
}: SignupChoiceProps) {
  return (
    <div className='w-full max-w-lg mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-extrabold mb-2'>Join CerebroLearn</h1>
        <p className='text-muted-foreground'>
          Create your account to get started
        </p>
      </div>

      <div>
        {/* Regular Signup Card */}
        <Card
          className='hover:shadow-lg transition-shadow border-2 hover:border-primary/50'
          onClick={onSelectRegular}
        >
          <CardHeader className='text-center pb-4'>
            <div className='mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
              <User className='h-8 w-8 text-primary' />
            </div>
            <CardTitle className='text-2xl'>Create Account</CardTitle>
            <CardDescription>
              For learners, instructors, and organizations
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-3'>
              <h4 className='font-semibold text-sm text-muted-foreground'>
                Perfect for:
              </h4>
              <ul className='space-y-2'>
                <li className='flex items-start gap-2 text-sm'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Students wanting to learn and take IQ tests</span>
                </li>
                <li className='flex items-start gap-2 text-sm'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Instructors creating and teaching courses</span>
                </li>
                <li className='flex items-start gap-2 text-sm'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Organizations managing team learning</span>
                </li>
                <li className='flex items-start gap-2 text-sm'>
                  <CheckCircle2 className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                  <span>Access to full course catalog and features</span>
                </li>
              </ul>
            </div>

            <div className='pt-4 border-t'>
              <Button className='w-full cursor-pointer' size='lg' onClick={onSelectRegular}>
                Get Started
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='text-center mt-8'>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className='text-primary hover:underline font-medium cursor-pointer'
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
