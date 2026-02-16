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
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Sun,
  Plane,
  Coffee,
  AlertCircle,
  Copy,
  RotateCcw,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

interface AvailabilityManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

interface TimeSlot {
  id: string;
  day: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  sessionDuration: number; // minutes
  enabled: boolean;
}

interface BlockedTime {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'vacation' | 'conference' | 'personal' | 'sick' | 'other';
}

interface SpecialHours {
  id: string;
  date: string;
  slots: { startTime: string; endTime: string }[];
  note: string;
}

export function AdvancedAvailabilityManager({ onNavigate }: AvailabilityManagerProps) {
  const { user } = useAuth();
  
  // Load saved availability
  const [weeklySchedule, setWeeklySchedule] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem(`psychologist_schedule_${user?.id}`);
    if (saved) return JSON.parse(saved);
    
    // Default schedule (Mon-Fri, 9 AM - 5 PM)
    return [
      { id: '1', day: 1, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
      { id: '2', day: 2, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
      { id: '3', day: 3, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
      { id: '4', day: 4, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
      { id: '5', day: 5, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
    ];
  });

  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>(() => {
    const saved = localStorage.getItem(`psychologist_blocked_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [specialHours, setSpecialHours] = useState<SpecialHours[]>(() => {
    const saved = localStorage.getItem(`psychologist_special_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [vacationMode, setVacationMode] = useState(false);
  const [showAddBlockDialog, setShowAddBlockDialog] = useState(false);
  const [showSpecialHoursDialog, setShowSpecialHoursDialog] = useState(false);

  // New blocked time form
  const [newBlock, setNewBlock] = useState({
    title: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: 'vacation' as BlockedTime['type']
  });

  // New special hours form
  const [newSpecial, setNewSpecial] = useState({
    date: '',
    slots: [{ startTime: '09:00', endTime: '17:00' }],
    note: ''
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const saveSchedule = () => {
    localStorage.setItem(`psychologist_schedule_${user?.id}`, JSON.stringify(weeklySchedule));
    localStorage.setItem(`psychologist_blocked_${user?.id}`, JSON.stringify(blockedTimes));
    localStorage.setItem(`psychologist_special_${user?.id}`, JSON.stringify(specialHours));
    toast.success('Schedule saved successfully!');
  };

  const addTimeSlot = (day: number) => {
    const newSlot: TimeSlot = {
      id: `slot_${Date.now()}`,
      day,
      startTime: '09:00',
      endTime: '17:00',
      sessionDuration: 60,
      enabled: true
    };
    setWeeklySchedule([...weeklySchedule, newSlot]);
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setWeeklySchedule(weeklySchedule.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
  };

  const deleteTimeSlot = (id: string) => {
    setWeeklySchedule(weeklySchedule.filter(slot => slot.id !== id));
  };

  const copyDaySchedule = (fromDay: number, toDay: number) => {
    const fromSlots = weeklySchedule.filter(s => s.day === fromDay);
    const toSlots = fromSlots.map(slot => ({
      ...slot,
      id: `slot_${Date.now()}_${Math.random()}`,
      day: toDay
    }));
    
    // Remove existing slots for target day
    const filtered = weeklySchedule.filter(s => s.day !== toDay);
    setWeeklySchedule([...filtered, ...toSlots]);
    toast.success(`Copied ${dayNames[fromDay]} schedule to ${dayNames[toDay]}`);
  };

  const addBlockedTime = () => {
    if (!newBlock.title || !newBlock.startDate || !newBlock.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const blocked: BlockedTime = {
      id: `block_${Date.now()}`,
      ...newBlock
    };

    setBlockedTimes([...blockedTimes, blocked]);
    setShowAddBlockDialog(false);
    setNewBlock({ title: '', startDate: '', endDate: '', reason: '', type: 'vacation' });
    toast.success('Time blocked successfully!');
  };

  const deleteBlockedTime = (id: string) => {
    setBlockedTimes(blockedTimes.filter(b => b.id !== id));
    toast.success('Blocked time removed');
  };

  const addSpecialHours = () => {
    if (!newSpecial.date) {
      toast.error('Please select a date');
      return;
    }

    const special: SpecialHours = {
      id: `special_${Date.now()}`,
      ...newSpecial
    };

    setSpecialHours([...specialHours, special]);
    setShowSpecialHoursDialog(false);
    setNewSpecial({ date: '', slots: [{ startTime: '09:00', endTime: '17:00' }], note: '' });
    toast.success('Special hours added!');
  };

  const toggleVacationMode = () => {
    const newMode = !vacationMode;
    setVacationMode(newMode);
    
    if (newMode) {
      // Block all future dates when vacation mode is on
      const today = new Date().toISOString().split('T')[0];
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      
      const vacationBlock: BlockedTime = {
        id: 'vacation_mode',
        title: 'Vacation Mode - Not Accepting Appointments',
        startDate: today,
        endDate: oneYearLater.toISOString().split('T')[0],
        reason: 'Psychologist is on vacation',
        type: 'vacation'
      };
      
      setBlockedTimes([vacationBlock, ...blockedTimes.filter(b => b.id !== 'vacation_mode')]);
      toast.success('Vacation mode enabled - All bookings blocked');
    } else {
      setBlockedTimes(blockedTimes.filter(b => b.id !== 'vacation_mode'));
      toast.success('Vacation mode disabled - Accepting bookings');
    }
  };

  const exportSchedule = () => {
    const scheduleData = {
      weeklySchedule,
      blockedTimes,
      specialHours,
      exportedAt: new Date().toISOString(),
      psychologistId: user?.id
    };

    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Schedule exported successfully!');
  };

  const importSchedule = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.weeklySchedule) setWeeklySchedule(data.weeklySchedule);
        if (data.blockedTimes) setBlockedTimes(data.blockedTimes);
        if (data.specialHours) setSpecialHours(data.specialHours);
        
        toast.success('Schedule imported successfully!');
      } catch (error) {
        toast.error('Invalid schedule file');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    if (confirm('Reset to default schedule? This cannot be undone.')) {
      const defaultSchedule = [
        { id: '1', day: 1, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
        { id: '2', day: 2, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
        { id: '3', day: 3, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
        { id: '4', day: 4, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
        { id: '5', day: 5, startTime: '09:00', endTime: '17:00', sessionDuration: 60, enabled: true },
      ];
      setWeeklySchedule(defaultSchedule);
      toast.success('Reset to default schedule');
    }
  };

  // Calculate total available hours per week
  const weeklyHours = useMemo(() => {
    return weeklySchedule.reduce((total, slot) => {
      if (!slot.enabled) return total;
      const start = new Date(`2000-01-01T${slot.startTime}`);
      const end = new Date(`2000-01-01T${slot.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  }, [weeklySchedule]);

  // Calculate potential sessions per week
  const weeklySessionCapacity = useMemo(() => {
    return weeklySchedule.reduce((total, slot) => {
      if (!slot.enabled) return total;
      const start = new Date(`2000-01-01T${slot.startTime}`);
      const end = new Date(`2000-01-01T${slot.endTime}`);
      const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return total + Math.floor(minutes / slot.sessionDuration);
    }, 0);
  }, [weeklySchedule]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Advanced Availability Management</h1>
            <p className="text-muted-foreground">
              Manage your schedule, block times, and set special hours
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportSchedule}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importSchedule}
                className="hidden"
              />
            </label>
            <Button onClick={saveSchedule}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Weekly Hours</p>
                  <p className="text-3xl font-bold">{weeklyHours.toFixed(1)}</p>
                </div>
                <Clock className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Session Capacity</p>
                  <p className="text-3xl font-bold">{weeklySessionCapacity}</p>
                  <p className="text-xs text-muted-foreground">sessions/week</p>
                </div>
                <Calendar className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Blocked Days</p>
                  <p className="text-3xl font-bold">{blockedTimes.length}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vacation Mode */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${vacationMode ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-muted'}`}>
                  <Plane className={`h-6 w-6 ${vacationMode ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Vacation Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    {vacationMode 
                      ? 'All new bookings are blocked' 
                      : 'Toggle to stop accepting new appointments'}
                  </p>
                </div>
              </div>
              <Button
                variant={vacationMode ? 'destructive' : 'default'}
                onClick={toggleVacationMode}
              >
                {vacationMode ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Disable Vacation Mode
                  </>
                ) : (
                  <>
                    <Plane className="h-4 w-4 mr-2" />
                    Enable Vacation Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Times</TabsTrigger>
            <TabsTrigger value="special">Special Hours</TabsTrigger>
          </TabsList>

          {/* Weekly Schedule */}
          <TabsContent value="weekly" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recurring Weekly Schedule</h3>
              <Button variant="outline" onClick={resetToDefault} size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </div>

            <div className="space-y-4">
              {dayNames.map((dayName, dayIndex) => {
                const daySlots = weeklySchedule.filter(s => s.day === dayIndex);
                
                return (
                  <Card key={dayIndex}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{dayName}</CardTitle>
                        <div className="flex gap-2">
                          {dayIndex > 0 && (
                            <Select onValueChange={(value) => copyDaySchedule(parseInt(value), dayIndex)}>
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <Copy className="h-3 w-3 mr-1" />
                                <SelectValue placeholder="Copy from..." />
                              </SelectTrigger>
                              <SelectContent>
                                {dayNames.map((d, i) => i !== dayIndex && (
                                  <SelectItem key={i} value={i.toString()}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <Button size="sm" onClick={() => addTimeSlot(dayIndex)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Slot
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {daySlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No availability set for this day
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {daySlots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              <Checkbox
                                checked={slot.enabled}
                                onCheckedChange={(checked) => updateTimeSlot(slot.id, { enabled: !!checked })}
                              />
                              <div className="flex-1 grid grid-cols-3 gap-3">
                                <div>
                                  <Label className="text-xs">Start Time</Label>
                                  <Input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) => updateTimeSlot(slot.id, { startTime: e.target.value })}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">End Time</Label>
                                  <Input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) => updateTimeSlot(slot.id, { endTime: e.target.value })}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Session Duration</Label>
                                  <Select
                                    value={slot.sessionDuration.toString()}
                                    onValueChange={(v) => updateTimeSlot(slot.id, { sessionDuration: parseInt(v) })}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="30">30 min</SelectItem>
                                      <SelectItem value="45">45 min</SelectItem>
                                      <SelectItem value="60">60 min</SelectItem>
                                      <SelectItem value="90">90 min</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteTimeSlot(slot.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Blocked Times */}
          <TabsContent value="blocked" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Blocked Time Periods</h3>
              <Dialog open={showAddBlockDialog} onOpenChange={setShowAddBlockDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Block Time
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Block Time Period</DialogTitle>
                    <DialogDescription>
                      Block out time when you're unavailable for appointments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        placeholder="e.g., Summer Vacation, Conference"
                        value={newBlock.title}
                        onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={newBlock.startDate}
                          onChange={(e) => setNewBlock({ ...newBlock, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>End Date *</Label>
                        <Input
                          type="date"
                          value={newBlock.endDate}
                          onChange={(e) => setNewBlock({ ...newBlock, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={newBlock.type} onValueChange={(v: any) => setNewBlock({ ...newBlock, type: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reason (Optional)</Label>
                      <Textarea
                        placeholder="Optional note about this blocked time..."
                        value={newBlock.reason}
                        onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddBlockDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addBlockedTime}>
                      <Plus className="h-4 w-4 mr-2" />
                      Block Time
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {blockedTimes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Coffee className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No blocked time periods</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {blockedTimes.map((block) => {
                  const startDate = new Date(block.startDate);
                  const endDate = new Date(block.endDate);
                  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <Card key={block.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{block.title}</h4>
                              <Badge variant="outline" className="capitalize">
                                {block.type}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>
                                {startDate.toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })} - {endDate.toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                              <p>{days} day{days !== 1 ? 's' : ''}</p>
                              {block.reason && <p className="italic">{block.reason}</p>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteBlockedTime(block.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Special Hours */}
          <TabsContent value="special" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Special Hours (One-Time)</h3>
              <Dialog open={showSpecialHoursDialog} onOpenChange={setShowSpecialHoursDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Special Hours
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Special Hours</DialogTitle>
                    <DialogDescription>
                      Override regular schedule for a specific date
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={newSpecial.date}
                        onChange={(e) => setNewSpecial({ ...newSpecial, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Time Slots</Label>
                      <div className="space-y-2">
                        {newSpecial.slots.map((slot, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => {
                                const slots = [...newSpecial.slots];
                                slots[index].startTime = e.target.value;
                                setNewSpecial({ ...newSpecial, slots });
                              }}
                            />
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => {
                                const slots = [...newSpecial.slots];
                                slots[index].endTime = e.target.value;
                                setNewSpecial({ ...newSpecial, slots });
                              }}
                            />
                            {newSpecial.slots.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const slots = newSpecial.slots.filter((_, i) => i !== index);
                                  setNewSpecial({ ...newSpecial, slots });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setNewSpecial({
                            ...newSpecial,
                            slots: [...newSpecial.slots, { startTime: '09:00', endTime: '17:00' }]
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Slot
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Note (Optional)</Label>
                      <Textarea
                        placeholder="e.g., Extended hours for special event"
                        value={newSpecial.note}
                        onChange={(e) => setNewSpecial({ ...newSpecial, note: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSpecialHoursDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addSpecialHours}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Special Hours
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {specialHours.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sun className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No special hours set</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {specialHours.map((special) => (
                  <Card key={special.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            {new Date(special.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </h4>
                          <div className="space-y-1">
                            {special.slots.map((slot, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{slot.startTime} - {slot.endTime}</span>
                              </div>
                            ))}
                          </div>
                          {special.note && (
                            <p className="text-sm text-muted-foreground italic mt-2">{special.note}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSpecialHours(specialHours.filter(s => s.id !== special.id))}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Help Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Schedule Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Weekly Schedule:</strong> Set your regular recurring availability for each day of the week</p>
            <p>✅ <strong>Blocked Times:</strong> Block out vacation, conferences, or personal time</p>
            <p>✅ <strong>Special Hours:</strong> Override regular schedule for specific dates (holidays, events)</p>
            <p>✅ <strong>Copy Schedule:</strong> Quickly duplicate one day's schedule to another day</p>
            <p>✅ <strong>Vacation Mode:</strong> Instantly block all future bookings with one click</p>
            <p>✅ <strong>Export/Import:</strong> Backup your schedule or transfer to another account</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
