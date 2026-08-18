import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  sortByDateRangeDesc,
  sortBySingleDateDesc,
  isDateRangeValid,
  formatMonthYear,
  formatDateRange,
} from '../../utils/profileSort';
import {
  authApi,
  psychologistApi,
  storageApi,
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
  mentoringApi,
  discussionsApi,
  reviewsApi,
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
  MentoringListing,
  MentorSchedule,
  Review,
} from '../../types/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  User,
  GraduationCap,
  Briefcase,
  Brain,
  Award,
  Heart,
  Lock,
  Save,
  Camera,
  Loader2,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  HandHeart,
  FileCheck2,
  BookOpen,
  FolderKanban,
  Trophy,
  ExternalLink,
  Eye,
  Calendar,
  DollarSign,
  MessageSquare,
  Star,
  ThumbsUp,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  MBTI_PROFILES,
  MBTI_FUNCTIONS,
  MBTI_STACK_ROLE_LABELS,
  getCognitiveFunctionImagePath,
  getMBTITypeImagePath,
  type MBTIType,
} from '../../data/mbtiData';
import { MbtiIntroductionSection } from './MbtiIntroductionSection';
import { SkillsExpertiseIcon } from './SkillsExpertiseIcon';
import {
  ZODIAC_PROFILES,
  getZodiacAppearanceSummary,
  getZodiacSign,
} from '../../data/zodiacData';
import { INTELLIGENCE_TYPES, INTELLIGENCE_TYPE_KEYS } from '../../data/intelligenceTypesData';
import { Slider } from '../ui/slider';

interface ProfilePageProps {
  onNavigate?: (page: string, data?: any) => void;
}

interface ProfileFormData {
  full_name: string;
  username: string;
  aliases: string;
  email: string;
  phone_number: string;
  location: string;
  avatar: string;
  cover_photo: string;
  bio: string;
  date_of_birth: string;
  gender: string;
  birthplace: string;
  languages: string;
  culture: string;
  official_title: string;
  licenses_certifications: string;
  websites: string;
  social_links_website: string;
  social_links_linkedin: string;
  social_links_twitter: string;
  social_links_instagram: string;
  social_links_facebook: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const MBTI_OPTIONS = Object.keys(MBTI_PROFILES) as MBTIType[];

const parseTagList = (value: string): string[] | null => {
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : null;
};

const createProfileFormData = (profile: any): ProfileFormData => ({
  full_name: profile?.full_name ?? '',
  username: profile?.username ?? '',
  aliases: (profile?.aliases ?? []).join(', '),
  email: profile?.email ?? '',
  phone_number: profile?.phone_number ?? '',
  location: profile?.location ?? '',
  avatar: profile?.avatar ?? '',
  cover_photo: profile?.cover_photo ?? '',
  bio: profile?.bio ?? '',
  date_of_birth: profile?.date_of_birth ?? '',
  gender: profile?.gender ?? '',
  birthplace: profile?.birthplace ?? '',
  languages: (profile?.languages ?? []).join(', '),
  culture: profile?.culture ?? '',
  official_title: profile?.official_title ?? '',
  licenses_certifications: (profile?.licenses_certifications ?? []).join(', '),
  websites: (profile?.websites ?? []).join(', '),
  social_links_website: profile?.social_links?.website ?? '',
  social_links_linkedin: profile?.social_links?.linkedin ?? '',
  social_links_twitter: profile?.social_links?.twitter ?? '',
  social_links_instagram: profile?.social_links?.instagram ?? '',
  social_links_facebook: profile?.social_links?.facebook ?? '',
});

interface EducationFormState {
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

const emptyEducationForm: EducationFormState = {
  school: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
};

interface WorkFormState {
  company: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

const emptyWorkForm: WorkFormState = {
  company: '',
  title: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
};

interface HonorFormState {
  title: string;
  issuer: string;
  date_awarded: string;
  description: string;
}

const emptyHonorForm: HonorFormState = {
  title: '',
  issuer: '',
  date_awarded: '',
  description: '',
};

interface PatentFormState {
  title: string;
  patent_number: string;
  issuing_office: string;
  filing_date: string;
  grant_date: string;
  description: string;
  url: string;
}

const emptyPatentForm: PatentFormState = {
  title: '',
  patent_number: '',
  issuing_office: '',
  filing_date: '',
  grant_date: '',
  description: '',
  url: '',
};

interface PublicationFormState {
  title: string;
  publisher: string;
  publication_date: string;
  url: string;
  description: string;
}

const emptyPublicationForm: PublicationFormState = {
  title: '',
  publisher: '',
  publication_date: '',
  url: '',
  description: '',
};

interface ProjectFormState {
  title: string;
  role: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  url: string;
}

const emptyProjectForm: ProjectFormState = {
  title: '',
  role: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  url: '',
};

interface TestScoreFormState {
  test_name: string;
  score: string;
  max_score: string;
  test_date: string;
  description: string;
  proof_url: string;
}

const emptyTestScoreForm: TestScoreFormState = {
  test_name: '',
  score: '',
  max_score: '',
  test_date: '',
  description: '',
  proof_url: '',
};

interface MentoringListingFormState {
  service_name: string;
  qualifications: string;
  approved_subjects: string;
  examples_of_expertise: string;
  years_in_practice: string;
  policies: string;
  price: string;
  is_active: boolean;
}

const emptyMentoringListingForm: MentoringListingFormState = {
  service_name: '',
  qualifications: '',
  approved_subjects: '',
  examples_of_expertise: '',
  years_in_practice: '',
  policies: '',
  price: '',
  is_active: true,
};

type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const DAY_ORDER: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

interface MentorDayScheduleForm {
  enabled: boolean;
  start: string;
  end: string;
}

type MentorScheduleFormState = Record<DayKey, MentorDayScheduleForm>;

const defaultMentorScheduleForm = (): MentorScheduleFormState =>
  DAY_ORDER.reduce((acc, day) => {
    acc[day] = { enabled: day !== 'saturday' && day !== 'sunday', start: '10:00', end: '18:00' };
    return acc;
  }, {} as MentorScheduleFormState);

const createMentorScheduleForm = (
  schedule?: MentorSchedule | null,
): MentorScheduleFormState => {
  if (!schedule?.schedule) return defaultMentorScheduleForm();
  return DAY_ORDER.reduce((acc, day) => {
    const daySchedule = schedule.schedule[day];
    acc[day] = daySchedule
      ? { enabled: daySchedule.enabled, start: daySchedule.start, end: daySchedule.end }
      : { enabled: false, start: '10:00', end: '18:00' };
    return acc;
  }, {} as MentorScheduleFormState);
};

interface CognitiveProfileFormState {
  creative: number;
  logical_perceptual: number;
  analytical: number;
  existential: number;
  long_term_memory: number;
  implicit: number;
  linguistic: number;
  musical_rhythmic: number;
  intrapersonal: number;
  naturalistic: number;
  motivational: number;
  current_iq_estimate: string;
  potential_max_iq: string;
}

const emptyCognitiveProfileForm: CognitiveProfileFormState = {
  creative: 0,
  logical_perceptual: 0,
  analytical: 0,
  existential: 0,
  long_term_memory: 0,
  implicit: 0,
  linguistic: 0,
  musical_rhythmic: 0,
  intrapersonal: 0,
  naturalistic: 0,
  motivational: 0,
  current_iq_estimate: '',
  potential_max_iq: '',
};

const createCognitiveProfileForm = (
  profile?: CognitiveProfile | null,
): CognitiveProfileFormState => ({
  creative: profile?.creative ?? 0,
  logical_perceptual: profile?.logical_perceptual ?? 0,
  analytical: profile?.analytical ?? 0,
  existential: profile?.existential ?? 0,
  long_term_memory: profile?.long_term_memory ?? 0,
  implicit: profile?.implicit ?? 0,
  linguistic: profile?.linguistic ?? 0,
  musical_rhythmic: profile?.musical_rhythmic ?? 0,
  intrapersonal: profile?.intrapersonal ?? 0,
  naturalistic: profile?.naturalistic ?? 0,
  motivational: profile?.motivational ?? 0,
  current_iq_estimate: profile?.current_iq_estimate?.toString() ?? '',
  potential_max_iq: profile?.potential_max_iq?.toString() ?? '',
});

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { profile, refreshProfile } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(
    createProfileFormData(profile),
  );
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Personality
  const [personality, setPersonality] = useState<string>(profile?.personality ?? '');
  const [personalitySaving, setPersonalitySaving] = useState(false);
  const [personalityEditing, setPersonalityEditing] = useState(false);
  const [personalityExpanded, setPersonalityExpanded] = useState(false);

  // Zodiac
  const [zodiacExpanded, setZodiacExpanded] = useState(false);

