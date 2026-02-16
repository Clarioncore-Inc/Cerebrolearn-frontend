import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { AdminDashboard } from '../dashboard/AdminDashboard';
import { UserManagementPage } from './UserManagementPage';
import { CourseManagementPage } from './CourseManagementPage';
import { CategoryManagementPage } from './CategoryManagementPage';
import { GlobalAnalyticsPage } from './GlobalAnalyticsPage';
import { ApplicationsPage } from './ApplicationsPage';
import { PsychologistManagementPage } from './PsychologistManagementPage';
import { AdminFinancials } from './AdminFinancials';
import { AdminPsychologistManagement } from './AdminPsychologistManagement';
import { AdminBookingManagement } from './AdminBookingManagement';
import { PsychologistAnalytics } from './PsychologistAnalytics';
import { PlatformAnalyticsDashboard } from './PlatformAnalyticsDashboard';
import { QualityAssuranceDashboard } from './QualityAssuranceDashboard';
import { ComplianceManager } from './ComplianceManager';
import { SystemHealthMonitor } from './SystemHealthMonitor';
import { AdvancedReportGenerator } from './AdvancedReportGenerator';
import { PlatformSettingsManager } from './PlatformSettingsManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Breadcrumb, useBreadcrumbs } from '../ui/breadcrumb';
import { StatCard } from '../ui/stat-card';
import { SectionHeader } from '../ui/section-header';
import { IconContainer } from '../ui/icon-container';
import { EmptyState } from '../ui/empty-state';
import { QuickActions } from '../ui/quick-actions';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Building2,
  Download,
  FileText,
  Settings
} from 'lucide-react';

export function AdminPortal() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const breadcrumbs = useBreadcrumbs(currentPage, setCurrentPage);

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    // Listen for navigation events from dashboard
    const handleNavigate = (event: any) => {
      setCurrentPage(event.detail);
    };
    
    window.addEventListener('navigate-admin', handleNavigate);
    return () => window.removeEventListener('navigate-admin', handleNavigate);
  }, []);

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagementPage />;
      case 'courses':
        return <CourseManagementPage />;
      case 'categories':
        return <CategoryManagementPage />;
      case 'analytics':
        return <GlobalAnalyticsPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'revenue':
        return <RevenuePage />;
      case 'organizations':
        return <OrganizationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <PlatformSettingsPage />;
      case 'psychologists':
        return <PsychologistManagementPage />;
      case 'admin_psychologist_management':
        return <AdminPsychologistManagement />;
      case 'admin_booking_management':
        return <AdminBookingManagement />;
      case 'admin_financials':
        return <AdminFinancials />;
      case 'psychologist_analytics':
        return <PsychologistAnalytics />;
      case 'platform-analytics':
        return <PlatformAnalyticsDashboard onNavigate={() => {}} />;
      case 'quality-assurance':
        return <QualityAssuranceDashboard onNavigate={() => {}} />;
      case 'compliance-manager':
        return <ComplianceManager onNavigate={() => {}} />;
      case 'system-health':
        return <SystemHealthMonitor onNavigate={() => {}} />;
      case 'advanced-reports':
        return <AdvancedReportGenerator onNavigate={() => {}} />;
      case 'platform-settings':
        return <PlatformSettingsManager onNavigate={() => {}} />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-[280px]'
        } max-md:ml-0`}
      >
        {/* Breadcrumb Navigation */}
        {currentPage !== 'dashboard' && (
          <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-20">
            <div className="container py-3">
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>
        )}
        
        {renderPage()}
      </div>
      
      {/* Quick Actions Floating Button - Hide on small screens */}
      <div className="hidden md:block">
        <QuickActions onNavigate={setCurrentPage} />
      </div>
    </div>
  );
}

// Revenue Page Component
function RevenuePage() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$125,430',
      change: '+18.2%',
      icon: DollarSign,
    },
    {
      label: 'Platform Revenue',
      value: '$25,086',
      change: '+18.2%',
      icon: TrendingUp,
    },
    {
      label: 'Creator Earnings',
      value: '$100,344',
      change: '+18.2%',
      icon: Users,
    },
    {
      label: 'Pending Payouts',
      value: '$12,450',
      change: '-5.3%',
      icon: BookOpen,
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="mb-2">Revenue & Payouts</h1>
        <p className="text-muted-foreground">
          Track platform revenue and creator payouts
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IconContainer icon={stat.icon} size="lg" variant="primary" />
                <span
                  className={`text-sm font-medium ${
                    stat.change.startsWith('+')
                      ? 'text-success'
                      : 'text-destructive'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Revenue tracking and payout management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Organizations Page Component
function OrganizationsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="mb-2">Organizations</h1>
        <p className="text-muted-foreground">
          Manage multi-tenant organizations and teams
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Organization management features will be added in Phase 6
            </p>
            <Button variant="outline">Create Organization</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reports Page Component
function ReportsPage() {
  const reports = [
    {
      name: 'User Activity Report',
      description: 'Detailed user engagement and activity data',
      icon: Users,
    },
    {
      name: 'Course Performance Report',
      description: 'Completion rates, ratings, and enrollment trends',
      icon: BookOpen,
    },
    {
      name: 'Revenue Report',
      description: 'Financial summary and revenue breakdown',
      icon: DollarSign,
    },
    {
      name: 'Platform Analytics Report',
      description: 'Comprehensive platform-wide analytics',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="mb-2">Reports & Exports</h1>
        <p className="text-muted-foreground">
          Generate and download platform reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.name}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Build custom reports with specific date ranges and filters
            </p>
            <Button>Create Custom Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Platform Settings Page Component
function PlatformSettingsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure global platform settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Platform settings and configuration options
            </p>
            <Button variant="outline">Configure Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}