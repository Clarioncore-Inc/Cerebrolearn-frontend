// CerebroLearn API Client
import { projectId, publicAnonKey } from './supabase/info';
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

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c6a99485`;

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  try {
    const session = localStorage.getItem('supabase.auth.token');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.access_token || null;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
}

// Helper to make API requests
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    
    // For 401 errors, return error object instead of throwing - backend may not be configured
    if (response.status === 401) {
      console.log(`Backend endpoint ${endpoint} returned 401 - using fallback data`);
      return { error: 'Unauthorized', status: 401 } as T;
    }
    
    throw new Error(error.error || `HTTP ${response.status}`);
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
  }) => request<{ success: boolean; user: User }>('/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getProfile: () => request<{ user: User }>('/profile'),

  updateProfile: (updates: Partial<User>) =>
    request<{ success: boolean; user: User }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// ========================================
// COURSES API
// ========================================

export const coursesApi = {
  create: (data: {
    title: string;
    description: string;
    org_id?: string;
    public?: boolean;
    category: string;
    level: string;
  }) =>
    request<{ success: boolean; course: Course }>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => request<{ courses: Course[] }>('/courses'),

  getById: (courseId: string) =>
    request<{ course: Course; lessons: Lesson[] }>(`/courses/${courseId}`),

  update: (courseId: string, updates: Partial<Course>) =>
    request<{ success: boolean; course: Course }>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  getReviews: (courseId: string) =>
    request<{ reviews: Review[] }>(`/courses/${courseId}/reviews`),
};

// ========================================
// LESSONS API
// ========================================

export const lessonsApi = {
  create: (data: {
    course_id: string;
    title: string;
    kind: string;
    content: any;
    position?: number;
  }) =>
    request<{ success: boolean; lesson: Lesson }>('/lessons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (lessonId: string) =>
    request<{ lesson: Lesson }>(`/lessons/${lessonId}`),

  getComments: (lessonId: string) =>
    request<{ comments: Comment[] }>(`/lessons/${lessonId}/comments`),
};

// ========================================
// ENROLLMENTS API
// ========================================

export const enrollmentsApi = {
  enroll: (courseId: string) =>
    request<{ success: boolean; enrollment: Enrollment }>('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    }),

  getMy: () => request<{ enrollments: Enrollment[] }>('/enrollments'),
};

// ========================================
// PROGRESS API
// ========================================

export const progressApi = {
  save: (data: { lesson_id: string; percent: number; state?: any }) =>
    request<{ success: boolean; progress: any }>('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (lessonId: string) =>
    request<{ progress: any }>(`/progress/${lessonId}`),
};

// ========================================
// QUIZ API
// ========================================

export const quizApi = {
  submitAttempt: (data: { quiz_id: string; answers: any[]; score: number }) =>
    request<{ success: boolean; attempt: any }>('/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// CREATOR API
// ========================================

export const creatorApi = {
  getCourses: () => request<{ courses: Course[] }>('/creator/courses'),

  getSubscribers: (courseId: string) =>
    request<{ subscribers: Subscriber[] }>(
      `/creator/courses/${courseId}/subscribers`
    ),

  getAnalytics: (courseId: string) =>
    request<{ analytics: CourseAnalytics }>(
      `/creator/courses/${courseId}/analytics`
    ),

  getEarnings: () => request<{ earnings: CreatorEarnings }>('/creator/earnings'),
};

// ========================================
// SOCIAL API
// ========================================

export const socialApi = {
  like: (lessonId: string) =>
    request<{ success: boolean; likes: number }>('/likes', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    }),

  unlike: (lessonId: string) =>
    request<{ success: boolean; likes: number }>(`/likes/${lessonId}`, {
      method: 'DELETE',
    }),

  bookmark: (lessonId: string) =>
    request<{ success: boolean }>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    }),

  getBookmarks: () => request<{ bookmarks: any[] }>('/bookmarks'),

  share: (lessonId: string, platform: string) =>
    request<{ success: boolean; shares: number }>('/shares', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, platform }),
    }),

  addComment: (data: {
    lesson_id: string;
    content: string;
    parent_id?: string;
  }) =>
    request<{ success: boolean; comment: Comment }>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// REVIEWS API
// ========================================

export const reviewsApi = {
  create: (data: { course_id: string; rating: number; comment: string }) =>
    request<{ success: boolean; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ========================================
// GAMIFICATION API
// ========================================

export const gamificationApi = {
  awardBadge: (data: {
    badge_name: string;
    badge_icon: string;
    badge_description: string;
  }) =>
    request<{ success: boolean; badges: any[] }>('/badges', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getLeaderboard: () => request<{ leaderboard: User[] }>('/leaderboard'),
};

// ========================================
// ORGANIZATIONS API
// ========================================

export const organizationsApi = {
  create: (data: { name: string; slug: string; subscription_plan?: string }) =>
    request<{ success: boolean; organization: Organization }>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (orgId: string) =>
    request<{ organization: Organization }>(`/organizations/${orgId}`),
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
    request<{ success: boolean; payment: any; paymentId: string }>('/payments', {
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
  getUsers: () => request<{ users: User[] }>('/admin/users'),

  getCourses: () => request<{ courses: Course[] }>('/admin/courses'),

  getAnalytics: () =>
    request<{
      analytics: {
        total_users: number;
        total_courses: number;
        total_enrollments: number;
        total_revenue: number;
      };
    }>('/admin/analytics'),

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
  gamification: gamificationApi,
  organizations: organizationsApi,
  payments: paymentsApi,
  admin: adminApi,
};

export default api;