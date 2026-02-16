import React from 'react';
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
      badge: '3 in progress'
    },
    {
      id: 'goals',
      label: 'Learning Goals',
      description: 'Track your progress',
      icon: Target,
      action: 'learning-goals',
      color: 'from-orange-500 to-red-500',
      badge: '2 active'
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      description: 'Quick access to saved lessons',
      icon: Bookmark,
      action: 'bookmarks',
      color: 'from-indigo-500 to-blue-500',
      badge: '8'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      description: 'View your badges & certificates',
      icon: Trophy,
      action: 'achievements',
      color: 'from-yellow-500 to-amber-500'
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
      id: 'streak',
      label: 'Learning Streak',
      description: 'Daily streak & activity',
      icon: Flame,
      action: 'learning-streak',
      color: 'from-orange-600 to-red-600',
      badge: '7 days'
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
      id: 'community',
      label: 'Community',
      description: 'Join study groups',
      icon: Users,
      action: 'community',
      color: 'from-violet-500 to-purple-500'
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
      color: 'from-gray-500 to-gray-700'
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
                  className="h-auto p-3 flex flex-col items-start gap-1"
                  onClick={() => handleAction(action.id)}
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
                onClick={() => handleAction(action.id)}
                className={`group relative p-4 rounded-xl border-2 bg-gradient-to-br ${action.color} bg-opacity-10 hover:bg-opacity-20 transition-all hover:shadow-lg hover:scale-105 ${
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
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">Lessons Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-xs text-muted-foreground">Courses Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-xs text-muted-foreground">Avg Progress</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}