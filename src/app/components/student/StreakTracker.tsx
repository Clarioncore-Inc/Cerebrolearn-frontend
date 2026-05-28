import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Flame, Calendar, TrendingUp, Award, Zap, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
}

export function StreakTracker({
  currentStreak = 0,
  longestStreak = 0,
  totalDaysActive = 0,
}: StreakTrackerProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate calendar data for selected month
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, active: false, today: false });
    }

    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      
      // Mock: Random activity for past days
      const isPast = date < today;
      const isActive = isPast && Math.random() > 0.3;

      days.push({ day, active: isActive || isToday, today: isToday });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Streak milestones
  const milestones = [
    { days: 7, name: '1 Week Warrior', icon: '🔥', achieved: currentStreak >= 7 },
    { days: 14, name: '2 Week Champion', icon: '⚡', achieved: currentStreak >= 14 },
    { days: 30, name: '1 Month Master', icon: '🏆', achieved: currentStreak >= 30 },
    { days: 100, name: '100 Day Legend', icon: '👑', achieved: currentStreak >= 100 },
  ];

  const nextMilestone = milestones.find((m) => !m.achieved) || milestones[milestones.length - 1];
  const progressToNextMilestone = nextMilestone
    ? (currentStreak / nextMilestone.days) * 100
    : 100;

  const stats = [
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Active Days',
      value: `${totalDaysActive} days`,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ];

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Streak Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current Streak Card */}
      {currentStreak > 0 && (
        <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
                >
                  <Flame className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">{currentStreak} Day Streak! 🔥</h3>
                  <p className="text-muted-foreground">Keep learning to maintain your streak</p>
                </div>
              </div>
              {currentStreak < nextMilestone.days && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    {nextMilestone.days - currentStreak} days to
                  </p>
                  <p className="font-semibold">{nextMilestone.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Milestone Progress */}
      {currentStreak < nextMilestone.days && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next Milestone
            </CardTitle>
            <CardDescription>
              Complete {nextMilestone.days - currentStreak} more days to unlock "{nextMilestone.name}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {currentStreak}/{nextMilestone.days} days
                </span>
              </div>
              <Progress value={progressToNextMilestone} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestone Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Streak Milestones
          </CardTitle>
          <CardDescription>Track your progress towards streak achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone) => (
              <Card
                key={milestone.days}
                className={`${
                  milestone.achieved
                    ? 'border-primary bg-primary/5'
                    : 'opacity-60 grayscale'
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{milestone.icon}</div>
                  <p className="font-semibold mb-1">{milestone.name}</p>
                  <p className="text-sm text-muted-foreground">{milestone.days} days</p>
                  {milestone.achieved && (
                    <Badge className="mt-2 bg-green-500">
                      Achieved!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Calendar
              </CardTitle>
              <CardDescription>Your daily learning activity</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                ‹
              </Button>
              <span className="px-4 py-2 text-sm font-medium">{monthName}</span>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                ›
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                    !dayData.day
                      ? 'bg-transparent'
                      : dayData.today
                      ? 'bg-primary text-white font-bold ring-2 ring-primary ring-offset-2'
                      : dayData.active
                      ? 'bg-green-500 text-white font-semibold hover:bg-green-600'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${dayData.day ? 'cursor-pointer' : ''}`}
                  title={
                    dayData.day
                      ? dayData.active
                        ? 'Active day'
                        : 'Inactive day'
                      : ''
                  }
                >
                  {dayData.day}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-muted" />
                <span className="text-sm text-muted-foreground">Inactive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-primary ring-2 ring-primary ring-offset-2" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Streak Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Complete at least one lesson every day to maintain your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Set a reminder to study at the same time each day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Even 10 minutes of learning counts towards your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Longer streaks unlock exclusive badges and rewards</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
