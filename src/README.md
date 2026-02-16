# LearnPro - Interactive LMS Platform

A comprehensive Learning Management System (LMS) that combines the best features of TalentLMS (enterprise training, dashboards, admin, reporting) and Brilliant (interactive, step-by-step learning, puzzles, gamification).

## 🌟 Features

### Multi-Role System
- **Learners**: Interactive lessons, progress tracking, gamification, certificates
- **Instructors**: Course creation, student analytics, content management
- **Organization Admins**: Team management, course assignment, reporting
- **Platform Admins**: User management, platform analytics, moderation

### Authentication & Security
- Email/password authentication
- Social login support (Google, Facebook)
- Role-based access control
- JWT-based session management

### Learning Experience
- **Interactive Lessons**: Step-by-step guided learning
- **Video Content**: Embedded video players
- **Quizzes**: Multiple choice with instant feedback
- **Progress Tracking**: Auto-saved progress per lesson
- **Hints & Explanations**: Built-in learning support

### Gamification
- XP (Experience Points) system
- Badge collection
- Daily streak tracking
- Global leaderboard
- Achievement notifications

### Course Features
- **Course Catalog**: Search, filter by category and level
- **Course Details**: Comprehensive overview with curriculum
- **Enrollment System**: One-click enrollment
- **Reviews & Ratings**: Student feedback
- **Certificates**: Upon course completion

### Admin Tools
- **Analytics Dashboard**: Real-time platform metrics
- **User Management**: View and manage all users
- **Course Moderation**: Approve and manage courses
- **Revenue Tracking**: Payment analytics

### Payment Integration
- Stripe integration (credit/debit cards)
- Mobile Money support:
  - MTN Mobile Money
  - Vodafone Cash
  - AirtelTigo Money
- Payment tracking and order management

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library (Shadcn-inspired)
- **State Management**: React Context API
- **Charts**: Recharts for analytics
- **Notifications**: Sonner for toasts

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Hono web framework on Supabase Edge Functions
- **Storage**: Supabase Storage (for media files)
- **Real-time**: Supabase subscriptions

### Database Schema

#### Users
```typescript
{
  id: string
  email: string
  full_name: string
  role: 'learner' | 'instructor' | 'org_admin' | 'admin'
  org_id: string | null
  avatar: string | null
  xp: number
  streak: number
  badges: Badge[]
  created_at: string
}
```

#### Organizations
```typescript
{
  id: string
  name: string
  slug: string
  subscription_plan: string
  created_by: string
  created_at: string
}
```

#### Courses
```typescript
{
  id: string
  org_id: string | null
  title: string
  description: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  public: boolean
  status: 'draft' | 'published'
  rating: number
  enrollments: number
  created_by: string
  created_at: string
}
```

#### Lessons
```typescript
{
  id: string
  course_id: string
  title: string
  kind: 'video' | 'interactive' | 'article' | 'quiz'
  content: JSON
  position: number
  created_at: string
}
```

#### Enrollments
```typescript
{
  id: string
  user_id: string
  course_id: string
  status: 'active' | 'completed'
  progress: number
  enrolled_at: string
}
```

#### Progress
```typescript
{
  user_id: string
  lesson_id: string
  percent: number
  state: JSON
  last_seen_at: string
}
```

#### Quiz Attempts
```typescript
{
  id: string
  user_id: string
  quiz_id: string
  answers: JSON
  score: number
  started_at: string
  finished_at: string
}
```

#### Payments
```typescript
{
  id: string
  user_id: string
  course_id: string
  org_id: string | null
  amount: number
  currency: string
  provider: string
  provider_txn_id: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- (Optional) Google OAuth credentials
- (Optional) Facebook OAuth credentials
- (Optional) Stripe API key
- (Optional) Flutterwave/Paystack for mobile money

### Setup Instructions

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Authentication** (Optional)
   - For Google login: Follow [Supabase Google Auth docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
   - For Facebook login: Follow [Supabase Facebook Auth docs](https://supabase.com/docs/guides/auth/social-login/auth-facebook)

3. **Deploy the Application**
   - The app is ready to deploy to Vercel, Netlify, or any static hosting
   - Supabase backend is already configured

4. **Seed Sample Data** (Recommended)
   - Sign up as an instructor
   - Navigate to the Instructor Dashboard
   - The platform includes a seed data utility (or create courses manually)

### First User Setup

Create your first account:
```
1. Click "Get Started" or "Sign Up"
2. Fill in your details
3. Choose your role:
   - Learner: For students
   - Instructor: For course creators
   - Organization Admin: For team managers
