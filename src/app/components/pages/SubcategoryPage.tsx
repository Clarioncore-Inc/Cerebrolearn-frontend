import React, { useEffect, useMemo, useState } from 'react';
import { coursesApi } from '../../utils/api-client';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowRight,
  Star,
  Users,
  Clock,
  BookOpen,
  Play,
  Filter,
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

interface DisplayCourse {
  id: string;
  title: string;
  instructor: string;
  level: string;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  price: number;
  image: string;
  tags: string[];
}

const normalizeKey = (value: string = '') =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

const toTitleCase = (value: string) =>
  value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const formatLevel = (level?: string) => {
  if (!level) return 'Beginner';
  return level.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const getLessonCount = (course: any) => {
  if (typeof course.total_lessons === 'number') return course.total_lessons;
  const sections = Array.isArray(course.sections) ? course.sections : [];
  return sections.reduce(
    (total: number, section: any) => total + (section.lessons?.length || 0),
    0,
  );
};

const getDurationText = (course: any) => {
  if (course.total_duration_text && course.total_duration_text !== '0m') {
    return course.total_duration_text;
  }
  if (course.duration && course.duration !== '0m') {
    return course.duration;
  }
  if (course.estimated_hours) {
    return `${course.estimated_hours}h`;
  }
  return 'Self-paced';
};

const getImageUrl = (course: any) => {
  const attachment = course.thumbnail ?? course.cover_image;
  if (!attachment) return '';
  if (typeof attachment === 'string') {
    return /^https?:\/\//i.test(attachment) ? attachment : '';
  }
  return attachment.url ?? '';
};

const mapCourse = (course: any): DisplayCourse => ({
  id: course.id,
  title: course.title ?? 'Untitled Course',
  instructor: course.creator?.full_name ?? 'Instructor',
  level: formatLevel(course.level),
  rating: Number(course.rating ?? 0),
  students: Number(course.total_enrollments ?? course.enrollments ?? 0),
  duration: getDurationText(course),
  lessons: getLessonCount(course),
  price: Number(course.price ?? 0),
  image: getImageUrl(course),
  tags: Array.isArray(course.tags) ? course.tags.filter(Boolean) : [],
});

export function SubcategoryPage({ category, subcategory, onNavigate }: SubcategoryPageProps) {
  const [courses, setCourses] = useState<DisplayCourse[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      setLoading(true);
      setError('');

      try {
        const allCourses: any[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const data = await coursesApi.getAll(page, 100);
          allCourses.push(...(data.items || []));
          totalPages = data.pages || 1;
          page += 1;
        } while (page <= totalPages);

        const matchedCourses = allCourses
          .filter(
            (course) =>
              normalizeKey(course.category) === normalizeKey(category) &&
              normalizeKey(course.subcategory || '') === normalizeKey(subcategory),
          )
          .map(mapCourse);

        if (!isMounted) return;
        setCourses(matchedCourses);
      } catch (err) {
        console.error('Error loading subcategory courses:', err);
        if (!isMounted) return;
        setCourses([]);
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, [category, subcategory]);

  const sortedCourses = useMemo(() => {
    const filtered = courses.filter(
      (course) => filterLevel === 'all' || normalizeKey(course.level) === filterLevel,
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.students - a.students;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
        default:
          return b.students - a.students;
      }
    });
  }, [courses, filterLevel, sortBy]);

  const averageRating =
    courses.length > 0
      ? Math.round((courses.reduce((sum, course) => sum + course.rating, 0) / courses.length) * 10) / 10
      : 0;

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons, 0);
  const title = toTitleCase(subcategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5" />
        <div className="container relative max-w-7xl py-12">
          <Button
            variant="ghost"
            onClick={() => onNavigate('category', { category })}
            className="group mb-6"
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back to {category}
          </Button>

          <div className="max-w-4xl">
            <Badge className="mb-4 border-0 bg-primary text-white">
              <BookOpen className="mr-1 h-3 w-3" />
              {category} / {title}
            </Badge>

            <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              <span className="gradient-text">{title}</span> Courses
            </h1>

            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {loading
                ? 'Loading courses...'
                : `${courses.length} course${courses.length !== 1 ? 's' : ''} available in this subcategory.`}
            </p>

            <div className="flex items-center gap-8">
              <div>
                <div className="text-2xl font-bold text-foreground">{courses.length}</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{averageRating}</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalLessons}</div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-7xl py-12">
        <div className="glass mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl p-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
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

        {error ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">{error}</div>
          </Card>
        ) : loading ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">Loading courses...</div>
          </Card>
        ) : sortedCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">No courses found for this subcategory yet.</div>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course) => (
              <Card
                key={course.id}
                className="group cursor-pointer overflow-hidden border-2 border-transparent transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
                onClick={() =>
                  onNavigate('course-detail', {
                    category,
                    subcategory,
                    courseId: course.id,
                  })
                }
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 to-secondary/20">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  )}

                  <div className="absolute left-3 right-3 top-3 z-20 flex items-start justify-between">
                    <Badge
                      className={`${
                        course.level === 'Beginner'
                          ? 'bg-green-500'
                          : course.level === 'Intermediate'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      } border-0 text-white`}
                    >
                      {course.level}
                    </Badge>
                    <div className="glass rounded-full px-3 py-1 text-lg font-bold text-white">
                      ${course.price}
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                      <Play className="mr-2 h-4 w-4" />
                      View Course
                    </Button>
                  </div>
                </div>

                <CardContent className="space-y-3 p-4">
                  <div>
                    <h3 className="mb-1 line-clamp-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
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

                  <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}