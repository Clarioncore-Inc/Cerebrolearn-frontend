"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Heart,
  Brain,
  Award,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Download,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface MyTherapyProgressProps {
  onNavigate: (page: string, data?: any) => void;
}

export function MyTherapyProgress({ onNavigate }: MyTherapyProgressProps) {
  const { user } = useAuth();

  const [myProgress, setMyProgress] = useState(() => {
    return JSON.parse(localStorage.getItem(`student_progress_${user?.id}`) || JSON.stringify({
      moodJournal: [],
      goals: [],
      milestones: [],
      reflections: []
    }));
  });

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddReflection, setShowAddReflection] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' });
  const [newReflection, setNewReflection] = useState({ title: '', content: '' });

  const appointments = useMemo(() => {
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    return bookings.filter((b: any) => b.studentId === user?.id);
  }, [user]);

  const saveProgress = () => {
    localStorage.setItem(`student_progress_${user?.id}`, JSON.stringify(myProgress));
  };

  const addGoal = () => {
    if (!newGoal.title) {
      toast.error('Please enter a goal title');
      return;
    }

    const goal = {
      id: `goal_${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      createdAt: new Date().toISOString(),
      completed: false,
      progress: 0
    };

    setMyProgress({
      ...myProgress,
      goals: [...myProgress.goals, goal]
    });
    saveProgress();
    setNewGoal({ title: '', description: '', targetDate: '' });
    setShowAddGoal(false);
    toast.success('Goal added!');
  };

  const toggleGoal = (goalId: string) => {
    setMyProgress({
      ...myProgress,
      goals: myProgress.goals.map((g: any) =>
        g.id === goalId ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date().toISOString() : null } : g
      )
    });
    saveProgress();
    toast.success('Goal updated!');
  };

  const deleteGoal = (goalId: string) => {
    if (confirm('Delete this goal?')) {
      setMyProgress({
        ...myProgress,
        goals: myProgress.goals.filter((g: any) => g.id !== goalId)
      });
      saveProgress();
      toast.success('Goal deleted');
    }
  };

  const addReflection = () => {
    if (!newReflection.title || !newReflection.content) {
      toast.error('Please fill in all fields');
      return;
    }

    const reflection = {
      id: `reflection_${Date.now()}`,
      title: newReflection.title,
      content: newReflection.content,
      date: new Date().toISOString()
    };

    setMyProgress({
      ...myProgress,
      reflections: [reflection, ...myProgress.reflections]
    });
    saveProgress();
    setNewReflection({ title: '', content: '' });
    setShowAddReflection(false);
    toast.success('Reflection saved!');
  };

  const addMilestone = () => {
    const title = prompt('What milestone did you achieve?');
    if (title) {
      const milestone = {
        id: `milestone_${Date.now()}`,
        title,
        date: new Date().toISOString()
      };

      setMyProgress({
        ...myProgress,
        milestones: [milestone, ...myProgress.milestones]
      });
      saveProgress();
      toast.success('Milestone added!');
    }
  };

  // Mood trend calculation
  const moodTrend = useMemo(() => {
    if (myProgress.moodJournal.length < 2) return 'stable';
    
    const recent = myProgress.moodJournal.slice(-5);
    const older = myProgress.moodJournal.slice(-10, -5);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum: number, m: any) => sum + m.rating, 0) / recent.length;
    const olderAvg = older.reduce((sum: number, m: any) => sum + m.rating, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  }, [myProgress.moodJournal]);

  const exportProgress = () => {
    const report = `
MY THERAPY PROGRESS REPORT
Generated: ${new Date().toLocaleString()}

====================================
MOOD JOURNAL (Last 30 entries)
====================================
${myProgress.moodJournal.slice(-30).reverse().map((m: any) => 
  `${new Date(m.date).toLocaleDateString()}: ${m.rating}/10 ${m.note ? `- ${m.note}` : ''}`
).join('\n')}

====================================
THERAPY GOALS
====================================
${myProgress.goals.map((g: any) => `
${g.completed ? '✅' : '⭕'} ${g.title}
   ${g.description}
   ${g.completed ? `Completed: ${new Date(g.completedAt).toLocaleDateString()}` : 'In Progress'}
`).join('\n')}

====================================
MILESTONES ACHIEVED
====================================
${myProgress.milestones.map((m: any) => 
  `🏆 ${m.title} - ${new Date(m.date).toLocaleDateString()}`
).join('\n')}

====================================
REFLECTIONS
====================================
${myProgress.reflections.map((r: any) => `
${r.title}
${new Date(r.date).toLocaleDateString()}
${r.content}
---
`).join('\n')}

====================================
THERAPY SESSIONS
====================================
Total Sessions: ${appointments.filter((a: any) => new Date(a.date) < new Date()).length}
Upcoming Sessions: ${appointments.filter((a: any) => new Date(a.date) >= new Date() && a.status !== 'cancelled').length}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-therapy-progress-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Progress report exported!');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate('therapy-dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Progress</h1>
              <p className="text-muted-foreground">
                Track your therapeutic journey and personal growth
              </p>
            </div>
            <Button onClick={exportProgress}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="mood" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mood">Mood Journal</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="reflections">Reflections</TabsTrigger>
          </TabsList>

          {/* Mood Journal Tab */}
          <TabsContent value="mood" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Mood Trend
                    </CardTitle>
                    <CardDescription>Track your emotional wellbeing over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {moodTrend === 'improving' && (
                      <>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">Improving</span>
                      </>
                    )}
                    {moodTrend === 'declining' && (
                      <>
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">Needs Attention</span>
                      </>
                    )}
                    {moodTrend === 'stable' && (
                      <>
                        <Minus className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">Stable</span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {myProgress.moodJournal.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Start tracking your mood</p>
                    <Button onClick={() => {
                      const mood = prompt('How are you feeling? (1-10)');
                      if (mood && !isNaN(parseInt(mood))) {
                        const moodValue = Math.max(1, Math.min(10, parseInt(mood)));
                        setMyProgress({
                          ...myProgress,
                          moodJournal: [...myProgress.moodJournal, {
                            id: `mood_${Date.now()}`,
                            date: new Date().toISOString(),
                            rating: moodValue,
                            note: prompt('Any notes?') || ''
                          }]
                        });
                        saveProgress();
                        toast.success('Mood logged!');
                      }
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log First Entry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myProgress.moodJournal.slice(-14).reverse().map((mood: any) => (
                      <div key={mood.id} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-24">
                          {new Date(mood.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-6 relative">
                          <div
                            className={`h-6 rounded-full transition-all ${
                              mood.rating >= 7 ? 'bg-green-500' :
                              mood.rating >= 4 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(mood.rating / 10) * 100}%`, minWidth: '30px' }}
                          >
                            <span className="absolute left-2 top-1 text-xs font-semibold text-white">
                              {mood.rating}/10
                            </span>
                          </div>
                        </div>
                        {mood.note && (
                          <span className="text-xs text-muted-foreground max-w-xs truncate">
                            {mood.note}
                          </span>
                        )}
                      </div>
                    ))}

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => {
                          const mood = prompt('How are you feeling today? (1-10)');
                          if (mood && !isNaN(parseInt(mood))) {
                            const moodValue = Math.max(1, Math.min(10, parseInt(mood)));
                            setMyProgress({
                              ...myProgress,
                              moodJournal: [...myProgress.moodJournal, {
                                id: `mood_${Date.now()}`,
                                date: new Date().toISOString(),
                                rating: moodValue,
                                note: prompt('Any notes about today?') || ''
                              }]
                            });
                            saveProgress();
                            toast.success('Mood logged!');
                          }
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Today's Mood
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {myProgress.moodJournal.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Average Mood</p>
                      <p className="text-3xl font-bold">
                        {(myProgress.moodJournal.reduce((sum: number, m: any) => sum + m.rating, 0) / myProgress.moodJournal.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Best Day</p>
                      <p className="text-3xl font-bold text-green-600">
                        {Math.max(...myProgress.moodJournal.map((m: any) => m.rating))}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Entries</p>
                      <p className="text-3xl font-bold">
                        {myProgress.moodJournal.length}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Start logging your mood to see statistics
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Therapy Goal</DialogTitle>
                    <DialogDescription>
                      Set a goal you want to work toward in therapy
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Goal Title *</Label>
                      <Input
                        placeholder="E.g., Manage anxiety in social situations"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your goal in more detail..."
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Target Date (Optional)</Label>
                      <Input
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addGoal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {myProgress.goals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No goals set yet</p>
                  <Button onClick={() => setShowAddGoal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myProgress.goals.map((goal: any) => (
                  <Card key={goal.id} className={goal.completed ? 'opacity-75' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleGoal(goal.id)}
                          className="mt-1"
                        >
                          {goal.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {goal.title}
                          </h4>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>Created {new Date(goal.createdAt).toLocaleDateString()}</span>
                            {goal.targetDate && (
                              <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                            )}
                            {goal.completed && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goals Completed</span>
                    <span className="font-semibold">
                      {myProgress.goals.filter((g: any) => g.completed).length} / {myProgress.goals.length}
                    </span>
                  </div>
                  {myProgress.goals.length > 0 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(myProgress.goals.filter((g: any) => g.completed).length / myProgress.goals.length) * 100}%`
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={addMilestone}>
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            {myProgress.milestones.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No milestones yet</p>
                  <Button onClick={addMilestone}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Milestone
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myProgress.milestones.map((milestone: any) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-yellow-600" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(milestone.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reflections Tab */}
          <TabsContent value="reflections" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={showAddReflection} onOpenChange={setShowAddReflection}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reflection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Reflection</DialogTitle>
                    <DialogDescription>
                      Reflect on your therapy journey
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        placeholder="E.g., Week 1 Reflections"
                        value={newReflection.title}
                        onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Your Thoughts *</Label>
                      <Textarea
                        placeholder="What did you learn? How do you feel? Any insights?"
                        value={newReflection.content}
                        onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                        rows={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddReflection(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addReflection}>
                      Save Reflection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {myProgress.reflections.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No reflections yet</p>
                  <Button onClick={() => setShowAddReflection(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Write Your First Reflection
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myProgress.reflections.map((reflection: any) => (
                  <Card key={reflection.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{reflection.title}</CardTitle>
                          <CardDescription>
                            {new Date(reflection.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </CardDescription>
                        </div>
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{reflection.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Label({ children, ...props }: any) {
  return <label className="text-sm font-medium" {...props}>{children}</label>;
}
