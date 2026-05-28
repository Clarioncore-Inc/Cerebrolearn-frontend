import React, { useEffect, useMemo, useState } from 'react';
import { coursesApi } from '../../utils/api-client';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, BookOpen, TrendingUp, Star, Users } from 'lucide-react';

interface CategoryPageProps {
  category: string;
  onNavigate: (page: string, data?: any) => void;
}

interface DisplaySubcategory {
  id: string;
  name: string;
  description: string;
  courseCount: number;
  studentCount: string;
  rating: number;
  image: string;
}

const normalizeKey = (value: string = '') =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

const toTitleCase = (value: string) =>
  value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const getImageUrl = (course: any) => {
  const attachment = course.thumbnail ?? course.cover_image;
  if (!attachment) return '';
  if (typeof attachment === 'string') {
    return /^https?:\/\//i.test(attachment) ? attachment : '';
  }
  return attachment.url ?? '';
};

const categoryMeta: Record<string, { description: string; gradient: string; icon: typeof BookOpen }> = {
  science: {
    description: 'Explore the natural world through physics, chemistry, biology, and more',
    gradient: 'from-blue-500 to-cyan-500',
    icon: BookOpen,
  },
  mathematics: {
    description: 'Master algebra, calculus, statistics, and advanced mathematical concepts',
    gradient: 'from-purple-500 to-pink-500',
    icon: TrendingUp,
  },
  technology: {
    description: 'Learn programming, web development, AI, cybersecurity, and more',
    gradient: 'from-green-500 to-emerald-500',
    icon: BookOpen,
  },
  business: {
    description: 'Master business strategy, marketing, finance, and entrepreneurship',
    gradient: 'from-orange-500 to-red-500',
    icon: TrendingUp,
  },
};

export function CategoryPage({ category, onNavigate }: CategoryPageProps) {
  const [subcategories, setSubcategories] = useState<DisplaySubcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryKey = normalizeKey(category);
  const categoryTitle = toTitleCase(category);
  const meta = categoryMeta[categoryKey] ?? {
    description: `Explore ${categoryTitle} courses and discover specialized topics.`,
    gradient: 'from-primary to-secondary',
    icon: BookOpen,
  };
  const Icon = meta.icon;

  useEffect(() => {
    let isMounted = true;

    const loadCategoryCourses = async () => {
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

        const categoryCourses = allCourses.filter(
          (course) => normalizeKey(course.category) === categoryKey,
        );

        const grouped = new Map<string, any[]>();
        categoryCourses.forEach((course) => {
          const rawSubcategory = course.subcategory || '';
          const key = normalizeKey(rawSubcategory);
          if (!key) return;
          const existing = grouped.get(key) ?? [];
          existing.push(course);
          grouped.set(key, existing);
        });

        const nextSubcategories = Array.from(grouped.entries())
          .map(([key, items]) => {
            const first = items[0];
            const totalStudents = items.reduce(
              (sum, item) => sum + Number(item.total_enrollments ?? item.enrollments ?? 0),
              0,
            );
            const averageRating =
              items.reduce((sum, item) => sum + Number(item.rating ?? 0), 0) / items.length;
            const image = items.map(getImageUrl).find(Boolean) ?? '';
            const name = toTitleCase(first.subcategory || key);

            return {
              id: key,
              name,
              description: `Explore ${name} courses in ${categoryTitle}.`,
              courseCount: items.length,
              studentCount: formatCompactNumber(totalStudents),
              rating: Math.round(averageRating * 10) / 10,
              image,
            } satisfies DisplaySubcategory;
          })
          .sort((a, b) => b.courseCount - a.courseCount || a.name.localeCompare(b.name));

        if (!isMounted) return;
        setSubcategories(nextSubcategories);
      } catch (err) {
        console.error('Error loading category courses:', err);
        if (!isMounted) return;
        setSubcategories([]);
        setError(err instanceof Error ? err.message : 'Failed to load category courses');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadCategoryCourses();

    return () => {
      isMounted = false;
    };
  }, [categoryKey, categoryTitle]);

  const totalCourses = useMemo(
    () => subcategories.reduce((acc, subcategory) => acc + subcategory.courseCount, 0),
    [subcategories],
  );

  const averageRating = useMemo(() => {
    if (subcategories.length === 0 || totalCourses === 0) return 0;
    const weightedTotal = subcategories.reduce(
      (acc, subcategory) => acc + subcategory.rating * subcategory.courseCount,
      0,
    );
    return Math.round((weightedTotal / totalCourses) * 10) / 10;
  }, [subcategories, totalCourses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
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
            <Badge className={`bg-gradient-to-r ${meta.gradient} text-white border-0 mb-6`}>
              <Icon className="w-3 h-3 mr-1" />
              {categoryTitle}
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">{categoryTitle}</span> Courses
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">{meta.description}</p>

            <div className="flex items-center gap-8 mt-8">
              <div>
                <div className="text-2xl font-bold text-foreground">{subcategories.length}</div>
                <div className="text-sm text-muted-foreground">Subcategories</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
                <div className="text-sm text-muted-foreground">Total Courses</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-foreground">{averageRating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore {categoryTitle} Topics</h2>
          <p className="text-lg text-muted-foreground">
            Choose a subcategory to discover specialized courses
          </p>
        </div>

        {error ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">{error}</div>
          </Card>
        ) : loading ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">Loading topics...</div>
          </Card>
        ) : subcategories.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">No subcategories found for this category yet.</div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((subcategory) => (
              <Card
                key={subcategory.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary"
                onClick={() => onNavigate('subcategory', { category, subcategory: subcategory.id })}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  {subcategory.image ? (
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${meta.gradient} opacity-90`} />
                  )}
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
        )}
      </section>
    </div>
  );
}