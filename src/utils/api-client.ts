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

const BASE_URL = 'https://backened-core.onrender.com/api';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('cerebrolearn.auth.token');
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
    throw new Error(error.detail || error.error || error.message || `HTTP ${response.status}`);
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
};

// ========================================
// COURSES API
// ========================================

export const coursesApi = {
  create: (data: {
    title: string;
    description: string;
    category: string;
    level?: string;
    org_id?: string;
    is_public?: boolean;
    cover_image?: string;
    subcategory?: string;
    price?: number;
    currency?: string;
    estimated_hours?: number;
    tags?: string[];
    status?: string;
  }) =>
    request<Course>('/courses/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => request<{ items: Course[]; total: number; page: number; pages: number }>('/courses/'),

  getById: (courseId: string) =>
    request<Course & { lessons: Lesson[] }>(`/courses/${courseId}`),

  update: (courseId: string, updates: Partial<Course>) =>
    request<Course>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (courseId: string) =>
    request<{ success: boolean }>(`/courses/${courseId}`, { method: 'DELETE' }),

  getReviews: (courseId: string) =>
    request<Review[]>(`/courses/${courseId}/reviews`),
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
    request<Lesson>('/lessons/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (lessonId: string) =>
    request<Lesson>(`/lessons/${lessonId}`),

  getComments: (lessonId: string) =>
    request<Comment[]>(`/lessons/${lessonId}/comments`),
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
    request<any>(`/progress/${lessonId}`),
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
  getUsers: () => request<{ items: User[]; total: number }>('/admin/users'),

  getCourses: () => request<{ items: Course[]; total: number }>('/admin/courses'),

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