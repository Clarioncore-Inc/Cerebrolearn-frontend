import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  educationApi,
  workExperienceApi,
  honorsApi,
  interestsApi,
  causesApi,
  cognitiveProfileApi,
  patentsApi,
  publicationsApi,
  projectsApi,
  testScoresApi,
} from '../../utils/api-client';
import type {
  Education,
  WorkExperience,
  Honor,
  Interest,
  Cause,
  CognitiveProfile,
  Patent,
  Publication,
  Project,
  TestScore,
} from '../../types/database';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Activity,
  User,
  Briefcase,
  Brain,
  Heart,
  Sparkles,
  Loader2,
  HandHeart,
  FileCheck2,
  BookOpen,
  FolderKanban,
  Trophy,
  ExternalLink,
  MapPin,
  Phone,
  Calendar,
  Mail,
  GraduationCap,
} from 'lucide-react';
import {
  MBTI_PROFILES,
  MBTI_FUNCTIONS,
  getCognitiveFunctionImagePath,
  getMBTITypeImagePath,
  type MBTIType,
} from '../../data/mbtiData';
import {
  ZODIAC_PROFILES,
  getZodiacAppearanceSummary,
  getZodiacSign,
} from '../../data/zodiacData';
import { INTELLIGENCE_TYPES, INTELLIGENCE_TYPE_KEYS } from '../../data/intelligenceTypesData';

