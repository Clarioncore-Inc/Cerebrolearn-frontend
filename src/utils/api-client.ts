// CerebroLearn API Client
import type {
  User,
  Course,
  Lesson,
  Enrollment,
  CourseAnalytics,
  CreatorEarnings,
  Subscriber,
  Review,
  Comment,
  Organization,
  PlatformSettings,
} from '../types/database';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CourseCommentAuthor {
  email?: string;
  full_name?: string;
  role?: string;
  org_id?: string;
  avatar?: string;
  bio?: string;
  country?: string;
  phone_number?: string;
  location?: string;
  id?: string;
  xp?: number;
  streak?: number;
  is_active?: boolean;
  is_suspended?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseCommentRecord {
  id: string;
  content: string;
  resolved: boolean;
  author?: CourseCommentAuthor;
  course_id?: string;
  parent_id?: string | null;
  replies?: CourseCommentRecord[];
  created_at?: string;
  updated_at?: string;
}

export interface CourseHistoryActor {
  id?: string;
  full_name?: string;
  email?: string;
}

export interface CourseHistoryChanges {
  action?: string;
  data?: Record<string, unknown>;
}

export interface CourseHistoryRecord {
  id: string;
  action?: string;
  event?: string;
  description?: string;
  user?: string;
  actor_name?: string;
  actor?: CourseHistoryActor;
  changed_by?: CourseHistoryActor;
  changes?: CourseHistoryChanges;
  course_id?: string;
  created_at?: string;
  updated_at?: string;
  timestamp?: string;
}

export type DiscussionCategory = 'general_discussion' | 'question' | 'resource';

export interface DiscussionUserRecord {
  id?: string;
  email?: string;
  full_name?: string;
  name?: string;
  role?: string;
}

export interface DiscussionReplyRecord {
  id: string;
  post_id: string;
  user_id: string;
  user?: DiscussionUserRecord | null;
  content: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  replies?: DiscussionReplyRecord[];
}

export interface DiscussionPostRecord {
  id: string;
  user_id: string;
  user?: DiscussionUserRecord | null;
  title: string;
  category: DiscussionCategory;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  replies?: DiscussionReplyRecord[];
}

export interface CourseActivity {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  lesson_index?: number | null;
  progress: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export type LearningGoalType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type LearningGoalUnit = 'lessons' | 'hours' | 'courses' | 'quizzes';

export interface LearningGoalRecord {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  type?: LearningGoalType;
  goal_type?: LearningGoalType;
  target: number;
  current: number;
  unit: LearningGoalUnit;
  deadline?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyStatsTodayRecord {
  lessons: number;
  hours: number;
  quizzes: number;
}

export interface StudyStatsPeriodRecord extends StudyStatsTodayRecord {
  courses: number;
}

export interface StudyStatsRecord {
  today: StudyStatsTodayRecord;
  this_week: StudyStatsPeriodRecord;
  this_month: StudyStatsPeriodRecord;
  streak: number;
  total_study_time: number;
}

export interface LearningStreakRecord {
  current: number;
  longest: number;
  last_active?: string | null;
  total_days: number;
  freezes_available: number;
  calendar: Record<string, number>;
}

export interface ProgressDashboardStatsRecord {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_hours_learned: number;
  average_progress: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
  certificates_earned: number;
  lessons_completed: number;
}

export interface ProgressDashboardEnrollmentRecord {
  id: string;
  course_id: string;
  course_title: string;
  progress: number;
  completed: boolean;
  enrolled_at?: string | null;
  last_accessed?: string | null;
}

export interface WeeklyActivityRecord {
  day: string;
  date: string;
  minutes: number;
}

export interface RecentActivityRecord {
  type: string;
  text: string;
  occurred_at: string;
}

export interface ProgressDashboardRecord {
  stats: ProgressDashboardStatsRecord;
  enrollments: ProgressDashboardEnrollmentRecord[];
  weekly_activity: WeeklyActivityRecord[];
  recent_activity: RecentActivityRecord[];
}

const BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('cerebrolearn.auth.token');
}

function normalizeApiErrorMessage(error: any, status: number): string {
  const pickMessage = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value;

    if (Array.isArray(value)) {
      const items = value
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item.msg || item.message || item.detail || null;
          }
          return null;
        })
        .filter(Boolean);

      return items.length ? items.join(', ') : null;
    }

    if (typeof value === 'object') {
      return (
        value.detail ||
        value.message ||
        value.msg ||
        (Object.keys(value).length ? 'Request failed. Please try again.' : null)
      );
    }

    return String(value);
  };

  return (
    pickMessage(error?.detail) ||
    pickMessage(error?.error) ||
    pickMessage(error?.message) ||
    `HTTP ${status}`
  );
}

