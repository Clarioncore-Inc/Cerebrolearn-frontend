import React, { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Download, FileText, User, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { formatIQTestType } from '../../utils/iqTestTypes';
import {
  buildIQCertificateId,
  calculateIQScoreFromCognitiveProfile,
  downloadIQCertificate,
  type IQCertificateCognitiveProfile,
  type IQCertificateData,
} from './IQCertificate';

export interface IQSessionCognitiveProfile {
  pattern_recognition?: number;
  working_memory?: number;
  processing_speed?: number;
  verbal_intelligence?: number;
  spatial_reasoning?: number;
}

export interface IQSessionCognitiveProfileNotes {
  pattern_recognition?: string;
  working_memory?: string;
  processing_speed?: string;
  verbal_intelligence?: string;
  spatial_reasoning?: string;
}

export interface IQSessionNotes {
  session_summary?: string;
  meeting_platform?: string;
  meeting_link?: string;
  homework_assigned?: string;
  follow_up_plan?: string;
  next_session_focus?: string;
  next_session_recommended?: boolean;
  cognitive_profile?: IQSessionCognitiveProfile | null;
  cognitive_profile_notes?: IQSessionCognitiveProfileNotes | null;
}

export interface IQSessionBooking {
  id: string;
  psychologistName: string;
  psychologistEmail: string;
  psychologistSpecialization?: string;
  psychologistSignatureImage?: string;
  studentEmail?: string;
  date: string;
  time: string;
  sessionType: string;
  testType?: string;
  certificateId?: string;
  status: string;
  createdAt?: string;
  price: number;
  rejectionReason?: string;
  sessionNotes?: IQSessionNotes | null;
}

interface IQSessionDetailPageProps {
  onNavigate: (page: string, data?: any) => void;
  booking: IQSessionBooking;
  initialSessionTab?: 'upcoming' | 'past';
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const hasVisibleResults = (notes?: IQSessionNotes | null) =>
  Boolean(
    notes?.cognitive_profile?.pattern_recognition != null ||
      notes?.cognitive_profile?.working_memory != null ||
      notes?.cognitive_profile?.processing_speed != null ||
      notes?.cognitive_profile?.verbal_intelligence != null ||
      notes?.cognitive_profile?.spatial_reasoning != null ||
      notes?.cognitive_profile_notes?.pattern_recognition ||
      notes?.cognitive_profile_notes?.working_memory ||
      notes?.cognitive_profile_notes?.processing_speed ||
      notes?.cognitive_profile_notes?.verbal_intelligence ||
      notes?.cognitive_profile_notes?.spatial_reasoning ||
    notes?.session_summary ||
      notes?.follow_up_plan ||
      notes?.homework_assigned ||
      notes?.next_session_focus,
  );

const getCognitiveProfileMetrics = (
  profile?: IQSessionCognitiveProfile | null,
  profileNotes?: IQSessionCognitiveProfileNotes | null,
) =>
  [
    {
      label: 'Pattern Recognition',
      value: profile?.pattern_recognition,
      note: profileNotes?.pattern_recognition,
    },
    {
      label: 'Working Memory',
      value: profile?.working_memory,
      note: profileNotes?.working_memory,
    },
    {
      label: 'Processing Speed',
      value: profile?.processing_speed,
      note: profileNotes?.processing_speed,
    },
    {
      label: 'Verbal Intelligence',
      value: profile?.verbal_intelligence,
      note: profileNotes?.verbal_intelligence,
    },
    {
      label: 'Spatial Reasoning',
      value: profile?.spatial_reasoning,
      note: profileNotes?.spatial_reasoning,
    },
  ].filter((metric) => typeof metric.value === 'number' || Boolean(metric.note));

const getCertificateEligibleProfile = (
  profile?: IQSessionCognitiveProfile | null,
): IQCertificateCognitiveProfile | null => {
  if (
    typeof profile?.pattern_recognition !== 'number' ||
    typeof profile?.working_memory !== 'number' ||
    typeof profile?.processing_speed !== 'number' ||
    typeof profile?.verbal_intelligence !== 'number' ||
    typeof profile?.spatial_reasoning !== 'number'
  ) {
    return null;
  }

  return {
    pattern_recognition: profile.pattern_recognition,
    working_memory: profile.working_memory,
    processing_speed: profile.processing_speed,
    verbal_intelligence: profile.verbal_intelligence,
    spatial_reasoning: profile.spatial_reasoning,
  };
};

const isAcknowledgedSession = (booking: IQSessionBooking) => booking.status !== 'pending';

export function IQSessionDetailPage({ onNavigate, booking, initialSessionTab = 'upcoming' }: IQSessionDetailPageProps) {
  const { user, profile } = useAuth();
  const statusLabel = booking.status === 'pending' ? 'Pending acknowledgement' : 'Acknowledged';
  const notes = booking.sessionNotes;
  const isAcknowledged = isAcknowledgedSession(booking);
  const cognitiveProfileMetrics = getCognitiveProfileMetrics(
    notes?.cognitive_profile,
    notes?.cognitive_profile_notes,
  );
  const certificateProfile = useMemo(
    () => getCertificateEligibleProfile(notes?.cognitive_profile),
    [notes?.cognitive_profile],
  );
  const officialIQScore = certificateProfile
    ? calculateIQScoreFromCognitiveProfile(certificateProfile)
    : null;
  const [isPreparingCertificate, setIsPreparingCertificate] = useState(false);
  const learnerName =
    profile?.full_name ??
    user?.full_name ??
    booking.studentEmail?.split('@')[0] ??
    'Learner';
  const certificateData: IQCertificateData | null =
    certificateProfile && officialIQScore != null
      ? {
          studentName: learnerName,
          psychologistName: booking.psychologistName || 'Psychologist',
          psychologistSpecialization:
            booking.psychologistSpecialization || 'Certified Psychologist',
          psychologistSignatureImage: booking.psychologistSignatureImage,
          iqScore: officialIQScore,
          cognitiveProfile: certificateProfile,
          certificateId: booking.certificateId || buildIQCertificateId(booking.id),
          testType: booking.testType,
          issuedAt: booking.createdAt ?? booking.date,
          assessmentDate: booking.date,
        }
      : null;

  const handleDownloadCertificate = async () => {
    if (!certificateData || isPreparingCertificate) return;

    const loadingToastId = toast.loading('Preparing your certificate...');
    setIsPreparingCertificate(true);

    try {
      await downloadIQCertificate(certificateData);
      toast.dismiss(loadingToastId);
      toast.success('Certificate download started. Check your browser downloads panel.');
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(
        error instanceof Error ? error.message : 'Unable to download certificate',
      );
    } finally {
      setIsPreparingCertificate(false);
    }
  };

  return (
    <div className='container max-w-5xl space-y-6 py-8'>
      <Button
        variant='ghost'
        onClick={() =>
          onNavigate('dashboard', {
            focusSection: 'sessions',
            initialSessionTab,
          })
        }
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <CardTitle className='text-2xl'>{booking.sessionType || 'IQ Session'}</CardTitle>
              <CardDescription>
                Review the session details and psychologist results for this IQ-user appointment.
              </CardDescription>
            </div>
            <Badge variant={booking.status === 'pending' ? 'outline' : 'secondary'}>{statusLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-2xl border p-4'>
            <p className='mb-3 text-sm font-semibold text-muted-foreground'>Psychologist</p>
            {isAcknowledged ? (
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2 font-medium'>
                  <User className='h-4 w-4 text-primary' />
                  {booking.psychologistName}
                </div>
                <p className='text-muted-foreground'>{booking.psychologistSpecialization || 'Certified Psychologist'}</p>
                <p className='text-muted-foreground'>{booking.psychologistEmail}</p>
              </div>
            ) : (
              <div className='relative overflow-hidden rounded-xl border border-dashed border-border/70 p-4'>
                <div className='space-y-2 text-sm blur-sm select-none'>
                  <div className='flex items-center gap-2 font-medium'>
                    <User className='h-4 w-4 text-primary' />
                    {booking.psychologistName || 'Assigned psychologist'}
                  </div>
                  <p className='text-muted-foreground'>{booking.psychologistSpecialization || 'Certified Psychologist'}</p>
                  <p className='text-muted-foreground'>{booking.psychologistEmail || 'psychologist@cerebrolearn.com'}</p>
                </div>
                <div className='absolute inset-0 flex items-center justify-center bg-background/70 px-4 text-center text-sm font-medium text-muted-foreground'>
                  Psychologist details will be visible once this session has been acknowledged.
                </div>
              </div>
            )}
          </div>

          <div className='rounded-2xl border p-4'>
            <p className='mb-3 text-sm font-semibold text-muted-foreground'>Session details</p>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-primary' />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-primary' />
                <span>{booking.time}</span>
              </div>
              <div className='flex items-center gap-2'>
                <FileText className='h-4 w-4 text-primary' />
                <span>{booking.sessionType}</span>
              </div>
              {booking.testType ? (
                <div className='flex items-center gap-2'>
                  <FileText className='h-4 w-4 text-primary' />
                  <span>{formatIQTestType(booking.testType)}</span>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-primary' />
            Psychologist Results
          </CardTitle>
          <CardDescription>
            Any completed feedback or follow-up notes from your psychologist will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {booking.rejectionReason ? (
            <div className='rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm'>
              <p className='font-semibold text-destructive'>Booking update</p>
              <p className='mt-2 text-muted-foreground'>{booking.rejectionReason}</p>
            </div>
          ) : null}

          {notes?.meeting_link ? (
            <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4'>
              <div>
                <p className='font-semibold'>Meeting link</p>
                <p className='text-sm text-muted-foreground'>Platform: {notes.meeting_platform || 'Shared by psychologist'}</p>
              </div>
              <Button onClick={() => window.open(notes.meeting_link, '_blank', 'noopener,noreferrer')}>
                <Video className='mr-2 h-4 w-4' />
                Open Meeting Link
              </Button>
            </div>
          ) : null}

          {certificateData ? (
            <div className='rounded-2xl border border-primary/20 bg-primary/5 p-4'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                  <p className='font-semibold'>Your official IQ certificate is ready</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Your psychologist has finalized your result. You can download your
                    certificate anytime from this page.
                  </p>
                </div>
                <div className='rounded-2xl bg-background px-4 py-3 text-center shadow-sm'>
                  <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
                    Official IQ Score
                  </p>
                  <p className='mt-1 text-3xl font-bold text-primary'>{officialIQScore}</p>
                </div>
              </div>
              <div className='mt-4'>
                <Button onClick={handleDownloadCertificate} disabled={isPreparingCertificate}>
                  <Download className='mr-2 h-4 w-4' />
                  {isPreparingCertificate ? 'Preparing Certificate...' : 'Download IQ Certificate'}
                </Button>
              </div>
            </div>
          ) : null}

          {cognitiveProfileMetrics.length ? (
            <div className='space-y-3'>
              <p className='font-semibold'>Cognitive profile analytics</p>
              <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-5'>
                {cognitiveProfileMetrics.map((metric) => (
                  <div key={metric.label} className='rounded-2xl border p-4 text-center'>
                    <p className='text-xs text-muted-foreground'>{metric.label}</p>
                    <p className='mt-2 text-2xl font-bold'>
                      {typeof metric.value === 'number' ? `${metric.value}%` : '—'}
                    </p>
                    {metric.note ? (
                      <p className='mt-2 text-xs text-muted-foreground'>{metric.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {hasVisibleResults(notes) ? (
            <div className='grid gap-4 md:grid-cols-2'>
              {notes?.session_summary ? (
                <div className='rounded-2xl border p-4 md:col-span-2'>
                  <p className='font-semibold'>Session summary</p>
                  <p className='mt-2 text-sm text-muted-foreground'>{notes.session_summary}</p>
                </div>
              ) : null}
              {notes?.follow_up_plan ? (
                <div className='rounded-2xl border p-4'>
                  <p className='font-semibold'>Follow-up plan</p>
                  <p className='mt-2 text-sm text-muted-foreground'>{notes.follow_up_plan}</p>
                </div>
              ) : null}
              {notes?.homework_assigned ? (
                <div className='rounded-2xl border p-4'>
                  <p className='font-semibold'>Recommended next steps</p>
                  <p className='mt-2 text-sm text-muted-foreground'>{notes.homework_assigned}</p>
                </div>
              ) : null}
              {notes?.next_session_focus ? (
                <div className='rounded-2xl border p-4 md:col-span-2'>
                  <p className='font-semibold'>Next session focus</p>
                  <p className='mt-2 text-sm text-muted-foreground'>{notes.next_session_focus}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed p-6 text-center'>
              <p className='font-semibold'>No results yet</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                Your psychologist has not added a session result or follow-up note for this booking yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}