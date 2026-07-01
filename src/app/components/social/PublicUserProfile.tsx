import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Github,
  MessageSquare,
  UserPlus,
  UserMinus,
  Mail,
  Trophy,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Flame,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface PublicUserProfileProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function PublicUserProfile({ userId, isOwnProfile = false }: PublicUserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const user = {
    id: userId,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    title: 'Full-Stack Developer & Lifelong Learner',
    bio: 'Passionate about web development and teaching others. I love learning new technologies and sharing my knowledge with the community.',
    location: 'San Francisco, CA',
    joinedDate: '2023-03-15',
    website: 'https://sarahjohnson.dev',
    social: {
      twitter: '@sarahdev',
      linkedin: 'sarahjohnson',
      github: 'sarahj',
    },
    stats: {
      coursesCompleted: 24,
      totalXP: 12450,
      currentStreak: 15,
      followers: 234,
      following: 156,
      badges: 18,
    },
    level: {
      current: 12,
      name: 'Advanced Learner',
      progress: 65,
      nextLevel: 13,
      xpToNext: 1550,
    },
  };

  const badges = [
    { id: '1', name: 'First Steps', description: 'Completed first course', icon: '🎯', rarity: 'common', earned: '2023-03-20' },
    { id: '2', name: 'Week Warrior', description: '7-day streak', icon: '🔥', rarity: 'uncommon', earned: '2023-04-10' },
    { id: '3', name: 'JavaScript Master', description: 'Completed all JS courses', icon: '💻', rarity: 'rare', earned: '2023-06-15' },
    { id: '4', name: 'Community Helper', description: '50 helpful forum posts', icon: '🤝', rarity: 'epic', earned: '2023-08-22' },
    { id: '5', name: 'Speed Learner', description: 'Completed course in record time', icon: '⚡', rarity: 'rare', earned: '2023-09-30' },
    { id: '6', name: 'Perfect Score', description: 'Aced a difficult quiz', icon: '💯', rarity: 'uncommon', earned: '2023-10-15' },
  ];

  const coursesInProgress = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      progress: 75,
      lastAccessed: '2024-01-15',
      instructor: 'Dr. Michael Chen',
    },
    {
      id: '2',
      title: 'System Design Fundamentals',
      progress: 45,
      lastAccessed: '2024-01-14',
      instructor: 'Emily Rodriguez',
    },
  ];

  const completedCourses = [
    {
      id: '3',
      title: 'JavaScript Fundamentals',
      completedDate: '2023-12-10',
      score: 98,
      certificate: true,
    },
    {
      id: '4',
      title: 'Node.js Backend Development',
      completedDate: '2023-11-25',
      score: 95,
      certificate: true,
    },
    {
      id: '5',
      title: 'Database Design',
      completedDate: '2023-10-30',
      score: 92,
      certificate: true,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'course_complete',
      message: 'Completed "JavaScript Fundamentals"',
      date: '2023-12-10',
      icon: CheckCircle2,
    },
    {
      id: '2',
      type: 'badge_earned',
      message: 'Earned the "JavaScript Master" badge',
      date: '2023-06-15',
      icon: Award,
    },
    {
      id: '3',
      type: 'forum_post',
      message: 'Helped someone in the React forum',
      date: '2024-01-14',
      icon: MessageSquare,
    },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed successfully' : 'Following user!');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'uncommon': return 'text-green-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-4xl">{user.avatar}</AvatarFallback>
              </Avatar>
              
              {!isOwnProfile && (
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1"
                    variant={isFollowing ? 'outline' : 'default'}
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{user.title}</p>
              <p className="text-sm mb-4">{user.bio}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                    <LinkIcon className="h-4 w-4" />
                    {user.website.replace('https://', '')}
                  </a>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {user.social.twitter && (
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Twitter className="h-4 w-4" />
                    {user.social.twitter}
                  </Button>
                )}
                {user.social.linkedin && (
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                )}
                {user.social.github && (
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    {user.social.github}
                  </Button>
                )}
              </div>
            </div>

            {/* Level Progress */}
            <div className="md:w-64">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">Lvl {user.level.current}</div>
                    <div className="text-sm text-muted-foreground">{user.level.name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Lvl {user.level.nextLevel}</span>
                      <span className="font-medium">{user.level.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${user.level.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {user.level.xpToNext.toLocaleString()} XP to next level
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.stats.coursesCompleted}</div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.stats.totalXP.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.stats.badges}</div>
            <div className="text-sm text-muted-foreground">Badges</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.stats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <UserPlus className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.stats.following}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Courses in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coursesInProgress.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    </div>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.slice(0, 6).map((badge) => (
                  <div key={badge.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h4 className={`font-semibold text-sm mb-1 ${getRarityColor(badge.rarity)}`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>In Progress ({coursesInProgress.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coursesInProgress.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{course.progress}% complete</span>
                      <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button>Continue</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed ({completedCourses.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{course.title}</h4>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Score: {course.score}%</span>
                      <span>Completed: {new Date(course.completedDate).toLocaleDateString()}</span>
                      {course.certificate && (
                        <Badge variant="secondary">Certificate Earned</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Badges ({badges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {badges.map((badge) => (
                  <div key={badge.id} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h4 className={`font-semibold mb-2 ${getRarityColor(badge.rarity)}`}>
                      {badge.name}
                    </h4>
                    <Badge variant="outline" className="mb-2 capitalize">
                      {badge.rarity}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Earned: {new Date(badge.earned).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
