import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Lock, User, Loader2, FileText, GraduationCap, MapPin, Upload, CheckCircle2 } from 'lucide-react';
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
  location: string;
}

export function PsychologistSignupForm({ onToggleMode, onBack }: { onToggleMode: () => void; onBack: () => void }) {
  const { signUp } = useAuth();
  const [step, setStep] = useState<'form' | 'success'>('form');
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
    location: '',
  });

  const handleInputChange = (field: keyof PsychologistApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create psychologist account with pending status
      await signUp(formData.email, formData.password, formData.fullName, 'psychologist_pending');
      
      // Store basic profile data in localStorage using email as key for easy lookup
      const psychologistProfile = {
        email: formData.email,
        fullName: formData.fullName,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        yearsOfExperience: formData.yearsOfExperience,
        bio: formData.bio,
        location: formData.location,
        createdAt: new Date().toISOString(),
        status: 'incomplete', // Profile is incomplete until qualifications are added
      };
      
      localStorage.setItem(`psychologist_profile_${formData.email}`, JSON.stringify(psychologistProfile));
      
      toast.success('Account created successfully!');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      toast.error('Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Account Created Successfully!</CardTitle>
          <CardDescription>
            Welcome to CerebroLearn's psychologist network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">1.</span>
                <span>Log in to your psychologist dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">2.</span>
                <span>Complete your profile by uploading your qualifications and certifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">3.</span>
                <span>Submit your credentials for verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">4.</span>
                <span>Once approved, you can start accepting consultation bookings</span>
              </li>
            </ul>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> You can log in now, but you won't be able to accept bookings until your credentials are verified.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={onToggleMode} className="w-full">
            Go to Login
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full">
            Back to Signup Options
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join as a Licensed Psychologist</CardTitle>
        <CardDescription>
          Create your account to provide professional psychological consultations through CerebroLearn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.smith@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-9"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="New York, NY"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="PSY-12345"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Select
                  value={formData.yearsOfExperience}
                  onValueChange={(value) => handleInputChange('yearsOfExperience', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="16+">16+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleInputChange('specialization', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinical">Clinical Psychology</SelectItem>
                    <SelectItem value="cognitive">Cognitive Psychology</SelectItem>
                    <SelectItem value="developmental">Developmental Psychology</SelectItem>
                    <SelectItem value="educational">Educational Psychology</SelectItem>
                    <SelectItem value="neuropsychology">Neuropsychology</SelectItem>
                    <SelectItem value="organizational">Organizational Psychology</SelectItem>
                    <SelectItem value="counseling">Counseling Psychology</SelectItem>
                    <SelectItem value="forensic">Forensic Psychology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Professional Bio
            </h3>

            <div className="space-y-2">
              <Label htmlFor="bio">About You *</Label>
              <Textarea
                id="bio"
                placeholder="Share your professional background, approach to therapy, areas of expertise, and what makes you passionate about helping others..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={6}
                required
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/1000 characters
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">After creating your account:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You'll be able to log in immediately</li>
              <li>• Complete your profile by uploading qualifications from your dashboard</li>
              <li>• Submit your credentials for verification</li>
              <li>• Start accepting bookings once approved</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}