import React, { useState, useMemo, useEffect } from 'react';
import { GeniusCard } from './GeniusCard';
import { GeniusProfilePage } from './GeniusProfilePage';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import {
  Search,
  Filter,
  TrendingUp,
  Brain,
  Users,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { fetchPublishedGeniuses } from '../../services/geniusService';
import { Genius, GeniusEra, GeniusProfile, GeniusSearchFilters } from '../../types/genius';
import { SlideInView } from '../pages/SlideInView';

interface GeniusDirectoryProps {
  onNavigate: (page: string, data?: any) => void;
}

export function GeniusDirectory({ onNavigate }: GeniusDirectoryProps) {
  const [selectedGeniusId, setSelectedGeniusId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters] = useState<GeniusSearchFilters>({});
  const [selectedEra, setSelectedEra] = useState<GeniusEra | 'all'>('all');

  const [allProfiles, setAllProfiles] = useState<Genius[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPublishedGeniuses()
      .then(setAllProfiles)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load profiles'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedGeniusId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedGeniusId]);

  const stats = useMemo(() => {
    const iqProfiles = allProfiles.filter(g => g.iq_score !== null);
    const avgIQ = iqProfiles.length
      ? Math.round(iqProfiles.reduce((sum, g) => sum + (g.iq_score || 0), 0) / iqProfiles.length)
      : 0;
    return {
      total:        allProfiles.length,
      avgIQ,
      historical:   allProfiles.filter(g => g.profile_type === 'historical').length,
      contemporary: allProfiles.filter(g => g.era === 'Contemporary').length,
    };
  }, [allProfiles]);

  const searchResults = useMemo(() => {
    let results = [...allProfiles];

    if (selectedEra !== 'all') results = results.filter(g => g.era === selectedEra);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(g =>
        g.full_name.toLowerCase().includes(q) ||
        g.short_description.toLowerCase().includes(q) ||
        g.biography.toLowerCase().includes(q) ||
        g.birth_place.toLowerCase().includes(q),
      );
    }

    if (filters.iq_min !== undefined) results = results.filter(g => g.iq_score && g.iq_score >= filters.iq_min!);
    if (filters.iq_max !== undefined) results = results.filter(g => g.iq_score && g.iq_score <= filters.iq_max!);

    results.sort((a, b) => (b.iq_score || 0) - (a.iq_score || 0));

    return results.map(genius => ({ genius, score: 1.0, matched_fields: ['full_name'] }));
  }, [allProfiles, searchQuery, selectedEra, filters]);

  const topGeniuses = useMemo(
    () =>
      [...allProfiles]
        .filter(g => g.iq_score !== null)
        .sort((a, b) => (b.iq_score || 0) - (a.iq_score || 0))
        .slice(0, 5),
    [allProfiles],
  );

  const eras: Array<{ value: GeniusEra | 'all'; label: string }> = [
    { value: 'all',           label: 'All Eras' },
    { value: 'Ancient',       label: 'Ancient' },
    { value: 'Classical',     label: 'Classical' },
    { value: 'Medieval',      label: 'Medieval' },
    { value: 'Renaissance',   label: 'Renaissance' },
    { value: 'Enlightenment', label: 'Enlightenment' },
    { value: 'Industrial',    label: 'Industrial' },
    { value: 'Modern',        label: 'Modern' },
    { value: 'Contemporary',  label: 'Contemporary' },
  ];

  const renderGeniusSkeletonCard = (key: number) => (
    <Card
      key={key}
      className="overflow-hidden border border-border/70 bg-card shadow-sm dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950"
    >
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-4 p-6">
        <div className="flex justify-center">
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <div className="flex justify-center">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );

  // Profile detail view
  if (selectedGeniusId) {
    const genius = allProfiles.find(g => g.id === selectedGeniusId || g.slug === selectedGeniusId);
    if (!genius) {
      setSelectedGeniusId(null);
      return null;
    }
    const geniusProfile: GeniusProfile = {
      ...genius,
      expertise: [],
      achievements: [],
      personality_traits: [],
      contributions: [],
      relationships: [],
      categories: [],
    };
    return (
      <GeniusProfilePage
        genius={geniusProfile}
        onBack={() => setSelectedGeniusId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#395192]/5 via-background to-[#06b6d4]/5"></div>
        <div className="absolute inset-0 neural-grid opacity-10"></div>

        <div className="container relative z-10">
          <SlideInView>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="bg-[#395192] text-white border-0 shadow-lg">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Genius Database
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="block gradient-ai-text mb-2">
                  Explore History's
                </span>
                <span className="block text-foreground">
                  Greatest Minds
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover the profiles, achievements, and contributions of the most brilliant minds in human history.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#395192]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : stats.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Geniuses</div>
                </div>

                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-[#06b6d4]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '—' : stats.avgIQ}
                  </div>
                  <div className="text-xs text-muted-foreground">Average IQ</div>
                </div>

                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '—' : stats.historical}
                  </div>
                  <div className="text-xs text-muted-foreground">Historical</div>
                </div>

                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? '—' : stats.contemporary}
                  </div>
                  <div className="text-xs text-muted-foreground">Contemporary</div>
                </div>
              </div>
            </div>
          </SlideInView>
        </div>
      </section>

      <div className="container py-12">
        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <SlideInView delay={100}>
              {/* Search */}
              <Card className="dark:border-white/10 dark:bg-slate-950/90">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search geniuses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Era Filter */}
              <Card className="dark:border-white/10 dark:bg-slate-950/90 mt-4">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Filter className="w-4 h-4" />
                    Filter by Era
                  </div>
                  <div className="space-y-2">
                    {eras.map((era) => (
                      <button
                        key={era.value}
                        onClick={() => setSelectedEra(era.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedEra === era.value
                            ? 'bg-[#395192] text-white font-medium'
                            : 'hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {era.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top 5 by IQ */}
              <Card className="dark:border-white/10 dark:bg-slate-950/90 mt-4">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Brain className="w-4 h-4" />
                    Highest IQ Scores
                  </div>
                  {loading ? (
                    <div className="space-y-2 py-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-lg px-2 py-1">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : topGeniuses.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No profiles yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {topGeniuses.map((genius, index) => (
                        <button
                          key={genius.id}
                          onClick={() => setSelectedGeniusId(genius.id)}
                          className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#f59e0b]/70 flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground truncate group-hover:text-[#395192]">
                                {genius.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ~{genius.iq_score} (est.)
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground pt-2 border-t leading-relaxed">
                    Scores are estimates or widely cited public figures, not verified clinical records.
                  </p>
                </CardContent>
              </Card>
            </SlideInView>
          </aside>

          {/* Main Content - Genius Grid */}
          <div className="lg:col-span-3">
            <SlideInView delay={200}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                  {loading
                    ? 'Loading…'
                    : searchQuery
                      ? `Search Results (${searchResults.length})`
                      : selectedEra !== 'all'
                        ? `${selectedEra} Era (${searchResults.length})`
                        : `All Geniuses (${searchResults.length})`}
                </h2>
                <p className="text-muted-foreground">
                  Explore detailed profiles of history's most brilliant minds
                </p>
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => renderGeniusSkeletonCard(index))}
                </div>
              ) : searchResults.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No geniuses found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.genius.id}
                      style={{
                        opacity: 0,
                        animation: `slide-up 0.5s ease-out ${index * 50}ms forwards`
                      }}
                    >
                      <GeniusCard
                        genius={result.genius}
                        onClick={() => setSelectedGeniusId(result.genius.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </SlideInView>
          </div>
        </div>
      </div>
    </div>
  );
}
