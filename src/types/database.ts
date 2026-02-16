// CerebroLearn Database Type Definitions

export type UserRole = 'learner' | 'creator' | 'admin' | 'org_admin';
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
  role: UserRole;
  org_id: string | null;
  avatar: string | null;
  bio: string | null;
  country: string | null;
  xp: number;
  streak: number;
  badges: Badge[];
  suspended?: boolean;
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

export interface Bookmark {
  user_id: string;
  lesson_id: string;
  created_at: string;
}

export interface Share {
  id: string;
  user_id: string;
  lesson_id: string;
  platform: SharePlatform;
  created_at: string;
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
