import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  educationApi,
  workExperienceApi,
  honorsApi,
  interestsApi,
  causesApi,
  skillsApi,
  cognitiveProfileApi,
  patentsApi,
  publicationsApi,
  projectsApi,
  testScoresApi,
  discussionsApi,
  reviewsApi,
  mentoringApi,
  socialGraphApi,
  activityApi,
  type DiscussionPostRecord,
} from '../../utils/api-client';
import type {
  Education,
  WorkExperience,
  Honor,
  Interest,
  Cause,
  Skill,
  CognitiveProfile,
  Patent,
  Publication,
  Project,
  TestScore,
  Review,
  MentoringListing,
  FollowStatus,
  FollowUser,
  ActivityItem,
} from '../../types/database';
import { ActivityFeedList } from '../social/ActivityFeedList';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
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
  MessageSquare,
  Star,
  ThumbsUp,
  DollarSign,
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
  const navigate = useNavigate();

  const [educations, setEducations] = useState<Education[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile | null>(null);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testScores, setTestScores] = useState<TestScore[]>([]);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPostRecord[]>([]);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [mentoringListings, setMentoringListings] = useState<MentoringListing[]>([]);
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [listDialog, setListDialog] = useState<'followers' | 'following' | null>(null);
  const [listUsers, setListUsers] = useState<FollowUser[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [networkFeed, setNetworkFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    Promise.allSettled([
      educationApi.list().then(setEducations),
      workExperienceApi.list().then(setWorkExperiences),
      honorsApi.list().then(setHonors),
      interestsApi.list().then(setInterests),
      causesApi.list().then(setCauses),
      skillsApi.list().then(setSkills),
      cognitiveProfileApi.get().then(setCognitiveProfile),
      patentsApi.list().then(setPatents),
      publicationsApi.list().then(setPublications),
      projectsApi.list().then(setProjects),
      testScoresApi.list().then(setTestScores),
      discussionsApi.list({ user_id: profile.id }).then(setDiscussionPosts),
      reviewsApi.getForUser(profile.id).then(setCourseReviews),
      mentoringApi
        .listListings({ user_id: profile.id })
        .then(setMentoringListings),
      socialGraphApi.getStatus(profile.id).then(setFollowStatus),
      activityApi.getFeed().then(setNetworkFeed),
    ]).finally(() => setLoading(false));
  }, [profile?.id]);

  const openList = async (kind: 'followers' | 'following') => {
    if (!profile) return;
    setListDialog(kind);
    setListLoading(true);
    try {
      const users =
        kind === 'followers'
          ? await socialGraphApi.getFollowers(profile.id)
          : await socialGraphApi.getFollowing(profile.id);
      setListUsers(users || []);
    } catch {
      setListUsers([]);
    } finally {
      setListLoading(false);
    }
  };

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
  const panelClassName = 'rounded-2xl border bg-background/70 p-6 shadow-sm';
  const profileTabs = [
    { value: 'activity', label: 'Activity', icon: Activity },
    { value: 'about', label: 'About', icon: User },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'personality', label: 'Personality', icon: Brain },
    { value: 'intelligence', label: 'Intelligence', icon: Sparkles },
    { value: 'research', label: 'Research & Development', icon: FolderKanban },
    { value: 'honors', label: 'Honors & Awards', icon: Trophy },
    { value: 'interests', label: 'Interests', icon: Heart },
    { value: 'community', label: 'Community', icon: MessageSquare },
    { value: 'mentoring', label: 'Mentoring', icon: GraduationCap },
  ];

  return (
    <div className='min-h-screen bg-muted/20'>
      <div className='w-full px-0 pb-6 md:px-6 md:pb-8'>
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className='gap-0'>
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
                  {followStatus && (
                    <div className='flex items-center gap-4 text-sm'>
                      <button className='hover:underline' onClick={() => openList('followers')}>
                        <span className='font-semibold text-foreground'>
                          {followStatus.followers_count}
                        </span>{' '}
                        <span className='text-muted-foreground'>Followers</span>
                      </button>
                      <button className='hover:underline' onClick={() => openList('following')}>
                        <span className='font-semibold text-foreground'>
                          {followStatus.following_count}
                        </span>{' '}
                        <span className='text-muted-foreground'>Following</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 border-t pt-3'>
                <TabsList className='h-auto w-full flex-wrap justify-start rounded-none bg-transparent p-0 text-muted-foreground'>
                  {profileTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger key={tab.value} value={tab.value} className={topTabClassName}>
                        <Icon className='h-4 w-4' />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            <div className='px-4 py-6 md:px-8 md:py-8'>
              <TabsContent value='activity' className='space-y-6'>
                <div className='grid gap-4 md:grid-cols-4'>
                  {overviewStats.map((item) => (
                    <div key={item.label} className='rounded-xl border bg-background/70 p-5 shadow-sm'>
                        <p className='text-sm text-muted-foreground'>{item.label}</p>
                        <p className='mt-2 text-3xl font-semibold'>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className={`${panelClassName} space-y-6`}>
                  <div className='space-y-4'>
                    <h3 className='text-base font-semibold'>Profile Summary</h3>
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
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <Activity className='h-4 w-4 text-primary' />
                      Network Activity
                    </h3>
                    <ActivityFeedList
                      items={networkFeed}
                      emptyMessage='No activity yet. Follow other users to see their updates here.'
                      onNavigateProfile={(id) => navigate('/user-profile', { state: { userId: id } })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='about' className='space-y-6'>
                <div className={`${panelClassName} space-y-6`}>
                  <div className='space-y-4'>
                    <h3 className='text-base font-semibold'>Personal Information</h3>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Gender</p>
                      <p className='text-sm'>{profile.gender || '—'}</p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Birthplace</p>
                      <p className='text-sm'>{profile.birthplace || '—'}</p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Languages</p>
                      <p className='text-sm'>
                        {profile.languages && profile.languages.length > 0
                          ? profile.languages.join(', ')
                          : '—'}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Culture / Ethnicity</p>
                      <p className='text-sm'>{profile.culture || '—'}</p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>Official Title / License</p>
                      <p className='text-sm'>{profile.official_title || '—'}</p>
                    </div>
                    <div className='space-y-1 sm:col-span-2 lg:col-span-4'>
                      <p className='text-xs text-muted-foreground'>Licenses &amp; Certifications</p>
                      {profile.licenses_certifications && profile.licenses_certifications.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {profile.licenses_certifications.map((item) => (
                            <Badge key={item} variant='outline'>
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground'>—</p>
                      )}
                    </div>
                    </div>
                  </div>

                  <div className='space-y-3 border-t pt-6'>
                    <h3 className='text-base font-semibold'>About Me</h3>
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {profile.bio || 'No bio added yet.'}
                    </p>
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <ExternalLink className='h-4 w-4 text-primary' />
                      Social Links &amp; Websites
                    </h3>
                    {(() => {
                      const links: { label: string; url: string }[] = [];
                      if (profile.social_links?.website)
                        links.push({ label: 'Website', url: profile.social_links.website });
                      if (profile.social_links?.linkedin)
                        links.push({ label: 'LinkedIn', url: profile.social_links.linkedin });
                      if (profile.social_links?.twitter)
                        links.push({ label: 'Twitter / X', url: profile.social_links.twitter });
                      if (profile.social_links?.instagram)
                        links.push({ label: 'Instagram', url: profile.social_links.instagram });
                      if (profile.social_links?.facebook)
                        links.push({ label: 'Facebook', url: profile.social_links.facebook });
                      (profile.websites || []).forEach((url) => links.push({ label: url, url }));

                      return links.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>
                          No social links or websites added yet.
                        </p>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target='_blank'
                              rel='noreferrer'
                              className='flex items-center gap-1 text-sm text-primary'
                            >
                              {link.label} <ExternalLink className='h-3 w-3' />
                            </a>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
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
                {(mbtiProfile || (zodiacProfile && zodiacSign)) && (
                  <div className='overflow-hidden rounded-2xl border bg-background/70 shadow-sm'>
                    {mbtiProfile ? (
                      <div className='space-y-6 p-6'>
                        <div className='flex flex-wrap items-center gap-3'>
                        <Brain className='h-5 w-5 text-primary' />
                        <h3 className='text-lg font-semibold'>{mbtiProfile.nickname}</h3>
                        <Badge variant='secondary'>{personality}</Badge>
                      </div>
                      <div className='space-y-6 border-t pt-6'>
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
                      </div>
                    ) : (
                      <div className='p-6'>
                        <p className='text-sm text-muted-foreground'>No personality profile added yet.</p>
                      </div>
                    )}

                    {zodiacProfile && zodiacSign && (
                      <div className='space-y-6 border-t px-6 py-6'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h3 className='text-lg font-semibold'>
                            {zodiacSign} ({zodiacProfile.symbolName})
                          </h3>
                          <Badge variant='secondary'>{zodiacProfile.archetype}</Badge>
                          <Badge variant='outline'>{zodiacProfile.dateRangeLabel}</Badge>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <Badge variant='outline'>{zodiacProfile.element}</Badge>
                          <Badge variant='outline'>{zodiacProfile.modality}</Badge>
                          <Badge variant='outline'>Ruled by {zodiacProfile.rulingPlanet}</Badge>
                          <Badge variant='outline'>Influenced by {zodiacProfile.influencePlanet}</Badge>
                        </div>

                        <div className='flex items-start gap-4'>
                          <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border bg-muted/40 p-3'>
                            <img
                              src={`/assets/${zodiacSign.toLowerCase()}_symbol.png`}
                              alt={`${zodiacSign} symbol`}
                              className='max-h-full max-w-full object-contain'
                            />
                          </div>
                          <div className='space-y-2'>
                            <h4 className='text-base font-semibold'>General Physical Appearance</h4>
                            <p className='text-sm text-muted-foreground'>
                              {getZodiacAppearanceSummary(zodiacSign, zodiacProfile)}
                            </p>
                          </div>
                        </div>

                        <div className='space-y-3'>
                          <div className='overflow-hidden rounded-xl border bg-muted/20'>
                            <img
                              src={`/assets/${zodiacSign.toLowerCase()}.png`}
                              alt={`Illustration of ${zodiacSign}`}
                              className='h-auto w-full object-cover'
                            />
                          </div>
                          <p className='text-xs italic text-muted-foreground'>Image of a {zodiacSign}</p>
                        </div>

                        <div className='space-y-3'>
                          <h4 className='text-base font-semibold'>General Conscience &amp; Personality</h4>
                          {zodiacProfile.paragraphs.map((paragraph, index) => (
                            <p key={index} className='text-sm text-muted-foreground'>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                        <p className='text-xs text-muted-foreground'>Official IQ</p>
                        <p className='text-lg font-semibold'>{cognitiveProfile?.official_iq ?? '—'}</p>
                      </div>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Current IQ Estimate</p>
                        <p className='text-lg font-semibold'>{cognitiveProfile?.current_iq_estimate ?? '—'}</p>
                      </div>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Potential Max IQ</p>
                        <p className='text-lg font-semibold'>{cognitiveProfile?.potential_max_iq ?? '—'}</p>
                      </div>
                      <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                        <p className='text-xs text-muted-foreground'>Pi Digits Memorized</p>
                        <p className='text-lg font-semibold'>{cognitiveProfile?.pi_digits_memorized ?? '—'}</p>
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
                <div className={panelClassName}>
                  <div className='grid gap-6 xl:grid-cols-3'>
                    <div className='space-y-4'>
                      <h3 className='flex items-center gap-2 text-base font-semibold'>
                        <HandHeart className='h-4 w-4 text-primary' />
                        Causes &amp; Philanthropy
                      </h3>
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
                    </div>

                    <div className='space-y-4 border-t pt-6 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6'>
                      <h3 className='flex items-center gap-2 text-base font-semibold'>
                        <Heart className='h-4 w-4 text-primary' />
                        Interests
                      </h3>
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
                    </div>

                    <div className='space-y-4 border-t pt-6 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6'>
                      <h3 className='flex items-center gap-2 text-base font-semibold'>
                        <Sparkles className='h-4 w-4 text-primary' />
                        Skills &amp; Fields of Expertise
                      </h3>
                      {skills.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No skills added yet.</p>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {skills.map((item) => (
                            <Badge key={item.id} variant='secondary'>
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='community' className='space-y-6'>
                <div className={`${panelClassName} grid gap-8 md:grid-cols-2`}>
                  <div className='space-y-4'>
                    <h3 className='flex items-center gap-2 text-base font-semibold'>
                        <MessageSquare className='h-4 w-4 text-primary' />
                        Community Discussion
                    </h3>
                    <div className='space-y-4'>
                      {discussionPosts.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>
                          No discussion posts yet.
                        </p>
                      ) : (
                        discussionPosts.map((post) => (
                          <div key={post.id} className='rounded-lg border p-3 space-y-1'>
                            <div className='flex items-center justify-between gap-2'>
                              <p className='text-sm font-medium'>{post.title}</p>
                              <Badge variant='outline' className='capitalize text-xs'>
                                {post.category.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <p className='text-sm text-muted-foreground line-clamp-3'>
                              {post.content}
                            </p>
                            <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                              <span className='flex items-center gap-1'>
                                <ThumbsUp className='h-3 w-3' />
                                {post.like_count}
                              </span>
                              <span className='flex items-center gap-1'>
                                <MessageSquare className='h-3 w-3' />
                                {post.replies?.length ?? 0}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className='space-y-4 border-t pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8'>
                    <h3 className='flex items-center gap-2 text-base font-semibold'>
                        <Star className='h-4 w-4 text-primary' />
                        Community Reviews
                    </h3>
                    <div className='space-y-4'>
                      {courseReviews.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>
                          No reviews written yet.
                        </p>
                      ) : (
                        courseReviews.map((review) => (
                          <div key={review.id} className='rounded-lg border p-3 space-y-1'>
                            <div className='flex items-center gap-1'>
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-3.5 w-3.5 ${
                                    index < review.rating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.comment && (
                              <p className='text-sm text-muted-foreground'>{review.comment}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='mentoring' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                      Mentoring &amp; Tutoring Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {mentoringListings.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>
                        No mentoring listings yet.
                      </p>
                    ) : (
                      mentoringListings.map((item) => (
                        <div key={item.id} className='rounded-lg border p-3 space-y-1'>
                          <div className='flex items-center justify-between gap-2'>
                            <p className='text-sm font-medium'>{item.service_name}</p>
                            <Badge variant={item.is_active ? 'default' : 'secondary'}>
                              {item.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          {item.qualifications && (
                            <p className='text-sm text-muted-foreground'>
                              {item.qualifications}
                            </p>
                          )}
                          {item.approved_subjects && item.approved_subjects.length > 0 && (
                            <div className='flex flex-wrap gap-1 mt-1'>
                              {item.approved_subjects.map((subject) => (
                                <Badge key={subject} variant='outline' className='text-xs'>
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className='flex items-center gap-3 text-xs text-muted-foreground mt-1'>
                            {item.years_in_practice && (
                              <span>{item.years_in_practice} experience</span>
                            )}
                            {item.price != null && (
                              <span className='flex items-center gap-1'>
                                <DollarSign className='h-3 w-3' />
                                {item.price}
                              </span>
                            )}
                            <span>
                              ★ {item.average_rating.toFixed(1)} ({item.total_reviews} reviews)
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={listDialog !== null} onOpenChange={(open) => !open && setListDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{listDialog === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          </DialogHeader>
          <div className='max-h-96 space-y-2 overflow-y-auto'>
            {listLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              </div>
            ) : listUsers.length === 0 ? (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                {listDialog === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </p>
            ) : (
              listUsers.map((user) => (
                <button
                  key={user.id}
                  className='flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted/50'
                  onClick={() => {
                    setListDialog(null);
                    navigate('/user-profile', { state: { userId: user.id } });
                  }}
                >
                  <Avatar className='h-9 w-9'>
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>{user.full_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{user.full_name}</p>
                    <p className='truncate text-xs capitalize text-muted-foreground'>
                      {user.role?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