  // Education
  const [educations, setEducations] = useState<Education[]>([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState<EducationFormState>(emptyEducationForm);

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [workLoading, setWorkLoading] = useState(false);
  const [workDialogOpen, setWorkDialogOpen] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workForm, setWorkForm] = useState<WorkFormState>(emptyWorkForm);

  // Honors & Awards
  const [honors, setHonors] = useState<Honor[]>([]);
  const [honorsLoading, setHonorsLoading] = useState(false);
  const [honorDialogOpen, setHonorDialogOpen] = useState(false);
  const [editingHonorId, setEditingHonorId] = useState<string | null>(null);
  const [honorForm, setHonorForm] = useState<HonorFormState>(emptyHonorForm);

  // Interests
  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  // Causes & Philanthropy
  const [causes, setCauses] = useState<Cause[]>([]);
  const [causesLoading, setCausesLoading] = useState(false);
  const [newCause, setNewCause] = useState('');

  // Skills & Fields of Expertise
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Cognitive Profile (11 Intelligence Types + IQ)
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile | null>(null);
  const [cognitiveProfileLoading, setCognitiveProfileLoading] = useState(false);
  const [cognitiveProfileSaving, setCognitiveProfileSaving] = useState(false);
  const [cognitiveProfileEditing, setCognitiveProfileEditing] = useState(false);
  const [cognitiveProfileForm, setCognitiveProfileForm] = useState<CognitiveProfileFormState>(
    emptyCognitiveProfileForm,
  );

  // Patents
  const [patents, setPatents] = useState<Patent[]>([]);
  const [patentsLoading, setPatentsLoading] = useState(false);
  const [patentDialogOpen, setPatentDialogOpen] = useState(false);
  const [editingPatentId, setEditingPatentId] = useState<string | null>(null);
  const [patentForm, setPatentForm] = useState<PatentFormState>(emptyPatentForm);

  // Publications
  const [publications, setPublications] = useState<Publication[]>([]);
  const [publicationsLoading, setPublicationsLoading] = useState(false);
  const [publicationDialogOpen, setPublicationDialogOpen] = useState(false);
  const [editingPublicationId, setEditingPublicationId] = useState<string | null>(null);
  const [publicationForm, setPublicationForm] = useState<PublicationFormState>(
    emptyPublicationForm,
  );

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(emptyProjectForm);

  // Test Scores
  const [testScores, setTestScores] = useState<TestScore[]>([]);
  const [testScoresLoading, setTestScoresLoading] = useState(false);
  const [testScoreDialogOpen, setTestScoreDialogOpen] = useState(false);
  const [editingTestScoreId, setEditingTestScoreId] = useState<string | null>(null);
  const [testScoreForm, setTestScoreForm] = useState<TestScoreFormState>(emptyTestScoreForm);

  // Mentoring Listings
  const [mentoringListings, setMentoringListings] = useState<MentoringListing[]>([]);
  const [mentoringListingsLoading, setMentoringListingsLoading] = useState(false);
  const [mentoringListingDialogOpen, setMentoringListingDialogOpen] = useState(false);
  const [editingMentoringListingId, setEditingMentoringListingId] = useState<string | null>(null);
  const [mentoringListingForm, setMentoringListingForm] = useState<MentoringListingFormState>(
    emptyMentoringListingForm,
  );

  // Mentor Availability Schedule
  const [mentorSchedule, setMentorSchedule] = useState<MentorSchedule | null>(null);
  const [mentorScheduleLoading, setMentorScheduleLoading] = useState(false);
  const [mentorScheduleSaving, setMentorScheduleSaving] = useState(false);
  const [mentorScheduleForm, setMentorScheduleForm] = useState<MentorScheduleFormState>(
    defaultMentorScheduleForm(),
  );

  // Community (Discussions & Reviews)
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPostRecord[]>([]);
  const [discussionPostsLoading, setDiscussionPostsLoading] = useState(false);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [courseReviewsLoading, setCourseReviewsLoading] = useState(false);

  useEffect(() => {
    setFormData(createProfileFormData(profile));
    setPersonality(profile?.personality ?? '');
  }, [profile]);

  useEffect(() => {
    if (!profile) return;

    setEducationLoading(true);
    educationApi
      .list()
      .then((data) => setEducations(sortByDateRangeDesc(data)))
      .catch((error) => console.error('Error loading education:', error))
      .finally(() => setEducationLoading(false));

    setWorkLoading(true);
    workExperienceApi
      .list()
      .then((data) => setWorkExperiences(sortByDateRangeDesc(data)))
      .catch((error) => console.error('Error loading work experience:', error))
      .finally(() => setWorkLoading(false));

    setHonorsLoading(true);
    honorsApi
      .list()
      .then((data) => setHonors(sortBySingleDateDesc(data)))
      .catch((error) => console.error('Error loading honors:', error))
      .finally(() => setHonorsLoading(false));

    setInterestsLoading(true);
    interestsApi
      .list()
      .then(setInterests)
      .catch((error) => console.error('Error loading interests:', error))
      .finally(() => setInterestsLoading(false));

    setCausesLoading(true);
    causesApi
      .list()
      .then(setCauses)
      .catch((error) => console.error('Error loading causes:', error))
      .finally(() => setCausesLoading(false));

    setSkillsLoading(true);
    skillsApi
      .list()
      .then(setSkills)
      .catch((error) => console.error('Error loading skills:', error))
      .finally(() => setSkillsLoading(false));

    setCognitiveProfileLoading(true);
    cognitiveProfileApi
      .get()
      .then((data) => {
        setCognitiveProfile(data);
        setCognitiveProfileForm(createCognitiveProfileForm(data));
      })
      .catch((error) => console.error('Error loading cognitive profile:', error))
      .finally(() => setCognitiveProfileLoading(false));

    setPatentsLoading(true);
    patentsApi
      .list()
      .then(setPatents)
      .catch((error) => console.error('Error loading patents:', error))
      .finally(() => setPatentsLoading(false));

    setPublicationsLoading(true);
    publicationsApi
      .list()
      .then(setPublications)
      .catch((error) => console.error('Error loading publications:', error))
      .finally(() => setPublicationsLoading(false));

    setProjectsLoading(true);
    projectsApi
      .list()
      .then(setProjects)
      .catch((error) => console.error('Error loading projects:', error))
      .finally(() => setProjectsLoading(false));

    setTestScoresLoading(true);
    testScoresApi
      .list()
      .then(setTestScores)
      .catch((error) => console.error('Error loading test scores:', error))
      .finally(() => setTestScoresLoading(false));

    setMentoringListingsLoading(true);
    mentoringApi
      .listMyListings()
      .then(setMentoringListings)
      .catch((error) => console.error('Error loading mentoring listings:', error))
      .finally(() => setMentoringListingsLoading(false));

    setMentorScheduleLoading(true);
    mentoringApi
      .getOwnSchedule()
      .then((data) => {
        setMentorSchedule(data);
        setMentorScheduleForm(createMentorScheduleForm(data));
      })
      .catch(() => {
        // No schedule created yet; keep defaults
      })
      .finally(() => setMentorScheduleLoading(false));

    setDiscussionPostsLoading(true);
    discussionsApi
      .list({ user_id: profile.id })
      .then(setDiscussionPosts)
      .catch((error) => console.error('Error loading discussion posts:', error))
      .finally(() => setDiscussionPostsLoading(false));

    setCourseReviewsLoading(true);
    reviewsApi
      .getForUser(profile.id)
      .then(setCourseReviews)
      .catch((error) => console.error('Error loading course reviews:', error))
      .finally(() => setCourseReviewsLoading(false));
  }, [profile?.id]);

  const handleUpdate = async () => {
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email address is required');
      return;
    }

    setLoading(true);
    try {
      const socialLinks: Record<string, string> = {};
      if (formData.social_links_website.trim()) socialLinks.website = formData.social_links_website.trim();
      if (formData.social_links_linkedin.trim()) socialLinks.linkedin = formData.social_links_linkedin.trim();
      if (formData.social_links_twitter.trim()) socialLinks.twitter = formData.social_links_twitter.trim();
      if (formData.social_links_instagram.trim()) socialLinks.instagram = formData.social_links_instagram.trim();
      if (formData.social_links_facebook.trim()) socialLinks.facebook = formData.social_links_facebook.trim();

      await authApi.updateProfile({
        full_name: formData.full_name.trim(),
        username: formData.username.trim() || null,
        aliases: parseTagList(formData.aliases),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim() || null,
        location: formData.location.trim() || null,
        avatar: formData.avatar.trim() || null,
        cover_photo: formData.cover_photo.trim() || null,
        bio: formData.bio.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender.trim() || null,
        birthplace: formData.birthplace.trim() || null,
        languages: parseTagList(formData.languages),
        culture: formData.culture.trim() || null,
        official_title: formData.official_title.trim() || null,
        licenses_certifications: parseTagList(formData.licenses_certifications),
        websites: parseTagList(formData.websites),
        social_links: Object.keys(socialLinks).length ? socialLinks : null,
      });

      if (
        profile?.role === 'psychologist' ||
        profile?.role === 'psychologist_pending'
      ) {
        await psychologistApi.updateProfile({
          user: {
            avatar: formData.avatar.trim() || undefined,
            phone_number: formData.phone_number.trim() || undefined,
            location: formData.location.trim() || undefined,
          },
        });
      }

      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileFieldChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile photo must be smaller than 5 MB');
      event.target.value = '';
      return;
    }

    setAvatarUploading(true);

    try {
      const startedUpload = await storageApi.start({
        file_type: 'image',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });

      const uploadFormData = new FormData();
      Object.entries(startedUpload.fields || {}).forEach(([key, value]) => {
        uploadFormData.append(key, value);
      });
      uploadFormData.append('file', file);

      const uploadResponse = await fetch(startedUpload.url, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => '');
        throw new Error(
          `Storage upload failed with status ${uploadResponse.status}${errorText ? `: ${errorText}` : ''}`,
        );
      }

      const finishedUpload = await storageApi.finish(startedUpload.id);
      setFormData((current) => ({ ...current, avatar: finishedUpload.url }));
      await authApi.updateProfile({ avatar: finishedUpload.url });
      await refreshProfile();
      toast.success('Profile photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload profile photo',
      );
    } finally {
      setAvatarUploading(false);
      event.target.value = '';
    }
  };

  const handleCoverPhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover photo must be smaller than 5 MB');
      event.target.value = '';
      return;
    }

    setCoverUploading(true);

    try {
      const startedUpload = await storageApi.start({
        file_type: 'image',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });

      const uploadFormData = new FormData();
      Object.entries(startedUpload.fields || {}).forEach(([key, value]) => {
        uploadFormData.append(key, value);
      });
      uploadFormData.append('file', file);

      const uploadResponse = await fetch(startedUpload.url, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => '');
        throw new Error(
          `Storage upload failed with status ${uploadResponse.status}${errorText ? `: ${errorText}` : ''}`,
        );
      }

