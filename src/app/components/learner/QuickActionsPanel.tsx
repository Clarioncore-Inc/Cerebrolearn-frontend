import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Play, 
  BookOpen, 
  Target, 
  Trophy,
  Calendar,
  Bookmark,
  TrendingUp,
  Clock,
  Zap,
  Star,
  Award,
  Users,
  MessageSquare,
  Flame,
  BarChart3,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  learnerApi,
  notesApi,
  socialApi,
  type LearningGoalRecord,
  type ProgressDashboardRecord,
} from '../../utils/api-client';

interface QuickActionsPanelProps {
  onNavigate: (page: string, data?: any) => void;
  compact?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  action: string;
  color: string;
  badge?: string | number;
  highlight?: boolean;
}

export function QuickActionsPanel({ onNavigate, compact = false }: QuickActionsPanelProps) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<ProgressDashboardRecord | null>(null);
  const [goals, setGoals] = useState<LearningGoalRecord[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    const loadQuickStats = async () => {
      if (!user) {
        setDashboard(null);
        setGoals([]);
        setBookmarksCount(0);
        setNotesCount(0);
        return;
      }

      try {
        const [dashboardData, goalData, bookmarks, notes] = await Promise.all([
          learnerApi.getProgressDashboard(),
          learnerApi.getGoals(),
          socialApi.getBookmarks(),
          notesApi.list(),
        ]);
        setDashboard(dashboardData);
        setGoals(goalData || []);
        setBookmarksCount(Array.isArray(bookmarks) ? bookmarks.length : 0);
        setNotesCount(Array.isArray(notes) ? notes.length : 0);
      } catch (error) {
        console.error('Error loading quick action stats:', error);
      }
    };

    void loadQuickStats();
  }, [user]);

  const activeGoalsCount = useMemo(
    () => goals.filter((goal) => !goal.completed).length,
    [goals],
  );

  const quickStats = useMemo(
    () => ({
      dayStreak: Number(dashboard?.stats?.current_streak ?? 0),
      lessonsDone: Number(dashboard?.stats?.lessons_completed ?? 0),
      coursesActive: Number(dashboard?.stats?.in_progress_courses ?? 0),
      avgProgress: Math.round(Number(dashboard?.stats?.average_progress ?? 0)),
    }),
    [dashboard],
  );

  const getCountBadge = (count: number, suffix?: string) => {
    if (count <= 0) {
      return undefined;
    }

    return suffix ? `${count} ${suffix}` : count;
  };

  const actions: QuickAction[] = [
    {
      id: 'continue',
      label: 'Continue Learning',
      description: 'Resume your last lesson',
      icon: Play,
      action: 'continue-learning',
      color: 'from-blue-500 to-cyan-500',
      highlight: true
    },
    {
      id: 'catalog',
      label: 'Browse Courses',
      description: 'Explore new courses',
      icon: BookOpen,
      action: 'catalog',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'my-learning',
      label: 'My Learning Path',
      description: 'View all enrolled courses',
      icon: TrendingUp,
      action: 'my-learning-path',
      color: 'from-green-500 to-emerald-500',
      badge: getCountBadge(quickStats.coursesActive, 'in progress')
    },
    {
      id: 'goals',
      label: 'Learning Goals',
      description: 'Track your progress',
      icon: Target,
      action: 'learning-goals',
      color: 'from-orange-500 to-red-500',
      badge: getCountBadge(activeGoalsCount, 'active')
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      description: 'Quick access to saved lessons',
      icon: Bookmark,
      action: 'bookmarks',
      color: 'from-indigo-500 to-blue-500',
      badge: getCountBadge(bookmarksCount)
    },
    {
      id: 'progress',
      label: 'Progress Dashboard',
      description: 'Detailed learning analytics',
      icon: BarChart3,
      action: 'progress-dashboard',
      color: 'from-blue-600 to-indigo-600',
      highlight: true
    },
    {
      id: 'schedule',
      label: 'Study Schedule',
      description: 'Plan your learning time',
      icon: Calendar,
      action: 'schedule',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      description: 'See top learners',
      icon: Award,
      action: 'leaderboard',
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 'discussions',
      label: 'Discussions',
      description: 'Ask questions & help others',
      icon: MessageSquare,
      action: 'discussions',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'notes',
      label: 'Notes',
      description: 'Review your notes',
      icon: FileText,
      action: 'notes',
      color: 'from-gray-500 to-gray-700',
      badge: getCountBadge(notesCount)
    }
  ];

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'continue-learning':
        // Get last activity and navigate
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity) {
          const activity = JSON.parse(lastActivity);
          onNavigate('lesson', { 
            lessonId: activity.lessonId,
            courseId: activity.courseId 
          });
        } else {
          onNavigate('catalog');
        }
        break;
      case 'catalog':
        onNavigate('catalog');
        break;
      case 'my-learning-path':
        onNavigate('my-learning-path');
        break;
      case 'learning-goals':
        onNavigate('learning-goals');
        break;
      case 'bookmarks':
        onNavigate('bookmarks');
        break;
      case 'achievements':
        onNavigate('achievements');
        break;
      case 'progress-dashboard':
        onNavigate('progress-dashboard');
        break;
      case 'learning-streak':
        onNavigate('learning-streak');
        break;
      case 'schedule':
        onNavigate('schedule');
        break;
      case 'leaderboard':
        onNavigate('leaderboard');
        break;
      case 'community':
        onNavigate('community');
        break;
      case 'discussions':
        onNavigate('discussions');
        break;
      case 'notes':
        onNavigate('notes');
        break;
      default:
        console.log('Action not implemented:', actionId);
    }
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {actions.slice(0, 6).map(action => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.highlight ? 'default' : 'outline'}
                  className="h-auto p-3 flex flex-col items-start gap-1 cursor-pointer"
                  onClick={() => handleAction(action.action)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="w-4 h-4" />
                    {action.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium text-left">
                    {action.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                  onClick={() => handleAction(action.action)}
                className={`group relative p-4 cursor-pointer rounded-xl border-2 bg-gradient-to-br ${action.color} bg-opacity-10 hover:bg-opacity-20 transition-all hover:shadow-lg hover:scale-105 ${
                  action.highlight ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/30'
                }`}
              >
                {/* Badge */}
                {action.badge && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-primary text-primary-foreground shadow-lg text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                    {action.label}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all pointer-events-none" />
              </button>
            );
          })}
        </div>

        {/* Additional Quick Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{quickStats.dayStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{quickStats.lessonsDone}</div>
              <div className="text-xs text-muted-foreground">Lessons Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{quickStats.coursesActive}</div>
              <div className="text-xs text-muted-foreground">Courses Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{quickStats.avgProgress}%</div>
              <div className="text-xs text-muted-foreground">Avg Progress</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}