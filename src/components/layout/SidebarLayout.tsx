import React, { useState, useEffect } from 'react';
import { CourseCreatorSidebar } from './CourseCreatorSidebar';
import { cn } from '../ui/utils';

interface SidebarLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export function SidebarLayout({ currentPage, onNavigate, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Load initial state
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }

    // Listen for sidebar toggle changes
    const checkSidebarState = () => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        setIsCollapsed(savedState === 'true');
      }
    };

    // Poll for changes (since localStorage events don't fire in same window)
    const interval = setInterval(checkSidebarState, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      <CourseCreatorSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "lg:ml-20" : "lg:ml-[300px]"
      )}>
        <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
          <div className="py-6 px-4 md:py-8 md:px-6 lg:py-12 lg:px-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}