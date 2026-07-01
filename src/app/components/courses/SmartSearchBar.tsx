import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Search,
  TrendingUp,
  Clock,
  BookOpen,
  User,
  Tag,
  X,
  History,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react';

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  onCourseSelect?: (course: any) => void;
  placeholder?: string;
  courses?: any[];
}

interface SearchSuggestion {
  type: 'course' | 'category' | 'instructor' | 'tag' | 'recent';
  title: string;
  subtitle?: string;
  icon: any;
  data?: any;
  rating?: number;
  level?: string;
}

export function SmartSearchBar({ 
  onSearch, 
  onCourseSelect,
  placeholder = "Search for courses, instructors, or topics...",
  courses = []
}: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Generate suggestions when query changes
  useEffect(() => {
    if (query.length > 0) {
      generateSuggestions(query);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [query, courses]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateSuggestions = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Search in courses
    const matchingCourses = courses
      .filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.category?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5);

    matchingCourses.forEach(course => {
      newSuggestions.push({
        type: 'course',
        title: course.title,
        subtitle: course.description,
        icon: BookOpen,
        data: course,
        rating: course.rating || 4.5,
        level: course.level
      });
    });

    // Extract and suggest categories
    const categories = Array.from(new Set(courses.map(c => c.category)))
      .filter(cat => cat && cat.toLowerCase().includes(lowerQuery))
      .slice(0, 3);

    categories.forEach(category => {
      const count = courses.filter(c => c.category === category).length;
      newSuggestions.push({
        type: 'category',
        title: category,
        subtitle: `${count} courses`,
        icon: Tag,
        data: { category }
      });
    });

    // Suggest popular instructors (mock data)
    const instructors = [
      'Dr. Sarah Johnson',
      'Prof. Michael Chen',
      'Dr. Emily Rodriguez',
      'John Anderson'
    ].filter(name => name.toLowerCase().includes(lowerQuery)).slice(0, 2);

    instructors.forEach(instructor => {
      newSuggestions.push({
        type: 'instructor',
        title: instructor,
        subtitle: 'Instructor',
        icon: User,
        data: { instructor }
      });
    });

    // Add popular search suggestions based on query
    const popularTags = [
      'beginner friendly',
      'advanced',
      'programming',
      'data science',
      'web development',
      'machine learning',
      'design',
      'business'
    ].filter(tag => tag.includes(lowerQuery)).slice(0, 2);

    popularTags.forEach(tag => {
      newSuggestions.push({
        type: 'tag',
        title: tag,
        subtitle: 'Popular search',
        icon: TrendingUp,
        data: { tag }
      });
    });

    setSuggestions(newSuggestions);
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    onSearch(searchQuery);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'course' && onCourseSelect) {
      onCourseSelect(suggestion.data);
    } else if (suggestion.type === 'category') {
      handleSearch(`category:${suggestion.title}`);
    } else if (suggestion.type === 'instructor') {
      handleSearch(`instructor:${suggestion.title}`);
    } else {
      handleSearch(suggestion.title);
    }
    setShowSuggestions(false);
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-amber-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative" ref={inputContainerRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 0) setShowSuggestions(true);
          }}
          className="pl-12 pr-12 h-14 text-base border-2 focus:border-primary shadow-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full max-h-[500px] overflow-y-auto z-50 shadow-2xl border-2"
        >
          <div className="p-2">
            {suggestions.length > 0 ? (
              <>
                {/* Search Suggestions */}
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={`${suggestion.type}-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 group ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            isSelected
                              ? 'bg-white/20'
                              : 'bg-primary/10 group-hover:bg-primary/20'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              isSelected ? 'text-white' : 'text-primary'
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`font-semibold text-sm truncate ${
                                isSelected ? 'text-white' : 'text-foreground'
                              }`}
                            >
                              {suggestion.title}
                            </h4>
                            {suggestion.level && (
                              <Badge
                                className={`text-xs ${getLevelColor(
                                  suggestion.level
                                )} text-white border-0`}
                              >
                                {suggestion.level}
                              </Badge>
                            )}
                            {suggestion.rating && (
                              <div className="flex items-center gap-1 ml-auto">
                                <Star
                                  className={`h-3 w-3 ${
                                    isSelected
                                      ? 'text-yellow-300 fill-yellow-300'
                                      : 'text-amber-500 fill-amber-500'
                                  }`}
                                />
                                <span
                                  className={`text-xs font-medium ${
                                    isSelected
                                      ? 'text-white'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {suggestion.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          {suggestion.subtitle && (
                            <p
                              className={`text-xs line-clamp-1 ${
                                isSelected
                                  ? 'text-white/80'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {suggestion.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <ArrowRight
                          className={`h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isSelected ? 'text-white' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                {recentSearches.length > 0 && (
                  <div className="my-2 border-t" />
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No results found for "{query}"
                </p>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length === 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <History className="h-3 w-3" />
                    Recent Searches
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="h-6 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-all flex items-center gap-3 group"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{search}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Tips */}
            {query.length === 0 && (
              <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Search Tips</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Type to see instant suggestions</li>
                      <li>• Search by course title, category, or instructor</li>
                      <li>• Use arrow keys to navigate results</li>
                      <li>• Press Enter to search or select</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}