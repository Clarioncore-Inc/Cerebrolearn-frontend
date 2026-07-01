import React, { useEffect, useMemo, useState } from 'react';
import { lessonsApi, socialApi } from '../../utils/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bookmark, 
  Search,
  Trash2,
  ChevronRight,
  BookOpen,
  Clock,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Bookmark as BookmarkRecord } from '../../types/database';

interface BookmarkManagerProps {
  onNavigate: (page: string, data?: any) => void;
  currentLessonId?: string;
  currentCourseId?: string;
  compact?: boolean;
}

export function BookmarkManager({ 
  onNavigate, 
  compact = false 
}: BookmarkManagerProps) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyBookmarkId, setBusyBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await socialApi.getBookmarks();
        setBookmarks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        toast.error('Failed to load bookmarks');
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  const filteredBookmarks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...bookmarks]
      .filter((bookmark) => {
        if (!query) return true;

        const title = getBookmarkTitle(bookmark).toLowerCase();
        const subtitle = getBookmarkSubtitle(bookmark).toLowerCase();
        return title.includes(query) || subtitle.includes(query);
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [bookmarks, searchQuery]);

  const lessonBookmarksCount = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.object_type === 'lesson').length,
    [bookmarks],
  );

  const courseBookmarksCount = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.object_type === 'course').length,
    [bookmarks],
  );

  const handleRemoveBookmark = async (bookmark: BookmarkRecord) => {
    setBusyBookmarkId(bookmark.id);

    try {
      if (bookmark.object_type === 'lesson') {
        await socialApi.unbookmarkLesson(bookmark.object_id);
      } else {
        await socialApi.unbookmarkCourse(bookmark.object_id);
      }

      setBookmarks((current) =>
        current.filter((item) => item.id !== bookmark.id),
      );
      toast.success('Bookmark removed');
    } catch (error: any) {
      console.error('Error removing bookmark:', error);
      toast.error(error?.message ?? 'Failed to remove bookmark');
    } finally {
      setBusyBookmarkId(null);
    }
  };

  const handleOpenBookmark = async (bookmark: BookmarkRecord) => {
    if (bookmark.object_type === 'course') {
      onNavigate('course-detail', {
        category: bookmark.course?.category || 'general',
        subcategory: bookmark.course?.subcategory || 'general',
        courseId: bookmark.object_id,
      });
      return;
    }

    try {
      const lesson = bookmark.lesson
        ? normalizeLessonForNavigation(bookmark.lesson)
        : normalizeLessonForNavigation(await lessonsApi.getById(bookmark.object_id));

      if (!bookmark.course) {
        throw new Error('Course not found for bookmarked lesson');
      }

      const course = bookmark.course;

      onNavigate('lesson', {
        lesson,
        course: {
          id: course.id,
          title: course.title,
          instructor: 'Instructor',
        },
      });
    } catch (error: any) {
      console.error('Error opening bookmarked lesson:', error);
      toast.error(error?.message ?? 'Failed to open bookmark');
    }
  };

  const visibleBookmarks = compact ? filteredBookmarks.slice(0, 5) : filteredBookmarks;

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-primary" />
              Bookmarks
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No bookmarks yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {visibleBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-2 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => void handleOpenBookmark(bookmark)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">
                          {getBookmarkTitle(bookmark)}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {getBookmarkSubtitle(bookmark)}
                        </p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}
                {bookmarks.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => onNavigate('bookmarks')}
                  >
                    View All {bookmarks.length} Bookmarks
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full page view
  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-primary" />
          My Bookmarks
        </h1>
        <p className="text-muted-foreground mt-2">
          Quick access to your saved lessons and courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bookmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bookmarks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Lesson Bookmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lessonBookmarksCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Course Bookmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courseBookmarksCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Bookmarks List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bookmark className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium mb-2">No bookmarks found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Start bookmarking lessons and courses for quick access'}
            </p>
            {!searchQuery && (
              <Button onClick={() => onNavigate('catalog')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              className="hover:shadow-md transition-all cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    {bookmark.object_type === 'course' ? (
                      <GraduationCap className="w-6 h-6 text-primary" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => void handleOpenBookmark(bookmark)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {getBookmarkTitle(bookmark)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {getBookmarkSubtitle(bookmark)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleRemoveBookmark(bookmark);
                        }}
                        disabled={busyBookmarkId === bookmark.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove bookmark"
                      >
                        {busyBookmarkId === bookmark.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-destructive" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {bookmark.object_type}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(bookmark.created_at)}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void handleOpenBookmark(bookmark)}
                    title="Open bookmarked item"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getBookmarkTitle(bookmark: BookmarkRecord): string {
  return bookmark.object_type === 'course'
    ? bookmark.course?.title || 'Saved course'
    : bookmark.lesson?.title || 'Saved lesson';
}

function getBookmarkSubtitle(bookmark: BookmarkRecord): string {
  if (bookmark.object_type === 'course') {
    return [bookmark.course?.category, bookmark.course?.subcategory]
      .filter(Boolean)
      .join(' • ');
  }

  return bookmark.course?.title || 'Course';
}

function normalizeLessonForNavigation(lesson: any) {
  return {
    ...lesson,
    type: lesson.kind || lesson.type || 'text',
    duration:
      lesson.duration ||
      (Number(lesson.duration_minutes) > 0 ? `${lesson.duration_minutes} min` : ''),
    locked: false,
  };
}

function formatTimeAgo(value: string): string {
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
