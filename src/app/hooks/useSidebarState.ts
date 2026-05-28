import { useState, useEffect } from 'react';

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
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
  }, [isCollapsed]);

  return {
    isCollapsed,
    marginClass: isCollapsed ? 'lg:ml-20' : 'lg:ml-[300px]',
    widthClass: isCollapsed ? 'w-20' : 'w-[300px]'
  };
}
