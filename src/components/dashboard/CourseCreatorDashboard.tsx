import React, { useState, useEffect } from 'react';
import {
  CourseCreatorSidebar,
  useSidebarWidth,
} from '../layout/CourseCreatorSidebar';
import { CourseCreationChoice } from '../creator/CourseCreationChoice';
import { CourseManagementPage } from '../instructor/CourseManagementPage';
import { CreatorDashboardOverview } from '../creator/CreatorDashboardOverview';
import { MyCoursesPage } from '../creator/MyCoursesPage';
import { cn } from '../ui/utils';

interface CourseCreatorDashboardProps {
  onNavigate: (page: string, data?: any) => void;
  currentPage?: string;
}

export function CourseCreatorDashboard({
  onNavigate,
  currentPage = 'creator-dashboard',
}: CourseCreatorDashboardProps) {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const sidebarWidth = useSidebarWidth();

  // Reset local UI state whenever the top-level page changes (e.g. sidebar navigation)
  useEffect(() => {
    setShowCreateWizard(false);
    setSelectedCourse(null);
  }, [currentPage]);

  // If showing create wizard, render it full-screen
  if (showCreateWizard) {
    return (
      <div className='flex'>
        <CourseCreatorSidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
        <div
          className={cn(
            'flex-1 transition-all duration-300',
            `lg:${sidebarWidth}`,
          )}
        >
          <CourseCreationChoice
            onComplete={(course) => {
              setShowCreateWizard(false);
              onNavigate('creator-courses');
            }}
            onCancel={() => {
              setShowCreateWizard(false);
              onNavigate('creator-courses');
            }}
          />
        </div>
      </div>
    );
  }

  // If a course is selected for editing, show the Course Management Page
  if (selectedCourse) {
    return (
      <div className='flex'>
        <CourseCreatorSidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
        <div
          className={cn(
            'flex-1 transition-all duration-300',
            `lg:${sidebarWidth}`,
          )}
        >
          <CourseManagementPage
            course={selectedCourse}
            onNavigate={onNavigate}
            onBack={() => {
              setSelectedCourse(null);
              onNavigate('creator-courses');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <CourseCreatorSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div
        className={cn(
          'flex-1 transition-all duration-300',
          `lg:${sidebarWidth}`,
        )}
      >
        <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
          <div className='py-6 px-4 md:py-6 md:px-6 lg:py-12 lg:px-12'>
            {/* Route to different pages based on currentPage */}
            {currentPage === 'creator-dashboard' && (
              <CreatorDashboardOverview
                onNavigate={(page, data) => {
                  if (page === 'creator-create-course') {
                    setShowCreateWizard(true);
                  } else if (page === 'course-edit' && data) {
                    setSelectedCourse(data);
                  } else {
                    onNavigate(page, data);
                  }
                }}
              />
            )}

            {currentPage === 'creator-courses' && (
              <MyCoursesPage
                onNavigate={(page, data) => {
                  if (page === 'course-edit' && data) {
                    setSelectedCourse(data);
                  } else {
                    onNavigate(page, data);
                  }
                }}
                onCreateCourse={() => setShowCreateWizard(true)}
              />
            )}

            {currentPage === 'creator-create-course' && (
              <CourseCreationChoice
                onComplete={(course) => {
                  setShowCreateWizard(false);
                  onNavigate('creator-courses');
                }}
                onCancel={() => onNavigate('creator-courses')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
