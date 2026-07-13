"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Brain,
  Trophy,
  Medal,
  Award,
  Filter,
  Search,
  ChevronDown,
  Star,
  Sparkles,
  ArrowUpDown,
  User,
  Users,
  History,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { publicGeniusApi, type GeniusApiResponse } from '../../utils/api-client';

interface GeniusRankingsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Genius {
  id: string;
  name: string;
  iqScore: number | null;
  field: string;
  era: string;
  nationality: string;
  notableWork: string;
  imageUrl?: string;
  description: string;
}

const formatProfileType = (value?: string) => {
  if (!value) return 'Profile';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const mapGeniusProfile = (profile: GeniusApiResponse): Genius => ({
  id: profile.id,
  name: profile.full_name,
  iqScore: profile.iq_score,
  field: formatProfileType(profile.profile_type),
  era: profile.era,
  nationality: profile.birth_place,
  notableWork: profile.short_description,
  imageUrl: profile.profile_image_url || undefined,
  description: profile.iq_score_note || profile.editorial_note,
});

// Comprehensive genius data
const geniusData: Genius[] = [
  {
    id: '1',
    name: 'William James Sidis',
    iqScore: 250,
    field: 'Mathematics',
    era: 'Modern (1900-1999)',
    nationality: 'American',
    notableWork: 'Child prodigy, mathematician',
    description: 'Entered Harvard at age 11, spoke 40 languages'
  },
  {
    id: '2',
    name: 'Terence Tao',
    iqScore: 230,
    field: 'Mathematics',
    era: 'Contemporary (2000+)',
    nationality: 'Australian',
    notableWork: 'Fields Medal winner, UCLA professor',
    description: 'Youngest-ever IMO gold medalist at age 13'
  },
  {
    id: '3',
    name: 'Marilyn vos Savant',
    iqScore: 228,
    field: 'Writing',
    era: 'Contemporary (2000+)',
    nationality: 'American',
    notableWork: 'Guinness Book highest IQ, columnist',
    description: 'Known for "Ask Marilyn" column in Parade magazine'
  },
  {
    id: '4',
    name: 'Christopher Hirata',
    iqScore: 225,
    field: 'Physics',
    era: 'Contemporary (2000+)',
    nationality: 'American',
    notableWork: 'Astrophysicist, Caltech PhD at 22',
    description: 'Gold medal at Physics Olympiad at age 13'
  },
  {
    id: '5',
    name: 'Kim Ung-Yong',
    iqScore: 210,
    field: 'Physics',
    era: 'Contemporary (2000+)',
    nationality: 'South Korean',
    notableWork: 'Child prodigy, civil engineer',
    description: 'Spoke 4 languages and solved calculus at age 3'
  },
  {
    id: '6',
    name: 'Garry Kasparov',
    iqScore: 194,
    field: 'Chess',
    era: 'Modern (1900-1999)',
    nationality: 'Russian',
    notableWork: 'Chess grandmaster, world champion',
    description: 'Youngest undisputed world chess champion at 22'
  },
  {
    id: '7',
    name: 'Philip Emeagwali',
    iqScore: 190,
    field: 'Computer Science',
    era: 'Contemporary (2000+)',
    nationality: 'Nigerian',
    notableWork: 'Supercomputing pioneer',
    description: 'Gordon Bell Prize winner for parallel computing'
  },
  {
    id: '8',
    name: 'Judit Polgár',
    iqScore: 170,
    field: 'Chess',
    era: 'Contemporary (2000+)',
    nationality: 'Hungarian',
    notableWork: 'Chess grandmaster, strongest female player',
    description: 'Beat Garry Kasparov in 2002'
  },
  {
    id: '9',
    name: 'Albert Einstein',
    iqScore: 160,
    field: 'Physics',
    era: 'Modern (1900-1999)',
    nationality: 'German',
    notableWork: 'Theory of Relativity, Nobel Prize',
    description: 'Revolutionized understanding of space, time, and gravity'
  },
  {
    id: '10',
    name: 'Stephen Hawking',
    iqScore: 160,
    field: 'Physics',
    era: 'Modern (1900-1999)',
    nationality: 'British',
    notableWork: 'Black hole thermodynamics, cosmology',
    description: 'Author of "A Brief History of Time"'
  },
  {
    id: '11',
    name: 'Marie Curie',
    iqScore: 185,
    field: 'Physics & Chemistry',
    era: 'Early Modern (1800-1899)',
    nationality: 'Polish',
    notableWork: 'Radioactivity research, 2x Nobel Prize',
    description: 'First woman to win Nobel Prize, first person to win twice'
  },
  {
    id: '12',
    name: 'Johann Wolfgang von Goethe',
    iqScore: 210,
    field: 'Literature',
    era: 'Early Modern (1800-1899)',
    nationality: 'German',
    notableWork: 'Faust, poetry, scientific work',
    description: 'Polymath: writer, scientist, statesman'
  },
  {
    id: '13',
    name: 'Leonardo da Vinci',
    iqScore: 200,
    field: 'Art & Science',
    era: 'Renaissance (1400-1599)',
    nationality: 'Italian',
    notableWork: 'Mona Lisa, inventions, anatomy',
    description: 'Ultimate Renaissance man: artist, inventor, scientist'
  },
  {
    id: '14',
    name: 'Isaac Newton',
    iqScore: 190,
    field: 'Physics & Mathematics',
    era: 'Early Modern (1600-1799)',
    nationality: 'English',
    notableWork: 'Laws of motion, calculus, gravity',
    description: 'Founded classical mechanics and modern mathematics'
  },
  {
    id: '15',
    name: 'Gottfried Wilhelm Leibniz',
    iqScore: 205,
    field: 'Mathematics & Philosophy',
    era: 'Early Modern (1600-1799)',
    nationality: 'German',
    notableWork: 'Calculus, binary system, philosophy',
    description: 'Co-inventor of calculus, pioneered binary notation'
  },
  {
    id: '16',
    name: 'Voltaire',
    iqScore: 190,
    field: 'Philosophy & Literature',
    era: 'Early Modern (1600-1799)',
    nationality: 'French',
    notableWork: 'Candide, Enlightenment philosophy',
    description: 'Champion of civil liberties and freedom of expression'
  },
  {
    id: '17',
    name: 'Nikola Tesla',
    iqScore: 195,
    field: 'Engineering & Physics',
    era: 'Modern (1900-1999)',
    nationality: 'Serbian',
    notableWork: 'AC electricity, wireless technology',
    description: 'Pioneered modern electrical systems'
  },
  {
    id: '18',
    name: 'John von Neumann',
    iqScore: 195,
    field: 'Mathematics & Computer Science',
    era: 'Modern (1900-1999)',
    nationality: 'Hungarian',
    notableWork: 'Game theory, computer architecture',
    description: 'Pioneer of quantum mechanics and computer science'
  },
  {
    id: '19',
    name: 'Blaise Pascal',
    iqScore: 195,
    field: 'Mathematics & Philosophy',
    era: 'Early Modern (1600-1799)',
    nationality: 'French',
    notableWork: 'Probability theory, Pascal\'s triangle',
    description: 'Invented mechanical calculator, founded probability theory'
  },
  {
    id: '20',
    name: 'René Descartes',
    iqScore: 185,
    field: 'Philosophy & Mathematics',
    era: 'Early Modern (1600-1799)',
    nationality: 'French',
    notableWork: 'Cogito ergo sum, Cartesian coordinates',
    description: 'Father of modern philosophy and analytic geometry'
  }
];

const fields = ['All Fields', 'Mathematics', 'Physics', 'Physics & Chemistry', 'Art & Science', 'Chess', 'Computer Science', 'Literature', 'Philosophy & Literature', 'Engineering & Physics', 'Mathematics & Philosophy', 'Mathematics & Computer Science', 'Writing', 'Philosophy & Mathematics'];

const eras = ['All Eras', 'Renaissance (1400-1599)', 'Early Modern (1600-1799)', 'Early Modern (1800-1899)', 'Modern (1900-1999)', 'Contemporary (2000+)'];

export function GeniusRankingsPage({ onNavigate }: GeniusRankingsPageProps) {
  const [geniuses, setGeniuses] = useState<Genius[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('All Fields');
  const [selectedEra, setSelectedEra] = useState('All Eras');
  const [sortBy, setSortBy] = useState<'iq' | 'name'>('iq');

  useEffect(() => {
    let isMounted = true;

    const loadGeniusProfiles = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await publicGeniusApi.list();
        if (!isMounted) return;
        setGeniuses((response.items || []).map(mapGeniusProfile));
      } catch (error) {
        if (!isMounted) return;
        console.error('[GeniusRankingsPage] Failed to load genius profiles:', error);
        setLoadError(
          error instanceof Error ? error.message : 'Unable to load genius profiles',
        );
        setGeniuses([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadGeniusProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const fields = useMemo(
    () => ['All Fields', ...Array.from(new Set(geniuses.map((genius) => genius.field))).sort()],
    [geniuses],
  );

  const eras = useMemo(
    () => ['All Eras', ...Array.from(new Set(geniuses.map((genius) => genius.era))).sort()],
    [geniuses],
  );

  const highestIQ = useMemo(() => {
    const scores = geniuses
      .map((genius) => genius.iqScore)
      .filter((score): score is number => typeof score === 'number');
    return scores.length ? Math.max(...scores) : null;
  }, [geniuses]);

  // Filter and sort geniuses
  const filteredGeniuses = useMemo(() => {
    let filtered = [...geniuses];

    // Search filter
    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(genius =>
        genius.name.toLowerCase().includes(normalizedQuery) ||
        genius.field.toLowerCase().includes(normalizedQuery) ||
        genius.era.toLowerCase().includes(normalizedQuery) ||
        genius.nationality.toLowerCase().includes(normalizedQuery) ||
        genius.notableWork.toLowerCase().includes(normalizedQuery) ||
        genius.description.toLowerCase().includes(normalizedQuery)
      );
    }

    // Field filter
    if (selectedField !== 'All Fields') {
      filtered = filtered.filter(genius => genius.field === selectedField);
    }

    // Era filter
    if (selectedEra !== 'All Eras') {
      filtered = filtered.filter(genius => genius.era === selectedEra);
    }

    // Sort
    if (sortBy === 'iq') {
      filtered.sort((a, b) => (b.iqScore ?? -1) - (a.iqScore ?? -1));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [geniuses, searchQuery, selectedField, selectedEra, sortBy]);

  // Get rank badge component
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="w-5 h-5 text-gray-400" />;
    } else if (rank === 3) {
      return <Award className="w-5 h-5 text-amber-600" />;
    }
    return null;
  };

  // Get IQ category badge
  const getIQCategoryBadge = (iq: number | null) => {
    if (iq == null) {
      return <Badge variant="secondary">Influence Profile</Badge>;
    } else if (iq >= 200) {
      return <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">Exceptionally Gifted</Badge>;
    } else if (iq >= 180) {
      return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">Profoundly Gifted</Badge>;
    } else if (iq >= 160) {
      return <Badge variant="default" className="bg-primary hover:bg-primary/90">Highly Gifted</Badge>;
    } else {
      return <Badge variant="secondary">Gifted</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Genius Rankings</h1>
              <p className="text-primary-foreground/90 text-lg">
                Explore the greatest minds in human history and their estimated IQ scores
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Highest IQ</p>
                    <p className="text-2xl font-bold text-primary-foreground">{highestIQ ?? '—'}</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Total Geniuses</p>
                    <p className="text-2xl font-bold text-primary-foreground">{geniuses.length}</p>
                  </div>
                  <User className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Categories</p>
                    <p className="text-2xl font-bold text-primary-foreground">{fields.length - 1}</p>
                  </div>
                  <Brain className="w-8 h-8 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Eras</p>
                    <p className="text-2xl font-bold text-primary-foreground">{eras.length - 1}</p>
                  </div>
                  <History className="w-8 h-8 text-orange-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-12">
        {/* Filters & Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Search
            </CardTitle>
            <CardDescription>
              Find geniuses by name, category, era, birthplace, or achievement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, field, or achievement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Era Filter */}
              <Select value={selectedEra} onValueChange={setSelectedEra}>
                <SelectTrigger>
                  <SelectValue placeholder="Select era" />
                </SelectTrigger>
                <SelectContent>
                  {eras.map(era => (
                    <SelectItem key={era} value={era}>{era}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button
                variant={sortBy === 'iq' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('iq')}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                IQ Score
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Name
              </Button>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedField !== 'All Fields' || selectedEra !== 'All Eras') && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedField !== 'All Fields' && (
                  <Badge variant="secondary">
                    Category: {selectedField}
                    <button
                      onClick={() => setSelectedField('All Fields')}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedEra !== 'All Eras' && (
                  <Badge variant="secondary">
                    Era: {selectedEra}
                    <button
                      onClick={() => setSelectedEra('All Eras')}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedField('All Fields');
                    setSelectedEra('All Eras');
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredGeniuses.length}</span> of <span className="font-semibold text-foreground">{geniuses.length}</span> geniuses
          </p>
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {isLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
                <h3 className="text-xl font-bold mb-2">Loading Genius Rankings</h3>
                <p className="text-muted-foreground">Fetching published profiles from the backend…</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && loadError && (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <h3 className="text-xl font-bold mb-2">Unable to Load Rankings</h3>
                <p className="text-muted-foreground mb-6">{loadError}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && !loadError && filteredGeniuses.map((genius, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;

            return (
              <Card 
                key={genius.id}
                className={`hover:shadow-lg transition-shadow ${isTopThree ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-transparent' : ''}`}
              >
                <CardContent className="py-6">
                  <div className="flex items-start gap-3 sm:gap-6">
                    {/* Rank */}
                    <div className="flex flex-col items-center min-w-[48px] sm:min-w-[60px] shrink-0">
                      <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        rank === 2 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                        rank === 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-muted text-muted-foreground'
                      } font-bold text-lg`}>
                        {getRankBadge(rank) || `#${rank}`}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{genius.name}</h3>
                            {isTopThree && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{genius.field}</Badge>
                            <Badge variant="secondary">{genius.era}</Badge>
                            <span className="text-sm text-muted-foreground">{genius.nationality}</span>
                          </div>
                        </div>

                        {/* IQ Score */}
                        <div className="flex flex-col items-start sm:items-end shrink-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-5 h-5 text-primary" />
                            <span className="text-3xl font-bold text-primary">{genius.iqScore ?? 'N/A'}</span>
                          </div>
                          {getIQCategoryBadge(genius.iqScore)}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">Notable Work:</span> {genius.notableWork}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        * {genius.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {!isLoading && !loadError && filteredGeniuses.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedField('All Fields');
                    setSelectedEra('All Eras');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-0">
          <CardContent className="py-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Discover Your Own IQ</h2>
            <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              Start with our free practice IQ test or book a certified psychologist for $99 to get an official assessment. 
              See how you compare to history's greatest minds.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => onNavigate('iq-test-landing')}
              >
                <Brain className="w-5 h-5 mr-2" />
                Free Practice Test
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-white/10"
                onClick={() => onNavigate('psychologist-browse')}
              >
                <Users className="w-5 h-5 mr-2" />
                Official Test ($99)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
