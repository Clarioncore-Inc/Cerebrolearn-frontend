"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Award,
  Calendar,
  Brain,
  Heart,
  Activity,
  FileText,
  Search,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ClientProgressTrackerProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ClientProgressTracker({ onNavigate }: ClientProgressTrackerProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Load data
  const sessionNotes = useMemo(() => {
    return JSON.parse(localStorage.getItem(`session_notes_${user?.id}`) || '[]');
  }, [user]);

  const appointments = useMemo(() => {
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    return bookings.filter((b: any) => 
      b.psychologistId === user?.id || b.psychologistName?.includes('Dr.')
    );
  }, [user]);

  // Aggregate client data
  const clientData = useMemo(() => {
    const clients: any = {};

    // Process session notes
    sessionNotes.forEach((note: any) => {
      if (!clients[note.studentId]) {
        clients[note.studentId] = {
          id: note.studentId,
          name: note.studentName,
          sessions: [],
          moodTrend: [],
          progressTrend: [],
          goals: new Set(),
          interventions: new Set(),
          riskHistory: [],
          lastSession: null,
          totalSessions: 0
        };
      }

      const client = clients[note.studentId];
      client.sessions.push(note);
      client.moodTrend.push({ date: note.sessionDate, value: note.moodRating });
      client.progressTrend.push({ date: note.sessionDate, value: note.progressRating });
      client.riskHistory.push({ date: note.sessionDate, level: note.riskAssessment });
      
      note.goals?.forEach((g: string) => client.goals.add(g));
      note.interventions?.forEach((i: string) => client.interventions.add(i));

      if (!client.lastSession || new Date(note.sessionDate) > new Date(client.lastSession)) {
        client.lastSession = note.sessionDate;
      }
    });

    // Process appointments for session count
    appointments.forEach((apt: any) => {
      if (clients[apt.studentId]) {
        clients[apt.studentId].totalSessions++;
      }
    });

    // Convert sets to arrays and sort sessions
    Object.values(clients).forEach((client: any) => {
      client.goals = Array.from(client.goals);
      client.interventions = Array.from(client.interventions);
      client.sessions.sort((a: any, b: any) => 
        new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
      );
      client.moodTrend.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      client.progressTrend.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    return Object.values(clients);
  }, [sessionNotes, appointments]);

  // Filter clients
  const filteredClients = useMemo(() => {
    if (!searchQuery) return clientData;
    return clientData.filter((client: any) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clientData, searchQuery]);

  // Calculate trend
  const calculateTrend = (data: any[]) => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3);
    const avg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
    const previous = data.slice(-6, -3);
    if (previous.length === 0) return 'stable';
    const prevAvg = previous.reduce((sum, item) => sum + item.value, 0) / previous.length;
    
    if (avg > prevAvg + 0.5) return 'improving';
    if (avg < prevAvg - 0.5) return 'declining';
    return 'stable';
  };

  // Get risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Client Progress Tracking</h1>
          <p className="text-muted-foreground">
            Monitor client progress, trends, and treatment outcomes
          </p>
        </div>

        {/* Overview Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Clients</p>
                  <p className="text-3xl font-bold">{clientData.length}</p>
                </div>
                <Activity className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold">{sessionNotes.length}</p>
                </div>
                <FileText className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Improving</p>
                  <p className="text-3xl font-bold text-green-600">
                    {clientData.filter((c: any) => calculateTrend(c.progressTrend) === 'improving').length}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">High Risk</p>
                  <p className="text-3xl font-bold text-red-600">
                    {clientData.filter((c: any) => 
                      c.sessions[0]?.riskAssessment === 'high' || 
                      c.sessions[0]?.riskAssessment === 'moderate'
                    ).length}
                  </p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Client List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Client List</CardTitle>
                <CardDescription>Click to view detailed progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {searchQuery ? 'No clients found' : 'No clients with session notes yet'}
                    </p>
                  ) : (
                    filteredClients.map((client: any) => {
                      const trend = calculateTrend(client.progressTrend);
                      const latestRisk = client.sessions[0]?.riskAssessment || 'none';

                      return (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className={`w-full p-3 border-2 rounded-lg text-left transition-all hover:border-primary ${
                            selectedClient?.id === client.id ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-semibold">{client.name}</div>
                            {trend === 'improving' && <TrendingUp className="h-4 w-4 text-green-600" />}
                            {trend === 'declining' && <TrendingDown className="h-4 w-4 text-red-600" />}
                            {trend === 'stable' && <Minus className="h-4 w-4 text-gray-600" />}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{client.sessions.length} sessions</span>
                            {latestRisk !== 'none' && (
                              <Badge variant={latestRisk === 'high' ? 'destructive' : 'outline'} className="text-xs">
                                {latestRisk}
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Details */}
          <div className="lg:col-span-2">
            {!selectedClient ? (
              <Card>
                <CardContent className="py-20 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a client to view their progress details
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Client Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedClient.name}</CardTitle>
                        <CardDescription>
                          {selectedClient.sessions.length} session{selectedClient.sessions.length !== 1 ? 's' : ''} documented
                          {selectedClient.lastSession && (
                            <> • Last session: {new Date(selectedClient.lastSession).toLocaleDateString()}</>
                          )}
                        </CardDescription>
                      </div>
                      {selectedClient.sessions[0]?.riskAssessment && 
                       selectedClient.sessions[0].riskAssessment !== 'none' && (
                        <Badge variant={selectedClient.sessions[0].riskAssessment === 'high' ? 'destructive' : 'default'}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {selectedClient.sessions[0].riskAssessment} risk
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Tabs defaultValue="trends">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="goals">Goals & Interventions</TabsTrigger>
                    <TabsTrigger value="history">Session History</TabsTrigger>
                  </TabsList>

                  {/* Trends Tab */}
                  <TabsContent value="trends" className="space-y-4">
                    {/* Mood Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          Mood Trend
                        </CardTitle>
                        <CardDescription>Self-reported mood ratings over time (1-10 scale)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.moodTrend.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No mood data available</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedClient.moodTrend.map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-24">
                                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <div className="flex-1 bg-muted rounded-full h-6 relative">
                                  <div
                                    className={`h-6 rounded-full transition-all flex items-center justify-end px-2 ${
                                      item.value >= 7 ? 'bg-green-500' :
                                      item.value >= 4 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${(item.value / 10) * 100}%`, minWidth: '30px' }}
                                  >
                                    <span className="text-xs font-semibold text-white">{item.value}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Trend:</span>
                                <div className="flex items-center gap-2">
                                  {calculateTrend(selectedClient.moodTrend) === 'improving' && (
                                    <>
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                      <span className="font-semibold text-green-600">Improving</span>
                                    </>
                                  )}
                                  {calculateTrend(selectedClient.moodTrend) === 'declining' && (
                                    <>
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                      <span className="font-semibold text-red-600">Declining</span>
                                    </>
                                  )}
                                  {calculateTrend(selectedClient.moodTrend) === 'stable' && (
                                    <>
                                      <Minus className="h-4 w-4 text-gray-600" />
                                      <span className="font-semibold text-gray-600">Stable</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-muted-foreground">Current:</span>
                                <span className="font-semibold">
                                  {selectedClient.moodTrend[selectedClient.moodTrend.length - 1]?.value}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Progress Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-500" />
                          Clinical Progress
                        </CardTitle>
                        <CardDescription>Therapist-assessed progress ratings (1-5 scale)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.progressTrend.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No progress data available</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedClient.progressTrend.map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-24">
                                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <div className="flex-1 bg-muted rounded-full h-6 relative">
                                  <div
                                    className="bg-gradient-to-r from-primary to-secondary h-6 rounded-full transition-all flex items-center justify-end px-2"
                                    style={{ width: `${(item.value / 5) * 100}%`, minWidth: '30px' }}
                                  >
                                    <span className="text-xs font-semibold text-white">{item.value}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Trend:</span>
                                <div className="flex items-center gap-2">
                                  {calculateTrend(selectedClient.progressTrend) === 'improving' && (
                                    <>
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                      <span className="font-semibold text-green-600">Improving</span>
                                    </>
                                  )}
                                  {calculateTrend(selectedClient.progressTrend) === 'declining' && (
                                    <>
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                      <span className="font-semibold text-red-600">Needs Attention</span>
                                    </>
                                  )}
                                  {calculateTrend(selectedClient.progressTrend) === 'stable' && (
                                    <>
                                      <Minus className="h-4 w-4 text-gray-600" />
                                      <span className="font-semibold text-gray-600">Stable</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-muted-foreground">Current:</span>
                                <span className="font-semibold">
                                  {selectedClient.progressTrend[selectedClient.progressTrend.length - 1]?.value}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Risk History */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          Risk Assessment History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.riskHistory.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No risk assessments</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedClient.riskHistory.slice(-5).reverse().map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <Badge
                                  variant={
                                    item.level === 'high' ? 'destructive' :
                                    item.level === 'moderate' ? 'default' :
                                    item.level === 'low' ? 'outline' : 'secondary'
                                  }
                                  className="capitalize"
                                >
                                  {item.level}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Goals & Interventions Tab */}
                  <TabsContent value="goals" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Treatment Goals
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.goals.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No goals documented</p>
                        ) : (
                          <ul className="space-y-2">
                            {selectedClient.goals.map((goal: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                                <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Interventions Used
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.interventions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No interventions documented</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedClient.interventions.map((intervention: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {intervention}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Session History Tab */}
                  <TabsContent value="history" className="space-y-3">
                    {selectedClient.sessions.map((session: any) => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold">{session.sessionType}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(session.sessionDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Mood: {session.moodRating}/10</Badge>
                              <Badge variant="outline">Progress: {session.progressRating}/5</Badge>
                            </div>
                          </div>
                          <div className="text-sm">
                            <strong>Focus:</strong> {session.chiefComplaint}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-2 w-full"
                            onClick={() => {
                              // Navigate to session note view
                              onNavigate('session-notes');
                            }}
                          >
                            View Full Note
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
