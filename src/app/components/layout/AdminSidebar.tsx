import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Brain,
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  DollarSign,
  Settings,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  ClipboardCheck,
  UserCheck,
  Calendar,
  Monitor,
  Shield,
  FileCheck,
  Lightbulb,
  Menu,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  currentPage,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isSeparator: false,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      isSeparator: false,
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: BookOpen,
      isSeparator: false,
    },
    {
      id: 'categories',
      label: 'Category Management',
      icon: FolderOpen,
      isSeparator: false,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: ClipboardCheck,
      isSeparator: false,
    },
    {
      id: 'psychologists',
      label: 'Psychologists',
      icon: UserCheck,
      isSeparator: false,
    },
    {
      id: 'admin_booking_management',
      label: 'Booking Management',
      icon: Calendar,
      isSeparator: false,
    },
    {
      id: 'admin_financials',
      label: 'Financials',
      icon: DollarSign,
      isSeparator: false,
    },
    {
      id: 'iq-practice-questions',
      label: 'IQ Practice Questions',
      icon: Brain,
      isSeparator: false,
    },
    {
      id: 'psychologist_analytics',
      label: 'Psychologist Analytics',
      icon: BarChart3,
      isSeparator: false,
    },
    {
      id: 'analytics',
      label: 'Global Analytics',
      icon: BarChart3,
      isSeparator: false,
    },
    {
      id: 'organizations',
      label: 'Organizations',
      icon: Building2,
      isSeparator: false,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      isSeparator: false,
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: Settings,
      isSeparator: false,
    },
    {
      id: 'genius-management',
      label: 'Genius Profiles',
      icon: Lightbulb,
      isSeparator: false,
    },
    {
      id: 'separator-1',
      label: 'Enterprise Tools',
      icon: BarChart3,
      description: '',
      isSeparator: true,
    },
    {
      id: 'platform-analytics',
      label: 'Platform Analytics',
      icon: BarChart3,
      description: 'Advanced metrics',
      isSeparator: false,
    },
    {
      id: 'quality-assurance',
      label: 'Quality Assurance',
      icon: FileCheck,
      description: 'Service quality',
      isSeparator: false,
    },
    {
      id: 'advanced-reports',
      label: 'Advanced Reports',
      icon: FileText,
      description: 'Custom reports',
      isSeparator: false,
    },
    {
      id: 'system-health',
      label: 'System Health',
      icon: Monitor,
      description: 'Health monitoring',
      isSeparator: false,
    },
    {
      id: 'compliance-manager',
      label: 'Compliance Manager',
      icon: Shield,
      description: 'Regulatory compliance',
      isSeparator: false,
    },
    {
      id: 'platform-settings',
      label: 'Platform Settings',
      icon: Settings,
      description: 'System configuration',
      isSeparator: false,
    },
  ];

  const renderNavigation = (isMobile = false) => (
    <ScrollArea className="flex-1 overflow-hidden px-3 py-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;

          if (item.isSeparator && !(collapsed && !isMobile)) {
            return (
              <div key={item.id} className="pb-2 pt-4">
                <Separator />
                <p className="mt-2 px-3 text-xs font-semibold text-muted-foreground">
                  {item.label}
                </p>
              </div>
            );
          }

          if (item.isSeparator && collapsed && !isMobile) {
            return null;
          }

          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                collapsed && !isMobile ? 'px-2' : 'px-3'
              } ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                if (isMobile) {
                  onCloseMobile?.();
                }
              }}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 ${collapsed && !isMobile ? '' : 'mr-3'}`} />
              {(!collapsed || isMobile) && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  {!isActive && item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              )}
            </Button>
          );
        })}
      </nav>
    </ScrollArea>
  );

  return (
    <>
      <div
        className={`fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300 md:block ${
          collapsed ? 'w-16' : 'w-[280px]'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="ml-3 mt-3 flex items-center justify-between p-4">
            {!collapsed && (
              <div>
                <h2 className="font-semibold">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Platform Management</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="ml-auto"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Separator />
          {renderNavigation()}

          {!collapsed && (
            <>
              <Separator />
              <div className="p-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="mb-1 text-sm font-medium">Platform Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <p className="text-xs text-muted-foreground">All Systems Operational</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={onCloseMobile}
            aria-label="Close admin menu"
          />

          <div className="absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col border-r bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="font-semibold">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Platform Management</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onCloseMobile}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {renderNavigation(true)}

            <div className="border-t p-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <p className="text-xs text-muted-foreground">All Systems Operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}