import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';
import { cn } from '../ui/utils';

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface SignupSuccessPayload {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score === 3) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

function validate(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  requirePasswordConfirmation = true,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (!/^[A-Za-z\s'-]+$/.test(fullName.trim())) {
    errors.fullName =
      'Full name can only contain letters, spaces, hyphens, and apostrophes.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter.';
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'Password must contain at least one number.';
  }

  if (requirePasswordConfirmation) {
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  return errors;
}

interface SignupFormProps {
  onToggleMode: () => void;
  hideRoleSelection?: boolean;
  fixedRole?: string;
  simplified?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  onSignedUp?: () => void;
  onSignedUpWithCredentials?: (
    payload: SignupSuccessPayload,
  ) => void | Promise<void>;
  /**
   * When true, the form does NOT create the account immediately on submit.
   * Instead it only validates the fields and hands the credentials off via
   * `onSignedUpWithCredentials`, so the caller can defer account creation
   * (e.g. until after payment is confirmed).
   */
  skipAccountCreation?: boolean;
  /**
   * Shows Google/Facebook buttons. Social sign-in always creates (or signs
   * into) the account immediately, since there is no password to defer, so
   * it bypasses `skipAccountCreation` and reports success via
   * `onSocialAuthSuccess` instead of `onSignedUpWithCredentials`.
   */
  showSocialAuth?: boolean;
  onSocialAuthSuccess?: () => void | Promise<void>;
  /** Tightens the card's internal padding. Opt-in so other pages keep their spacing. */
  compact?: boolean;
}

export function SignupForm({
  onToggleMode,
  hideRoleSelection = false,
  fixedRole,
  simplified = false,
  title = 'Create your account',
  description,
  submitLabel = 'Create Account',
  onSignedUp,
  onSignedUpWithCredentials,
  skipAccountCreation = false,
  showSocialAuth = false,
  onSocialAuthSuccess,
  compact = false,
}: SignupFormProps) {
  const {
    signUp,
    getGoogleAccessToken,
    getFacebookAccessToken,
    lookupGoogleAccount,
    lookupFacebookAccount,
    completeGoogleSignIn,
    completeFacebookSignIn,
  } = useAuth();
  const { isIQOnlyMode } = useFeatureFlags();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState(isIQOnlyMode ? 'iq_user' : 'learner');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passwordStrength = password ? getPasswordStrength(password) : null;
  const requirePasswordConfirmation = !simplified;
  const showRoleSelection =
    !(hideRoleSelection || simplified) && !isIQOnlyMode;
  const effectiveFixedRole = isIQOnlyMode ? 'iq_user' : fixedRole;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errors = validate(
      fullName,
      email,
      password,
      confirmPassword,
      requirePasswordConfirmation,
    );
    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const errors = validate(
      fullName,
      email,
      password,
      confirmPassword,
      requirePasswordConfirmation,
    );
    setFieldErrors(errors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      ...(requirePasswordConfirmation ? { confirmPassword: true } : {}),
    });

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const selectedRole = effectiveFixedRole ?? role;
      if (!skipAccountCreation) {
        await signUp(email, password, fullName, selectedRole);
      }
      if (onSignedUpWithCredentials) {
        await onSignedUpWithCredentials({
          email,
          password,
          fullName,
          role: selectedRole,
        });
      } else if (onSignedUp) {
        onSignedUp();
      } else {
        onToggleMode();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const finishSocialAuth = async () => {
    if (onSocialAuthSuccess) {
      await onSocialAuthSuccess();
    } else if (onSignedUp) {
      onSignedUp();
    } else {
      onToggleMode();
    }
  };

  const handleGoogleSignUp = async () => {
    setSubmitError('');
    setLoading(true);
    try {
      const accessToken = await getGoogleAccessToken();
      const lookup = await lookupGoogleAccount(accessToken);
      if (lookup.exists) {
        await completeGoogleSignIn(accessToken);
      } else {
        await completeGoogleSignIn(accessToken, effectiveFixedRole ?? role);
      }
      await finishSocialAuth();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Google sign-up failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setSubmitError('');
    setLoading(true);
    try {
      const accessToken = await getFacebookAccessToken();
      const lookup = await lookupFacebookAccount(accessToken);
      if (lookup.exists) {
        await completeFacebookSignIn(accessToken);
      } else {
        await completeFacebookSignIn(accessToken, effectiveFixedRole ?? role);
      }
      await finishSocialAuth();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Facebook sign-up failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', compact && 'gap-4')}>
      <CardHeader className={cn(compact && 'px-5 pt-5')}>
        <CardTitle>{title}</CardTitle>

          <CardDescription>{description ? description: ''}</CardDescription>

      </CardHeader>
      <CardContent className={cn(compact && 'px-5')}>
        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          {submitError && (
            <Alert variant='destructive'>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Full Name */}
          <div className='space-y-1'>
            <Label htmlFor='fullName'>Full Name</Label>
            <div className='relative'>
              <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='fullName'
                type='text'
                placeholder='John Doe'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`pl-9 ${touched.fullName && fieldErrors.fullName ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
              />
            </div>
            {touched.fullName && fieldErrors.fullName && (
              <p className='text-xs text-destructive'>{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className='space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`pl-9 ${touched.email && fieldErrors.email ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
              />
            </div>
            {touched.email && fieldErrors.email && (
              <p className='text-xs text-destructive'>{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-1'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`pl-9 pr-9 ${touched.password && fieldErrors.password ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {touched.password && fieldErrors.password && (
              <p className='text-xs text-destructive'>{fieldErrors.password}</p>
            )}
            {passwordStrength && (
              <div className='space-y-1 pt-1'>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.score ? passwordStrength.color : 'bg-muted'}`}
                    />
                  ))}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Strength:{' '}
                  <span className='font-medium'>{passwordStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          {requirePasswordConfirmation && (
            <div className='space-y-1'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`pl-9 pr-9 ${touched.confirmPassword && fieldErrors.confirmPassword ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className='text-xs text-destructive'>
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {showRoleSelection && (
            <div className='space-y-1'>
              <Label htmlFor='role'>I want to</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='learner'>Learn (Student)</SelectItem>
                  <SelectItem value='instructor'>Teach (Instructor)</SelectItem>
                  <SelectItem value='org_admin'>
                    Manage Team (Organization Admin)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating account...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>

        {showSocialAuth && (
          <>
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
              <Button
                type='button'
                variant='outline'
                onClick={handleGoogleSignUp}
                disabled={loading}
                className='col-span-6'
              >
                <svg className='mr-2 h-4 w-4 shrink-0' viewBox='0 0 24 24' aria-hidden='true'>
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
                Google
              </Button>
              <Button
                type='button'
                onClick={handleFacebookSignUp}
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
          </>
        )}
      </CardContent>
      <CardFooter className={cn('flex justify-center', compact && 'px-5 pb-5')}>
        <p className='text-muted-foreground'>
          Already have an account?{' '}
          <button
            type='button'
            onClick={onToggleMode}
            className='text-primary hover:underline'
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
