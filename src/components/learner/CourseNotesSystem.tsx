import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit,
  BookOpen,
  Tag,
  Calendar,
  Download,
  Share2,
  Pin,
  StickyNote,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  lessonId?: string;
  lessonName?: string;
  tags: string[];
  timestamp: string;
  isPinned: boolean;
  color: string;
}

interface CourseNotesSystemProps {
  onNavigate?: (page: string, data?: any) => void;
  currentCourseId?: string;
  currentLessonId?: string;
}

export function CourseNotesSystem({ 
  onNavigate,
  currentCourseId,
  currentLessonId 
}: CourseNotesSystemProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // New note form state
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    color: 'blue'
  });

  const noteColors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' },
    { value: 'green', label: 'Green', class: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800' },
    { value: 'gray', label: 'Gray', class: 'bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800' }
  ];

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedCourse, selectedTag]);

  const loadNotes = () => {
    if (!user) return;

    const notesKey = `course_notes_${user.id}`;
    const stored = localStorage.getItem(notesKey);
    
    if (stored) {
      const loadedNotes = JSON.parse(stored);
      setNotes(loadedNotes);
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    if (!user) return;

    const notesKey = `course_notes_${user.id}`;
    localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const filterNotes = () => {
    let filtered = [...notes];

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(note => note.courseId === selectedCourse);
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }

    // Sort: pinned first, then by timestamp
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setFilteredNotes(filtered);
  };

  const createNote = () => {
    if (!user || !newNote.title.trim()) {
      toast.error('Please add a title for your note');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      courseId: currentCourseId || 'general',
      courseName: currentCourseId || 'General Notes',
      lessonId: currentLessonId,
      lessonName: currentLessonId ? `Lesson ${currentLessonId}` : undefined,
      tags: newNote.tags,
      timestamp: new Date().toISOString(),
      isPinned: false,
      color: newNote.color
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);

    // Reset form
    setNewNote({ title: '', content: '', tags: [], color: 'blue' });
    setIsCreating(false);
    
    toast.success('Note created successfully!');
  };

  const updateNote = () => {
    if (!editingNote) return;

    const updatedNotes = notes.map(note =>
      note.id === editingNote.id ? editingNote : note
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
    toast.success('Note updated successfully!');
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
    toast.success('Note deleted');
  };

  const togglePin = (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    );
    saveNotes(updatedNotes);
  };

  const addTag = (noteId: string, tag: string) => {
    if (!tag.trim()) return;

    const updatedNotes = notes.map(note =>
      note.id === noteId && !note.tags.includes(tag)
        ? { ...note, tags: [...note.tags, tag] }
        : note
    );
    saveNotes(updatedNotes);
  };

  const removeTag = (noteId: string, tagToRemove: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) }
        : note
    );
    saveNotes(updatedNotes);
  };

  const exportNotes = () => {
    const data = JSON.stringify(filteredNotes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `course-notes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Notes exported successfully!');
  };

  // Get unique courses and tags
  const uniqueCourses = Array.from(new Set(notes.map(note => note.courseId)));
  const uniqueTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const getColorClass = (color: string) => {
    return noteColors.find(c => c.value === color)?.class || noteColors[0].class;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <StickyNote className="h-8 w-8 text-primary" />
            Course Notes
          </h2>
          <p className="text-muted-foreground mt-1">
            Take notes during lessons and organize your learning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportNotes} disabled={filteredNotes.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new note to help you remember important concepts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Write your notes here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={8}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex gap-2">
                    {noteColors.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewNote({ ...newNote, color: color.value })}
                        className={`w-10 h-10 rounded-lg border-2 ${color.class} ${
                          newNote.color === color.value ? 'ring-2 ring-primary' : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNote}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notes.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pinned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {notes.filter(n => n.isPinned).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueCourses.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueTags.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {uniqueCourses.map(courseId => (
                  <SelectItem key={courseId} value={courseId}>
                    {notes.find(n => n.courseId === courseId)?.courseName || courseId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {uniqueTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => (
            <Card
              key={note.id}
              className={`border-2 ${getColorClass(note.color)} relative group hover:shadow-lg transition-all`}
            >
              {note.isPinned && (
                <Pin className="absolute top-3 right-3 h-4 w-4 text-primary fill-primary" />
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2 pr-6">
                    {note.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(note.timestamp).toLocaleDateString()}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {note.content || 'No content'}
                </p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePin(note.id)}
                    className="h-8"
                  >
                    <Pin className={`h-3 w-3 ${note.isPinned ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingNote(note)}
                    className="h-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNote(note.id)}
                    className="h-8 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-2">
          <StickyNote className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCourse !== 'all' || selectedTag !== 'all'
              ? 'No notes match your filters'
              : 'Start taking notes to remember important concepts'}
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Note
          </Button>
        </Card>
      )}

      {/* Edit Note Dialog */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  rows={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex gap-2">
                  {noteColors.map(color => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setEditingNote({ ...editingNote, color: color.value })
                      }
                      className={`w-10 h-10 rounded-lg border-2 ${color.class} ${
                        editingNote.color === color.value ? 'ring-2 ring-primary' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button onClick={updateNote}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
