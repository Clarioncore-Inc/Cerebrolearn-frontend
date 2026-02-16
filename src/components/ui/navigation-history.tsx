import React, { useEffect, useState } from 'react';
import { History, Clock, X } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface NavigationHistoryProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
}

interface HistoryItem {
  page: string;
  label: string;
  timestamp: number;
  data?: any;
}

const PAGE_LABELS: Record<string, string> = {
  'landing': 'Home',
  'dashboard': 'Dashboard',
  'catalog': 'Course Catalog',
  'course-detail': 'Course Details',
  'lesson': 'Lesson',
  'iq-test-landing': 'IQ Test',
  'browse-psychologists': 'Psychologists',
  'student-sessions': 'My Sessions',
  'profile': 'My Profile',
  'leaderboard': 'Leaderboard',
  'payment': 'Payment',
  'creator-dashboard': 'Creator Dashboard',
  'creator-courses': 'My Courses',
  'creator-analytics': 'Analytics',
};

export function NavigationHistory({ currentPage, onNavigate }: NavigationHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('navigation_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load navigation history:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Add current page to history
    if (currentPage && currentPage !== 'landing') {
      const label = PAGE_LABELS[currentPage] || currentPage.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      
      setHistory((prev) => {
        // Don't add if it's the same as the last item
        if (prev.length > 0 && prev[0].page === currentPage) {
          return prev;
        }

        const newHistory: HistoryItem[] = [
          {
            page: currentPage,
            label,
            timestamp: Date.now(),
          },
          ...prev.filter(item => item.page !== currentPage).slice(0, 9), // Keep last 10, excluding current
        ];

        // Save to localStorage
        localStorage.setItem('navigation_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [currentPage]);

  const handleNavigate = (page: string, data?: any) => {
    onNavigate(page, data);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('navigation_history');
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Recent Pages" className="rounded-full">
          <History className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Recent Pages</span>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {history.map((item, index) => (
          <DropdownMenuItem
            key={`${item.page}-${index}`}
            onClick={() => handleNavigate(item.page, item.data)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {getTimeAgo(item.timestamp)}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
