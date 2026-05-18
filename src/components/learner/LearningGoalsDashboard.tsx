import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Target,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Flame,
  Zap,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  learnerApi,
  type LearningGoalRecord,
  type LearningGoalType,
  type LearningGoalUnit,
  type StudyStatsRecord,
} from '../../utils/api-client';

interface LearningGoalsDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  type: LearningGoalType;
  target: number;
  current: number;
  unit: LearningGoalUnit;
  deadline?: Date;
  createdAt: Date;
  completed: boolean;
}

interface StudyStats {
  today: { lessons: number; hours: number; quizzes: number };
  thisWeek: { lessons: number; hours: number; quizzes: number; courses: number };
  thisMonth: { lessons: number; hours: number; quizzes: number; courses: number };
  streak: number;
  totalStudyTime: number;
}

const EMPTY_STATS: StudyStats = {
  today: { lessons: 0, hours: 0, quizzes: 0 },
  thisWeek: { lessons: 0, hours: 0, quizzes: 0, courses: 0 },
  thisMonth: { lessons: 0, hours: 0, quizzes: 0, courses: 0 },
  streak: 0,
  totalStudyTime: 0,
};

const mapGoal = (goal: LearningGoalRecord): Goal => ({
  id: goal.id,
  title: goal.title,
  description: goal.description ?? '',
  type: goal.type ?? goal.goal_type ?? 'custom',
  target: Number(goal.target ?? 0),
  current: Number(goal.current ?? 0),
  unit: goal.unit,
  deadline: goal.deadline ? new Date(goal.deadline) : undefined,
  createdAt: new Date(goal.created_at),
  completed: Boolean(goal.completed),
});

const mapStats = (stats: StudyStatsRecord): StudyStats => ({
  today: {
    lessons: Number(stats.today?.lessons ?? 0),
    hours: Number(stats.today?.hours ?? 0),
    quizzes: Number(stats.today?.quizzes ?? 0),
  },
  thisWeek: {
    lessons: Number(stats.this_week?.lessons ?? 0),
    hours: Number(stats.this_week?.hours ?? 0),
    quizzes: Number(stats.this_week?.quizzes ?? 0),
    courses: Number(stats.this_week?.courses ?? 0),
  },
  thisMonth: {
    lessons: Number(stats.this_month?.lessons ?? 0),
    hours: Number(stats.this_month?.hours ?? 0),
    quizzes: Number(stats.this_month?.quizzes ?? 0),
    courses: Number(stats.this_month?.courses ?? 0),
  },
  streak: Number(stats.streak ?? 0),
  totalStudyTime: Number(stats.total_study_time ?? 0),
});

