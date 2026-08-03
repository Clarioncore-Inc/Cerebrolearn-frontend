import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Brain, Search, Sparkles, Users, Vote } from 'lucide-react';
import { PDB_SUBJECTS, getTotalVotes, getAvailableSystemsForSubject } from '../../data/personalityDatabaseData';
import { SubjectCategory } from '../../types/personalityDatabase';
import { PersonalitySubjectProfile } from './PersonalitySubjectProfile';
import { SlideInView } from '../pages/SlideInView';

interface PersonalityDatabaseDirectoryProps {
  onNavigate: (page: string, data?: any) => void;
}

const CATEGORIES: Array<SubjectCategory | 'all'> = [
  'all', 'Historical Figure', 'Public Intellectual', 'Fictional Character', 'Celebrity', 'Musician', 'Athlete',
];

const CATEGORY_LABELS: Record<SubjectCategory | 'all', string> = {
  all: 'All',
  'Historical Figure': 'Historical Figures',
  'Public Intellectual': 'Public Intellectuals',
  'Fictional Character': 'Characters',
  Celebrity: 'Celebrities',
  Musician: 'Musicians',
  Athlete: 'Athletes',
};

export function PersonalityDatabaseDirectory({ onNavigate }: PersonalityDatabaseDirectoryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SubjectCategory | 'all'>('all');
  const [subcategory, setSubcategory] = useState<string>('all');

  const availableSubcategories = useMemo(() => {
    if (category === 'all') return [];
    return Array.from(
      new Set(
        PDB_SUBJECTS.filter(subject => subject.category === category && subject.subcategory)
          .map(subject => subject.subcategory as string),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [category]);

  useEffect(() => {
    if (subcategory !== 'all' && !availableSubcategories.includes(subcategory)) {
      setSubcategory('all');
    }
  }, [availableSubcategories, subcategory]);

  const results = useMemo(() => {
    let list = [...PDB_SUBJECTS];
    if (category !== 'all') list = list.filter(s => s.category === category);
    if (subcategory !== 'all') list = list.filter(s => s.subcategory === subcategory);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.subcategory?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, category, subcategory]);

  if (selectedSlug) {
    const subject = PDB_SUBJECTS.find(s => s.slug === selectedSlug);
    if (!subject) {
      setSelectedSlug(null);
      return null;
    }
    return <PersonalitySubjectProfile subject={subject} onBack={() => setSelectedSlug(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#395192]/5 via-background to-[#06b6d4]/5"></div>
        <div className="absolute inset-0 neural-grid opacity-10"></div>
        <div className="container relative z-10">
          <SlideInView>
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              <Badge className="bg-[#395192] text-white border-0 shadow-lg">
                <Vote className="w-4 h-4 mr-1.5" />
                Personality Database
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="block gradient-ai-text mb-2">Who Do You Think They Are?</span>
                <span className="block text-foreground text-2xl md:text-3xl font-medium">
                  Vote & discuss personality types for real and fictional people
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A crowd-sourced wiki for MBTI, Enneagram, and more — anonymous voting welcome.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
                <Button size="lg" onClick={() => onNavigate('personality-test-landing')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Take the Personality Test
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('personality-types')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Personality Types
                </Button>
              </div>
            </div>
          </SlideInView>
        </div>
      </section>

      <div className="container py-10">
        {/* Search + Filters */}
        <SlideInView delay={100}>
          <Card className="mb-8">
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search subjects (e.g. Einstein, Sherlock Holmes)..."
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setSubcategory('all');
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      category === c
                        ? 'bg-[#395192] text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
              {category !== 'all' && availableSubcategories.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Filter within {CATEGORY_LABELS[category]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSubcategory('all')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        subcategory === 'all'
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      All {CATEGORY_LABELS[category]}
                    </button>
                    {availableSubcategories.map(option => (
                      <button
                        key={option}
                        onClick={() => setSubcategory(option)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          subcategory === option
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Showing {results.length} subject{results.length === 1 ? '' : 's'}
                </span>
                {category !== 'all' && <Badge variant="outline">{CATEGORY_LABELS[category]}</Badge>}
                {subcategory !== 'all' && <Badge variant="outline">{subcategory}</Badge>}
              </div>
            </CardContent>
          </Card>
        </SlideInView>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((subject, index) => {
            const systems = getAvailableSystemsForSubject(subject.id);
            const totalVotes = systems.reduce((sum, s) => sum + getTotalVotes(subject.id, s.id), 0);
            return (
              <div
                key={subject.id}
                style={{ opacity: 0, animation: `slide-up 0.5s ease-out ${index * 50}ms forwards` }}
              >
                <Card
                  className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => setSelectedSlug(subject.slug)}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      {subject.imageUrl ? (
                        <img
                          src={subject.imageUrl}
                          alt={subject.name}
                          className="w-14 h-14 rounded-xl object-cover bg-muted flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-[#395192] to-[#06b6d4] flex-shrink-0">
                          {subject.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-[#395192] transition-colors">
                          {subject.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">{subject.category}</Badge>
                          {subject.subcategory && (
                            <Badge variant="outline" className="text-xs">{subject.subcategory}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{subject.subtitle}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
                      <Users className="w-3.5 h-3.5" />
                      {totalVotes.toLocaleString()} community votes
                      <Sparkles className="w-3.5 h-3.5 ml-auto text-[#f59e0b]" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {results.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No subjects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
