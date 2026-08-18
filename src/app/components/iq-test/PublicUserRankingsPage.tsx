"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Brain,
  Trophy,
  Medal,
  Award,
  Search,
  AlertCircle,
  Users,
  MapPin,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { rankingsApi } from '../../utils/api-client';
import type { PublicRankingEntry } from '../../types/database';

interface PublicUserRankingsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PublicUserRankingsPage({ onNavigate }: PublicUserRankingsPageProps) {
  const [rankings, setRankings] = useState<PublicRankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await rankingsApi.getPublicRankings();
        if (!isMounted) return;
        setRankings(data || []);
      } catch (error) {
        if (!isMounted) return;
        console.error('[PublicUserRankingsPage] Failed to load rankings:', error);
        setLoadError(
          error instanceof Error ? error.message : 'Unable to load rankings',
        );
        setRankings([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const highestIQ = useMemo(
    () => (rankings.length ? Math.max(...rankings.map((r) => r.official_iq)) : null),
    [rankings],
  );

  const filteredRankings = useMemo(() => {
    if (!searchQuery) return rankings;
    const normalized = searchQuery.toLowerCase();
    return rankings.filter(
      (entry) =>
        entry.full_name.toLowerCase().includes(normalized) ||
        entry.username?.toLowerCase().includes(normalized) ||
        entry.location?.toLowerCase().includes(normalized),
    );
  }, [rankings, searchQuery]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className='w-5 h-5 text-yellow-500' />;
    if (rank === 2) return <Medal className='w-5 h-5 text-gray-400' />;
    if (rank === 3) return <Award className='w-5 h-5 text-amber-600' />;
    return null;
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16'>
        <div className='container max-w-5xl mx-auto px-6'>
          <div className='flex items-start gap-4 mb-4'>
            <Brain className='w-12 h-12 shrink-0' />
            <div>
              <h1 className='text-4xl font-bold mb-2'>Public User Rankings</h1>
              <p className='text-primary-foreground/90 text-lg'>
                Verified IQ leaderboard of platform members who chose to share their results
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
            <Card className='bg-white/10 backdrop-blur border-white/20'>
              <CardContent className='py-4 flex items-center justify-between'>
                <div>
                  <p className='text-primary-foreground/80 text-sm'>Highest Verified IQ</p>
                  <p className='text-2xl font-bold text-primary-foreground'>{highestIQ ?? '—'}</p>
                </div>
                <Brain className='w-8 h-8 text-yellow-300' />
              </CardContent>
            </Card>
            <Card className='bg-white/10 backdrop-blur border-white/20'>
              <CardContent className='py-4 flex items-center justify-between'>
                <div>
                  <p className='text-primary-foreground/80 text-sm'>Ranked Members</p>
                  <p className='text-2xl font-bold text-primary-foreground'>{rankings.length}</p>
                </div>
                <Users className='w-8 h-8 text-secondary' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className='container max-w-5xl mx-auto px-6 py-12'>
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Search className='w-5 h-5' />
              Search
            </CardTitle>
            <CardDescription>Find a ranked member by name, username, or location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search rankings...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </CardContent>
        </Card>

        <div className='mb-6'>
          <p className='text-muted-foreground'>
            Showing <span className='font-semibold text-foreground'>{filteredRankings.length}</span> of{' '}
            <span className='font-semibold text-foreground'>{rankings.length}</span> ranked members
          </p>
        </div>

        <div className='space-y-4'>
          {isLoading && (
            <Card>
              <CardContent className='py-12 text-center'>
                <Brain className='w-16 h-16 mx-auto mb-4 animate-pulse text-primary' />
                <h3 className='text-xl font-bold mb-2'>Loading Rankings</h3>
                <p className='text-muted-foreground'>Fetching verified scores…</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && loadError && (
            <Card>
              <CardContent className='py-12 text-center'>
                <AlertCircle className='w-16 h-16 mx-auto mb-4 text-destructive' />
                <h3 className='text-xl font-bold mb-2'>Unable to Load Rankings</h3>
                <p className='text-muted-foreground mb-6'>{loadError}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </CardContent>
            </Card>
          )}

          {!isLoading &&
            !loadError &&
            filteredRankings.map((entry, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              return (
                <Card
                  key={entry.user_id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${
                    isTopThree ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-transparent' : ''
                  }`}
                  onClick={() => onNavigate('public-profile', { userId: entry.user_id, source: 'rankings' })}
                >
                  <CardContent className='py-4 sm:py-6'>
                    <div className='flex items-center gap-3 sm:gap-6'>
                      <div className='flex flex-col items-center min-w-[40px] sm:min-w-[60px] shrink-0'>
                        <div
                          className={`flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full font-bold text-base sm:text-lg ${
                            rank === 1
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : rank === 2
                                ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                : rank === 3
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {getRankBadge(rank) || `#${rank}`}
                        </div>
                      </div>

                      <Avatar className='h-11 w-11 sm:h-14 sm:w-14 shrink-0'>
                        <AvatarImage src={entry.avatar || undefined} />
                        <AvatarFallback>{entry.full_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className='flex-1 min-w-0'>
                        <h3 className='text-base sm:text-lg font-bold truncate'>{entry.full_name}</h3>
                        <div className='flex items-center gap-2 flex-wrap text-sm text-muted-foreground'>
                          {entry.username && <span className='truncate'>@{entry.username}</span>}
                          {entry.location && (
                            <span className='flex items-center gap-1 min-w-0'>
                              <MapPin className='h-3.5 w-3.5 shrink-0' />
                              <span className='truncate'>{entry.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='hidden sm:flex flex-col items-end shrink-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <Brain className='w-5 h-5 text-primary' />
                          <span className='text-3xl font-bold text-primary'>{entry.official_iq}</span>
                        </div>
                        <Badge variant='secondary'>Verified IQ</Badge>
                      </div>
                    </div>

                    <div className='flex sm:hidden items-center justify-between mt-3 pt-3 border-t'>
                      <div className='flex items-center gap-2'>
                        <Brain className='w-5 h-5 text-primary' />
                        <span className='text-2xl font-bold text-primary'>{entry.official_iq}</span>
                      </div>
                      <Badge variant='secondary'>Verified IQ</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {!isLoading && !loadError && filteredRankings.length === 0 && (
            <Card>
              <CardContent className='py-12 text-center'>
                <Brain className='w-16 h-16 mx-auto mb-4 text-muted-foreground' />
                <h3 className='text-xl font-bold mb-2'>No Results Found</h3>
                <p className='text-muted-foreground'>
                  No ranked members match your search, or no one has opted in yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
