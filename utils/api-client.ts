/// <reference types="vite/client" />

// CerebroLearn API Client
import type {
  AppSettings,
  User,
  Course,
  Lesson,
  Bookmark,
  Note,
  Enrollment,
  CourseAnalytics,
  CreatorEarnings,
  Subscriber,
  Review,
  Comment,
  Organization,
  Payment,
  PlatformSettings,
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


const BASE_URL = import.meta.env.VITE_API_BASE_URL

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
    request<{ access_token: string; token_type: string; user: User; is_first_login: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  googleLogin: (data: { credential: string; role?: string }) =>
    request<{ access_token: string; token_type: string; user: User; is_first_login: boolean }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  googleLookup: (data: { credential: string }) =>
    request<{ exists: boolean; role?: string | null }>('/auth/google/lookup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  facebookLogin: (data: { access_token: string; role?: string }) =>
    request<{ access_token: string; token_type: string; user: User; is_first_login: boolean }>('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  facebookLookup: (data: { access_token: string }) =>
    request<{ exists: boolean; role?: string | null }>('/auth/facebook/lookup', {
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

  getPublished: (page = 1, size = 100) =>
    request<{ items: Course[]; total: number; page: number; pages: number }>(
      `/courses/public/?page=${page}&size=${size}`,
    ),

  getById: (courseId: string) =>
    request<Course & { lessons: Lesson[] }>(`/courses/${courseId}`),

  getPublishedById: (courseId: string) =>
    request<Course & { lessons: Lesson[] }>(`/courses/public/${courseId}`),

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

  bookmarkLesson: (lessonId: string) =>
    request<Bookmark>(`/lessons/${lessonId}/bookmark`, { method: 'POST' }),

  unbookmarkLesson: (lessonId: string) =>
    request<void>(`/lessons/${lessonId}/bookmark`, { method: 'DELETE' }),

  bookmarkCourse: (courseId: string) =>
    request<Bookmark>(`/courses/${courseId}/bookmark`, { method: 'POST' }),

  unbookmarkCourse: (courseId: string) =>
    request<void>(`/courses/${courseId}/bookmark`, { method: 'DELETE' }),

  bookmark: (lessonId: string) =>
    request<Bookmark>(`/lessons/${lessonId}/bookmark`, { method: 'POST' }),

  getBookmarks: () => request<Bookmark[]>('/bookmarks/'),

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
// NOTES API
// ========================================

export const notesApi = {
  list: (params?: { courseId?: string; lessonId?: string; pinned?: boolean }) => {
    const searchParams = new URLSearchParams();

    if (params?.courseId) {
      searchParams.set('course_id', params.courseId);
    }
    if (params?.lessonId) {
      searchParams.set('lesson_id', params.lessonId);
    }
    if (typeof params?.pinned === 'boolean') {
      searchParams.set('pinned', String(params.pinned));
    }

    const query = searchParams.toString();
    return request<Note[]>(query ? `/notes/?${query}` : '/notes/');
  },

  get: (id: string) => request<Note>(`/notes/${id}`),

  create: (data: {
    title: string;
    content?: string;
    course_id?: string | null;
    lesson_id?: string | null;
    tags?: string[];
    color?: string;
  }) =>
    request<Note>('/notes/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: {
      title?: string;
      content?: string;
      course_id?: string | null;
      lesson_id?: string | null;
      tags?: string[];
      color?: string;
      is_pinned?: boolean;
    },
  ) =>
    request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  setPinned: (id: string, isPinned: boolean) =>
    request<Note>(`/notes/${id}/pin`, {
      method: 'PATCH',
      body: JSON.stringify({ is_pinned: isPinned }),
    }),

  delete: (id: string) =>
    request<void>(`/notes/${id}`, {
      method: 'DELETE',
    }),
};

// ========================================
// PROFILE API (Education, Work Experience, Honors, Interests)
// ========================================

export const educationApi = {
  list: () => request<Education[]>('/profile/education'),
  create: (data: {
    school: string;
    degree?: string | null;
    field_of_study?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean;
    description?: string | null;
  }) =>
    request<Education>('/profile/education', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      school: string;
      degree: string | null;
      field_of_study: string | null;
      start_date: string | null;
      end_date: string | null;
      is_current: boolean;
      description: string | null;
    }>,
  ) =>
    request<Education>(`/profile/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/education/${id}`, { method: 'DELETE' }),
};

export const workExperienceApi = {
  list: () => request<WorkExperience[]>('/profile/work-experience'),
  create: (data: {
    company: string;
    title?: string | null;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean;
    description?: string | null;
  }) =>
    request<WorkExperience>('/profile/work-experience', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      company: string;
      title: string | null;
      location: string | null;
      start_date: string | null;
      end_date: string | null;
      is_current: boolean;
      description: string | null;
    }>,
  ) =>
    request<WorkExperience>(`/profile/work-experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/work-experience/${id}`, { method: 'DELETE' }),
};

export const honorsApi = {
  list: () => request<Honor[]>('/profile/honors'),
  create: (data: {
    title: string;
    issuer?: string | null;
    date_awarded?: string | null;
    description?: string | null;
  }) =>
    request<Honor>('/profile/honors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      title: string;
      issuer: string | null;
      date_awarded: string | null;
      description: string | null;
    }>,
  ) =>
    request<Honor>(`/profile/honors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/honors/${id}`, { method: 'DELETE' }),
};

export const interestsApi = {
  list: () => request<Interest[]>('/profile/interests'),
  create: (data: { name: string }) =>
    request<Interest>('/profile/interests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ name: string }>) =>
    request<Interest>(`/profile/interests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/interests/${id}`, { method: 'DELETE' }),
};

export const causesApi = {
  list: () => request<Cause[]>('/profile/causes'),
  create: (data: { name: string }) =>
    request<Cause>('/profile/causes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ name: string }>) =>
    request<Cause>(`/profile/causes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/causes/${id}`, { method: 'DELETE' }),
};

export interface CognitiveProfileUpdatePayload {
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
  current_iq_estimate?: number | null;
  potential_max_iq?: number | null;
  memory_level?: string | null;
  memory_benchmark?: string | null;
  memory_benchmark_proof_url?: string | null;
}

export const cognitiveProfileApi = {
  get: () => request<CognitiveProfile>('/profile/cognitive-profile'),
  update: (data: CognitiveProfileUpdatePayload) =>
    request<CognitiveProfile>('/profile/cognitive-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const patentsApi = {
  list: () => request<Patent[]>('/profile/patents'),
  create: (data: {
    title: string;
    patent_number?: string | null;
    issuing_office?: string | null;
    filing_date?: string | null;
    grant_date?: string | null;
    description?: string | null;
    url?: string | null;
  }) =>
    request<Patent>('/profile/patents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      title: string;
      patent_number: string | null;
      issuing_office: string | null;
      filing_date: string | null;
      grant_date: string | null;
      description: string | null;
      url: string | null;
    }>,
  ) =>
    request<Patent>(`/profile/patents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/patents/${id}`, { method: 'DELETE' }),
};

export const publicationsApi = {
  list: () => request<Publication[]>('/profile/publications'),
  create: (data: {
    title: string;
    publisher?: string | null;
    publication_date?: string | null;
    url?: string | null;
    description?: string | null;
  }) =>
    request<Publication>('/profile/publications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      title: string;
      publisher: string | null;
      publication_date: string | null;
      url: string | null;
      description: string | null;
    }>,
  ) =>
    request<Publication>(`/profile/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/publications/${id}`, { method: 'DELETE' }),
};

export const projectsApi = {
  list: () => request<Project[]>('/profile/projects'),
  create: (data: {
    title: string;
    role?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean;
    description?: string | null;
    url?: string | null;
  }) =>
    request<Project>('/profile/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      title: string;
      role: string | null;
      start_date: string | null;
      end_date: string | null;
      is_current: boolean;
      description: string | null;
      url: string | null;
    }>,
  ) =>
    request<Project>(`/profile/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/projects/${id}`, { method: 'DELETE' }),
};

export const testScoresApi = {
  list: () => request<TestScore[]>('/profile/test-scores'),
  create: (data: {
    test_name: string;
    score?: string | null;
    max_score?: string | null;
    test_date?: string | null;
    description?: string | null;
    proof_url?: string | null;
  }) =>
    request<TestScore>('/profile/test-scores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<{
      test_name: string;
      score: string | null;
      max_score: string | null;
      test_date: string | null;
      description: string | null;
      proof_url: string | null;
    }>,
  ) =>
    request<TestScore>(`/profile/test-scores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/profile/test-scores/${id}`, { method: 'DELETE' }),
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

  createIQTestCheckoutSession: () =>
    request<{ checkout_url: string; session_id: string }>('/payments/iq-test/checkout-session', {
      method: 'POST',
    }),

  createIQTestGuestCheckoutSession: (data: {
    email: string;
    password: string;
    full_name: string;
    org_id?: string;
  }) =>
    request<{ checkout_url: string; session_id: string }>('/payments/iq-test/guest-checkout-session', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  confirmIQTestCheckoutSession: (session_id: string) =>
    request<{
      payment: Payment;
      access_token?: string;
      token_type?: string;
      user?: User;
      is_first_login?: boolean;
    }>('/payments/iq-test/confirm', {
      method: 'POST',
      body: JSON.stringify({ session_id }),
    }),
};

export const appSettingsApi = {
  getPublic: () => request<AppSettings>('/admin/app-settings/public'),

  getAdmin: () => request<AppSettings>('/admin/app-settings'),

  updateAdmin: (updates: Partial<AppSettings>) =>
    request<AppSettings>('/admin/app-settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
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

export type IQPracticeQuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface IQPracticeQuestionApiResponse {
  id: string;
  type: string;
  difficulty: IQPracticeQuestionDifficulty;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  category: string;
  test_types: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface IQPracticeQuestionCreatePayload {
  type: string;
  difficulty: IQPracticeQuestionDifficulty;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string | null;
  category: string;
  test_types: string[];
  sort_order?: number;
}

export interface IQPracticeQuestionUpdatePayload {
  type?: string;
  difficulty?: IQPracticeQuestionDifficulty;
  question?: string;
  options?: string[];
  correct_answer?: number;
  explanation?: string | null;
  category?: string;
  test_types?: string[];
  sort_order?: number;
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

export const iqPracticeQuestionsApi = {
  listPublic: () => request<IQPracticeQuestionApiResponse[]>('/iq-practice-questions'),

  listAdmin: () => request<IQPracticeQuestionApiResponse[]>('/admin/iq-practice-questions'),

  get: (id: string) => request<IQPracticeQuestionApiResponse>(`/admin/iq-practice-questions/${id}`),

  create: (data: IQPracticeQuestionCreatePayload) =>
    request<IQPracticeQuestionApiResponse>('/admin/iq-practice-questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: IQPracticeQuestionUpdatePayload) =>
    request<IQPracticeQuestionApiResponse>(`/admin/iq-practice-questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<null>(`/admin/iq-practice-questions/${id}`, { method: 'DELETE' }),
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
// GENIUS PROFILES API (Admin)
// ========================================

export interface GeniusApiResponse {
  id: string;
  slug: string;
  full_name: string;
  iq_score: number | null;
  iq_score_label: string;
  iq_score_note: string;
  birth_date: string | null;
  death_date: string | null;
  birth_place: string;
  zodiac_sign: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  image_attribution: string | null;
  biography: string;
  short_description: string;
  era: string;
  profile_type: string;
  is_historical: boolean;
  is_fictional: boolean;
  source_url: string | null;
  editorial_note: string;
  publication_status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface GeniusListApiResponse {
  items: GeniusApiResponse[];
  total: number;
}

export interface GeniusCreatePayload {
  id?: string | null;
  full_name: string;
  iq_score?: number | null;
  birth_date?: string | null;
  death_date?: string | null;
  birth_place: string;
  zodiac_sign?: string | null;
  biography: string;
  short_description: string;
  era: string;
  is_historical: boolean;
  is_fictional: boolean;
  profile_type: string;
  publication_status?: 'draft' | 'published' | 'archived';
  editorial_note?: string;
  source_url?: string | null;
  profile_image_url?: string | null;
}

export interface GeniusUpdatePayload {
  full_name?: string;
  iq_score?: number | null;
  birth_date?: string | null;
  death_date?: string | null;
  birth_place?: string;
  zodiac_sign?: string | null;
  biography?: string;
  short_description?: string;
  era?: string;
  is_historical?: boolean;
  is_fictional?: boolean;
  profile_type?: string;
  publication_status?: 'draft' | 'published' | 'archived';
  editorial_note?: string;
  source_url?: string | null;
  profile_image_url?: string | null;
}

export const publicGeniusApi = {
  list: (params?: { query?: string; era?: string; profile_type?: string }) => {
    const qs = new URLSearchParams();
    if (params?.query)        qs.set('query', params.query);
    if (params?.era)          qs.set('era', params.era);
    if (params?.profile_type) qs.set('profile_type', params.profile_type);
    const suffix = qs.toString() ? `?${qs}` : '';
    return request<GeniusListApiResponse>(`/genius-profiles${suffix}`);
  },

  getById: (id: string) =>
    request<GeniusApiResponse>(`/genius-profiles/${id}`),
};

export const geniusProfilesApi = {
  list: (params?: { query?: string; status?: string; profile_type?: string }) => {
    const qs = new URLSearchParams();
    if (params?.query)        qs.set('query', params.query);
    if (params?.status)       qs.set('status', params.status);
    if (params?.profile_type) qs.set('profile_type', params.profile_type);
    const suffix = qs.toString() ? `?${qs}` : '';
    return request<GeniusListApiResponse>(`/admin/genius-profiles${suffix}`);
  },

  getById: (id: string) =>
    request<GeniusApiResponse>(`/admin/genius-profiles/${id}`),

  create: (data: GeniusCreatePayload) =>
    request<GeniusApiResponse>('/admin/genius-profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: GeniusUpdatePayload) =>
    request<GeniusApiResponse>(`/admin/genius-profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, publication_status: string) =>
    request<GeniusApiResponse>(`/admin/genius-profiles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ publication_status }),
    }),

  delete: (id: string) =>
    request<null>(`/admin/genius-profiles/${id}`, { method: 'DELETE' }),
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

  getBookings: (userId: string) =>
    request<any[] | { items?: any[]; results?: any[]; bookings?: any[] }>(
      `/psychologist/bookings?user_id=${encodeURIComponent(userId)}`,
    ),

  getAvailableSlots: (bookingDate: string, bookingType: 'standard' | 'emergency' = 'standard') =>
    request<{ date: string; available_slots: string[] }>(
      `/psychologist/bookings/available-slots?booking_date=${encodeURIComponent(bookingDate)}&booking_type=${encodeURIComponent(bookingType)}`,
    ),

  getAvailableDates: (
    month: string,
    bookingType: 'standard' | 'emergency' = 'standard',
  ) =>
    request<{ month: string; available_dates: string[] }>(
      `/psychologist/bookings/available-dates?month=${encodeURIComponent(month)}&booking_type=${encodeURIComponent(bookingType)}`,
    ),

  createBooking: (data: {
    psychologist_id: string;
    date: string | null;
    time: string;
    booking_type: 'standard' | 'emergency';
    session_type: string;
    test_type?: string;
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
      cognitive_profile?: {
        pattern_recognition?: number;
        working_memory?: number;
        processing_speed?: number;
        verbal_intelligence?: number;
        spatial_reasoning?: number;
      };
      cognitive_profile_notes?: {
        pattern_recognition?: string;
        working_memory?: string;
        processing_speed?: string;
        verbal_intelligence?: string;
        spatial_reasoning?: string;
      };
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

  acceptInvite: (data: {
    token: string;
    full_name: string;
    password: string;
    hourly_rate: number;
    bio?: string;
    license_number?: string;
    years_of_experience?: string;
    specialization?: string;
    about_you?: string;
    location?: string;
  }) =>
    request<{ user: any; profile: any }>('/psychologist/accept-invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data: {
    qualifications?: string;
    certifications?: string;
    is_approved?: boolean;
    hourly_rate?: number;
    bio?: string;
    signature_image?: string | null;
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
  appSettings: appSettingsApi,
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
  iqPracticeQuestions: iqPracticeQuestionsApi,
  genius: publicGeniusApi,
  geniusProfiles: geniusProfilesApi,
  psychologist: psychologistApi,
  storage: storageApi,
  videoLessons: videoLessonsApi,
  education: educationApi,
  workExperience: workExperienceApi,
  honors: honorsApi,
  interests: interestsApi,
  causes: causesApi,
  cognitiveProfile: cognitiveProfileApi,
  patents: patentsApi,
  publications: publicationsApi,
  projects: projectsApi,
  testScores: testScoresApi,
};

export default api;
