import React, { useState } from 'react';

import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { paymentsApi } from '../../../../utils/api-client';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../auth/LoginForm';
import { SignupForm } from '../auth/SignupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface IQTestCheckoutSignupProps {
  onNavigate: (page: string, data?: any) => void;
  onBack?: () => void;
}

export function IQTestCheckoutSignup(_props: IQTestCheckoutSignupProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login'>(user ? 'login' : 'signup');
  const [redirecting, setRedirecting] = useState(false);

  // Existing/logged-in user: account already exists, so just start checkout.
  const redirectToCheckout = async () => {
    sessionStorage.setItem('cerebrolearn.user.intent', 'iq-only');
    setRedirecting(true);

    try {
      const session = await paymentsApi.createIQTestCheckoutSession({
        cancel_path: window.location.pathname,
      });
      window.location.assign(session.checkout_url);
    } catch (err) {
      setRedirecting(false);
      toast.error(err instanceof Error ? err.message : 'Unable to start secure checkout.');
    }
  };

  // New guest: don't create the account yet. Stash the signup details on the
  // backend as a pending signup and only create the account once Stripe
  // confirms payment.
  const redirectToGuestCheckout = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    sessionStorage.setItem('cerebrolearn.user.intent', 'iq-only');
    setRedirecting(true);

    try {
      const session = await paymentsApi.createIQTestGuestCheckoutSession({
        email,
        password,
        full_name: fullName,
        cancel_path: window.location.pathname,
      });
      window.location.assign(session.checkout_url);
    } catch (err) {
      setRedirecting(false);
      toast.error(err instanceof Error ? err.message : 'Unable to start secure checkout.');
    }
  };

  return (
    <div className='container max-w-6xl py-12'>
      <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <Card className='gap-4 border-primary/15 bg-gradient-to-br from-primary/5 via-background to-secondary/10'>
          <CardHeader className='px-5 pt-5'>
            <CardTitle className='flex items-center gap-2 text-3xl'>
              Book your psychologist session
            </CardTitle>
            <CardDescription className='mt-2'>
              Create your account to continue with your booking and reserve time with a certified psychologist.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 px-5 pb-5 text-sm text-muted-foreground'>
            <div className='rounded-2xl border border-border/60 bg-background/80 p-3'>
              <p className='font-semibold text-foreground'>What happens next</p>
              <ul className='mt-3 space-y-2'>
                <li>1. Create your account with just your name, email, and password.</li>
                <li>2. Pay securely and confirm your booking details.</li>
                <li>3. Meet with a certified psychologist and manage everything from your dashboard.</li>
              </ul>
            </div>

            <div className='rounded-2xl border border-border/60 bg-background/80 p-3'>
              <p className='font-semibold text-foreground'>Your IQ-test point</p>
              <p className='mt-2'>
                Book a one-on-one session with a certified psychologist.
              </p>
            </div>
          </CardContent>
        </Card>

        {redirecting ? (
          <Card className='flex min-h-[320px] items-center justify-center'>
            <CardContent className='space-y-3 px-5 text-center'>
              <CreditCard className='mx-auto h-10 w-10 text-primary' />
              <p className='text-xl font-semibold'>Preparing your secure booking…</p>
              <p className='text-sm text-muted-foreground'>Please wait while we take you to the next step.</p>
            </CardContent>
          </Card>
        ) : mode === 'signup' ? (
          <SignupForm
            simplified
            skipAccountCreation
            fixedRole='iq_user'
            hideRoleSelection
            title='Sign up'
            submitLabel='Continue to secure payment'
            onToggleMode={() => setMode('login')}
            onSignedUpWithCredentials={redirectToGuestCheckout}
            showSocialAuth
            onSocialAuthSuccess={redirectToCheckout}
            compact
          />
        ) : (
          <LoginForm
            onToggleMode={() => setMode('signup')}
            onSignedIn={redirectToCheckout}
            title='Sign in to continue'
            description='Use your existing account to continue with your psychologist session booking.'
            submitLabel='Sign in and continue'
            compact
          />
        )}
      </div>
    </div>
  );
}