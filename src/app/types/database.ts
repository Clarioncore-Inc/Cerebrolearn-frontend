// CerebroLearn Database Type Definitions

export type UserRole =
  | 'learner'
  | 'iq_user'
  | 'creator'
  | 'instructor'
  | 'admin'
  | 'org_admin'
  | 'psychologist'
  | 'psychologist_pending';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type LessonKind = 'video' | 'interactive' | 'article' | 'quiz' | 'practice';
export type StepType = 'text' | 'image' | 'video' | 'question' | 'code' | 'diagram' | 'explanation';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentProvider = 'stripe' | 'flutterwave' | 'paystack';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy';

export interface User {
  id: string;
  email: string;
  full_name: string;
  username?: string | null;
  aliases?: string[] | null;
  role: UserRole;
  org_id: string | null;
  avatar: string | null;
  cover_photo: string | null;
  bio: string | null;
  country: string | null;
  phone_number?: string | null;
  location?: string | null;
  personality?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  birthplace?: string | null;
  languages?: string[] | null;
  culture?: string | null;
  admin_type?: string | null;
  official_title?: string | null;
  licenses_certifications?: string[] | null;
  social_links?: Record<string, string> | null;
  websites?: string[] | null;
  xp: number;
  streak: number;
  badges: Badge[];
  suspended?: boolean;
  is_suspended?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  last_active?: string;
}

export interface Course {
  id: string;
  org_id: string | null;
  title: string;
  description: string;
  cover_image: string | null;
  category: string;
  subcategory: string | null;
  level: CourseLevel;
  price: number;
  currency: string;
  public: boolean;
  status: CourseStatus;
  created_by: string;
  rating: number;
  total_reviews: number;
  enrollments: number;
  estimated_hours: number;
  tags: string[];
  likes?: number;
  shares?: number;
  created_at: string;
  updated_at?: string;
  published_at: string | null;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  position: number;
  duration_minutes: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  kind: LessonKind;
  content: any;
  position: number;
  duration_minutes: number;
  is_free: boolean;
  likes?: number;
  shares?: number;
  created_at: string;
  updated_at?: string;
}

export interface LessonStep {
  id: string;
  lesson_id: string;
  type: StepType;
  content: any;
  position: number;
  hints: string[];
  solution: any;
  points: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  progress: number;
  enrolled_at: string;
  completed_at: string | null;
  last_accessed?: string;
}

export interface Progress {
  user_id: string;
  lesson_id: string;
  percent: number;
  state: any;
  completed: boolean;
  time_spent_seconds: number;
  last_seen_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: any[];
  score: number;
  passed: boolean;
  started_at: string;
  finished_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string | null;
  org_id: string | null;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  provider_txn_id: string | null;
  status: PaymentStatus;
  created_at: string;
  updated_at?: string;
}

export interface AppSettings {
  id: string;
  app_name: string;
  logo: string | null;
  contacts: string | null;
  email: string | null;
  iq_test_price: number;
  refresh_booking_in_minute: number;
  psychologist_booking_reminder_in_minutes: number;
  created_at: string;
  updated_at?: string;
}

