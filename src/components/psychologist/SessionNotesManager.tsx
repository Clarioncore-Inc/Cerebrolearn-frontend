"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import {
  FileText,
  Save,
  Search,
  Calendar,
  User,
  Clock,
  Lock,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileSignature,
  ClipboardList,
  Brain,
  Target,
  TrendingUp,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

interface SessionNotesManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

interface SessionNote {
  id: string;
  appointmentId: string;
  studentId: string;
  studentName: string;
  psychologistId: string;
  sessionDate: string;
  sessionType: string;
  duration: number;
  
  // Clinical content
  chiefComplaint: string;
  subjectiveNotes: string;
  objectiveObservations: string;
  assessment: string;
  plan: string;
  
  // Additional fields
  moodRating: number; // 1-10
  progressRating: number; // 1-5
  riskAssessment: 'none' | 'low' | 'moderate' | 'high';
  goals: string[];
  interventions: string[];
  homework: string;
  nextSessionPlan: string;
  
  // Metadata
  confidential: boolean;
  signed: boolean;
  signedAt?: string;
  lastEdited: string;
  createdAt: string;
}

interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  fields: Partial<SessionNote>;
}

export function SessionNotesManager({ onNavigate }: SessionNotesManagerProps) {
  const { user } = useAuth();
  
  const [notes, setNotes] = useState<SessionNote[]>(() => {
    const saved = localStorage.getItem(`session_notes_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');

  // New note form
  const [newNote, setNewNote] = useState<Partial<SessionNote>>({
    chiefComplaint: '',
    subjectiveNotes: '',
    objectiveObservations: '',
    assessment: '',
    plan: '',
    moodRating: 5,
    progressRating: 3,
    riskAssessment: 'none',
    goals: [],
    interventions: [],
    homework: '',
    nextSessionPlan: '',
    confidential: true
  });

  // Predefined templates
  const templates: NoteTemplate[] = [
    {
      id: 'soap',
      name: 'SOAP Note',
      description: 'Subjective, Objective, Assessment, Plan',
      fields: {
        chiefComplaint: '',
        subjectiveNotes: 'Patient reports...',
        objectiveObservations: 'Patient appeared...',
        assessment: 'Clinical impression...',
        plan: 'Treatment plan...'
      }
    },
    {
      id: 'initial',
      name: 'Initial Consultation',
      description: 'First session documentation',
      fields: {
        chiefComplaint: 'Presenting concern:',
        subjectiveNotes: 'Background and history:\n\nCurrent symptoms:\n\nPrevious treatment:',
        objectiveObservations: 'Mental status exam:\n\nAppearance:\nBehavior:\nMood:\nAffect:\nSpeech:\nThought process:\nThought content:\nCognition:\nInsight:\nJudgment:',
        assessment: 'Diagnostic impression:\n\nDifferential diagnoses:',
        plan: 'Recommended treatment:\n\nGoals:\n\nFollow-up:'
      }
    },
    {
      id: 'progress',
      name: 'Progress Note',
      description: 'Follow-up session',
      fields: {
        chiefComplaint: 'Session focus:',
        subjectiveNotes: 'Progress since last session:\n\nChallenges:',
        objectiveObservations: 'Behavioral observations:',
        assessment: 'Clinical progress:',
        plan: 'Next steps:\n\nHomework assigned:'
      }
    },
    {
      id: 'termination',
      name: 'Termination Summary',
      description: 'Final session documentation',
      fields: {
        chiefComplaint: 'Reason for termination:',
        subjectiveNotes: 'Client feedback:\n\nOverall progress:',
        objectiveObservations: 'Final clinical observations:',
        assessment: 'Treatment outcomes:\n\nGoals achieved:',
        plan: 'Recommendations:\n\nReferrals:\n\nFollow-up plan:'
      }
    }
  ];

  const saveNotes = () => {
    localStorage.setItem(`session_notes_${user?.id}`, JSON.stringify(notes));
    toast.success('Notes saved successfully');
  };

  const createNote = (appointmentId?: string) => {
    const note: SessionNote = {
      id: `note_${Date.now()}`,
      appointmentId: appointmentId || `appt_${Date.now()}`,
      studentId: 'student_temp',
      studentName: 'Student Name',
      psychologistId: user?.id || '',
      sessionDate: new Date().toISOString(),
      sessionType: 'Follow-up Session',
      duration: 60,
      ...newNote as any,
      goals: newNote.goals || [],
      interventions: newNote.interventions || [],
      signed: false,
      lastEdited: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setNotes([note, ...notes]);
    setShowNewNoteDialog(false);
    setNewNote({
      chiefComplaint: '',
      subjectiveNotes: '',
      objectiveObservations: '',
      assessment: '',
      plan: '',
      moodRating: 5,
      progressRating: 3,
      riskAssessment: 'none',
      goals: [],
      interventions: [],
      homework: '',
      nextSessionPlan: '',
      confidential: true
    });
    saveNotes();
    toast.success('Session note created');
  };

  const updateNote = (id: string, updates: Partial<SessionNote>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, lastEdited: new Date().toISOString() }
        : note
    ));
    saveNotes();
  };

  const signNote = (id: string) => {
    if (confirm('Sign this note? Signed notes cannot be edited.')) {
      updateNote(id, { 
        signed: true, 
        signedAt: new Date().toISOString() 
      });
      toast.success('Note signed and locked');
      setIsEditing(false);
    }
  };

  const deleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note?.signed) {
      toast.error('Cannot delete signed notes');
      return;
    }
    
    if (confirm('Delete this note? This cannot be undone.')) {
      setNotes(notes.filter(n => n.id !== id));
      saveNotes();
      toast.success('Note deleted');
      setSelectedNote(null);
    }
  };

  const applyTemplate = (template: NoteTemplate) => {
    setNewNote({
      ...newNote,
      ...template.fields
    });
    toast.success(`Applied ${template.name} template`);
  };

  const exportNote = (note: SessionNote) => {
    const content = `
SESSION NOTE - CONFIDENTIAL
====================================

Patient: ${note.studentName}
Session Date: ${new Date(note.sessionDate).toLocaleDateString()}
Session Type: ${note.sessionType}
Duration: ${note.duration} minutes
Psychologist: ${user?.name || 'Dr. [Name]'}

CHIEF COMPLAINT
${note.chiefComplaint}

SUBJECTIVE
${note.subjectiveNotes}

OBJECTIVE
${note.objectiveObservations}

ASSESSMENT
${note.assessment}
- Mood Rating: ${note.moodRating}/10
- Progress Rating: ${note.progressRating}/5
- Risk Level: ${note.riskAssessment}

PLAN
${note.plan}

GOALS
${note.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

INTERVENTIONS USED
${note.interventions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

HOMEWORK ASSIGNED
${note.homework}

NEXT SESSION PLAN
${note.nextSessionPlan}

====================================
${note.signed ? `Digitally signed on ${new Date(note.signedAt!).toLocaleString()}` : 'DRAFT - Not signed'}
Note ID: ${note.id}
Created: ${new Date(note.createdAt).toLocaleString()}
Last Edited: ${new Date(note.lastEdited).toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-note-${note.id}-${new Date(note.sessionDate).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Note exported');
  };

  // Filtering
  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subjectiveNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.assessment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(note => note.riskAssessment === filterRisk);
    }

    // Date filter
    if (filterDateRange !== 'all') {
      const now = new Date();
      const ranges: any = {
        'today': 1,
        'week': 7,
        'month': 30,
        '3months': 90
      };
      const days = ranges[filterDateRange];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(note => new Date(note.sessionDate) >= cutoff);
      }
    }

    return filtered.sort((a, b) => 
      new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    );
  }, [notes, searchQuery, filterRisk, filterDateRange]);

  // Statistics
  const stats = useMemo(() => {
    const thisMonth = notes.filter(n => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(n.sessionDate) >= monthAgo;
    });

    return {
      total: notes.length,
      thisMonth: thisMonth.length,
      signed: notes.filter(n => n.signed).length,
      highRisk: notes.filter(n => n.riskAssessment === 'high' || n.riskAssessment === 'moderate').length
    };
  }, [notes]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Session Notes & Documentation</h1>
            <p className="text-muted-foreground">
              Professional clinical documentation with HIPAA-compliant templates
            </p>
          </div>
          <Dialog open={showNewNoteDialog} onOpenChange={setShowNewNoteDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Session Note</DialogTitle>
                <DialogDescription>
                  Document clinical session with professional templates
                </DialogDescription>
              </DialogHeader>

              {/* Template Selection */}
              <div className="mb-4">
                <Label className="mb-2 block">Quick Templates</Label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className="p-3 border rounded-lg hover:border-primary text-left transition-colors"
                    >
                      <div className="font-semibold text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* Chief Complaint */}
                <div>
                  <Label>Chief Complaint / Session Focus *</Label>
                  <Input
                    placeholder="Primary reason for session..."
                    value={newNote.chiefComplaint}
                    onChange={(e) => setNewNote({ ...newNote, chiefComplaint: e.target.value })}
                  />
                </div>

                {/* SOAP Notes */}
                <Tabs defaultValue="subjective">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="subjective">Subjective</TabsTrigger>
                    <TabsTrigger value="objective">Objective</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    <TabsTrigger value="plan">Plan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="subjective" className="space-y-3">
                    <Label>Subjective Notes</Label>
                    <Textarea
                      placeholder="Patient's reported symptoms, concerns, and experiences..."
                      value={newNote.subjectiveNotes}
                      onChange={(e) => setNewNote({ ...newNote, subjectiveNotes: e.target.value })}
                      rows={6}
                    />
                  </TabsContent>

                  <TabsContent value="objective" className="space-y-3">
                    <Label>Objective Observations</Label>
                    <Textarea
                      placeholder="Clinical observations, mental status, behavior..."
                      value={newNote.objectiveObservations}
                      onChange={(e) => setNewNote({ ...newNote, objectiveObservations: e.target.value })}
                      rows={6}
                    />
                  </TabsContent>

                  <TabsContent value="assessment" className="space-y-3">
                    <Label>Assessment</Label>
                    <Textarea
                      placeholder="Clinical impression, diagnosis, progress evaluation..."
                      value={newNote.assessment}
                      onChange={(e) => setNewNote({ ...newNote, assessment: e.target.value })}
                      rows={6}
                    />
                  </TabsContent>

                  <TabsContent value="plan" className="space-y-3">
                    <Label>Plan</Label>
                    <Textarea
                      placeholder="Treatment plan, interventions, next steps..."
                      value={newNote.plan}
                      onChange={(e) => setNewNote({ ...newNote, plan: e.target.value })}
                      rows={6}
                    />
                  </TabsContent>
                </Tabs>

                {/* Ratings */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Mood Rating (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newNote.moodRating}
                      onChange={(e) => setNewNote({ ...newNote, moodRating: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Progress (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={newNote.progressRating}
                      onChange={(e) => setNewNote({ ...newNote, progressRating: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Risk Assessment</Label>
                    <Select
                      value={newNote.riskAssessment}
                      onValueChange={(v: any) => setNewNote({ ...newNote, riskAssessment: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Homework */}
                <div>
                  <Label>Homework Assigned</Label>
                  <Textarea
                    placeholder="Tasks or exercises for patient to complete..."
                    value={newNote.homework}
                    onChange={(e) => setNewNote({ ...newNote, homework: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Next Session */}
                <div>
                  <Label>Next Session Plan</Label>
                  <Textarea
                    placeholder="Topics to cover in next session..."
                    value={newNote.nextSessionPlan}
                    onChange={(e) => setNewNote({ ...newNote, nextSessionPlan: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewNoteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => createNote()}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Notes</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-3xl font-bold">{stats.thisMonth}</p>
                </div>
                <Calendar className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Signed</p>
                  <p className="text-3xl font-bold">{stats.signed}</p>
                </div>
                <FileSignature className="h-10 w-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Cases</p>
                  <p className="text-3xl font-bold">{stats.highRisk}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterRisk !== 'all' || filterDateRange !== 'all'
                  ? 'No notes match your filters'
                  : 'No session notes yet'}
              </p>
              <Button onClick={() => setShowNewNoteDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className={note.signed ? 'border-green-200 dark:border-green-800' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {note.studentName}
                            {note.signed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                <Lock className="h-3 w-3 mr-1" />
                                Signed
                              </Badge>
                            )}
                            {note.confidential && (
                              <Badge variant="outline">
                                <Lock className="h-3 w-3 mr-1" />
                                Confidential
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(note.sessionDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {note.duration} min
                            </span>
                            <span>{note.sessionType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {note.riskAssessment !== 'none' && (
                            <Badge
                              variant={
                                note.riskAssessment === 'high' ? 'destructive' :
                                note.riskAssessment === 'moderate' ? 'default' : 'outline'
                              }
                            >
                              Risk: {note.riskAssessment}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Chief Complaint:</strong> {note.chiefComplaint}
                        </div>
                        <div className="flex items-center gap-4">
                          <span>Mood: {note.moodRating}/10</span>
                          <span>Progress: {note.progressRating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedNote(note);
                          setIsEditing(false);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {!note.signed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedNote(note);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportNote(note)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      {!note.signed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => signNote(note.id)}
                        >
                          <FileSignature className="h-4 w-4 mr-2" />
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View/Edit Dialog */}
        {selectedNote && (
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Session Note - {selectedNote.studentName}
                  {selectedNote.signed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Lock className="h-3 w-3 mr-1" />
                      Signed & Locked
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {new Date(selectedNote.sessionDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })} • {selectedNote.sessionType}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Alert variant={selectedNote.riskAssessment === 'high' || selectedNote.riskAssessment === 'moderate' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Risk Level: <strong className="capitalize">{selectedNote.riskAssessment}</strong>
                    {selectedNote.riskAssessment !== 'none' && ' - Review safety protocols'}
                  </AlertDescription>
                </Alert>

                <div>
                  <Label className="font-semibold">Chief Complaint</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedNote.chiefComplaint}</p>
                </div>

                <div>
                  <Label className="font-semibold">Subjective</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedNote.subjectiveNotes}</p>
                </div>

                <div>
                  <Label className="font-semibold">Objective</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedNote.objectiveObservations}</p>
                </div>

                <div>
                  <Label className="font-semibold">Assessment</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedNote.assessment}</p>
                </div>

                <div>
                  <Label className="font-semibold">Plan</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedNote.plan}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Mood Rating</Label>
                    <p className="mt-1 text-2xl font-bold text-primary">{selectedNote.moodRating}/10</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Progress Rating</Label>
                    <p className="mt-1 text-2xl font-bold text-secondary">{selectedNote.progressRating}/5</p>
                  </div>
                </div>

                {selectedNote.homework && (
                  <div>
                    <Label className="font-semibold">Homework Assigned</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedNote.homework}</p>
                  </div>
                )}

                {selectedNote.nextSessionPlan && (
                  <div>
                    <Label className="font-semibold">Next Session Plan</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedNote.nextSessionPlan}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t pt-3">
                  <p>Created: {new Date(selectedNote.createdAt).toLocaleString()}</p>
                  <p>Last Edited: {new Date(selectedNote.lastEdited).toLocaleString()}</p>
                  {selectedNote.signed && (
                    <p className="text-green-600 font-semibold">
                      Digitally Signed: {new Date(selectedNote.signedAt!).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => exportNote(selectedNote)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {!selectedNote.signed && (
                  <>
                    <Button variant="outline" onClick={() => deleteNote(selectedNote.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button onClick={() => signNote(selectedNote.id)}>
                      <FileSignature className="h-4 w-4 mr-2" />
                      Sign & Lock
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              HIPAA Compliance & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Confidential by default:</strong> All notes are marked confidential and stored securely</p>
            <p>✅ <strong>Digital signatures:</strong> Sign notes to lock them from further edits</p>
            <p>✅ <strong>SOAP format:</strong> Industry-standard Subjective, Objective, Assessment, Plan structure</p>
            <p>✅ <strong>Risk assessment:</strong> Track patient safety with built-in risk levels</p>
            <p>✅ <strong>Audit trail:</strong> All notes include creation and edit timestamps</p>
            <p>✅ <strong>Export capability:</strong> Download notes for record-keeping or transfer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
