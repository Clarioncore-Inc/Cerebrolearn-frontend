import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Target,
  CheckCircle2,
  Play,
  Calendar,
  Flame,
  Trophy,
  Star,
  Brain,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  learnerApi,
  type ProgressDashboardEnrollmentRecord,
  type ProgressDashboardRecord,
  type RecentActivityRecord,
  type WeeklyActivityRecord,
} from '../../utils/api-client';

interface ProgressDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHoursLearned: number;
  averageProgress: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  certificatesEarned: number;
  lessonsCompleted: number;
}

const EMPTY_STATS: DashboardStats = {
  totalCourses: 0,
  completedCourses: 0,
  inProgressCourses: 0,
  totalHoursLearned: 0,
  averageProgress: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalPoints: 0,
  certificatesEarned: 0,
  lessonsCompleted: 0,
};

const mapStats = (payload?: ProgressDashboardRecord['stats']): DashboardStats => ({
  totalCourses: Number(payload?.total_courses ?? 0),
  completedCourses: Number(payload?.completed_courses ?? 0),
  inProgressCourses: Number(payload?.in_progress_courses ?? 0),
  totalHoursLearned: Number(payload?.total_hours_learned ?? 0),
  averageProgress: Number(payload?.average_progress ?? 0),
  currentStreak: Number(payload?.current_streak ?? 0),
  longestStreak: Number(payload?.longest_streak ?? 0),
  totalPoints: Number(payload?.total_points ?? 0),
  certificatesEarned: Number(payload?.certificates_earned ?? 0),
  lessonsCompleted: Number(payload?.lessons_completed ?? 0),
});

