"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BookOpen,
  FileText,
  Video,
  Headphones,
  Download,
  Search,
  Heart,
  Brain,
  Users,
  Smile,
  Moon,
  Zap,
  ArrowLeft,
  ExternalLink,
  Star,
  Clock
} from 'lucide-react';

interface TherapyResourcesLibraryProps {
  onNavigate: (page: string, data?: any) => void;
}

export function TherapyResourcesLibrary({ onNavigate }: TherapyResourcesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'anxiety', name: 'Anxiety', icon: Brain },
    { id: 'depression', name: 'Depression', icon: Heart },
    { id: 'relationships', name: 'Relationships', icon: Users },
    { id: 'self-care', name: 'Self-Care', icon: Smile },
    { id: 'sleep', name: 'Sleep', icon: Moon },
    { id: 'stress', name: 'Stress Management', icon: Zap }
  ];

  const resources = [
    {
      id: 1,
      title: 'Anxiety Coping Strategies Workbook',
      type: 'worksheet',
      category: 'anxiety',
      description: 'Practical exercises for managing anxiety symptoms',
      duration: '30 min read',
      rating: 4.8,
      downloads: 1234
    },
    {
      id: 2,
      title: 'Guided Meditation for Relaxation',
      type: 'audio',
      category: 'stress',
      description: '15-minute guided meditation session',
      duration: '15 min',
      rating: 4.9,
      downloads: 856
    },
    {
      id: 3,
      title: 'CBT Thought Record Template',
      type: 'worksheet',
      category: 'depression',
      description: 'Track and challenge negative thought patterns',
      duration: '10 min',
      rating: 4.7,
      downloads: 2103
    },
    {
      id: 4,
      title: 'Communication Skills Video Series',
      type: 'video',
      category: 'relationships',
      description: 'Improve your relationships through better communication',
      duration: '45 min',
      rating: 4.6,
      downloads: 543
    },
    {
      id: 5,
      title: 'Sleep Hygiene Checklist',
      type: 'worksheet',
      category: 'sleep',
      description: 'Optimize your sleep routine for better rest',
      duration: '5 min read',
      rating: 4.5,
      downloads: 967
    },
    {
      id: 6,
      title: 'Progressive Muscle Relaxation',
      type: 'audio',
      category: 'anxiety',
      description: 'Reduce physical tension and anxiety',
      duration: '20 min',
      rating: 4.8,
      downloads: 1456
    },
    {
      id: 7,
      title: 'Self-Compassion Exercises',
      type: 'worksheet',
      category: 'self-care',
      description: 'Practice kindness toward yourself',
      duration: '25 min',
      rating: 4.9,
      downloads: 1789
    },
    {
      id: 8,
      title: 'Understanding Depression',
      type: 'article',
      category: 'depression',
      description: 'Educational resource about depression and treatment',
      duration: '15 min read',
      rating: 4.7,
      downloads: 1234
    },
    {
      id: 9,
      title: 'Breathing Exercises for Panic Attacks',
      type: 'video',
      category: 'anxiety',
      description: 'Quick techniques to manage panic symptoms',
      duration: '8 min',
      rating: 4.9,
      downloads: 2341
    },
    {
      id: 10,
      title: 'Gratitude Journal Template',
      type: 'worksheet',
      category: 'self-care',
      description: 'Daily gratitude practice worksheet',
      duration: '5 min daily',
      rating: 4.6,
      downloads: 1567
    },
    {
      id: 11,
      title: 'Conflict Resolution Guide',
      type: 'article',
      category: 'relationships',
      description: 'Navigate disagreements constructively',
      duration: '20 min read',
      rating: 4.5,
      downloads: 789
    },
    {
      id: 12,
      title: 'Stress Reduction Playlist',
      type: 'audio',
      category: 'stress',
      description: 'Calming music for stress relief',
      duration: '60 min',
      rating: 4.8,
      downloads: 2145
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'worksheet': return FileText;
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'article': return BookOpen;
      default: return FileText;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'worksheet': return 'text-blue-600';
      case 'video': return 'text-purple-600';
      case 'audio': return 'text-green-600';
      case 'article': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate('therapy-dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Resource Library</h1>
          <p className="text-muted-foreground">
            Access worksheets, exercises, and educational materials to support your mental health
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No resources match your search' : 'No resources in this category'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = getResourceIcon(resource.type);
              const colorClass = getResourceColor(resource.type);

              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`h-8 w-8 ${colorClass}`} />
                      <Badge variant="outline" className="capitalize">
                        {resource.type}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{resource.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{resource.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {resource.type === 'video' || resource.type === 'audio' ? (
                        <Button className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      ) : (
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button variant="outline">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About the Resource Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Evidence-Based:</strong> All resources are based on proven therapeutic approaches</p>
            <p>✅ <strong>Therapist-Approved:</strong> Reviewed and recommended by licensed professionals</p>
            <p>✅ <strong>Free Access:</strong> All resources are available at no additional cost</p>
            <p>✅ <strong>Regular Updates:</strong> New resources added monthly based on client feedback</p>
            <p>✅ <strong>Privacy Protected:</strong> Downloads are anonymous and secure</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
