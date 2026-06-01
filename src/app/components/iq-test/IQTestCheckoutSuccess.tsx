import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { paymentsApi } from '../../../../utils/api-client';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface IQTestCheckoutSuccessProps {
  onNavigate: (page: string, data?: any) => void;
}

export function IQTestCheckoutSuccess({ onNavigate }: IQTestCheckoutSuccessProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [message, setMessage] = useState('We are confirming your payment.');

  useEffect(() => {
    const sessionId = searchParams.get('session_id') ?? location.state?.sessionId;
    if (!sessionId) {
      setStatus('error');
      setMessage('Missing payment information. Please return to the IQ test overview.');
      return;
    }
    if (!user || !sessionId) {
      return;
    }

    let isActive = true;
    let timeoutId: number | undefined;

    const confirmPayment = async () => {
      try {
        await paymentsApi.confirmIQTestCheckoutSession(sessionId);
        if (!isActive) {
          return;
        }
        sessionStorage.setItem('cerebrolearn.user.intent', 'iq-only');
        setStatus('success');
        setMessage('Payment confirmed. Redirecting to your IQ dashboard…');
        toast.success('Payment confirmed. Welcome to your IQ dashboard!');
        timeoutId = window.setTimeout(() => onNavigate('dashboard'), 1200);
      } catch (err) {
        if (!isActive) {
          return;
        }
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Unable to confirm your payment.');
      }
    };

    confirmPayment();

    return () => {
      isActive = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [location.state, onNavigate, searchParams, user]);

  if (!user) {
    return (
      <div className='container max-w-2xl py-16'>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to finish your IQ test purchase</CardTitle>
            <CardDescription>
              We need your account session to confirm the payment and open your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() =>
                onNavigate('auth', {
                  authMode: 'login',
                  postAuthRedirect: {
                    page: 'iq-test-payment-success',
                    data: { sessionId: searchParams.get('session_id') },
                  },
                })
              }
            >
              Continue to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container max-w-2xl py-16'>
      <Card>
        <CardHeader>
          <CardTitle>
            {status === 'error' ? 'We hit a confirmation issue' : 'Finalizing your official IQ assessment'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4 text-center'>
          {status === 'confirming' ? (
            <Loader2 className='h-10 w-10 animate-spin text-primary' />
          ) : status === 'success' ? (
            <CheckCircle2 className='h-10 w-10 text-emerald-600' />
          ) : (
            <CreditCard className='h-10 w-10 text-primary' />
          )}

          {status === 'error' && (
            <div className='flex flex-wrap justify-center gap-3'>
              <Button onClick={() => onNavigate('iq-test-overview')}>Back to IQ overview</Button>
              <Button variant='outline' onClick={() => window.location.reload()}>
                Retry confirmation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}