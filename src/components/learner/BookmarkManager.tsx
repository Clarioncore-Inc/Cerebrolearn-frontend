import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bookmark, 
  BookmarkPlus,
  BookmarkCheck,
  Search,
  Trash2,
  ChevronRight,
  BookOpen,
  Clock,
  Tag,
  Filter,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface BookmarkManagerProps {
  onNavigate: (page: string, data?: any) => void;
  currentLessonId?: string;
  currentCourseId?: string;
  compact?: boolean;
}

interface BookmarkItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  timestamp: Date;
  note?: string;
  tags: string[];
  category?: string;
}

export function BookmarkManager({ 
  onNavigate, 
  currentLessonId, 
  currentCourseId,
  compact = false 
}: BookmarkManagerProps) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCurrentBookmarked, setIsCurrentBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  useEffect(() => {
    checkCurrentBookmark();
  }, [currentLessonId, bookmarks]);

  useEffect(() => {
    filterBookmarks();
  }, [searchQuery, selectedTag, bookmarks]);

  const loadBookmarks = () => {
    try {
      const bookmarksKey = `bookmarks_${user?.id || 'guest'}`;
      const stored = localStorage.getItem(bookmarksKey);
      
      if (stored) {
        const parsedBookmarks = JSON.parse(stored).map((b: any) => ({
          ...b,
          timestamp: new Date(b.timestamp)
        }));
        setBookmarks(parsedBookmarks);
        setFilteredBookmarks(parsedBookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentBookmark = () => {
    if (currentLessonId) {
      const exists = bookmarks.some(b => b.lessonId === currentLessonId);
      setIsCurrentBookmarked(exists);
    }
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.note?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(b => b.tags.includes(selectedTag));
    }

    // Sort by most recent
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setFilteredBookmarks(filtered);
  };

  const addBookmark = (lessonId?: string, courseId?: string) => {
    if (!lessonId || !courseId) {
      toast.error('Cannot bookmark: Lesson information missing');
      return;
    }

    const newBookmark: BookmarkItem = {
      id: `bookmark-${Date.now()}`,
      lessonId,
      lessonTitle: `Lesson ${lessonId}`,
      courseId,
      courseTitle: `Course ${courseId}`,
      timestamp: new Date(),
      tags: ['important'],
      note: ''
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    
    // Save to localStorage
    const bookmarksKey = `bookmarks_${user?.id || 'guest'}`;
    localStorage.setItem(bookmarksKey, JSON.stringify(updatedBookmarks));
    
    toast.success('Bookmark added', {
      description: 'Lesson bookmarked for quick access'
    });
  };

  const removeBookmark = (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    
    // Save to localStorage
    const bookmarksKey = `bookmarks_${user?.id || 'guest'}`;
    localStorage.setItem(bookmarksKey, JSON.stringify(updatedBookmarks));
    
    toast.success('Bookmark removed');
  };

  const toggleCurrentBookmark = () => {
    if (!currentLessonId || !currentCourseId) return;

    if (isCurrentBookmarked) {
      const bookmark = bookmarks.find(b => b.lessonId === currentLessonId);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark(currentLessonId, currentCourseId);
    }
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    bookmarks.forEach(b => b.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  };

  // Compact view (for lesson player sidebar)
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-primary" />
              Bookmarks
            </CardTitle>
            {currentLessonId && (
              <Button
                variant={isCurrentBookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={toggleCurrentBookmark}
              >
                {isCurrentBookmarked ? (
                  <>
                    <BookmarkCheck className="w-3 h-3 mr-1" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3 h-3 mr-1" />
                    Save
                  </>
                )}
              </Button>
            )}
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
                {bookmarks.slice(0, 5).map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="p-2 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('lesson', { 
                      lessonId: bookmark.lessonId,
                      courseId: bookmark.courseId 
                    })}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">
                          {bookmark.lessonTitle}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {bookmark.courseTitle}
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
          Quick access to your saved lessons and important content
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
            <CardDescription>Unique Courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(bookmarks.map(b => b.courseId)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tags Used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getAllTags().length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTag === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag('all')}
              >
                All Tags
              </Button>
              {getAllTags().map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
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
              {searchQuery || selectedTag !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start bookmarking lessons for quick access'}
            </p>
            {!searchQuery && selectedTag === 'all' && (
              <Button onClick={() => onNavigate('catalog')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map(bookmark => (
            <Card
              key={bookmark.id}
              className="hover:shadow-md transition-all cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => onNavigate('lesson', { 
                      lessonId: bookmark.lessonId,
                      courseId: bookmark.courseId 
                    })}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {bookmark.lessonTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {bookmark.courseTitle}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    {bookmark.note && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {bookmark.note}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        {bookmark.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(bookmark.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigate('lesson', { 
                      lessonId: bookmark.lessonId,
                      courseId: bookmark.courseId 
                    })}
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

function formatTimeAgo(date: Date): string {
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
