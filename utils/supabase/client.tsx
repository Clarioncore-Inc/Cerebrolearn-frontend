import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import * as dummyData from '../dummyData';

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: false, // Disable session persistence to prevent auth calls
        autoRefreshToken: false, // Disable auto token refresh to prevent fetch calls
        detectSessionInUrl: false, // Disable session detection from URL
        storage: undefined, // Disable storage to prevent session reads
      },
      global: {
        headers: {
          'x-dummy-mode': 'true', // Flag for dummy mode
        },
        fetch: async (url, options) => {
          // Intercept all fetch calls and return mock responses
          console.log('[Offline Mode] Intercepted fetch to:', url);
          return new Response(JSON.stringify({ error: 'Offline mode - no network calls' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    });
  }
  return supabaseInstance;
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  // Use dummy data mode - no backend calls
  console.log(`[Dummy Data Mode] API Call: ${options.method || 'GET'} ${endpoint}`);
  
  // Get userId from mock session or use default
  let userId = 'demo-instructor';
  try {
    const mockSession = localStorage.getItem('mock_auth_session');
    if (mockSession) {
      const session = JSON.parse(mockSession);
      userId = session.user?.id || 'demo-instructor';
    }
  } catch (error) {
    // If parsing fails, use default userId
    console.log('[Dummy Data Mode] Using default userId (mock session unavailable)');
  }
  
  // Initialize dummy data
  dummyData.initializeDummyData();
  
  // Parse request body if present
  let body: any = null;
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch (e) {
      console.error('Failed to parse request body');
    }
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Route handling
  const method = options.method || 'GET';
  
  // GET /courses - Get all published courses
  if (endpoint === '/courses' && method === 'GET') {
    const courses = dummyData.getCourses();
    return { courses };
  }
  
  // GET /courses/:id - Get specific course
  if (endpoint.startsWith('/courses/') && method === 'GET' && !endpoint.includes('/analytics') && !endpoint.includes('/subscribers')) {
    const courseId = endpoint.split('/')[2];
    const course = dummyData.getCourse(courseId);
    return course ? { course } : { error: 'Course not found' };
  }
  
  // POST /courses - Create new course
  if (endpoint === '/courses' && method === 'POST' && body) {
    const newCourse = dummyData.addCourse(body);
    return { course: newCourse };
  }
  
  // PUT /courses/:id - Update course
  if (endpoint.startsWith('/courses/') && method === 'PUT' && body) {
    const courseId = endpoint.split('/')[2];
    const updatedCourse = dummyData.updateCourse(courseId, body);
    return updatedCourse ? { course: updatedCourse } : { error: 'Course not found' };
  }
  
  // DELETE /courses/:id - Delete course
  if (endpoint.startsWith('/courses/') && method === 'DELETE') {
    const courseId = endpoint.split('/')[2];
    const success = dummyData.deleteCourse(courseId);
    return success ? { success: true } : { error: 'Course not found' };
  }
  
  // GET /creator/courses - Get creator's courses
  if (endpoint === '/creator/courses' && method === 'GET') {
    const courses = dummyData.getCreatorCourses(userId);
    return { courses };
  }
  
  // GET /enrollments - Get user's enrollments
  if (endpoint === '/enrollments' && method === 'GET') {
    const enrollments = dummyData.getEnrollments(userId);
    return { enrollments };
  }
  
  // POST /enrollments - Enroll in course
  if (endpoint === '/enrollments' && method === 'POST' && body) {
    try {
      const enrollment = dummyData.enrollInCourse(userId, body.course_id);
      return { enrollment };
    } catch (error) {
      return { error: 'Failed to enroll' };
    }
  }
  
  // DELETE /enrollments/:id - Unenroll learner from course
  if (endpoint.startsWith('/enrollments/') && method === 'DELETE') {
    const enrollmentId = endpoint.split('/')[2];
    try {
      const success = dummyData.unenrollLearner(enrollmentId);
      if (success) {
        return { success: true, message: 'Learner unenrolled successfully' };
      } else {
        return { error: 'Enrollment not found' };
      }
    } catch (error) {
      return { error: 'Failed to unenroll learner' };
    }
  }
  
  // GET /enrollments/course/:courseId - Get all enrollments for a course
  if (endpoint.startsWith('/enrollments/course/') && method === 'GET') {
    const courseId = endpoint.split('/')[3];
    try {
      const enrollments = dummyData.getEnrollmentsByCourseId(courseId);
      return { enrollments };
    } catch (error) {
      return { error: 'Failed to get course enrollments' };
    }
  }
  
  // GET /leaderboard - Get leaderboard data
  if (endpoint === '/leaderboard' && method === 'GET') {
    return {
      leaderboard: [
        { id: 'user-1', rank: 1, full_name: 'Alex Thompson', role: 'student', xp: 12500, streak: 15, avatar: null },
        { id: 'user-2', rank: 2, full_name: 'Jordan Lee', role: 'student', xp: 11200, streak: 12, avatar: null },
        { id: 'user-3', rank: 3, full_name: 'Sam Chen', role: 'student', xp: 10800, streak: 8, avatar: null },
        { id: 'user-4', rank: 4, full_name: 'Taylor Swift', role: 'instructor', xp: 9500, streak: 5, avatar: null },
        { id: 'user-5', rank: 5, full_name: 'Morgan Davis', role: 'student', xp: 8900, streak: 0, avatar: null },
        { id: 'user-6', rank: 6, full_name: 'Casey Johnson', role: 'student', xp: 8200, streak: 3, avatar: null },
        { id: 'user-7', rank: 7, full_name: 'Riley Anderson', role: 'student', xp: 7800, streak: 10, avatar: null },
        { id: 'user-8', rank: 8, full_name: 'Avery Martinez', role: 'instructor', xp: 7500, streak: 0, avatar: null },
        { id: 'user-9', rank: 9, full_name: 'Quinn Robinson', role: 'student', xp: 7200, streak: 6, avatar: null },
        { id: 'user-10', rank: 10, full_name: 'Skylar White', role: 'student', xp: 6900, streak: 14, avatar: null }
      ]
    };
  }
  
  // GET /progress/:lessonId - Get lesson progress
  if (endpoint.startsWith('/progress/') && method === 'GET') {
    return {
      progress: {
        percent: 0,
        state: { currentStep: 0 }
      }
    };
  }
  
  // POST /progress - Save lesson progress
  if (endpoint === '/progress' && method === 'POST') {
    return { success: true };
  }
  
  // Profile endpoints
  if (endpoint === '/profile' && method === 'PUT') {
    return { success: true };
  }
  
  // Admin endpoints
  if (endpoint === '/admin/analytics' && method === 'GET') {
    return {
      analytics: {
        totalUsers: 15234,
        totalCourses: 342,
        totalRevenue: 125000,
        activeUsers: 8456
      }
    };
  }
  
  if (endpoint === '/admin/users' && method === 'GET') {
    return {
      users: []
    };
  }
  
  // Lessons endpoints
  if (endpoint === '/lessons' && method === 'POST') {
    return { success: true, lesson: body };
  }
  
  // Quiz attempts
  if (endpoint === '/quiz-attempts' && method === 'POST') {
    return { success: true };
  }
  
  // Payments
  if (endpoint === '/payments' && method === 'POST') {
    return {
      paymentId: `payment-${Date.now()}`,
      status: 'pending'
    };
  }
  
  if (endpoint.startsWith('/payments/') && method === 'PUT') {
    return { success: true };
  }
  
  // Creator analytics
  if (endpoint.includes('/analytics') && method === 'GET') {
    return {
      analytics: {
        totalRevenue: 12500,
        totalStudents: 456,
        courseCount: 8,
        avgRating: 4.7
      }
    };
  }
  
  // Creator subscribers
  if (endpoint.includes('/subscribers') && method === 'GET') {
    return {
      subscribers: []
    };
  }
  
  // Default fallback
  console.log(`[Dummy Data Mode] Unhandled endpoint: ${method} ${endpoint}`);
  return { success: true, data: null };
}

// Export the supabase client instance
export const supabase = createClient();