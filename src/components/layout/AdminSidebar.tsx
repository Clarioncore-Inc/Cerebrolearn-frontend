import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
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
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  currentPage,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & stats',
      isSeparator: false,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage users & roles',
      isSeparator: false,
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: BookOpen,
      description: 'Manage all courses',
      isSeparator: false,
    },
    {
      id: 'categories',
      label: 'Category Management',
      icon: FolderOpen,
      description: 'Manage categories',
      isSeparator: false,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: ClipboardCheck,
      description: 'Review applications',
      isSeparator: false,
    },
    {
      id: 'psychologists',
      label: 'Psychologists',
      icon: UserCheck,
      description: 'Manage psychologists',
      isSeparator: false,
    },
    {
      id: 'admin_psychologist_management',
      label: 'Psychologist Management',
      icon: UserCheck,
      description: 'Verify & manage',
      isSeparator: false,
    },
    {
      id: 'admin_booking_management',
      label: 'Booking Management',
      icon: Calendar,
      description: 'Monitor bookings',
      isSeparator: false,
    },
    {
      id: 'admin_financials',
      label: 'Financials',
      icon: DollarSign,
      description: 'Revenue & payouts',
      isSeparator: false,
    },
    {
      id: 'psychologist_analytics',
      label: 'Psychologist Analytics',
      icon: BarChart3,
      description: 'Performance insights',
      isSeparator: false,
    },
    {
      id: 'analytics',
      label: 'Global Analytics',
      icon: BarChart3,
      description: 'Platform insights',
      isSeparator: false,
    },
    {
      id: 'organizations',
      label: 'Organizations',
      icon: Building2,
      description: 'Manage orgs',
      isSeparator: false,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Export reports',
      isSeparator: false,
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: Settings,
      description: 'Configure platform',
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

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300 z-30 max-md:hidden ${
        collapsed ? 'w-16' : 'w-[280px]'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
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

        {/* Menu Items */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              
              // Render separator
              if (item.isSeparator && !collapsed) {
                return (
                  <div key={item.id} className="pt-4 pb-2">
                    <Separator />
                    <p className="text-xs font-semibold text-muted-foreground mt-2 px-3">
                      {item.label}
                    </p>
                  </div>
                );
              }
              
              // Skip separator when collapsed
              if (item.isSeparator && collapsed) {
                return null;
              }
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    collapsed ? 'px-2' : 'px-3'
                  } ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{item.label}</p>
                      {!isActive && (
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {!collapsed && (
          <>
            <Separator />
            <div className="p-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Platform Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-muted-foreground">All Systems Operational</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}