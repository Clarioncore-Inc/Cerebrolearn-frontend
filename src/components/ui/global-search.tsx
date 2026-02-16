import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, BookOpen, UserCheck, Settings, BarChart3, FileCheck, Shield, Monitor, FileText, Command } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Input } from './input';
import { Button } from './button';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface GlobalSearchProps {
  onNavigate?: (page: string) => void;
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const allSearchableItems: SearchResult[] = [
    // Core Pages
    { id: 'users', title: 'User Management', description: 'Manage platform users and roles', category: 'Management', icon: Users, action: () => navigate('users') },
    { id: 'courses', title: 'Course Management', description: 'Manage courses and content', category: 'Management', icon: BookOpen, action: () => navigate('courses') },
    { id: 'categories', title: 'Category Management', description: 'Organize course categories', category: 'Management', icon: FileText, action: () => navigate('categories') },
    { id: 'applications', title: 'Applications', description: 'Review instructor applications', category: 'Management', icon: FileCheck, action: () => navigate('applications') },
    
    // Psychologist Tools
    { id: 'psychologists', title: 'Psychologists', description: 'Manage psychologist profiles', category: 'Psychology', icon: UserCheck, action: () => navigate('psychologists') },
    { id: 'psychologist_management', title: 'Psychologist Management', description: 'Verify and manage psychologists', category: 'Psychology', icon: UserCheck, action: () => navigate('admin_psychologist_management') },
    { id: 'booking_management', title: 'Booking Management', description: 'Monitor appointments and bookings', category: 'Psychology', icon: FileCheck, action: () => navigate('admin_booking_management') },
    { id: 'financials', title: 'Financials', description: 'Revenue and payouts', category: 'Finance', icon: BarChart3, action: () => navigate('admin_financials') },
    
    // Enterprise Tools
    { id: 'platform_analytics', title: 'Platform Analytics', description: 'Comprehensive metrics and KPIs', category: 'Enterprise', icon: BarChart3, action: () => navigate('platform-analytics') },
    { id: 'quality_assurance', title: 'Quality Assurance', description: 'Service quality monitoring', category: 'Enterprise', icon: FileCheck, action: () => navigate('quality-assurance') },
    { id: 'advanced_reports', title: 'Advanced Reports', description: 'Custom report generation', category: 'Enterprise', icon: FileText, action: () => navigate('advanced-reports') },
    { id: 'system_health', title: 'System Health', description: 'Monitor system performance', category: 'Enterprise', icon: Monitor, action: () => navigate('system-health') },
    { id: 'compliance', title: 'Compliance Manager', description: 'Track regulatory compliance', category: 'Enterprise', icon: Shield, action: () => navigate('compliance-manager') },
    { id: 'platform_settings', title: 'Platform Settings', description: 'Configure system settings', category: 'Enterprise', icon: Settings, action: () => navigate('platform-settings') },
    
    // Analytics
    { id: 'analytics', title: 'Global Analytics', description: 'Platform-wide insights', category: 'Analytics', icon: BarChart3, action: () => navigate('analytics') },
    { id: 'psychologist_analytics', title: 'Psychologist Analytics', description: 'Psychologist performance data', category: 'Analytics', icon: BarChart3, action: () => navigate('psychologist_analytics') },
  ];

  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.dispatchEvent(new CustomEvent('navigate-admin', { detail: page }));
    }
    setOpen(false);
    setQuery('');
  };

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allSearchableItems.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, []);

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="relative w-64 justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">Global Search</DialogTitle>
            <DialogDescription className="sr-only">
              Search across all admin pages, tools, and features
            </DialogDescription>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages, tools, and features..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 border-0 focus-visible:ring-0 text-base"
                autoFocus
              />
            </div>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto p-4 pt-2">
            {query && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            )}

            {!query && (
              <div className="text-center py-8 text-muted-foreground">
                <Command className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Type to search pages and features</p>
                <p className="text-xs mt-2">Press <kbd className="px-2 py-1 bg-muted rounded">Cmd+K</kbd> to open anytime</p>
              </div>
            )}

            {Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">{category}</p>
                <div className="space-y-1">
                  {items.map((result) => (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
                      onClick={result.action}
                    >
                      <result.icon className="h-5 w-5 mr-3 text-primary" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}