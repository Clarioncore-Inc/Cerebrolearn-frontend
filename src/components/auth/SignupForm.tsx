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

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
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

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function SignupForm({ onToggleMode }: { onToggleMode: () => void }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('learner');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passwordStrength = password ? getPasswordStrength(password) : null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errors = validate(fullName, email, password, confirmPassword);
    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const errors = validate(fullName, email, password, confirmPassword);
    setFieldErrors(errors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await signUp(email, password, fullName, role);
      onToggleMode();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start your learning journey today</CardDescription>
      </CardHeader>
      <CardContent>
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

          {/* Confirm Password */}
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

          {/* Role */}
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

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex justify-center'>
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
