import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Trophy,
  Award,
  Star,
  Zap,
  Target,
  BookOpen,
  Flame,
  Crown,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'learning' | 'social' | 'achievement' | 'streak';
  requirement: string;
  progress: number;
  total: number;
  earned: boolean;
  earnedDate?: string;
  points: number;
}

export function BadgeSystem({ userBadges = [] }: { userBadges?: any[] }) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  // Mock badge data
  const allBadges: BadgeData[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      rarity: 'common',
      category: 'learning',
      requirement: 'Complete 1 lesson',
      progress: 1,
      total: 1,
      earned: true,
      earnedDate: '2024-01-15',
      points: 50,
    },
    {
      id: '2',
      name: 'Knowledge Seeker',
      description: 'Complete 10 lessons',
      icon: '📚',
      rarity: 'common',
      category: 'learning',
      requirement: 'Complete 10 lessons',
      progress: 7,
      total: 10,
      earned: false,
      points: 100,
    },
    {
      id: '3',
      name: 'Course Crusher',
      description: 'Complete your first course',
      icon: '🎓',
      rarity: 'rare',
      category: 'achievement',
      requirement: 'Complete 1 course',
      progress: 0,
      total: 1,
      earned: false,
      points: 200,
    },
    {
      id: '4',
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      rarity: 'rare',
      category: 'streak',
      requirement: '7-day streak',
      progress: 5,
      total: 7,
      earned: false,
      points: 150,
    },
    {
      id: '5',
      name: 'Social Butterfly',
      description: 'Leave 10 comments on lessons',
      icon: '💬',
      rarity: 'common',
      category: 'social',
      requirement: 'Leave 10 comments',
      progress: 3,
      total: 10,
      earned: false,
      points: 75,
    },
    {
      id: '6',
      name: 'Perfect Score',
      description: 'Get 100% on a quiz',
      icon: '⭐',
      rarity: 'rare',
      category: 'achievement',
      requirement: '100% quiz score',
      progress: 0,
      total: 1,
      earned: false,
      points: 200,
    },
    {
      id: '7',
      name: 'Marathon Master',
      description: 'Maintain a 30-day learning streak',
      icon: '👑',
      rarity: 'epic',
      category: 'streak',
      requirement: '30-day streak',
      progress: 5,
      total: 30,
      earned: false,
      points: 500,
    },
    {
      id: '8',
      name: 'Course Conqueror',
      description: 'Complete 5 courses',
      icon: '🏆',
      rarity: 'epic',
      category: 'achievement',
      requirement: 'Complete 5 courses',
      progress: 0,
      total: 5,
      earned: false,
      points: 750,
    },
    {
      id: '9',
      name: 'Legend',
      description: 'Reach 10,000 XP',
      icon: '💎',
      rarity: 'legendary',
      category: 'achievement',
      requirement: 'Earn 10,000 XP',
      progress: 2500,
      total: 10000,
      earned: false,
      points: 1000,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/10 text-gray-500';
      case 'rare':
        return 'bg-blue-500/10 text-blue-500';
      case 'epic':
        return 'bg-purple-500/10 text-purple-500';
      case 'legendary':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const filteredBadges = allBadges.filter((badge) => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const earnedCount = allBadges.filter((b) => b.earned).length;
  const totalPoints = allBadges.filter((b) => b.earned).reduce((sum, b) => sum + b.points, 0);

  const categoryGroups = {
    learning: filteredBadges.filter((b) => b.category === 'learning'),
    achievement: filteredBadges.filter((b) => b.category === 'achievement'),
    streak: filteredBadges.filter((b) => b.category === 'streak'),
    social: filteredBadges.filter((b) => b.category === 'social'),
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Badges Earned</p>
                <p className="text-3xl font-bold">
                  {earnedCount}/{allBadges.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Badge Points</p>
                <p className="text-3xl font-bold">{totalPoints}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Collection Progress</p>
                <p className="text-3xl font-bold">
                  {Math.round((earnedCount / allBadges.length) * 100)}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({allBadges.length})
            </Button>
            <Button
              variant={filter === 'earned' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('earned')}
            >
              Earned ({earnedCount})
            </Button>
            <Button
              variant={filter === 'locked' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('locked')}
            >
              Locked ({allBadges.length - earnedCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badge Tabs by Category */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="learning">
            <BookOpen className="h-4 w-4 mr-2" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="achievement">
            <Trophy className="h-4 w-4 mr-2" />
            Achievement
          </TabsTrigger>
          <TabsTrigger value="streak">
            <Flame className="h-4 w-4 mr-2" />
            Streak
          </TabsTrigger>
          <TabsTrigger value="social">
            <Sparkles className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BadgeGrid badges={filteredBadges} onSelect={setSelectedBadge} getRarityColor={getRarityColor} />
        </TabsContent>

        <TabsContent value="learning" className="mt-6">
          <BadgeGrid badges={categoryGroups.learning} onSelect={setSelectedBadge} getRarityColor={getRarityColor} />
        </TabsContent>

        <TabsContent value="achievement" className="mt-6">
          <BadgeGrid badges={categoryGroups.achievement} onSelect={setSelectedBadge} getRarityColor={getRarityColor} />
        </TabsContent>

        <TabsContent value="streak" className="mt-6">
          <BadgeGrid badges={categoryGroups.streak} onSelect={setSelectedBadge} getRarityColor={getRarityColor} />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <BadgeGrid badges={categoryGroups.social} onSelect={setSelectedBadge} getRarityColor={getRarityColor} />
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className={`h-32 w-32 rounded-full bg-gradient-to-br ${getRarityColor(
                      selectedBadge.rarity
                    )} flex items-center justify-center mx-auto mb-6 ${
                      !selectedBadge.earned && 'opacity-50 grayscale'
                    }`}
                  >
                    <span className="text-6xl">{selectedBadge.icon}</span>
                    {!selectedBadge.earned && (
                      <div className="absolute">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </motion.div>

                  <Badge className={getRarityBadgeColor(selectedBadge.rarity)} variant="outline">
                    {selectedBadge.rarity.toUpperCase()}
                  </Badge>

                  <h3 className="text-2xl font-bold mt-4 mb-2">{selectedBadge.name}</h3>
                  <p className="text-muted-foreground mb-4">{selectedBadge.description}</p>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Requirement</p>
                      <p className="text-sm text-muted-foreground">{selectedBadge.requirement}</p>
                    </div>

                    {!selectedBadge.earned && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {selectedBadge.progress}/{selectedBadge.total}
                          </span>
                        </div>
                        <Progress
                          value={(selectedBadge.progress / selectedBadge.total) * 100}
                        />
                      </div>
                    )}

                    {selectedBadge.earned && (
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">
                          Earned on {new Date(selectedBadge.earnedDate!).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{selectedBadge.points} Points</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6" onClick={() => setSelectedBadge(null)}>
                    Close
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BadgeGrid({
  badges,
  onSelect,
  getRarityColor,
}: {
  badges: BadgeData[];
  onSelect: (badge: BadgeData) => void;
  getRarityColor: (rarity: string) => string;
}) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No badges in this category yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              !badge.earned && 'opacity-75'
            }`}
            onClick={() => onSelect(badge)}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`h-20 w-20 rounded-full bg-gradient-to-br ${getRarityColor(
                  badge.rarity
                )} flex items-center justify-center mx-auto mb-3 relative ${
                  !badge.earned && 'opacity-50 grayscale'
                }`}
              >
                <span className="text-4xl">{badge.icon}</span>
                {!badge.earned && (
                  <div className="absolute">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <h4 className="font-semibold mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {badge.description}
              </p>
              {!badge.earned && (
                <div className="space-y-1">
                  <Progress value={(badge.progress / badge.total) * 100} className="h-1" />
                  <p className="text-xs text-muted-foreground">
                    {badge.progress}/{badge.total}
                  </p>
                </div>
              )}
              {badge.earned && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Earned
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
