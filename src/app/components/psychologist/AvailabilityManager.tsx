import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { psychologistApi } from '../../utils/api-client';

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

type AvailabilityDayKey = keyof WeekSchedule;

const defaultDaySchedule: DaySchedule = {
  enabled: false,
  startTime: '09:00',
  endTime: '17:00',
};

const DEFAULT_WEEK_SCHEDULE: WeekSchedule = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { ...defaultDaySchedule },
  sunday: { ...defaultDaySchedule },
};

const DAY_KEYS: AvailabilityDayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const cloneWeekSchedule = (value: WeekSchedule): WeekSchedule =>
  JSON.parse(JSON.stringify(value));

const toApiSchedule = (value: WeekSchedule) =>
  DAY_KEYS.reduce(
    (acc, day) => {
      acc[day] = {
        enabled: value[day].enabled,
        start: value[day].startTime,
        end: value[day].endTime,
      };
      return acc;
    },
    {} as Record<AvailabilityDayKey, { enabled: boolean; start: string; end: string }>,
  );

const fromApiSchedule = (
  scheduleData?: Partial<Record<AvailabilityDayKey, { enabled?: boolean; start?: string; end?: string }>>,
): WeekSchedule => {
  const nextSchedule = cloneWeekSchedule(DEFAULT_WEEK_SCHEDULE);

  DAY_KEYS.forEach((day) => {
    const apiDay = scheduleData?.[day];
    if (apiDay) {
      nextSchedule[day] = {
        ...nextSchedule[day],
        enabled: apiDay.enabled ?? nextSchedule[day].enabled,
        startTime: apiDay.start ?? nextSchedule[day].startTime,
        endTime: apiDay.end ?? nextSchedule[day].endTime,
      };
    }
  });

  return nextSchedule;
};

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00'
];

const isEndTimeNotAfterStartTime = (startTime: string, endTime: string) => endTime <= startTime;

const formatDayLabel = (day: AvailabilityDayKey) => `${day.charAt(0).toUpperCase()}${day.slice(1)}`;

const getInvalidScheduleDay = (value: WeekSchedule) =>
  DAY_KEYS.find(
    (day) => value[day].enabled && isEndTimeNotAfterStartTime(value[day].startTime, value[day].endTime),
  );

export function AvailabilityManager({ onNavigate }: AvailabilityManagerProps) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<WeekSchedule>(cloneWeekSchedule(DEFAULT_WEEK_SCHEDULE));
  const [savedSchedule, setSavedSchedule] = useState<WeekSchedule>(cloneWeekSchedule(DEFAULT_WEEK_SCHEDULE));
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasAvailabilityRecord, setHasAvailabilityRecord] = useState(false);

  const loadAvailability = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await psychologistApi.getAvailability(user.id);
      const nextSchedule = fromApiSchedule(
        response.schedule as Partial<Record<AvailabilityDayKey, { enabled?: boolean; start?: string; end?: string }>>,
      );

      setSchedule(nextSchedule);
      setSavedSchedule(cloneWeekSchedule(nextSchedule));
      setHasAvailabilityRecord(true);
      setHasChanges(false);
    } catch (error: any) {
      const availabilityErrorMessage = String(error?.message || '').toLowerCase();
      const isNotFound =
        availabilityErrorMessage.includes('404') ||
        availabilityErrorMessage.includes('no availability') ||
        availabilityErrorMessage.includes('availability schedule');

      if (!isNotFound) {
        console.error('Error loading availability:', error);
        toast.error(error?.message ?? 'Failed to load availability');
      }

      const fallbackSchedule = cloneWeekSchedule(DEFAULT_WEEK_SCHEDULE);
      setSchedule(fallbackSchedule);
      setSavedSchedule(cloneWeekSchedule(fallbackSchedule));
      setHasAvailabilityRecord(false);
      setHasChanges(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [loadAvailability, user]);

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
    const nextDaySchedule = {
      ...schedule[day],
      [field]: value,
    };

    if (isEndTimeNotAfterStartTime(nextDaySchedule.startTime, nextDaySchedule.endTime)) {
      toast.error('End time must be later than start time');
      return;
    }

    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSchedule = async () => {
    if (!user) return;

    const invalidDay = getInvalidScheduleDay(schedule);
    if (invalidDay) {
      toast.error(`${formatDayLabel(invalidDay)} must have an end time later than its start time`);
      return;
    }

    try {
      setSaving(true);
      await psychologistApi.updateAvailability(user.id, toApiSchedule(schedule));

      await loadAvailability();
      toast.success('Availability schedule saved successfully');
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast.error(error?.message ?? 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyToAll = (sourceDay: keyof WeekSchedule) => {
    const sourceSchedule = schedule[sourceDay];
    const newSchedule = { ...schedule };
    
    DAY_KEYS.forEach((day) => {
      if (newSchedule[day].enabled) {
        newSchedule[day] = {
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
      <Card className={!daySchedule.enabled ? 'opacity-60' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3 min-w-[140px]">
              <Switch
                checked={daySchedule.enabled}
                onCheckedChange={() => handleToggleDay(day)}
              />
              <Label className="font-semibold text-base cursor-pointer" onClick={() => handleToggleDay(day)}>
                {label}
              </Label>
            </div>

            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Start Time</Label>
                  <Select
                    value={daySchedule.startTime}
                    onValueChange={(value) => handleUpdateTime(day, 'startTime', value)}
                    disabled={!daySchedule.enabled}
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
                    disabled={!daySchedule.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map(time => (
                        <SelectItem key={time} value={time} disabled={time <= daySchedule.startTime}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {daySchedule.enabled && (
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
              )}
            </div>
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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading availability schedule...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('psychologist-dashboard')}
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
              ) : !hasAvailabilityRecord ? (
                <Badge variant="secondary" className="text-sm">
                  Not Set
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
              <p className="text-sm font-medium">
                {hasAvailabilityRecord ? 'How availability works' : 'No availability set yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasAvailabilityRecord
                  ? 'Clients can only book sessions during your available hours. Toggle days on/off and set your preferred working hours. Changes take effect immediately after saving.'
                  : 'You have not configured any availability yet. Enable the days you want to work, set your hours, and save when you are ready.'}
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

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setSchedule(cloneWeekSchedule(savedSchedule));
            setHasChanges(false);
            toast.info('Changes discarded');
          }}
          disabled={!hasChanges || saving}
        >
          Discard Changes
        </Button>
        <Button
          onClick={handleSaveSchedule}
          disabled={!hasChanges || saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>
    </div>
  );
}
