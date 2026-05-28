import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper to verify user and get their info
async function getAuthenticatedUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No access token provided', status: 401 };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  return { user };
}

// ========================================
// AUTH ROUTES
// ========================================

// Signup endpoint
app.post('/make-server-c6a99485/signup', async (c) => {
  try {
    const { email, password, full_name, role = 'learner', org_id } = await c.req.json();
    
    if (!email || !password || !full_name) {
      return c.json({ error: 'Email, password, and full name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server hasn't been configured
      user_metadata: {
        full_name,
        role,
        org_id: org_id || null
      }
    });

    if (authError) {
      console.log('Auth error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user info in KV
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      full_name,
      role,
      org_id: org_id || null,
      avatar: null,
      xp: 0,
      streak: 0,
      badges: [],
      created_at: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      user: authData.user,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get current user profile
app.get('/make-server-c6a99485/profile', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    let userProfile = await kv.get(`user:${auth.user.id}`);
    
    // If no profile exists in KV, create a default one from auth metadata
    if (!userProfile) {
      console.log('No profile found, creating default profile for user:', auth.user.id);
      userProfile = {
        id: auth.user.id,
        email: auth.user.email || '',
        full_name: auth.user.user_metadata?.full_name || auth.user.email?.split('@')[0] || 'User',
        role: auth.user.user_metadata?.role || 'learner',
        org_id: auth.user.user_metadata?.org_id || null,
        avatar: null,
        xp: 0,
        streak: 0,
        badges: [],
        created_at: new Date().toISOString()
      };
      
      // Save the default profile
      await kv.set(`user:${auth.user.id}`, userProfile);
    }
    
    return c.json({ user: userProfile });
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update user profile
app.put('/make-server-c6a99485/profile', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${auth.user.id}`) || {};
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: auth.user.id,
      updated_at: new Date().toISOString()
    };

    await kv.set(`user:${auth.user.id}`, updatedProfile);
    return c.json({ success: true, user: updatedProfile });
  } catch (error) {
    console.log('Error updating profile:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// ORGANIZATION ROUTES
// ========================================

app.post('/make-server-c6a99485/organizations', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { name, slug, subscription_plan = 'free' } = await c.req.json();
    const orgId = crypto.randomUUID();

    const organization = {
      id: orgId,
      name,
      slug,
      subscription_plan,
      created_by: auth.user.id,
      created_at: new Date().toISOString()
    };

    await kv.set(`org:${orgId}`, organization);
    await kv.set(`org:slug:${slug}`, orgId);

    return c.json({ success: true, organization });
  } catch (error) {
    console.log('Error creating organization:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/organizations/:orgId', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const orgId = c.req.param('orgId');
    const organization = await kv.get(`org:${orgId}`);
    
    if (!organization) {
      return c.json({ error: 'Organization not found' }, 404);
    }

    return c.json({ organization });
  } catch (error) {
    console.log('Error fetching organization:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// COURSE ROUTES
// ========================================

app.post('/make-server-c6a99485/courses', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const courseData = await c.req.json();
    const courseId = courseData.id || crypto.randomUUID();

    const course = {
      id: courseId,
      org_id: courseData.org_id || null,
      title: courseData.title,
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      public: courseData.public ?? false,
      status: courseData.status || 'draft',
      category: courseData.category || '',
      subcategory: courseData.subcategory || '',
      level: courseData.level || '',
      language: courseData.language || 'English',
      sections: courseData.sections || [],
      learningObjectives: courseData.learningObjectives || [],
      requirements: courseData.requirements || [],
      targetAudience: courseData.targetAudience || '',
      priceType: courseData.priceType || 'free',
      price: courseData.price || 0,
      currency: courseData.currency || 'USD',
      discountPrice: courseData.discountPrice || null,
      allowReviews: courseData.allowReviews ?? true,
      enableCertificate: courseData.enableCertificate ?? true,
      enableDiscussions: courseData.enableDiscussions ?? true,
      maxStudents: courseData.maxStudents || null,
      created_by: auth.user.id,
      instructorId: courseData.instructorId || auth.user.id,
      instructorName: courseData.instructorName || '',
      rating: courseData.rating || 0,
      enrollments: courseData.enrollments || 0,
      reviews: courseData.reviews || 0,
      image: courseData.image || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(`course:${courseId}`, course);

    // Add to org's courses list if org_id provided
    if (course.org_id) {
      const orgCourses = await kv.get(`org:${course.org_id}:courses`) || [];
      await kv.set(`org:${course.org_id}:courses`, [...orgCourses, courseId]);
    }

    return c.json({ success: true, course });
  } catch (error) {
    console.log('Error creating course:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/courses', async (c) => {
  try {
    const courses = await kv.getByPrefix('course:') || [];
    const publicCourses = courses.filter((course: any) => 
      course.public === true && course.status === 'published'
    );

    return c.json({ courses: publicCourses });
  } catch (error) {
    console.log('Error fetching courses:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/courses/:courseId', async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const course = await kv.get(`course:${courseId}`);
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    // Get lessons for this course
    const lessons = await kv.get(`course:${courseId}:lessons`) || [];

    return c.json({ course, lessons });
  } catch (error) {
    console.log('Error fetching course:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.put('/make-server-c6a99485/courses/:courseId', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const courseId = c.req.param('courseId');
    const updates = await c.req.json();
    const course = await kv.get(`course:${courseId}`);

    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    // Check if user has permission to edit
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (course.created_by !== auth.user.id && userProfile?.role !== 'admin' && userProfile?.role !== 'org_admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const updatedCourse = {
      ...course,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await kv.set(`course:${courseId}`, updatedCourse);
    return c.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.log('Error updating course:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete('/make-server-c6a99485/courses/:courseId', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const courseId = c.req.param('courseId');
    const course = await kv.get(`course:${courseId}`);

    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    // Check if user has permission to delete
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (course.created_by !== auth.user.id && userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Delete the course
    await kv.del(`course:${courseId}`);
    
    // Delete associated lessons
    await kv.del(`course:${courseId}:lessons`);
    await kv.del(`course:${courseId}:reviews`);

    // Remove from org's courses list if applicable
    if (course.org_id) {
      const orgCourses = await kv.get(`org:${course.org_id}:courses`) || [];
      const updatedOrgCourses = orgCourses.filter((id: string) => id !== courseId);
      await kv.set(`org:${course.org_id}:courses`, updatedOrgCourses);
    }

    return c.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.log('Error deleting course:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// LESSON ROUTES
// ========================================

app.post('/make-server-c6a99485/lessons', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { course_id, title, kind, content, position } = await c.req.json();
    const lessonId = crypto.randomUUID();

    const lesson = {
      id: lessonId,
      course_id,
      title,
      kind, // video, interactive, article, quiz
      content,
      position: position || 0,
      created_at: new Date().toISOString()
    };

    await kv.set(`lesson:${lessonId}`, lesson);

    // Add to course's lessons list
    const courseLessons = await kv.get(`course:${course_id}:lessons`) || [];
    await kv.set(`course:${course_id}:lessons`, [...courseLessons, lesson]);

    return c.json({ success: true, lesson });
  } catch (error) {
    console.log('Error creating lesson:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/lessons/:lessonId', async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const lesson = await kv.get(`lesson:${lessonId}`);
    
    if (!lesson) {
      return c.json({ error: 'Lesson not found' }, 404);
    }

    return c.json({ lesson });
  } catch (error) {
    console.log('Error fetching lesson:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// ENROLLMENT ROUTES
// ========================================

app.post('/make-server-c6a99485/enrollments', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { course_id } = await c.req.json();
    const enrollmentId = crypto.randomUUID();

    const enrollment = {
      id: enrollmentId,
      user_id: auth.user.id,
      course_id,
      status: 'active',
      progress: 0,
      enrolled_at: new Date().toISOString()
    };

    await kv.set(`enrollment:${enrollmentId}`, enrollment);
    await kv.set(`enrollment:${auth.user.id}:${course_id}`, enrollment);

    // Update course enrollment count
    const course = await kv.get(`course:${course_id}`);
    if (course) {
      course.enrollments = (course.enrollments || 0) + 1;
      await kv.set(`course:${course_id}`, course);
    }

    return c.json({ success: true, enrollment });
  } catch (error) {
    console.log('Error creating enrollment:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/enrollments', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const enrollments = await kv.getByPrefix(`enrollment:${auth.user.id}:`) || [];
    return c.json({ enrollments });
  } catch (error) {
    console.log('Error fetching enrollments:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// PROGRESS ROUTES
// ========================================

app.post('/make-server-c6a99485/progress', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { lesson_id, percent, state } = await c.req.json();

    const progress = {
      user_id: auth.user.id,
      lesson_id,
      percent: percent || 0,
      state: state || {},
      last_seen_at: new Date().toISOString()
    };

    await kv.set(`progress:${auth.user.id}:${lesson_id}`, progress);

    // Award XP for progress
    if (percent === 100) {
      const userProfile = await kv.get(`user:${auth.user.id}`) || {};
      userProfile.xp = (userProfile.xp || 0) + 10;
      await kv.set(`user:${auth.user.id}`, userProfile);
    }

    return c.json({ success: true, progress });
  } catch (error) {
    console.log('Error saving progress:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/progress/:lessonId', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const lessonId = c.req.param('lessonId');
    const progress = await kv.get(`progress:${auth.user.id}:${lessonId}`) || { percent: 0, state: {} };
    
    return c.json({ progress });
  } catch (error) {
    console.log('Error fetching progress:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// QUIZ ROUTES
// ========================================

app.post('/make-server-c6a99485/quiz-attempts', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { quiz_id, answers, score } = await c.req.json();
    const attemptId = crypto.randomUUID();

    const attempt = {
      id: attemptId,
      user_id: auth.user.id,
      quiz_id,
      answers,
      score,
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString()
    };

    await kv.set(`quiz-attempt:${attemptId}`, attempt);

    // Award XP based on score
    const userProfile = await kv.get(`user:${auth.user.id}`) || {};
    userProfile.xp = (userProfile.xp || 0) + Math.floor(score / 10);
    await kv.set(`user:${auth.user.id}`, userProfile);

    return c.json({ success: true, attempt });
  } catch (error) {
    console.log('Error saving quiz attempt:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// PAYMENT ROUTES
// ========================================

app.post('/make-server-c6a99485/payments', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { amount, currency, provider, course_id, org_id } = await c.req.json();
    const paymentId = crypto.randomUUID();

    const payment = {
      id: paymentId,
      user_id: auth.user.id,
      course_id,
      org_id,
      amount,
      currency,
      provider,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    await kv.set(`payment:${paymentId}`, payment);

    return c.json({ success: true, payment, paymentId });
  } catch (error) {
    console.log('Error creating payment:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.put('/make-server-c6a99485/payments/:paymentId', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const paymentId = c.req.param('paymentId');
    const { status, provider_txn_id } = await c.req.json();

    const payment = await kv.get(`payment:${paymentId}`);
    if (!payment) {
      return c.json({ error: 'Payment not found' }, 404);
    }

    payment.status = status;
    payment.provider_txn_id = provider_txn_id;
    payment.updated_at = new Date().toISOString();

    await kv.set(`payment:${paymentId}`, payment);

    // If payment successful and for a course, auto-enroll
    if (status === 'completed' && payment.course_id) {
      const enrollmentId = crypto.randomUUID();
      const enrollment = {
        id: enrollmentId,
        user_id: auth.user.id,
        course_id: payment.course_id,
        status: 'active',
        progress: 0,
        enrolled_at: new Date().toISOString()
      };
      await kv.set(`enrollment:${enrollmentId}`, enrollment);
      await kv.set(`enrollment:${auth.user.id}:${payment.course_id}`, enrollment);
    }

    return c.json({ success: true, payment });
  } catch (error) {
    console.log('Error updating payment:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// ADMIN ROUTES
// ========================================

app.get('/make-server-c6a99485/admin/users', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'org_admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const users = await kv.getByPrefix('user:') || [];
    return c.json({ users });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/admin/analytics', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'org_admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const users = await kv.getByPrefix('user:') || [];
    const courses = await kv.getByPrefix('course:') || [];
    const enrollments = await kv.getByPrefix('enrollment:') || [];
    const payments = await kv.getByPrefix('payment:') || [];

    const analytics = {
      total_users: users.length,
      total_courses: courses.length,
      total_enrollments: enrollments.length,
      total_revenue: payments
        .filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    };

    return c.json({ analytics });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// GAMIFICATION ROUTES
// ========================================

app.post('/make-server-c6a99485/badges', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { badge_name, badge_icon, badge_description } = await c.req.json();
    
    const userProfile = await kv.get(`user:${auth.user.id}`) || {};
    const badges = userProfile.badges || [];
    
    badges.push({
      name: badge_name,
      icon: badge_icon,
      description: badge_description,
      earned_at: new Date().toISOString()
    });

    userProfile.badges = badges;
    await kv.set(`user:${auth.user.id}`, userProfile);

    return c.json({ success: true, badges });
  } catch (error) {
    console.log('Error awarding badge:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.get('/make-server-c6a99485/leaderboard', async (c) => {
  try {
    const users = await kv.getByPrefix('user:') || [];
    const leaderboard = users
      .sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 100);

    return c.json({ leaderboard });
  } catch (error) {
    console.log('Error fetching leaderboard:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// COURSE CREATOR ANALYTICS ROUTES
// ========================================

// Get creator's courses
app.get('/make-server-c6a99485/creator/courses', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    // Any authenticated user can view their own courses
    const allCourses = await kv.getByPrefix('course:') || [];
    const creatorCourses = allCourses.filter((course: any) => 
      course.created_by === auth.user.id || course.instructorId === auth.user.id
    );

    return c.json({ courses: creatorCourses });
  } catch (error) {
    console.log('Error fetching creator courses:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get course subscribers
app.get('/make-server-c6a99485/creator/courses/:courseId/subscribers', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const courseId = c.req.param('courseId');
    const course = await kv.get(`course:${courseId}`);
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    // Verify creator owns this course
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (course.created_by !== auth.user.id && userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Get all enrollments for this course
    const allEnrollments = await kv.getByPrefix('enrollment:') || [];
    const courseEnrollments = allEnrollments.filter((e: any) => 
      e.course_id === courseId
    );

    // Get user details for each enrollment
    const subscribers = await Promise.all(
      courseEnrollments.map(async (enrollment: any) => {
        const user = await kv.get(`user:${enrollment.user_id}`) || {};
        return {
          id: user.id,
          name: user.full_name,
          email: user.email,
          country: user.country,
          avatar: user.avatar,
          enrolled_at: enrollment.enrolled_at,
          last_accessed: enrollment.last_accessed,
          progress: enrollment.progress,
          status: enrollment.status
        };
      })
    );

    return c.json({ subscribers });
  } catch (error) {
    console.log('Error fetching subscribers:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get course analytics
app.get('/make-server-c6a99485/creator/courses/:courseId/analytics', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const courseId = c.req.param('courseId');
    const course = await kv.get(`course:${courseId}`);
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    // Verify creator owns this course
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (course.created_by !== auth.user.id && userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Get enrollments
    const allEnrollments = await kv.getByPrefix('enrollment:') || [];
    const courseEnrollments = allEnrollments.filter((e: any) => 
      e.course_id === courseId
    );

    // Get views (stored separately)
    const viewsData = await kv.get(`analytics:course:${courseId}:views`) || { total: 0, byDay: [] };

    // Get revenue
    const allPayments = await kv.getByPrefix('payment:') || [];
    const coursePayments = allPayments.filter((p: any) => 
      p.course_id === courseId && p.status === 'completed'
    );
    const totalRevenue = coursePayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    // Calculate completion rate
    const completedEnrollments = courseEnrollments.filter((e: any) => e.status === 'completed');
    const completionRate = courseEnrollments.length > 0 
      ? (completedEnrollments.length / courseEnrollments.length) * 100 
      : 0;

    // Calculate average progress
    const avgProgress = courseEnrollments.length > 0
      ? courseEnrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / courseEnrollments.length
      : 0;

    const analytics = {
      subscribers: courseEnrollments.length,
      views: viewsData.total,
      revenue: totalRevenue,
      completionRate,
      avgProgress,
      activeStudents: courseEnrollments.filter((e: any) => e.status === 'active').length,
      viewsByDay: viewsData.byDay || [],
      enrollmentsByDay: [] // TODO: Implement time-series tracking
    };

    return c.json({ analytics });
  } catch (error) {
    console.log('Error fetching course analytics:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get creator earnings summary
app.get('/make-server-c6a99485/creator/earnings', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'creator' && userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Creator access required' }, 403);
    }

    // Get all courses by this creator
    const allCourses = await kv.getByPrefix('course:') || [];
    const creatorCourses = allCourses.filter((course: any) => 
      course.created_by === auth.user.id
    );
    const courseIds = creatorCourses.map((c: any) => c.id);

    // Get all payments for these courses
    const allPayments = await kv.getByPrefix('payment:') || [];
    const creatorPayments = allPayments.filter((p: any) => 
      courseIds.includes(p.course_id) && p.status === 'completed'
    );

    // Calculate total revenue (before platform commission)
    const totalRevenue = creatorPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    
    // Platform takes 20% commission
    const platformCommission = 0.20;
    const creatorEarnings = totalRevenue * (1 - platformCommission);

    // Get payout history
    const allPayouts = await kv.getByPrefix('payout:') || [];
    const creatorPayouts = allPayouts.filter((p: any) => p.creator_id === auth.user.id);
    const totalPaidOut = creatorPayouts
      .filter((p: any) => p.status === 'completed')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    const earnings = {
      totalRevenue,
      creatorEarnings,
      totalPaidOut,
      pendingPayout: creatorEarnings - totalPaidOut,
      payouts: creatorPayouts,
      revenueByMonth: {}, // TODO: Implement monthly breakdown
      revenueByCourse: courseIds.map((courseId: string) => {
        const coursePayments = creatorPayments.filter((p: any) => p.course_id === courseId);
        const course = creatorCourses.find((c: any) => c.id === courseId);
        const revenue = coursePayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        return {
          courseId,
          courseTitle: course?.title || 'Unknown',
          revenue,
          earnings: revenue * (1 - platformCommission),
          sales: coursePayments.length
        };
      })
    };

    return c.json({ earnings });
  } catch (error) {
    console.log('Error fetching creator earnings:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// SOCIAL FEATURES ROUTES
// ========================================

// Like a lesson
app.post('/make-server-c6a99485/likes', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { lesson_id } = await c.req.json();
    const likeKey = `like:${auth.user.id}:${lesson_id}`;
    
    const existingLike = await kv.get(likeKey);
    if (existingLike) {
      return c.json({ error: 'Already liked' }, 400);
    }

    await kv.set(likeKey, {
      user_id: auth.user.id,
      lesson_id,
      created_at: new Date().toISOString()
    });

    // Increment like count on lesson
    const lesson = await kv.get(`lesson:${lesson_id}`) || {};
    lesson.likes = (lesson.likes || 0) + 1;
    await kv.set(`lesson:${lesson_id}`, lesson);

    return c.json({ success: true, likes: lesson.likes });
  } catch (error) {
    console.log('Error liking lesson:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Unlike a lesson
app.delete('/make-server-c6a99485/likes/:lessonId', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const lessonId = c.req.param('lessonId');
    const likeKey = `like:${auth.user.id}:${lessonId}`;
    
    await kv.del(likeKey);

    // Decrement like count on lesson
    const lesson = await kv.get(`lesson:${lessonId}`) || {};
    lesson.likes = Math.max((lesson.likes || 0) - 1, 0);
    await kv.set(`lesson:${lessonId}`, lesson);

    return c.json({ success: true, likes: lesson.likes });
  } catch (error) {
    console.log('Error unliking lesson:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Bookmark a lesson
app.post('/make-server-c6a99485/bookmarks', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { lesson_id } = await c.req.json();
    const bookmarkKey = `bookmark:${auth.user.id}:${lesson_id}`;
    
    await kv.set(bookmarkKey, {
      user_id: auth.user.id,
      lesson_id,
      created_at: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error bookmarking lesson:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user's bookmarks
app.get('/make-server-c6a99485/bookmarks', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const bookmarks = await kv.getByPrefix(`bookmark:${auth.user.id}:`) || [];
    return c.json({ bookmarks });
  } catch (error) {
    console.log('Error fetching bookmarks:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Share a lesson
app.post('/make-server-c6a99485/shares', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { lesson_id, platform } = await c.req.json();
    const shareId = crypto.randomUUID();
    
    const share = {
      id: shareId,
      user_id: auth.user.id,
      lesson_id,
      platform, // 'twitter', 'facebook', 'linkedin', 'email', 'copy'
      created_at: new Date().toISOString()
    };

    await kv.set(`share:${shareId}`, share);

    // Increment share count on lesson
    const lesson = await kv.get(`lesson:${lesson_id}`) || {};
    lesson.shares = (lesson.shares || 0) + 1;
    await kv.set(`lesson:${lesson_id}`, lesson);

    return c.json({ success: true, shares: lesson.shares });
  } catch (error) {
    console.log('Error sharing lesson:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// REVIEWS & RATINGS ROUTES
// ========================================

// Create a course review
app.post('/make-server-c6a99485/reviews', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { course_id, rating, comment } = await c.req.json();
    
    if (rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    const reviewId = crypto.randomUUID();
    const review = {
      id: reviewId,
      course_id,
      user_id: auth.user.id,
      rating,
      comment,
      helpful_count: 0,
      created_at: new Date().toISOString()
    };

    await kv.set(`review:${reviewId}`, review);

    // Update course rating
    const course = await kv.get(`course:${course_id}`) || {};
    const existingReviews = await kv.get(`course:${course_id}:reviews`) || [];
    existingReviews.push(review);
    await kv.set(`course:${course_id}:reviews`, existingReviews);

    // Calculate new average rating
    const totalRating = existingReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    course.rating = totalRating / existingReviews.length;
    course.total_reviews = existingReviews.length;
    await kv.set(`course:${course_id}`, course);

    return c.json({ success: true, review });
  } catch (error) {
    console.log('Error creating review:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get course reviews
app.get('/make-server-c6a99485/courses/:courseId/reviews', async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const reviews = await kv.get(`course:${courseId}:reviews`) || [];
    
    // Get user details for each review
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review: any) => {
        const user = await kv.get(`user:${review.user_id}`) || {};
        return {
          ...review,
          user: {
            id: user.id,
            name: user.full_name,
            avatar: user.avatar
          }
        };
      })
    );

    return c.json({ reviews: reviewsWithUsers });
  } catch (error) {
    console.log('Error fetching reviews:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// COMMENTS & DISCUSSIONS ROUTES
// ========================================

// Create a comment on a lesson
app.post('/make-server-c6a99485/comments', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const { lesson_id, content, parent_id } = await c.req.json();
    const commentId = crypto.randomUUID();

    const comment = {
      id: commentId,
      lesson_id,
      user_id: auth.user.id,
      content,
      parent_id: parent_id || null,
      likes: 0,
      created_at: new Date().toISOString()
    };

    await kv.set(`comment:${commentId}`, comment);

    // Add to lesson's comments
    const lessonComments = await kv.get(`lesson:${lesson_id}:comments`) || [];
    lessonComments.push(comment);
    await kv.set(`lesson:${lesson_id}:comments`, lessonComments);

    return c.json({ success: true, comment });
  } catch (error) {
    console.log('Error creating comment:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get lesson comments
app.get('/make-server-c6a99485/lessons/:lessonId/comments', async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const comments = await kv.get(`lesson:${lessonId}:comments`) || [];
    
    // Get user details for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment: any) => {
        const user = await kv.get(`user:${comment.user_id}`) || {};
        return {
          ...comment,
          user: {
            id: user.id,
            name: user.full_name,
            avatar: user.avatar
          }
        };
      })
    );

    return c.json({ comments: commentsWithUsers });
  } catch (error) {
    console.log('Error fetching comments:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ========================================
// ADVANCED ADMIN ROUTES
// ========================================

// Get all courses (admin)
app.get('/make-server-c6a99485/admin/courses', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'org_admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const courses = await kv.getByPrefix('course:') || [];
    
    // Get creator details for each course
    const coursesWithCreators = await Promise.all(
      courses.map(async (course: any) => {
        const creator = await kv.get(`user:${course.created_by}`) || {};
        return {
          ...course,
          creator: {
            id: creator.id,
            name: creator.full_name,
            email: creator.email
          }
        };
      })
    );

    return c.json({ courses: coursesWithCreators });
  } catch (error) {
    console.log('Error fetching all courses:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update user role (admin)
app.put('/make-server-c6a99485/admin/users/:userId/role', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const userId = c.req.param('userId');
    const { role } = await c.req.json();
    
    const targetUser = await kv.get(`user:${userId}`);
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    targetUser.role = role;
    targetUser.updated_at = new Date().toISOString();
    await kv.set(`user:${userId}`, targetUser);

    // Log admin action
    const logId = crypto.randomUUID();
    await kv.set(`admin:log:${logId}`, {
      id: logId,
      admin_id: auth.user.id,
      action: 'role_update',
      target_user_id: userId,
      old_role: targetUser.role,
      new_role: role,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true, user: targetUser });
  } catch (error) {
    console.log('Error updating user role:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Suspend/activate user (admin)
app.put('/make-server-c6a99485/admin/users/:userId/status', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const userId = c.req.param('userId');
    const { suspended } = await c.req.json();
    
    const targetUser = await kv.get(`user:${userId}`);
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    targetUser.suspended = suspended;
    targetUser.updated_at = new Date().toISOString();
    await kv.set(`user:${userId}`, targetUser);

    // Log admin action
    const logId = crypto.randomUUID();
    await kv.set(`admin:log:${logId}`, {
      id: logId,
      admin_id: auth.user.id,
      action: suspended ? 'suspend_user' : 'activate_user',
      target_user_id: userId,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true, user: targetUser });
  } catch (error) {
    console.log('Error updating user status:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get platform settings (admin)
app.get('/make-server-c6a99485/admin/settings', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const settings = await kv.get('platform:settings') || {
      commission_rate: 0.20,
      currency: 'USD',
      payment_providers: {
        stripe_enabled: false,
        flutterwave_enabled: false
      },
      features: {
        social_login: true,
        organizations: true,
        discussions: true
      }
    };

    return c.json({ settings });
  } catch (error) {
    console.log('Error fetching platform settings:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update platform settings (admin)
app.put('/make-server-c6a99485/admin/settings', async (c) => {
  const auth = await getAuthenticatedUser(c.req.raw);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  try {
    const userProfile = await kv.get(`user:${auth.user.id}`);
    if (userProfile?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const updates = await c.req.json();
    const currentSettings = await kv.get('platform:settings') || {};
    
    const newSettings = {
      ...currentSettings,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await kv.set('platform:settings', newSettings);

    // Log admin action
    const logId = crypto.randomUUID();
    await kv.set(`admin:log:${logId}`, {
      id: logId,
      admin_id: auth.user.id,
      action: 'update_settings',
      changes: updates,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true, settings: newSettings });
  } catch (error) {
    console.log('Error updating platform settings:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Health check
app.get('/make-server-c6a99485/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);