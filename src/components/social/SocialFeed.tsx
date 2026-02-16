import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Trophy,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  Users,
  Flame,
  CheckCircle2,
  Star,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface SocialFeedProps {
  viewMode?: 'global' | 'following';
}

export function SocialFeed({ viewMode = 'following' }: SocialFeedProps) {
  const [postContent, setPostContent] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Activity' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'courses', label: 'Courses' },
    { id: 'discussions', label: 'Discussions' },
  ];

  const activities = [
    {
      id: '1',
      type: 'course_complete',
      user: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        level: 12,
      },
      content: {
        courseTitle: 'Advanced React Patterns',
        score: 98,
        certificateEarned: true,
      },
      timestamp: '2024-01-15T10:30:00',
      likes: 24,
      comments: 5,
      isLiked: false,
    },
    {
      id: '2',
      type: 'badge_earned',
      user: {
        name: 'Michael Chen',
        avatar: 'MC',
        level: 15,
      },
      content: {
        badgeName: 'JavaScript Master',
        badgeIcon: '💻',
        badgeRarity: 'rare',
      },
      timestamp: '2024-01-15T09:15:00',
      likes: 45,
      comments: 8,
      isLiked: true,
    },
    {
      id: '3',
      type: 'streak_milestone',
      user: {
        name: 'Emily Rodriguez',
        avatar: 'ER',
        level: 10,
      },
      content: {
        streakDays: 30,
      },
      timestamp: '2024-01-15T08:45:00',
      likes: 67,
      comments: 12,
      isLiked: false,
    },
    {
      id: '4',
      type: 'post',
      user: {
        name: 'David Kim',
        avatar: 'DK',
        level: 8,
      },
      content: {
        text: 'Just finished an amazing course on System Design! The instructor explained complex concepts so clearly. Highly recommend to anyone interested in backend architecture. 🚀',
      },
      timestamp: '2024-01-15T07:20:00',
      likes: 32,
      comments: 6,
      isLiked: false,
    },
    {
      id: '5',
      type: 'level_up',
      user: {
        name: 'Lisa Anderson',
        avatar: 'LA',
        level: 11,
      },
      content: {
        newLevel: 11,
        xpGained: 2500,
      },
      timestamp: '2024-01-14T18:30:00',
      likes: 18,
      comments: 3,
      isLiked: false,
    },
    {
      id: '6',
      type: 'course_start',
      user: {
        name: 'John Smith',
        avatar: 'JS',
        level: 5,
      },
      content: {
        courseTitle: 'Machine Learning Fundamentals',
      },
      timestamp: '2024-01-14T16:00:00',
      likes: 12,
      comments: 2,
      isLiked: false,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_complete': return BookOpen;
      case 'badge_earned': return Award;
      case 'streak_milestone': return Flame;
      case 'level_up': return TrendingUp;
      case 'course_start': return Target;
      case 'post': return MessageSquare;
      default: return Star;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course_complete': return 'text-green-500';
      case 'badge_earned': return 'text-purple-500';
      case 'streak_milestone': return 'text-orange-500';
      case 'level_up': return 'text-blue-500';
      case 'course_start': return 'text-yellow-500';
      default: return 'text-primary';
    }
  };

  const renderActivityContent = (activity: any) => {
    switch (activity.type) {
      case 'course_complete':
        return (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">{activity.user.name}</span> completed{' '}
              <span className="font-medium text-primary">{activity.content.courseTitle}</span>
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Score: {activity.content.score}%</span>
              </div>
              {activity.content.certificateEarned && (
                <Badge variant="secondary" className="gap-1">
                  <Award className="h-3 w-3" />
                  Certificate Earned
                </Badge>
              )}
            </div>
          </div>
        );

      case 'badge_earned':
        return (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">{activity.user.name}</span> earned a new badge!
            </p>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
              <div className="text-4xl">{activity.content.badgeIcon}</div>
              <div>
                <h4 className="font-semibold">{activity.content.badgeName}</h4>
                <Badge variant="outline" className="capitalize">
                  {activity.content.badgeRarity}
                </Badge>
              </div>
            </div>
          </div>
        );

      case 'streak_milestone':
        return (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">{activity.user.name}</span> reached a{' '}
              <span className="font-bold text-orange-500">{activity.content.streakDays}-day streak</span>! 🔥
            </p>
            <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">Consistency Champion!</span>
              </div>
            </div>
          </div>
        );

      case 'level_up':
        return (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">{activity.user.name}</span> leveled up to{' '}
              <span className="font-bold text-primary">Level {activity.content.newLevel}</span>!
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>+{activity.content.xpGained.toLocaleString()} XP gained</span>
            </div>
          </div>
        );

      case 'course_start':
        return (
          <p className="text-sm">
            <span className="font-semibold">{activity.user.name}</span> started learning{' '}
            <span className="font-medium text-primary">{activity.content.courseTitle}</span>
          </p>
        );

      case 'post':
        return (
          <div className="space-y-2">
            <p className="text-sm font-semibold">{activity.user.name}</p>
            <p className="text-sm whitespace-pre-wrap">{activity.content.text}</p>
          </div>
        );

      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handlePost = () => {
    if (!postContent.trim()) {
      toast.error('Please enter some content');
      return;
    }
    toast.success('Post shared with your followers!');
    setPostContent('');
  };

  const handleLike = (activityId: string) => {
    toast.success('Liked!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Share your learning journey, achievements, or thoughts..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Share with your followers
                </p>
                <Button onClick={handlePost}>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const iconColor = getActivityColor(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* User Avatar with Level */}
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{activity.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold border-2 border-background">
                        {activity.user.level}
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>

                      {renderActivityContent(activity)}

                      {/* Actions */}
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(activity.id)}
                          className={activity.isLiked ? 'text-primary' : ''}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-2 ${activity.isLiked ? 'fill-current' : ''}`} />
                          {activity.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {activity.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Activities</Button>
      </div>
    </div>
  );
}
