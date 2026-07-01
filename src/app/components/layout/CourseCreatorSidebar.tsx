import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  BarChart3, 
  Users, 
  DollarSign, 
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

interface CourseCreatorSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  className?: string;
}

export function CourseCreatorSidebar({ currentPage, onNavigate, className }: CourseCreatorSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const navItems = [
    {
      id: 'creator-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'creator-courses',
      label: 'My Courses',
      icon: BookOpen
    },
    {
      id: 'creator-analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'creator-subscribers',
      label: 'Subscribers',
      icon: Users
    },
    {
      id: 'creator-revenue',
      label: 'Revenue',
      icon: DollarSign
    },
    {
      id: 'creator-settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className={cn(
      "hidden lg:fixed lg:block left-0 top-20 h-[calc(100vh-5rem)] bg-card border-r border-border overflow-y-auto z-40 transition-all duration-300",
      isCollapsed ? "w-20" : "w-[300px]",
      className
    )}>
      <div className={cn("p-6 space-y-2", isCollapsed && "px-3")}>
        {/* Header with Collapse Button */}
        <div className="mb-6 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">Course Creator</h2>
              <p className="text-sm text-muted-foreground">Manage your content</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className={cn(
              "h-8 w-8 rounded-lg hover:bg-primary/10 flex-shrink-0",
              isCollapsed && "mx-auto"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || 
                            (item.id === 'creator-dashboard' && currentPage === 'creator') ||
                            (item.id === 'creator-courses' && currentPage === 'creator-course-management');
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full group flex items-center gap-3 rounded-lg transition-all duration-200",
                  isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3",
                  !isCollapsed && "hover:translate-x-1",
                  "hover:bg-primary/10",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <>
                    <div className={cn(
                      "flex-1 text-left text-sm font-medium",
                      isActive ? "text-primary-foreground" : ""
                    )}>
                      {item.label}
                    </div>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-primary-foreground animate-pulse" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// Hook to get the current sidebar state
export function useSidebarWidth() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        setIsCollapsed(savedState === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window updates
    const handleSidebarToggle = () => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        setIsCollapsed(savedState === 'true');
      }
    };
    
    window.addEventListener('sidebar-toggle', handleSidebarToggle);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
    };
  }, []);

  return isCollapsed ? 'ml-20' : 'ml-[300px]';
}