export interface Payout {
  id: string;
  creator_id: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  payment_method: string;
  payment_details: any;
  processed_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  likes: number;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface Badge {
  id?: string;
  name: string;
  icon: string;
  description: string;
  criteria?: any;
  rarity?: BadgeRarity;
  earned_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  subscription_plan: SubscriptionPlan;
  max_members: number;
  created_by: string;
  created_at: string;
  settings?: any;
}

export interface Analytics {
  date: string;
  course_id: string | null;
  creator_id: string | null;
  views: number;
  enrollments: number;
  completions: number;
  revenue: number;
  active_users: number;
  engagement_minutes: number;
}

export interface CourseAnalytics {
  subscribers: number;
  views: number;
  revenue: number;
  completionRate: number;
  avgProgress: number;
  activeStudents: number;
  viewsByDay: { date: string; views: number }[];
  enrollmentsByDay: { date: string; enrollments: number }[];
}

export interface CreatorEarnings {
  totalRevenue: number;
  creatorEarnings: number;
  totalPaidOut: number;
  pendingPayout: number;
  payouts: Payout[];
  revenueByMonth: Record<string, number>;
  revenueByCourse: {
    courseId: string;
    courseTitle: string;
    revenue: number;
    earnings: number;
    sales: number;
  }[];
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  country: string | null;
  avatar: string | null;
  enrolled_at: string;
  last_accessed: string;
  progress: number;
  status: EnrollmentStatus;
}

export interface Like {
  user_id: string;
  lesson_id: string;
  created_at: string;
}

export type BookmarkObjectType = 'lesson' | 'course';

export interface BookmarkCourseObject {
  id: string;
  title: string;
  category: string;
  subcategory?: string | null;
}

export interface Bookmark {
  id: string;
  user_id: string;
  object_id: string;
  object_type: BookmarkObjectType;
  lesson?: Lesson | null;
  course?: BookmarkCourseObject | null;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  course_id?: string | null;
  course_title?: string | null;
  lesson_id?: string | null;
  lesson_title?: string | null;
  tags?: string[] | null;
  color: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  user_id: string;
  school: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  user_id: string;
  company: string;
  title?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Honor {
  id: string;
  user_id: string;
  title: string;
  issuer?: string | null;
  date_awarded?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interest {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Cause {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CognitiveProfile {
  id: string;
  user_id: string;
  creative?: number | null;
  logical_perceptual?: number | null;
  analytical?: number | null;
  existential?: number | null;
  long_term_memory?: number | null;
  implicit?: number | null;
  linguistic?: number | null;
  musical_rhythmic?: number | null;
  intrapersonal?: number | null;
  naturalistic?: number | null;
  motivational?: number | null;
  logical_mathematical?: number | null;
  bodily_kinesthetic?: number | null;
  visual_spatial?: number | null;
  interpersonal?: number | null;
  practical?: number | null;
  self_awareness?: number | null;
  self_regulation?: number | null;
  empathy?: number | null;
  social_intelligence?: number | null;
  perceptual?: number | null;
  current_iq_estimate?: number | null;
  potential_max_iq?: number | null;
  official_iq?: number | null;
  official_iq_booking_id?: string | null;
  public_ranking_opt_in: boolean;
  public_ranking_consented_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Patent {
  id: string;
  user_id: string;
  title: string;
  patent_number?: string | null;
  issuing_office?: string | null;
  filing_date?: string | null;
  grant_date?: string | null;
  description?: string | null;
  url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  user_id: string;
  title: string;
  publisher?: string | null;
  publication_date?: string | null;
  url?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestScore {
  id: string;
  user_id: string;
  test_name: string;
  score?: string | null;
  max_score?: string | null;
  test_date?: string | null;
  description?: string | null;
  proof_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentoringListingUser {
  id: string;
  full_name: string;
  username?: string | null;
  role: string;
  xp: number;
  streak: number;
  avatar?: string | null;
  location?: string | null;
}

export interface MentoringListing {
  id: string;
  user_id: string;
  user?: MentoringListingUser | null;
  service_name: string;
  qualifications?: string | null;
  approved_subjects?: string[] | null;
  examples_of_expertise?: string | null;
  years_in_practice?: string | null;
  policies?: string | null;
  price?: number | null;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface MentoringReview {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewer?: MentoringListingUser | null;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentorDaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

export interface MentorSchedule {
  id: string;
  user_id: string;
  schedule: {
    monday: MentorDaySchedule;
    tuesday: MentorDaySchedule;
    wednesday: MentorDaySchedule;
    thursday: MentorDaySchedule;
    friday: MentorDaySchedule;
    saturday: MentorDaySchedule;
    sunday: MentorDaySchedule;
  };
  created_at: string;
  updated_at: string;
}

export interface Share {
  id: string;
  user_id: string;
  lesson_id: string;
  platform: SharePlatform;
  created_at: string;
}

export interface PublicProfile {
  id: string;
  full_name: string;
  username?: string | null;
  aliases?: string[] | null;
  role: string;
  xp: number;
  streak: number;
  avatar?: string | null;
  cover_photo?: string | null;
  bio?: string | null;
  location?: string | null;
  personality?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  birthplace?: string | null;
  languages?: string[] | null;
  culture?: string | null;
  official_title?: string | null;
  licenses_certifications?: string[] | null;
  social_links?: Record<string, string> | null;
  websites?: string[] | null;
  created_at: string;
}

export interface FollowUser {
  id: string;
  full_name: string;
  username?: string | null;
  role: string;
  xp: number;
  streak: number;
  avatar?: string | null;
  location?: string | null;
}

export interface FollowStatus {
  is_following: boolean;
  followers_count: number;
  following_count: number;
}

export type ActivityType =
  | 'follow'
  | 'discussion_post'
  | 'review'
  | 'enrollment'
  | 'mentoring_listing';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  created_at: string;
  actor: FollowUser;
  target_user?: FollowUser | null;
  course_id?: string | null;
  title?: string | null;
  snippet?: string | null;
  rating?: number | null;
}

export interface PlatformSettings {
  commission_rate: number;
  currency: string;
  payment_providers: {
    stripe_enabled: boolean;
    flutterwave_enabled: boolean;
  };
  features: {
    social_login: boolean;
    organizations: boolean;
    discussions: boolean;
  };
  updated_at?: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id?: string;
  changes?: any;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
}

export interface UserResponse extends ApiResponse<User> {
  user?: User;
}

export interface CourseResponse extends ApiResponse<Course> {
  course?: Course;
  lessons?: Lesson[];
}

export interface CoursesResponse extends ApiResponse<Course[]> {
  courses?: Course[];
}

export interface EnrollmentsResponse extends ApiResponse<Enrollment[]> {
  enrollments?: Enrollment[];
}

export interface SubscribersResponse extends ApiResponse<Subscriber[]> {
  subscribers?: Subscriber[];
}

export interface AnalyticsResponse extends ApiResponse<CourseAnalytics> {
  analytics?: CourseAnalytics;
}

export interface EarningsResponse extends ApiResponse<CreatorEarnings> {
  earnings?: CreatorEarnings;
}

export interface ReviewsResponse extends ApiResponse<Review[]> {
  reviews?: Review[];
}

export interface CommentsResponse extends ApiResponse<Comment[]> {
  comments?: Comment[];
}

export interface LeaderboardResponse extends ApiResponse<User[]> {
  leaderboard?: User[];
}

export interface BookmarksResponse extends ApiResponse<Bookmark[]> {
  bookmarks?: Bookmark[];
}

export interface PublicRankingEntry {
  user_id: string;
  full_name: string;
  username?: string | null;
  avatar?: string | null;
  location?: string | null;
  official_iq: number;
}

export interface PublicRankedProfile extends PublicProfile {
  educations: Education[];
  work_experiences: WorkExperience[];
  honors: Honor[];
  interests: Interest[];
  causes: Cause[];
  skills: Skill[];
  cognitive_profile: CognitiveProfile | null;
  patents: Patent[];
  publications: Publication[];
  projects: Project[];
  test_scores: TestScore[];
}
