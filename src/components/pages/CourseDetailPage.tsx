import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ReviewSystem } from '../courses/ReviewSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import {
  ArrowRight,
  BookOpen,
  Play,
  Star,
  Users,
  Clock,
  CheckCircle2,
  Award,
  Download,
  Share2,
  MessageSquare,
  Globe,
  Target,
  TrendingUp,
  BarChart,
  Lock,
  Calendar,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';

interface CourseDetailPageProps {
  category: string;
  subcategory: string;
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

const courseDetails: Record<string, any> = {
  'general-physics': {
    title: 'General Physics',
    subtitle: 'Master the Fundamentals of Physics',
    description: 'Comprehensive introduction to physics covering mechanics, thermodynamics, waves, and more. Perfect for beginners looking to build a strong foundation.',
    instructor: {
      name: 'Dr. Sarah Mitchell',
      title: 'Physics Professor at MIT',
      avatar: 'SM',
      bio: 'Dr. Mitchell has 15+ years of teaching experience and has helped thousands of students master physics fundamentals.',
      rating: 4.9,
      students: '25K+',
      courses: 12
    },
    level: 'Beginner',
    rating: 4.8,
    reviewCount: 2847,
    students: '8.2K',
    duration: '12 weeks',
    hours: '45 hours',
    lessons: 48,
    price: 49.99,
    language: 'English',
    lastUpdated: 'November 2024',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    whatYouWillLearn: [
      'Understand fundamental physics concepts and principles',
      'Master Newtonian mechanics and motion laws',
      'Learn about energy, work, and power relationships',
      'Explore thermodynamics and heat transfer',
      'Study wave motion and sound phenomena',
      'Apply physics concepts to real-world problems'
    ],
    requirements: [
      'Basic algebra and trigonometry',
      'High school mathematics',
      'Scientific curiosity and dedication',
      'No prior physics knowledge required'
    ],
    topics: [
      {
        title: 'Introduction to Physics',
        lessons: 6,
        duration: '2.5 hours',
        items: [
          { title: 'Welcome to Physics', type: 'video', duration: '8 min', locked: false },
          { title: 'Scientific Method', type: 'video', duration: '12 min', locked: false },
          { title: 'Units and Measurements', type: 'video', duration: '15 min', locked: false },
          { title: 'Vectors and Scalars', type: 'video', duration: '18 min', locked: false },
          { title: 'Problem Solving Strategies', type: 'video', duration: '20 min', locked: true },
          { title: 'Introduction Quiz', type: 'quiz', duration: '15 min', locked: true }
        ]
      },
      {
        title: 'Mechanics - Motion and Forces',
        lessons: 12,
        duration: '8 hours',
        items: [
          { title: 'Kinematics: Position and Velocity', type: 'video', duration: '22 min', locked: true },
          { title: 'Acceleration and Motion Graphs', type: 'video', duration: '25 min', locked: true },
          { title: 'Newton\'s First Law', type: 'video', duration: '18 min', locked: true },
          { title: 'Newton\'s Second Law', type: 'video', duration: '20 min', locked: true },
          { title: 'Newton\'s Third Law', type: 'video', duration: '17 min', locked: true },
          { title: 'Friction and Drag Forces', type: 'video', duration: '23 min', locked: true },
          { title: 'Circular Motion', type: 'video', duration: '26 min', locked: true },
          { title: 'Gravitation', type: 'video', duration: '24 min', locked: true },
          { title: 'Mechanics Lab Exercise', type: 'exercise', duration: '45 min', locked: true },
          { title: 'Practice Problems', type: 'exercise', duration: '30 min', locked: true },
          { title: 'Motion and Forces Quiz', type: 'quiz', duration: '20 min', locked: true },
          { title: 'Mechanics Project', type: 'project', duration: '2 hours', locked: true }
        ]
      },
      {
        title: 'Energy and Work',
        lessons: 8,
        duration: '5 hours',
        items: [
          { title: 'Work and Energy Introduction', type: 'video', duration: '20 min', locked: true },
          { title: 'Kinetic Energy', type: 'video', duration: '18 min', locked: true },
          { title: 'Potential Energy', type: 'video', duration: '22 min', locked: true },
          { title: 'Conservation of Energy', type: 'video', duration: '25 min', locked: true },
          { title: 'Power and Efficiency', type: 'video', duration: '19 min', locked: true },
          { title: 'Energy Lab Exercise', type: 'exercise', duration: '40 min', locked: true },
          { title: 'Practice Problems', type: 'exercise', duration: '30 min', locked: true },
          { title: 'Energy Quiz', type: 'quiz', duration: '20 min', locked: true }
        ]
      },
      {
        title: 'Thermodynamics',
        lessons: 10,
        duration: '6.5 hours',
        items: [
          { title: 'Temperature and Heat', type: 'video', duration: '20 min', locked: true },
          { title: 'Heat Transfer Methods', type: 'video', duration: '22 min', locked: true },
          { title: 'First Law of Thermodynamics', type: 'video', duration: '25 min', locked: true },
          { title: 'Second Law of Thermodynamics', type: 'video', duration: '28 min', locked: true },
          { title: 'Heat Engines', type: 'video', duration: '24 min', locked: true },
          { title: 'Entropy', type: 'video', duration: '26 min', locked: true },
          { title: 'Thermodynamics Lab', type: 'exercise', duration: '50 min', locked: true },
          { title: 'Practice Problems', type: 'exercise', duration: '35 min', locked: true },
          { title: 'Thermodynamics Quiz', type: 'quiz', duration: '25 min', locked: true },
          { title: 'Final Project', type: 'project', duration: '2 hours', locked: true }
        ]
      },
      {
        title: 'Waves and Oscillations',
        lessons: 8,
        duration: '5.5 hours',
        items: [
          { title: 'Simple Harmonic Motion', type: 'video', duration: '22 min', locked: true },
          { title: 'Pendulums and Springs', type: 'video', duration: '24 min', locked: true },
          { title: 'Wave Properties', type: 'video', duration: '20 min', locked: true },
          { title: 'Sound Waves', type: 'video', duration: '23 min', locked: true },
          { title: 'Doppler Effect', type: 'video', duration: '19 min', locked: true },
          { title: 'Waves Lab Exercise', type: 'exercise', duration: '45 min', locked: true },
          { title: 'Practice Problems', type: 'exercise', duration: '30 min', locked: true },
          { title: 'Waves Quiz', type: 'quiz', duration: '20 min', locked: true }
        ]
      },
      {
        title: 'Final Assessment',
        lessons: 4,
        duration: '3 hours',
        items: [
          { title: 'Comprehensive Review', type: 'video', duration: '30 min', locked: true },
          { title: 'Final Exam Preparation', type: 'video', duration: '25 min', locked: true },
          { title: 'Final Exam', type: 'quiz', duration: '90 min', locked: true },
          { title: 'Course Completion Certificate', type: 'certificate', duration: '5 min', locked: true }
        ]
      }
    ],
    reviews: [
      {
        name: 'Michael Chen',
        avatar: 'MC',
        rating: 5,
        date: '2 days ago',
        comment: 'Excellent course! Dr. Mitchell explains complex concepts in a very clear and engaging way. The interactive exercises really helped solidify my understanding.'
      },
      {
        name: 'Emma Rodriguez',
        avatar: 'ER',
        rating: 5,
        date: '1 week ago',
        comment: 'Best physics course I\'ve taken online. The progression from basics to advanced topics is perfect, and the examples are very practical.'
      },
      {
        name: 'James Wilson',
        avatar: 'JW',
        rating: 4,
        date: '2 weeks ago',
        comment: 'Great content and well-structured lessons. Would have liked more real-world applications, but overall a fantastic course for beginners.'
      },
      {
        name: 'Sarah Thompson',
        avatar: 'ST',
        rating: 5,
        date: '3 weeks ago',
        comment: 'This course transformed my understanding of physics. The quizzes and projects are challenging but rewarding. Highly recommend!'
      },
      {
        name: 'David Lee',
        avatar: 'DL',
        rating: 5,
        date: '1 month ago',
        comment: 'Outstanding! The instructor\'s passion for physics is contagious. I feel confident applying these concepts to my engineering studies now.'
      }
    ]
  },
  'theoretical-physics': {
    title: 'Theoretical Physics',
    subtitle: 'Advanced Physics Concepts and Mathematical Frameworks',
    description: 'Deep dive into advanced theoretical physics including quantum mechanics, relativity, and field theory. Designed for students with strong physics and mathematics backgrounds.',
    instructor: {
      name: 'Prof. James Chen',
      title: 'Theoretical Physics Professor',
      avatar: 'JC',
      bio: 'Professor Chen is a renowned theoretical physicist with numerous publications in quantum mechanics and field theory.',
      rating: 4.9,
      students: '12K+',
      courses: 8
    },
    level: 'Advanced',
    rating: 4.9,
    reviewCount: 1523,
    students: '5.4K',
    duration: '16 weeks',
    hours: '68 hours',
    lessons: 64,
    price: 79.99,
    language: 'English',
    lastUpdated: 'October 2024',
    image: 'https://images.unsplash.com/photo-1636690513351-0af1763f6237',
    whatYouWillLearn: [
      'Master quantum mechanics fundamentals',
      'Understand special and general relativity',
      'Explore quantum field theory basics',
      'Apply mathematical frameworks to physics problems',
      'Analyze particle interactions and symmetries',
      'Develop advanced problem-solving skills'
    ],
    requirements: [
      'Strong background in classical physics',
      'Advanced calculus and linear algebra',
      'Differential equations knowledge',
      'General physics course completion recommended'
    ],
    topics: [
      {
        title: 'Quantum Mechanics Foundations',
        lessons: 15,
        duration: '12 hours',
        items: [
          { title: 'Wave-Particle Duality', type: 'video', duration: '30 min', locked: false },
          { title: 'The Schrödinger Equation', type: 'video', duration: '35 min', locked: false }
        ]
      }
    ],
    reviews: []
  }
};

export function CourseDetailPage({ category, subcategory, courseId, onNavigate }: CourseDetailPageProps) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  
  const course = courseDetails[courseId] || courseDetails['general-physics'];
  
