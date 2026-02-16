import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface BackButtonProps {
  onBack?: () => void;
  label?: string;
  fallbackPage?: string;
  onNavigate?: (page: string) => void;
  className?: string;
}

export function BackButton({ 
  onBack, 
  label = 'Back', 
  fallbackPage,
  onNavigate,
  className = ''
}: BackButtonProps) {
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's navigation history
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      window.history.back();
    } else if (fallbackPage && onNavigate) {
      onNavigate(fallbackPage);
    }
  };

  // Keyboard shortcut: Alt+Left Arrow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, canGoBack, fallbackPage]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`gap-2 ${className}`}
      title="Go back (Alt+Left Arrow)"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}

// Contextual back button with automatic page detection
interface SmartBackButtonProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  className?: string;
}

export function SmartBackButton({ currentPage, onNavigate, className = '' }: SmartBackButtonProps) {
  // Define parent pages for smart navigation
  const pageHierarchy: Record<string, { parent: string; label?: string }> = {
    // Course navigation
    'course-detail': { parent: 'catalog', label: 'Back to Courses' },
    'lesson': { parent: 'course-detail', label: 'Back to Course' },
    'quiz': { parent: 'course-detail', label: 'Back to Course' },
    
    // Category navigation
    'subcategory': { parent: 'category', label: 'Back to Category' },
    'category': { parent: 'catalog', label: 'Back to Catalog' },
    
    // Admin navigation
    'users': { parent: 'dashboard', label: 'Back to Dashboard' },
    'courses': { parent: 'dashboard', label: 'Back to Dashboard' },
    'analytics': { parent: 'dashboard', label: 'Back to Dashboard' },
    'applications': { parent: 'dashboard', label: 'Back to Dashboard' },
    
    // Psychologist navigation
    'appointment-booking': { parent: 'browse-psychologists', label: 'Back to Psychologists' },
    'psychologist-profile': { parent: 'browse-psychologists', label: 'Back to Browse' },
    
    // IQ Test navigation
    'iq-test': { parent: 'iq-test-landing', label: 'Back to IQ Test Home' },
    'iq-test-results': { parent: 'iq-test-landing', label: 'Back to IQ Test Home' },
    
    // Payment navigation
    'payment': { parent: 'course-detail', label: 'Back to Course' },
    'payment-confirmation': { parent: 'dashboard', label: 'Back to Dashboard' },
    
    // Profile navigation
    'profile': { parent: 'dashboard', label: 'Back to Dashboard' },
    'settings': { parent: 'dashboard', label: 'Back to Dashboard' },
  };

  const hierarchy = pageHierarchy[currentPage];
  
  if (!hierarchy) {
    return null; // Don't show back button on top-level pages
  }

  return (
    <BackButton
      onNavigate={onNavigate}
      fallbackPage={hierarchy.parent}
      label={hierarchy.label || 'Back'}
      className={className}
    />
  );
}
