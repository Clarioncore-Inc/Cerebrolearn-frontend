import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';

interface LoginFormProps {
  onToggleMode: () => void;
  onSignedIn?: () => void | Promise<void>;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export function LoginForm({
  onToggleMode,
  onSignedIn,
  title = 'Welcome back',
  description,
  submitLabel = 'Sign In',
}: LoginFormProps) {
  const {
    signIn,
    renderGoogleButton,
    getFacebookAccessToken,
    lookupGoogleAccount,
    lookupFacebookAccount,
    completeGoogleSignIn,
    completeFacebookSignIn,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingSocialCredential, setPendingSocialCredential] = useState<string | null>(null);
  const [pendingSocialProvider, setPendingSocialProvider] = useState<'google' | 'facebook' | null>(null);
  const [socialRoleDialogOpen, setSocialRoleDialogOpen] = useState(false);
  const { isIQOnlyMode } = useFeatureFlags();
  const [googleButtonReady, setGoogleButtonReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleButtonRefreshTimeoutRef = useRef<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleGoogleCredentialRef = useRef<(credential: string) => Promise<void>>();
  handleGoogleCredentialRef.current = async (credential: string) => {
    setError('');
    setLoading(true);
    try {
      const isIqOnlyFlow =
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem('cerebrolearn.user.intent') === 'iq-only';

      if (isIqOnlyFlow) {
        await completeGoogleSignIn(credential);
        if (onSignedIn) {
          await onSignedIn();
        }
        return;
      }

      const lookup = await lookupGoogleAccount(credential);
      if (lookup.exists) {
        await completeGoogleSignIn(credential);
        if (onSignedIn) {
          await onSignedIn();
        }
      } else {
        setPendingSocialCredential(credential);
        setPendingSocialProvider('google');
        setSocialRoleDialogOpen(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Google sign-in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshGoogleButtonRef = useRef<() => Promise<void>>();
  refreshGoogleButtonRef.current = async () => {
    if (!googleButtonRef.current) return;
    setGoogleButtonReady(false);
    await renderGoogleButton(googleButtonRef.current, (credential) => {
      void handleGoogleCredentialRef.current?.(credential);
    });
    setGoogleButtonReady(true);
  };

  // Initialize the Google button once on mount. google.accounts.id.initialize()
  // must only be called a single time per page load, so this intentionally
  // does not re-run when the AuthContext callbacks are recreated on re-render.
  useEffect(() => {
    let isMounted = true;

    const initializeGoogleButton = async () => {
      try {
        await refreshGoogleButtonRef.current?.();
      } catch (err) {
        if (isMounted) {
          setGoogleButtonReady(false);
          setError(
            err instanceof Error
              ? err.message
              : 'Google sign-in is unavailable right now.',
          );
        }
      }
    };

    void initializeGoogleButton();

    const scheduleGoogleButtonRefresh = () => {
      if (googleButtonRefreshTimeoutRef.current !== null) {
        window.clearTimeout(googleButtonRefreshTimeoutRef.current);
      }

      googleButtonRefreshTimeoutRef.current = window.setTimeout(() => {
        if (!isMounted) return;
        void initializeGoogleButton();
      }, 150);
    };

    const handleWindowFocus = () => {
      // Disable the button immediately so a click landing before the
      // debounced refresh completes can't hit the stale Google button.
      setGoogleButtonReady(false);
      scheduleGoogleButtonRefresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setGoogleButtonReady(false);
        scheduleGoogleButtonRefresh();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      if (googleButtonRefreshTimeoutRef.current !== null) {
        window.clearTimeout(googleButtonRefreshTimeoutRef.current);
      }
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);

    try {
      await signIn(email, password);
      if (onSignedIn) {
        await onSignedIn();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'learner' | 'instructor') => {
    setError('');
    setLoading(true);

    const demoEmail =
      role === 'learner'
        ? 'demo.learner@cerebrolearn.com'
        : 'demo.instructor@cerebrolearn.com';
    const demoPassword = 'demo123456';

    try {
      await signIn(demoEmail, demoPassword);
    } catch (err) {
      setError(
        `Demo account not found. Please sign up first or use your own credentials.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRoleChoice = async (role: 'learner' | 'instructor') => {
    if (!pendingSocialCredential || !pendingSocialProvider) return;

    setError('');
    setLoading(true);
    try {
      if (pendingSocialProvider === 'google') {
        await completeGoogleSignIn(pendingSocialCredential, role);
      } else {
        await completeFacebookSignIn(pendingSocialCredential, role);
      }
      setSocialRoleDialogOpen(false);
      setPendingSocialCredential(null);
      setPendingSocialProvider(null);
      if (onSignedIn) {
        await onSignedIn();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Social sign-in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRoleDialogChange = (open: boolean) => {
    if (loading) return;
    setSocialRoleDialogOpen(open);
    if (!open) {
      setPendingSocialCredential(null);
      setPendingSocialProvider(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const accessToken = await getFacebookAccessToken();
      const isIqOnlyFlow =
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem('cerebrolearn.user.intent') === 'iq-only';

      if (isIqOnlyFlow) {
        await completeFacebookSignIn(accessToken);
        if (onSignedIn) {
          await onSignedIn();
        }
        return;
      }

      const lookup = await lookupFacebookAccount(accessToken);
      if (lookup.exists) {
        await completeFacebookSignIn(accessToken);
        if (onSignedIn) {
          await onSignedIn();
        }
      } else {
        setPendingSocialCredential(accessToken);
        setPendingSocialProvider('facebook');
        setSocialRoleDialogOpen(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Facebook sign-in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isGoogleButtonDisabled = loading || !googleButtonReady;
  const effectiveDescription =
    description ??
    (isIQOnlyMode
      ? 'Sign in to access your IQ test dashboard'
      : 'Sign in to your account to continue learning');

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{effectiveDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email)
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`pl-9 ${fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p className='text-sm text-destructive'>{fieldErrors.email}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                }}
                className={`pl-9 pr-10 ${fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className='text-sm text-destructive'>{fieldErrors.password}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-12 gap-3'>
          <div className='col-span-6'>
            <div
              className={`relative h-9 overflow-hidden rounded-md border border-input bg-background shadow-sm transition-all ${
                isGoogleButtonDisabled ? 'opacity-60' : 'hover:border-primary/40 hover:shadow-md'
              }`}
            >
              <div
                className='flex h-full w-full items-center justify-center gap-2 px-3 text-sm font-medium text-foreground'
                aria-hidden='true'
              >
                <svg className='h-4 w-4 shrink-0' viewBox='0 0 24 24' aria-hidden='true'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                <span>Google</span>
              </div>

              <div
                ref={googleButtonRef}
                className='absolute inset-0 z-10 h-full w-full opacity-0'
              />

              {isGoogleButtonDisabled ? (
                <div className='absolute inset-0 z-20 cursor-not-allowed bg-background/50' />
              ) : null}
            </div>
          </div>
          <Button
            type='button'
            onClick={handleFacebookSignIn}
            disabled={loading}
            className='col-span-6 !bg-[#1877F2] !text-white shadow-sm hover:!bg-[#166fe5]'
          >
            <svg
              className='mr-2 h-4 w-4'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
            </svg>
            Facebook
          </Button>
        </div>
{!isIQOnlyMode &&
        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-background px-2 text-xs text-muted-foreground'>
              Try demo accounts
            </span>
          </div>
        </div>
}
{!isIQOnlyMode &&
        <div className='grid grid-cols-2 gap-3'>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={() => handleDemoLogin('learner')}
            disabled={loading}
          >
            Demo Learner
          </Button>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={() => handleDemoLogin('instructor')}
            disabled={loading}
          >
            Demo Instructor
          </Button>
        </div>
}
      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-muted-foreground'>
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            disabled={loading}
            className='text-primary hover:underline'
          >
            Sign up
          </button>
        </p>
      </CardFooter>

      <Dialog open={socialRoleDialogOpen} onOpenChange={handleSocialRoleDialogChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Choose your role</DialogTitle>
            <DialogDescription>
              How would you like to use this social account on CerebroLearn?
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-3'>
            <Button onClick={() => handleSocialRoleChoice('learner')} disabled={loading}>
              Continue as Learner
            </Button>
            <Button
              variant='outline'
              onClick={() => handleSocialRoleChoice('instructor')}
              disabled={loading}
            >
              Continue as Instructor
            </Button>
          </div>

          <p className='text-xs text-muted-foreground'>
            This applies when the social account is created here for the first time.
            Existing accounts keep their current role.
          </p>

          <DialogFooter>
            <Button
              type='button'
              variant='ghost'
              onClick={() => handleSocialRoleDialogChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