  useEffect(() => {
    // Check if user is already enrolled
    if (user) {
      const enrollmentsKey = `enrollments_${user.id}`;
      const enrollments = JSON.parse(localStorage.getItem(enrollmentsKey) || '[]');
      const isEnrolled = enrollments.some((e: any) => e.course_id === courseId);
      setEnrolled(isEnrolled);
    }

    // Initialize reviews with course data
    const reviewsKey = `cerebrolearn_reviews_${courseId}`;
    const storedReviews = localStorage.getItem(reviewsKey);
    
    if (!storedReviews && course.reviews.length > 0) {
      // Transform reviews to include required fields
      const enhancedReviews = course.reviews.map((review: any, index: number) => ({
        id: `review-${courseId}-${index}`,
        userId: `user-${index + 1}`,
        userName: review.name,
        userAvatar: review.avatar,
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        likes: Math.floor(Math.random() * 20),
        likedBy: [],
        replies: [],
        hidden: false,
        reported: false
      }));
      setCourseReviews(enhancedReviews);
      localStorage.setItem(reviewsKey, JSON.stringify(enhancedReviews));
    } else if (storedReviews) {
      setCourseReviews(JSON.parse(storedReviews));
    }
  }, [courseId, user]);
  
  const handleEnroll = () => {
    if (!user) {
      toast.error('Please sign in to enroll in courses');
      onNavigate('auth');
      return;
    }

    // Add enrollment to localStorage
    const enrollmentsKey = `enrollments_${user.id}`;
    const enrollments = JSON.parse(localStorage.getItem(enrollmentsKey) || '[]');
    
    const newEnrollment = {
      id: `enrollment-${Date.now()}`,
      user_id: user.id,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      progress: 0,
      completed: false,
      last_accessed: new Date().toISOString()
    };
    
    enrollments.push(newEnrollment);
    localStorage.setItem(enrollmentsKey, JSON.stringify(enrollments));
    
    setEnrolled(true);
    toast.success('Successfully enrolled in course!');
  };
  
