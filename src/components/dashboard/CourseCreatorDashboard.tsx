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
  initialSelectedCourse?: any;
}

export function CourseCreatorDashboard({
  onNavigate,
  currentPage = 'creator-dashboard',
  initialSelectedCourse = null,
}: CourseCreatorDashboardProps) {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [wizardInitialData, setWizardInitialData] = useState<any>(null);
  const sidebarWidth = useSidebarWidth();

  // Reset local UI state whenever the top-level page changes (e.g. sidebar navigation)
  useEffect(() => {
    setShowCreateWizard(false);
    setWizardInitialData(null);
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
            initialData={wizardInitialData}
            onSaveDraftComplete={() => {
              setShowCreateWizard(false);
              setWizardInitialData(null);
              onNavigate('creator-courses');
            }}
            onPublishComplete={(courseData) => {
              setShowCreateWizard(false);
              setWizardInitialData(null);
              onNavigate('creator-course-edit', courseData);
            }}
            onCancel={() => {
              setShowCreateWizard(false);
              setWizardInitialData(null);
              onNavigate('creator-courses');
            }}
          />
        </div>
      </div>
    );
  }

  // Dedicated edit-course route — has its own URL (/creator-course-edit)
  if (currentPage === 'creator-course-edit' && initialSelectedCourse) {
    return (
      <div className='flex'>
        <CourseCreatorSidebar
          currentPage='creator-courses'
          onNavigate={onNavigate}
        />
        <div
          className={cn(
            'flex-1 transition-all duration-300',
            `lg:${sidebarWidth}`,
          )}
        >
          <CourseManagementPage
            course={initialSelectedCourse}
            onNavigate={onNavigate}
            onBack={() => onNavigate('creator-courses')}
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
                    onNavigate('creator-course-edit', data);
                  } else {
                    onNavigate(page, data);
                  }
                }}
              />
            )}

            {currentPage === 'creator-courses' && (
              <MyCoursesPage
                onNavigate={(page, data) => {
                  if (page === 'course-edit-draft' && data) {
                    setWizardInitialData(data);
                    setShowCreateWizard(true);
                  } else if (page === 'course-edit' && data) {
                    onNavigate('creator-course-edit', data);
                  } else {
                    onNavigate(page, data);
                  }
                }}
                onCreateCourse={() => {
                  setWizardInitialData(null);
                  setShowCreateWizard(true);
                }}
              />
            )}

            {currentPage === 'creator-create-course' && (
              <CourseCreationChoice
                onSaveDraftComplete={() => onNavigate('creator-courses')}
                onPublishComplete={(courseData) =>
                  onNavigate('creator-course-edit', courseData)
                }
                onCancel={() => onNavigate('creator-courses')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
