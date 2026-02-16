import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Target, 
  Zap, 
  Award,
  TrendingUp,
  Star,
  CheckCircle2,
  Lock,
  Gift,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LearningStreakTrackerProps {
  onNavigate?: (page: string, data?: any) => void;
}

interface StreakData {
  current: number;
  longest: number;
  lastActive: string;
  totalDays: number;
  freezesAvailable: number;
  calendar: Record<string, number>; // date -> minutes
}

export function LearningStreakTracker({ onNavigate }: LearningStreakTrackerProps) {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    current: 0,
    longest: 0,
    lastActive: '',
    totalDays: 0,
    freezesAvailable: 2,
    calendar: {}
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      loadStreakData();
    }
  }, [user]);

  const loadStreakData = () => {
    if (!user) return;

    const streakKey = `learning_streak_${user.id}`;
    const stored = localStorage.getItem(streakKey);
    
    if (stored) {
      const data = JSON.parse(stored);
      setStreakData(data);
      
      // Check if today is completed
      const today = new Date().toISOString().split('T')[0];
      setTodayCompleted(!!data.calendar[today] && data.calendar[today] >= 15);
    } else {
      // Initialize streak data
      const initialData: StreakData = {
        current: 0,
        longest: 0,
        lastActive: '',
        totalDays: 0,
        freezesAvailable: 2,
        calendar: {}
      };
      localStorage.setItem(streakKey, JSON.stringify(initialData));
      setStreakData(initialData);
    }
  };

  const updateStreak = (minutes: number = 15) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const newCalendar = { ...streakData.calendar };
    newCalendar[today] = (newCalendar[today] || 0) + minutes;

    let newCurrent = streakData.current;
    let newLongest = streakData.longest;
    let newTotalDays = streakData.totalDays;

    // Check if this is the first time today
    if (!streakData.calendar[today]) {
      // First activity of the day
      if (streakData.lastActive === yesterday) {
        // Continue streak
        newCurrent += 1;
      } else if (streakData.lastActive === today) {
        // Same day, no change
      } else {
        // Streak broken, start new one
        newCurrent = 1;
      }
      
      newTotalDays += 1;
      newLongest = Math.max(newLongest, newCurrent);
    }

    const updatedData: StreakData = {
      ...streakData,
      current: newCurrent,
      longest: newLongest,
      lastActive: today,
      totalDays: newTotalDays,
      calendar: newCalendar
    };

    const streakKey = `learning_streak_${user.id}`;
    localStorage.setItem(streakKey, JSON.stringify(updatedData));
    setStreakData(updatedData);
    setTodayCompleted(newCalendar[today] >= 15);

    // Check for milestone achievements
    checkMilestones(newCurrent, newLongest);
  };

  const checkMilestones = (current: number, longest: number) => {
    const milestones = [3, 7, 14, 30, 60, 100];
    
    milestones.forEach(milestone => {
      if (current === milestone || longest === milestone) {
        const points = milestone * 10;
        toast.success(`🎉 ${milestone}-Day Streak Milestone!`, {
          description: `You've earned ${points} bonus points!`
        });
        
        // Award points
        if (user) {
          const gamificationKey = `gamification_${user.id}`;
          const gamData = JSON.parse(localStorage.getItem(gamificationKey) || '{"totalPoints": 0}');
          gamData.totalPoints += points;
          localStorage.setItem(gamificationKey, JSON.stringify(gamData));
        }
      }
    });
  };

  const useStreakFreeze = () => {
    if (streakData.freezesAvailable <= 0) {
      toast.error('No streak freezes available');
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newCalendar = { ...streakData.calendar };
    newCalendar[yesterday] = 15; // Add minimum time for yesterday

    const updatedData: StreakData = {
      ...streakData,
      freezesAvailable: streakData.freezesAvailable - 1,
      calendar: newCalendar
    };

    const streakKey = `learning_streak_${user.id}`;
    localStorage.setItem(streakKey, JSON.stringify(updatedData));
    setStreakData(updatedData);
    
    toast.success('Streak Freeze Used!', {
      description: 'Your streak has been protected for yesterday.'
    });
  };

  const simulateLearning = () => {
    updateStreak(20);
    toast.success('Learning Activity Logged!', {
      description: '+20 minutes added to your daily total'
    });
  };

  // Calendar rendering
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getActivityLevel = (minutes: number): string => {
    if (minutes === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (minutes < 15) return 'bg-green-200 dark:bg-green-900';
    if (minutes < 30) return 'bg-green-400 dark:bg-green-700';
    if (minutes < 60) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-700 dark:bg-green-400';
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const today = new Date().toISOString().split('T')[0];

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const minutes = streakData.calendar[dateStr] || 0;
      const isToday = dateStr === today;
      const isFuture = date > new Date();

      days.push(
        <div
          key={day}
          className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-110 ${
            getActivityLevel(minutes)
          } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''} ${
            isFuture ? 'opacity-30' : ''
          }`}
          title={`${dateStr}: ${minutes} minutes`}
        >
          <span className={minutes > 0 ? 'text-white' : 'text-muted-foreground'}>
            {day}
          </span>
          {minutes > 0 && (
            <CheckCircle2 className="h-3 w-3 text-white mt-0.5" />
          )}
        </div>
      );
    }

    return days;
  };

  const milestones = [
    { days: 3, icon: Flame, label: '3-Day Streak', unlocked: streakData.longest >= 3, reward: '30 points' },
    { days: 7, icon: Trophy, label: 'Week Warrior', unlocked: streakData.longest >= 7, reward: '70 points' },
    { days: 14, icon: Star, label: '2-Week Champion', unlocked: streakData.longest >= 14, reward: '140 points' },
    { days: 30, icon: Award, label: 'Month Master', unlocked: streakData.longest >= 30, reward: '300 points' },
    { days: 60, icon: Zap, label: '60-Day Legend', unlocked: streakData.longest >= 60, reward: '600 points' },
    { days: 100, icon: Gift, label: 'Century Club', unlocked: streakData.longest >= 100, reward: '1000 points' },
  ];

  const getMotivationalMessage = () => {
    if (streakData.current === 0) return "Start your learning streak today!";
    if (streakData.current === 1) return "Great start! Keep it going tomorrow!";
    if (streakData.current < 7) return `${7 - streakData.current} more days to Week Warrior!`;
    if (streakData.current < 30) return `Amazing! ${30 - streakData.current} more days to Month Master!`;
    if (streakData.current < 100) return `Incredible! ${100 - streakData.current} more days to Century Club!`;
    return "You're a learning legend! Keep it up!";
  };

  const changeMonth = (offset: number) => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Flame className="h-8 w-8 text-orange-500" />
          Learning Streak
        </h2>
        <p className="text-muted-foreground mt-1">{getMotivationalMessage()}</p>
      </div>

      {/* Main Streak Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <Flame className="h-12 w-12 text-orange-500" />
              <div>
                <div className="text-4xl font-bold">{streakData.current}</div>
                <p className="text-sm text-muted-foreground">days</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {todayCompleted ? (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Today Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-500 text-orange-500">
                  <Target className="h-3 w-3 mr-1" />
                  15 min needed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <Trophy className="h-12 w-12 text-amber-500" />
              <div>
                <div className="text-4xl font-bold">{streakData.longest}</div>
                <p className="text-sm text-muted-foreground">days</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={Math.min(100, (streakData.current / Math.max(streakData.longest, 1)) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {streakData.current === streakData.longest && streakData.current > 0
                  ? 'New record! 🎉'
                  : `${Math.max(0, streakData.longest - streakData.current)} days to beat record`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Streak Freezes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <Zap className="h-12 w-12 text-blue-500" />
              <div>
                <div className="text-4xl font-bold">{streakData.freezesAvailable}</div>
                <p className="text-sm text-muted-foreground">available</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-4 w-full"
              onClick={useStreakFreeze}
              disabled={streakData.freezesAvailable === 0}
            >
              {streakData.freezesAvailable > 0 ? (
                <>
                  <Zap className="h-3 w-3 mr-2" />
                  Use Freeze
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-2" />
                  No Freezes Left
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Heatmap */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>Daily learning activity heatmap</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeMonth(-1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium px-4">
                {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeMonth(1)}
                disabled={selectedMonth.getMonth() === new Date().getMonth() && 
                         selectedMonth.getFullYear() === new Date().getFullYear()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900" />
                  <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-700" />
                  <div className="w-4 h-4 rounded bg-green-600 dark:bg-green-500" />
                  <div className="w-4 h-4 rounded bg-green-700 dark:bg-green-400" />
                </div>
                <span>More</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {streakData.totalDays} total days active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Streak Milestones
          </CardTitle>
          <CardDescription>Unlock rewards by maintaining your streak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => {
              const Icon = milestone.icon;
              const progress = Math.min(100, (streakData.longest / milestone.days) * 100);
              
              return (
                <Card
                  key={milestone.days}
                  className={`p-4 ${
                    milestone.unlocked
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/10 to-orange-500/10'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        milestone.unlocked
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                          : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          milestone.unlocked ? 'text-white' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{milestone.label}</h4>
                        {milestone.unlocked && (
                          <CheckCircle2 className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {milestone.days} day streak • {milestone.reward}
                      </p>
                      {!milestone.unlocked && (
                        <div className="space-y-1">
                          <Progress value={progress} className="h-1.5" />
                          <p className="text-xs text-muted-foreground">
                            {Math.round(progress)}% • {milestone.days - streakData.longest} days to go
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {todayCompleted ? "You're on fire today! 🔥" : "Keep your streak alive!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {todayCompleted
                    ? "Great job! Come back tomorrow to continue your streak."
                    : "Complete at least 15 minutes of learning to maintain your streak."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={simulateLearning}>
                <Target className="h-4 w-4 mr-2" />
                Log Learning
              </Button>
              {onNavigate && (
                <Button variant="outline" onClick={() => onNavigate('catalog')}>
                  Browse Courses
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