      const finishedUpload = await storageApi.finish(startedUpload.id);
      setFormData((current) => ({ ...current, cover_photo: finishedUpload.url }));
      await authApi.updateProfile({ cover_photo: finishedUpload.url });
      await refreshProfile();
      toast.success('Cover photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading cover photo:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload cover photo',
      );
    } finally {
      setCoverUploading(false);
      event.target.value = '';
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please complete all password fields');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update password',
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Personality
  const handleSavePersonality = async (value: string) => {
    setPersonality(value);
    setPersonalitySaving(true);
    try {
      await authApi.updateProfile({ personality: value });
      await refreshProfile();
      toast.success('Personality updated');
      setPersonalityEditing(false);
      setPersonalityExpanded(false);
    } catch (error) {
      console.error('Error updating personality:', error);
      toast.error('Failed to update personality');
    } finally {
      setPersonalitySaving(false);
    }
  };

  // Education handlers
  const openEducationDialog = (item?: Education) => {
    if (item) {
      setEditingEducationId(item.id);
      setEducationForm({
        school: item.school,
        degree: item.degree ?? '',
        field_of_study: item.field_of_study ?? '',
        start_date: item.start_date ?? '',
        end_date: item.end_date ?? '',
        is_current: item.is_current,
        description: item.description ?? '',
      });
    } else {
      setEditingEducationId(null);
      setEducationForm(emptyEducationForm);
    }
    setEducationDialogOpen(true);
  };

  const handleSaveEducation = async () => {
    if (!educationForm.school.trim()) {
      toast.error('School is required');
      return;
    }
    if (
      !educationForm.is_current &&
      !isDateRangeValid(educationForm.start_date, educationForm.end_date)
    ) {
      toast.error('Start date cannot be after end date');
      return;
    }
    try {
      const payload = {
        school: educationForm.school.trim(),
        degree: educationForm.degree.trim() || null,
        field_of_study: educationForm.field_of_study.trim() || null,
        start_date: educationForm.start_date.trim() || null,
        end_date: educationForm.is_current ? null : educationForm.end_date.trim() || null,
        is_current: educationForm.is_current,
        description: educationForm.description.trim() || null,
      };
      if (editingEducationId) {
        const updated = await educationApi.update(editingEducationId, payload);
        setEducations((current) =>
          sortByDateRangeDesc(
            current.map((item) => (item.id === editingEducationId ? updated : item)),
          ),
        );
        toast.success('Education updated');
      } else {
        const created = await educationApi.create(payload);
        setEducations((current) => sortByDateRangeDesc([created, ...current]));
        toast.success('Education added');
      }
      setEducationDialogOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete this education entry? This action cannot be undone.')) return;
    try {
      await educationApi.delete(id);
      setEducations((current) => current.filter((item) => item.id !== id));
      toast.success('Education removed');
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  };

  // Work experience handlers
  const openWorkDialog = (item?: WorkExperience) => {
    if (item) {
      setEditingWorkId(item.id);
      setWorkForm({
        company: item.company,
        title: item.title ?? '',
        location: item.location ?? '',
        start_date: item.start_date ?? '',
        end_date: item.end_date ?? '',
        is_current: item.is_current,
        description: item.description ?? '',
      });
    } else {
      setEditingWorkId(null);
      setWorkForm(emptyWorkForm);
    }
    setWorkDialogOpen(true);
  };

  const handleSaveWork = async () => {
    if (!workForm.company.trim()) {
      toast.error('Company is required');
      return;
    }
    if (!workForm.is_current && !isDateRangeValid(workForm.start_date, workForm.end_date)) {
      toast.error('Start date cannot be after end date');
      return;
    }
    try {
      const payload = {
        company: workForm.company.trim(),
        title: workForm.title.trim() || null,
        location: workForm.location.trim() || null,
        start_date: workForm.start_date.trim() || null,
        end_date: workForm.is_current ? null : workForm.end_date.trim() || null,
        is_current: workForm.is_current,
        description: workForm.description.trim() || null,
      };
      if (editingWorkId) {
        const updated = await workExperienceApi.update(editingWorkId, payload);
        setWorkExperiences((current) =>
          sortByDateRangeDesc(
            current.map((item) => (item.id === editingWorkId ? updated : item)),
          ),
        );
        toast.success('Work experience updated');
      } else {
        const created = await workExperienceApi.create(payload);
        setWorkExperiences((current) => sortByDateRangeDesc([created, ...current]));
        toast.success('Work experience added');
      }
      setWorkDialogOpen(false);
    } catch (error) {
      console.error('Error saving work experience:', error);
      toast.error('Failed to save work experience');
    }
  };

  const handleDeleteWork = async (id: string) => {
    if (!confirm('Delete this work experience? This action cannot be undone.')) return;
    try {
      await workExperienceApi.delete(id);
      setWorkExperiences((current) => current.filter((item) => item.id !== id));
      toast.success('Work experience removed');
    } catch (error) {
      console.error('Error deleting work experience:', error);
      toast.error('Failed to delete work experience');
    }
  };

  // Honors handlers
  const openHonorDialog = (item?: Honor) => {
    if (item) {
      setEditingHonorId(item.id);
      setHonorForm({
        title: item.title,
        issuer: item.issuer ?? '',
        date_awarded: item.date_awarded ?? '',
        description: item.description ?? '',
      });
    } else {
      setEditingHonorId(null);
      setHonorForm(emptyHonorForm);
    }
    setHonorDialogOpen(true);
  };

  const handleSaveHonor = async () => {
    if (!honorForm.title.trim()) {
      toast.error('Title is required');
      return;
    }
    try {
      const payload = {
        title: honorForm.title.trim(),
        issuer: honorForm.issuer.trim() || null,
        date_awarded: honorForm.date_awarded.trim() || null,
        description: honorForm.description.trim() || null,
      };
      if (editingHonorId) {
        const updated = await honorsApi.update(editingHonorId, payload);
        setHonors((current) =>
          sortBySingleDateDesc(
            current.map((item) => (item.id === editingHonorId ? updated : item)),
          ),
        );
        toast.success('Honor updated');
      } else {
        const created = await honorsApi.create(payload);
        setHonors((current) => sortBySingleDateDesc([created, ...current]));
        toast.success('Honor added');
      }
      setHonorDialogOpen(false);
    } catch (error) {
      console.error('Error saving honor:', error);
      toast.error('Failed to save honor');
    }
  };

  const handleDeleteHonor = async (id: string) => {
    if (!confirm('Delete this honor? This action cannot be undone.')) return;
    try {
      await honorsApi.delete(id);
      setHonors((current) => current.filter((item) => item.id !== id));
      toast.success('Honor removed');
    } catch (error) {
      console.error('Error deleting honor:', error);
      toast.error('Failed to delete honor');
    }
  };

  // Interests handlers
  const handleAddInterest = async () => {
    const name = newInterest.trim();
    if (!name) return;
    try {
      const created = await interestsApi.create({ name });
      setInterests((current) => [...current, created]);
      setNewInterest('');
    } catch (error) {
      console.error('Error adding interest:', error);
      toast.error('Failed to add interest');
    }
  };

  const handleDeleteInterest = async (id: string) => {
    try {
      await interestsApi.delete(id);
      setInterests((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting interest:', error);
      toast.error('Failed to delete interest');
    }
  };

  // Causes & Philanthropy handlers
  const handleAddCause = async () => {
    const name = newCause.trim();
    if (!name) return;
    try {
      const created = await causesApi.create({ name });
      setCauses((current) => [...current, created]);
      setNewCause('');
    } catch (error) {
      console.error('Error adding cause:', error);
      toast.error('Failed to add cause');
    }
  };

  const handleDeleteCause = async (id: string) => {
    try {
      await causesApi.delete(id);
      setCauses((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting cause:', error);
      toast.error('Failed to delete cause');
    }
  };

  // Skills & Fields of Expertise handlers
  const handleAddSkill = async () => {
    const name = newSkill.trim();
    if (!name) return;
    try {
      const created = await skillsApi.create({ name });
      setSkills((current) => [...current, created]);
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await skillsApi.delete(id);
      setSkills((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  // Cognitive Profile handlers
  const handleSaveCognitiveProfile = async () => {
    setCognitiveProfileSaving(true);
    try {
      const payload = {
        creative: cognitiveProfileForm.creative,
        logical_perceptual: cognitiveProfileForm.logical_perceptual,
        analytical: cognitiveProfileForm.analytical,
        existential: cognitiveProfileForm.existential,
        long_term_memory: cognitiveProfileForm.long_term_memory,
        implicit: cognitiveProfileForm.implicit,
        linguistic: cognitiveProfileForm.linguistic,
        musical_rhythmic: cognitiveProfileForm.musical_rhythmic,
        intrapersonal: cognitiveProfileForm.intrapersonal,
        naturalistic: cognitiveProfileForm.naturalistic,
        motivational: cognitiveProfileForm.motivational,
        current_iq_estimate: cognitiveProfileForm.current_iq_estimate
          ? Number(cognitiveProfileForm.current_iq_estimate)
          : null,
        potential_max_iq: cognitiveProfileForm.potential_max_iq
          ? Number(cognitiveProfileForm.potential_max_iq)
          : null,

      };
      const updated = await cognitiveProfileApi.update(payload);
      setCognitiveProfile(updated);
      setCognitiveProfileForm(createCognitiveProfileForm(updated));
      toast.success('Cognitive profile updated');
      setCognitiveProfileEditing(false);
    } catch (error) {
      console.error('Error updating cognitive profile:', error);
      toast.error('Failed to update cognitive profile');
    } finally {
      setCognitiveProfileSaving(false);
    }
  };

  // Patents handlers
  const openPatentDialog = (item?: Patent) => {
    if (item) {
      setEditingPatentId(item.id);
      setPatentForm({
        title: item.title,
        patent_number: item.patent_number ?? '',
        issuing_office: item.issuing_office ?? '',
        filing_date: item.filing_date ?? '',
        grant_date: item.grant_date ?? '',
        description: item.description ?? '',
        url: item.url ?? '',
      });
    } else {
      setEditingPatentId(null);
      setPatentForm(emptyPatentForm);
    }
    setPatentDialogOpen(true);
  };

  const handleSavePatent = async () => {
    if (!patentForm.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!isDateRangeValid(patentForm.filing_date, patentForm.grant_date)) {
      toast.error('Filing date cannot be after grant date');
      return;
    }
    try {
      const payload = {
        title: patentForm.title.trim(),
        patent_number: patentForm.patent_number.trim() || null,
        issuing_office: patentForm.issuing_office.trim() || null,
        filing_date: patentForm.filing_date.trim() || null,
        grant_date: patentForm.grant_date.trim() || null,
        description: patentForm.description.trim() || null,
        url: patentForm.url.trim() || null,
      };
      if (editingPatentId) {
        const updated = await patentsApi.update(editingPatentId, payload);
        setPatents((current) =>
          current.map((item) => (item.id === editingPatentId ? updated : item)),
        );
        toast.success('Patent updated');
      } else {
        const created = await patentsApi.create(payload);
        setPatents((current) => [created, ...current]);
        toast.success('Patent added');
      }
      setPatentDialogOpen(false);
    } catch (error) {
      console.error('Error saving patent:', error);
      toast.error('Failed to save patent');
    }
  };

  const handleDeletePatent = async (id: string) => {
    if (!confirm('Delete this patent? This action cannot be undone.')) return;
    try {
      await patentsApi.delete(id);
      setPatents((current) => current.filter((item) => item.id !== id));
      toast.success('Patent removed');
    } catch (error) {
      console.error('Error deleting patent:', error);
      toast.error('Failed to delete patent');
    }
  };

  // Publications handlers
  const openPublicationDialog = (item?: Publication) => {
    if (item) {
      setEditingPublicationId(item.id);
      setPublicationForm({
        title: item.title,
        publisher: item.publisher ?? '',
        publication_date: item.publication_date ?? '',
        url: item.url ?? '',
        description: item.description ?? '',
      });
    } else {
      setEditingPublicationId(null);
      setPublicationForm(emptyPublicationForm);
    }
    setPublicationDialogOpen(true);
  };

  const handleSavePublication = async () => {
    if (!publicationForm.title.trim()) {
      toast.error('Title is required');
      return;
    }
    try {
      const payload = {
        title: publicationForm.title.trim(),
        publisher: publicationForm.publisher.trim() || null,
        publication_date: publicationForm.publication_date.trim() || null,
        url: publicationForm.url.trim() || null,
        description: publicationForm.description.trim() || null,
      };
      if (editingPublicationId) {
        const updated = await publicationsApi.update(editingPublicationId, payload);
        setPublications((current) =>
          current.map((item) => (item.id === editingPublicationId ? updated : item)),
        );
        toast.success('Publication updated');
      } else {
        const created = await publicationsApi.create(payload);
        setPublications((current) => [created, ...current]);
        toast.success('Publication added');
      }
      setPublicationDialogOpen(false);
    } catch (error) {
      console.error('Error saving publication:', error);
      toast.error('Failed to save publication');
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Delete this publication? This action cannot be undone.')) return;
    try {
      await publicationsApi.delete(id);
      setPublications((current) => current.filter((item) => item.id !== id));
      toast.success('Publication removed');
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast.error('Failed to delete publication');
    }
  };

  // Projects handlers
  const openProjectDialog = (item?: Project) => {
    if (item) {
      setEditingProjectId(item.id);
      setProjectForm({
        title: item.title,
        role: item.role ?? '',
        start_date: item.start_date ?? '',
        end_date: item.end_date ?? '',
        is_current: item.is_current,
        description: item.description ?? '',
        url: item.url ?? '',
      });
    } else {
      setEditingProjectId(null);
      setProjectForm(emptyProjectForm);
    }
    setProjectDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!projectForm.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (
      !projectForm.is_current &&
      !isDateRangeValid(projectForm.start_date, projectForm.end_date)
    ) {
      toast.error('Start date cannot be after end date');
      return;
    }
    try {
      const payload = {
        title: projectForm.title.trim(),
        role: projectForm.role.trim() || null,
        start_date: projectForm.start_date.trim() || null,
        end_date: projectForm.is_current ? null : projectForm.end_date.trim() || null,
        is_current: projectForm.is_current,
        description: projectForm.description.trim() || null,
        url: projectForm.url.trim() || null,
      };
      if (editingProjectId) {
        const updated = await projectsApi.update(editingProjectId, payload);
        setProjects((current) =>
          current.map((item) => (item.id === editingProjectId ? updated : item)),
        );
        toast.success('Project updated');
      } else {
        const created = await projectsApi.create(payload);
        setProjects((current) => [created, ...current]);
        toast.success('Project added');
      }
      setProjectDialogOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project? This action cannot be undone.')) return;
    try {
      await projectsApi.delete(id);
      setProjects((current) => current.filter((item) => item.id !== id));
      toast.success('Project removed');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  // Test Scores handlers
  const openTestScoreDialog = (item?: TestScore) => {
    if (item) {
      setEditingTestScoreId(item.id);
      setTestScoreForm({
        test_name: item.test_name,
        score: item.score ?? '',
        max_score: item.max_score ?? '',
        test_date: item.test_date ?? '',
        description: item.description ?? '',
        proof_url: item.proof_url ?? '',
      });
    } else {
      setEditingTestScoreId(null);
      setTestScoreForm(emptyTestScoreForm);
    }
    setTestScoreDialogOpen(true);
  };

  const handleSaveTestScore = async () => {
    if (!testScoreForm.test_name.trim()) {
      toast.error('Test name is required');
      return;
    }
    try {
      const payload = {
        test_name: testScoreForm.test_name.trim(),
        score: testScoreForm.score.trim() || null,
        max_score: testScoreForm.max_score.trim() || null,
        test_date: testScoreForm.test_date.trim() || null,
        description: testScoreForm.description.trim() || null,
        proof_url: testScoreForm.proof_url.trim() || null,
      };
      if (editingTestScoreId) {
        const updated = await testScoresApi.update(editingTestScoreId, payload);
        setTestScores((current) =>
          current.map((item) => (item.id === editingTestScoreId ? updated : item)),
        );
        toast.success('Test score updated');
      } else {
        const created = await testScoresApi.create(payload);
        setTestScores((current) => [created, ...current]);
        toast.success('Test score added');
      }
      setTestScoreDialogOpen(false);
    } catch (error) {
      console.error('Error saving test score:', error);
      toast.error('Failed to save test score');
    }
  };

  const handleDeleteTestScore = async (id: string) => {
    if (!confirm('Delete this test score? This action cannot be undone.')) return;
    try {
      await testScoresApi.delete(id);
      setTestScores((current) => current.filter((item) => item.id !== id));
      toast.success('Test score removed');
    } catch (error) {
      console.error('Error deleting test score:', error);
      toast.error('Failed to delete test score');
    }
  };

  // Mentoring Listing handlers
  const openMentoringListingDialog = (item?: MentoringListing) => {
    if (item) {
      setEditingMentoringListingId(item.id);
      setMentoringListingForm({
        service_name: item.service_name,
        qualifications: item.qualifications ?? '',
        approved_subjects: (item.approved_subjects ?? []).join(', '),
        examples_of_expertise: item.examples_of_expertise ?? '',
        years_in_practice: item.years_in_practice ?? '',
        policies: item.policies ?? '',
        price: item.price != null ? String(item.price) : '',
        is_active: item.is_active,
      });
    } else {
      setEditingMentoringListingId(null);
      setMentoringListingForm(emptyMentoringListingForm);
    }
    setMentoringListingDialogOpen(true);
  };

  const handleSaveMentoringListing = async () => {
    if (!mentoringListingForm.service_name.trim()) {
      toast.error('Service name is required');
      return;
    }
    try {
      const payload = {
        service_name: mentoringListingForm.service_name.trim(),
        qualifications: mentoringListingForm.qualifications.trim() || null,
        approved_subjects: parseTagList(mentoringListingForm.approved_subjects),
        examples_of_expertise: mentoringListingForm.examples_of_expertise.trim() || null,
        years_in_practice: mentoringListingForm.years_in_practice.trim() || null,
        policies: mentoringListingForm.policies.trim() || null,
        price: mentoringListingForm.price.trim() ? Number(mentoringListingForm.price) : null,
        is_active: mentoringListingForm.is_active,
      };
      if (editingMentoringListingId) {
        const updated = await mentoringApi.updateListing(editingMentoringListingId, payload);
        setMentoringListings((current) =>
          current.map((item) => (item.id === editingMentoringListingId ? updated : item)),
        );
        toast.success('Mentoring listing updated');
      } else {
        const created = await mentoringApi.createListing(payload);
        setMentoringListings((current) => [created, ...current]);
        toast.success('Mentoring listing added');
      }
      setMentoringListingDialogOpen(false);
    } catch (error) {
      console.error('Error saving mentoring listing:', error);
      toast.error('Failed to save mentoring listing');
    }
  };

  const handleDeleteMentoringListing = async (id: string) => {
    if (!confirm('Delete this mentoring listing? This action cannot be undone.')) return;
    try {
      await mentoringApi.deleteListing(id);
      setMentoringListings((current) => current.filter((item) => item.id !== id));
      toast.success('Mentoring listing removed');
    } catch (error) {
      console.error('Error deleting mentoring listing:', error);
      toast.error('Failed to delete mentoring listing');
    }
  };

  // Mentor Availability Schedule handlers
  const handleToggleMentorDay = (day: DayKey) => {
    setMentorScheduleForm((current) => ({
      ...current,
      [day]: { ...current[day], enabled: !current[day].enabled },
    }));
  };

  const handleMentorDayTimeChange = (day: DayKey, field: 'start' | 'end', value: string) => {
    setMentorScheduleForm((current) => ({
      ...current,
      [day]: { ...current[day], [field]: value },
    }));
  };

  const handleSaveMentorSchedule = async () => {
    setMentorScheduleSaving(true);
    try {
      const updated = await mentoringApi.updateOwnSchedule(mentorScheduleForm);
      setMentorSchedule(updated);
      setMentorScheduleForm(createMentorScheduleForm(updated));
      toast.success('Availability schedule updated');
    } catch (error) {
      console.error('Error updating mentor schedule:', error);
      toast.error('Failed to update availability schedule');
    } finally {
      setMentorScheduleSaving(false);
    }
  };

  const profileTabClassName =
    'rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
  const profileTabs = [
    { value: 'about', label: 'About', icon: User },
    { value: 'experience', label: 'Experience', icon: Briefcase },
    { value: 'personality', label: 'Cognitive Personality', icon: Sparkles },
    { value: 'intelligence', label: 'Intelligence', icon: Brain },
    { value: 'portfolio', label: 'Intellectual Portfolio', icon: FolderKanban },
    { value: 'interests', label: 'Interests', icon: Heart },
    { value: 'mentoring', label: 'Mentoring', icon: GraduationCap },
    { value: 'community', label: 'Community', icon: MessageSquare },
    { value: 'security', label: 'Security', icon: Lock },
  ];
  const primaryTabs = profileTabs.slice(0, 5);
  const overflowTabs = profileTabs.slice(5);
  const activeTabConfig = profileTabs.find((tab) => tab.value === activeTab) ?? profileTabs[0];
  const activeOverflowTab = overflowTabs.find((tab) => tab.value === activeTab);
  const ActiveTabIcon = activeTabConfig.icon;
  const handleProfileTabChange = (value: string) => {
    setActiveTab(value);
    setIsEditing(false);
    setFormData(createProfileFormData(profile));
  };

  return (
    <div className='container pb-8 space-y-6 max-w-5xl'>
      {/* Profile Header: banner + overlapping avatar */}
      <div className='relative'>
        <div className='relative h-32 md:h-48 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/25 via-primary/10 to-transparent'>
          {formData.cover_photo && (
            <img
              src={formData.cover_photo}
              alt='Cover'
              className='absolute inset-0 h-full w-full object-cover'
            />
          )}
          <input
            ref={coverInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleCoverPhotoUpload}
          />
          <Button
            type='button'
            size='sm'
            variant='secondary'
            className='absolute bottom-3 right-3'
            onClick={() => coverInputRef.current?.click()}
            disabled={coverUploading}
          >
            {coverUploading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Camera className='mr-2 h-4 w-4' />
            )}
            {formData.cover_photo ? 'Change Cover' : 'Add Cover Photo'}
          </Button>
        </div>
        <div className='absolute -bottom-12 left-6'>
          <div className='relative'>
            <Avatar className='h-24 w-24 md:h-28 md:w-28 border-4 border-background shadow-lg'>
              <AvatarImage src={formData.avatar || undefined} />
              <AvatarFallback className='text-3xl'>
                {formData.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <input
              ref={avatarInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleProfilePhotoUpload}
            />
            <Button
              size='icon'
              variant='secondary'
              className='absolute bottom-0 right-0 rounded-full h-8 w-8'
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
            >
              {avatarUploading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Camera className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className='pt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <h1 className='text-2xl md:text-3xl'>{formData.full_name || 'Your Profile'}</h1>
            <Badge variant='secondary' className='capitalize'>
              <Sparkles className='mr-1 h-3 w-3' />
              {profile?.role?.replace('_', ' ') || 'Learner'}
            </Badge>
          </div>
          {formData.username && (
            <p className='text-sm text-muted-foreground'>@{formData.username}</p>
          )}
          {formData.aliases && (
            <p className='text-sm text-muted-foreground'>
              Also known as: {formData.aliases}
            </p>
          )}
          <p className='text-sm text-muted-foreground'>{formData.email}</p>
        </div>

        <div className='flex gap-2'>
          {activeTab === 'about' && isEditing ? (
            <>
              <Button onClick={handleUpdate} disabled={loading || avatarUploading}>
                <Save className='mr-2 h-4 w-4' />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setIsEditing(false);
                  setFormData(createProfileFormData(profile));
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                onClick={() => window.open('/profile-view', '_blank', 'noopener,noreferrer')}
              >
                <Eye className='mr-2 h-4 w-4' />
                View Profile
              </Button>
              {activeTab === 'about' && (
                <Button onClick={() => setIsEditing(true)}>
                  <Pencil className='mr-2 h-4 w-4' />
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleProfileTabChange}
        className='space-y-6'
      >
        <div className='border-b pt-1'>
          <div className='sm:hidden'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='mb-3 w-full justify-between gap-3 rounded-xl'>
                  <span className='flex min-w-0 items-center gap-2'>
                    <ActiveTabIcon className='h-4 w-4 shrink-0' />
                    <span className='truncate'>{activeTabConfig.label}</span>
                  </span>
                  <MoreHorizontal className='h-4 w-4 shrink-0 text-muted-foreground' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='min-w-[16rem]'>
                <DropdownMenuRadioGroup value={activeTab} onValueChange={handleProfileTabChange}>
                  {profileTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <DropdownMenuRadioItem key={tab.value} value={tab.value}>
                        <Icon className='h-4 w-4' />
                        {tab.label}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='hidden flex-wrap items-end gap-3 sm:flex'>
            <TabsList className='h-auto flex-wrap justify-start rounded-none bg-transparent p-0 text-muted-foreground'>
              {primaryTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className={profileTabClassName}>
                    <Icon className='mr-2 h-4 w-4' />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {overflowTabs.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className={`h-auto rounded-none border-b-2 px-4 py-3 text-sm font-semibold shadow-none hover:bg-transparent ${
                      activeOverflowTab
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {activeOverflowTab ? activeOverflowTab.label : 'More'}
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='min-w-[14rem]'>
                  <DropdownMenuRadioGroup value={activeTab} onValueChange={handleProfileTabChange}>
                    {overflowTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <DropdownMenuRadioItem key={tab.value} value={tab.value}>
                          <Icon className='h-4 w-4' />
                          {tab.label}
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* About Tab */}
        <TabsContent value='about' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='full_name'>Full Name</Label>
                  <Input
                    id='full_name'
                    value={formData.full_name}
                    onChange={(e) =>
                      handleProfileFieldChange('full_name', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    id='username'
                    placeholder='e.g. jane_doe'
                    value={formData.username}
                    onChange={(e) =>
                      handleProfileFieldChange('username', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='aliases'>Alias(es)</Label>
                  <Input
                    id='aliases'
                    placeholder='e.g. Janey, JD'
                    value={formData.aliases}
                    onChange={(e) =>
                      handleProfileFieldChange('aliases', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <p className='text-xs text-muted-foreground'>Comma-separated list</p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      handleProfileFieldChange('email', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone_number'>Phone Number</Label>
                  <Input
                    id='phone_number'
                    placeholder='+1 234 567 8900'
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleProfileFieldChange('phone_number', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                    id='location'
                    placeholder='e.g. New York, USA'
                    value={formData.location}
                    onChange={(e) =>
                      handleProfileFieldChange('location', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='date_of_birth'>Date of Birth</Label>
                  <Input
                    id='date_of_birth'
                    type='date'
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleProfileFieldChange('date_of_birth', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='gender'>Gender</Label>
                  <Input
                    id='gender'
                    placeholder='e.g. Male, Female, Non-binary'
                    value={formData.gender}
                    onChange={(e) => handleProfileFieldChange('gender', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='birthplace'>Birthplace</Label>
                  <Input
                    id='birthplace'
                    placeholder='e.g. New York, USA'
                    value={formData.birthplace}
                    onChange={(e) => handleProfileFieldChange('birthplace', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='languages'>Languages</Label>
                  <Input
                    id='languages'
                    placeholder='e.g. English, French, Spanish'
                    value={formData.languages}
                    onChange={(e) => handleProfileFieldChange('languages', e.target.value)}
                    disabled={!isEditing}
                  />
                  <p className='text-xs text-muted-foreground'>Comma-separated list</p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='culture'>Culture / Ethnicity</Label>
                  <Input
                    id='culture'
                    placeholder='e.g. Hispanic, Asian, African American'
                    value={formData.culture}
                    onChange={(e) => handleProfileFieldChange('culture', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='official_title'>Official Title / License</Label>
                  <Input
                    id='official_title'
                    placeholder='e.g. Licensed Clinical Psychologist'
                    value={formData.official_title}
                    onChange={(e) => handleProfileFieldChange('official_title', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='licenses_certifications'>Licenses &amp; Certifications</Label>
                  <Input
                    id='licenses_certifications'
                    placeholder='e.g. PMP, CFA, Bar Admission'
                    value={formData.licenses_certifications}
                    onChange={(e) =>
                      handleProfileFieldChange('licenses_certifications', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <p className='text-xs text-muted-foreground'>Comma-separated list</p>
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <Textarea
                    id='bio'
                    placeholder='Tell us a bit about yourself'
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((current) => ({ ...current, bio: e.target.value }))
                    }
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label>Account Role</Label>
                  <Input
                    value={profile?.role?.replace('_', ' ') || 'Learner'}
                    disabled
                    className='capitalize'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Contact admin to change your role
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <ExternalLink className='h-5 w-5 text-primary' />
                Social Links &amp; Websites
              </CardTitle>
              <CardDescription>
                Share where people can find or connect with you online
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='social_links_website'>Website</Label>
                  <Input
                    id='social_links_website'
                    placeholder='https://example.com'
                    value={formData.social_links_website}
                    onChange={(e) =>
                      handleProfileFieldChange('social_links_website', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='social_links_linkedin'>LinkedIn</Label>
                  <Input
                    id='social_links_linkedin'
                    placeholder='https://linkedin.com/in/username'
                    value={formData.social_links_linkedin}
                    onChange={(e) =>
                      handleProfileFieldChange('social_links_linkedin', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='social_links_twitter'>Twitter / X</Label>
                  <Input
                    id='social_links_twitter'
                    placeholder='https://x.com/username'
                    value={formData.social_links_twitter}
                    onChange={(e) =>
                      handleProfileFieldChange('social_links_twitter', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='social_links_instagram'>Instagram</Label>
                  <Input
                    id='social_links_instagram'
                    placeholder='https://instagram.com/username'
                    value={formData.social_links_instagram}
                    onChange={(e) =>
                      handleProfileFieldChange('social_links_instagram', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='social_links_facebook'>Facebook</Label>
                  <Input
                    id='social_links_facebook'
                    placeholder='https://facebook.com/username'
                    value={formData.social_links_facebook}
                    onChange={(e) =>
                      handleProfileFieldChange('social_links_facebook', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='websites'>Additional Websites</Label>
                  <Input
                    id='websites'
                    placeholder='e.g. https://portfolio.com, https://blog.com'
                    value={formData.websites}
                    onChange={(e) => handleProfileFieldChange('websites', e.target.value)}
                    disabled={!isEditing}
                  />
                  <p className='text-xs text-muted-foreground'>Comma-separated list</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab (Work History, Education, Honors) */}
        <TabsContent value='experience' className='space-y-8'>
          <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-medium'>Work Experience</h3>
              <p className='text-sm text-muted-foreground'>
                Add companies, roles, and responsibilities
              </p>
            </div>
            <Button onClick={() => openWorkDialog()}>
              <Plus className='mr-2 h-4 w-4' />
              Add Work Experience
            </Button>
          </div>

          {workLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            </div>
          ) : workExperiences.length === 0 ? (
            <Card>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                No work experience yet. Click "Add Work Experience" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-3'>
              {workExperiences.map((item) => (
                <Card key={item.id}>
                  <CardContent className='py-4 flex items-start justify-between gap-4'>
                    <div className='space-y-1'>
                      <p className='font-medium'>
                        {item.title ? `${item.title} · ` : ''}
                        {item.company}
                      </p>
                      {item.location && (
                        <p className='text-sm text-muted-foreground'>{item.location}</p>
                      )}
                      <p className='text-xs text-muted-foreground'>
                        {formatDateRange(item.start_date, item.end_date, item.is_current)}
                      </p>
                      {item.description && (
                        <p className='text-sm mt-1'>{item.description}</p>
                      )}
                    </div>
                    <div className='flex gap-1 shrink-0'>
                      <Button size='icon' variant='ghost' onClick={() => openWorkDialog(item)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button size='icon' variant='ghost' onClick={() => handleDeleteWork(item.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </div>

          <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-medium'>Education</h3>
              <p className='text-sm text-muted-foreground'>
                Add schools, degrees, and fields of study
              </p>
            </div>
            <Button onClick={() => openEducationDialog()}>
              <Plus className='mr-2 h-4 w-4' />
              Add Education
            </Button>
          </div>

          {educationLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            </div>
          ) : educations.length === 0 ? (
            <Card>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                No education entries yet. Click "Add Education" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-3'>
              {educations.map((item) => (
                <Card key={item.id}>
                  <CardContent className='py-4 flex items-start justify-between gap-4'>
                    <div className='space-y-1'>
                      <p className='font-medium'>{item.school}</p>
                      {(item.degree || item.field_of_study) && (
                        <p className='text-sm text-muted-foreground'>
                          {[item.degree, item.field_of_study].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className='text-xs text-muted-foreground'>
                        {formatDateRange(item.start_date, item.end_date, item.is_current)}
                      </p>
                      {item.description && (
                        <p className='text-sm mt-1'>{item.description}</p>
                      )}
                    </div>
                    <div className='flex gap-1 shrink-0'>
                      <Button size='icon' variant='ghost' onClick={() => openEducationDialog(item)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button size='icon' variant='ghost' onClick={() => handleDeleteEducation(item.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </div>

          <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-medium'>Honors &amp; Awards</h3>
              <p className='text-sm text-muted-foreground'>
                Highlight your recognitions and achievements
              </p>
            </div>
            <Button onClick={() => openHonorDialog()}>
              <Plus className='mr-2 h-4 w-4' />
              Add Honor
            </Button>
          </div>

          {honorsLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            </div>
          ) : honors.length === 0 ? (
            <Card>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                No honors or awards yet. Click "Add Honor" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-3'>
              {honors.map((item) => (
                <Card key={item.id}>
                  <CardContent className='py-4 flex items-start justify-between gap-4'>
                    <div className='space-y-1'>
                      <p className='font-medium'>{item.title}</p>
                      {(item.issuer || item.date_awarded) && (
                        <p className='text-sm text-muted-foreground'>
                          {[item.issuer, formatMonthYear(item.date_awarded)]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                      {item.description && (
                        <p className='text-sm mt-1'>{item.description}</p>
                      )}
                    </div>
                    <div className='flex gap-1 shrink-0'>
                      <Button size='icon' variant='ghost' onClick={() => openHonorDialog(item)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button size='icon' variant='ghost' onClick={() => handleDeleteHonor(item.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <SkillsExpertiseIcon className='text-primary' />
                Skills &amp; Fields of Expertise
              </CardTitle>
              <CardDescription>
                Add skills and areas of expertise you want to showcase
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='e.g. Calculus, Public Speaking, Data Science...'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              {skillsLoading ? (
                <div className='flex justify-center py-4'>
                  <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                </div>
              ) : skills.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No skills added yet.</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {skills.map((item) => (
                    <Badge key={item.id} variant='secondary' className='text-sm py-1.5 pl-3 pr-2'>
                      {item.name}
                      <button
                        type='button'
                        onClick={() => handleDeleteSkill(item.id)}
                        className='ml-1'
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personality (Mental Diagnosis) Tab */}
        <TabsContent value='personality' className='space-y-4'>
          <MbtiIntroductionSection />
          {personality && MBTI_PROFILES[personality as MBTIType] && !personalityEditing ? (
            (() => {
              const mbtiProfile = MBTI_PROFILES[personality as MBTIType];
              return (
                <Card className='overflow-hidden'>
                  <CardContent className='p-0'>
                    <div className='p-6'>
                      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                        <div className='flex flex-wrap items-center gap-3'>
                          <h3 className='text-lg font-semibold'>{mbtiProfile.nickname}</h3>
                          <Badge variant='secondary'>{personality}</Badge>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => onNavigate?.('personality-types')}
                          >
                            <ExternalLink className='mr-2 h-4 w-4' />
                            View All Personality Types
                          </Button>
                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => setPersonalityEditing(true)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className='border-t px-6 py-6 space-y-6'>
                      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
                        {mbtiProfile.stack.map((code, index) => {
                          const fn = MBTI_FUNCTIONS[code];
                          const roleLabel = MBTI_STACK_ROLE_LABELS[index];
                          return (
                            <div key={code} className='space-y-3'>
                              <img
                                src={getCognitiveFunctionImagePath(code)}
                                alt={`${code} icon`}
                                className='h-14 w-14 object-contain'
                              />
                              <div className='space-y-1.5'>
                                <p className='text-sm font-semibold'>
                                  {roleLabel} - ({code}) {fn.name}
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

                      <div className='space-y-3'>
                        <div className='overflow-hidden rounded-xl border bg-muted/20'>
                          <img
                            src={getMBTITypeImagePath(personality as MBTIType)}
                            alt={`Illustration of ${personality}`}
                            className='w-full h-auto object-cover'
                          />
                        </div>
                        <p className='text-xs italic text-muted-foreground'>Image of MBTI Type</p>
                      </div>

                      <div className='rounded-2xl bg-muted/40 p-6 space-y-4'>
                        {mbtiProfile.paragraphs
                          .slice(0, personalityExpanded ? undefined : 1)
                          .map((paragraph, index) => (
                            <p key={index} className='text-sm leading-7 text-muted-foreground'>
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      {mbtiProfile.paragraphs.length > 1 && (
                        <button
                          type='button'
                          onClick={() => setPersonalityExpanded((current) => !current)}
                          className='text-sm text-primary flex items-center gap-1 ml-auto'
                        >
                          {personalityExpanded ? (
                            <>
                              Show Less <ChevronUp className='h-4 w-4' />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className='h-4 w-4' />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <CardTitle>Personality</CardTitle>
                    <CardDescription>
                      Select the personality type that best describes you
                    </CardDescription>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onNavigate?.('personality-types')}
                  >
                    <ExternalLink className='mr-2 h-4 w-4' />
                    View All Personality Types
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2 max-w-xs'>
                  <Label>Personality Type</Label>
                  <Select
                    value={personality || undefined}
                    onValueChange={handleSavePersonality}
                    disabled={personalitySaving}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select personality type' />
                    </SelectTrigger>
                    <SelectContent>
                      {MBTI_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {personality && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setPersonalityEditing(false)}
                    disabled={personalitySaving}
                  >
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Zodiac Profile */}
          {profile?.date_of_birth && getZodiacSign(profile.date_of_birth) ? (
            (() => {
              const sign = getZodiacSign(profile.date_of_birth as string)!;
              const zodiacProfile = ZODIAC_PROFILES[sign];
              const appearanceSummary = getZodiacAppearanceSummary(sign, zodiacProfile);
              return (
                <Card className='overflow-hidden'>
                  <CardContent className='p-0'>
                    <div className='p-6 space-y-3'>
                      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                        <div className='space-y-2'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <h3 className='text-lg font-semibold'>
                              {sign} ({zodiacProfile.symbolName})
                            </h3>
                            <Badge variant='secondary'>{zodiacProfile.archetype}</Badge>
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {zodiacProfile.dateRangeLabel}
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            <Badge variant='outline'>{zodiacProfile.element}</Badge>
                            <Badge variant='outline'>{zodiacProfile.modality}</Badge>
                            <Badge variant='outline'>Ruled by {zodiacProfile.rulingPlanet}</Badge>
                            <Badge variant='outline'>Influenced by {zodiacProfile.influencePlanet}</Badge>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => onNavigate?.('zodiac-signs')}
                          >
                            <ExternalLink className='mr-2 h-4 w-4' />
                            View All Zodiac Signs
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className='border-t px-6 py-6 space-y-6'>
                      <div className='flex items-start gap-4'>
                        <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border bg-muted/40 p-3'>
                          <img
                            src={`/assets/${sign.toLowerCase()}_symbol.png`}
                            alt={`${sign} symbol`}
                            className='max-h-full max-w-full object-contain'
                          />
                        </div>
                        <div className='space-y-2'>
                          <h4 className='text-base font-semibold'>General Physical Appearance</h4>
                          <p className='text-sm text-muted-foreground'>{appearanceSummary}</p>
                        </div>
                      </div>

                      <div className='space-y-3'>
                        <div className='overflow-hidden rounded-xl border bg-muted/20'>
                          <img
                            src={`/assets/${sign.toLowerCase()}.png`}
                            alt={`Illustration of ${sign}`}
                            className='w-full h-auto object-cover'
                          />
                        </div>
                        <p className='text-xs italic text-muted-foreground'>Image of a {sign}</p>
                      </div>

                      <div className='space-y-3'>
                        <h4 className='text-base font-semibold'>General Conscience &amp; Personality</h4>
                        {zodiacProfile.paragraphs
                          .slice(0, zodiacExpanded ? undefined : 1)
                          .map((paragraph, index) => (
                            <p key={index} className='text-sm text-muted-foreground'>
                              {paragraph}
                            </p>
                          ))}
                        <button
                          type='button'
                          onClick={() => setZodiacExpanded((current) => !current)}
                          className='text-sm text-primary flex items-center gap-1 ml-auto'
                        >
                          {zodiacExpanded ? (
                            <>
                              Show Less <ChevronUp className='h-4 w-4' />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className='h-4 w-4' />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <CardTitle>Zodiac Profile</CardTitle>
                    <CardDescription>
                      Add your date of birth in the About tab to reveal your zodiac profile
                    </CardDescription>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onNavigate?.('zodiac-signs')}
                  >
                    <ExternalLink className='mr-2 h-4 w-4' />
                    View All Zodiac Signs
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        {/* Intelligence Tab (Intelligence Types + IQ) */}
        <TabsContent value='intelligence' className='space-y-4'>
          {/* 11 Intelligence Types + IQ Metrics */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Intelligence Types &amp; IQ</CardTitle>
                  <CardDescription>
                    Score your 11 intelligence types and record your IQ metrics
                  </CardDescription>
                </div>
                {!cognitiveProfileEditing && (
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setCognitiveProfileEditing(true)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {cognitiveProfileLoading ? (
                <div className='flex justify-center py-4'>
                  <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                </div>
              ) : cognitiveProfileEditing ? (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {INTELLIGENCE_TYPE_KEYS.map((key) => {
                      const meta = INTELLIGENCE_TYPES[key];
                      const Icon = meta.icon;
                      return (
                        <div key={key} className='space-y-2'>
                          <Label className='flex items-center gap-2'>
                            <Icon className='h-4 w-4 text-primary' />
                            {meta.label}
                            <span className='ml-auto text-xs text-muted-foreground'>
                              {cognitiveProfileForm[key]}/100
                            </span>
                          </Label>
                          <Slider
                            value={[cognitiveProfileForm[key]]}
                            max={100}
                            step={1}
                            onValueChange={([value]) =>
                              setCognitiveProfileForm((c) => ({ ...c, [key]: value }))
                            }
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-2'>
                      <Label>Current Estimated IQ</Label>
                      <Input
                        type='number'
                        value={cognitiveProfileForm.current_iq_estimate}
                        onChange={(e) =>
                          setCognitiveProfileForm((c) => ({
                            ...c,
                            current_iq_estimate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Potential Maximum IQ</Label>
                      <Input
                        type='number'
                        value={cognitiveProfileForm.potential_max_iq}
                        onChange={(e) =>
                          setCognitiveProfileForm((c) => ({
                            ...c,
                            potential_max_iq: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label>Official IQ</Label>
                    <p className='text-sm text-muted-foreground'>
                      {cognitiveProfile?.official_iq ?? '—'} (verified from a completed psychologist
                      test — not editable here)
                    </p>
                  </div>

                  <div className='flex gap-2 justify-end'>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setCognitiveProfileForm(createCognitiveProfileForm(cognitiveProfile));
                        setCognitiveProfileEditing(false);
                      }}
                      disabled={cognitiveProfileSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCognitiveProfile} disabled={cognitiveProfileSaving}>
                      {cognitiveProfileSaving ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {INTELLIGENCE_TYPE_KEYS.map((key) => {
                      const meta = INTELLIGENCE_TYPES[key];
                      const Icon = meta.icon;
                      const score = cognitiveProfile?.[key] ?? 0;
                      return (
                        <div key={key} className='space-y-1.5'>
                          <div className='flex items-center gap-2 text-sm font-medium'>
                            <Icon className='h-4 w-4 text-primary' />
                            {meta.label}
                            <span className='ml-auto text-xs text-muted-foreground'>
                              {score}/100
                            </span>
                          </div>
                          <Progress value={score ?? 0} />
                        </div>
                      );
                    })}
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='p-3 rounded-lg border bg-muted/30 space-y-1'>
                      <p className='text-xs text-muted-foreground'>Official IQ</p>
                      <p className='text-lg font-semibold'>
                        {cognitiveProfile?.official_iq ?? '—'}
                      </p>
                    </div>
                    <div className='p-3 rounded-lg border bg-muted/30 space-y-1'>
                      <p className='text-xs text-muted-foreground'>Current IQ Estimate</p>
                      <p className='text-lg font-semibold'>
                        {cognitiveProfile?.current_iq_estimate ?? '—'}
                      </p>
                    </div>
                    <div className='p-3 rounded-lg border bg-muted/30 space-y-1'>
                      <p className='text-xs text-muted-foreground'>Potential Max IQ</p>
                      <p className='text-lg font-semibold'>
                        {cognitiveProfile?.potential_max_iq ?? '—'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value='interests' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <HandHeart className='h-5 w-5 text-primary' />
                Causes &amp; Philanthropy
              </CardTitle>
              <CardDescription>
                Highlight the social causes you care about and support
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='e.g. STEM Education, Mental Health, Animal Welfare...'
                  value={newCause}
                  onChange={(e) => setNewCause(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCause();
                    }
                  }}
                />
                <Button onClick={handleAddCause} disabled={!newCause.trim()}>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              {causesLoading ? (
                <div className='flex justify-center py-4'>
                  <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                </div>
              ) : causes.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No causes added yet.</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {causes.map((item) => (
                    <Badge key={item.id} variant='secondary' className='text-sm py-1.5 pl-3 pr-2'>
                      {item.name}
                      <button
                        type='button'
                        onClick={() => handleDeleteCause(item.id)}
                        className='ml-1'
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>Add topics and hobbies you're interested in</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add an interest...'
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button onClick={handleAddInterest} disabled={!newInterest.trim()}>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              {interestsLoading ? (
                <div className='flex justify-center py-4'>
                  <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                </div>
              ) : interests.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No interests added yet.</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {interests.map((item) => (
                    <Badge key={item.id} variant='secondary' className='text-sm py-1.5 pl-3 pr-2'>
                      {item.name}
                      <button
                        type='button'
                        onClick={() => handleDeleteInterest(item.id)}
                        className='ml-1'
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intellectual Portfolio Tab */}
        <TabsContent value='portfolio' className='space-y-8'>
          {/* Patents */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium flex items-center gap-2'>
                  <FileCheck2 className='h-5 w-5 text-primary' />
                  Patents
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Registered patents and intellectual property
                </p>
              </div>
              <Button onClick={() => openPatentDialog()}>
                <Plus className='mr-2 h-4 w-4' />
                Add Patent
              </Button>
            </div>

            {patentsLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
              </div>
            ) : patents.length === 0 ? (
              <Card>
                <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                  No patents yet. Click "Add Patent" to get started.
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-3'>
                {patents.map((item) => (
                  <Card key={item.id}>
                    <CardContent className='py-4 flex items-start justify-between gap-4'>
                      <div className='space-y-1'>
                        <p className='font-medium'>{item.title}</p>
                        {(item.patent_number || item.issuing_office) && (
                          <p className='text-sm text-muted-foreground'>
                            {[item.patent_number, item.issuing_office].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          {formatMonthYear(item.filing_date) || '—'} -{' '}
                          {formatMonthYear(item.grant_date) || '—'}
                        </p>
                        {item.description && (
                          <p className='text-sm mt-1'>{item.description}</p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target='_blank'
                            rel='noreferrer'
                            className='text-xs text-primary flex items-center gap-1'
                          >
                            View <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <Button size='icon' variant='ghost' onClick={() => openPatentDialog(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button size='icon' variant='ghost' onClick={() => handleDeletePatent(item.id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Publications */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium flex items-center gap-2'>
                  <BookOpen className='h-5 w-5 text-primary' />
                  Publications
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Scientific publications and research papers
                </p>
              </div>
              <Button onClick={() => openPublicationDialog()}>
                <Plus className='mr-2 h-4 w-4' />
                Add Publication
              </Button>
            </div>

            {publicationsLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
              </div>
            ) : publications.length === 0 ? (
              <Card>
                <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                  No publications yet. Click "Add Publication" to get started.
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-3'>
                {publications.map((item) => (
                  <Card key={item.id}>
                    <CardContent className='py-4 flex items-start justify-between gap-4'>
                      <div className='space-y-1'>
                        <p className='font-medium'>{item.title}</p>
                        {(item.publisher || item.publication_date) && (
                          <p className='text-sm text-muted-foreground'>
                            {[item.publisher, formatMonthYear(item.publication_date)]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                        {item.description && (
                          <p className='text-sm mt-1'>{item.description}</p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target='_blank'
                            rel='noreferrer'
                            className='text-xs text-primary flex items-center gap-1'
                          >
                            View <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <Button size='icon' variant='ghost' onClick={() => openPublicationDialog(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button size='icon' variant='ghost' onClick={() => handleDeletePublication(item.id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium flex items-center gap-2'>
                  <FolderKanban className='h-5 w-5 text-primary' />
                  Custom Projects &amp; Research
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Technical projects and independent research works
                </p>
              </div>
              <Button onClick={() => openProjectDialog()}>
                <Plus className='mr-2 h-4 w-4' />
                Add Project
              </Button>
            </div>

            {projectsLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                  No projects yet. Click "Add Project" to get started.
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-3'>
                {projects.map((item) => (
                  <Card key={item.id}>
                    <CardContent className='py-4 flex items-start justify-between gap-4'>
                      <div className='space-y-1'>
                        <p className='font-medium'>
                          {item.role ? `${item.role} · ` : ''}
                          {item.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatDateRange(item.start_date, item.end_date, item.is_current)}
                        </p>
                        {item.description && (
                          <p className='text-sm mt-1'>{item.description}</p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target='_blank'
                            rel='noreferrer'
                            className='text-xs text-primary flex items-center gap-1'
                          >
                            View <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <Button size='icon' variant='ghost' onClick={() => openProjectDialog(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button size='icon' variant='ghost' onClick={() => handleDeleteProject(item.id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Test Scores */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium flex items-center gap-2'>
                  <Trophy className='h-5 w-5 text-primary' />
                  Standardized Test Scores
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Official test scores and certifications
                </p>
              </div>
              <Button onClick={() => openTestScoreDialog()}>
                <Plus className='mr-2 h-4 w-4' />
                Add Test Score
              </Button>
            </div>

            {testScoresLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
              </div>
            ) : testScores.length === 0 ? (
              <Card>
                <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                  No test scores yet. Click "Add Test Score" to get started.
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-3'>
                {testScores.map((item) => (
                  <Card key={item.id}>
                    <CardContent className='py-4 flex items-start justify-between gap-4'>
                      <div className='space-y-1'>
                        <p className='font-medium'>{item.test_name}</p>
                        {(item.score || item.max_score) && (
                          <p className='text-sm text-muted-foreground'>
                            Score: {item.score || '—'}
                            {item.max_score ? ` / ${item.max_score}` : ''}
                          </p>
                        )}
                        {item.test_date && (
                          <p className='text-xs text-muted-foreground'>{item.test_date}</p>
                        )}
                        {item.description && (
                          <p className='text-sm mt-1'>{item.description}</p>
                        )}
                        {item.proof_url && (
                          <a
                            href={item.proof_url}
                            target='_blank'
                            rel='noreferrer'
                            className='text-xs text-primary flex items-center gap-1'
                          >
                            Proof <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <Button size='icon' variant='ghost' onClick={() => openTestScoreDialog(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button size='icon' variant='ghost' onClick={() => handleDeleteTestScore(item.id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Mentoring / Tutoring Tab */}
        <TabsContent value='mentoring' className='space-y-8'>
          {/* Mentoring Listings */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium flex items-center gap-2'>
                  <GraduationCap className='h-5 w-5 text-primary' />
                  Mentoring &amp; Tutoring Services
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Offer mentoring or tutoring services to other learners
                </p>
              </div>
              <Button onClick={() => openMentoringListingDialog()}>
                <Plus className='mr-2 h-4 w-4' />
                Add Listing
              </Button>
            </div>

            {mentoringListingsLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
              </div>
            ) : mentoringListings.length === 0 ? (
              <Card>
                <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                  No mentoring listings yet. Click "Add Listing" to get started.
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-3'>
                {mentoringListings.map((item) => (
                  <Card key={item.id}>
                    <CardContent className='py-4 flex items-start justify-between gap-4'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <p className='font-medium'>{item.service_name}</p>
                          <Badge variant={item.is_active ? 'default' : 'secondary'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {item.qualifications && (
                          <p className='text-sm text-muted-foreground'>{item.qualifications}</p>
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
                        {item.examples_of_expertise && (
                          <p className='text-sm mt-1'>{item.examples_of_expertise}</p>
                        )}
                        <div className='flex items-center gap-3 text-xs text-muted-foreground mt-1'>
                          {item.years_in_practice && <span>{item.years_in_practice} experience</span>}
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
                        {item.policies && (
                          <p className='text-xs text-muted-foreground mt-1'>{item.policies}</p>
                        )}
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <Button
                          size='icon'
                          variant='ghost'
                          onClick={() => openMentoringListingDialog(item)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          size='icon'
                          variant='ghost'
                          onClick={() => handleDeleteMentoringListing(item.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Availability Schedule */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium flex items-center gap-2'>
                  <Calendar className='h-5 w-5 text-primary' />
                  Weekly Availability
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Set the days and hours you're available for mentoring sessions
                </p>
              </div>
              <Button onClick={handleSaveMentorSchedule} disabled={mentorScheduleSaving}>
                {mentorScheduleSaving ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Save className='mr-2 h-4 w-4' />
                )}
                Save Schedule
              </Button>
            </div>

            {mentorScheduleLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
              </div>
            ) : (
              <div className='space-y-3'>
                {DAY_ORDER.map((day) => {
                  const daySchedule = mentorScheduleForm[day];
                  return (
                    <Card key={day} className={!daySchedule.enabled ? 'opacity-60' : ''}>
                      <CardContent className='py-4 flex flex-wrap items-center gap-4'>
                        <div className='flex items-center gap-3 min-w-[140px]'>
                          <Switch
                            checked={daySchedule.enabled}
                            onCheckedChange={() => handleToggleMentorDay(day)}
                          />
                          <Label className='font-medium'>{DAY_LABELS[day]}</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='time'
                            className='w-32'
                            value={daySchedule.start}
                            disabled={!daySchedule.enabled}
                            onChange={(e) =>
                              handleMentorDayTimeChange(day, 'start', e.target.value)
                            }
                          />
                          <span className='text-sm text-muted-foreground'>to</span>
                          <Input
                            type='time'
                            className='w-32'
                            value={daySchedule.end}
                            disabled={!daySchedule.enabled}
                            onChange={(e) =>
                              handleMentorDayTimeChange(day, 'end', e.target.value)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Community Tab (Discussions & Reviews) */}
        <TabsContent value='community' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <MessageSquare className='h-4 w-4 text-primary' />
                  My Discussion Posts
                </CardTitle>
                <CardDescription>Posts you've made in the community forum</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {discussionPostsLoading ? (
                  <div className='flex justify-center py-6'>
                    <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                  </div>
                ) : discussionPosts.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>No discussion posts yet.</p>
                ) : (
                  discussionPosts.map((post) => (
                    <div key={post.id} className='rounded-lg border p-3 space-y-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='text-sm font-medium'>{post.title}</p>
                        <Badge variant='outline' className='capitalize text-xs'>
                          {post.category.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground line-clamp-3'>{post.content}</p>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Star className='h-4 w-4 text-primary' />
                  My Course Reviews
                </CardTitle>
                <CardDescription>Reviews you've written for courses</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {courseReviewsLoading ? (
                  <div className='flex justify-center py-6'>
                    <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                  </div>
                ) : courseReviews.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>No reviews written yet.</p>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Alert>
                <Lock className='h-4 w-4' />
                <AlertDescription>
                  For security reasons, you'll need to sign in again after
                  changing your password
                </AlertDescription>
              </Alert>

              <div className='space-y-2'>
                <Label htmlFor='current_password'>Current Password</Label>
                <Input
                  id='current_password'
                  type='password'
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='new_password'>New Password</Label>
                <Input
                  id='new_password'
                  type='password'
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm_password'>
                  Confirm New Password
                </Label>
                <Input
                  id='confirm_password'
                  type='password'
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </div>

              <Button onClick={handleChangePassword} disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className='mr-2 h-4 w-4' />
                    Update Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Education Dialog */}
      <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingEducationId ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label>School</Label>
              <Input
                value={educationForm.school}
                onChange={(e) => setEducationForm((c) => ({ ...c, school: e.target.value }))}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Degree</Label>
                <Input
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm((c) => ({ ...c, degree: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Field of Study</Label>
                <Input
                  value={educationForm.field_of_study}
                  onChange={(e) =>
                    setEducationForm((c) => ({ ...c, field_of_study: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Start Date</Label>
                <Input
                  type='date'
                  value={educationForm.start_date}
                  onChange={(e) => setEducationForm((c) => ({ ...c, start_date: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>End Date</Label>
                <Input
                  type='date'
                  value={educationForm.end_date}
                  min={educationForm.start_date || undefined}
                  disabled={educationForm.is_current}
                  onChange={(e) => setEducationForm((c) => ({ ...c, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='education_current'
                checked={educationForm.is_current}
                onCheckedChange={(checked) =>
                  setEducationForm((c) => ({ ...c, is_current: checked === true }))
                }
              />
              <Label htmlFor='education_current'>I currently study here</Label>
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={educationForm.description}
                onChange={(e) => setEducationForm((c) => ({ ...c, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEducationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEducation}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Work Experience Dialog */}
      <Dialog open={workDialogOpen} onOpenChange={setWorkDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingWorkId ? 'Edit Work Experience' : 'Add Work Experience'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Company</Label>
                <Input
                  value={workForm.company}
                  onChange={(e) => setWorkForm((c) => ({ ...c, company: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Title</Label>
                <Input
                  value={workForm.title}
                  onChange={(e) => setWorkForm((c) => ({ ...c, title: e.target.value }))}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Location</Label>
              <Input
                value={workForm.location}
                onChange={(e) => setWorkForm((c) => ({ ...c, location: e.target.value }))}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Start Date</Label>
                <Input
                  type='date'
                  value={workForm.start_date}
                  onChange={(e) => setWorkForm((c) => ({ ...c, start_date: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>End Date</Label>
                <Input
                  type='date'
                  value={workForm.end_date}
                  min={workForm.start_date || undefined}
                  disabled={workForm.is_current}
                  onChange={(e) => setWorkForm((c) => ({ ...c, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='work_current'
                checked={workForm.is_current}
                onCheckedChange={(checked) =>
                  setWorkForm((c) => ({ ...c, is_current: checked === true }))
                }
              />
              <Label htmlFor='work_current'>I currently work here</Label>
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={workForm.description}
                onChange={(e) => setWorkForm((c) => ({ ...c, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setWorkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWork}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Honor Dialog */}
      <Dialog open={honorDialogOpen} onOpenChange={setHonorDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingHonorId ? 'Edit Honor' : 'Add Honor'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input
                value={honorForm.title}
                onChange={(e) => setHonorForm((c) => ({ ...c, title: e.target.value }))}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Issuer</Label>
                <Input
                  value={honorForm.issuer}
                  onChange={(e) => setHonorForm((c) => ({ ...c, issuer: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Date Awarded</Label>
                <Input
                  type='date'
                  value={honorForm.date_awarded}
                  onChange={(e) => setHonorForm((c) => ({ ...c, date_awarded: e.target.value }))}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={honorForm.description}
                onChange={(e) => setHonorForm((c) => ({ ...c, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setHonorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHonor}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patent Dialog */}
      <Dialog open={patentDialogOpen} onOpenChange={setPatentDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingPatentId ? 'Edit Patent' : 'Add Patent'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input
                value={patentForm.title}
                onChange={(e) => setPatentForm((c) => ({ ...c, title: e.target.value }))}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Patent Number</Label>
                <Input
                  value={patentForm.patent_number}
                  onChange={(e) => setPatentForm((c) => ({ ...c, patent_number: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Issuing Office</Label>
                <Input
                  value={patentForm.issuing_office}
                  onChange={(e) =>
                    setPatentForm((c) => ({ ...c, issuing_office: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Filing Date</Label>
                <Input
                  type='date'
                  value={patentForm.filing_date}
                  onChange={(e) => setPatentForm((c) => ({ ...c, filing_date: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Grant Date</Label>
                <Input
                  type='date'
                  value={patentForm.grant_date}
                  min={patentForm.filing_date || undefined}
                  onChange={(e) => setPatentForm((c) => ({ ...c, grant_date: e.target.value }))}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>URL</Label>
              <Input
                value={patentForm.url}
                onChange={(e) => setPatentForm((c) => ({ ...c, url: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={patentForm.description}
                onChange={(e) => setPatentForm((c) => ({ ...c, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPatentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePatent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publication Dialog */}
      <Dialog open={publicationDialogOpen} onOpenChange={setPublicationDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingPublicationId ? 'Edit Publication' : 'Add Publication'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input
                value={publicationForm.title}
                onChange={(e) => setPublicationForm((c) => ({ ...c, title: e.target.value }))}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Publisher</Label>
                <Input
                  value={publicationForm.publisher}
                  onChange={(e) =>
                    setPublicationForm((c) => ({ ...c, publisher: e.target.value }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>Publication Date</Label>
                <Input
                  type='date'
                  value={publicationForm.publication_date}
                  onChange={(e) =>
                    setPublicationForm((c) => ({ ...c, publication_date: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>URL</Label>
              <Input
                value={publicationForm.url}
                onChange={(e) => setPublicationForm((c) => ({ ...c, url: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={publicationForm.description}
                onChange={(e) =>
                  setPublicationForm((c) => ({ ...c, description: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPublicationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePublication}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingProjectId ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Title</Label>
                <Input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((c) => ({ ...c, title: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Role</Label>
                <Input
                  value={projectForm.role}
                  onChange={(e) => setProjectForm((c) => ({ ...c, role: e.target.value }))}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Start Date</Label>
                <Input
                  type='date'
                  value={projectForm.start_date}
                  onChange={(e) => setProjectForm((c) => ({ ...c, start_date: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>End Date</Label>
                <Input
                  type='date'
                  value={projectForm.end_date}
                  min={projectForm.start_date || undefined}
                  disabled={projectForm.is_current}
                  onChange={(e) => setProjectForm((c) => ({ ...c, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='project_current'
                checked={projectForm.is_current}
                onCheckedChange={(checked) =>
                  setProjectForm((c) => ({ ...c, is_current: checked === true }))
                }
              />
              <Label htmlFor='project_current'>This is ongoing</Label>
            </div>
            <div className='space-y-2'>
              <Label>URL</Label>
              <Input
                value={projectForm.url}
                onChange={(e) => setProjectForm((c) => ({ ...c, url: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm((c) => ({ ...c, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Score Dialog */}
      <Dialog open={testScoreDialogOpen} onOpenChange={setTestScoreDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingTestScoreId ? 'Edit Test Score' : 'Add Test Score'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label>Test Name</Label>
              <Input
                placeholder='e.g. SAT, GRE, Mensa IQ Test'
                value={testScoreForm.test_name}
                onChange={(e) => setTestScoreForm((c) => ({ ...c, test_name: e.target.value }))}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Score</Label>
                <Input
                  value={testScoreForm.score}
                  onChange={(e) => setTestScoreForm((c) => ({ ...c, score: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label>Max Score</Label>
                <Input
                  value={testScoreForm.max_score}
                  onChange={(e) => setTestScoreForm((c) => ({ ...c, max_score: e.target.value }))}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Test Date</Label>
              <Input
                placeholder='e.g. Nov 2023'
                value={testScoreForm.test_date}
                onChange={(e) => setTestScoreForm((c) => ({ ...c, test_date: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Proof URL</Label>
              <Input
                value={testScoreForm.proof_url}
                onChange={(e) => setTestScoreForm((c) => ({ ...c, proof_url: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={testScoreForm.description}
                onChange={(e) =>
                  setTestScoreForm((c) => ({ ...c, description: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setTestScoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTestScore}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mentoring Listing Dialog */}
      <Dialog open={mentoringListingDialogOpen} onOpenChange={setMentoringListingDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {editingMentoringListingId ? 'Edit Mentoring Listing' : 'Add Mentoring Listing'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label>Service Name</Label>
              <Input
                placeholder='e.g. Calculus Tutoring'
                value={mentoringListingForm.service_name}
                onChange={(e) =>
                  setMentoringListingForm((c) => ({ ...c, service_name: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label>Qualifications</Label>
              <Textarea
                value={mentoringListingForm.qualifications}
                onChange={(e) =>
                  setMentoringListingForm((c) => ({ ...c, qualifications: e.target.value }))
                }
                rows={2}
              />
            </div>
            <div className='space-y-2'>
              <Label>Approved Subjects</Label>
              <Input
                placeholder='e.g. Algebra, Calculus, Statistics'
                value={mentoringListingForm.approved_subjects}
                onChange={(e) =>
                  setMentoringListingForm((c) => ({ ...c, approved_subjects: e.target.value }))
                }
              />
              <p className='text-xs text-muted-foreground'>Comma-separated list</p>
            </div>
            <div className='space-y-2'>
              <Label>Examples of Expertise</Label>
              <Textarea
                value={mentoringListingForm.examples_of_expertise}
                onChange={(e) =>
                  setMentoringListingForm((c) => ({
                    ...c,
                    examples_of_expertise: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Years in Practice</Label>
                <Input
                  placeholder='e.g. 5 years'
                  value={mentoringListingForm.years_in_practice}
                  onChange={(e) =>
                    setMentoringListingForm((c) => ({ ...c, years_in_practice: e.target.value }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>Price</Label>
                <Input
                  type='number'
                  placeholder='e.g. 50'
                  value={mentoringListingForm.price}
                  onChange={(e) =>
                    setMentoringListingForm((c) => ({ ...c, price: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Policies</Label>
              <Textarea
                value={mentoringListingForm.policies}
                onChange={(e) =>
                  setMentoringListingForm((c) => ({ ...c, policies: e.target.value }))
                }
                rows={2}
              />
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='mentoring_listing_active'
                checked={mentoringListingForm.is_active}
                onCheckedChange={(checked) =>
                  setMentoringListingForm((c) => ({ ...c, is_active: checked === true }))
                }
              />
              <Label htmlFor='mentoring_listing_active'>Active (visible to learners)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setMentoringListingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMentoringListing}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
