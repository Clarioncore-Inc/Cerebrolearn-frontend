import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from './button';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-muted-foreground hover:text-foreground"
        onClick={items[0]?.onClick}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${
              index === items.length - 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={item.onClick}
            disabled={index === items.length - 1}
          >
            {item.icon && <item.icon className="h-4 w-4 mr-1.5" />}
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  );
}

// Hook to generate breadcrumbs from page name
export function useBreadcrumbs(currentPage: string, onNavigate: (page: string) => void): BreadcrumbItem[] {
  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    'dashboard': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }],
    'users': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'User Management' }],
    'courses': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Course Management' }],
    'categories': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Category Management' }],
    'applications': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Applications' }],
    'psychologists': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Psychologists' }],
    'admin_psychologist_management': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Psychologist Management' }],
    'admin_booking_management': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Booking Management' }],
    'admin_financials': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Financials' }],
    'psychologist_analytics': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Psychologist Analytics' }],
    'analytics': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Global Analytics' }],
    'platform-analytics': [
      { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
      { label: 'Enterprise Tools' },
      { label: 'Platform Analytics' }
    ],
    'quality-assurance': [
      { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
      { label: 'Enterprise Tools' },
      { label: 'Quality Assurance' }
    ],
    'advanced-reports': [
      { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
      { label: 'Enterprise Tools' },
      { label: 'Advanced Reports' }
    ],
    'system-health': [
      { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
      { label: 'Enterprise Tools' },
      { label: 'System Health' }
    ],
    'compliance-manager': [
      { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
      { label: 'Enterprise Tools' },
      { label: 'Compliance Manager' }
    ],
    'platform-settings': [
      { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
      { label: 'Enterprise Tools' },
      { label: 'Platform Settings' }
    ],
    'organizations': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Organizations' }],
    'reports': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Reports' }],
    'settings': [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }, { label: 'Settings' }],
  };

  return breadcrumbMap[currentPage] || [{ label: 'Dashboard', onClick: () => onNavigate('dashboard') }];
}