  const handleStartLearning = () => {
    // Find the first non-locked lesson or just start with the first lesson
    const firstTopic = course.topics?.[0];
    if (firstTopic && firstTopic.items && firstTopic.items.length > 0) {
      const firstLesson = firstTopic.items[0];
      
      // Create lesson data for the player
      const lessonData = {
        id: `${courseId}-${firstTopic.title}-${firstLesson.title}`.toLowerCase().replace(/\s+/g, '-'),
        title: firstLesson.title,
        type: firstLesson.type,
        duration: firstLesson.duration,
        content: {
          title: firstLesson.title,
          duration: firstLesson.duration,
          description: `${firstLesson.title} from ${course.title}`,
          videoUrl: '', // Will be handled by the player
        }
      };
      
      // Update last activity
      if (user) {
        const activityKey = `learning_activity_${user.id}`;
        const activity = {
          courseId: courseId,
          courseTitle: course.title,
          lessonId: lessonData.id,
          lessonTitle: lessonData.title,
          progress: 0,
          lastAccessed: new Date().toISOString()
        };
        localStorage.setItem(activityKey, JSON.stringify(activity));
      }
      
      // Navigate to lesson player
      onNavigate('lesson', {
        lesson: lessonData,
        course: {
          id: courseId,
          title: course.title,
          instructor: course.instructor?.name || 'Instructor'
        }
      });
    } else {
      toast.error('No lessons available in this course yet');
    }
  };
  
