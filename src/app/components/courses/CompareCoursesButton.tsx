import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { GitCompare, X, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CompareCoursesButtonProps {
  onViewComparison: () => void;
}

export function CompareCoursesButton({ onViewComparison }: CompareCoursesButtonProps) {
  const [comparisonCourses, setComparisonCourses] = useState<any[]>([]);

  useEffect(() => {
    // Load comparison courses from localStorage
    const loadCourses = () => {
      const stored = localStorage.getItem('comparison_courses');
      if (stored) {
        setComparisonCourses(JSON.parse(stored));
      }
    };

    loadCourses();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadCourses();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (for same-tab updates)
    const interval = setInterval(loadCourses, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const removeCourse = (courseId: string) => {
    const updated = comparisonCourses.filter(c => c.id !== courseId);
    localStorage.setItem('comparison_courses', JSON.stringify(updated));
    setComparisonCourses(updated);
    toast.success('Course removed from comparison');
  };

  if (comparisonCourses.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="shadow-2xl border-2 border-primary p-4 bg-background max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Compare Courses</h3>
            <Badge className="bg-primary">{comparisonCourses.length}</Badge>
          </div>
        </div>

        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
          {comparisonCourses.map(course => (
            <div
              key={course.id}
              className="flex items-center justify-between gap-2 p-2 bg-muted rounded text-sm"
            >
              <span className="flex-1 truncate">{course.title}</span>
              <button
                onClick={() => removeCourse(course.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <Button className="w-full" onClick={onViewComparison}>
          <Eye className="h-4 w-4 mr-2" />
          View Comparison
        </Button>
      </Card>
    </div>
  );
}

export function addToComparison(course: any) {
  const stored = localStorage.getItem('comparison_courses');
  const courses = stored ? JSON.parse(stored) : [];

  if (courses.length >= 4) {
    toast.error('Maximum 4 courses can be compared');
    return false;
  }

  if (courses.find((c: any) => c.id === course.id)) {
    toast.error('Course already added to comparison');
    return false;
  }

  courses.push(course);
  localStorage.setItem('comparison_courses', JSON.stringify(courses));
  toast.success('Course added to comparison');
  
  // Trigger storage event for same-tab updates
  window.dispatchEvent(new Event('storage'));
  
  return true;
}

export function removeFromComparison(courseId: string) {
  const stored = localStorage.getItem('comparison_courses');
  const courses = stored ? JSON.parse(stored) : [];
  const updated = courses.filter((c: any) => c.id !== courseId);
  localStorage.setItem('comparison_courses', JSON.stringify(updated));
  
  // Trigger storage event for same-tab updates
  window.dispatchEvent(new Event('storage'));
  
  return true;
}

export function isInComparison(courseId: string): boolean {
  const stored = localStorage.getItem('comparison_courses');
  const courses = stored ? JSON.parse(stored) : [];
  return courses.some((c: any) => c.id === courseId);
}