// Helper to make API requests
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(normalizeApiErrorMessage(error, response.status));
  }

  // 204 No Content — no body to parse
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  return response.json();
}

// ========================================
// AUTH API
// ========================================

export const authApi = {
  signup: (data: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
    org_id?: string;
  }) => request<{ success: boolean; user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => request<User>('/accounts/profile'),

  updateProfile: (updates: Partial<User>) =>
    request<User>('/accounts/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) =>
    request<{ success: boolean }>('/accounts/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// COURSES API
// ========================================

export const coursesApi = {
  create: (data: {
    title: string;
    description: string;
    category: string;
    // new schema fields
    sub_title?: string;
    rating?: number;
    total_reviews?: number;
    total_enrollments?: number;
    level?: string;
    org_id?: string;
    is_public?: boolean;
    cover_image?: string;
    subcategory?: string;
    price?: number;
    discount?: number;
    currency?: string;
    estimated_hours?: number;
    tags?: string[];
    status?: string;
    course_goals?: string[];
    learning_objectives?: string[];
    prerequisites?: string[];
    who_this_course_is_for?: string;
    enable_discussions?: boolean;
    enable_reviews?: boolean;
    enable_certificates?: boolean;
    maximum_students?: number;
    sections?: Array<{
      title: string;
      lessons: Array<{
        title: string;
        type?: string;
        duration?: string;
        content?: string;
      }>;
    }>;
  }) =>
    request<Course>('/courses/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (page = 1, size = 100) =>
    request<{ items: Course[]; total: number; page: number; pages: number }>(
      `/courses/?page=${page}&size=${size}`,
    ),

  getById: (courseId: string) =>
    request<Course & { lessons: Lesson[] }>(`/courses/${courseId}`),

  getActivity: (courseId: string) =>
    request<CourseActivity>(`/courses/activity?course_id=${courseId}`),

  saveActivity: (data: {
    course_id: string;
    lesson_id: string;
    lesson_index?: number;
    progress: number;
    last_accessed_at?: string;
  }) =>
    request<CourseActivity>('/courses/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getForEdit: (courseId: string) =>
    request<Course>(`/courses/${courseId}`),

  update: (courseId: string, updates: Partial<Course>) =>
    request<Course>(`/courses/${courseId}/bulk`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (courseId: string) =>
    request<{ success: boolean }>(`/courses/${courseId}`, { method: 'DELETE' }),

  getReviews: (courseId: string) =>
    request<Review[]>(`/courses/${courseId}/reviews`),

  getComments: (courseId: string) =>
    request<PaginatedResponse<CourseCommentRecord>>(`/courses/${courseId}/comments/`),

  getHistory: (courseId: string) =>
    request<CourseHistoryRecord[] | PaginatedResponse<CourseHistoryRecord>>(
      `/courses/${courseId}/history`,
    ),

  addComment: (courseId: string, content: string) =>
    request<CourseCommentRecord>(`/courses/${courseId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  updateComment: (
    commentId: string,
    updates: { content: string; resolved: boolean },
  ) =>
    request<CourseCommentRecord>(`/courses/comments/${commentId}/`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteComment: (commentId: string) =>
    request<null>(`/courses/comments/${commentId}/`, {
      method: 'DELETE',
    }),
};

// ========================================
// LESSONS API
// ========================================

export const lessonsApi = {
  create: (data: {
    section_id: string;
    title: string;
    kind: string;
    tag?: string;
    content?: string;
    position?: number;
    duration_minutes?: number;
    is_free?: boolean;
    xp_reward?: number;
    difficulty?: string;
    heading_content?: Array<{ position: number; text: string; level: number }>;
    text_content?: Array<{ position: number; body: string; estimated_read_minutes?: number; attachment_ids?: string[] }>;
    video_content?: Array<{ position: number; external_url?: string; video_id?: string; duration_seconds?: number; transcript?: string; allow_download?: boolean }>;
    image_content?: Array<{ position: number; image_id?: string; caption?: string; alt_text?: string }>;
    code_content?: Array<{ position: number; code: string; language: string; filename?: string; show_line_numbers?: boolean }>;
    hint_content?: Array<{ position: number; text: string; is_collapsible?: boolean }>;
    callout_content?: Array<{ position: number; text: string; callout_type?: string; title?: string }>;
    quiz_content?: Array<{
      position: number;
      passing_score?: number;
      max_attempts?: number;
      time_limit_minutes?: number;
      shuffle_questions?: boolean;
      show_correct_answers?: boolean;
      questions?: Array<{ position: number; question_type: string; text: string; explanation?: string; points?: number; options?: Array<{ text: string; is_correct: boolean }> }>;
    }>;
    problem_content?: Array<{
      position: number;
      statement: string;
      starter_code?: string;
      solution_code?: string;
      language?: string;
      time_limit_seconds?: number;
      memory_limit_mb?: number;
      hints?: string[];
      test_cases?: Array<{ position: number; input: string; expected_output: string; is_sample?: boolean }>;
    }>;
    interactive_content?: Array<{
      position: number;
      passing_score?: number;
      steps?: Array<{ position: number; step_type: string; title?: string; instructions?: string; payload?: any; points?: number }>;
    }>;
  }) =>
    request<Lesson>('/lessons/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (lessonId: string) =>
    request<Lesson>(`/lessons/${lessonId}`),

  update: (lessonId: string, data: Partial<{
    title: string;
    kind: string;
    tag?: string;
    content?: string;
    position?: number;
    duration_minutes?: number;
    is_free?: boolean;
    xp_reward?: number;
    difficulty?: string;
    heading_content?: Array<{ position: number; text: string; level: number }>;
    text_content?: Array<{ position: number; body: string; estimated_read_minutes?: number; attachment_ids?: string[] }>;
    video_content?: Array<{ position: number; external_url?: string; video_id?: string; duration_seconds?: number; transcript?: string; allow_download?: boolean }>;
    image_content?: Array<{ position: number; image_id?: string; caption?: string; alt_text?: string }>;
    code_content?: Array<{ position: number; code: string; language: string; filename?: string; show_line_numbers?: boolean }>;
    hint_content?: Array<{ position: number; text: string; is_collapsible?: boolean }>;
    callout_content?: Array<{ position: number; text: string; callout_type?: string; title?: string }>;
    quiz_content?: Array<{
      position: number;
      passing_score?: number;
      max_attempts?: number;
      time_limit_minutes?: number;
      shuffle_questions?: boolean;
      show_correct_answers?: boolean;
      questions?: Array<{ position: number; question_type: string; text: string; explanation?: string; points?: number; options?: Array<{ text: string; is_correct: boolean }> }>;
    }>;
    problem_content?: Array<{
      position: number;
      statement: string;
      starter_code?: string;
      solution_code?: string;
      language?: string;
      time_limit_seconds?: number;
      memory_limit_mb?: number;
      hints?: string[];
      test_cases?: Array<{ position: number; input: string; expected_output: string; is_sample?: boolean }>;
    }>;
    interactive_content?: Array<{
      position: number;
      passing_score?: number;
      steps?: Array<{ position: number; step_type: string; title?: string; instructions?: string; payload?: any; points?: number }>;
    }>;
  }>) =>
    request<Lesson>(`/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getComments: (lessonId: string) =>
    request<Comment[]>(`/lessons/${lessonId}/comments`),
};

// ========================================
// VIDEO LESSONS API
// ========================================
export const videoLessonsApi = {
  create: (data: {
    lesson_id: string;
    video_id?: string;
    external_url?: string;
    duration_seconds?: number;
    transcript?: string;
    allow_download?: boolean;
  }) =>
    request<any>('/video-lessons/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (lessonId: string, data: {
    video_id?: string;
    external_url?: string;
    duration_seconds?: number;
    transcript?: string;
    allow_download?: boolean;
  }) =>
    request<any>(`/video-lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ========================================
// ENROLLMENTS API
// ========================================

export const enrollmentsApi = {
  enroll: (courseId: string) =>
    request<Enrollment>('/enrollments/', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    }),

  getMy: () => request<Enrollment[]>('/enrollments/'),

  getByCourse: (courseId: string) =>
    request<{ enrollments: any[] }>(`/enrollments/course/${courseId}`),

  remove: (enrollmentId: string) =>
    request<{ success: boolean }>(`/enrollments/${enrollmentId}`, { method: 'DELETE' }),
};

// ========================================
// PROGRESS API
// ========================================

export const progressApi = {
  save: (data: { lesson_id: string; percent: number; state?: any }) =>
    request<any>('/progress/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (lessonId: string) =>
    request<any>(`/progress/lesson/${lessonId}`),
};

// ========================================
// QUIZ API
// ========================================

// Quiz attempts are not yet implemented in the FastAPI backend
export const quizApi = {
  submitAttempt: (_data: any) => Promise.resolve({ success: false, attempt: null }),
};

// ========================================
// CREATOR API
// ========================================

export const creatorApi = {
  getCourses: () => request<Course[]>('/creator/courses'),

  getSubscribers: (courseId: string) =>
    request<Subscriber[]>(`/creator/courses/${courseId}/subscribers`),

  getAnalytics: (courseId: string) =>
    request<CourseAnalytics>(`/creator/courses/${courseId}/analytics`),

  getEarnings: () => request<CreatorEarnings>('/creator/earnings'),
};

// ========================================
// SOCIAL API
// ========================================

export const socialApi = {
  like: (lessonId: string) =>
    request<{ success: boolean; likes: number }>(`/lessons/${lessonId}/like`, { method: 'POST' }),

  unlike: (lessonId: string) =>
    request<{ success: boolean; likes: number }>(`/lessons/${lessonId}/like`, { method: 'DELETE' }),

  bookmark: (lessonId: string) =>
    request<{ success: boolean }>(`/lessons/${lessonId}/bookmark`, { method: 'POST' }),

  getBookmarks: () => request<any[]>('/bookmarks/'),

  // share is NOT implemented in the FastAPI backend
  share: (_lessonId: string, _platform: string) =>
    Promise.resolve({ success: false, shares: 0 }),

  addComment: (data: {
    lesson_id: string;
    content: string;
    parent_id?: string;
  }) =>
    request<Comment>('/comments/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// REVIEWS API
// ========================================

export const reviewsApi = {
  create: (data: { course_id: string; rating: number; comment: string }) =>
    request<Review>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { rating: number; comment: string }) =>
    request<Review>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/reviews/${id}`, {
      method: 'DELETE',
    }),

  getThreads: (id: string) =>
    request<any[]>(`/reviews/${id}/threads`),

  createThread: (id: string, data: { content: string; parent_id?: string }) =>
    request<any>(`/reviews/${id}/threads`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  reactToThread: (id: string, data: { reaction: 'like' | 'dislike' }) =>
    request<any>(`/reviews/threads/${id}/reaction`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// DISCUSSIONS API
// ========================================

export const discussionsApi = {
  list: (category?: DiscussionCategory) =>
    request<DiscussionPostRecord[]>(
      category ? `/discussions/?category=${encodeURIComponent(category)}` : '/discussions/',
    ),

  get: (id: string) => request<DiscussionPostRecord>(`/discussions/${id}`),

  create: (data: {
    title: string;
    category: DiscussionCategory;
    content: string;
  }) =>
    request<DiscussionPostRecord>('/discussions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  reply: (id: string, data: { content: string; parent_id?: string }) =>
    request<DiscussionReplyRecord>(`/discussions/${id}/replies`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  like: (id: string) =>
    request<DiscussionPostRecord>(`/discussions/${id}/like`, {
      method: 'POST',
    }),
};

// ========================================
// LEARNER API
// ========================================

export const learnerApi = {
  getGoals: () => request<LearningGoalRecord[]>('/learner/goals'),

  createGoal: (data: {
    title: string;
    description?: string;
    type: LearningGoalType;
    target: number;
    unit: LearningGoalUnit;
    deadline?: string;
  }) =>
    request<LearningGoalRecord>('/learner/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateGoal: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      type: LearningGoalType;
      target: number;
      current: number;
      unit: LearningGoalUnit;
      deadline: string | null;
      completed: boolean;
    }>,
  ) =>
    request<LearningGoalRecord>(`/learner/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGoal: (id: string) =>
    request<void>(`/learner/goals/${id}`, {
      method: 'DELETE',
    }),

  getStudyStats: () => request<StudyStatsRecord>('/learner/study-stats'),

  getStreak: (params?: { year?: number; month?: number }) => {
    const query = new URLSearchParams();
    if (typeof params?.year === 'number') query.set('year', String(params.year));
    if (typeof params?.month === 'number') query.set('month', String(params.month));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request<LearningStreakRecord>(`/learner/streak${suffix}`);
  },

  logStreakActivity: (data: {
    minutes?: number;
    lessons_completed?: number;
    quizzes_completed?: number;
    courses_completed?: number;
    activity_date?: string;
  }) =>
    request<LearningStreakRecord>('/learner/streak/log-activity', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  useStreakFreeze: (data?: { activity_date?: string }) =>
    request<LearningStreakRecord>('/learner/streak/use-freeze', {
      method: 'POST',
      body: JSON.stringify(data ?? {}),
    }),

  getProgressDashboard: () => request<ProgressDashboardRecord>('/learner/progress-dashboard'),
};

// ========================================
// GAMIFICATION API
// ========================================

export const gamificationApi = {
  // awardBadge is NOT implemented in the FastAPI backend
  awardBadge: (_data: any) => Promise.resolve({ success: false, badges: [] }),

  getLeaderboard: () => request<User[]>('/leaderboard/'),
};

// ========================================
// ORGANIZATIONS API
// ========================================

// Organizations are NOT implemented in the FastAPI backend
export const organizationsApi = {
  create: (_data: any) => Promise.resolve({ success: false, organization: null as Organization | null }),
  getById: (_orgId: string) => Promise.resolve({ organization: null as Organization | null }),
};

// ========================================
// PAYMENT API
// ========================================

export const paymentsApi = {
  create: (data: {
    amount: number;
    currency: string;
    provider: string;
    course_id?: string;
    org_id?: string;
  }) =>
    request<{ success: boolean; payment: any; paymentId: string }>('/payments/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (paymentId: string, data: { status: string; provider_txn_id?: string }) =>
    request<{ success: boolean; payment: any }>(`/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ========================================
// ADMIN API
// ========================================

export const adminApi = {
  getUsers: () => request<{ users?: User[]; items?: User[]; total?: number }>('/admin/users'),

  getCourses: () => request<{ items: Course[]; total: number }>('/admin/courses'),

  getAnalytics: () =>
    request<
      | {
          total_users: number;
          total_courses: number;
          total_enrollments: number;
          total_revenue: number;
        }
      | {
          analytics: {
            total_users: number;
            total_courses: number;
            total_enrollments: number;
            total_revenue: number;
          };
        }
    >('/admin/analytics'),

  updateUserRole: (userId: string, role: string) =>
    request<{ success: boolean; user: User }>(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  updateUserStatus: (userId: string, suspended: boolean) =>
    request<{ success: boolean; user: User }>(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ suspended }),
    }),

  getSettings: () => request<{ settings: PlatformSettings }>('/admin/settings'),

  updateSettings: (updates: Partial<PlatformSettings>) =>
    request<{ success: boolean; settings: PlatformSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// ========================================
// SESSION TYPE API (Admin)
// ========================================

export interface SessionType {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionTypeCreate {
  name: string;
  price: number;
  description?: string;
}

export interface SessionTypeUpdate {
  name?: string;
  price?: number;
  description?: string;
}

export const sessionTypeApi = {
  list: () => request<SessionType[]>('/admin/session-types'),

  get: (id: string) => request<SessionType>(`/admin/session-types/${id}`),

  create: (data: SessionTypeCreate) =>
    request<SessionType>('/admin/session-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: SessionTypeUpdate) =>
    request<SessionType>(`/admin/session-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<null>(`/admin/session-types/${id}`, { method: 'DELETE' }),
};

// ========================================
// STORAGE API
// ========================================
export const storageApi = {
  start: (data: {
    file_type: string;
    filename: string;
    mime_type: string;
    create_type: string;
  }) =>
    request<{
      id: string;
      url: string;
      fields: Record<string, string>;
    }>('/storages/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (id: string) =>
    request<{ id: string; url: string }>(`/storages/${id}`),

  finish: (id: string, data: { thumbnail?: string } = {}) =>
    request<{ id: string; url: string; thumbnail?: string }>(`/storages/${id}/finish`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// MEETING CONFIG API
// ========================================
export interface MeetingConfig {
  id: string;
  name: string;
  link: string;
  password?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetingConfigUpsert {
  name: string;
  link: string;
  password?: string;
}

export const meetingConfigApi = {
  get: () => request<MeetingConfig>('/admin/meeting-config'),
  upsert: (data: MeetingConfigUpsert) =>
    request<MeetingConfig>('/admin/meeting-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ========================================
// PSYCHOLOGIST API
// ========================================
export const psychologistApi = {
  list: () =>
    request<any[] | { items?: any[]; results?: any[] }>('/psychologist/list/'),

  getOwnProfile: () => request<any>('/psychologist/profile'),

  invite: (data: { email: string }) =>
    request<any>('/psychologist/admin/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAvailability: (id: string) =>
    request<{
      id: string;
      psychologist_id: string;
      schedule: Record<string, { enabled: boolean; start: string; end: string }>;
      created_at?: string;
      updated_at?: string;
      working_days?: number;
      total_hours?: number;
    }>(`/psychologist/${id}/availability/`),

  updateAvailability: (
    id: string,
    data: Record<string, { enabled: boolean; start: string; end: string }>,
  ) =>
    request<any>(`/psychologist/${id}/availability/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBookings: () =>
    request<any[] | { items?: any[]; results?: any[]; bookings?: any[] }>(
      '/psychologist/bookings',
    ),

  createBooking: (data: {
    psychologist_id: string;
    date: string | null;
    time: string;
    booking_type: 'standard' | 'emergency';
    session_type: string;
    notes: string;
    is_recurring: boolean;
    recurring_frequency: string;
    reminder_preferences: string;
    price: number;
  }) =>
    request<any>('/psychologist/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBooking: (data: {
    booking_id: string;
    status: 'confirmed' | 'cancelled' | 'completed';
    rejection_reason?: string;
  }) =>
    request<any>(`/psychologist/bookings/${data.booking_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: data.status,
        rejection_reason: data.rejection_reason,
      }),
    }),

  getBookingNotes: (bookingId: string) =>
    request<any>(`/psychologist/bookings/${bookingId}/notes`),

  updateBookingNotes: (
    bookingId: string,
    data: {
      meeting_platform?: 'zoom' | 'google_meet' | 'other';
      meeting_link?: string;
      session_summary?: string;
      presenting_concerns?: string;
      observations?: string;
      interventions_used?: string[];
      risk_assessment?: string;
      homework_assigned?: string;
      follow_up_plan?: string;
      next_session_focus?: string;
      private_notes?: string;
      next_session_recommended?: boolean;
    },
  ) =>
    request<any>(`/psychologist/bookings/${bookingId}/notes`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') =>
    request<any>(`/psychologist/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  register: (data: {
    email: string;
    full_name: string;
    password: string;
    bio: string;
    license_number: string;
    years_of_experience: string;
    specialization: string;
    about_you: string;
    location: string;
  }) =>
    request<{ success: boolean }>('/psychologist/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data: {
    qualifications?: string;
    certifications?: string;
    is_approved?: boolean;
    hourly_rate?: number;
    bio?: string;
    default_session_duration?: number;
    default_booking_type?: 'standard' | 'emergency';
    allow_emergency_bookings?: boolean;
    is_profile_public?: boolean;
    accepting_new_clients?: boolean;
    visible_profile_fields?: {
      bio?: boolean;
      location?: boolean;
      phone_number?: boolean;
      hourly_rate?: boolean;
    };
    user?: {
      avatar?: string;
      phone_number?: string;
      location?: string;
    };
  }) =>
    request<any>('/psychologist/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  listSessionTypes: () => request<SessionType[]>('/psychologist/session-types'),
};

// Export all APIs
export const api = {
  auth: authApi,
  courses: coursesApi,
  lessons: lessonsApi,
  enrollments: enrollmentsApi,
  progress: progressApi,
  quiz: quizApi,
  creator: creatorApi,
  social: socialApi,
  reviews: reviewsApi,
  learner: learnerApi,
  gamification: gamificationApi,
  organizations: organizationsApi,
  payments: paymentsApi,
  admin: adminApi,
  psychologist: psychologistApi,
  storage: storageApi,
  videoLessons: videoLessonsApi,
};

export default api;