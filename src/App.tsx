import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DynamicFooter } from './components/layout/DynamicFooter';
import { UniversalBreadcrumb } from './components/ui/universal-breadcrumb';
import { LandingPage } from './components/pages/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { LearnerDashboard } from './components/dashboard/LearnerDashboard';
import { InstructorDashboard } from './components/dashboard/InstructorDashboard';
import { CourseCreatorDashboard } from './components/dashboard/CourseCreatorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { CourseCatalog } from './components/courses/CourseCatalog';
import { CourseDetail } from './components/courses/CourseDetail';
import { CategoryPage } from './components/pages/CategoryPage';
import { SubcategoryPage } from './components/pages/SubcategoryPage';
import { CourseDetailPage } from './components/pages/CourseDetailPage';
import { LessonPlayer } from './components/lessons/LessonPlayer';
import { LessonEditor } from './components/instructor/LessonEditor';
import { QuizEditor } from './components/instructor/QuizEditor';
import { CourseManagementPage } from './components/instructor/CourseManagementPage';
import { CreatorAnalyticsPage } from './components/creator/CreatorAnalyticsPage';
import { CreatorSubscribersPage } from './components/creator/CreatorSubscribersPage';
import { CreatorRevenuePage } from './components/creator/CreatorRevenuePage';
import { CreatorSettingsPage } from './components/creator/CreatorSettingsPage';
import { CourseCreationWizardPage } from './components/creator/CourseCreationWizardPage';
import { LearnerProfilePage } from './components/instructor/LearnerProfilePage';
import { SidebarLayout } from './components/layout/SidebarLayout';
import { Leaderboard } from './components/pages/Leaderboard';
import { PaymentPage } from './components/pages/PaymentPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { DemoAccountSeeder } from './components/utils/DemoAccountSeeder';
import { Toaster } from './components/ui/sonner';
import { initializeDummyData } from './utils/dummyData';
import {
  resetCourseDatabase,
  checkDatabaseStatus,
} from './utils/resetDatabase';

// IQ Test imports
import { IQTestLandingPage } from './components/iq-test/IQTestLandingPage';
import { IQTestLanding } from './components/iq-test/IQTestLanding';
import { IQTestInterface } from './components/iq-test/IQTestInterface';
import { IQTestCompletion } from './components/iq-test/IQTestCompletion';
import { IQTestResults } from './components/iq-test/IQTestResults';
import { EnhancedIQTestResults } from './components/iq-test/EnhancedIQTestResults';
import { IQTestPracticeMode } from './components/iq-test/IQTestPracticeMode';

// Psychologist imports
import { SignupChoice } from './components/auth/SignupChoice';
import { PsychologistSignupForm } from './components/psychologist/PsychologistSignupForm';
import { PsychologistDashboard } from './components/psychologist/PsychologistDashboard';
import { PsychologistManagementPage } from './components/admin/PsychologistManagementPage';
import { PsychologistBrowse } from './components/psychologist/PsychologistBrowse';
import { AppointmentBooking } from './components/psychologist/AppointmentBooking';
import { EnhancedAppointmentBooking } from './components/psychologist/EnhancedAppointmentBooking';
import { AppointmentManager } from './components/psychologist/AppointmentManager';
import { WaitlistManager } from './components/psychologist/WaitlistManager';
import { AppointmentReminders } from './components/psychologist/AppointmentReminders';
import { AdvancedAvailabilityManager } from './components/psychologist/AdvancedAvailabilityManager';
import { SessionNotesManager } from './components/psychologist/SessionNotesManager';
import { RevenueAnalyticsDashboard } from './components/psychologist/RevenueAnalyticsDashboard';
import { ClientProgressTracker } from './components/psychologist/ClientProgressTracker';
import { MyBookings } from './components/psychologist/MyBookings';
import { PsychologistSessionDashboard } from './components/psychologist/PsychologistSessionDashboard';
import { PsychologistAppointments } from './components/psychologist/PsychologistAppointments';
import { AvailabilityManager } from './components/psychologist/AvailabilityManager';

