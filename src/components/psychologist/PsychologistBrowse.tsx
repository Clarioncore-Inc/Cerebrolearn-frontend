import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  GraduationCap,
  Filter,
  Users,
  Award,
  Clock
} from 'lucide-react';

interface PsychologistBrowseProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Psychologist {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
  yearsOfExperience: string;
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  hourlyRate: number;
  avatar?: string;
  verified: boolean;
}

export function PsychologistBrowse({ onNavigate }: PsychologistBrowseProps) {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState<Psychologist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    // Load verified psychologists from applications
    const applications = JSON.parse(localStorage.getItem('psychologist_applications') || '[]');
    const verifiedApps = applications.filter((app: any) => app.status === 'approved');

    // Load ratings data
    const ratings = JSON.parse(localStorage.getItem('psychologist_ratings') || '{}');

    const psychs: Psychologist[] = verifiedApps.map((app: any) => {
      const ratingData = ratings[app.email] || { average: 4.5, count: 0 };
      
      return {
        id: app.id,
        fullName: app.fullName,
        email: app.email,
        specialization: app.specialization,
        yearsOfExperience: app.yearsOfExperience,
        location: app.location,
        bio: app.bio,
        rating: ratingData.average,
        reviewCount: ratingData.count,
        sessionsCompleted: Math.floor(Math.random() * 100) + 20,
        hourlyRate: 150,
        verified: true,
      };
    });

    // Add some mock psychologists if none exist
    if (psychs.length === 0) {
      const mockPsychologists: Psychologist[] = [
        {
          id: 'psych_1',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@cerebrolearn.com',
          specialization: 'clinical',
          yearsOfExperience: '11-15',
          location: 'New York, NY',
          bio: 'Experienced clinical psychologist specializing in cognitive behavioral therapy and anxiety disorders. Over 15 years of experience helping clients achieve their mental health goals.',
          rating: 4.9,
          reviewCount: 47,
          sessionsCompleted: 89,
          hourlyRate: 200,
          verified: true,
        },
        {
          id: 'psych_2',
          fullName: 'Dr. Michael Chen',
          email: 'michael.chen@cerebrolearn.com',
          specialization: 'educational',
          yearsOfExperience: '6-10',
          location: 'San Francisco, CA',
          bio: 'Educational psychologist focused on learning strategies and academic performance optimization. Passionate about helping students reach their full potential.',
          rating: 4.8,
          reviewCount: 38,
          sessionsCompleted: 72,
          hourlyRate: 175,
          verified: true,
        },
        {
          id: 'psych_3',
          fullName: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@cerebrolearn.com',
          specialization: 'cognitive',
          yearsOfExperience: '16+',
          location: 'Boston, MA',
          bio: 'Cognitive psychologist with expertise in memory, learning, and problem-solving. Specializing in helping individuals optimize their cognitive abilities.',
          rating: 4.95,
          reviewCount: 62,
          sessionsCompleted: 124,
          hourlyRate: 225,
          verified: true,
        },
        {
          id: 'psych_4',
          fullName: 'Dr. James Williams',
          email: 'james.williams@cerebrolearn.com',
          specialization: 'neuropsychology',
          yearsOfExperience: '11-15',
          location: 'Chicago, IL',
          bio: 'Neuropsychologist specializing in cognitive assessment and brain-behavior relationships. Expert in IQ testing and interpretation.',
          rating: 4.85,
          reviewCount: 41,
          sessionsCompleted: 95,
          hourlyRate: 210,
          verified: true,
        },
        {
          id: 'psych_5',
          fullName: 'Dr. Lisa Anderson',
          email: 'lisa.anderson@cerebrolearn.com',
          specialization: 'counseling',
          yearsOfExperience: '6-10',
          location: 'Seattle, WA',
          bio: 'Counseling psychologist dedicated to career guidance and personal development. Helping clients make informed decisions about their future.',
          rating: 4.75,
          reviewCount: 35,
          sessionsCompleted: 68,
          hourlyRate: 165,
          verified: true,
        },
      ];
      psychs.push(...mockPsychologists);
    }

    setPsychologists(psychs);
    setFilteredPsychologists(psychs);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...psychologists];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(p => p.specialization === specializationFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(p => p.location.includes(locationFilter));
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'experience':
        filtered.sort((a, b) => {
          const expOrder: any = { '0-2': 1, '3-5': 2, '6-10': 3, '11-15': 4, '16+': 5 };
          return expOrder[b.yearsOfExperience] - expOrder[a.yearsOfExperience];
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
    }

    setFilteredPsychologists(filtered);
  }, [searchQuery, specializationFilter, locationFilter, sortBy, psychologists]);

  const getSpecializationLabel = (spec: string) => {
    const labels: any = {
      clinical: 'Clinical Psychology',
      cognitive: 'Cognitive Psychology',
      developmental: 'Developmental Psychology',
      educational: 'Educational Psychology',
      neuropsychology: 'Neuropsychology',
      organizational: 'Organizational Psychology',
      counseling: 'Counseling Psychology',
      forensic: 'Forensic Psychology',
    };
    return labels[spec] || spec;
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Psychologist</h1>
        <p className="text-muted-foreground">
          Connect with verified mental health professionals for consultations and assessments
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, specialization, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
                <SelectItem value="cognitive">Cognitive</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="neuropsychology">Neuropsychology</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="developmental">Developmental</SelectItem>
                <SelectItem value="organizational">Organizational</SelectItem>
                <SelectItem value="forensic">Forensic</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="Boston">Boston</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Seattle">Seattle</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredPsychologists.length} psychologist{filteredPsychologists.length !== 1 ? 's' : ''}
      </div>

      {/* Psychologist Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPsychologists.map((psychologist) => (
          <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>

                {/* Header Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl mb-1 flex items-center gap-2">
                        {psychologist.fullName}
                        {psychologist.verified && (
                          <Badge variant="default" className="bg-cyan-500 text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {psychologist.location}
                      </CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {psychologist.rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {psychologist.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Specialization Badge */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  {getSpecializationLabel(psychologist.specialization)}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {psychologist.yearsOfExperience} years exp.
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {psychologist.bio}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{psychologist.sessionsCompleted} sessions</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <Clock className="h-4 w-4" />
                  <span>${psychologist.hourlyRate}/hr</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onNavigate('psychologist-profile', { psychologist })}
                >
                  View Profile
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => onNavigate('enhanced-book-appointment', { psychologist })}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPsychologists.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No psychologists found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSpecializationFilter('all');
                setLocationFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}