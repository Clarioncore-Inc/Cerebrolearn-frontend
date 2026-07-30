import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  socialGraphApi,
  discussionsApi,
  reviewsApi,
  mentoringApi,
  educationApi,
  workExperienceApi,
  interestsApi,
  skillsApi,
  activityApi,
  type DiscussionPostRecord,
} from '../../utils/api-client';
import type {
  PublicProfile,
  FollowUser,
  FollowStatus,
  Review,
  MentoringListing,
  Education,
  WorkExperience,
  Interest,
  Skill,
  ActivityItem,
} from '../../types/database';
import { ActivityFeedList } from '../social/ActivityFeedList';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Activity,
  User as UserIcon,
  Sparkles,
  Loader2,
  MapPin,
  MessageSquare,
  Star,
  ThumbsUp,
  DollarSign,
  GraduationCap,
  UserPlus,
  UserMinus,
  Briefcase,
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserProfilePageProps {
  userId: string;
  onNavigate?: (page: string, data?: any) => void;
}

export function UserProfilePage({ userId, onNavigate }: UserProfilePageProps) {
  const { profile: viewerProfile } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [status, setStatus] = useState<FollowStatus | null>(null);
  const [followBusy, setFollowBusy] = useState(false);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPostRecord[]>([]);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [mentoringListings, setMentoringListings] = useState<MentoringListing[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listDialog, setListDialog] = useState<'followers' | 'following' | null>(null);
  const [listUsers, setListUsers] = useState<FollowUser[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');

  const isOwnProfile = viewerProfile?.id === userId;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.allSettled([
      socialGraphApi.getPublicProfile(userId).then(setProfile),
      socialGraphApi.getStatus(userId).then(setStatus),
      discussionsApi.list({ user_id: userId }).then(setDiscussionPosts),
      reviewsApi.getForUser(userId).then(setCourseReviews),
      mentoringApi.listListings({ user_id: userId }).then(setMentoringListings),
      educationApi.list(userId).then(setEducations),
      workExperienceApi.list(userId).then(setWorkExperiences),
      interestsApi.list(userId).then(setInterests),
      skillsApi.list(userId).then(setSkills),
      activityApi.getUserFeed(userId).then(setActivityItems),
    ]).finally(() => setLoading(false));
  }, [userId]);

  const handleToggleFollow = async () => {
    if (!status) return;
    setFollowBusy(true);
    try {
      if (status.is_following) {
        await socialGraphApi.unfollow(userId);
        setStatus({
          ...status,
          is_following: false,
          followers_count: Math.max(status.followers_count - 1, 0),
        });
        toast.success('Unfollowed successfully');
      } else {
        await socialGraphApi.follow(userId);
        setStatus({
          ...status,
          is_following: true,
          followers_count: status.followers_count + 1,
        });
        toast.success('Following user!');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setFollowBusy(false);
    }
  };

  const openList = async (kind: 'followers' | 'following') => {
    setListDialog(kind);
    setListLoading(true);
    try {
      const users =
        kind === 'followers'
          ? await socialGraphApi.getFollowers(userId)
          : await socialGraphApi.getFollowing(userId);
      setListUsers(users || []);
    } catch {
      setListUsers([]);
    } finally {
      setListLoading(false);
    }
  };

  if (!profile || loading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  const topTabClassName =
    'rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none';
  const profileTabs = [
    { value: 'activity', label: 'Activity', icon: Activity },
    { value: 'about', label: 'About', icon: UserIcon },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'interests', label: 'Interests', icon: Heart },
    { value: 'community', label: 'Community', icon: MessageSquare },
    { value: 'mentoring', label: 'Mentoring', icon: GraduationCap },
  ];
  const primaryTabs = profileTabs.slice(0, 5);
  const overflowTabs = profileTabs.slice(5);
  const activeTabConfig = profileTabs.find((tab) => tab.value === activeTab) ?? profileTabs[0];
  const activeOverflowTab = overflowTabs.find((tab) => tab.value === activeTab);
  const ActiveTabIcon = activeTabConfig.icon;

  return (
    <div className='min-h-screen bg-muted/20'>
      <div className='mx-auto max-w-7xl px-0 pb-6 md:px-6 md:pb-8'>
        <div className='overflow-hidden rounded-3xl border bg-background shadow-sm'>
          <div className='relative h-56 overflow-hidden md:h-80'>
            {profile.cover_photo ? (
              <img
                src={profile.cover_photo}
                alt={`${profile.full_name || 'Profile'} cover`}
                className='absolute inset-0 h-full w-full object-cover'
              />
            ) : (
              <>
                <div className='absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500' />
                <div className='absolute inset-0 bg-black/20' />
              </>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='gap-0'>
            <div className='relative px-4 pb-2 md:px-8'>
              <div className='relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-start md:gap-6'>
                <Avatar className='-mt-12 h-32 w-32 shrink-0 border-4 border-background shadow-xl md:-mt-16 md:h-40 md:w-40'>
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className='text-4xl'>
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className='min-w-0 flex-1 space-y-2 pt-2 md:pt-6'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <h1 className='text-3xl font-semibold leading-tight text-foreground md:text-4xl'>
                      {profile.full_name}
                    </h1>
                    {!isOwnProfile && status && (
                      <div className='flex items-center gap-2'>
                        <Button
                          variant={status.is_following ? 'outline' : 'default'}
                          disabled={followBusy}
                          onClick={handleToggleFollow}
                        >
                          {status.is_following ? (
                            <>
                              <UserMinus className='mr-2 h-4 w-4' />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className='mr-2 h-4 w-4' />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
                    <Badge variant='secondary' className='capitalize'>
                      <Sparkles className='mr-1 h-3 w-3' />
                      {profile.role?.replace(/_/g, ' ') || 'Learner'}
                    </Badge>
                    {profile.location && (
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-3.5 w-3.5' />
                        {profile.location}
                      </span>
                    )}
                  </div>
                  {status && (
                    <div className='flex items-center gap-4 text-sm'>
                      <button
                        className='hover:underline'
                        onClick={() => openList('followers')}
                      >
                        <span className='font-semibold text-foreground'>
                          {status.followers_count}
                        </span>{' '}
                        <span className='text-muted-foreground'>Followers</span>
                      </button>
                      <button
                        className='hover:underline'
                        onClick={() => openList('following')}
                      >
                        <span className='font-semibold text-foreground'>
                          {status.following_count}
                        </span>{' '}
                        <span className='text-muted-foreground'>Following</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 border-t pt-3'>
                <div className='sm:hidden'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className='w-full justify-between gap-3 rounded-xl'>
                        <span className='flex min-w-0 items-center gap-2'>
                          <ActiveTabIcon className='h-4 w-4 shrink-0' />
                          <span className='truncate'>{activeTabConfig.label}</span>
                        </span>
                        <MoreHorizontal className='h-4 w-4 shrink-0 text-muted-foreground' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='min-w-[16rem]'>
                      <DropdownMenuRadioGroup value={activeTab} onValueChange={setActiveTab}>
                        {profileTabs.map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <DropdownMenuRadioItem key={tab.value} value={tab.value}>
                              <Icon className='h-4 w-4' />
                              {tab.label}
                            </DropdownMenuRadioItem>
                          );
                        })}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className='hidden flex-wrap items-end gap-3 sm:flex'>
                  <TabsList className='h-auto flex-wrap justify-start rounded-none bg-transparent p-0 text-muted-foreground'>
                    {primaryTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger key={tab.value} value={tab.value} className={topTabClassName}>
                          <Icon className='h-4 w-4' />
                          {tab.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {overflowTabs.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className={`h-auto rounded-none border-b-2 px-4 py-3 text-sm font-semibold shadow-none hover:bg-transparent ${
                            activeOverflowTab
                              ? 'border-primary text-foreground'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {activeOverflowTab ? activeOverflowTab.label : 'More'}
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='min-w-[14rem]'>
                        <DropdownMenuRadioGroup value={activeTab} onValueChange={setActiveTab}>
                          {overflowTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                              <DropdownMenuRadioItem key={tab.value} value={tab.value}>
                                <Icon className='h-4 w-4' />
                                {tab.label}
                              </DropdownMenuRadioItem>
                            );
                          })}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>

            <div className='px-4 py-6 md:px-8 md:py-8'>
              <TabsContent value='activity' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Profile Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {profile.bio || 'No profile summary added yet.'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Activity className='h-4 w-4 text-primary' />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeedList
                      items={activityItems}
                      emptyMessage='No recent activity yet.'
                      onNavigateProfile={(id) => onNavigate?.('user-profile', { userId: id })}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='about' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>About</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {profile.bio || 'No bio added yet.'}
                    </p>
                    {profile.languages && profile.languages.length > 0 && (
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground'>Languages</p>
                        <p className='text-sm'>{profile.languages.join(', ')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='education' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {educations.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No education entries yet.</p>
                    ) : (
                      educations.map((item) => (
                        <div key={item.id} className='border-b pb-4 last:border-0 last:pb-0'>
                          <p className='font-medium'>{item.school}</p>
                          {(item.degree || item.field_of_study) && (
                            <p className='text-sm text-muted-foreground'>
                              {[item.degree, item.field_of_study].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {item.start_date || '—'} - {item.is_current ? 'Present' : item.end_date || '—'}
                          </p>
                          {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='work' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Briefcase className='h-4 w-4 text-primary' />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {workExperiences.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No work experience yet.</p>
                    ) : (
                      workExperiences.map((item) => (
                        <div key={item.id} className='border-b pb-4 last:border-0 last:pb-0'>
                          <p className='font-medium'>
                            {item.title ? `${item.title} · ` : ''}
                            {item.company}
                          </p>
                          {item.location && (
                            <p className='text-sm text-muted-foreground'>{item.location}</p>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {item.start_date || '—'} - {item.is_current ? 'Present' : item.end_date || '—'}
                          </p>
                          {item.description && <p className='mt-1 text-sm'>{item.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='interests' className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <Heart className='h-4 w-4 text-primary' />
                        Interests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {interests.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No interests added yet.</p>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {interests.map((item) => (
                            <Badge key={item.id} variant='secondary'>
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <Sparkles className='h-4 w-4 text-primary' />
                        Skills &amp; Fields of Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {skills.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No skills added yet.</p>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {skills.map((item) => (
                            <Badge key={item.id} variant='secondary'>
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value='community' className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <MessageSquare className='h-4 w-4 text-primary' />
                        Community Discussion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {discussionPosts.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No discussion posts yet.</p>
                      ) : (
                        discussionPosts.map((post) => (
                          <div key={post.id} className='rounded-lg border p-3 space-y-1'>
                            <div className='flex items-center justify-between gap-2'>
                              <p className='text-sm font-medium'>{post.title}</p>
                              <Badge variant='outline' className='capitalize text-xs'>
                                {post.category.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <p className='text-sm text-muted-foreground line-clamp-3'>
                              {post.content}
                            </p>
                            <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                              <span className='flex items-center gap-1'>
                                <ThumbsUp className='h-3 w-3' />
                                {post.like_count}
                              </span>
                              <span className='flex items-center gap-1'>
                                <MessageSquare className='h-3 w-3' />
                                {post.replies?.length ?? 0}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        <Star className='h-4 w-4 text-primary' />
                        Community Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {courseReviews.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No reviews written yet.</p>
                      ) : (
                        courseReviews.map((review) => (
                          <div key={review.id} className='rounded-lg border p-3 space-y-1'>
                            <div className='flex items-center gap-1'>
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-3.5 w-3.5 ${
                                    index < review.rating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.comment && (
                              <p className='text-sm text-muted-foreground'>{review.comment}</p>
                            )}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value='mentoring' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <GraduationCap className='h-4 w-4 text-primary' />
                      Mentoring &amp; Tutoring Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {mentoringListings.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No mentoring listings yet.</p>
                    ) : (
                      mentoringListings.map((item) => (
                        <div key={item.id} className='rounded-lg border p-3 space-y-1'>
                          <div className='flex items-center justify-between gap-2'>
                            <p className='text-sm font-medium'>{item.service_name}</p>
                            <Badge variant={item.is_active ? 'default' : 'secondary'}>
                              {item.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          {item.qualifications && (
                            <p className='text-sm text-muted-foreground'>{item.qualifications}</p>
                          )}
                          {item.approved_subjects && item.approved_subjects.length > 0 && (
                            <div className='flex flex-wrap gap-1 mt-1'>
                              {item.approved_subjects.map((subject) => (
                                <Badge key={subject} variant='outline' className='text-xs'>
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className='flex items-center gap-3 text-xs text-muted-foreground mt-1'>
                            {item.years_in_practice && <span>{item.years_in_practice} experience</span>}
                            {item.price != null && (
                              <span className='flex items-center gap-1'>
                                <DollarSign className='h-3 w-3' />
                                {item.price}
                              </span>
                            )}
                            <span>
                              ★ {item.average_rating.toFixed(1)} ({item.total_reviews} reviews)
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={listDialog !== null} onOpenChange={(open) => !open && setListDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{listDialog === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          </DialogHeader>
          <div className='max-h-96 space-y-2 overflow-y-auto'>
            {listLoading ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              </div>
            ) : listUsers.length === 0 ? (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                {listDialog === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </p>
            ) : (
              listUsers.map((user) => (
                <button
                  key={user.id}
                  className='flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted/50'
                  onClick={() => {
                    setListDialog(null);
                    onNavigate?.('user-profile', { userId: user.id });
                  }}
                >
                  <Avatar className='h-9 w-9'>
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>{user.full_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{user.full_name}</p>
                    <p className='truncate text-xs capitalize text-muted-foreground'>
                      {user.role?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