// Student Session & Communication imports
import { ProgressDashboard } from './components/learner/ProgressDashboard';
import { LearningStreakTracker } from './components/learner/LearningStreakTracker';
import { CourseNotesSystem } from './components/learner/CourseNotesSystem';
import { CourseComparisonTool } from './components/courses/CourseComparisonTool';
import { StudentSessionsDashboard } from './components/student/StudentSessionsDashboard';
import { EnhancedTherapyDashboard } from './components/student/EnhancedTherapyDashboard';
import { SessionPreparation } from './components/student/SessionPreparation';
import { MyTherapyProgress } from './components/student/MyTherapyProgress';
import { TherapyResourcesLibrary } from './components/student/TherapyResourcesLibrary';
import { SessionMessaging } from './components/communications/SessionMessaging';
import { VirtualWaitingRoom } from './components/communications/VirtualWaitingRoom';
import { VideoCallRoom } from './components/communications/VideoCallRoom';
import { SessionFeedback } from './components/communications/SessionFeedback';

// Learner Navigation imports
import { MyLearningPath } from './components/learner/MyLearningPath';
import { BookmarkManager } from './components/learner/BookmarkManager';
import { LearningGoalsDashboard } from './components/learner/LearningGoalsDashboard';

// Admin Analytics & Compliance imports
import { PlatformAnalyticsDashboard } from './components/admin/PlatformAnalyticsDashboard';
import { QualityAssuranceDashboard } from './components/admin/QualityAssuranceDashboard';
import { ComplianceManager } from './components/admin/ComplianceManager';

// Admin System & Settings imports
import { SystemHealthMonitor } from './components/admin/SystemHealthMonitor';
import { AdvancedReportGenerator } from './components/admin/AdvancedReportGenerator';
import { PlatformSettingsManager } from './components/admin/PlatformSettingsManager';

// Payment imports
import { PaymentGateway } from './components/payments/PaymentGateway';
import { PaymentConfirmation } from './components/payments/PaymentConfirmation';
import { StudentPaymentHistory } from './components/payments/StudentPaymentHistory';
import { PsychologistEarnings } from './components/psychologist/PsychologistEarnings';

// Initialize dummy data on app load
initializeDummyData();

// Expose database utilities globally for easy access via console
if (typeof window !== 'undefined') {
  (window as any).CerebroLearn = {
    resetDatabase: resetCourseDatabase,
    checkDatabase: checkDatabaseStatus,
    help: () => {
      console.log(
        '%c🎓 CerebroLearn Database Utilities',
        'font-size: 16px; font-weight: bold; color: #395192;',
      );
      console.log(
        '%cAvailable commands:',
        'font-weight: bold; color: #06B6D4;',
      );
      console.log(
        '  CerebroLearn.resetDatabase()    - Reset and reload all 26 science & engineering courses',
      );
      console.log(
        '  CerebroLearn.checkDatabase()    - Check current database status',
      );
      console.log('  CerebroLearn.help()             - Show this help message');
      console.log('');
      console.log('%c📚 Current Status:', 'font-weight: bold; color: #395192;');
      const status = checkDatabaseStatus();
      console.log(`  Published Courses: ${status.publishedCourses}`);
      console.log(`  Draft Courses: ${status.draftCourses}`);
      console.log(`  Total Enrollments: ${status.enrollments}`);
    },
  };

  // Show welcome message in console
  console.log(
    '%c🎓 Welcome to CerebroLearn!',
    'font-size: 20px; font-weight: bold; color: #395192; background: #f0f9ff; padding: 10px;',
  );
  console.log(
    '%cType CerebroLearn.help() for database utilities',
    'color: #06B6D4; font-size: 14px;',
  );
}

// Map URL pathname → page key used in the renderPage() switch
function pathToPage(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'landing';
  // Strip leading slash
  return pathname.slice(1);
}