export function LearningGoalsDashboard({ onNavigate }: LearningGoalsDashboardProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<StudyStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadGoalsAndStats();
  }, [user]);

  const loadGoalsAndStats = async () => {
    if (!user) {
      setGoals([]);
      setStats(EMPTY_STATS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [goalRecords, statsRecord] = await Promise.all([
        learnerApi.getGoals(),
        learnerApi.getStudyStats(),
      ]);
      setGoals((goalRecords || []).map(mapGoal));
      setStats(mapStats(statsRecord));
    } catch (error) {
      console.error('Error loading goals and stats:', error);
      toast.error('Failed to load learning goals');
      setGoals([]);
      setStats(EMPTY_STATS);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (newGoal: {
    title: string;
    description: string;
    type: LearningGoalType;
    target: number;
    unit: LearningGoalUnit;
  }) => {
    try {
      const created = await learnerApi.createGoal(newGoal);
      setGoals((currentGoals) => [mapGoal(created), ...currentGoals]);
      toast.success('Goal created!', {
        description: 'Your new learning goal has been added',
      });
      return true;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
      return false;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await learnerApi.deleteGoal(goalId);
      setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));
      toast.success('Goal deleted');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const updateGoalProgress = async (goalId: string, newProgress: number) => {
    const previousGoal = goals.find((goal) => goal.id === goalId);
    if (!previousGoal) return;

    try {
      const updated = await learnerApi.updateGoal(goalId, {
        current: newProgress,
        completed: newProgress >= previousGoal.target,
      });
      const mappedGoal = mapGoal(updated);
      setGoals((currentGoals) =>
        currentGoals.map((goal) => (goal.id === goalId ? mappedGoal : goal)),
      );

      if (mappedGoal.completed && !previousGoal.completed) {
        toast.success('🎉 Goal completed!', {
          description: `You've achieved: ${mappedGoal.title}`,
        });
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast.error('Failed to update goal progress');
    }
  };

  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Learning Goals
          </h1>
          <p className="text-muted-foreground mt-2">
            Set targets, track progress, and stay motivated
          </p>
        </div>
        <AddGoalDialog onAdd={addGoal} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardDescription>Current Streak</CardDescription><Flame className="w-4 h-4 text-orange-500" /></div></CardHeader><CardContent><div className="text-3xl font-bold text-orange-600">{stats.streak}</div><p className="text-xs text-muted-foreground mt-1">days in a row</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardDescription>Today's Progress</CardDescription><Zap className="w-4 h-4 text-yellow-500" /></div></CardHeader><CardContent><div className="text-3xl font-bold text-yellow-600">{stats.today.lessons}</div><p className="text-xs text-muted-foreground mt-1">lessons completed</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardDescription>This Week</CardDescription><TrendingUp className="w-4 h-4 text-blue-500" /></div></CardHeader><CardContent><div className="text-3xl font-bold text-blue-600">{stats.thisWeek.hours}h</div><p className="text-xs text-muted-foreground mt-1">total study time</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardDescription>Total Study Time</CardDescription><Trophy className="w-4 h-4 text-primary" /></div></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.totalStudyTime}h</div><p className="text-xs text-muted-foreground mt-1">all time</p></CardContent></Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-16"><Target className="w-16 h-16 text-muted-foreground/50 mb-4" /><p className="text-lg font-medium mb-2">No active goals</p><p className="text-sm text-muted-foreground mb-4">Set your first learning goal to start tracking progress</p><AddGoalDialog onAdd={addGoal} /></CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">{activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} onUpdateProgress={updateGoalProgress} />)}</div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-16"><Award className="w-16 h-16 text-muted-foreground/50 mb-4" /><p className="text-lg font-medium mb-2">No completed goals yet</p><p className="text-sm text-muted-foreground">Keep working towards your active goals</p></CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">{completedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} onUpdateProgress={updateGoalProgress} />)}</div>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4"><AnalyticsView stats={stats} /></TabsContent>
      </Tabs>
    </div>
  );
}

function GoalCard({ goal, onDelete, onUpdateProgress }: { goal: Goal; onDelete: (id: string) => Promise<void>; onUpdateProgress: (id: string, progress: number) => Promise<void>; }) {
  const [working, setWorking] = useState(false);
  const progress = (goal.current / Math.max(goal.target, 1)) * 100;
  const typeColors = { daily: 'bg-blue-500/10 text-blue-600 border-blue-500/20', weekly: 'bg-purple-500/10 text-purple-600 border-purple-500/20', monthly: 'bg-green-500/10 text-green-600 border-green-500/20', custom: 'bg-orange-500/10 text-orange-600 border-orange-500/20' };
  const unitLabels = { lessons: 'lessons', hours: 'hours', courses: 'courses', quizzes: 'quizzes' };

  return (
    <Card className={`${goal.completed ? 'border-green-500/50 bg-green-500/5' : ''} group`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={typeColors[goal.type]} variant="outline">{goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}</Badge>
              {goal.completed && <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>}
            </div>
            <CardTitle className="text-lg line-clamp-2">{goal.title}</CardTitle>
            {goal.description && <CardDescription className="line-clamp-2 mt-1">{goal.description}</CardDescription>}
          </div>
          <Button variant="ghost" size="icon" onClick={async () => { setWorking(true); await onDelete(goal.id); setWorking(false); }} className="opacity-0 group-hover:opacity-100 transition-opacity" disabled={working}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">{goal.current} / {goal.target} {unitLabels[goal.unit]}</span></div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{Math.round(progress)}% complete</span>{goal.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {formatDeadline(goal.deadline)}</span>}</div>
        </div>
        {!goal.completed && <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1" onClick={async () => { setWorking(true); await onUpdateProgress(goal.id, goal.current + 1); setWorking(false); }} disabled={goal.current >= goal.target || working}><Plus className="w-3 h-3 mr-1" />Add 1 {unitLabels[goal.unit].slice(0, -1)}</Button></div>}
      </CardContent>
    </Card>
  );
}

function AddGoalDialog({ onAdd }: { onAdd: (goal: { title: string; description: string; type: LearningGoalType; target: number; unit: LearningGoalUnit; }) => Promise<boolean>; }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<LearningGoalType>('daily');
  const [target, setTarget] = useState('3');
  const [unit, setUnit] = useState<LearningGoalUnit>('lessons');

  const handleSubmit = async () => {
    if (!title || !target) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    const success = await onAdd({ title, description, type, target: parseInt(target, 10), unit });
    setSubmitting(false);
    if (!success) return;
    setTitle(''); setDescription(''); setType('daily'); setTarget('3'); setUnit('lessons'); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Goal</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Learning Goal</DialogTitle><DialogDescription>Set a new goal to track your learning progress</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="title">Goal Title *</Label><Input id="title" placeholder="e.g., Complete 3 lessons daily" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="type">Goal Type</Label><Select value={type} onValueChange={(value: LearningGoalType) => setType(value)}><SelectTrigger id="type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="unit">Unit</Label><Select value={unit} onValueChange={(value: LearningGoalUnit) => setUnit(value)}><SelectTrigger id="unit"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lessons">Lessons</SelectItem><SelectItem value="hours">Hours</SelectItem><SelectItem value="courses">Courses</SelectItem><SelectItem value="quizzes">Quizzes</SelectItem></SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label htmlFor="target">Target *</Label><Input id="target" type="number" min="1" placeholder="e.g., 3" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
          <Button onClick={handleSubmit} className="w-full" disabled={submitting}>{submitting ? 'Creating...' : 'Create Goal'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsView({ stats }: { stats: StudyStats }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Study Analytics</CardTitle><CardDescription>Your learning activity overview</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" />Today</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-blue-500/10"><div className="text-2xl font-bold text-blue-600">{stats.today.lessons}</div><div className="text-xs text-muted-foreground">Lessons</div></div>
              <div className="text-center p-3 rounded-lg bg-green-500/10"><div className="text-2xl font-bold text-green-600">{stats.today.hours}</div><div className="text-xs text-muted-foreground">Hours</div></div>
              <div className="text-center p-3 rounded-lg bg-purple-500/10"><div className="text-2xl font-bold text-purple-600">{stats.today.quizzes}</div><div className="text-xs text-muted-foreground">Quizzes</div></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">This Week</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted"><div className="text-2xl font-bold">{stats.thisWeek.lessons}</div><div className="text-xs text-muted-foreground">Lessons</div></div>
              <div className="text-center p-3 rounded-lg bg-muted"><div className="text-2xl font-bold">{stats.thisWeek.hours}</div><div className="text-xs text-muted-foreground">Hours</div></div>
              <div className="text-center p-3 rounded-lg bg-muted"><div className="text-2xl font-bold">{stats.thisWeek.quizzes}</div><div className="text-xs text-muted-foreground">Quizzes</div></div>
              <div className="text-center p-3 rounded-lg bg-muted"><div className="text-2xl font-bold">{stats.thisWeek.courses}</div><div className="text-xs text-muted-foreground">Courses</div></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">This Month</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/10"><div className="text-2xl font-bold text-primary">{stats.thisMonth.lessons}</div><div className="text-xs text-muted-foreground">Lessons</div></div>
              <div className="text-center p-3 rounded-lg bg-primary/10"><div className="text-2xl font-bold text-primary">{stats.thisMonth.hours}</div><div className="text-xs text-muted-foreground">Hours</div></div>
              <div className="text-center p-3 rounded-lg bg-primary/10"><div className="text-2xl font-bold text-primary">{stats.thisMonth.quizzes}</div><div className="text-xs text-muted-foreground">Quizzes</div></div>
              <div className="text-center p-3 rounded-lg bg-primary/10"><div className="text-2xl font-bold text-primary">{stats.thisMonth.courses}</div><div className="text-xs text-muted-foreground">Courses</div></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDeadline(deadline: Date): string {
  const now = new Date();
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays < 7) return `in ${diffDays} days`;
  return deadline.toLocaleDateString();
}