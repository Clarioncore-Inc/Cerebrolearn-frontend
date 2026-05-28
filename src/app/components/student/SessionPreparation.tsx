"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  Target,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  Download,
  Video,
  ArrowLeft,
  Send
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SessionPreparationProps {
  onNavigate: (page: string, data?: any) => void;
  appointment?: any;
}

export function SessionPreparation({ onNavigate, appointment }: SessionPreparationProps) {
  const [preparation, setPreparation] = useState(() => {
    // Load existing preparation if any
    const saved = localStorage.getItem(`session_prep_${appointment?.id}`);
    return saved ? JSON.parse(saved) : {
      topicsToDiscuss: '',
      questions: '',
      recentChanges: '',
      goalProgress: '',
      homework: '',
      concernsOrFears: '',
      checklist: {
        reviewedLastSession: false,
        preparedQuestions: false,
        completedHomework: false,
        updatedMoodJournal: false,
        checkedTechSetup: false
      }
    };
  });

  const handleSave = () => {
    localStorage.setItem(`session_prep_${appointment?.id}`, JSON.stringify(preparation));
    toast.success('Preparation saved!');
  };

  const handleSubmit = () => {
    handleSave();
    toast.success('Preparation submitted to therapist!');
    // In a real app, this would send to the backend
    onNavigate('therapy-dashboard');
  };

  const checklistItems = [
    { key: 'reviewedLastSession', label: 'Reviewed notes from last session' },
    { key: 'preparedQuestions', label: 'Prepared questions or topics to discuss' },
    { key: 'completedHomework', label: 'Completed any assigned homework' },
    { key: 'updatedMoodJournal', label: 'Updated mood journal for the week' },
    { key: 'checkedTechSetup', label: 'Checked video/audio setup (for online sessions)' }
  ];

  const completedItems = Object.values(preparation.checklist).filter(Boolean).length;
  const totalItems = checklistItems.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  if (!appointment) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No appointment selected</p>
            <Button onClick={() => onNavigate('therapy-dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sessionDate = new Date(appointment.date);
  const now = new Date();
  const hoursUntil = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isToday = sessionDate.toDateString() === now.toDateString();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => onNavigate('therapy-dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Session Preparation</h1>
          <p className="text-muted-foreground">
            Prepare for your upcoming session with {appointment.psychologistName}
          </p>
        </div>

        {/* Session Info */}
        <Card className="mb-6 border-2 border-primary">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{appointment.psychologistName}</h3>
                <p className="text-sm text-muted-foreground">{appointment.sessionType}</p>
              </div>
              {isToday && (
                <Badge className="bg-green-600">Today</Badge>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {sessionDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span>Online Session</span>
              </div>
            </div>

            {hoursUntil <= 24 && hoursUntil > 0 && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Session starts in {Math.floor(hoursUntil)} hour{Math.floor(hoursUntil) !== 1 ? 's' : ''}. Make sure you're ready!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Preparation Progress</CardTitle>
            <CardDescription>
              {completedItems} of {totalItems} items completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {progressPercentage === 100 
                ? '✅ Fully prepared for your session!' 
                : 'Complete the checklist below to be fully prepared'}
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="preparation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preparation">Preparation</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Preparation Tab */}
          <TabsContent value="preparation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Topics to Discuss
                </CardTitle>
                <CardDescription>
                  What would you like to talk about in this session?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="E.g., Recent stressful events, progress on goals, new challenges..."
                  value={preparation.topicsToDiscuss}
                  onChange={(e) => setPreparation({ 
                    ...preparation, 
                    topicsToDiscuss: e.target.value 
                  })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Questions for Your Therapist
                </CardTitle>
                <CardDescription>
                  Any specific questions you want to ask?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="List any questions or clarifications you need..."
                  value={preparation.questions}
                  onChange={(e) => setPreparation({ 
                    ...preparation, 
                    questions: e.target.value 
                  })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Progress & Updates
                </CardTitle>
                <CardDescription>
                  How have you progressed on your therapy goals?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe any progress, setbacks, or insights..."
                  value={preparation.goalProgress}
                  onChange={(e) => setPreparation({ 
                    ...preparation, 
                    goalProgress: e.target.value 
                  })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Homework Review
                </CardTitle>
                <CardDescription>
                  What did you learn from your homework assignments?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Reflect on completed homework, challenges faced, insights gained..."
                  value={preparation.homework}
                  onChange={(e) => setPreparation({ 
                    ...preparation, 
                    homework: e.target.value 
                  })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Recent Changes & Life Events
                </CardTitle>
                <CardDescription>
                  Any significant changes since your last session?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="New medications, life changes, major events, symptoms..."
                  value={preparation.recentChanges}
                  onChange={(e) => setPreparation({ 
                    ...preparation, 
                    recentChanges: e.target.value 
                  })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Concerns or Fears
                </CardTitle>
                <CardDescription>
                  Anything making you anxious about therapy?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="It's okay to share concerns about therapy itself..."
                  value={preparation.concernsOrFears}
                  onChange={(e) => setPreparation({ 
                    ...preparation, 
                    concernsOrFears: e.target.value 
                  })}
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSave} variant="outline" className="flex-1">
                Save for Later
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit to Therapist
              </Button>
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Session Checklist</CardTitle>
                <CardDescription>
                  Complete these items before your session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {checklistItems.map((item) => (
                  <div key={item.key} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Checkbox
                      id={item.key}
                      checked={preparation.checklist[item.key]}
                      onCheckedChange={(checked) => setPreparation({
                        ...preparation,
                        checklist: {
                          ...preparation.checklist,
                          [item.key]: !!checked
                        }
                      })}
                    />
                    <Label htmlFor={item.key} className="cursor-pointer flex-1">
                      {item.label}
                    </Label>
                    {preparation.checklist[item.key] && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Button onClick={handleSave} className="w-full">
                    Save Progress
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Helpful Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Find a quiet, private space for your session</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Test your camera and microphone 10 minutes before</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Have water and tissues nearby</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Turn off notifications on your devices</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p>Use headphones for better audio privacy</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Session Resources</CardTitle>
                <CardDescription>
                  Download these helpful materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full p-4 border-2 rounded-lg hover:border-primary transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Session Preparation Worksheet</p>
                        <p className="text-sm text-muted-foreground">Structured guide for session prep</p>
                      </div>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>

                <button className="w-full p-4 border-2 rounded-lg hover:border-primary transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Mood Tracking Template</p>
                        <p className="text-sm text-muted-foreground">Weekly mood journal</p>
                      </div>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>

                <button className="w-full p-4 border-2 rounded-lg hover:border-primary transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">What to Expect in Therapy</p>
                        <p className="text-sm text-muted-foreground">Guide for first-time clients</p>
                      </div>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>

                <button className="w-full p-4 border-2 rounded-lg hover:border-primary transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Grounding Techniques</p>
                        <p className="text-sm text-muted-foreground">Manage anxiety before sessions</p>
                      </div>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Reading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">How to Get the Most Out of Therapy</p>
                  <p className="text-xs text-muted-foreground">Tips for effective therapy sessions</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">Understanding Your Mental Health</p>
                  <p className="text-xs text-muted-foreground">Educational resources</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">Between Sessions: Self-Care Activities</p>
                  <p className="text-xs text-muted-foreground">Maintain progress outside therapy</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
