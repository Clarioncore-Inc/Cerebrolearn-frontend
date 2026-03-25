import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../utils/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  User,
  Mail,
  Trophy,
  Flame,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Settings,
  Lock,
  Bell,
  Save,
  Camera,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await authApi.updateProfile(formData);

      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total XP',
      value: profile?.xp || 0,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'Experience points earned',
    },
    {
      label: 'Day Streak',
      value: profile?.streak || 0,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'Consecutive days learning',
    },
    {
      label: 'Badges',
      value: profile?.badges?.length || 0,
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Achievements unlocked',
    },
    {
      label: 'Rank',
      value: getRankFromXP(profile?.xp || 0),
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Current level',
    },
  ];

  function getRankFromXP(xp: number): string {
    if (xp < 100) return 'Beginner';
    if (xp < 500) return 'Learner';
    if (xp < 1000) return 'Intermediate';
    if (xp < 2500) return 'Advanced';
    if (xp < 5000) return 'Expert';
    return 'Master';
  }

  function getNextRankXP(xp: number): number {
    if (xp < 100) return 100;
    if (xp < 500) return 500;
    if (xp < 1000) return 1000;
    if (xp < 2500) return 2500;
    if (xp < 5000) return 5000;
    return 10000;
  }

  const currentXP = profile?.xp || 0;
  const nextRankXP = getNextRankXP(currentXP);
  const progressToNextRank = (currentXP / nextRankXP) * 100;

  return (
    <div className='container py-8 space-y-8 max-w-7xl'>
      {/* Header */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl md:text-4xl mb-2'>Profile Settings</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and preferences
          </p>
        </div>
        <Badge variant='secondary' className='text-sm'>
          <Sparkles className='mr-1 h-3 w-3' />
          {profile?.role || 'Learner'}
        </Badge>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left Column - Profile Card */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Avatar and Basic Info */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center text-center space-y-4'>
                <div className='relative'>
                  <Avatar className='h-32 w-32'>
                    <AvatarImage src={profile?.avatar || undefined} />
                    <AvatarFallback className='text-4xl'>
                      {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size='icon'
                    variant='secondary'
                    className='absolute bottom-0 right-0 rounded-full h-10 w-10'
                  >
                    <Camera className='h-4 w-4' />
                  </Button>
                </div>

                <div className='space-y-1'>
                  <h3 className='text-xl'>{profile?.full_name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {profile?.email}
                  </p>
                </div>

                <Badge className='capitalize'>
                  {profile?.role?.replace('_', ' ') || 'Learner'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5' />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Level Progress */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label>Level Progress</Label>
                  <span className='text-sm font-medium'>
                    {currentXP} / {nextRankXP} XP
                  </span>
                </div>
                <Progress value={progressToNextRank} className='h-2' />
                <p className='text-xs text-muted-foreground'>
                  {nextRankXP - currentXP} XP until next rank
                </p>
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className='grid grid-cols-2 gap-4'>
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className='space-y-2 p-3 rounded-lg border bg-muted/30'
                  >
                    <div
                      className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center mx-auto`}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold'>{stat.value}</p>
                      <p className='text-xs text-muted-foreground'>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='general' className='space-y-6'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='general'>
                <User className='mr-2 h-4 w-4' />
                General
              </TabsTrigger>
              <TabsTrigger value='security'>
                <Lock className='mr-2 h-4 w-4' />
                Security
              </TabsTrigger>
              <TabsTrigger value='achievements'>
                <Award className='mr-2 h-4 w-4' />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value='general' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='full_name'>Full Name</Label>
                    <Input
                      id='full_name'
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address</Label>
                    <Input
                      id='email'
                      type='email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Account Role</Label>
                    <Input
                      value={profile?.role?.replace('_', ' ') || 'Learner'}
                      disabled
                      className='capitalize'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Contact admin to change your role
                    </p>
                  </div>

                  <div className='flex gap-2 pt-4'>
                    {isEditing ? (
                      <>
                        <Button onClick={handleUpdate} disabled={loading}>
                          <Save className='mr-2 h-4 w-4' />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              full_name: profile?.full_name || '',
                              email: profile?.email || '',
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Settings className='mr-2 h-4 w-4' />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your learning experience
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label>Email Notifications</Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive updates about your courses
                      </p>
                    </div>
                    <Button variant='outline' size='sm'>
                      <Bell className='mr-2 h-4 w-4' />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value='security' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <Alert>
                    <Lock className='h-4 w-4' />
                    <AlertDescription>
                      For security reasons, you'll need to sign in again after
                      changing your password
                    </AlertDescription>
                  </Alert>

                  <div className='space-y-2'>
                    <Label htmlFor='current_password'>Current Password</Label>
                    <Input id='current_password' type='password' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='new_password'>New Password</Label>
                    <Input id='new_password' type='password' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='confirm_password'>
                      Confirm New Password
                    </Label>
                    <Input id='confirm_password' type='password' />
                  </div>

                  <Button>
                    <Lock className='mr-2 h-4 w-4' />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label>Two-Factor Authentication</Label>
                      <p className='text-sm text-muted-foreground'>
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant='outline'>Enable</Button>
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label>Active Sessions</Label>
                      <p className='text-sm text-muted-foreground'>
                        Manage your active sessions
                      </p>
                    </div>
                    <Button variant='outline'>View</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value='achievements' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>
                    Badges and milestones you've unlocked
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile?.badges && profile.badges.length > 0 ? (
                    <div className='grid gap-4 md:grid-cols-2'>
                      {profile.badges.map((badge: any, index: number) => (
                        <div
                          key={index}
                          className='flex items-start gap-4 p-4 rounded-lg border bg-muted/30'
                        >
                          <div className='h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0'>
                            <Trophy className='h-8 w-8 text-white' />
                          </div>
                          <div className='space-y-1'>
                            <h4 className='font-medium'>{badge.name}</h4>
                            <p className='text-sm text-muted-foreground'>
                              {badge.description}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              Earned{' '}
                              {new Date(badge.earned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <div className='mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4'>
                        <Award className='h-8 w-8 text-muted-foreground' />
                      </div>
                      <h3 className='mb-2'>No badges yet</h3>
                      <p className='text-muted-foreground mb-6'>
                        Complete courses and challenges to earn your first badge
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Milestones</CardTitle>
                  <CardDescription>Goals to work towards</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {[
                    {
                      title: 'First Course',
                      description: 'Complete your first course',
                      progress: 0,
                      target: 1,
                    },
                    {
                      title: '7-Day Streak',
                      description: 'Learn for 7 days in a row',
                      progress: profile?.streak || 0,
                      target: 7,
                    },
                    {
                      title: '100 XP',
                      description: 'Earn 100 experience points',
                      progress: profile?.xp || 0,
                      target: 100,
                    },
                    {
                      title: 'Course Master',
                      description: 'Complete 5 courses',
                      progress: 0,
                      target: 5,
                    },
                  ].map((milestone, index) => (
                    <div key={index} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-medium'>{milestone.title}</p>
                          <p className='text-sm text-muted-foreground'>
                            {milestone.description}
                          </p>
                        </div>
                        {milestone.progress >= milestone.target && (
                          <CheckCircle2 className='h-5 w-5 text-green-500' />
                        )}
                      </div>
                      <div className='space-y-1'>
                        <Progress
                          value={(milestone.progress / milestone.target) * 100}
                          className='h-2'
                        />
                        <p className='text-xs text-muted-foreground'>
                          {milestone.progress} / {milestone.target}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
