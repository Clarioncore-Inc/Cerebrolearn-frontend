import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, BookOpen, TrendingUp, Star, Users } from 'lucide-react';

interface CategoryPageProps {
  category: string;
  onNavigate: (page: string, data?: any) => void;
}

const categoryData: Record<string, {
  title: string;
  description: string;
  gradient: string;
  icon: any;
  subcategories: Array<{
    id: string;
    name: string;
    description: string;
    courseCount: number;
    studentCount: string;
    rating: number;
    image: string;
    color: string;
  }>;
}> = {
  science: {
    title: 'Science',
    description: 'Explore the natural world through physics, chemistry, biology, and more',
    gradient: 'from-blue-500 to-cyan-500',
    icon: BookOpen,
    subcategories: [
      {
        id: 'physics',
        name: 'Physics',
        description: 'Study matter, energy, and the fundamental forces of nature',
        courseCount: 24,
        studentCount: '15.2K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
        color: '#395192'
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Understand the composition and properties of matter',
        courseCount: 18,
        studentCount: '12.8K',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
        color: '#06b6d4'
      },
      {
        id: 'biology',
        name: 'Biology',
        description: 'Explore living organisms and their vital processes',
        courseCount: 32,
        studentCount: '18.5K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1530213786676-41ad9f7736f6',
        color: '#10b981'
      },
      {
        id: 'astronomy',
        name: 'Astronomy',
        description: 'Study celestial objects and the universe',
        courseCount: 15,
        studentCount: '9.3K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
        color: '#8b5cf6'
      },
      {
        id: 'earth-science',
        name: 'Earth Science',
        description: 'Learn about our planet and its systems',
        courseCount: 21,
        studentCount: '11.7K',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        color: '#f59e0b'
      },
      {
        id: 'environmental-science',
        name: 'Environmental Science',
        description: 'Study the environment and sustainability',
        courseCount: 19,
        studentCount: '13.2K',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc',
        color: '#10b981'
      }
    ]
  },
  mathematics: {
    title: 'Mathematics',
    description: 'Master algebra, calculus, statistics, and advanced mathematical concepts',
    gradient: 'from-purple-500 to-pink-500',
    icon: TrendingUp,
    subcategories: [
      {
        id: 'algebra',
        name: 'Algebra',
        description: 'Master algebraic expressions and equations',
        courseCount: 28,
        studentCount: '22.4K',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
        color: '#395192'
      },
      {
        id: 'calculus',
        name: 'Calculus',
        description: 'Study limits, derivatives, and integrals',
        courseCount: 25,
        studentCount: '19.8K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
        color: '#8b5cf6'
      },
      {
        id: 'statistics',
        name: 'Statistics',
        description: 'Learn data analysis and probability',
        courseCount: 22,
        studentCount: '25.6K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        color: '#06b6d4'
      },
      {
        id: 'geometry',
        name: 'Geometry',
        description: 'Explore shapes, sizes, and spatial relationships',
        courseCount: 18,
        studentCount: '14.2K',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a',
        color: '#ec4899'
      }
    ]
  },
  technology: {
    title: 'Technology',
    description: 'Learn programming, web development, AI, cybersecurity, and more',
    gradient: 'from-green-500 to-emerald-500',
    icon: BookOpen,
    subcategories: [
      {
        id: 'programming',
        name: 'Programming',
        description: 'Master programming languages and software development',
        courseCount: 45,
        studentCount: '42.5K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        color: '#395192'
      },
      {
        id: 'web-development',
        name: 'Web Development',
        description: 'Build modern web applications',
        courseCount: 38,
        studentCount: '38.2K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        color: '#06b6d4'
      },
      {
        id: 'ai-ml',
        name: 'AI & Machine Learning',
        description: 'Explore artificial intelligence and ML algorithms',
        courseCount: 32,
        studentCount: '35.7K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        color: '#8b5cf6'
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        description: 'Learn security best practices and ethical hacking',
        courseCount: 27,
        studentCount: '28.3K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
        color: '#ef4444'
      }
    ]
  },
  business: {
    title: 'Business',
    description: 'Master business strategy, marketing, finance, and entrepreneurship',
    gradient: 'from-orange-500 to-red-500',
    icon: TrendingUp,
    subcategories: [
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Learn digital marketing and brand strategy',
        courseCount: 35,
        studentCount: '31.2K',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        color: '#f59e0b'
      },
      {
        id: 'finance',
        name: 'Finance',
        description: 'Master financial analysis and investment',
        courseCount: 28,
        studentCount: '26.8K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
        color: '#10b981'
      },
      {
        id: 'entrepreneurship',
        name: 'Entrepreneurship',
        description: 'Start and grow your own business',
        courseCount: 22,
        studentCount: '19.5K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        color: '#395192'
      },
      {
        id: 'management',
        name: 'Management',
        description: 'Develop leadership and organizational skills',
        courseCount: 30,
        studentCount: '24.7K',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        color: '#06b6d4'
      }
    ]
  }
};

export function CategoryPage({ category, onNavigate }: CategoryPageProps) {
  const data = categoryData[category.toLowerCase()];

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-4">Category Not Found</h1>
        <Button onClick={() => onNavigate('catalog')}>Back to Catalog</Button>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5"></div>
        <div className="container relative py-12 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => onNavigate('catalog')}
            className="mb-6 group"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Button>

          <div className="max-w-4xl">
            <Badge className={`bg-gradient-to-r ${data.gradient} text-white border-0 mb-6`}>
              <Icon className="w-3 h-3 mr-1" />
              {data.title}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">{data.title}</span> Courses
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {data.description}
            </p>

            <div className="flex items-center gap-8 mt-8">
              <div>
                <div className="text-2xl font-bold text-foreground">{data.subcategories.length}</div>
                <div className="text-sm text-muted-foreground">Subcategories</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-foreground">
                  {data.subcategories.reduce((acc, sub) => acc + sub.courseCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Courses</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(data.subcategories.reduce((acc, sub) => acc + sub.rating, 0) / data.subcategories.length * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="container py-12 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore {data.title} Topics</h2>
          <p className="text-lg text-muted-foreground">
            Choose a subcategory to discover specialized courses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.subcategories.map((subcategory) => (
            <Card
              key={subcategory.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary"
              onClick={() => onNavigate('subcategory', { category, subcategory: subcategory.id })}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img
                  src={subcategory.image}
                  alt={subcategory.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="glass text-white border-white/20">
                    {subcategory.courseCount} Courses
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {subcategory.name}
                  </h3>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed line-clamp-2">
                  {subcategory.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{subcategory.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{subcategory.studentCount}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}