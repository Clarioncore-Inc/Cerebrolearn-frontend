import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from './button';

interface UniversalBreadcrumbProps {
  currentPage: string;
  pageData?: any;
  onNavigate: (page: string, data?: any) => void;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  page: string;
  data?: any;
}

export function UniversalBreadcrumb({
  currentPage,
  pageData,
  onNavigate,
  className = '',
}: UniversalBreadcrumbProps) {
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [];

    // Always start with home for logged-in users
    if (currentPage !== 'landing' && currentPage !== 'dashboard') {
      crumbs.push({ label: 'Home', page: 'dashboard' });
    }

    // Course-related breadcrumbs
    if (
      currentPage === 'course-detail' ||
      currentPage === 'course-detail-page'
    ) {
      crumbs.push({ label: 'Courses', page: 'catalog' });
      if (pageData?.category) {
        crumbs.push({
          label: pageData.category,
          page: 'category',
          data: { category: pageData.category },
        });
      }
      if (pageData?.title) {
        crumbs.push({ label: pageData.title, page: currentPage });
      } else {
        crumbs.push({ label: 'Course Details', page: currentPage });
      }
    }

    // Lesson breadcrumbs
    else if (currentPage === 'lesson') {
      crumbs.push({ label: 'Courses', page: 'catalog' });
      if (pageData?.courseTitle) {
        crumbs.push({
          label: pageData.courseTitle,
          page: 'course-detail',
          data: { courseId: pageData.courseId },
        });
      }
      if (pageData?.lessonTitle) {
        crumbs.push({ label: pageData.lessonTitle, page: currentPage });
      } else {
        crumbs.push({ label: 'Lesson', page: currentPage });
      }
    }

    // Category breadcrumbs
    else if (currentPage === 'category') {
      crumbs.push({ label: 'Courses', page: 'catalog' });
      if (pageData?.category) {
        crumbs.push({ label: pageData.category, page: currentPage });
      } else {
        crumbs.push({ label: 'Category', page: currentPage });
      }
    }

    // Subcategory breadcrumbs
    else if (currentPage === 'subcategory') {
      crumbs.push({ label: 'Courses', page: 'catalog' });
      if (pageData?.category) {
        crumbs.push({
          label: pageData.category,
          page: 'category',
          data: { category: pageData.category },
        });
      }
      if (pageData?.subcategory) {
        crumbs.push({ label: pageData.subcategory, page: currentPage });
      } else {
        crumbs.push({ label: 'Subcategory', page: currentPage });
      }
    }

    // Catalog breadcrumbs
    else if (currentPage === 'catalog') {
      crumbs.push({ label: 'All Courses', page: currentPage });
    }

    // IQ Test breadcrumbs
    else if (currentPage === 'iq-test-landing') {
      crumbs.push({ label: 'IQ Test', page: currentPage });
    } else if (
      currentPage === 'iq-test' ||
      currentPage === 'iq-test-interface'
    ) {
      crumbs.push({ label: 'IQ Test', page: 'iq-test-landing' });
      crumbs.push({ label: 'Test in Progress', page: currentPage });
    } else if (
      currentPage === 'iq-test-results' ||
      currentPage === 'enhanced-iq-results'
    ) {
      crumbs.push({ label: 'IQ Test', page: 'iq-test-landing' });
      crumbs.push({ label: 'Results', page: currentPage });
    }

    // Psychologist breadcrumbs
    else if (currentPage === 'browse-psychologists') {
      crumbs.push({ label: 'Psychologists', page: currentPage });
    } else if (
      currentPage === 'appointment-booking' ||
      currentPage === 'enhanced-appointment-booking'
    ) {
      crumbs.push({ label: 'Psychologists', page: 'browse-psychologists' });
      if (pageData?.psychologistName) {
        crumbs.push({ label: pageData.psychologistName, page: currentPage });
      } else {
        crumbs.push({ label: 'Book Appointment', page: currentPage });
      }
    }

    // Student Sessions
    else if (
      currentPage === 'student-sessions' ||
      currentPage === 'enhanced-therapy-dashboard'
    ) {
      crumbs.push({ label: 'My Sessions', page: currentPage });
    } else if (currentPage === 'my-therapy-progress') {
      crumbs.push({ label: 'My Sessions', page: 'student-sessions' });
      crumbs.push({ label: 'Progress', page: currentPage });
    }

    // Profile & Settings
    else if (currentPage === 'profile') {
      crumbs.push({ label: 'My Profile', page: currentPage });
    } else if (currentPage === 'settings') {
      crumbs.push({ label: 'Settings', page: currentPage });
    }

    // Leaderboard
    else if (currentPage === 'leaderboard') {
      crumbs.push({ label: 'Leaderboard', page: currentPage });
    }

    // Payment
    else if (currentPage === 'payment') {
      crumbs.push({ label: 'Courses', page: 'catalog' });
      crumbs.push({ label: 'Payment', page: currentPage });
    } else if (currentPage === 'payment-confirmation') {
      crumbs.push({ label: 'Courses', page: 'catalog' });
      crumbs.push({ label: 'Payment', page: 'payment' });
      crumbs.push({ label: 'Confirmation', page: currentPage });
    } else if (currentPage === 'student-payment-history') {
      crumbs.push({ label: 'Payment History', page: currentPage });
    }

    // Creator/Instructor breadcrumbs
    else if (currentPage.startsWith('creator-')) {
      const pageName = currentPage.replace('creator-', '').replace(/-/g, ' ');
      crumbs.push({ label: 'Creator Studio', page: 'creator-dashboard' });
      if (currentPage !== 'creator-dashboard') {
        crumbs.push({
          label: pageName.charAt(0).toUpperCase() + pageName.slice(1),
          page: currentPage,
        });
      }
    } else if (currentPage.startsWith('instructor-')) {
      const pageName = currentPage
        .replace('instructor-', '')
        .replace(/-/g, ' ');
      crumbs.push({ label: 'Instructor', page: 'instructor-dashboard' });
      if (currentPage !== 'instructor-dashboard') {
        crumbs.push({
          label: pageName.charAt(0).toUpperCase() + pageName.slice(1),
          page: currentPage,
        });
      }
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on landing, dashboard, or any auth pages
  const nocrumbPages = [
    'landing',
    'dashboard',
    'auth',
    'psychologist-signup',
    'signup-choice',
  ];
  if (nocrumbPages.includes(currentPage) || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div
      className={`sticky top-20 z-20 border-b bg-card/50 backdrop-blur-sm ${className}`}
    >
      <div className='container py-3'>
        <nav
          aria-label='Breadcrumb'
          className='flex items-center gap-2 text-sm'
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.page + index} className='flex items-center gap-2'>
              {index > 0 && (
                <ChevronRight
                  className='h-4 w-4 text-muted-foreground'
                  aria-hidden='true'
                />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className='font-medium text-foreground'
                  aria-current='page'
                >
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(crumb.page, crumb.data)}
                  className='text-muted-foreground hover:text-foreground transition-colors hover:underline'
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
