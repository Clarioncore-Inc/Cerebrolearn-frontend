import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await apiCall('/leaderboard');
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1>Global Leaderboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how you rank against other learners on the platform
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Top 3 */}
        {leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <Card className="border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Medal className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarFallback className="text-xl">
                      {leaderboard[1]?.full_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="mb-1">{leaderboard[1]?.full_name}</h3>
                <p className="text-2xl font-bold text-primary">{leaderboard[1]?.xp || 0} XP</p>
                <Badge variant="secondary" className="mt-2">2nd Place</Badge>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="border-2 border-yellow-500 md:-mt-4">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
                  <Avatar className="h-24 w-24 mx-auto ring-4 ring-yellow-500">
                    <AvatarFallback className="text-2xl">
                      {leaderboard[0]?.full_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="mb-1">{leaderboard[0]?.full_name}</h3>
                <p className="text-3xl font-bold text-primary">{leaderboard[0]?.xp || 0} XP</p>
                <Badge className="mt-2 bg-yellow-500">Champion</Badge>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="border-2 border-orange-600">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Medal className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarFallback className="text-xl">
                      {leaderboard[2]?.full_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="mb-1">{leaderboard[2]?.full_name}</h3>
                <p className="text-2xl font-bold text-primary">{leaderboard[2]?.xp || 0} XP</p>
                <Badge variant="secondary" className="mt-2">3rd Place</Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rest of the list */}
        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 flex justify-center">
                    {getRankIcon(index + 1)}
                  </div>
                  <Avatar>
                    <AvatarFallback>
                      {user.full_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.full_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                      {user.streak > 0 && (
                        <span className="text-xs text-muted-foreground">
                          🔥 {user.streak} day streak
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.xp || 0}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
