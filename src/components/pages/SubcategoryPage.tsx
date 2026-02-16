import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ArrowRight,
  Star,
  Users,
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  Play,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SubcategoryPageProps {
  category: string;
  subcategory: string;
  onNavigate: (page: string, data?: any) => void;
}

const subcategoryData: Record<string, Record<string, {
  title: string;
  description: string;
  courses: Array<{
    id: string;
    title: string;
    instructor: string;
    level: string;
    rating: number;
    students: string;
    duration: string;
    lessons: number;
    price: number;
    image: string;
    tags: string[];
  }>;
}>> = {
  science: {
    physics: {
      title: 'Physics',
      description: 'Explore the fundamental laws of nature, from classical mechanics to quantum physics',
      courses: [
        {
          id: 'general-physics',
          title: 'General Physics',
          instructor: 'Dr. Sarah Mitchell',
          level: 'Beginner',
          rating: 4.8,
          students: '8.2K',
          duration: '12 weeks',
          lessons: 48,
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
          tags: ['Mechanics', 'Thermodynamics', 'Waves']
        },
        {
          id: 'theoretical-physics',
          title: 'Theoretical Physics',
          instructor: 'Prof. James Chen',
          level: 'Advanced',
          rating: 4.9,
          students: '5.4K',
          duration: '16 weeks',
          lessons: 64,
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1636690513351-0af1763f6237',
          tags: ['Quantum Mechanics', 'Relativity', 'Field Theory']
        },
        {
          id: 'quantum-physics',
          title: 'Quantum Physics',
          instructor: 'Dr. Emily Roberts',
          level: 'Advanced',
          rating: 4.9,
          students: '6.8K',
          duration: '14 weeks',
          lessons: 56,
          price: 69.99,
          image: 'https://images.unsplash.com/photo-1635070041409-e63e783ce3b0',
          tags: ['Quantum Theory', 'Wave Functions', 'Entanglement']
        },
        {
          id: 'classical-mechanics',
          title: 'Classical Mechanics',
          instructor: 'Dr. Michael Brown',
          level: 'Intermediate',
          rating: 4.7,
          students: '7.5K',
          duration: '10 weeks',
          lessons: 40,
          price: 44.99,
          image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
          tags: ['Newtonian Physics', 'Dynamics', 'Energy']
        },
        {
          id: 'electromagnetism',
          title: 'Electromagnetism',
          instructor: 'Prof. Linda Parker',
          level: 'Intermediate',
          rating: 4.8,
          students: '6.9K',
          duration: '12 weeks',
          lessons: 48,
          price: 54.99,
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
          tags: ['Electric Fields', 'Magnetic Fields', 'Maxwell\'s Equations']
        },
        {
          id: 'astrophysics',
          title: 'Astrophysics',
          instructor: 'Dr. Richard Taylor',
          level: 'Advanced',
          rating: 4.9,
          students: '5.2K',
          duration: '15 weeks',
          lessons: 60,
          price: 74.99,
          image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7464',
          tags: ['Stellar Physics', 'Cosmology', 'Black Holes']
        }
      ]
    },
    chemistry: {
      title: 'Chemistry',
      description: 'Master chemical principles from basic reactions to advanced organic chemistry',
      courses: [
        {
          id: 'general-chemistry',
          title: 'General Chemistry',
          instructor: 'Dr. Amanda White',
          level: 'Beginner',
          rating: 4.7,
          students: '9.5K',
          duration: '12 weeks',
          lessons: 48,
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
          tags: ['Atoms', 'Molecules', 'Reactions']
        },
        {
          id: 'organic-chemistry',
          title: 'Organic Chemistry',
          instructor: 'Prof. David Lee',
          level: 'Intermediate',
          rating: 4.8,
          students: '7.2K',
          duration: '14 weeks',
          lessons: 56,
          price: 59.99,
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
          tags: ['Carbon Compounds', 'Synthesis', 'Mechanisms']
        }
      ]
    },
    biology: {
      title: 'Biology',
      description: 'Study life from cellular biology to ecosystems and evolution',
      courses: [
        {
          id: 'general-biology',
          title: 'General Biology',
          instructor: 'Dr. Maria Garcia',
          level: 'Beginner',
          rating: 4.9,
          students: '12.3K',
          duration: '12 weeks',
          lessons: 48,
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1530213786676-41ad9f7736f6',
          tags: ['Cells', 'Genetics', 'Evolution']
        },
        {
          id: 'molecular-biology',
          title: 'Molecular Biology',
          instructor: 'Prof. John Anderson',
          level: 'Advanced',
          rating: 4.8,
          students: '6.8K',
          duration: '14 weeks',
          lessons: 56,
          price: 64.99,
          image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
          tags: ['DNA', 'RNA', 'Proteins']
        }
      ]
    }
  }
};

export function SubcategoryPage({ category, subcategory, onNavigate }: SubcategoryPageProps) {
  const [sortBy, setSortBy] = useState('popular');
  const [filterLevel, setFilterLevel] = useState('all');

  const data = subcategoryData[category.toLowerCase()]?.[subcategory.toLowerCase()];

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Subcategory Not Found</h1>
        <Button onClick={() => onNavigate('category', { category })}>Back to Category</Button>
      </div>
    );
  }

  const filteredCourses = data.courses.filter(course => 
    filterLevel === 'all' || course.level.toLowerCase() === filterLevel
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'students':
        return parseFloat(b.students) - parseFloat(a.students);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5"></div>
        <div className="container relative py-12 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => onNavigate('category', { category })}
            className="mb-6 group"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to {category}
          </Button>

          <div className="max-w-4xl">
            <Badge className="bg-primary text-white border-0 mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              {category} / {data.title}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="gradient-text">{data.title}</span> Courses
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {data.description}
            </p>

            <div className="flex items-center gap-8">
              <div>
                <div className="text-2xl font-bold text-foreground">{data.courses.length}</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(data.courses.reduce((acc, c) => acc + c.rating, 0) / data.courses.length * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {data.courses.reduce((acc, c) => acc + c.lessons, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Courses */}
      <section className="container py-12 max-w-7xl">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 glass rounded-2xl">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Showing {sortedCourses.length} courses</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Level:</span>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="students">Most Students</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCourses.map((course) => (
            <Card
              key={course.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary"
              onClick={() => onNavigate('course-detail', { 
                category, 
                subcategory, 
                courseId: course.id 
              })}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-start">
                  <Badge 
                    className={`${
                      course.level === 'Beginner' ? 'bg-green-500' :
                      course.level === 'Intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white border-0`}
                  >
                    {course.level}
                  </Badge>
                  <div className="text-white font-bold text-lg glass px-3 py-1 rounded-full">
                    ${course.price}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                    <Play className="w-4 h-4 mr-2" />
                    View Course
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {course.tags.slice(0, 2).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-muted-foreground">({course.students})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}