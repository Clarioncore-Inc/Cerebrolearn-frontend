import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  GitCompare,
  X,
  Check,
  Star,
  Clock,
  Users,
  Award,
  DollarSign,
  BookOpen,
  TrendingUp,
  Shield,
  Video,
  FileText,
  Download,
  Globe,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CourseComparisonToolProps {
  courses?: any[];
  onNavigate?: (page: string, data?: any) => void;
  onClose?: () => void;
  preSelectedCourses?: any[];
}

interface ComparisonCourse {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  duration: string;
  level: string;
  category: string;
  description: string;
  lessons?: number;
  videos?: number;
  articles?: number;
  downloadableResources?: number;
  language?: string;
  certificate?: boolean;
  lifetimeAccess?: boolean;
  features?: string[];
}

export function CourseComparisonTool({
  courses = [],
  onNavigate,
  onClose,
  preSelectedCourses = []
}: CourseComparisonToolProps) {
  const [selectedCourses, setSelectedCourses] = useState<ComparisonCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initialize with preselected courses or load from localStorage
    if (preSelectedCourses.length > 0) {
      setSelectedCourses(preSelectedCourses.slice(0, 4));
    } else {
      const stored = localStorage.getItem('comparison_courses');
      if (stored) {
        setSelectedCourses(JSON.parse(stored).slice(0, 4));
      }
    }

    setAvailableCourses(courses);
  }, [courses, preSelectedCourses]);

  useEffect(() => {
    // Save to localStorage whenever selection changes
    if (selectedCourses.length > 0) {
      localStorage.setItem('comparison_courses', JSON.stringify(selectedCourses));
    }
  }, [selectedCourses]);

  const addCourse = (course: any) => {
    if (selectedCourses.length >= 4) {
      toast.error('Maximum 4 courses can be compared');
      return;
    }

    if (selectedCourses.find(c => c.id === course.id)) {
      toast.error('Course already added');
      return;
    }

    const comparisonCourse: ComparisonCourse = {
      id: course.id,
      title: course.title,
      instructor: course.instructor || 'Unknown Instructor',
      rating: course.rating || 4.5,
      students: course.students || 1000,
      price: course.price || 0,
      duration: course.duration || '4 weeks',
      level: course.level || 'beginner',
      category: course.category || 'General',
      description: course.description || '',
      lessons: course.lessons || 20,
      videos: course.videos || 15,
      articles: course.articles || 10,
      downloadableResources: course.downloadableResources || 5,
      language: course.language || 'English',
      certificate: course.certificate !== false,
      lifetimeAccess: course.lifetimeAccess !== false,
      features: course.features || [
        'Lifetime access',
        'Certificate of completion',
        'Mobile access',
        'Community support'
      ]
    };

    setSelectedCourses([...selectedCourses, comparisonCourse]);
    setShowAddDialog(false);
    toast.success('Course added to comparison');
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
    toast.success('Course removed from comparison');
  };

  const clearAll = () => {
    setSelectedCourses([]);
    localStorage.removeItem('comparison_courses');
    toast.success('Comparison cleared');
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-amber-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getBestValue = () => {
    if (selectedCourses.length < 2) return null;

    // Calculate value score: (rating * 20 + lessons) / price
    const scores = selectedCourses.map(course => ({
      id: course.id,
      score: course.price > 0 
        ? ((course.rating * 20) + (course.lessons || 0)) / course.price
        : (course.rating * 20) + (course.lessons || 0)
    }));

    const best = scores.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );

    return best.id;
  };

  const getHighestRated = () => {
    if (selectedCourses.length < 2) return null;
    const highest = selectedCourses.reduce((prev, current) => 
      current.rating > prev.rating ? current : prev
    );
    return highest.id;
  };

  const getMostPopular = () => {
    if (selectedCourses.length < 2) return null;
    const popular = selectedCourses.reduce((prev, current) => 
      current.students > prev.students ? current : prev
    );
    return popular.id;
  };

  const bestValueId = getBestValue();
  const highestRatedId = getHighestRated();
  const mostPopularId = getMostPopular();

  const filteredAvailableCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCourses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-extrabold flex items-center gap-3">
              <GitCompare className="h-8 w-8 text-primary" />
              Compare Courses
            </h2>
            <p className="text-muted-foreground mt-1">
              Compare up to 4 courses side-by-side
            </p>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>

        <Card className="p-12 text-center border-2">
          <GitCompare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses selected</h3>
          <p className="text-muted-foreground mb-6">
            Add courses to compare features, pricing, and ratings side-by-side
          </p>
          <Button onClick={() => setShowAddDialog(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Courses to Compare
          </Button>
        </Card>

        {/* Add Course Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Course to Compare</DialogTitle>
              <DialogDescription>
                Select a course to add to your comparison (max 4)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredAvailableCourses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => addCourse(course)}
                    className="w-full p-4 border rounded-lg hover:bg-muted transition-colors flex items-center justify-between text-left"
                  >
                    <div>
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.category} • {course.level}
                      </p>
                    </div>
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <GitCompare className="h-8 w-8 text-primary" />
            Compare Courses
          </h2>
          <p className="text-muted-foreground mt-1">
            Comparing {selectedCourses.length} of 4 courses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
          {selectedCourses.length < 4 && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Course Headers */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
            <div></div>
            {selectedCourses.map(course => (
              <Card key={course.id} className="border-2 relative">
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
                  {course.id === bestValueId && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                      Best Value
                    </Badge>
                  )}
                  {course.id === highestRatedId && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                      Highest Rated
                    </Badge>
                  )}
                  {course.id === mostPopularId && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                      Most Popular
                    </Badge>
                  )}
                </div>

                <button
                  onClick={() => removeCourse(course.id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>

                <CardHeader className="pb-3 pt-8">
                  <CardTitle className="text-lg line-clamp-2 min-h-[56px]">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    by {course.instructor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="font-semibold">{course.rating.toFixed(1)}</span>
                      </div>
                      <Badge className={getLevelColor(course.level)} variant="secondary">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </div>
                    <Button className="w-full" onClick={() => onNavigate?.('course', course)}>
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Rows */}
          <div className="space-y-2">
            {/* Rating */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Rating</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= course.rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Students */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Students</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.students.toLocaleString()}</span>
                </Card>
              ))}
            </div>

            {/* Duration */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Duration</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.duration}</span>
                </Card>
              ))}
            </div>

            {/* Lessons */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Lessons</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.lessons}</span>
                </Card>
              ))}
            </div>

            {/* Videos */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Video Content</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.videos} videos</span>
                </Card>
              ))}
            </div>

            {/* Articles */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">Articles</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.articles} articles</span>
                </Card>
              ))}
            </div>

            {/* Downloadable Resources */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-cyan-500" />
                  <span className="font-medium">Downloads</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.downloadableResources} resources</span>
                </Card>
              ))}
            </div>

            {/* Language */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500" />
                  <span className="font-medium">Language</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <span className="font-semibold">{course.language}</span>
                </Card>
              ))}
            </div>

            {/* Certificate */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Certificate</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  {course.certificate ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </Card>
              ))}
            </div>

            {/* Lifetime Access */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Lifetime Access</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  {course.lifetimeAccess ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </Card>
              ))}
            </div>

            {/* Features */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <Card className="p-4 flex items-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-pink-500" />
                  <span className="font-medium">Key Features</span>
                </div>
              </Card>
              {selectedCourses.map(course => (
                <Card key={course.id} className="p-4">
                  <ul className="space-y-1 text-sm">
                    {course.features?.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Course to Compare</DialogTitle>
            <DialogDescription>
              Select a course to add to your comparison ({selectedCourses.length}/4)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredAvailableCourses
                .filter(course => !selectedCourses.find(c => c.id === course.id))
                .map(course => (
                  <button
                    key={course.id}
                    onClick={() => addCourse(course)}
                    className="w-full p-4 border rounded-lg hover:bg-muted transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.category} • {course.level} • ${course.price || 0}
                      </p>
                    </div>
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}