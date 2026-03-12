import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiCall } from '../../utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Play,
  CheckCircle2,
  Flame,
  Zap,
  Star,
  Brain,
  Sparkles,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { QuickStartGuide } from '../onboarding/QuickStartGuide';
import { ContinueLearningWidget } from '../learner/ContinueLearningWidget';
import { RecentCoursesPanel } from '../learner/RecentCoursesPanel';
import { QuickActionsPanel } from '../learner/QuickActionsPanel';
import svgPaths from '../../imports/svg-tpq70jnat3';
const imgImage = "/assets/2032fc19b38e203a661b2856012b01f2c17133fd.png";
const imgImage1 = "/assets/aa0e63b4b72dafa20ebf705cb3408f9d3a4343ef.png";
const imgImage2 = "assets/908f6e6dadefff9c6fad99774e0aa7808b2270ab.png";

interface LearnerDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function LearnerDashboard({ onNavigate }: LearnerDashboardProps) {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [dailyChallenges] = useState([
    {
      id: 1,
      title: 'Complete a Lesson',
      description: 'Finish at least one lesson today',
      reward: 50,
      progress: 0,
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 2,
      title: 'Score 100% on a Quiz',
      description: 'Get a perfect score on any quiz',
      reward: 100,
      progress: 0,
      icon: Target,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 3,
      title: 'Study for 30 Minutes',
      description: 'Spend at least 30 minutes learning',
      reward: 75,
      progress: 40,
      icon: Clock,
      color: 'from-emerald-500 to-teal-500'
    }
  ]);

  useEffect(() => {
    loadDashboardData();
    const hasSeenQuickStart = localStorage.getItem('hasSeenQuickStart');
    setShowQuickStart(!hasSeenQuickStart);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [enrollmentsData, coursesData] = await Promise.all([
        apiCall('/enrollments'),
        apiCall('/courses')
      ]);

      // Check if we got 401 errors
      if (enrollmentsData?.error === 'Unauthorized' || coursesData?.error === 'Unauthorized') {
        console.log('Backend unavailable, using mock data for dashboard');
        setEnrollments([]);
        setCourses([]);
      } else {
        setEnrollments(enrollmentsData.enrollments || []);
        
        const enrolledCourseIds = enrollmentsData.enrollments?.map((e: any) => e.course_id) || [];
        const enrolledCourses = await Promise.all(
          enrolledCourseIds.map((id: string) => apiCall(`/courses/${id}`).catch(() => null))
        );
        
        setCourses(enrolledCourses.filter(Boolean).map(c => c.course));
      }
    } catch (error) {
      console.log('Error loading dashboard data, using mock data:', error);
      
      // Use mock data as fallback
      console.log('Using mock data for dashboard');
      
      const mockCourses = [
        {
          id: '1',
          title: 'Introduction to Physics',
          instructor: 'Dr. Sarah Johnson',
          progress: 65,
          thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
          category: 'Science',
          duration: '8 weeks',
          nextLesson: 'Newton\'s Laws of Motion',
          lessons: 24,
          completedLessons: 16
        },
        {
          id: '2',
          title: 'Advanced Mathematics',
          instructor: 'Prof. Michael Chen',
          progress: 42,
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
          category: 'Mathematics',
          duration: '10 weeks',
          nextLesson: 'Differential Equations',
          lessons: 30,
          completedLessons: 13
        },
        {
          id: '3',
          title: 'Web Development Bootcamp',
          instructor: 'Emma Wilson',
          progress: 88,
          thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400',
          category: 'Technology',
          duration: '12 weeks',
          nextLesson: 'React Hooks Deep Dive',
          lessons: 48,
          completedLessons: 42
        }
      ];
      
      const mockEnrollments = mockCourses.map(course => ({
        id: `enroll-${course.id}`,
        course_id: course.id,
        user_id: 'mock-user',
        progress: course.progress,
        enrolled_at: new Date().toISOString(),
        last_accessed: new Date().toISOString()
      }));
      
      setCourses(mockCourses);
      setEnrollments(mockEnrollments);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Active Courses',
      value: enrollments.length,
      icon: BookOpen,
      gradient: 'from-indigo-500 to-purple-500',
      detail: 'In progress'
    },
    {
      title: 'Total XP',
      value: profile?.xp || 0,
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      detail: 'Points earned'
    },
    {
      title: 'Day Streak',
      value: profile?.streak || 0,
      icon: Flame,
      gradient: 'from-rose-500 to-pink-500',
      detail: 'Keep it up!'
    },
    {
      title: 'Achievements',
      value: profile?.badges?.length || 0,
      icon: Award,
      gradient: 'from-cyan-500 to-blue-500',
      detail: 'Badges earned'
    }
  ];

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8 animate-slide-up">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-6 md:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm opacity-90">Welcome back!</span>
          </div>
          <h1 className="text-3xl md:text-4xl mb-2">Hi, {profile?.full_name} 👋</h1>
          <p className="text-white/80 max-w-2xl">
            Ready to continue your learning journey? You've made great progress!
          </p>
          