4. Start exploring!
```

### Creating Your First Course (Instructors)

1. Navigate to Instructor Dashboard
2. Click "Create Course"
3. Fill in course details:
   - Title
   - Description
   - Category (Programming, Math, Science, Business, Design, Languages)
   - Level (Beginner, Intermediate, Advanced)
4. Add lessons:
   - Interactive lessons with step-by-step content
   - Video lessons
   - Quizzes with multiple choice questions
   - Article-based lessons
5. Publish your course

### Sample Course Structure

```typescript
{
  title: "Introduction to Python Programming",
  lessons: [
    {
      title: "Variables and Data Types",
      kind: "interactive",
      content: {
        steps: [
          {
            title: "What are Variables?",
            text: "Variables are containers...",
            example: "x = 5"
          },
          {
            title: "Try it Yourself",
            interactive: true,
            hint: "Use the format: variable_name = value"
          }
        ]
      }
    },
    {
      title: "Python Basics Quiz",
      kind: "quiz",
      content: {
        questions: [
          {
            question: "Which is correct?",
            options: ["x = 5", "var x = 5"],
            correctAnswer: "x = 5",
            explanation: "Python uses simple assignment"
          }
        ]
      }
    }
  ]
}
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8b5cf6) - Interactive elements
- **Secondary**: Pink (#ec4899) - Accents and highlights
- **Success**: Green - Achievements, completions
- **Warning**: Yellow - Streaks, important notices

### Typography
- Heading scale: h1, h2, h3, h4
- Body text with proper line-height
- Consistent font weights (400, 500)

### Components
All UI components follow:
- Rounded corners (0.625rem radius)
- Soft shadows
- Consistent spacing (4, 8, 16, 24px)
- Hover states with transitions
- Focus states for accessibility

## 📱 Responsive Design

The platform is fully responsive:
- **Mobile** (< 768px): Single column, touch-optimized
- **Tablet** (768px - 1024px): Two columns where appropriate
- **Desktop** (> 1024px): Multi-column layouts, sidebar support

## 🌙 Dark Mode

Full dark mode support:
- Toggle in navbar
- Persisted in localStorage
- Optimized colors for both themes
- Smooth transitions

## 🔐 Security Considerations

**Important**: This is a prototype for demonstration purposes.

For production use:
1. Implement Row Level Security (RLS) in Supabase
2. Add rate limiting to API endpoints
3. Validate all user inputs server-side
4. Implement CSRF protection
5. Use environment variables for sensitive data
6. Enable email verification
7. Add 2FA for sensitive accounts
8. Implement proper audit logging
9. Follow GDPR/CCPA compliance for user data
10. Use HTTPS in production

## 🎯 API Endpoints

### Authentication
- `POST /signup` - Create new user
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile

### Courses
- `GET /courses` - List all public courses
- `POST /courses` - Create course (instructor)
- `GET /courses/:id` - Get course details
- `PUT /courses/:id` - Update course (instructor)

### Lessons
- `POST /lessons` - Create lesson (instructor)
- `GET /lessons/:id` - Get lesson details

### Enrollments
- `POST /enrollments` - Enroll in course
- `GET /enrollments` - Get user's enrollments

### Progress
- `POST /progress` - Save lesson progress
- `GET /progress/:lessonId` - Get lesson progress

### Quizzes
- `POST /quiz-attempts` - Submit quiz attempt

### Payments
- `POST /payments` - Initiate payment
- `PUT /payments/:id` - Update payment status

### Admin
- `GET /admin/users` - List all users (admin)
- `GET /admin/analytics` - Platform analytics (admin)

### Gamification
- `POST /badges` - Award badge
- `GET /leaderboard` - Global leaderboard

## 🔄 Future Enhancements

Potential features for expansion:
- [ ] Live video classes
- [ ] Discussion forums
- [ ] Assignment submissions
- [ ] Peer review system
- [ ] Advanced analytics (completion rates, learning paths)
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Bulk user import (CSV)
- [ ] Custom branding for organizations
- [ ] API for third-party integrations
- [ ] Webhooks for events
- [ ] Advanced search with filters
- [ ] Content versioning
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1 AA)

## 📄 License

This is a demonstration project for educational purposes.

## 🤝 Contributing

This is a prototype. For production use, consider:
1. Adding comprehensive tests
2. Implementing CI/CD
3. Setting up monitoring and logging
4. Creating detailed API documentation
5. Implementing error tracking (e.g., Sentry)

## 📞 Support

For questions or issues:
- Check the code comments for inline documentation
- Review Supabase documentation for backend features
- Check React and Tailwind docs for frontend questions

---

**Built with ❤️ using React, Supabase, and Tailwind CSS**
