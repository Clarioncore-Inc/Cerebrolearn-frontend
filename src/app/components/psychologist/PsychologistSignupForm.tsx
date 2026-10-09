import React, { useState } from 'react';
import { psychologistApi } from '../../utils/api-client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
import {
  Mail,
  Lock,
  User,
  Loader2,
  FileText,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Eye,
  EyeOff,
  Briefcase,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';

// Allows letters (including accented), spaces, hyphens, apostrophes, and periods (e.g. "Dr.")
const FULL_NAME_REGEX = /^[\p{L}\s'\-.]+$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_TEXT_LENGTH = 1000;

interface PsychologistApplicationData {
  fullName: string;
  email: string;
  password: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: string;
  bio: string;
  aboutYou: string;
  location: string;
}

type FieldErrors = Partial<Record<keyof PsychologistApplicationData, string>>;

const formSteps = [
  {
    title: 'Personal',
    icon: User,
    heading: "Let's start with who you are.",
    body: 'Your name, email, and location help us create your account and place your practice on the map for nearby clients.',
  },
  {
    title: 'Credentials',
    icon: ShieldCheck,
    heading: 'Your credentials matter.',
    body: 'License number and specialization are used during our verification process and shown to clients browsing psychologists.',
  },
  {
    title: 'Your Story',
    icon: Brain,
    heading: 'Help clients connect with you.',
    body: 'Tell clients about your professional journey and a little about yourself, so they know who they will be working with.',
  },
];

const nextSteps = [
  'Log in to your psychologist dashboard.',
  'Upload your qualifications and certifications.',
  'Submit your credentials for verification.',
  'Start accepting bookings once approved.',
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className='text-xs text-destructive'>
      {message}
    </p>
  );
}

export function PsychologistSignupForm({
  onToggleMode,
  onBack,
  inviteToken,
}: {
  onToggleMode: () => void;
  onBack: () => void;
  inviteToken?: string;
}) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<PsychologistApplicationData>({
    fullName: '',
    email: '',
    password: '',
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: '',
    bio: '',
    aboutYou: '',
    location: '',
  });

  const isLastStep = currentFormStep === formSteps.length - 1;

  const handleInputChange = (
    field: keyof PsychologistApplicationData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Every field is required; the form uses custom validation (noValidate), so mark it for assistive tech.
  const fieldProps = (field: keyof PsychologistApplicationData) => ({
    'aria-required': true,
    'aria-invalid': fieldErrors[field] ? true : undefined,
    'aria-describedby': fieldErrors[field] ? `${field}-error` : undefined,
  });

  const validateCurrentStep = () => {
    const errors: FieldErrors = {};

    if (currentFormStep === 0) {
      const fullName = formData.fullName.trim();
      if (!fullName) {
        errors.fullName = 'Enter your full name.';
      } else if (!FULL_NAME_REGEX.test(fullName)) {
        errors.fullName = 'Use only letters, spaces, hyphens, apostrophes, or periods.';
      }

      if (!inviteToken) {
        const email = formData.email.trim();
        if (!email) {
          errors.email = 'Enter your email address.';
        } else if (!EMAIL_REGEX.test(email)) {
          errors.email = 'Enter a valid email address.';
        }
      }

      if (!formData.password) {
        errors.password = 'Create a password.';
      } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
      }

      if (!formData.location.trim()) {
        errors.location = 'Enter your location.';
      }
    }

    if (currentFormStep === 1) {
      if (!formData.licenseNumber.trim()) {
        errors.licenseNumber = 'Enter your license number.';
      }
      if (!formData.yearsOfExperience) {
        errors.yearsOfExperience = 'Select your years of experience.';
      }
      if (!formData.specialization) {
        errors.specialization = 'Select your specialization.';
      }
    }

    if (currentFormStep === 2) {
      if (!formData.bio.trim()) {
        errors.bio = 'Add your professional bio.';
      }
      if (!formData.aboutYou.trim()) {
        errors.aboutYou = 'Tell us a little about yourself.';
      }
    }

    setFieldErrors(errors);
    setError('');
    return Object.keys(errors).length === 0;
  };

  const submitApplication = async () => {
    setError('');
    setLoading(true);

    try {
      if (inviteToken) {
        await psychologistApi.acceptInvite({
          token: inviteToken,
          full_name: formData.fullName,
          password: formData.password,
          hourly_rate: 0,
          bio: formData.bio,
          license_number: formData.licenseNumber,
          years_of_experience: formData.yearsOfExperience,
          specialization: formData.specialization,
          about_you: formData.aboutYou,
          location: formData.location,
        });
      } else {
        await psychologistApi.register({
          email: formData.email,
          full_name: formData.fullName,
          password: formData.password,
          bio: formData.bio,
          license_number: formData.licenseNumber,
          years_of_experience: formData.yearsOfExperience,
          specialization: formData.specialization,
          about_you: formData.aboutYou,
          location: formData.location,
        });
      }

      toast.success('Account created successfully!');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      toast.error('Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  // Pressing Enter (or the primary button) continues to the next step, and submits on the last one.
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    if (!isLastStep) {
      setCurrentFormStep((prev) => prev + 1);
      return;
    }

    void submitApplication();
  };

  const goToStep = (index: number) => {
    setError('');
    setFieldErrors({});
    setCurrentFormStep(index);
  };

  const handlePreviousStep = () => {
    if (currentFormStep === 0) {
      onBack();
      return;
    }
    goToStep(currentFormStep - 1);
  };

  if (step === 'success') {
    return (
      <Card className='mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/10'>
        <CardHeader className='items-center text-center'>
          <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
            <CheckCircle2 className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-2xl font-semibold'>
            Your psychologist account is ready
          </CardTitle>
          <CardDescription className='mx-auto max-w-sm text-base'>
            Welcome to CerebroLearn&apos;s psychologist network. Here&apos;s what happens next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className='space-y-3'>
            {nextSteps.map((stepText, index) => (
              <li key={stepText} className='flex items-start gap-3'>
                <span className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
                  {index + 1}
                </span>
                <p className='pt-0.5 text-sm leading-6 text-muted-foreground'>{stepText}</p>
              </li>
            ))}
          </ol>
        </CardContent>
        <CardFooter>
          <Button onClick={onToggleMode} className='w-full'>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const activeStep = formSteps[currentFormStep];
  const ActiveStepIcon = activeStep.icon;

  return (
    <div className='mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border bg-background/95 shadow-2xl shadow-primary/10 backdrop-blur'>
      <div className='grid gap-0 lg:grid-cols-[0.85fr_1.15fr]'>

        {/* ── Left contextual panel (desktop) ── */}
        <div className='relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-slate-950 p-10 text-white lg:flex lg:flex-col'>
          <div className='absolute -left-14 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
          <div className='absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl' />

          <div className='relative flex flex-1 flex-col justify-between gap-10'>
            <div className='space-y-5'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15'>
                <ActiveStepIcon className='h-6 w-6' />
              </div>
              <div>
                <h2 className='text-2xl font-semibold leading-tight'>{activeStep.heading}</h2>
                <p className='mt-3 text-sm leading-6 text-white/80'>{activeStep.body}</p>
              </div>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-white/70'>
                After you sign up
              </p>
              <ol className='mt-4 space-y-3'>
                {nextSteps.map((stepText, index) => (
                  <li key={stepText} className='flex items-start gap-3'>
                    <span className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold'>
                      {index + 1}
                    </span>
                    <p className='text-sm leading-6 text-white/85'>{stepText}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <Card className='rounded-none border-0 bg-transparent shadow-none'>
          <CardHeader className='space-y-6'>
            <div>
              <CardTitle className='text-2xl font-semibold'>Create your psychologist account</CardTitle>
              <CardDescription className='mt-1.5 lg:hidden'>{activeStep.body}</CardDescription>
              <p className='mt-1.5 text-xs text-muted-foreground'>All fields are required.</p>
            </div>

            {/* Step indicator */}
            <ol className='flex items-start'>
              {formSteps.map((formStep, index) => {
                const isActive = index === currentFormStep;
                const isCompleted = index < currentFormStep;

                return (
                  <React.Fragment key={formStep.title}>
                    <li>
                      <button
                        type='button'
                        onClick={() => isCompleted && goToStep(index)}
                        disabled={!isCompleted}
                        aria-current={isActive ? 'step' : undefined}
                        className='flex flex-col items-center gap-1.5 disabled:cursor-default'
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                            isCompleted
                              ? 'border-primary bg-primary text-primary-foreground'
                              : isActive
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className='h-4 w-4' />
                          ) : (
                            <span className='text-xs font-bold'>{index + 1}</span>
                          )}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {formStep.title}
                        </span>
                      </button>
                    </li>

                    {index < formSteps.length - 1 && (
                      <li
                        aria-hidden='true'
                        className={`mx-2 mt-4 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                          index < currentFormStep ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </ol>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleFormSubmit} noValidate className='space-y-6'>
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {currentFormStep === 0 ? (
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='fullName'>Full name</Label>
                    <div className='relative'>
                      <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='fullName'
                        type='text'
                        autoComplete='name'
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value.replace(/[0-9]/g, ''))}
                        className='pl-9'
                        {...fieldProps('fullName')}
                      />
                    </div>
                    <FieldError id='fullName-error' message={fieldErrors.fullName} />
                  </div>

                  {!inviteToken && (
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email address</Label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='email'
                          type='email'
                          autoComplete='email'
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className='pl-9'
                          {...fieldProps('email')}
                        />
                      </div>
                      <FieldError id='email-error' message={fieldErrors.email} />
                    </div>
                  )}

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className='pl-9 pr-10'
                        {...fieldProps('password')}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
                      >
                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                    {fieldErrors.password ? (
                      <FieldError id='password-error' message={fieldErrors.password} />
                    ) : (
                      <p className='text-xs text-muted-foreground'>
                        At least {MIN_PASSWORD_LENGTH} characters.
                      </p>
                    )}
                  </div>

                  <div className={`space-y-2 ${inviteToken ? 'md:col-span-2' : ''}`}>
                    <Label htmlFor='location'>Location</Label>
                    <div className='relative'>
                      <MapPin className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='location'
                        type='text'
                        autoComplete='address-level2'
                        placeholder='California, USA'
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className='pl-9'
                        {...fieldProps('location')}
                      />
                    </div>
                    <FieldError id='location-error' message={fieldErrors.location} />
                  </div>
                </div>
              ) : null}

              {currentFormStep === 1 ? (
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <div className='space-y-2 md:col-span-2'>
                    <Label htmlFor='licenseNumber'>License number</Label>
                    <div className='relative'>
                      <FileText className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='licenseNumber'
                        type='text'
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className='pl-9'
                        {...fieldProps('licenseNumber')}
                      />
                    </div>
                    <FieldError id='licenseNumber-error' message={fieldErrors.licenseNumber} />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='yearsOfExperience'>Years of experience</Label>
                    <div className='relative'>
                      <Briefcase className='pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground' />
                      <Select
                        value={formData.yearsOfExperience}
                        onValueChange={(value) => handleInputChange('yearsOfExperience', value)}
                      >
                        <SelectTrigger id='yearsOfExperience' className='pl-9' {...fieldProps('yearsOfExperience')}>
                          <SelectValue placeholder='Select experience' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='0-2'>0-2 years</SelectItem>
                          <SelectItem value='3-5'>3-5 years</SelectItem>
                          <SelectItem value='6-10'>6-10 years</SelectItem>
                          <SelectItem value='11-15'>11-15 years</SelectItem>
                          <SelectItem value='16+'>16+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FieldError id='yearsOfExperience-error' message={fieldErrors.yearsOfExperience} />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='specialization'>Specialization</Label>
                    <div className='relative'>
                      <GraduationCap className='pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground' />
                      <Select
                        value={formData.specialization}
                        onValueChange={(value) => handleInputChange('specialization', value)}
                      >
                        <SelectTrigger id='specialization' className='pl-9' {...fieldProps('specialization')}>
                          <SelectValue placeholder='Select specialization' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='clinical'>Clinical Psychology</SelectItem>
                          <SelectItem value='cognitive'>Cognitive Psychology</SelectItem>
                          <SelectItem value='developmental'>Developmental Psychology</SelectItem>
                          <SelectItem value='educational'>Educational Psychology</SelectItem>
                          <SelectItem value='neuropsychology'>Neuropsychology</SelectItem>
                          <SelectItem value='organizational'>Organizational Psychology</SelectItem>
                          <SelectItem value='counseling'>Counseling Psychology</SelectItem>
                          <SelectItem value='forensic'>Forensic Psychology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FieldError id='specialization-error' message={fieldErrors.specialization} />
                  </div>
                </div>
              ) : null}

              {currentFormStep === 2 ? (
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='bio'>Professional bio</Label>
                    <p className='text-xs text-muted-foreground'>
                      Your professional life: where you have worked, what you did there, and your key achievements.
                    </p>
                    <Textarea
                      id='bio'
                      placeholder='e.g. I spent six years as a clinical psychologist at a teaching hospital, where I led the cognitive assessment unit…'
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={5}
                      maxLength={MAX_TEXT_LENGTH}
                      {...fieldProps('bio')}
                    />
                    <div className='flex items-start justify-between gap-3'>
                      <FieldError id='bio-error' message={fieldErrors.bio} />
                      <p className='ml-auto shrink-0 text-xs text-muted-foreground'>
                        {formData.bio.length}/{MAX_TEXT_LENGTH}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='aboutYou'>About you</Label>
                    <p className='text-xs text-muted-foreground'>
                      You as an individual: your hobbies, interests, and life outside work.
                    </p>
                    <Textarea
                      id='aboutYou'
                      placeholder='e.g. Outside work I enjoy hiking, playing chess, and volunteering at a local reading club…'
                      value={formData.aboutYou}
                      onChange={(e) => handleInputChange('aboutYou', e.target.value)}
                      rows={4}
                      maxLength={MAX_TEXT_LENGTH}
                      {...fieldProps('aboutYou')}
                    />
                    <div className='flex items-start justify-between gap-3'>
                      <FieldError id='aboutYou-error' message={fieldErrors.aboutYou} />
                      <p className='ml-auto shrink-0 text-xs text-muted-foreground'>
                        {formData.aboutYou.length}/{MAX_TEXT_LENGTH}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row'>
                <Button
                  type='button'
                  onClick={handlePreviousStep}
                  variant='outline'
                  className='flex-1'
                >
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back
                </Button>
                <Button type='submit' className='flex-1' disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating account…
                    </>
                  ) : isLastStep ? (
                    'Create account'
                  ) : (
                    <>
                      Continue
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className='justify-center border-t'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={onToggleMode}
                className='font-medium text-primary hover:underline'
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