const formatRelativeTime = (value?: string | null) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)}d ago`;
  return date.toLocaleDateString();
};

const getProgressLabel = (progress: number) => {
  if (progress === 0) return 'Not Started';
  if (progress < 25) return 'Just Started';
  if (progress < 50) return 'Making Progress';
  if (progress < 75) return 'Halfway There';
  if (progress < 100) return 'Almost Done';
  return 'Completed';
};

const getActivityIcon = (type: string) => {
  if (type.includes('lesson')) return { icon: CheckCircle2, color: 'text-green-500' };
  if (type.includes('course')) return { icon: BookOpen, color: 'text-blue-500' };
  if (type.includes('study')) return { icon: Brain, color: 'text-purple-500' };
  return { icon: Trophy, color: 'text-amber-500' };
};

export function ProgressDashboard({ onNavigate }: ProgressDashboardProps) {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<ProgressDashboardEnrollmentRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityRecord[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) {
      setEnrollments([]);
      setStats(EMPTY_STATS);
      setWeeklyActivity([]);
      setRecentActivity([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await learnerApi.getProgressDashboard();
      setEnrollments(data.enrollments ?? []);
      setStats(mapStats(data.stats));
      setWeeklyActivity(data.weekly_activity ?? []);
      setRecentActivity(data.recent_activity ?? []);
    } catch (error) {
      console.error('Error loading progress dashboard:', error);
      toast.error('Failed to load progress dashboard');
      setEnrollments([]);
      setStats(EMPTY_STATS);
      setWeeklyActivity([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const maxMinutes = useMemo(
    () => Math.max(1, ...weeklyActivity.map((item) => Number(item.minutes ?? 0))),
    [weeklyActivity],
  );

  const achievements = [
    {
      icon: Trophy,
      title: 'First Course',
      description: 'Complete your first course',
      unlocked: stats.completedCourses >= 1,
      progress: Math.min(100, (stats.completedCourses / 1) * 100),
    },
    {
      icon: Flame,
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      unlocked: stats.currentStreak >= 7,
      progress: Math.min(100, (stats.currentStreak / 7) * 100),
    },
    {
      icon: Star,
      title: 'Point Master',
      description: 'Earn 1,000 points',
      unlocked: stats.totalPoints >= 1000,
      progress: Math.min(100, (stats.totalPoints / 1000) * 100),
    },
    {
      icon: BookOpen,
      title: 'Dedicated Learner',
      description: 'Spend 50 hours learning',
      unlocked: stats.totalHoursLearned >= 50,
      progress: Math.min(100, (stats.totalHoursLearned / 50) * 100),
    },
    {
      icon: Award,
      title: 'Certificate Collector',
      description: 'Earn 5 certificates',
      unlocked: stats.certificatesEarned >= 5,
      progress: Math.min(100, (stats.certificatesEarned / 5) * 100),
    },
    {
      icon: Target,
      title: 'Consistency Builder',
      description: 'Reach 10 completed lessons',
      unlocked: stats.lessonsCompleted >= 10,
      progress: Math.min(100, (stats.lessonsCompleted / 10) * 100),
    },
  ];

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Learning Progress</h2>
          <p className="text-muted-foreground mt-1">Track your learning journey and achievements</p>
        </div>
        <Button onClick={() => onNavigate('my-learning-path')}>
          View Learning Path
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Courses</CardTitle><BookOpen className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-3xl font-bold">{stats.totalCourses}</div><p className="text-xs text-muted-foreground mt-1">{stats.completedCourses} completed, {stats.inProgressCourses} in progress</p></CardContent></Card>
        <Card className="border-2 bg-gradient-to-br from-amber-500/5 to-amber-500/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Learning Time</CardTitle><Clock className="h-4 w-4 text-amber-500" /></CardHeader><CardContent><div className="text-3xl font-bold">{stats.totalHoursLearned}h</div><p className="text-xs text-muted-foreground mt-1">{stats.lessonsCompleted} lessons completed</p></CardContent></Card>
        <Card className="border-2 bg-gradient-to-br from-orange-500/5 to-orange-500/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Current Streak</CardTitle><Flame className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-3xl font-bold">{stats.currentStreak} days</div><p className="text-xs text-muted-foreground mt-1">Longest: {stats.longestStreak} days</p></CardContent></Card>
        <Card className="border-2 bg-gradient-to-br from-green-500/5 to-green-500/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Points</CardTitle><Trophy className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-3xl font-bold">{stats.totalPoints}</div><p className="text-xs text-muted-foreground mt-1">{stats.certificatesEarned} certificates earned</p></CardContent></Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Course Progress</CardTitle><CardDescription>Average completion: {stats.averageProgress}%</CardDescription></div>
                <Badge className="bg-primary">{stats.totalCourses} Enrolled</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments.length === 0 ? (
                <div className="text-center py-12"><BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No courses yet</h3><p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p><Button onClick={() => onNavigate('catalog')}>Browse Courses</Button></div>
              ) : (
                enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-4 border rounded-lg hover:border-primary/50 transition-all cursor-pointer group" onClick={() => onNavigate('my-learning-path')}>
                    <div className="flex items-start justify-between mb-3"><div className="flex-1"><h4 className="font-semibold group-hover:text-primary transition-colors">{enrollment.course_title}</h4><p className="text-sm text-muted-foreground mt-1">Last accessed: {new Date(enrollment.last_accessed || enrollment.enrolled_at || Date.now()).toLocaleDateString()}</p></div><Badge variant={enrollment.completed ? 'default' : 'secondary'} className={enrollment.completed ? 'bg-green-500' : ''}>{enrollment.completed ? <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Completed</span> : getProgressLabel(enrollment.progress || 0)}</Badge></div>
                    <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">{enrollment.progress || 0}%</span></div><Progress value={enrollment.progress || 0} className="h-2" /></div>
                    {!enrollment.completed && <Button size="sm" variant="ghost" className="mt-3 w-full group-hover:bg-primary group-hover:text-white" onClick={(e) => { e.stopPropagation(); onNavigate('my-learning-path'); }}><Play className="h-4 w-4 mr-2" />Continue Learning</Button>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border-2">
            <CardHeader><CardTitle>Weekly Activity</CardTitle><CardDescription>Time spent learning this week</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyActivity.map((day) => (
                    <div key={`${day.day}-${day.date}`} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-muted rounded-t-lg relative flex items-end justify-center" style={{ height: `${Math.max((day.minutes / maxMinutes) * 100, 8)}%` }}>
                        <div className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg flex items-end justify-center pb-2" style={{ height: '100%' }}>
                          <span className="text-xs font-medium text-white">{day.minutes}m</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center"><div className="flex items-center justify-center gap-2 mb-1"><Calendar className="h-4 w-4 text-primary" /></div><p className="text-2xl font-bold">{weeklyActivity.reduce((sum, item) => sum + item.minutes, 0)}m</p><p className="text-xs text-muted-foreground">This Week</p></div>
                  <div className="text-center"><div className="flex items-center justify-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-green-500" /></div><p className="text-2xl font-bold">{weeklyActivity.length ? Math.round(weeklyActivity.reduce((sum, item) => sum + item.minutes, 0) / weeklyActivity.length) : 0}m</p><p className="text-xs text-muted-foreground">Daily Avg</p></div>
                  <div className="text-center"><div className="flex items-center justify-center gap-2 mb-1"><Zap className="h-4 w-4 text-amber-500" /></div><p className="text-2xl font-bold">{Math.max(0, ...weeklyActivity.map((item) => item.minutes))}m</p><p className="text-xs text-muted-foreground">Best Day</p></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Your latest learning milestones</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                ) : (
                  recentActivity.map((activity, index) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type);
                    return (
                      <div key={`${activity.type}-${activity.occurred_at}-${index}`} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className={`p-2 rounded-lg bg-muted ${color}`}><Icon className="h-4 w-4" /></div>
                        <div className="flex-1"><p className="text-sm font-medium">{activity.text}</p><p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(activity.occurred_at)}</p></div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="border-2">
            <CardHeader><CardTitle>Achievements & Badges</CardTitle><CardDescription>Unlock badges by reaching milestones</CardDescription></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement, index) => (
                  <Card key={index} className={`p-4 ${achievement.unlocked ? 'border-amber-500 bg-amber-500/5' : 'opacity-60'}`}>
                    <div className="flex items-start gap-4"><div className={`p-3 rounded-xl ${achievement.unlocked ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-muted'}`}><achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} /></div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{achievement.title}</h4>{achievement.unlocked && <CheckCircle2 className="h-4 w-4 text-amber-500" />}</div><p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>{!achievement.unlocked && <div className="space-y-1"><Progress value={achievement.progress} className="h-1.5" /><p className="text-xs text-muted-foreground">{Math.round(achievement.progress)}% complete</p></div>}</div></div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}