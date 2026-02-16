import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Flame,
  Star,
  Award,
  Target,
  BookOpen,
  MessageSquare,
  Users,
  Calendar,
  ChevronUp,
  ChevronDown,
  Minus,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CommunityLeaderboardProps {
  currentUserId: string;
}

export function CommunityLeaderboard({ currentUserId }: CommunityLeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'alltime'>('week');
  const [category, setCategory] = useState<'xp' | 'streak' | 'courses' | 'helpful'>('xp');

  const leaderboards = {
    xp: [
      {
        userId: '1',
        rank: 1,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        level: 24,
        value: 45620,
        change: 'up',
        changeValue: 2,
        badge: '👑',
      },
      {
        userId: '2',
        rank: 2,
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        level: 22,
        value: 42150,
        change: 'same',
        changeValue: 0,
        badge: '🥈',
      },
      {
        userId: '3',
        rank: 3,
        name: 'Emily Rodriguez',
        avatar: 'ER',
        level: 21,
        value: 39840,
        change: 'up',
        changeValue: 1,
        badge: '🥉',
      },
      {
        userId: '4',
        rank: 4,
        name: 'David Kim',
        avatar: 'DK',
        level: 20,
        value: 37250,
        change: 'down',
        changeValue: 2,
      },
      {
        userId: '5',
        rank: 5,
        name: 'Lisa Anderson',
        avatar: 'LA',
        level: 19,
        value: 35100,
        change: 'up',
        changeValue: 3,
      },
      {
        userId: currentUserId,
        rank: 42,
        name: 'You',
        avatar: 'YO',
        level: 12,
        value: 12450,
        change: 'up',
        changeValue: 5,
        isCurrentUser: true,
      },
    ],
    streak: [
      {
        userId: '1',
        rank: 1,
        name: 'Emily Rodriguez',
        avatar: 'ER',
        level: 21,
        value: 156,
        change: 'same',
        changeValue: 0,
        badge: '🔥',
      },
      {
        userId: '2',
        rank: 2,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        level: 24,
        value: 142,
        change: 'up',
        changeValue: 1,
        badge: '💪',
      },
      {
        userId: '3',
        rank: 3,
        name: 'John Smith',
        avatar: 'JS',
        level: 18,
        value: 128,
        change: 'down',
        changeValue: 1,
        badge: '⚡',
      },
    ],
    courses: [
      {
        userId: '1',
        rank: 1,
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        level: 22,
        value: 48,
        change: 'up',
        changeValue: 1,
        badge: '📚',
      },
      {
        userId: '2',
        rank: 2,
        name: 'Lisa Anderson',
        avatar: 'LA',
        level: 19,
        value: 42,
        change: 'same',
        changeValue: 0,
        badge: '🎓',
      },
      {
        userId: '3',
        rank: 3,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        level: 24,
        value: 38,
        change: 'up',
        changeValue: 2,
        badge: '⭐',
      },
    ],
    helpful: [
      {
        userId: '1',
        rank: 1,
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        level: 22,
        value: 342,
        change: 'same',
        changeValue: 0,
        badge: '🤝',
      },
      {
        userId: '2',
        rank: 2,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        level: 24,
        value: 289,
        change: 'up',
        changeValue: 1,
        badge: '💡',
      },
      {
        userId: '3',
        rank: 3,
        name: 'Emily Rodriguez',
        avatar: 'ER',
        level: 21,
        value: 245,
        change: 'down',
        changeValue: 1,
        badge: '🌟',
      },
    ],
  };

  const currentLeaderboard = leaderboards[category];
  const currentUserEntry = currentLeaderboard.find((entry) => entry.userId === currentUserId);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'xp': return 'Total XP';
      case 'streak': return 'Day Streak';
      case 'courses': return 'Courses Completed';
      case 'helpful': return 'Helpful Responses';
      default: return '';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'xp': return Trophy;
      case 'streak': return Flame;
      case 'courses': return BookOpen;
      case 'helpful': return MessageSquare;
      default: return Star;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const getChangeIcon = (change: string) => {
    if (change === 'up') return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (change === 'down') return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Community Leaderboard</h2>
        <p className="text-muted-foreground">
          See how you stack up against other learners
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'xp', icon: Trophy, label: 'Total XP', color: 'from-yellow-500 to-orange-500' },
          { id: 'streak', icon: Flame, label: 'Streaks', color: 'from-orange-500 to-red-500' },
          { id: 'courses', icon: BookOpen, label: 'Courses', color: 'from-blue-500 to-cyan-500' },
          { id: 'helpful', icon: MessageSquare, label: 'Helpful', color: 'from-purple-500 to-pink-500' },
        ].map((cat) => (
          <Card
            key={cat.id}
            className={`cursor-pointer transition-all ${
              category === cat.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'
            }`}
            onClick={() => setCategory(cat.id as any)}
          >
            <CardContent className="p-6 text-center">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3`}>
                <cat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="font-semibold">{cat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeframe Selection */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Timeframe:</span>
        <div className="flex gap-2">
          {[
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'alltime', label: 'All Time' },
          ].map((tf) => (
            <Button
              key={tf.id}
              variant={timeframe === tf.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf.id as any)}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(getCategoryIcon(category), { className: 'h-5 w-5' })}
                Top Performers - {getCategoryLabel(category)}
              </CardTitle>
              <CardDescription>
                Leaders for {timeframe === 'week' ? 'this week' : timeframe === 'month' ? 'this month' : 'all time'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentLeaderboard.slice(0, 10).map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-lg flex items-center gap-4 ${
                    entry.isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {getRankIcon(entry.rank) || (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{entry.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold border-2 border-background">
                      {entry.level}
                    </div>
                  </div>

                  {/* Name & Badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">
                        {entry.name}
                        {entry.isCurrentUser && <span className="text-primary"> (You)</span>}
                      </h4>
                      {entry.badge && <span className="text-xl">{entry.badge}</span>}
                    </div>
                    {entry.change !== 'same' && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getChangeIcon(entry.change)}
                        <span>{entry.changeValue} from last {timeframe}</span>
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {entry.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">{getCategoryLabel(category)}</div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Your Position (if not in top 10) */}
          {currentUserEntry && currentUserEntry.rank > 10 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    <span className="text-lg font-bold text-primary">#{currentUserEntry.rank}</span>
                  </div>
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{currentUserEntry.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold border-2 border-background">
                      {currentUserEntry.level}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Your Position</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getChangeIcon(currentUserEntry.change)}
                      <span>{currentUserEntry.changeValue} from last {timeframe}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {currentUserEntry.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats & Insights */}
        <div className="space-y-6">
          {/* Your Rank Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Your Rank</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-primary">
                #{currentUserEntry?.rank || '--'}
              </div>
              <p className="text-sm text-muted-foreground">
                Out of {currentLeaderboard.length.toLocaleString()} learners
              </p>
              {currentUserEntry && (
                <>
                  <div className="pt-4 border-t">
                    <div className="text-2xl font-bold">
                      {currentUserEntry.value.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">{getCategoryLabel(category)}</p>
                  </div>
                  {currentUserEntry.rank > 1 && (
                    <div className="pt-4 border-t text-sm">
                      <p className="text-muted-foreground mb-1">To reach rank #{currentUserEntry.rank - 1}:</p>
                      <p className="font-semibold">
                        Need {(
                          currentLeaderboard[currentUserEntry.rank - 2].value - currentUserEntry.value
                        ).toLocaleString()} more
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Achievement Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Next Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top 50</span>
                  <Badge variant="outline">8 spots away</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top 25</span>
                  <Badge variant="outline">17 spots away</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top 10</span>
                  <Badge variant="outline">32 spots away</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '20%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Level</span>
                <span className="font-semibold">{currentUserEntry?.level || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total XP</span>
                <span className="font-semibold">
                  {leaderboards.xp.find(e => e.userId === currentUserId)?.value.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="font-semibold">
                  {leaderboards.streak.find(e => e.userId === currentUserId)?.value || 0} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Courses</span>
                <span className="font-semibold">
                  {leaderboards.courses.find(e => e.userId === currentUserId)?.value || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
