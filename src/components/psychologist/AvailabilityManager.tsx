import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calendar,
  Clock,
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface AvailabilityManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

const defaultDaySchedule: DaySchedule = {
  enabled: false,
  startTime: '09:00',
  endTime: '17:00',
};

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00'
];

export function AvailabilityManager({ onNavigate }: AvailabilityManagerProps) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { ...defaultDaySchedule, enabled: true },
    tuesday: { ...defaultDaySchedule, enabled: true },
    wednesday: { ...defaultDaySchedule, enabled: true },
    thursday: { ...defaultDaySchedule, enabled: true },
    friday: { ...defaultDaySchedule, enabled: true },
    saturday: { ...defaultDaySchedule },
    sunday: { ...defaultDaySchedule },
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load saved schedule from localStorage
    const savedSchedule = localStorage.getItem(`psychologist_schedule_${user.email}`);
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
  }, [user]);

  const handleToggleDay = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
    setHasChanges(true);
  };

  const handleUpdateTime = (day: keyof WeekSchedule, field: keyof DaySchedule, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSchedule = () => {
    if (!user) return;

    localStorage.setItem(`psychologist_schedule_${user.email}`, JSON.stringify(schedule));
    setHasChanges(false);
    toast.success('Availability schedule saved successfully');
  };

  const handleApplyToAll = (sourceDay: keyof WeekSchedule) => {
    const sourceSchedule = schedule[sourceDay];
    const newSchedule = { ...schedule };
    
    Object.keys(newSchedule).forEach((day) => {
      if (newSchedule[day as keyof WeekSchedule].enabled) {
        newSchedule[day as keyof WeekSchedule] = {
          ...sourceSchedule,
          enabled: true
        };
      }
    });

    setSchedule(newSchedule);
    setHasChanges(true);
    toast.success('Schedule applied to all enabled days');
  };

  const DayScheduleRow = ({ day, label }: { day: keyof WeekSchedule; label: string }) => {
    const daySchedule = schedule[day];

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3 min-w-[140px]">
              <Switch
                checked={daySchedule.enabled}
                onCheckedChange={() => handleToggleDay(day)}
              />
              <Label className="font-semibold text-base">{label}</Label>
            </div>

            {daySchedule.enabled ? (
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Start Time</Label>
                    <Select
                      value={daySchedule.startTime}
                      onValueChange={(value) => handleUpdateTime(day, 'startTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">End Time</Label>
                    <Select
                      value={daySchedule.endTime}
                      onValueChange={(value) => handleUpdateTime(day, 'endTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyToAll(day)}
                  >
                    Apply to all days
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {daySchedule.startTime} - {daySchedule.endTime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center">
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const calculateTotalHours = () => {
    let total = 0;
    Object.values(schedule).forEach(day => {
      if (day.enabled) {
        const start = parseFloat(day.startTime.replace(':', '.'));
        const end = parseFloat(day.endTime.replace(':', '.'));
        total += (end - start);
      }
    });
    return total.toFixed(1);
  };

  const enabledDays = Object.values(schedule).filter(day => day.enabled).length;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('psychologist-sessions')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Availability Schedule</h1>
        <p className="text-muted-foreground">
          Set your working hours and manage your availability
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Working Days
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enabledDays}</div>
            <p className="text-xs text-muted-foreground mt-1">days per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalHours()}</div>
            <p className="text-xs text-muted-foreground mt-1">hours per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasChanges ? (
                <Badge variant="outline" className="text-sm border-yellow-500 text-yellow-700">
                  Unsaved
                </Badge>
              ) : (
                <Badge variant="default" className="text-sm bg-green-500">
                  Saved
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">How availability works</p>
              <p className="text-sm text-muted-foreground">
                Students can only book sessions during your available hours. Toggle days on/off and set your preferred working hours. Changes take effect immediately after saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <div className="space-y-3 mb-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
        
        <DayScheduleRow day="monday" label="Monday" />
        <DayScheduleRow day="tuesday" label="Tuesday" />
        <DayScheduleRow day="wednesday" label="Wednesday" />
        <DayScheduleRow day="thursday" label="Thursday" />
        <DayScheduleRow day="friday" label="Friday" />
        <DayScheduleRow day="saturday" label="Saturday" />
        <DayScheduleRow day="sunday" label="Sunday" />
      </div>

      {/* Quick Templates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Apply common schedule templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const weekdaySchedule = { enabled: true, startTime: '09:00', endTime: '17:00' };
                setSchedule({
                  monday: weekdaySchedule,
                  tuesday: weekdaySchedule,
                  wednesday: weekdaySchedule,
                  thursday: weekdaySchedule,
                  friday: weekdaySchedule,
                  saturday: { ...defaultDaySchedule },
                  sunday: { ...defaultDaySchedule },
                });
                setHasChanges(true);
                toast.success('Weekday template applied');
              }}
            >
              Mon-Fri (9AM-5PM)
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const fullWeekSchedule = { enabled: true, startTime: '10:00', endTime: '18:00' };
                setSchedule({
                  monday: fullWeekSchedule,
                  tuesday: fullWeekSchedule,
                  wednesday: fullWeekSchedule,
                  thursday: fullWeekSchedule,
                  friday: fullWeekSchedule,
                  saturday: fullWeekSchedule,
                  sunday: { ...defaultDaySchedule },
                });
                setHasChanges(true);
                toast.success('6-day week template applied');
              }}
            >
              Mon-Sat (10AM-6PM)
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const flexSchedule = { enabled: true, startTime: '13:00', endTime: '21:00' };
                setSchedule({
                  monday: flexSchedule,
                  tuesday: flexSchedule,
                  wednesday: flexSchedule,
                  thursday: flexSchedule,
                  friday: flexSchedule,
                  saturday: { ...defaultDaySchedule },
                  sunday: { ...defaultDaySchedule },
                });
                setHasChanges(true);
                toast.success('Evening template applied');
              }}
            >
              Evenings (1PM-9PM)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            if (user) {
              const savedSchedule = localStorage.getItem(`psychologist_schedule_${user.email}`);
              if (savedSchedule) {
                setSchedule(JSON.parse(savedSchedule));
                setHasChanges(false);
                toast.info('Changes discarded');
              }
            }
          }}
          disabled={!hasChanges}
        >
          Discard Changes
        </Button>
        <Button
          onClick={handleSaveSchedule}
          disabled={!hasChanges}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Availability
        </Button>
      </div>
    </div>
  );
}
