import React, { useState, useMemo } from 'react';
import { GeniusCard } from './GeniusCard';
import { GeniusProfilePage } from './GeniusProfilePage';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  Search,
  Filter,
  TrendingUp,
  Brain,
  Users,
  Sparkles
} from 'lucide-react';
import { searchGeniuses, getGeniusProfile, getTopGeniusesByIQ, getGeniusStatistics } from '../../services/geniusService';
import { GeniusSearchFilters, GeniusEra } from '../../types/genius';
import { SlideInView } from '../pages/SlideInView';

interface GeniusDirectoryProps {
  onNavigate: (page: string, data?: any) => void;
}

export function GeniusDirectory({ onNavigate }: GeniusDirectoryProps) {
  const [selectedGeniusId, setSelectedGeniusId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GeniusSearchFilters>({});
  const [selectedEra, setSelectedEra] = useState<GeniusEra | 'all'>('all');

  const stats = useMemo(() => getGeniusStatistics(), []);
  const searchResults = useMemo(() => {
    const filtersCombined: GeniusSearchFilters = {
      ...filters,
      query: searchQuery,
      eras: selectedEra !== 'all' ? [selectedEra] : undefined
    };
    return searchGeniuses(filtersCombined);
  }, [searchQuery, filters, selectedEra]);

  const topGeniuses = useMemo(() => getTopGeniusesByIQ(5), []);

  const eras: Array<{ value: GeniusEra | 'all'; label: string }> = [
    { value: 'all', label: 'All Eras' },
    { value: 'Ancient', label: 'Ancient' },
    { value: 'Classical', label: 'Classical' },
    { value: 'Medieval', label: 'Medieval' },
    { value: 'Renaissance', label: 'Renaissance' },
    { value: 'Enlightenment', label: 'Enlightenment' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Modern', label: 'Modern' },
    { value: 'Contemporary', label: 'Contemporary' }
  ];

  // If viewing a genius profile
  if (selectedGeniusId) {
    const geniusProfile = getGeniusProfile(selectedGeniusId);
    if (!geniusProfile) {
      setSelectedGeniusId(null);
      return null;
    }

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
                  <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total Geniuses</div>
                </div>

                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-[#06b6d4]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.avgIQ}</div>
                  <div className="text-xs text-muted-foreground">Average IQ</div>
                </div>

                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.historical}</div>
                  <div className="text-xs text-muted-foreground">Historical</div>
                </div>

                <div className="glass-ai rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.contemporary}</div>
                  <div className="text-xs text-muted-foreground">Contemporary</div>
                </div>
              </div>
            </div>
          </SlideInView>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <SlideInView delay={100}>
              {/* Search */}
              <Card>
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
              <Card>
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
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Brain className="w-4 h-4" />
                    Highest IQ Scores
                  </div>
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
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {searchQuery ? `Search Results (${searchResults.length})` :
                   selectedEra !== 'all' ? `${selectedEra} Era (${searchResults.length})` :
                   `All Geniuses (${searchResults.length})`}
                </h2>
                <p className="text-muted-foreground">
                  Explore detailed profiles of history's most brilliant minds
                </p>
              </div>

              {searchResults.length === 0 ? (
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