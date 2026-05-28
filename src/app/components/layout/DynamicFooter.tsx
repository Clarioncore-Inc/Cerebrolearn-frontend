import React, { useState, useEffect } from 'react';
import { Footer } from './Footer';

interface DynamicFooterProps {
  onNavigate?: (page: string) => void;
  hasSidebar?: boolean;
}

export function DynamicFooter({ onNavigate, hasSidebar }: DynamicFooterProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!hasSidebar) return;

    // Load initial state
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }

    // Poll for changes (since localStorage events don't fire in same window)
    const checkSidebarState = () => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        const newState = savedState === 'true';
        if (newState !== isCollapsed) {
          setIsCollapsed(newState);
        }
      }
    };

    const interval = setInterval(checkSidebarState, 100);

    return () => clearInterval(interval);
  }, [hasSidebar, isCollapsed]);

  const marginClass = hasSidebar ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-[300px]') : '';

  return (
    <div className={`transition-all duration-300 ${marginClass}`}>
      <Footer onNavigate={onNavigate} hasSidebar={false} />
    </div>
  );
}
