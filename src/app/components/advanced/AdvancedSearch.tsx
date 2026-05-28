import React, { useState } from 'react';
import { Search, Filter, X, Star, Clock, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCategories } from '../../hooks/useCategories';

export function AdvancedSearch() {
  const { categories: categoryData } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all',
    rating: 'all',
    price: 'all',
    language: 'all'
  });

  const categories = ['All', ...categoryData.map(cat => cat.name)];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const durations = ['All', '0-2 hours', '3-6 hours', '7-12 hours', '12+ hours'];
  const ratings = ['All', '4.5+', '4.0+', '3.5+'];
  const prices = ['All', 'Free', 'Under $50', '$50-$100', '$100+'];
  const languages = ['All', 'English', 'Spanish', 'French', 'German', 'Chinese'];

  // Mock search results
  const searchResults = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      instructor: 'Sarah Johnson',
      category: 'Technology',
      level: 'Intermediate',
      duration: '12 hours',
      rating: 4.8,
      reviews: 2450,
      students: 45200,
      price: 49.99,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      tags: ['React', 'JavaScript', 'Frontend'],
      bestseller: true
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      instructor: 'Michael Chen',
      category: 'Technology',
      level: 'Advanced',
      duration: '8 hours',
      rating: 4.9,
      reviews: 1820,
      students: 12500,
      price: 59.99,
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
      tags: ['TypeScript', 'Programming', 'Advanced'],
      trending: true
    },
    {
      id: '3',
      title: 'UI/UX Design Masterclass',
      instructor: 'Emma Williams',
      category: 'Design',
      level: 'Beginner',
      duration: '10 hours',
      rating: 4.7,
      reviews: 3100,
      students: 67800,
      price: 39.99,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      tags: ['UI/UX', 'Design', 'Figma'],
      new: true
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      level: 'all',
      duration: 'all',
      rating: 'all',
      price: 'all',
      language: 'all'
    });
  };

  const activeFilters = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="mb-6">Search Courses</h1>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search for courses, instructors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 text-lg"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 border-2 rounded-lg transition-colors ${
              showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-muted-foreground'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFilters > 0 && (
              <Badge className="px-2 py-0.5 bg-card text-primary rounded-full text-sm font-medium">
                {activeFilters}
              </Badge>
            )}
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Popular:</span>
          {['React', 'Python', 'Design', 'Business', 'Marketing'].map((tag) => (
            <Button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1.5 bg-card border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <Button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={filters.category === cat.toLowerCase()}
                            onChange={() => handleFilterChange('category', cat.toLowerCase())}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Level</label>
                    <div className="space-y-2">
                      {levels.map((lvl) => (
                        <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="level"
                            checked={filters.level === lvl.toLowerCase()}
                            onChange={() => handleFilterChange('level', lvl.toLowerCase())}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm text-gray-700">{lvl}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Duration</label>
                    <div className="space-y-2">
                      {durations.map((dur) => (
                        <label key={dur} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.duration === dur.toLowerCase()}
                            onChange={() => handleFilterChange('duration', dur.toLowerCase())}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="text-sm text-gray-700">{dur}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                    <div className="space-y-2">
                      {ratings.map((rat) => (
                        <label key={rat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rat.toLowerCase()}
                            onChange={() => handleFilterChange('rating', rat.toLowerCase())}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            {rat !== 'All' && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                            {rat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price</label>
                    <div className="space-y-2">
                      {prices.map((price) => (
                        <label key={price} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={filters.price === price.toLowerCase()}
                            onChange={() => handleFilterChange('price', price.toLowerCase())}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm text-gray-700">{price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-900">{searchResults.length} courses</span> found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <Select defaultValue="relevant">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {searchResults.map((course) => (
                <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-48 h-32 object-cover rounded-lg shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            {course.bestseller && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                                Bestseller
                              </span>
                            )}
                            {course.trending && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                <TrendingUp className="w-3 h-3" />
                                Trending
                              </span>
                            )}
                            {course.new && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                <Zap className="w-3 h-3" />
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {course.rating} ({course.reviews.toLocaleString()} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span>{course.students.toLocaleString()} students</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {course.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-4">
                          <p className="text-2xl font-bold text-gray-900 mb-2">${course.price}</p>
                          <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#2d4178] transition-colors">
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}