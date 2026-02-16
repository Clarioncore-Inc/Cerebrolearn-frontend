# Getting Started with LearnPro LMS

Welcome to LearnPro! This guide will help you get started quickly.

## Quick Start

### 1. Sign Up

Visit the application and click "Get Started" or "Sign Up"

**Choose your role:**
- **Learner**: If you want to take courses
- **Instructor**: If you want to create and teach courses
- **Organization Admin**: If you manage a team

### 2. For Learners

After signing up as a learner:

1. **Browse the Course Catalog**
   - Click "Courses" in the navigation
   - Use filters to find courses by category or level
   - Click on a course to view details

2. **Enroll in a Course**
   - Click "Enroll Now" on any course page
   - Start learning immediately

3. **Complete Lessons**
   - Each lesson is interactive
   - Videos, step-by-step guides, and quizzes
   - Your progress is automatically saved

4. **Earn Rewards**
   - Gain XP for completing lessons
   - Earn badges for milestones
   - Maintain your daily streak
   - Compete on the leaderboard

### 3. For Instructors

After signing up as an instructor:

1. **Create Your First Course**
   ```
   1. Go to Instructor Dashboard
   2. Click "Create Course"
   3. Fill in:
      - Title (e.g., "Introduction to Python")
      - Description
      - Category (Programming, Math, Science, etc.)
      - Level (Beginner, Intermediate, Advanced)
   4. Click "Create Course"
   ```

2. **Add Lessons**
   
   After creating a course, add lessons with different types:

   **Interactive Lesson Example:**
   ```json
   {
     "title": "Variables in Python",
     "kind": "interactive",
     "content": {
       "steps": [
         {
           "title": "What are Variables?",
           "text": "Variables store data values...",
           "example": "x = 5\nname = 'John'"
         },
         {
           "title": "Try it yourself",
           "description": "Create a variable called age",
           "interactive": true,
           "hint": "Use: age = your_number"
         }
       ]
     }
   }
   ```

   **Quiz Lesson Example:**
   ```json
   {
     "title": "Python Basics Quiz",
     "kind": "quiz",
     "content": {
       "questions": [
         {
           "question": "How do you create a variable?",
           "options": ["x = 5", "var x = 5", "int x = 5"],
           "correctAnswer": "x = 5",
           "explanation": "Python uses simple assignment"
         }
       ]
     }
   }
   ```

3. **Publish Your Course**
   - Once lessons are added, click "Publish"
   - Course becomes visible to students

4. **Track Student Progress**
   - View enrollment numbers
   - See course ratings
   - Monitor completion rates

### 4. Sample Data (For Testing)

To quickly populate the platform with sample courses:

1. Sign up as an **Instructor**
2. The instructor dashboard has options to create courses
3. Sample courses include:
   - Introduction to Python Programming
   - Web Development Fundamentals
   - Data Science with Python
   - Mathematics for Machine Learning
   - Digital Marketing Essentials

## Key Features Walkthrough

### Dashboard (Learners)
Your dashboard shows:
- Active courses with progress bars
- XP and streak statistics
- Badge collection
- Daily challenges
- Quick access to continue learning

### Course Catalog
- Search by keyword
- Filter by category (Programming, Math, Business, etc.)
- Filter by level (Beginner, Intermediate, Advanced)
- View ratings and enrollment numbers
- One-click enrollment

### Lesson Player
Interactive learning experience:
- Step-by-step content
- Interactive coding exercises
- Video lessons
- Quizzes with instant feedback
- Hints when you're stuck
- Automatic progress saving

### Gamification
Earn rewards as you learn:
- **XP**: 10 XP per completed lesson
- **Badges**: Unlocked for achievements
- **Streaks**: Daily learning streaks
- **Leaderboard**: Compete globally

### Payment System
(For paid courses):
- Credit/Debit card via Stripe
- Mobile Money options:
  - MTN Mobile Money
  - Vodafone Cash
  - AirtelTigo Money
- Automatic enrollment after payment

## Tips for Best Experience

### For Learners
1. **Set a daily goal**: Complete at least one lesson per day
2. **Stay consistent**: Build your streak for bonus motivation
3. **Engage fully**: Use interactive exercises, don't just read
4. **Join the community**: Check the leaderboard for inspiration
5. **Collect badges**: They mark your progress and achievements

### For Instructors
1. **Start simple**: Begin with 3-5 lessons per course
2. **Mix content types**: Combine videos, interactive, and quizzes
3. **Add explanations**: Include hints and feedback in quizzes
4. **Test your course**: Enroll yourself to test the student experience
5. **Publish progressively**: You can add more lessons after publishing

### For Admins
1. **Monitor analytics**: Check the admin dashboard regularly
2. **Review content**: Moderate courses before wide release
3. **Track growth**: Use charts to monitor platform health
4. **Support users**: Be responsive to instructor and learner needs

## Common Tasks

### Enrolling in a Course
```
1. Browse Catalog → Find Course
2. Click on course card
3. Review curriculum and details
4. Click "Enroll Now"
5. Start learning!
```

### Completing a Quiz
```
1. Select your answer for each question
2. Click "Submit Answer"
3. See immediate feedback (correct/incorrect)
4. Read the explanation
5. Click "Next Question"
6. View final score after last question
```

### Tracking Your Progress
```
1. Go to Dashboard
2. View:
   - Active Courses section (shows progress bars)
   - XP count in header
   - Streak indicator
   - Badge collection
3. Click on a course to continue where you left off
```

### Creating Course Content

**Step 1: Create the Course**
- Title, description, category, level

**Step 2: Add Lessons**
For each lesson, specify:
- Title
- Type (interactive, video, article, quiz)
- Content (structured JSON)

**Step 3: Publish**
- Review all lessons
- Set course to public if desired
- Click "Publish"

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Quick search (coming soon)
- `→`: Next step in lesson
- `←`: Previous step in lesson
- `D`: Toggle dark mode

## Support Resources

### Documentation
- Full README in the project root
- Inline code comments
- API endpoint documentation

### Need Help?
- Check the README.md for detailed architecture
- Review sample course structures
- Test with the seed data feature

## Mobile Experience

The platform is fully responsive:
- **Mobile**: Optimized touch interface, single column
- **Tablet**: Enhanced two-column layouts
- **Desktop**: Full multi-column experience

All features work seamlessly across devices!

## What's Next?

After getting comfortable:
1. Complete your first course (Learners)
2. Create your first complete course (Instructors)
3. Invite your team (Organization Admins)
4. Explore advanced features (certificates, analytics)

---

**Happy Learning! 🎓**
