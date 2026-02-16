import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Code,
  Briefcase,
} from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Posts', icon: BookOpen, count: 24 },
    { id: 'learning-tips', name: 'Learning Tips', icon: Lightbulb, count: 8 },
    { id: 'career', name: 'Career Advice', icon: Briefcase, count: 6 },
    { id: 'technology', name: 'Technology', icon: Code, count: 10 },
  ];

  const featuredPost = {
    id: '1',
    title: 'The Science of Effective Learning: 10 Proven Strategies',
    excerpt: 'Discover evidence-based techniques that will transform how you learn and retain information. Based on the latest cognitive science research.',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min',
    image: '📚',
    category: 'Learning Tips',
    featured: true,
  };

  const blogPosts = [
    {
      id: '2',
      title: 'How to Build a Career in Data Science in 2024',
      excerpt: 'A comprehensive guide to breaking into data science, from learning the fundamentals to landing your first job.',
      author: 'Michael Chen',
      date: '2024-01-12',
      readTime: '12 min',
      image: '📊',
      category: 'Career Advice',
    },
    {
      id: '3',
      title: 'Mastering JavaScript: Advanced Patterns and Best Practices',
      excerpt: 'Take your JavaScript skills to the next level with these advanced patterns used by professional developers.',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '15 min',
      image: '💻',
      category: 'Technology',
    },
    {
      id: '4',
      title: 'The Power of Spaced Repetition in Learning',
      excerpt: 'Learn how this proven technique can help you remember information for life, not just for the test.',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-08',
      readTime: '6 min',
      image: '🧠',
      category: 'Learning Tips',
    },
    {
      id: '5',
      title: 'From Bootcamp to Tech Giant: Success Stories',
      excerpt: 'Inspiring stories of learners who transformed their careers through continuous learning and dedication.',
      author: 'David Kim',
      date: '2024-01-05',
      readTime: '10 min',
      image: '🚀',
      category: 'Career Advice',
    },
    {
      id: '6',
      title: 'Understanding Machine Learning: A Beginner\'s Guide',
      excerpt: 'Demystifying ML concepts with clear explanations and practical examples anyone can understand.',
      author: 'Michael Chen',
      date: '2024-01-03',
      readTime: '14 min',
      image: '🤖',
      category: 'Technology',
    },
    {
      id: '7',
      title: '5 Habits of Highly Effective Learners',
      excerpt: 'Simple daily habits that separate successful learners from the rest. Start implementing them today.',
      author: 'Emily Rodriguez',
      date: '2024-01-01',
      readTime: '7 min',
      image: '⭐',
      category: 'Learning Tips',
    },
  ];

  const filteredPosts = selectedCategory && selectedCategory !== 'all'
    ? blogPosts.filter((post) => post.category === categories.find(c => c.id === selectedCategory)?.name)
    : blogPosts;

  const searchedPosts = searchQuery
    ? filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  return (
    <div className="min-h-screen py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4">Blog & Resources</Badge>
          <h1 className="text-5xl font-bold mb-4">
            Learn, Grow, Succeed
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights, tips, and stories to help you on your learning journey
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
              className="gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {!searchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-8xl p-12">
                  {featuredPost.image}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">Featured</Badge>
                  <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Button>
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {searchedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center text-6xl border-b">
                    {post.image}
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {searchedPosts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20">
          <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Never Miss an Update
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest articles, tips, and resources delivered to your inbox.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-black"
                />
                <Button className="bg-white text-primary hover:bg-white/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