// Map page key → URL pathname
function pageToPath(page: string): string {
  if (page === 'landing') return '/';
  return '/' + page;
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current page from the URL
  const currentPage = pathToPage(location.pathname);
  // pageData travels as router state (survives back/forward)
  const pageData: any = location.state ?? null;

  const [authMode, setAuthMode] = useState<
    'login' | 'signup' | 'signup-choice' | 'psychologist-signup'
  >(pageData?.authMode ?? 'signup-choice');

  // Handle hidden psychologist signup link (?join=psychologist)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('join') === 'psychologist') {
      navigate(pageToPath('psychologist-signup'), { replace: true });
    }
  }, []);

  // Auth guard: redirect after login/logout
  useEffect(() => {
    if (loading) return;
    if (user && (currentPage === 'landing' || currentPage === 'auth')) {
      navigate(pageToPath('dashboard'), { replace: true });
    } else if (
      !user &&
      currentPage !== 'landing' &&
      currentPage !== 'auth' &&
      currentPage !== 'catalog' &&
      currentPage !== 'psychologist-signup'
    ) {
      navigate(pageToPath('landing'), { replace: true });
    }
  }, [user, loading]);

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'auth') {
      setAuthMode(data?.authMode ?? 'signup-choice');
    }
    navigate(pageToPath(page), { state: data || null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;

      case 'auth':
        return (
          <div className='container py-16'>
            {authMode === 'login' ? (
              <LoginForm onToggleMode={() => setAuthMode('signup-choice')} />
            ) : authMode === 'signup-choice' ? (
              <SignupChoice
                onSelectRegular={() => setAuthMode('signup')}
                onSelectPsychologist={() => setAuthMode('psychologist-signup')}
                onToggleMode={() => setAuthMode('login')}
              />
            ) : authMode === 'psychologist-signup' ? (
              <PsychologistSignupForm
                onToggleMode={() => setAuthMode('login')}
                onBack={() => setAuthMode('signup-choice')}
              />
            ) : (
              <SignupForm onToggleMode={() => setAuthMode('login')} />
            )}
          </div>
        );

      case 'dashboard':
        if (!user) {
          handleNavigate('landing');
          return null;
        }

        if (
          profile?.role === 'psychologist' ||
          profile?.role === 'psychologist_pending'
        ) {
          return <PsychologistDashboard onNavigate={handleNavigate} />;
        } else if (
          profile?.role === 'course_creator' ||
          profile?.role === 'instructor'
        ) {
          return (
            <CourseCreatorDashboard
              onNavigate={handleNavigate}
              currentPage='creator-dashboard'
            />
          );
        } else if (profile?.role === 'admin' || profile?.role === 'org_admin') {
          return <AdminPortal />;
        } else {
          return <LearnerDashboard onNavigate={handleNavigate} />;
        }

      // Legacy instructor routes - redirect to creator routes
      case 'instructor':
      case 'instructor-dashboard':
        return (
          <CourseCreatorDashboard
            onNavigate={handleNavigate}
            currentPage='creator-dashboard'
          />
        );

      case 'instructor-course-management':
        return (
          <CourseCreatorDashboard
            onNavigate={handleNavigate}
            currentPage='creator-courses'
          />
        );

      // Course Creator routes
      case 'creator-dashboard':
      case 'creator':
        return (
          <CourseCreatorDashboard
            onNavigate={handleNavigate}
            currentPage='creator-dashboard'
          />
        );

      case 'creator-courses':
        return (
          <CourseCreatorDashboard
            onNavigate={handleNavigate}
            currentPage='creator-courses'
          />
        );

      case 'creator-create-course':
        return <CourseCreationWizardPage onNavigate={handleNavigate} />;

      case 'creator-analytics':
        return (
          <SidebarLayout
            currentPage='creator-analytics'
            onNavigate={handleNavigate}
          >
            <CreatorAnalyticsPage onNavigate={handleNavigate} />
          </SidebarLayout>
        );

      case 'creator-subscribers':
        return (
          <SidebarLayout
            currentPage='creator-subscribers'
            onNavigate={handleNavigate}
          >
            <CreatorSubscribersPage onNavigate={handleNavigate} />
          </SidebarLayout>
        );

      case 'creator-revenue':
        return (
          <SidebarLayout
            currentPage='creator-revenue'
            onNavigate={handleNavigate}
          >
            <CreatorRevenuePage onNavigate={handleNavigate} />
          </SidebarLayout>
        );

      case 'creator-settings':
        return (
          <SidebarLayout
            currentPage='creator-settings'
            onNavigate={handleNavigate}
          >
            <CreatorSettingsPage onNavigate={handleNavigate} />
          </SidebarLayout>
        );

      case 'admin':
        return <AdminPortal />;

      case 'catalog':
        return (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'category':
        return pageData ? (
          <CategoryPage
            category={pageData.category}
            onNavigate={handleNavigate}
          />
        ) : (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'subcategory':
        return pageData ? (
          <SubcategoryPage
            category={pageData.category}
            subcategory={pageData.subcategory}
            onNavigate={handleNavigate}
          />
        ) : (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'course-detail':
        return pageData ? (
          <CourseDetailPage
            category={pageData.category}
            subcategory={pageData.subcategory}
            courseId={pageData.courseId}
            onNavigate={handleNavigate}
          />
        ) : (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'course':
        return pageData ? (
          <CourseDetail course={pageData} onNavigate={handleNavigate} />
        ) : (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'lesson':
        return pageData ? (
          <LessonPlayer
            lesson={pageData.lesson}
            course={pageData.course}
            onNavigate={handleNavigate}
            onComplete={() => {
              // Refresh dashboard or course page
            }}
          />
        ) : (
          <LearnerDashboard onNavigate={handleNavigate} />
        );

      case 'lesson-editor':
        return pageData ? (
          <LessonEditor
            lesson={pageData.lesson}
            course={pageData.course}
            onSave={(lesson) => {
              console.log('Lesson saved:', lesson);
              handleNavigate('instructor');
            }}
            onCancel={() => handleNavigate('instructor')}
          />
        ) : (
          <InstructorDashboard onNavigate={handleNavigate} />
        );

      case 'learner-profile':
        return pageData ? (
          <LearnerProfilePage
            learnerId={pageData.learnerId}
            learnerName={pageData.learnerName}
            onBack={() => handleNavigate('creator-dashboard')}
            onRemove={(learnerId) => {
              console.log('Removed learner:', learnerId);
              handleNavigate('creator-dashboard');
            }}
          />
        ) : (
          <CourseCreatorDashboard
            onNavigate={handleNavigate}
            currentPage='creator-dashboard'
          />
        );

      case 'quiz-editor':
        return pageData ? (
          <QuizEditor
            quiz={pageData.quiz}
            onSave={(quiz) => {
              console.log('Quiz saved:', quiz);
              handleNavigate('instructor');
            }}
            onCancel={() => handleNavigate('instructor')}
          />
        ) : (
          <InstructorDashboard onNavigate={handleNavigate} />
        );

      case 'leaderboard':
        return <Leaderboard />;

      case 'payment':
        return pageData ? (
          <PaymentPage
            course={pageData}
            onSuccess={() => handleNavigate('course', pageData)}
            onCancel={() => handleNavigate('course', pageData)}
          />
        ) : (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'profile':
        return <ProfilePage />;

      // IQ Test routes
      case 'iq-test-landing':
        return <IQTestLanding onNavigate={handleNavigate} />;

      case 'iq-test-interface':
        return <IQTestInterface onNavigate={handleNavigate} />;

      case 'iq-test-completion':
        return pageData ? (
          <IQTestCompletion
            onNavigate={handleNavigate}
            resultId={pageData.resultId}
          />
        ) : (
          <IQTestLanding onNavigate={handleNavigate} />
        );

      case 'iq-test-results':
        return pageData ? (
          <IQTestResults
            onNavigate={handleNavigate}
            resultId={pageData.resultId}
          />
        ) : (
          <IQTestLanding onNavigate={handleNavigate} />
        );

      case 'enhanced-iq-results':
        return pageData ? (
          <EnhancedIQTestResults
            onNavigate={handleNavigate}
            resultId={pageData.resultId}
          />
        ) : (
          <IQTestLanding onNavigate={handleNavigate} />
        );

      case 'iq-test-practice':
        return <IQTestPracticeMode onNavigate={handleNavigate} />;

      // Psychologist routes
      case 'signup-choice':
        return <SignupChoice onNavigate={handleNavigate} />;

      case 'psychologist-signup':
        return (
          <div className='container py-16'>
            <PsychologistSignupForm
              onToggleMode={() => handleNavigate('auth', { authMode: 'login' })}
              onBack={() => handleNavigate('landing')}
            />
          </div>
        );

      case 'psychologist-dashboard':
        return <PsychologistDashboard onNavigate={handleNavigate} />;

      case 'admin-psychologist-management':
        return <PsychologistManagementPage onNavigate={handleNavigate} />;

      case 'browse-psychologists':
        return <PsychologistBrowse onNavigate={handleNavigate} />;

      case 'book-appointment':
        return pageData ? (
          <AppointmentBooking
            onNavigate={handleNavigate}
            psychologist={pageData.psychologist}
          />
        ) : (
          <PsychologistBrowse onNavigate={handleNavigate} />
        );

      case 'enhanced-book-appointment':
        return pageData ? (
          <EnhancedAppointmentBooking
            onNavigate={handleNavigate}
            psychologist={pageData.psychologist}
          />
        ) : (
          <PsychologistBrowse onNavigate={handleNavigate} />
        );

      case 'appointment-manager':
        return <AppointmentManager onNavigate={handleNavigate} />;

      case 'waitlist-manager':
        return <WaitlistManager onNavigate={handleNavigate} />;

      case 'appointment-reminders':
        return <AppointmentReminders onNavigate={handleNavigate} />;

      case 'advanced-availability':
        return <AdvancedAvailabilityManager onNavigate={handleNavigate} />;

      case 'session-notes':
        return <SessionNotesManager onNavigate={handleNavigate} />;

      case 'revenue-analytics':
        return <RevenueAnalyticsDashboard onNavigate={handleNavigate} />;

      case 'client-progress':
        return <ClientProgressTracker onNavigate={handleNavigate} />;

      case 'my-bookings':
        return <MyBookings onNavigate={handleNavigate} />;

      case 'psychologist-sessions':
        return <PsychologistSessionDashboard onNavigate={handleNavigate} />;

      case 'psychologist-appointments':
        return (
          <PsychologistAppointments
            onNavigate={handleNavigate}
            initialTab={pageData?.tab}
          />
        );

      case 'psychologist-availability':
        return <AvailabilityManager onNavigate={handleNavigate} />;

      // Student Session & Communication routes
      case 'student-sessions':
        return <StudentSessionsDashboard onNavigate={handleNavigate} />;

      case 'therapy-dashboard':
      case 'enhanced-therapy-dashboard':
        return <EnhancedTherapyDashboard onNavigate={handleNavigate} />;

      case 'session-preparation':
        return pageData ? (
          <SessionPreparation
            onNavigate={handleNavigate}
            appointment={pageData.appointment}
          />
        ) : (
          <EnhancedTherapyDashboard onNavigate={handleNavigate} />
        );

      case 'my-progress':
      case 'my-therapy-progress':
        return <MyTherapyProgress onNavigate={handleNavigate} />;

      case 'therapy-resources':
      case 'therapy-resources-library':
        return <TherapyResourcesLibrary onNavigate={handleNavigate} />;

      case 'therapy-messages':
      case 'session-messaging':
        return pageData ? (
          <SessionMessaging
            onNavigate={handleNavigate}
            booking={pageData.booking}
          />
        ) : (
          <StudentSessionsDashboard onNavigate={handleNavigate} />
        );

      case 'session-history':
        return <StudentSessionsDashboard onNavigate={handleNavigate} />;

      // Video Session & Communication routes
      case 'virtual-waiting-room':
      case 'waiting-room':
        return pageData ? (
          <VirtualWaitingRoom
            onNavigate={handleNavigate}
            appointment={pageData.appointment}
          />
        ) : (
          <EnhancedTherapyDashboard onNavigate={handleNavigate} />
        );

      case 'video-call':
      case 'video-session':
        return pageData ? (
          <VideoCallRoom
            onNavigate={handleNavigate}
            appointment={pageData.appointment}
            role={pageData.role || 'student'}
          />
        ) : (
          <EnhancedTherapyDashboard onNavigate={handleNavigate} />
        );

      case 'session-feedback':
      case 'feedback':
        return pageData ? (
          <SessionFeedback
            onNavigate={handleNavigate}
            appointment={pageData.appointment}
            duration={pageData.duration || 3600}
          />
        ) : (
          <EnhancedTherapyDashboard onNavigate={handleNavigate} />
        );

      // Payment routes
      case 'payment-gateway':
        return pageData ? (
          <PaymentGateway
            onNavigate={handleNavigate}
            bookingData={pageData.booking}
            amount={pageData.amount || 150}
          />
        ) : (
          <CourseCatalog
            onNavigate={handleNavigate}
            userRole={profile?.role || 'student'}
          />
        );

      case 'payment-confirmation':
        return pageData ? (
          <PaymentConfirmation
            onNavigate={handleNavigate}
            payment={pageData.payment}
            booking={pageData.booking}
          />
        ) : (
          <StudentSessionsDashboard onNavigate={handleNavigate} />
        );

      // Student payment history
      case 'student-payment-history':
        return <StudentPaymentHistory onNavigate={handleNavigate} />;

      // Psychologist earnings
      case 'psychologist-earnings':
        return <PsychologistEarnings onNavigate={handleNavigate} />;

      // Learner Navigation routes
      case 'my-learning-path':
      case 'learning-path':
        return <MyLearningPath onNavigate={handleNavigate} />;

      case 'bookmarks':
      case 'my-bookmarks':
        return <BookmarkManager onNavigate={handleNavigate} />;

      case 'learning-goals':
      case 'goals':
        return <LearningGoalsDashboard onNavigate={handleNavigate} />;

      case 'progress-dashboard':
      case 'learning-progress':
        return <ProgressDashboard onNavigate={handleNavigate} />;

      case 'learning-streak':
      case 'streak-tracker':
        return <LearningStreakTracker onNavigate={handleNavigate} />;

      case 'course-notes':
      case 'notes':
        return <CourseNotesSystem onNavigate={handleNavigate} />;

      case 'course-comparison':
      case 'compare-courses':
        return (
          <CourseComparisonTool
            onNavigate={handleNavigate}
            courses={[]}
            onClose={() => handleNavigate('catalog')}
          />
        );

      // Admin Analytics & Compliance routes
      case 'platform-analytics':
      case 'admin-analytics':
        return <PlatformAnalyticsDashboard onNavigate={handleNavigate} />;

      case 'quality-assurance':
      case 'qa-dashboard':
        return <QualityAssuranceDashboard onNavigate={handleNavigate} />;

      case 'compliance-manager':
      case 'compliance':
        return <ComplianceManager onNavigate={handleNavigate} />;

      // Admin System & Settings routes
      case 'system-health':
      case 'system-health-monitor':
        return <SystemHealthMonitor onNavigate={handleNavigate} />;

      case 'advanced-reports':
      case 'report-generator':
        return <AdvancedReportGenerator onNavigate={handleNavigate} />;

      case 'platform-settings':
      case 'settings-manager':
        return <PlatformSettingsManager onNavigate={handleNavigate} />;

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <DemoAccountSeeder />
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      <UniversalBreadcrumb
        currentPage={currentPage}
        pageData={pageData}
        onNavigate={handleNavigate}
      />
      <main>{renderPage()}</main>
      <DynamicFooter
        onNavigate={handleNavigate}
        hasSidebar={currentPage.startsWith('creator-')}
      />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
