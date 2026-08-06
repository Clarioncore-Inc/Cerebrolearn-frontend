import React, { useEffect, useRef, useState } from 'react';
import { rankingsApi, type DiscussionPostRecord } from '../../utils/api-client';
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
  PublicRankedProfile,
} from '../../types/database';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
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
  Calendar,
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

interface PublicProfileViewProps {
  userId: string;
}

// The public rankings payload (PublicRankedProfile) deliberately omits
// discussion posts, reviews and mentoring listings, so these tabs always
// render their empty state for a publicly viewed profile.
const EMPTY_DISCUSSION_POSTS: DiscussionPostRecord[] = [];
const EMPTY_REVIEWS: Review[] = [];
const EMPTY_MENTORING_LISTINGS: MentoringListing[] = [];

const PROFILE_TABS = [
  { value: 'about', label: 'About', icon: User },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'personality', label: 'Personality', icon: Sparkles },
  { value: 'intelligence', label: 'Intelligence', icon: Brain },
  { value: 'research', label: 'Research & Development', icon: FolderKanban },
  { value: 'honors', label: 'Honors', icon: Trophy },
  { value: 'interests', label: 'Causes & Interests', icon: Heart },
  { value: 'community', label: 'Community', icon: MessageSquare },
  { value: 'mentoring', label: 'Mentoring', icon: GraduationCap },
] as const;

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const [profile, setProfile] = useState<PublicRankedProfile | null>(null);
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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showFullMbtiDescription, setShowFullMbtiDescription] = useState(false);
  const [showFullZodiacDescription, setShowFullZodiacDescription] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllWork, setShowAllWork] = useState(false);
  const [showAllPatents, setShowAllPatents] = useState(false);
  const [showAllPublications, setShowAllPublications] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllScores, setShowAllScores] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setNotFound(false);
    rankingsApi
      .getPublicProfile(userId)
      .then((data) => {
        setProfile(data);
        setEducations(data.educations || []);
        setWorkExperiences(data.work_experiences || []);
        setHonors(data.honors || []);
        setInterests(data.interests || []);
        setCauses(data.causes || []);
        setSkills(data.skills || []);
        setCognitiveProfile(data.cognitive_profile || null);
        setPatents(data.patents || []);
        setPublications(data.publications || []);
        setProjects(data.projects || []);
        setTestScores(data.test_scores || []);
      })
      .catch(() => {
        setProfile(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [profile]);

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const activationLine = headerHeight + 140;
      let nextActiveTab = PROFILE_TABS[0].value;

      for (const tab of PROFILE_TABS) {
        const section = sectionRefs.current[tab.value];
        if (!(section instanceof HTMLElement)) continue;

        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= activationLine) {
          nextActiveTab = tab.value;
        } else {
          break;
        }
      }

      setActiveTab((currentTab) =>
        currentTab === nextActiveTab ? currentTab : nextActiveTab,
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [headerHeight]);

  useEffect(() => {
    setShowFullMbtiDescription(false);
    setShowFullZodiacDescription(false);
  }, [profile?.personality, profile?.date_of_birth]);

  useEffect(() => {
    setShowAllEducation(false);
    setShowAllWork(false);
    setShowAllPatents(false);
    setShowAllPublications(false);
    setShowAllProjects(false);
    setShowAllScores(false);
  }, [profile?.id]);

  if (loading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='flex flex-col items-center gap-2 py-24 text-center'>
        <p className='text-lg font-medium'>
          {notFound ? 'This profile is not available.' : 'Profile not found.'}
        </p>
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
  const aliasText =
    profile.aliases && profile.aliases.length > 0 ? profile.aliases.join(', ') : null;
  const headerAccent = aliasText || personality;
  const panelClassName =
    'rounded-2xl border border-border bg-background p-5 shadow-sm md:p-6';
  const discussionPosts = EMPTY_DISCUSSION_POSTS;
  const courseReviews = EMPTY_REVIEWS;
  const mentoringListings = EMPTY_MENTORING_LISTINGS;
  const navTopOffset = 96;
  const contentScrollOffset = headerHeight + 112;
  const sideTabClassName =
    'flex w-full shrink-0 items-center justify-start gap-2 rounded-xl px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors';
  const socialLinks: { label: string; url: string }[] = [];
  if (profile.social_links?.website)
    socialLinks.push({ label: 'Website', url: profile.social_links.website });
  if (profile.social_links?.linkedin)
    socialLinks.push({ label: 'LinkedIn', url: profile.social_links.linkedin });
  if (profile.social_links?.twitter)
    socialLinks.push({ label: 'Twitter / X', url: profile.social_links.twitter });
  if (profile.social_links?.instagram)
    socialLinks.push({ label: 'Instagram', url: profile.social_links.instagram });
  if (profile.social_links?.facebook)
    socialLinks.push({ label: 'Facebook', url: profile.social_links.facebook });
  (profile.websites || []).forEach((url) => socialLinks.push({ label: url, url }));

  const formatDateRange = (
    startDate?: string | null,
    endDate?: string | null,
    isCurrent?: boolean | null,
  ) => `${startDate || '—'} - ${isCurrent ? 'Present' : endDate || '—'}`;

  const topIntelligenceTypes = INTELLIGENCE_TYPE_KEYS.map((key) => ({
    key,
    label: INTELLIGENCE_TYPES[key].label,
    score: cognitiveProfile?.[key] ?? 0,
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const researchSummary = [
    { label: 'Patents', count: patents.length, latest: patents[0]?.title },
    { label: 'Publications', count: publications.length, latest: publications[0]?.title },
    { label: 'Projects', count: projects.length, latest: projects[0]?.title },
    { label: 'Test Scores', count: testScores.length, latest: testScores[0]?.test_name },
  ];
  const visibleEducations = educations.slice(0, showAllEducation ? educations.length : 2);
  const visibleWorkExperiences = workExperiences.slice(
    0,
    showAllWork ? workExperiences.length : 2,
  );
  const visiblePatents = patents.slice(0, showAllPatents ? patents.length : 2);
  const visiblePublications = publications.slice(
    0,
    showAllPublications ? publications.length : 2,
  );
  const visibleProjects = projects.slice(0, showAllProjects ? projects.length : 2);
  const visibleScores = testScores.slice(0, showAllScores ? testScores.length : 2);
  const visibleMbtiParagraphs = mbtiProfile?.paragraphs.slice(
    0,
    showFullMbtiDescription ? mbtiProfile.paragraphs.length : 1,
  );
  const visibleZodiacParagraphs = zodiacProfile?.paragraphs.slice(
    0,
    showFullZodiacDescription ? zodiacProfile.paragraphs.length : 1,
  );

  const setSectionRef =
    (sectionId: string) => (node: HTMLElement | null) => {
      sectionRefs.current[sectionId] = node;
    };

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (!section) return;

    const top = window.scrollY + section.getBoundingClientRect().top - contentScrollOffset;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    setActiveTab(sectionId);
  };

  return (
    <div className='min-h-screen bg-muted/20'>
      <div className='w-full px-0 pb-6 md:px-6 md:pb-8'>
        <div className='grid items-start gap-6 md:grid-cols-[240px_minmax(0,1fr)]'>
          <aside className='md:sticky' style={{ top: `${navTopOffset}px` }}>
            <div className='rounded-3xl border bg-background p-2 shadow-sm'>
              <div className='flex gap-1 overflow-x-auto md:flex-col md:overflow-visible'>
                {PROFILE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.value;

                  return (
                    <button
                      key={tab.value}
                      type='button'
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => scrollToSection(tab.value)}
                      className={`${sideTabClassName} ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className='min-w-0 space-y-6'>
            {/* Sticky header: cover image + avatar + profile info */}
            <div
              ref={headerRef}
              className='sticky top-20 z-30 overflow-hidden rounded-3xl border bg-background shadow-sm'
            >
              <div className='overflow-hidden bg-background'>
                <div className='relative h-40 overflow-hidden md:h-56'>
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

                <div className='relative flex flex-col items-start gap-4 px-4 pb-4 md:flex-row md:items-center md:gap-6 md:px-8'>
                  <Avatar className='-mt-10 h-24 w-24 shrink-0 border-4 border-background shadow-xl md:-mt-12 md:h-28 md:w-28'>
                    <AvatarImage src={profile.avatar || undefined} />
                    <AvatarFallback className='text-3xl'>
                      {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0 space-y-1.5'>
                    <h1 className='text-2xl font-semibold leading-tight text-foreground md:text-3xl'>
                      {profile.full_name || 'Profile'}{' '}
                      {headerAccent && (
                        <span className='font-normal text-primary/80'>({headerAccent})</span>
                      )}
                    </h1>
                    {profile.username && (
                      <p className='text-sm text-muted-foreground'>@{profile.username}</p>
                    )}
                    <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
                      {profile.location && (
                        <span className='flex items-center gap-1'>
                          <MapPin className='h-3.5 w-3.5' />
                          {profile.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='min-w-0 space-y-6'>
              <section
                id='about'
                ref={setSectionRef('about')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-6`}>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Profile Overview</h3>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
                    <h3 className='text-base font-semibold'>Education</h3>
                    {educations.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No education entries yet.</p>
                    ) : (
                      <div className='space-y-3'>
                        {educations.slice(0, 2).map((item) => (
                          <div key={item.id} className='space-y-1'>
                            <p className='text-sm font-medium'>{item.school}</p>
                            <p className='text-sm text-muted-foreground'>
                              {[item.degree, item.field_of_study].filter(Boolean).join(' · ') ||
                                'Education entry'}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {formatDateRange(item.start_date, item.end_date, item.is_current)}
                            </p>
                          </div>
                        ))}
                        {educations.length > 2 && (
                          <p className='text-xs text-muted-foreground'>
                            +{educations.length - 2} more education entries
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Work</h3>
                    {workExperiences.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No work experience yet.</p>
                    ) : (
                      <div className='space-y-3'>
                        {workExperiences.slice(0, 2).map((item) => (
                          <div key={item.id} className='space-y-1'>
                            <p className='text-sm font-medium'>
                              {item.title ? `${item.title} · ` : ''}
                              {item.company}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {formatDateRange(item.start_date, item.end_date, item.is_current)}
                            </p>
                            {item.description && (
                              <p className='text-sm text-muted-foreground line-clamp-2'>
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                        {workExperiences.length > 2 && (
                          <p className='text-xs text-muted-foreground'>
                            +{workExperiences.length - 2} more work entries
                          </p>
                        )}
                      </div>
                    )}
                    {skills.length > 0 && (
                      <div className='space-y-2'>
                        <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                          Skills &amp; Expertise
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {skills.slice(0, 8).map((item) => (
                            <Badge key={item.id} variant='secondary'>
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Personality</h3>
                    {mbtiProfile || (zodiacProfile && zodiacSign) ? (
                      <div className='space-y-3 text-sm text-muted-foreground'>
                        {mbtiProfile && (
                          <p>
                            <span className='font-medium text-foreground'>{personality}</span> ·{' '}
                            {mbtiProfile.nickname} with the {mbtiProfile.stack.join(' → ')} cognitive stack.
                          </p>
                        )}
                        {zodiacProfile && zodiacSign && (
                          <p>
                            <span className='font-medium text-foreground'>{zodiacSign}</span> ·{' '}
                            {zodiacProfile.archetype}, a {zodiacProfile.element.toLowerCase()} sign with{' '}
                            {zodiacProfile.modality.toLowerCase()} energy.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className='text-sm text-muted-foreground'>No personality profile added yet.</p>
                    )}
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Intelligence</h3>
                    {topIntelligenceTypes.length > 0 ? (
                      <>
                        <div className='flex flex-wrap gap-2'>
                          {topIntelligenceTypes.map((item) => (
                            <Badge key={item.key} variant='outline'>
                              {item.label}: {item.score}/100
                            </Badge>
                          ))}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Official IQ: {cognitiveProfile?.official_iq ?? '—'} · Current estimate:{' '}
                          {cognitiveProfile?.current_iq_estimate ?? '—'} · Potential max:{' '}
                          {cognitiveProfile?.potential_max_iq ?? '—'} · Memory level:{' '}
                          {cognitiveProfile?.memory_level || '—'}
                        </p>
                      </>
                    ) : (
                      <p className='text-sm text-muted-foreground'>No intelligence metrics added yet.</p>
                    )}
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Research &amp; Development</h3>
                    <div className='grid gap-3 md:grid-cols-2'>
                      {researchSummary.map((item) => (
                        <div key={item.label} className='space-y-1'>
                          <p className='text-sm font-medium'>
                            {item.label} <span className='text-muted-foreground'>({item.count})</span>
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {item.latest || `No ${item.label.toLowerCase()} added yet.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Honors</h3>
                    {honors.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No honors or awards yet.</p>
                    ) : (
                      <div className='space-y-2'>
                        {honors.slice(0, 3).map((item) => (
                          <p key={item.id} className='text-sm text-muted-foreground'>
                            <span className='font-medium text-foreground'>{item.title}</span>
                            {item.issuer ? ` · ${item.issuer}` : ''}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Causes &amp; Interests</h3>
                    <div className='space-y-3'>
                      <div>
                        <p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                          Causes
                        </p>
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
                      <div>
                        <p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                          Interests
                        </p>
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
                    </div>
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Community</h3>
                    <p className='text-sm text-muted-foreground'>
                      No communities yet.
                    </p>
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='text-base font-semibold'>Mentoring</h3>
                    <p className='text-sm text-muted-foreground'>
                      No mentoring yet.
                    </p>
                  </div>

                  <div className='space-y-4 border-t pt-6'>
                    <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <ExternalLink className='h-4 w-4 text-primary' />
                      Social Links &amp; Websites
                    </h3>
                    {socialLinks.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>
                        No social links or websites added yet.
                      </p>
                    ) : (
                      <div className='flex flex-wrap gap-2'>
                        {socialLinks.map((link) => (
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
                    )}
                  </div>
                </div>
              </section>

              <section
                id='education'
                ref={setSectionRef('education')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-4`}>
                  <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                      Education
                  </h3>
                  <div className='space-y-4'>
                    {educations.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No education entries yet.</p>
                    ) : (
                      <>
                        {visibleEducations.map((item) => (
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
                        ))}
                        {educations.length > 2 && (
                          <button
                            type='button'
                            onClick={() => setShowAllEducation((current) => !current)}
                            className='text-sm font-medium text-primary hover:underline'
                          >
                            {showAllEducation ? 'Show less' : `Show more (${educations.length - 2} more)`}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>

              <section
                id='work'
                ref={setSectionRef('work')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-4`}>
                  <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <Briefcase className='h-4 w-4 text-primary' />
                      Work Experience
                  </h3>
                  <div className='space-y-4'>
                    {workExperiences.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No work experience yet.</p>
                    ) : (
                      <>
                        {visibleWorkExperiences.map((item) => (
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
                        ))}
                        {workExperiences.length > 2 && (
                          <button
                            type='button'
                            onClick={() => setShowAllWork((current) => !current)}
                            className='text-sm font-medium text-primary hover:underline'
                          >
                            {showAllWork
                              ? 'Show less'
                              : `Show more (${workExperiences.length - 2} more)`}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className={panelClassName}>
                  <h3 className='flex items-center gap-2 text-base font-semibold'>
                    <Sparkles className='h-4 w-4 text-primary' />
                    Skills &amp; Fields of Expertise
                  </h3>
                  {skills.length === 0 ? (
                    <p className='mt-4 text-sm text-muted-foreground'>No skills added yet.</p>
                  ) : (
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {skills.map((item) => (
                        <Badge key={item.id} variant='secondary'>
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section
                id='personality'
                ref={setSectionRef('personality')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                {(mbtiProfile || (zodiacProfile && zodiacSign)) && (
                  <div className='overflow-hidden rounded-2xl border border-border bg-background shadow-sm'>
                    {mbtiProfile ? (
                      <div className='space-y-6 p-6'>
                        <div className='flex flex-wrap items-center gap-3'>
                        <Brain className='h-5 w-5 text-primary' />
                        <h3 className='text-lg font-semibold'>{mbtiProfile.nickname}</h3>
                        <Badge variant='secondary'>{personality}</Badge>
                      </div>
                      <div className='space-y-3'>
                        <h4 className='text-base font-semibold'>What {personality} means</h4>
                        {visibleMbtiParagraphs?.map((paragraph, index) => (
                          <p key={index} className='text-sm text-muted-foreground'>
                            {paragraph}
                          </p>
                        ))}
                        {mbtiProfile.paragraphs.length > 1 && (
                          <button
                            type='button'
                            onClick={() => setShowFullMbtiDescription((current) => !current)}
                            className='text-sm font-medium text-primary hover:underline'
                          >
                            {showFullMbtiDescription ? 'Show less' : 'Show more'}
                          </button>
                        )}
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
                          {visibleZodiacParagraphs?.map((paragraph, index) => (
                            <p key={index} className='text-sm text-muted-foreground'>
                              {paragraph}
                            </p>
                          ))}
                          {zodiacProfile.paragraphs.length > 1 && (
                            <button
                              type='button'
                              onClick={() => setShowFullZodiacDescription((current) => !current)}
                              className='text-sm font-medium text-primary hover:underline'
                            >
                              {showFullZodiacDescription ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section
                id='intelligence'
                ref={setSectionRef('intelligence')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-6`}>
                  <h3 className='text-base font-semibold'>Intelligence Types &amp; IQ / Memory</h3>
                  <div className='space-y-6'>
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
                  </div>
                </div>
              </section>

              <section
                id='research'
                ref={setSectionRef('research')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-4`}>
                  <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <FolderKanban className='h-4 w-4 text-primary' />
                      Research &amp; Development
                  </h3>
                  <div>
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
                          <>
                            {visiblePatents.map((item) => (
                              <div key={item.id} className='border-b pb-3 last:border-0 last:pb-0'>
                                <p className='font-medium'>{item.title}</p>
                                {(item.patent_number || item.issuing_office) && (
                                  <p className='text-sm text-muted-foreground'>
                                    {[item.patent_number, item.issuing_office].filter(Boolean).join(' · ')}
                                  </p>
                                )}
                                {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                              </div>
                            ))}
                            {patents.length > 2 && (
                              <button
                                type='button'
                                onClick={() => setShowAllPatents((current) => !current)}
                                className='text-sm font-medium text-primary hover:underline'
                              >
                                {showAllPatents ? 'Show less' : `Show more (${patents.length - 2} more)`}
                              </button>
                            )}
                          </>
                        )}
                      </TabsContent>

                      <TabsContent value='publications' className='space-y-3 pt-4'>
                        {publications.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No publications yet.</p>
                        ) : (
                          <>
                            {visiblePublications.map((item) => (
                              <div key={item.id} className='border-b pb-3 last:border-0 last:pb-0'>
                                <p className='font-medium'>{item.title}</p>
                                {(item.publisher || item.publication_date) && (
                                  <p className='text-sm text-muted-foreground'>
                                    {[item.publisher, item.publication_date].filter(Boolean).join(' · ')}
                                  </p>
                                )}
                                {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                              </div>
                            ))}
                            {publications.length > 2 && (
                              <button
                                type='button'
                                onClick={() => setShowAllPublications((current) => !current)}
                                className='text-sm font-medium text-primary hover:underline'
                              >
                                {showAllPublications
                                  ? 'Show less'
                                  : `Show more (${publications.length - 2} more)`}
                              </button>
                            )}
                          </>
                        )}
                      </TabsContent>

                      <TabsContent value='projects' className='space-y-3 pt-4'>
                        {projects.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No projects yet.</p>
                        ) : (
                          <>
                            {visibleProjects.map((item) => (
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
                            ))}
                            {projects.length > 2 && (
                              <button
                                type='button'
                                onClick={() => setShowAllProjects((current) => !current)}
                                className='text-sm font-medium text-primary hover:underline'
                              >
                                {showAllProjects ? 'Show less' : `Show more (${projects.length - 2} more)`}
                              </button>
                            )}
                          </>
                        )}
                      </TabsContent>

                      <TabsContent value='scores' className='space-y-3 pt-4'>
                        {testScores.length === 0 ? (
                          <p className='text-sm text-muted-foreground'>No test scores yet.</p>
                        ) : (
                          <>
                            {visibleScores.map((item) => (
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
                            ))}
                            {testScores.length > 2 && (
                              <button
                                type='button'
                                onClick={() => setShowAllScores((current) => !current)}
                                className='text-sm font-medium text-primary hover:underline'
                              >
                                {showAllScores ? 'Show less' : `Show more (${testScores.length - 2} more)`}
                              </button>
                            )}
                          </>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </section>

              <section
                id='honors'
                ref={setSectionRef('honors')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-4`}>
                  <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <Trophy className='h-4 w-4 text-primary' />
                      Honors &amp; Awards
                  </h3>
                  <div className='space-y-4'>
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
                  </div>
                </div>
              </section>

              <section
                id='interests'
                ref={setSectionRef('interests')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={panelClassName}>
                  <div className='grid gap-6 xl:grid-cols-2'>
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
                  </div>
                </div>
              </section>

              <section
                id='community'
                ref={setSectionRef('community')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
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
              </section>

              <section
                id='mentoring'
                ref={setSectionRef('mentoring')}
                style={{ scrollMarginTop: `${contentScrollOffset}px` }}
                className='space-y-6'
              >
                <div className={`${panelClassName} space-y-4`}>
                  <h3 className='flex items-center gap-2 text-base font-semibold'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                      Mentoring &amp; Tutoring Services
                  </h3>
                  <div className='space-y-4'>
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
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
