import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentsApi, notesApi } from '../../utils/api-client';
import type { Note as NoteRecord } from '../../types/database';
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
  courseId?: string;
  courseName?: string;
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
  currentCourseTitle?: string;
  currentLessonId?: string;
  autoOpenCreate?: boolean;
}

export function CourseNotesSystem({ 
  onNavigate,
  currentCourseId,
  currentCourseTitle,
  autoOpenCreate = false,
  currentLessonId 
}: CourseNotesSystemProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>(currentCourseId || 'all');
  const [isCreating, setIsCreating] = useState(autoOpenCreate);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());

  // New note form state
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    color: 'blue'
  });

  const courseOptions = Array.from(
    new Map(
      notes
        .filter((note) => note.courseId)
        .map((note) => [note.courseId!, note.courseName || 'Untitled Course']),
    ).entries(),
  ).map(([id, name]) => ({ id, name }));

  const hasGeneralNotes = notes.some((note) => !note.courseId);

  const selectedCourseName =
    currentCourseId && selectedCourse === currentCourseId
      ? currentCourseTitle
      : courseOptions.find((course) => course.id === selectedCourse)?.name;

  const noteColors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' },
    { value: 'green', label: 'Green', class: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800' },
    { value: 'gray', label: 'Gray', class: 'bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800' }
  ];

  useEffect(() => {
    const loadNotes = async () => {
      if (!user) {
        setNotes([]);
        setFilteredNotes([]);
        return;
      }

      try {
        const loadedNotes = await notesApi.list();
        setNotes((loadedNotes || []).map(mapApiNote));
      } catch (error) {
        console.error('Error loading notes:', error);
        toast.error('Failed to load notes');
        setNotes([]);
      }
    };

    void loadNotes();
  }, [user]);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!user) {
        setEnrolledCourseIds(new Set());
        return;
      }

      try {
        const enrollments = await enrollmentsApi.getMy();
        setEnrolledCourseIds(
          new Set(
            (enrollments || [])
              .map(
                (enrollment: any) =>
                  enrollment?.course_id ?? enrollment?.courseId ?? enrollment?.course?.id,
              )
              .filter(Boolean)
              .map((id: string) => String(id)),
          ),
        );
      } catch (error) {
        console.error('Error loading enrollments:', error);
        setEnrolledCourseIds(new Set());
      }
    };

    void loadEnrollments();
  }, [user]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedCourse]);

  useEffect(() => {
    if (currentCourseId) {
      setSelectedCourse(currentCourseId);
    }
  }, [currentCourseId]);

  const targetCourseId =
    selectedCourse !== 'all' && selectedCourse !== 'general'
      ? selectedCourse
      : currentCourseId || null;

  const canCreateCourseNote = !targetCourseId || enrolledCourseIds.has(String(targetCourseId));

  useEffect(() => {
    if (autoOpenCreate && canCreateCourseNote) {
      setIsCreating(true);
    }
  }, [autoOpenCreate, canCreateCourseNote]);

  const filterNotes = () => {
    let filtered = [...notes];

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCourse === 'general') {
      filtered = filtered.filter(note => !note.courseId);
    } else if (selectedCourse !== 'all') {
      filtered = filtered.filter(note => note.courseId === selectedCourse);
    }

    // Sort: pinned first, then by timestamp
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setFilteredNotes(filtered);
  };

  const createNote = async () => {
    if (!user || !newNote.title.trim()) {
      toast.error('Please add a title for your note');
      return;
    }

    if (targetCourseId && !canCreateCourseNote) {
      toast.error('You need to enroll in this course before adding course notes');
      return;
    }

    try {
      const createdNote = await notesApi.create({
        title: newNote.title,
        content: newNote.content,
        course_id: targetCourseId,
        lesson_id: currentLessonId || null,
        tags: newNote.tags,
        color: newNote.color,
      });

      setNotes((current) => [mapApiNote(createdNote), ...current]);
      setNewNote({ title: '', content: '', tags: [], color: 'blue' });
      setIsCreating(false);
      toast.success('Note created successfully!');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;

    try {
      const updatedNote = await notesApi.update(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
        course_id: editingNote.courseId || null,
        lesson_id: editingNote.lessonId || null,
        tags: editingNote.tags,
        color: editingNote.color,
        is_pinned: editingNote.isPinned,
      });

      setNotes((current) =>
        current.map((note) =>
          note.id === editingNote.id ? mapApiNote(updatedNote) : note,
        ),
      );
      setEditingNote(null);
      toast.success('Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await notesApi.delete(noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const togglePin = async (noteId: string) => {
    const targetNote = notes.find((note) => note.id === noteId);
    if (!targetNote) return;

    try {
      const updatedNote = await notesApi.setPinned(noteId, !targetNote.isPinned);
      setNotes((current) =>
        current.map((note) =>
          note.id === noteId ? mapApiNote(updatedNote) : note,
        ),
      );
    } catch (error) {
      console.error('Error toggling note pin:', error);
      toast.error('Failed to update note pin');
    }
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

  const getColorClass = (color: string) => {
    return noteColors.find(c => c.value === color)?.class || noteColors[0].class;
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <StickyNote className="h-8 w-8 text-primary" />
            Course Notes
          </h2>
          <p className="text-muted-foreground mt-1">
            Take notes during lessons and organize your learning
          </p>
          {currentCourseTitle && (
            <Badge variant="secondary" className="mt-3">
              Writing notes for {currentCourseTitle}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportNotes} disabled={filteredNotes.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button
                disabled={!canCreateCourseNote}
                title={
                  !canCreateCourseNote
                    ? 'Enroll in this course to add course notes'
                    : 'Create a new note'
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new note to help you remember important concepts
                  {selectedCourseName ? ` in ${selectedCourseName}` : ''}
                </DialogDescription>
              </DialogHeader>
              {!canCreateCourseNote && selectedCourseName ? (
                <p className="text-sm text-muted-foreground">
                  Enroll in {selectedCourseName} before creating course notes.
                </p>
              ) : null}
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
                  <Button onClick={createNote} disabled={!canCreateCourseNote}>
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
      <div className="grid gap-4 md:grid-cols-3">
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
            <div className="text-3xl font-bold">{courseOptions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
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
                <SelectItem value="all">All Notes</SelectItem>
                {courseOptions.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
                {hasGeneralNotes && (
                  <SelectItem value="general">General Notes</SelectItem>
                )}
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
            {searchQuery || selectedCourse !== 'all'
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

function mapApiNote(note: NoteRecord): Note {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    courseId: note.course_id || undefined,
    courseName: note.course_title || undefined,
    lessonId: note.lesson_id || undefined,
    lessonName: note.lesson_title || undefined,
    tags: note.tags || [],
    timestamp: note.updated_at || note.created_at,
    isPinned: note.is_pinned,
    color: note.color || 'blue',
  };
}
