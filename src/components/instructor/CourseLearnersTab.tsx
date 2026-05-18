import { useState, useEffect } from 'react';
import { Download, Users, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { enrollmentsApi } from '../../utils/api-client';
import { toast } from 'sonner@2.0.3';

interface Learner {
  id: string;
  enrollmentId: string;
  name: string;
  email: string;
  progress: number;
  performance: 'Excellent' | 'Good' | 'Needs Help';
  lastActive: string;
}

interface CourseLearnersTabProps {
  courseId?: string;
  course?: any;
  enrolledStudents?: any[];
  loadingStudents?: boolean;
  handleRemoveLearner?: (learner: any) => void;
  onNavigateToProfile?: (learnerId: string, learnerName: string) => void;
}

export function CourseLearnersTab({
  courseId,
  course,
  enrolledStudents: propEnrolledStudents,
  loadingStudents: propLoadingStudents,
  handleRemoveLearner: propHandleRemoveLearner,
  onNavigateToProfile: propOnNavigateToProfile,
}: CourseLearnersTabProps) {
  const [enrolledLearners, setEnrolledLearners] = useState<Learner[]>([]);
  const [loadingLearners, setLoadingLearners] = useState(true);

  // Use props if provided, otherwise load from API
  const actualCourseId = courseId || course?.id;
  const usePropsData = propEnrolledStudents !== undefined;

  useEffect(() => {
    if (!usePropsData && actualCourseId) {
      loadLearners();
    } else if (propEnrolledStudents) {
      // Convert prop data to learner format
      const learners = propEnrolledStudents.map((student: any) => ({
        id: student.id,
        enrollmentId: student.enrollmentId || student.id,
        name: student.name || student.user_name || 'Unknown User',
        email: student.email || student.user_email || 'unknown@example.com',
        progress: student.progress || 0,
        performance:
          student.performance ||
          (student.progress >= 80
            ? 'Excellent'
            : student.progress >= 50
              ? 'Good'
              : 'Needs Help'),
        lastActive: student.lastActive || 'Recently',
      }));
      setEnrolledLearners(learners);
      setLoadingLearners(propLoadingStudents || false);
    }
  }, [actualCourseId, propEnrolledStudents, usePropsData, propLoadingStudents]);

  const loadLearners = async () => {
    try {
      setLoadingLearners(true);
      const response = await enrollmentsApi.getByCourse(actualCourseId);

      if (response.enrollments) {
        const learners = response.enrollments.map((enrollment: any) => {
          const performance =
            enrollment.progress >= 80
              ? 'Excellent'
              : enrollment.progress >= 50
                ? 'Good'
                : 'Needs Help';

          const enrolledDate = new Date(enrollment.enrolled_at);
          const daysSince = Math.floor(
            (Date.now() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          const lastActive =
            daysSince === 0
              ? 'Today'
              : daysSince === 1
                ? 'Yesterday'
                : `${daysSince} days ago`;

          return {
            id: enrollment.user_id || enrollment.id,
            enrollmentId: enrollment.id,
            name: enrollment.user_name || 'Unknown User',
            email: enrollment.user_email || 'unknown@example.com',
            progress: enrollment.progress || 0,
            performance,
            lastActive,
          };
        });

        setEnrolledLearners(learners);
      }
    } catch (error) {
      console.error('Error loading learners:', error);
      toast.error('Failed to load learners');
    } finally {
      setLoadingLearners(false);
    }
  };

  const handleRemoveLearner = async (learner: Learner) => {
    if (
      !confirm(
        `Are you sure you want to remove ${learner.name} from this course?`,
      )
    ) {
      return;
    }

    try {
      const response = await enrollmentsApi.remove(learner.enrollmentId);

      if (response.success) {
        setEnrolledLearners(
          enrolledLearners.filter(
            (l) => l.enrollmentId !== learner.enrollmentId,
          ),
        );
        toast.success(`${learner.name} has been removed from the course`);
      } else {
        toast.error('Failed to remove learner');
      }
    } catch (error) {
      console.error('Error removing learner:', error);
      toast.error('Failed to remove learner');
    }
  };

  const handleExportCSV = () => {
    const csvHeader = 'Name,Email,Progress (%),Performance,Last Active\n';
    const csvRows = enrolledLearners
      .map(
        (learner) =>
          `"${learner.name}","${learner.email}",${learner.progress},"${learner.performance}","${learner.lastActive}"`,
      )
      .join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `course-learners-${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  return (
    <Card className='flex-1 flex flex-col'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl'>Enrolled Learners</CardTitle>
            <CardDescription className='text-base mt-1'>
              {enrolledLearners.length} learner
              {enrolledLearners.length !== 1 ? 's' : ''} currently enrolled
            </CardDescription>
          </div>
          <Button
            variant='outline'
            onClick={handleExportCSV}
            disabled={enrolledLearners.length === 0}
          >
            <Download className='mr-2 h-4 w-4' />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex-1'>
        {loadingLearners ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-3 text-muted-foreground'>
              Loading learners...
            </span>
          </div>
        ) : enrolledLearners.length === 0 ? (
          <div className='text-center py-12'>
            <Users className='h-16 w-16 mx-auto text-muted-foreground/50 mb-4' />
            <p className='text-lg font-medium text-muted-foreground'>
              No learners enrolled yet
            </p>
            <p className='text-sm text-muted-foreground mt-1'>
              Learners will appear here once they enroll in your course
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {enrolledLearners.map((learner) => (
              <div
                key={learner.enrollmentId}
                className='flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-accent transition-colors group'
              >
                <button
                  onClick={() =>
                    propOnNavigateToProfile?.(learner.id, learner.name)
                  }
                  className='flex items-center gap-4 flex-1 text-left'
                  title='View learner profile'
                >
                  <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary/20 transition-colors'>
                    {learner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-slate-900 group-hover:text-primary transition-colors'>
                      {learner.name}
                    </p>
                    <p className='text-sm text-slate-500'>{learner.email}</p>
                  </div>
                </button>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900'>
                    {learner.progress}%
                  </div>
                  <div className='text-xs text-slate-500'>Progress</div>
                </div>
                <div className='text-right min-w-[120px]'>
                  <Badge
                    variant={
                      learner.performance === 'Excellent'
                        ? 'default'
                        : learner.performance === 'Good'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {learner.performance}
                  </Badge>
                  <p className='text-xs text-slate-500 mt-1'>
                    Last active: {learner.lastActive}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    title='Send message'
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Messaging feature coming soon!');
                    }}
                  >
                    <MessageSquare className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLearner(learner);
                    }}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    title='Remove learner from course'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}