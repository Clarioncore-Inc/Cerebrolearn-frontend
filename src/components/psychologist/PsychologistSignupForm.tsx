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
  Upload,
  CheckCircle2,
  DollarSign,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';

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
  hourlyRate: string;
}

export function PsychologistSignupForm({
  onToggleMode,
  onBack,
}: {
  onToggleMode: () => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    hourlyRate: '',
  });

  const handleInputChange = (
    field: keyof PsychologistApplicationData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await psychologistApi.register({
        email: formData.email,
        full_name: formData.fullName,
        password: formData.password,
        hourly_rate: parseFloat(formData.hourlyRate) || 0,
        bio: formData.bio,
        license_number: formData.licenseNumber,
        years_of_experience: formData.yearsOfExperience,
        specialization: formData.specialization,
        about_you: formData.aboutYou,
        location: formData.location,
      });

      toast.success('Account created successfully!');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      toast.error('Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  const onboardingHighlights = [
    {
      title: 'Designed for licensed professionals',
      description:
        'Create your account now and complete credential verification from your dashboard.',
      icon: GraduationCap,
    },
    {
      title: 'Flexible consultation setup',
      description:
        'Set your rate, specialisation, and availability once your profile is ready.',
      icon: DollarSign,
    },
    {
      title: 'Secure, guided onboarding',
      description:
        'Upload qualifications, submit for review, and start accepting bookings after approval.',
      icon: Upload,
    },
  ];

  const nextSteps = [
    'Log in to your psychologist dashboard immediately after signup.',
    'Upload your qualifications and certifications to complete your profile.',
    'Submit your credentials for verification and review.',
    'Start accepting consultation bookings once approved.',
  ];

  const stepContextuals = [
    {
      icon: User,
      label: 'Step 1 · Personal',
      heading: 'Let\'s start with who you are.',
      body: 'Your name, email, and location help us create your account and place your practice on the map for nearby clients.',
    },
    {
      icon: ShieldCheck,
      label: 'Step 2 · Credentials',
      heading: 'Your credentials matter.',
      body: 'License number, specialization, and rate are used during our verification process and shown to clients browsing psychologists.',
    },
    {
      icon: Brain,
      label: 'Step 3 · Your Story',
      heading: 'Help clients connect with you.',
      body: 'A strong professional bio increases booking requests. Tell clients what you do, how you work, and what to expect in a session.',
    },
  ];

  const formSteps = [
    {
      title: 'Personal Information',
      icon: User,
    },
    {
      title: 'Professional Information',
      icon: GraduationCap,
    },
    {
      title: 'Professional Bio',
      icon: FileText,
    },
  ];

  const validateCurrentStep = () => {
    if (currentFormStep === 0) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.location) {
        setError('Please complete all personal information fields before continuing.');
        return false;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return false;
      }
    }

    if (currentFormStep === 1) {
      if (
        !formData.licenseNumber ||
        !formData.yearsOfExperience ||
        !formData.hourlyRate ||
        !formData.specialization
      ) {
        setError('Please complete all professional information fields before continuing.');
        return false;
      }
    }

    if (currentFormStep === 2) {
      if (!formData.bio || !formData.aboutYou) {
        setError('Please complete your professional bio before submitting.');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    setCurrentFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handlePreviousStep = () => {
    if (currentFormStep === 0) {
      onBack();
      return;
    }

    setError('');
    setCurrentFormStep((prev) => Math.max(prev - 1, 0));
  };

  if (step === 'success') {
    return (
      <div className='mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border bg-background/95 shadow-2xl shadow-primary/10 backdrop-blur'>
        <div className='grid gap-0 lg:grid-cols-[0.92fr_1.08fr]'>
          <div className='relative overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-primary via-primary/90 to-slate-950 p-8 text-white lg:rounded-l-[2rem] lg:rounded-tr-none lg:p-10'>
            <div className='absolute -left-14 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
            <div className='absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl' />
            <div className='relative space-y-6'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium'>
                <CheckCircle2 className='h-4 w-4' />
                Welcome to the network
              </div>
              <div>
                <h2 className='text-3xl font-semibold leading-tight'>
                  Your psychologist account is ready.
                </h2>
                <p className='mt-3 text-sm leading-6 text-white/80'>
                  You can sign in right away, complete your professional profile,
                  and submit your credentials for review.
                </p>
              </div>
              <div className='rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm'>
                <p className='text-sm font-semibold uppercase tracking-[0.22em] text-white/70'>
                  Next steps
                </p>
                <div className='mt-4 space-y-4'>
                  {nextSteps.map((stepText, index) => (
                    <div key={stepText} className='flex items-start gap-3'>
                      <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold'>
                        {index + 1}
                      </div>
                      <p className='text-sm leading-6 text-white/85'>{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Card className='rounded-none border-0 bg-transparent p-0 shadow-none'>
            <CardHeader className='border-b bg-background/80 text-center backdrop-blur-sm'>
              <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
                <CheckCircle2 className='h-8 w-8 text-primary' />
              </div>
              <CardTitle className='text-2xl font-semibold'>
                Account Created Successfully
              </CardTitle>
              <CardDescription className='mx-auto max-w-md text-base'>
                Welcome to CerebroLearn&apos;s psychologist network. Your account is active, and your verification journey starts now.
              </CardDescription>
            </CardHeader>
            <CardFooter className='flex flex-col gap-3 bg-background/80 backdrop-blur-sm'>
              <Button onClick={onToggleMode} className='w-full'>
                Go to Login
              </Button>
              <Button onClick={onBack} variant='outline' className='w-full'>
                Back to Signup Options
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border bg-background/95 shadow-2xl shadow-primary/10 backdrop-blur'>
      <div className='grid gap-0 lg:grid-cols-[0.9fr_1.1fr]'>
        <div className='relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-slate-950 p-8 text-white lg:p-10'>
          <div className='absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
          <div className='absolute bottom-0 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl' />
          <div className='relative flex h-full flex-col justify-between gap-8'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm'>
                <CheckCircle2 className='h-4 w-4' />
                Licensed psychologists only
              </div>

              <div className='space-y-4'>
                <h2 className='text-3xl font-semibold leading-tight lg:text-4xl'>
                  Build your practice on a platform clients can trust.
                </h2>
                <p className='max-w-xl text-sm leading-7 text-white/80 lg:text-base'>
                  Create your account, complete your profile, and join a verified
                  network of psychologists offering high-quality consultations
                  through CerebroLearn.
                </p>
              </div>

              <div className='rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm'>
                <div className='flex items-center gap-3'>
                  <div className='mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15'>
                    <User className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='font-medium text-white'>
                      Professional onboarding
                    </p>
                    <p className='mt-1 text-sm leading-6 text-white/75'>
                      Calm, guided, and verification-ready
                    </p>
                  </div>
                </div>

                <div className='mt-6 space-y-4'>
                  {onboardingHighlights.map(({ title, description, icon: Icon }) => (
                    <div key={title} className='flex items-start gap-3'>
                      <div className='mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div>
                        <p className='font-medium text-white'>{title}</p>
                        <p className='mt-1 text-sm leading-6 text-white/75'>
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Per-step contextual hint */}
            {(() => {
              const ctx = stepContextuals[currentFormStep];
              const CtxIcon = ctx.icon;
              return (
                <div className='rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm'>
                  <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/60'>
                    {ctx.label}
                  </p>
                  <div className='mt-3 flex items-start gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15'>
                      <CtxIcon className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold text-white'>{ctx.heading}</p>
                      <p className='mt-1 text-sm leading-6 text-white/75'>{ctx.body}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <Card className='rounded-none border-0 bg-transparent p-0 shadow-none'>
          <CardHeader className='border-b bg-background/80 backdrop-blur-sm pb-0'>
            {/* Thin progress bar */}
            <div className='h-1 w-full overflow-hidden rounded-full bg-border'>
              <div
                className='h-full rounded-full bg-primary transition-all duration-500'
                style={{
                  width: `${((currentFormStep + 1) / formSteps.length) * 100}%`,
                }}
              />
            </div>

            <div className='flex items-center justify-between gap-4 pt-4'>
              <Button
                type='button'
                onClick={handlePreviousStep}
                variant='ghost'
                className='px-0 text-muted-foreground hover:text-foreground'
              >
                ← {currentFormStep === 0 ? 'Back' : 'Previous'}
              </Button>
              <span className='text-xs font-medium text-muted-foreground'>
                Step {currentFormStep + 1} of {formSteps.length}
              </span>
            </div>

            <CardTitle className='text-2xl font-semibold lg:text-3xl'>
              Join as a Licensed Psychologist
            </CardTitle>
            <CardDescription className='max-w-xl text-base leading-7 pb-5'>
              Create your account to offer professional psychological consultations through CerebroLearn.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step progress indicator */}
              <div className='flex items-start'>
                {formSteps.map((formStep, index) => {
                  const isActive = index === currentFormStep;
                  const isCompleted = index < currentFormStep;
                  const isClickable = index <= currentFormStep;

                  return (
                    <React.Fragment key={formStep.title}>
                      <button
                        type='button'
                        onClick={() => {
                          if (isClickable) {
                            setError('');
                            setCurrentFormStep(index);
                          }
                        }}
                        disabled={!isClickable}
                        className='flex flex-col items-center gap-1.5'
                      >
                        <div
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
                        </div>
                        <span
                          className={`max-w-[72px] text-center text-xs font-medium leading-tight ${
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {formStep.title}
                        </span>
                      </button>

                      {index < formSteps.length - 1 && (
                        <div
                          className={`mx-2 mt-4 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                            index < currentFormStep ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {currentFormStep === 0 ? (
              <div className='space-y-5 rounded-2xl border bg-muted/20 p-6 md:p-7'>
                <div className='space-y-1 mb-4'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    <User className='h-5 w-5 text-primary' />
                    {formSteps[0].title}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {formSteps[0].description}
                  </p>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='fullName'>Full Name *</Label>
                    <Input
                      id='fullName'
                      type='text'
                      placeholder='Dr. Jane Smith'
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address *</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='jane.smith@example.com'
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className='pl-9'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password *</Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='password'
                        type='password'
                        placeholder='••••••••'
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className='pl-9'
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='location'>Location *</Label>
                    <div className='relative'>
                      <MapPin className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='location'
                        type='text'
                        placeholder='New York, NY'
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className='pl-9'
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              ) : null}

              {currentFormStep === 1 ? (
              <div className='space-y-5 rounded-2xl border bg-muted/20 p-6 md:p-7'>
                <div className='space-y-1 mb-4'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    <GraduationCap className='h-5 w-5 text-primary' />
                    {formSteps[1].title}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {formSteps[1].description}
                  </p>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='licenseNumber'>License Number *</Label>
                    <div className='relative'>
                      <FileText className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='licenseNumber'
                        type='text'
                        placeholder='PSY-12345'
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className='pl-9'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='yearsOfExperience'>Years of Experience *</Label>
                    <Select
                      value={formData.yearsOfExperience}
                      onValueChange={(value) => handleInputChange('yearsOfExperience', value)}
                      required
                    >
                      <SelectTrigger>
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

                  <div className='space-y-2'>
                    <Label htmlFor='hourlyRate'>Hourly Rate (USD) *</Label>
                    <div className='relative'>
                      <DollarSign className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='hourlyRate'
                        type='number'
                        placeholder='75'
                        min='0'
                        step='0.01'
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className='pl-9'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='specialization'>Specialization *</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleInputChange('specialization', value)}
                      required
                    >
                      <SelectTrigger>
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
                </div>
              </div>
              ) : null}

              {currentFormStep === 2 ? (
              <div className='space-y-5 rounded-2xl border bg-muted/20 p-6 md:p-7'>
                <div className='space-y-1 mb-4'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-primary' />
                    {formSteps[2].title}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {formSteps[2].description}
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='bio'>Professional Bio *</Label>
                  <Textarea
                    id='bio'
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    required
                    maxLength={1000}
                  />
                  <p className='text-xs text-muted-foreground'>
                    {formData.bio.length}/1000 characters
                  </p>
                </div>

                <div className='space-y-2 mt-4'>
                  <Label htmlFor='aboutYou'>About You *</Label>
                  <Textarea
                    id='aboutYou'
                    value={formData.aboutYou}
                    onChange={(e) => handleInputChange('aboutYou', e.target.value)}
                    rows={4}
                    required
                    maxLength={1000}
                  />
                  <p className='text-xs text-muted-foreground'>
                    {formData.aboutYou.length}/1000 characters
                  </p>
                </div>
              </div>
              ) : null}

              {currentFormStep === formSteps.length - 1 ? (
              <div className='rounded-2xl border bg-primary/5 p-6'>
                <p className='text-sm font-semibold uppercase tracking-[0.16em] text-primary'>
                  After creating your account
                </p>
                <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                  {nextSteps.map((stepText) => (
                    <div key={stepText} className='flex items-start gap-3 rounded-xl bg-background/70 p-3'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                      <p className='text-sm leading-6 text-muted-foreground'>
                        {stepText}
                      </p>
                    </div>
                  ))}
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
                  {currentFormStep === 0 ? 'Back' : 'Previous'}
                </Button>
                {currentFormStep < formSteps.length - 1 ? (
                  <Button type='button' className='flex-1' onClick={handleNextStep}>
                    Continue
                  </Button>
                ) : (
                  <Button type='submit' className='flex-1' disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <User className='mr-2 h-4 w-4' />
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className='justify-center border-t bg-background/80 backdrop-blur-sm'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <button
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