export function ProfileView() {
  const { profile } = useAuth();

  const [educations, setEducations] = useState<Education[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile | null>(null);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testScores, setTestScores] = useState<TestScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.allSettled([
      educationApi.list().then(setEducations),
      workExperienceApi.list().then(setWorkExperiences),
      honorsApi.list().then(setHonors),
      interestsApi.list().then(setInterests),
      causesApi.list().then(setCauses),
      cognitiveProfileApi.get().then(setCognitiveProfile),
      patentsApi.list().then(setPatents),
      publicationsApi.list().then(setPublications),
      projectsApi.list().then(setProjects),
      testScoresApi.list().then(setTestScores),
    ]).finally(() => setLoading(false));
  }, [profile?.id]);

  if (!profile || loading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  const personality = profile.personality ?? '';
  const mbtiProfile =
    personality && MBTI_PROFILES[personality as MBTIType]
      ? MBTI_PROFILES[personality as MBTIType]
      : null;
  const zodiacSign = profile.date_of_birth ? getZodiacSign(profile.date_of_birth) : null;
  const zodiacProfile = zodiacSign ? ZODIAC_PROFILES[zodiacSign] : null;
  const headerAccent = personality || profile.role?.replace(/_/g, ' ') || 'Learner';
  const overviewStats = [
    { label: 'Education', value: educations.length },
    { label: 'Work', value: workExperiences.length },
    { label: 'Projects', value: projects.length },
    { label: 'Honors', value: honors.length },
  ];
  const topTabClassName =
    'rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';

  return (
    <div className='min-h-screen bg-muted/20'>
      <div className='mx-auto max-w-7xl px-0 pb-6 md:px-6 md:pb-8'>
        <div className='overflow-hidden rounded-3xl border bg-background shadow-sm'>
          <div className='relative h-56 overflow-hidden md:h-80'>
            {profile.cover_photo ? (
              <img
                src={profile.cover_photo}
                alt={`${profile.full_name || 'Profile'} cover`}
                className='absolute inset-0 h-full w-full object-cover'
              />
            ) : (
              <>
                <div className='absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500' />
                <div className='absolute inset-0 bg-black/20' />
              </>
            )}
          </div>

          <Tabs defaultValue='activity' className='gap-0'>
            <div className='relative px-4 pb-2 md:px-8'>
              <div className='relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-start md:gap-6'>
                <Avatar className='-mt-12 h-32 w-32 shrink-0 border-4 border-background shadow-xl md:-mt-16 md:h-40 md:w-40'>
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className='text-4xl'>
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className='min-w-0 space-y-2 pt-2 md:pt-6'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h1 className='text-3xl font-semibold leading-tight text-foreground md:text-4xl'>
                      {profile.full_name || 'Your Profile'}{' '}
                      <span className='font-normal text-primary/80'>({headerAccent})</span>
                    </h1>
                  </div>
                  <p className='text-base text-muted-foreground'>{profile.email}</p>
                  <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
                    <Badge variant='secondary' className='capitalize'>
                      <Sparkles className='mr-1 h-3 w-3' />
                      {profile.role?.replace(/_/g, ' ') || 'Learner'}
                    </Badge>
                    {profile.location && (
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-3.5 w-3.5' />
                        {profile.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='mt-6 overflow-x-auto border-t'>
                <TabsList className='h-auto min-w-max justify-start rounded-none bg-transparent p-0 text-muted-foreground'>
                  <TabsTrigger value='activity' className={topTabClassName}>
                    <Activity className='h-4 w-4' />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value='about' className={topTabClassName}>
                    <User className='h-4 w-4' />
                    About
                  </TabsTrigger>
                  <TabsTrigger value='education' className={topTabClassName}>
                    <GraduationCap className='h-4 w-4' />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value='work' className={topTabClassName}>
                    <Briefcase className='h-4 w-4' />
                    Work
                  </TabsTrigger>
                  <TabsTrigger value='personality' className={topTabClassName}>
                    <Brain className='h-4 w-4' />
                    Personality
                  </TabsTrigger>
                  <TabsTrigger value='intelligence' className={topTabClassName}>
                    <Sparkles className='h-4 w-4' />
                    Intelligence
                  </TabsTrigger>
                  <TabsTrigger value='research' className={topTabClassName}>
                    <FolderKanban className='h-4 w-4' />
                    Research &amp; Development
                  </TabsTrigger>
                  <TabsTrigger value='honors' className={topTabClassName}>
                    <Trophy className='h-4 w-4' />
                    Honors &amp; Awards
                  </TabsTrigger>
                  <TabsTrigger value='interests' className={topTabClassName}>
                    <Heart className='h-4 w-4' />
                    Interests
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className='px-4 py-6 md:px-8 md:py-8'>
              <TabsContent value='activity' className='space-y-6'>
                <div className='grid gap-4 md:grid-cols-4'>
                  {overviewStats.map((item) => (
                    <Card key={item.label}>
                      <CardContent className='p-5'>
                        <p className='text-sm text-muted-foreground'>{item.label}</p>
                        <p className='mt-2 text-3xl font-semibold'>{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Profile Summary</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {profile.bio || 'No profile summary added yet.'}
                    </p>
                    <div className='grid gap-4 md:grid-cols-3'>
                      <div className='rounded-xl border bg-muted/30 p-4'>
                        <p className='text-xs text-muted-foreground'>Patents</p>
                        <p className='text-xl font-semibold'>{patents.length}</p>
                      </div>
                      <div className='rounded-xl border bg-muted/30 p-4'>
                        <p className='text-xs text-muted-foreground'>Publications</p>
                        <p className='text-xl font-semibold'>{publications.length}</p>
                      </div>
                      <div className='rounded-xl border bg-muted/30 p-4'>
                        <p className='text-xs text-muted-foreground'>Test Scores</p>
                        <p className='text-xl font-semibold'>{testScores.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='about' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Email Address</p>
                      <p className='flex items-center gap-2 text-sm'>
                        <Mail className='h-4 w-4 text-primary' />
                        {profile.email || '—'}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Phone Number</p>
                      <p className='flex items-center gap-2 text-sm'>
                        <Phone className='h-4 w-4 text-primary' />
                        {profile.phone_number || '—'}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Location</p>
                      <p className='flex items-center gap-2 text-sm'>
                        <MapPin className='h-4 w-4 text-primary' />
                        {profile.location || '—'}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Date of Birth</p>
                      <p className='flex items-center gap-2 text-sm'>
                        <Calendar className='h-4 w-4 text-primary' />
                        {profile.date_of_birth || '—'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {profile.bio || 'No bio added yet.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='education' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {educations.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No education entries yet.</p>
                    ) : (
                      educations.map((item) => (
                        <div key={item.id} className='border-b pb-4 last:border-0 last:pb-0'>
                          <p className='font-medium'>{item.school}</p>
                          {(item.degree || item.field_of_study) && (
                            <p className='text-sm text-muted-foreground'>
                              {[item.degree, item.field_of_study].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {item.start_date || '—'} - {item.is_current ? 'Present' : item.end_date || '—'}
                          </p>
                          {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='work' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Briefcase className='h-4 w-4 text-primary' />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {workExperiences.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No work experience yet.</p>
                    ) : (
                      workExperiences.map((item) => (
                        <div key={item.id} className='border-b pb-4 last:border-0 last:pb-0'>
                          <p className='font-medium'>
                            {item.title ? `${item.title} · ` : ''}
                            {item.company}
                          </p>
                          {item.location && (
                            <p className='text-sm text-muted-foreground'>{item.location}</p>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {item.start_date || '—'} - {item.is_current ? 'Present' : item.end_date || '—'}
                          </p>
                          {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='personality' className='space-y-6'>
                {mbtiProfile ? (
                  <Card className='overflow-hidden'>
                    <CardContent className='p-0'>
                      <div className='flex flex-wrap items-center gap-3 p-6'>
                        <Brain className='h-5 w-5 text-primary' />
                        <h3 className='text-lg font-semibold'>{mbtiProfile.nickname}</h3>
                        <Badge variant='secondary'>{personality}</Badge>
                      </div>
                      <div className='space-y-6 border-t px-6 py-6'>
                        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
                          {mbtiProfile.stack.map((code) => {
                            const fn = MBTI_FUNCTIONS[code];
                            return (
                              <div key={code} className='space-y-3'>
                                <img
                                  src={getCognitiveFunctionImagePath(code)}
                                  alt={`${code} icon`}
                                  className='h-14 w-14 object-contain'
                                />
                                <div className='space-y-1.5'>
                                  <p className='text-sm font-semibold'>
                                    ({code}) {fn.name}
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    <span className='font-semibold text-foreground'>{fn.sublabel}:</span>{' '}
                                    {fn.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className='overflow-hidden rounded-xl border bg-muted/20'>
                          <img
                            src={getMBTITypeImagePath(personality as MBTIType)}
                            alt={`Illustration of ${personality}`}
                            className='h-auto w-full object-cover'
                          />
                        </div>
                        <div className='space-y-2'>
                          <h4 className='flex items-center gap-2 text-sm font-semibold'>
                            <Trophy className='h-4 w-4 text-primary' />
                            Personality Matchups
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {mbtiProfile.matchups.map((name) => (
                              <Badge key={name} variant='outline' className='py-1.5 text-sm'>
                                {name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className='p-6'>
                      <p className='text-sm text-muted-foreground'>No personality profile added yet.</p>
                    </CardContent>
                  </Card>
                )}

                {zodiacProfile && zodiacSign && (
                  <Card>
                    <CardContent className='space-y-3 p-6'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <h3 className='text-lg font-semibold'>
                          {zodiacSign} ({zodiacProfile.symbolName})
                        </h3>
                        <Badge variant='secondary'>{zodiacProfile.archetype}</Badge>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Badge variant='outline'>{zodiacProfile.element}</Badge>
                        <Badge variant='outline'>{zodiacProfile.modality}</Badge>
                        <Badge variant='outline'>Ruled by {zodiacProfile.rulingPlanet}</Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {getZodiacAppearanceSummary(zodiacSign, zodiacProfile)}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value='intelligence' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Intelligence Types &amp; IQ / Memory</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {INTELLIGENCE_TYPE_KEYS.map((key) => {
                        const meta = INTELLIGENCE_TYPES[key];
                        const Icon = meta.icon;
                        const score = cognitiveProfile?.[key] ?? 0;
                        return (
                          <div key={key} className='space-y-1.5'>
                            <div className='flex items-center gap-2 text-sm font-medium'>
                              <Icon className='h-4 w-4 text-primary' />
                              {meta.label}
                              <span className='ml-auto text-xs text-muted-foreground'>{score}/100</span>
                            </div>
                            <Progress value={score} />
                          </div>
                        );
                      })}
                    </div>
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Current IQ Estimate</p>
                        <p className='text-lg font-semibold'>{cognitiveProfile?.current_iq_estimate ?? '—'}</p>
                      </div>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Potential Max IQ</p>
                        <p className='text-lg font-semibold'>{cognitiveProfile?.potential_max_iq ?? '—'}</p>
                      </div>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Memory Level</p>
                        <p className='text-sm font-semibold'>{cognitiveProfile?.memory_level || '—'}</p>
                      </div>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Benchmark</p>
                        <p className='text-sm font-semibold'>{cognitiveProfile?.memory_benchmark || '—'}</p>
                        {cognitiveProfile?.memory_benchmark_proof_url && (
                          <a
                            href={cognitiveProfile.memory_benchmark_proof_url}
                            target='_blank'
                            rel='noreferrer'
                            className='flex items-center gap-1 text-xs text-primary'
                          >
                            Proof <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='research' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <FolderKanban className='h-4 w-4 text-primary' />
                      Research &amp; Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue='patents'>
                      <TabsList className='h-auto flex-wrap justify-start'>
                        <TabsTrigger value='patents'>
                          <FileCheck2 className='mr-2 h-4 w-4' />
                          Patents
                        </TabsTrigger>
                        <TabsTrigger value='publications'>
                          <BookOpen className='mr-2 h-4 w-4' />
                          Publications
                        </TabsTrigger>
                        <TabsTrigger value='projects'>
                          <FolderKanban className='mr-2 h-4 w-4' />
                          Projects
                        </TabsTrigger>
                        <TabsTrigger value='scores'>
                          <Trophy className='mr-2 h-4 w-4' />
                          Test Scores
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value='patents' className='space-y-3 pt-4'>
                        {patents.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No patents yet.</p>
                        ) : (
                          patents.map((item) => (
                            <div key={item.id} className='border-b pb-3 last:border-0 last:pb-0'>
                              <p className='font-medium'>{item.title}</p>
                              {(item.patent_number || item.issuing_office) && (
                                <p className='text-sm text-muted-foreground'>
                                  {[item.patent_number, item.issuing_office].filter(Boolean).join(' · ')}
                                </p>
                              )}
                              {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value='publications' className='space-y-3 pt-4'>
                        {publications.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No publications yet.</p>
                        ) : (
                          publications.map((item) => (
                            <div key={item.id} className='border-b pb-3 last:border-0 last:pb-0'>
                              <p className='font-medium'>{item.title}</p>
                              {(item.publisher || item.publication_date) && (
                                <p className='text-sm text-muted-foreground'>
                                  {[item.publisher, item.publication_date].filter(Boolean).join(' · ')}
                                </p>
                              )}
                              {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value='projects' className='space-y-3 pt-4'>
                        {projects.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No projects yet.</p>
                        ) : (
                          projects.map((item) => (
                            <div key={item.id} className='border-b pb-3 last:border-0 last:pb-0'>
                              <p className='font-medium'>
                                {item.role ? `${item.role} · ` : ''}
                                {item.title}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {item.start_date || '—'} - {item.is_current ? 'Present' : item.end_date || '—'}
                              </p>
                              {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value='scores' className='space-y-3 pt-4'>
                        {testScores.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No test scores yet.</p>
                        ) : (
                          testScores.map((item) => (
                            <div key={item.id} className='border-b pb-3 last:border-0 last:pb-0'>
                              <p className='font-medium'>{item.test_name}</p>
                              {(item.score || item.max_score) && (
                                <p className='text-sm text-muted-foreground'>
                                  Score: {item.score || '—'}
                                  {item.max_score ? ` / ${item.max_score}` : ''}
                                </p>
                              )}
                              {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='honors' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Trophy className='h-4 w-4 text-primary' />
                      Honors &amp; Awards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {honors.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No honors or awards yet.</p>
                    ) : (
                      honors.map((item) => (
                        <div key={item.id} className='border-b pb-4 last:border-0 last:pb-0'>
                          <p className='font-medium'>{item.title}</p>
                          {(item.issuer || item.date_awarded) && (
                            <p className='text-sm text-muted-foreground'>
                              {[item.issuer, item.date_awarded].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='interests' className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <HandHeart className='h-4 w-4 text-primary' />
                        Causes &amp; Philanthropy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {causes.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No causes added yet.</p>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {causes.map((item) => (
                            <Badge key={item.id} variant='secondary'>
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <Heart className='h-4 w-4 text-primary' />
                        Interests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {interests.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No interests added yet.</p>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {interests.map((item) => (
                            <Badge key={item.id} variant='secondary'>
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
