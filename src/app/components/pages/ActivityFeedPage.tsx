import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { activityApi } from '../../utils/api-client';
import type { ActivityItem } from '../../types/database';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ActivityFeedList } from '../social/ActivityFeedList';
import { Rss, Users } from 'lucide-react';

interface ActivityFeedPageProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function ActivityFeedPage({ onNavigate }: ActivityFeedPageProps) {
  const { user } = useAuth();
  const [networkFeed, setNetworkFeed] = useState<ActivityItem[]>([]);
  const [globalFeed, setGlobalFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      user ? activityApi.getFeed().then(setNetworkFeed) : Promise.resolve(),
      activityApi.getGlobalFeed().then(setGlobalFeed),
    ]).finally(() => setLoading(false));
  }, [user]);

  return (
    <div className='container max-w-3xl py-8 space-y-6'>
      <div className='space-y-2'>
        <h1 className='flex items-center gap-2 text-2xl font-semibold'>
          <Rss className='h-6 w-6 text-primary' />
          Activity Feed
        </h1>
        <p className='text-muted-foreground'>
          See what's happening across the CerebroLearn community.
        </p>
      </div>

      <Tabs defaultValue={user ? 'following' : 'global'}>
        <TabsList>
          <TabsTrigger value='following' disabled={!user}>
            <Users className='mr-2 h-4 w-4' />
            Following
          </TabsTrigger>
          <TabsTrigger value='global'>
            <Rss className='mr-2 h-4 w-4' />
            Global
          </TabsTrigger>
        </TabsList>

        <TabsContent value='following' className='pt-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>From people you follow</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeedList
                items={networkFeed}
                loading={loading}
                emptyMessage='Follow other learners to see their activity here.'
                onNavigateProfile={(id) => onNavigate?.('user-profile', { userId: id })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='global' className='pt-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Across the platform</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeedList
                items={globalFeed}
                loading={loading}
                emptyMessage='No activity yet.'
                onNavigateProfile={(id) => onNavigate?.('user-profile', { userId: id })}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