  const courseUrl = `https://cerebrolearn.com/course/${category}/${subcategory}/${courseId}`;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'quiz': return <CheckCircle2 className="w-4 h-4" />;
      case 'exercise': return <Target className="w-4 h-4" />;
      case 'project': return <Award className="w-4 h-4" />;
      case 'certificate': return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => onNavigate('catalog')} className="hover:text-foreground transition-colors">
              Catalog
            </button>
            <ArrowRight className="w-4 h-4" />
            <button onClick={() => onNavigate('category', { category })} className="hover:text-foreground transition-colors capitalize">
              {category}
            </button>
            <ArrowRight className="w-4 h-4" />
            <button onClick={() => onNavigate('subcategory', { category, subcategory })} className="hover:text-foreground transition-colors capitalize">
              {subcategory}
            </button>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container py-12 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary text-white">
                    {course.level}
                  </Badge>
                  <Badge variant="outline">
                    <Globe className="w-3 h-3 mr-1" />
                    {course.language}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    Updated {course.lastUpdated}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {course.subtitle}
                </p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{course.rating}</span>
                  <span className="text-muted-foreground">({course.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{course.hours} total</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {/* Instructor Card */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-lg bg-primary text-white">
                        {course.instructor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{course.instructor.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{course.instructor.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {course.instructor.bio}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.instructor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.instructor.students} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.instructor.courses} courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Card */}
            <div>
              <Card className="sticky top-24 border-2 shadow-xl">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-10 h-10 text-primary ml-1" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-bold">${course.price}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Limited Time Offer
                    </Badge>
                  </div>

                  {enrolled ? (
                    <>
                      <Button size="lg" className="w-full" onClick={handleStartLearning}>
                        <Play className="w-5 h-5 mr-2" />
                        Continue Learning
                      </Button>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Your Progress</span>
                            <span className="font-medium">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Button size="lg" className="w-full bg-primary" onClick={handleEnroll}>
                        Enroll Now
                      </Button>
                      <Button size="lg" variant="outline" className="w-full">
                        Add to Wishlist
                      </Button>
                    </>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <p className="font-medium">This course includes:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{course.hours} on-demand video</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Downloadable resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Interactive quizzes and exercises</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Full lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Access on mobile and desktop</span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setShareDialogOpen(true)}>
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Gift
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="container py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {course.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{course.description}</p>
                <p>
                  This comprehensive course is designed to take you from fundamental concepts to advanced applications.
                  Each module builds upon the previous one, ensuring a solid understanding of the material.
                </p>
                <p>
                  You'll engage with interactive content, solve real-world problems, and complete hands-on projects
                  that will prepare you for practical applications in your field of study or career.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  {course.lessons} lessons • {course.hours} total length
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.topics.map((topic: any, topicIndex: number) => (
                  <div key={topicIndex} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted/50 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{topic.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {topic.lessons} lessons • {topic.duration}
                        </p>
                      </div>
                      <Badge variant="secondary">{topicIndex + 1}</Badge>
                    </div>
                    <div className="divide-y">
                      {topic.items.map((item: any, itemIndex: number) => (
                        <div
                          key={itemIndex}
                          className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {item.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{item.duration}</span>
                              </div>
                            </div>
                          </div>
                          {item.locked ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  {course.rating} average rating • {course.reviewCount.toLocaleString()} total reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 pb-6 border-b">
                  <div>
                    <div className="text-5xl font-bold mb-2">{course.rating}</div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Course Rating</p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-24">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{stars} stars</span>
                        </div>
                        <Progress value={stars === 5 ? 85 : stars === 4 ? 12 : 3} className="h-2" />
                        <span className="text-sm text-muted-foreground w-12">
                          {stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Review System with Likes, Replies, and Admin Controls */}
                <ReviewSystem 
                  courseId={courseId}
                  reviews={courseReviews}
                  onReviewsUpdate={(updated) => setCourseReviews(updated)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor" className="mt-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="text-3xl bg-primary text-white">
                      {course.instructor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{course.instructor.name}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{course.instructor.title}</p>
                      <p className="text-muted-foreground leading-relaxed">{course.instructor.bio}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold">{course.instructor.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Instructor Rating</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-5 h-5 text-primary" />
                          <span className="text-2xl font-bold">{course.instructor.students}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Students</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <span className="text-2xl font-bold">{course.instructor.courses}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Courses</p>
                      </div>
                    </div>

                    <Button className="mt-4">
                      View All Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Course</DialogTitle>
            <DialogDescription>
              Share this course with your friends and colleagues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              id="url"
              value={courseUrl}
              className="w-full"
              readOnly
              onClick={(e) => e.currentTarget.select()}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(courseUrl);
                  toast.success('Copied to clipboard!');
                }}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`, '_blank');
                }}
              >
                <Facebook className="w-4 h-4 mr-1" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(courseUrl)}`, '_blank');
                }}
              >
                <Twitter className="w-4 h-4 mr-1" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  window.open(`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(courseUrl)}`, '_blank');
                }}
              >
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  window.open(`mailto:?subject=Check out this course&body=${encodeURIComponent(courseUrl)}`, '_blank');
                }}
              >
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}