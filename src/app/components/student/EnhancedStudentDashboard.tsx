import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
  Calendar,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface EnhancedStudentDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export function EnhancedStudentDashboard({ onNavigate }: EnhancedStudentDashboardProps) {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const enrollmentsData = await api.enrollments.getMy();
      setEnrollments(enrollmentsData.enrollments || []);
      
      // Mock weekly progress data
      setWeeklyProgress([
        { day: 'Mon', minutes: 45, xp: 120 },
        { day: 'Tue', minutes: 60, xp: 180 },
        { day: 'Wed', minutes: 30, xp: 90 },
        { day: 'Thu', minutes: 75, xp: 200 },
        { day: 'Fri', minutes: 50, xp: 150 },
        { day: 'Sat', minutes: 90, xp: 250 },
        { day: 'Sun', minutes: 40, xp: 110 },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalXP = profile?.xp || 0;
  const currentStreak = profile?.streak || 0;
  const coursesInProgress = enrollments.filter(e => e.status === 'active').length;
  const coursesCompleted = enrollments.filter(e => e.status === 'completed').length;
  const badgesEarned = profile?.badges?.length || 0;

  // Calculate level from XP (100 XP per level)
  const level = Math.floor(totalXP / 100) + 1;
  const xpInCurrentLevel = totalXP % 100;
  const xpForNextLevel = 100;

  // Mock skill radar data
  const skillData = [
    { skill: 'Programming', level: 85 },
    { skill: 'Math', level: 70 },
    { skill: 'Science', level: 65 },
    { skill: 'Design', level: 75 },
    { skill: 'Business', level: 60 },
  ];

  // Daily challenges
  const dailyChallenges = [
    {
      id: 1,
      title: 'Complete 2 Lessons',
      progress: 1,
      total: 2,
      reward: 50,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Earn 200 XP',
      progress: 150,
      total: 200,
      reward: 75,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 3,
      title: 'Maintain Streak',
      progress: currentStreak,
      total: currentStreak + 1,
      reward: 100,
      icon: Flame,
      color: 'from-red-500 to-pink-500',
    },
  ];

  const stats = [
    {
      label: 'Total XP',
      value: totalXP.toLocaleString(),
      icon: Zap,
      change: '+180 this week',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Flame,
      change: currentStreak > 0 ? 'Keep it up!' : 'Start today!',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Courses Active',
      value: coursesInProgress,
      icon: BookOpen,
      change: `${coursesCompleted} completed`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Badges Earned',
      value: badgesEarned,
      icon: Award,
      change: badgesEarned > 0 ? 'Nice work!' : 'Earn your first!',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="mb-2">Welcome back, {profile?.full_name}! 👋</h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">Level {level}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {xpInCurrentLevel}/{xpForNextLevel} XP to next level
            </p>
          </div>
        </div>
        <Progress value={(xpInCurrentLevel / xpForNextLevel) * 100} className="h-2" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Daily Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Challenges
              </CardTitle>
              <CardDescription>Complete challenges to earn bonus XP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${challenge.color} flex items-center justify-center`}>
                          <challenge.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{challenge.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {challenge.progress}/{challenge.total} • +{challenge.reward} XP
                          </p>
                        </div>
                      </div>
                      {challenge.progress >= challenge.total ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline">{Math.round((challenge.progress / challenge.total) * 100)}%</Badge>
                      )}
                    </div>
                    <Progress value={(challenge.progress / challenge.total) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Study Time</CardTitle>
                <CardDescription>Time spent learning this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#395192" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold">
                    {weeklyProgress.reduce((sum, day) => sum + day.minutes, 0)} min
                  </p>
                  <p className="text-sm text-muted-foreground">Total this week</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>XP Progress</CardTitle>
                <CardDescription>Experience points earned this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="xp"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold">
                    {weeklyProgress.reduce((sum, day) => sum + day.xp, 0)} XP
                  </p>
                  <p className="text-sm text-muted-foreground">Total this week</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Based on your learning patterns</CardDescription>
                </div>
                <Button variant="outline" onClick={() => onNavigate('catalog')}>
                  Browse All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="h-32 bg-gradient-to-br from-primary to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                        <Brain className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">Advanced Algorithm Design</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Master complex algorithms and data structures
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Intermediate</Badge>
                        <Button size="sm">
                          Enroll
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                  <Button onClick={() => onNavigate('catalog')}>
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">Course Title</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                Last accessed: {new Date(enrollment.last_accessed || enrollment.enrolled_at).toLocaleDateString()}
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{enrollment.progress || 0}%</span>
                                </div>
                                <Progress value={enrollment.progress || 0} />
                              </div>
                            </div>
                          </div>
                          <Button>
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
                <CardDescription>Your current skill levels across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Skills"
                      dataKey="level"
                      stroke="#395192"
                      fill="#395192"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
                <CardDescription>Your learning patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Most Active Time</p>
                        <p className="text-sm text-muted-foreground">Evenings (6-9 PM)</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Favorite Subject</p>
                        <p className="text-sm text-muted-foreground">Programming</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">Avg. Session</p>
                        <p className="text-sm text-muted-foreground">45 minutes</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">Completion Rate</p>
                        <p className="text-sm text-muted-foreground">
                          {coursesCompleted > 0 ? `${Math.round((coursesCompleted / (coursesInProgress + coursesCompleted)) * 100)}%` : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Streak Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Streak
              </CardTitle>
              <CardDescription>Keep your learning streak alive!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-1 flex-wrap">
                {Array.from({ length: 30 }).map((_, i) => {
                  const isActive = i < currentStreak;
                  return (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded ${
                        isActive
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-muted hover:bg-muted/80'
                      } transition-colors cursor-pointer`}
                      title={`Day ${i + 1}`}
                    />
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold mb-1">{currentStreak} Days</p>
                <p className="text-muted-foreground">Current streak</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Badges
              </CardTitle>
              <CardDescription>
                {badgesEarned > 0 ? `You've earned ${badgesEarned} badges!` : 'Start earning badges by completing challenges'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badgesEarned === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No badges earned yet</p>
                  <Button onClick={() => onNavigate('catalog')}>
                    Start Learning to Earn Badges
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {profile?.badges?.map((badge, index) => (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">{badge.icon || '🏆'}</span>
                        </div>
                        <h4 className="font-semibold mb-1">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Earned {new Date(badge.earned_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}