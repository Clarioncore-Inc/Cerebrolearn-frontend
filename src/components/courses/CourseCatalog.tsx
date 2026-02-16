import React, { useEffect, useState } from 'react';
import { apiCall } from '../../utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { SmartSearchBar } from './SmartSearchBar';
import { CompareCoursesButton } from './CompareCoursesButton';
import { 
  BookOpen, Search, Star, Users, Clock, Filter, Sparkles, Play, Award, 
  TrendingUp, PlusCircle, BookMarked, SlidersHorizontal, X, BookmarkPlus,
  ArrowUpDown, DollarSign, Globe
} from 'lucide-react';

interface CourseCatalogProps {
  onNavigate: (page: string, data?: any) => void;
  userRole?: 'student' | 'course_creator' | 'instructor' | 'admin';
}

export function CourseCatalog({ onNavigate, userRole = 'student' }: CourseCatalogProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, categoryFilter, levelFilter, courses]);

  const loadCourses = async () => {
    try {
      const data = await apiCall('/courses');
      setCourses(data.courses || []);
      setFilteredCourses(data.courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    setFilteredCourses(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: BookOpen },
    { value: 'science', label: 'Science', icon: BookOpen, description: 'Physics, Chemistry, Biology, and more' },
    { value: 'mathematics', label: 'Mathematics', icon: TrendingUp, description: 'Algebra, Calculus, Statistics, and more' },
    { value: 'technology', label: 'Technology', icon: BookOpen, description: 'Programming, AI, Web Dev, and more' },
    { value: 'business', label: 'Business', icon: Award, description: 'Marketing, Finance, Entrepreneurship' },
    { value: 'programming', label: 'Programming', icon: BookOpen, description: 'Web, Mobile, Game Development' },
    { value: 'design', label: 'Design', icon: BookOpen, description: 'UI/UX, Graphic Design, 3D Modeling' },
    { value: 'languages', label: 'Languages', icon: BookOpen, description: 'English, Spanish, French, and more' }
  ];
  
  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const levelGradients = {
    beginner: 'from-emerald-500 to-teal-500',
    intermediate: 'from-amber-500 to-orange-500',
    advanced: 'from-rose-500 to-pink-500'
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-32" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-white">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px] animate-gradient"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="container relative py-16 md:py-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-slide-up">
            <Badge variant="secondary" className="bg-white/20 border-white/30 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {courses.length}+ Expert-Designed Courses
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Explore Our Course Catalog
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Discover interactive courses designed to help you master new skills through engaging,
              step-by-step learning experiences from world-class instructors
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Smart Search Bar */}
        <div className="max-w-4xl mx-auto -mt-16 relative z-20">
          <SmartSearchBar
            onSearch={(query) => setSearchQuery(query)}
            onCourseSelect={(course) => onNavigate('course', course)}
            courses={courses}
          />
        </div>

        {/* Browse by Category Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-extrabold">Browse by Category</h2>
            <p className="text-muted-foreground">Explore courses organized by subject area</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(cat => cat.value !== 'all').map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.value}
                  className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5 border-2"
                  onClick={() => onNavigate('category', { category: category.value })}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {category.label}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Filter Courses</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 border-2 focus:border-primary transition-colors"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

              <Select value={levelFilter} onValueChange={setLevelFilter}>
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

            {/* Active Filters Summary */}
            {(searchQuery || categoryFilter !== 'all' || levelFilter !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary">
                    Category: {categories.find(c => c.value === categoryFilter)?.label}
                  </Badge>
                )}
                {levelFilter !== 'all' && (
                  <Badge variant="secondary">
                    Level: {levels.find(l => l.value === levelFilter)?.label}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setLevelFilter('all');
                  }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> of{' '}
              <span className="font-semibold text-foreground">{courses.length}</span> courses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Most Popular
            </Badge>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group overflow-hidden hover-lift card-glow cursor-pointer transition-all duration-300"
                onClick={() => onNavigate('course', course)}
              >
                <div className={`h-48 bg-gradient-to-br ${levelGradients[course.level as keyof typeof levelGradients] || 'from-indigo-500 to-purple-500'} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <BookOpen className="h-20 w-20 text-white/90 relative z-10 group-hover:scale-110 transition-transform" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-end p-6">
                    <Button size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                      <Play className="mr-2 h-4 w-4" />
                      View Course
                    </Button>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge 
                      variant={course.level === 'beginner' ? 'secondary' : 'default'}
                      className={`text-xs bg-gradient-to-r ${levelGradients[course.level as keyof typeof levelGradients]} text-white border-0`}
                    >
                      {course.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                  
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{Math.floor(Math.random() * 10000)}+</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(Math.random() * 12) + 4}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">4.{Math.floor(Math.random() * 3) + 7}</span>
                    </div>
                  </div>

                  {/* Instructor & Price */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-xs">
                        <p className="font-medium">Expert</p>
                        <p className="text-muted-foreground">Instructor</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="group/btn">
                      Enroll
                      <Play className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl mb-3">No courses found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Try adjusting your filters or search terms to find what you're looking for
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setLevelFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          {userRole === 'course_creator' || userRole === 'instructor' || userRole === 'admin' ? (
            <CardContent className="relative p-8 md:p-12 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <PlusCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Ready to Create Your Next Course?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Turn your expertise into engaging learning experiences. Create interactive courses that inspire thousands of learners worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => onNavigate('creator-create-course')}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Course
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('creator-dashboard')}>
                  <BookMarked className="mr-2 h-5 w-5" />
                  View My Courses
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="relative p-8 md:p-12 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Can't find what you're looking for?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're constantly adding new courses. Request a topic or become a course creator to share your expertise!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => onNavigate('auth')}>
                  Request a Course
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('auth')}>
                  Become a Course Creator
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Floating Comparison Button */}
      <CompareCoursesButton onViewComparison={() => onNavigate('course-comparison')} />
    </div>
  );
}