# CerebroLearn Database Schema

## Overview
CerebroLearn uses Supabase's KV (Key-Value) store for data persistence. All data is stored with structured keys and accessed via the kv_store utility.

## Key Patterns

### Users
- `user:{userId}` - Main user profile
- `user:{userId}:settings` - User preferences
- `user:{userId}:streak` - Streak tracking data

### Organizations
- `org:{orgId}` - Organization data
- `org:slug:{slug}` - Organization lookup by slug
- `org:{orgId}:courses` - Array of course IDs
- `org:{orgId}:members` - Array of member IDs

### Courses
- `course:{courseId}` - Course metadata
- `course:{courseId}:lessons` - Array of lessons
- `course:{courseId}:modules` - Array of modules
- `course:{courseId}:reviews` - Array of reviews
- `course:{courseId}:analytics` - Analytics data
- `creator:{creatorId}:courses` - Courses by creator

### Lessons
- `lesson:{lessonId}` - Lesson metadata
- `lesson:{lessonId}:steps` - Interactive steps (Brilliant-style)
- `lesson:{lessonId}:comments` - Comments on lesson

### Enrollments
- `enrollment:{enrollmentId}` - Enrollment record
- `enrollment:{userId}:{courseId}` - User enrollment lookup

### Progress
- `progress:{userId}:{lessonId}` - Lesson progress
- `progress:{userId}:{courseId}` - Course progress

### Quizzes & Assessments
- `quiz:{quizId}` - Quiz data
- `quiz-attempt:{attemptId}` - Quiz attempt record
- `quiz-attempt:{userId}:{quizId}` - User's quiz attempts

### Payments & Revenue
- `payment:{paymentId}` - Payment record
- `payout:{payoutId}` - Payout to creator
- `revenue:{courseId}:{month}` - Monthly revenue by course
- `creator:{creatorId}:earnings` - Creator earnings summary

### Social Features
- `like:{userId}:{lessonId}` - Lesson like
- `share:{shareId}` - Share record
- `bookmark:{userId}:{lessonId}` - Bookmarked lesson
- `comment:{commentId}` - Comment data
- `discussion:{discussionId}` - Discussion thread

### Gamification
- `badge:{badgeId}` - Badge definition
- `user:{userId}:badges` - User's earned badges
- `leaderboard:global` - Global XP rankings
- `leaderboard:{courseId}` - Course-specific rankings

### Analytics
- `analytics:global:{date}` - Daily global stats
- `analytics:course:{courseId}:{date}` - Daily course stats
- `analytics:creator:{creatorId}:{date}` - Daily creator stats

### Admin
- `admin:log:{logId}` - Admin action log
- `platform:settings` - Platform-wide settings
- `platform:categories` - Course categories

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  full_name: string;
  role: 'learner' | 'creator' | 'admin' | 'org_admin';
  org_id: string | null;
  avatar: string | null;
  bio: string | null;
  country: string | null;
  xp: number;
  streak: number;
  badges: Badge[];
  created_at: string;
  updated_at: string;
  last_active: string;
}
```

### Course
```typescript
{
  id: string;
  org_id: string | null;
  title: string;
  description: string;
  cover_image: string | null;
  category: string;
  subcategory: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  currency: string;
  public: boolean;
  status: 'draft' | 'published' | 'archived';
  created_by: string; // creator user_id
  rating: number;
  total_reviews: number;
  enrollments: number;
  estimated_hours: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}
```

### Module
```typescript
{
  id: string;
  course_id: string;
  title: string;
  description: string;
  position: number;
  duration_minutes: number;
  created_at: string;
}
```

### Lesson
```typescript
{
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  kind: 'video' | 'interactive' | 'article' | 'quiz' | 'practice';
  content: any; // JSON structure varies by kind
  position: number;
  duration_minutes: number;
  is_free: boolean; // Free preview
  created_at: string;
  updated_at: string;
}
```

### Lesson Step (Brilliant-style)
```typescript
{
  id: string;
  lesson_id: string;
  type: 'text' | 'image' | 'video' | 'question' | 'code' | 'diagram' | 'explanation';
  content: any;
  position: number;
  hints: string[];
  solution: any;
  points: number;
}
```

### Enrollment
```typescript
{
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number; // 0-100
  enrolled_at: string;
  completed_at: string | null;
  last_accessed: string;
}
```

### Progress
```typescript
{
  user_id: string;
  lesson_id: string;
  percent: number; // 0-100
  state: any; // Current state for interactive lessons
  completed: boolean;
  time_spent_seconds: number;
  last_seen_at: string;
}
```

### Quiz Attempt
```typescript
{
  id: string;
  user_id: string;
  quiz_id: string;
  answers: any[];
  score: number; // 0-100
  passed: boolean;
  started_at: string;
  finished_at: string;
}
```

### Payment
```typescript
{
  id: string;
  user_id: string;
  course_id: string | null;
  org_id: string | null;
  amount: number;
  currency: string;
  provider: 'stripe' | 'flutterwave' | 'paystack';
  provider_txn_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}
```

### Payout
```typescript
{
  id: string;
  creator_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  payment_details: any;
  processed_at: string | null;
  created_at: string;
}
```

### Review
```typescript
{
  id: string;
  course_id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}
```

### Comment
```typescript
{
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id: string | null; // For replies
  likes: number;
  created_at: string;
  updated_at: string;
}
```

### Badge
```typescript
{
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

### Organization
```typescript
{
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  subscription_plan: 'free' | 'pro' | 'enterprise';
  max_members: number;
  created_by: string;
  created_at: string;
  settings: any;
}
```

### Analytics Record
```typescript
{
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
```

## Access Patterns

### Student Queries
- Get enrolled courses: `enrollment:{userId}:*`
- Get course progress: `progress:{userId}:{courseId}`
- Get badges: User object badges array
- Get leaderboard: `leaderboard:global`

### Creator Queries
- Get my courses: `creator:{creatorId}:courses`
- Get course analytics: `analytics:course:{courseId}:*`
- Get subscribers: Filter enrollments by course_id
- Get earnings: `creator:{creatorId}:earnings`

### Admin Queries
- Get all users: `user:*`
- Get all courses: `course:*`
- Get global analytics: `analytics:global:*`
- Get all payments: `payment:*`

## Indexes & Performance

Since we're using KV store, optimal key design is critical:
- Use prefix patterns for range queries
- Denormalize where needed (e.g., cache course data in enrollments)
- Store aggregates separately (e.g., monthly summaries)
- Use composite keys for relationships

## Migration Notes

When new fields are added:
1. Update this documentation
2. Update TypeScript interfaces in frontend
3. Update server validation
4. Existing records will need to handle missing fields gracefully
