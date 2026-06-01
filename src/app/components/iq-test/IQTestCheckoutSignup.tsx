import React, { useState } from 'react';

import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { paymentsApi } from '../../../../utils/api-client';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../auth/LoginForm';
import { SignupForm } from '../auth/SignupForm';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface IQTestCheckoutSignupProps {
  onNavigate: (page: string, data?: any) => void;
}

export function IQTestCheckoutSignup({ onNavigate }: IQTestCheckoutSignupProps) {
  const { signIn, user } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login'>(user ? 'login' : 'signup');
  const [redirecting, setRedirecting] = useState(false);

  const redirectToCheckout = async () => {
    sessionStorage.setItem('cerebrolearn.user.intent', 'iq-only');
    setRedirecting(true);

    try {
      const session = await paymentsApi.createIQTestCheckoutSession();
      window.location.assign(session.checkout_url);
    } catch (err) {
      setRedirecting(false);
      toast.error(err instanceof Error ? err.message : 'Unable to start secure checkout.');
    }
  };

  return (
    <div className='container max-w-6xl py-12'>
      <Button variant='ghost' className='mb-6' onClick={() => onNavigate('iq-test-overview')}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to session overview
      </Button>

      <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
        <Card className='border-primary/15 bg-gradient-to-br from-primary/5 via-background to-secondary/10'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-3xl'>
              <Shield className='h-7 w-7 text-primary' />
              Secure signup to book your psychologist session
            </CardTitle>
            <CardDescription>
              Create your account to continue with your booking and reserve time with a certified psychologist.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-muted-foreground'>
            <div className='rounded-2xl border border-border/60 bg-background/80 p-4'>
              <p className='font-semibold text-foreground'>What happens next</p>
              <ul className='mt-3 space-y-2'>
                <li>1. Create your account with just your name, email, and password.</li>
                <li>2. Pay securely and confirm your booking details.</li>
                <li>3. Meet with a certified psychologist and manage everything from your dashboard.</li>
              </ul>
            </div>

            <div className='rounded-2xl border border-border/60 bg-background/80 p-4'>
              <p className='font-semibold text-foreground'>Why this flow is simplified</p>
              <p className='mt-2'>
                This path is dedicated to booking a one-on-one session with a certified psychologist.
              </p>
            </div>
          </CardContent>
        </Card>

        {redirecting ? (
          <Card className='flex min-h-[320px] items-center justify-center'>
            <CardContent className='space-y-3 text-center'>
              <CreditCard className='mx-auto h-10 w-10 text-primary' />
              <p className='text-xl font-semibold'>Preparing your secure booking…</p>
              <p className='text-sm text-muted-foreground'>Please wait while we take you to the next step.</p>
            </CardContent>
          </Card>
        ) : mode === 'signup' ? (
          <SignupForm
            simplified
            fixedRole='iq_user'
            hideRoleSelection
            title='Create your booking account'
            description='Use a few details to continue with your certified psychologist session.'
            submitLabel='Create account and continue'
            onToggleMode={() => setMode('login')}
            onSignedUpWithCredentials={async ({ email, password }) => {
              await signIn(email, password);
              await redirectToCheckout();
            }}
          />
        ) : (
          <LoginForm
            onToggleMode={() => setMode('signup')}
            onSignedIn={redirectToCheckout}
            title='Sign in to continue'
            description='Use your existing account to continue with your psychologist session booking.'
            submitLabel='Sign in and continue'
          />
        )}
      </div>
    </div>
  );
}