          <div className="flex gap-4 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => onNavigate('catalog')}
              className="bg-white text-primary hover:bg-white/90"
            >
              Explore Courses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('leaderboard')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="hover-lift card-glow overflow-hidden group cursor-pointer shadow-none hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.detail}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning Widget & Recent Courses - Side by Side */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueLearningWidget onNavigate={onNavigate} />
        </div>
        <div>
          <RecentCoursesPanel onNavigate={onNavigate} maxItems={5} />
        </div>
      </div>

      {/* Quick Actions Panel */}
      <QuickActionsPanel onNavigate={onNavigate} />

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl">Daily Challenges</h2>
              <p className="text-sm text-muted-foreground">Complete challenges to earn bonus XP</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {dailyChallenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="hover-lift overflow-hidden group shadow-none hover:shadow-md transition-all"
            >
              <div className={`h-2 bg-gradient-to-r ${challenge.color}`}></div>
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <challenge.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      <Zap className="h-3 h-3 mr-1" />
                      +{challenge.reward} XP
                    </Badge>
                    {challenge.progress === 100 && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl mb-1">Your Courses</h2>
            <p className="text-sm text-muted-foreground">Currently enrolled courses</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('my-learning-path')}>
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const enrollment = enrollments.find(e => e.course_id === course.id);
              const progress = enrollment?.progress || 0;
              const completedModules = Math.floor((course.lessons || 24) * (progress / 100));
              const totalModules = course.lessons || 24;
              
              const courseImages = [imgImage, imgImage1, imgImage2];
              const courseImage = courseImages[index % 3];

              return (
                <div key={course.id} className="basis-0 content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-[300px] relative shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group" onClick={() => onNavigate('course', course)}>
                  {/* Image */}
                  <div className="h-[200px] relative shrink-0 w-full">
                    <img alt={course.title} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={courseImage} />
                  </div>
                  
                  {/* Content */}
                  <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full px-6 pb-6">
                    {/* Heading */}
                    <div className="content-center flex flex-wrap gap-[43px] items-center justify-between relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] not-italic relative shrink-0 text-[#101828] text-[18px]">{course.title}</p>
                      </div>
                      <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0">
                        <div className="relative shrink-0 size-[20px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                            <g>
                              <g>
                                <path d={svgPaths.p39a1e780} stroke="#475467" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                <path d={svgPaths.p11974af0} stroke="#475467" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                <path d={svgPaths.p133c1580} stroke="#475467" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              </g>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <p className="font-['Lato:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#475467] text-[16px] w-full line-clamp-2">
                        {course.description || 'orem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor ...'}
                      </p>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px relative shrink-0 w-full">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 334 1">
                        <path clipRule="evenodd" d="M333.333 1H0V0H333.333V1Z" fill="#EAECF0" fillRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
                      <div className="content-stretch flex font-['Roboto:Medium',sans-serif] font-medium items-start justify-between leading-[0] relative shrink-0 text-[#344054] text-[14px] text-nowrap w-full">
                        <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[20px] text-nowrap whitespace-pre">{completedModules}/{totalModules} Modules</p>
                        </div>
                        <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[20px] text-nowrap whitespace-pre">{progress}% Complete</p>
                        </div>
                      </div>
                      <div className="h-[8px] relative rounded-lg shrink-0 w-full">
                        <div className="absolute bg-[#eaecf0] h-[8px] left-0 right-[0.33px] rounded top-0" />
                        <div className="absolute bg-primary h-[8px] left-0 rounded top-0 transition-all duration-300" style={{ right: `${100 - progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center hover-lift border-2 shadow-none hover:shadow-md transition-all">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 animate-bounce-subtle">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl mb-2">Start Your Learning Journey</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Explore our course catalog and enroll in courses to begin mastering new skills
            </p>
            <Button onClick={() => onNavigate('catalog')} size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Browse Course Catalog
            </Button>
          </Card>
        )}
      </div>

      {/* Achievements */}
      {profile?.badges && profile.badges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl">Your Achievements</h2>
                <p className="text-sm text-muted-foreground">Badges you've earned</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {profile.badges.map((badge: any, index: number) => (
              <Card key={index} className="text-center p-6 hover-lift group">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <p className="font-semibold mb-1">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      {showQuickStart && (
        <QuickStartGuide 
          role="learner"
          onAction={(action) => {
            if (action === 'catalog') onNavigate('catalog');
            if (action === 'leaderboard') onNavigate('leaderboard');
          }}
          onDismiss={() => {
            setShowQuickStart(false);
            localStorage.setItem('hasSeenQuickStart', 'true');
          }} 
        />
      )}
    </div>
  );
}