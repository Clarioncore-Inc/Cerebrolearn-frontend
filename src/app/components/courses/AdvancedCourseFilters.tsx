import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  DollarSign,
  Clock,
  Star,
  Globe,
  ArrowUpDown
} from 'lucide-react';

interface AdvancedCourseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  durationFilter: string;
  onDurationChange: (value: string) => void;
  ratingFilter: number;
  onRatingChange: (value: number) => void;
  languageFilter: string[];
  onLanguageChange: (value: string[]) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  categories: Array<{ value: string; label: string }>;
  levels: Array<{ value: string; label: string }>;
}

export function AdvancedCourseFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  levelFilter,
  onLevelChange,
  priceRange,
  onPriceRangeChange,
  durationFilter,
  onDurationChange,
  ratingFilter,
  onRatingChange,
  languageFilter,
  onLanguageChange,
  sortBy,
  onSortChange,
  onReset,
  categories,
  levels,
}: AdvancedCourseFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: 'short', label: '0-5 hours' },
    { value: 'medium', label: '5-20 hours' },
    { value: 'long', label: '20-50 hours' },
    { value: 'extra-long', label: '50+ hours' }
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration-short', label: 'Shortest Duration' },
    { value: 'duration-long', label: 'Longest Duration' }
  ];

  const hasActiveFilters = () => {
    return searchQuery ||
      categoryFilter !== 'all' ||
      levelFilter !== 'all' ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 200 ||
      durationFilter !== 'all' ||
      ratingFilter > 0 ||
      languageFilter.length > 0;
  };

  const toggleLanguage = (lang: string) => {
    if (languageFilter.includes(lang)) {
      onLanguageChange(languageFilter.filter(l => l !== lang));
    } else {
      onLanguageChange([...languageFilter, lang]);
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Search & Filter Courses</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Basic Filters */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search courses by title, description, or instructor..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-11 border-2 focus:border-primary transition-colors"
            />
          </div>

          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 border-2">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={onLevelChange}>
            <SelectTrigger className="h-11 border-2">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced}>
          <CollapsibleContent className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Price Range
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1] === 200 ? '200+' : priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  min={0}
                  max={200}
                  step={10}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Free</span>
                  <span>$200+</span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Course Duration
                </Label>
                <Select value={durationFilter} onValueChange={onDurationChange}>
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue placeholder="Any Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(duration => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Star className="h-4 w-4 text-primary" />
                    Minimum Rating
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {ratingFilter === 0 ? 'Any' : `${ratingFilter}+ stars`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={ratingFilter === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onRatingChange(rating)}
                      className="flex-1"
                    >
                      {rating === 0 ? 'Any' : (
                        <span className="flex items-center gap-1">
                          {rating}
                          <Star className="h-3 w-3" />
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-primary" />
                  Language
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <div key={lang.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={lang.value}
                        checked={languageFilter.includes(lang.value)}
                        onCheckedChange={() => toggleLanguage(lang.value)}
                      />
                      <label
                        htmlFor={lang.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {lang.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-4">
                <Label className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="h-10 border-2 max-w-xs">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Category: {categories.find(c => c.value === categoryFilter)?.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onCategoryChange('all')}
                />
              </Badge>
            )}
            {levelFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Level: {levels.find(l => l.value === levelFilter)?.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onLevelChange('all')}
                />
              </Badge>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
              <Badge variant="secondary" className="gap-1">
                Price: ${priceRange[0]}-${priceRange[1]}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onPriceRangeChange([0, 200])}
                />
              </Badge>
            )}
            {durationFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Duration: {durations.find(d => d.value === durationFilter)?.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onDurationChange('all')}
                />
              </Badge>
            )}
            {ratingFilter > 0 && (
              <Badge variant="secondary" className="gap-1">
                Rating: {ratingFilter}+ stars
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onRatingChange(0)}
                />
              </Badge>
            )}
            {languageFilter.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                Languages: {languageFilter.length}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onLanguageChange([])}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs h-6"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
