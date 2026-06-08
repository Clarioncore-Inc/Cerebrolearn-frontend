import React, { useState, useEffect } from 'react';
import api from '../../utils/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
	ArrowLeft,
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
  backPage?: string;
  backData?: any;
}

interface Psychologist {
  id: string;
  psychologistId: string;
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

export function PsychologistBrowse({ onNavigate, backPage, backData }: PsychologistBrowseProps) {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState<Psychologist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPsychologists = async () => {
      try {
        setLoading(true);
        const data = await api.psychologist.list();
        const list = Array.isArray(data) ? data : data.items ?? data.results ?? [];

        const psychs: Psychologist[] = list
          .filter((item: any) => {
            const status = item.status ?? (item.is_approved ? 'approved' : 'pending');
            const isSuspended = item.user?.is_suspended || item.user?.is_active === false;
            const isProfilePublic = item.is_profile_public ?? item.isProfilePublic ?? true;
            return status === 'approved' && !isSuspended && isProfilePublic;
          })
          .map((item: any) => ({
            id: item.id ?? item._id ?? '',
            psychologistId: item.user?.id ?? item.id ?? item._id ?? '',
            fullName: item.user?.full_name ?? item.full_name ?? 'Psychologist',
            email: item.user?.email ?? item.email ?? '',
            specialization: item.specialization ?? 'general',
            yearsOfExperience: item.years_of_experience ?? item.yearsOfExperience ?? 'N/A',
            location: item.location ?? item.user?.location ?? 'N/A',
            bio: item.bio ?? 'No bio available yet.',
            rating: Number(item.rating ?? item.average_rating ?? 0),
            reviewCount: Number(item.review_count ?? item.total_reviews ?? 0),
            sessionsCompleted: Number(item.sessions_completed ?? item.total_sessions ?? 0),
            hourlyRate: Number(item.hourly_rate ?? item.hourlyRate ?? 0),
            avatar: item.user?.avatar ?? item.avatar ?? undefined,
            verified: true,
          }));

        if (!isMounted) return;

        setPsychologists(psychs);
        setFilteredPsychologists(psychs);
      } catch (error) {
        console.error('Error loading psychologists:', error);
        if (isMounted) {
          setPsychologists([]);
          setFilteredPsychologists([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPsychologists();

    return () => {
      isMounted = false;
    };
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

  const specializationOptions = Array.from(
    new Set(psychologists.map((psychologist) => psychologist.specialization).filter(Boolean)),
  );

  const locationOptions = Array.from(
    new Set(psychologists.map((psychologist) => psychologist.location).filter(Boolean)),
  );

  const handleGoBack = () => {
    if (backPage) {
      onNavigate(backPage, backData);
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    onNavigate('student-sessions');
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4 px-0 hover:bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
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
                {specializationOptions.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {getSpecializationLabel(specialization)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
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
        {loading
          ? 'Loading psychologists...'
          : null}
        {!loading ? (
          <>
        Showing {filteredPsychologists.length} psychologist{filteredPsychologists.length !== 1 ? 's' : ''}
          </>
        ) : null}
      </div>

      {/* Psychologist Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPsychologists.map((psychologist) => (
          <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarImage src={psychologist.avatar} alt={psychologist.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {psychologist.fullName?.charAt(0).toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>

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
                {/* <div className="flex items-center gap-1 font-semibold text-foreground">
                  <Clock className="h-4 w-4" />
                  <span>${psychologist.hourlyRate}/hr</span>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    onNavigate('psychologist-profile', {
                      psychologist,
                      backPage: 'browse-psychologists',
                      backData: backPage ? { backPage, backData } : null,
                    })
                  }
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