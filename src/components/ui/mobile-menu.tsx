import React, { useState, useEffect } from 'react';
import { X, Menu, Home, BookOpen, Brain, Users, Trophy, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './button';
import { Separator } from './separator';
import { Badge } from './badge';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut?: () => void;
}

export function MobileMenu({ currentPage, onNavigate, onSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPage]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home, roles: ['all'] },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'instructor', 'admin', 'psychologist', 'course_creator'] },
    { id: 'catalog', label: 'Courses', icon: BookOpen, roles: ['all'] },
    { id: 'iq-test-landing', label: 'IQ Test', icon: Brain, roles: ['all'] },
    { id: 'browse-psychologists', label: 'Psychologists', icon: Users, roles: ['all'] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, roles: ['student', 'instructor'] },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => {
    if (item.roles.includes('all')) return true;
    if (!user) return item.id === 'landing';
    return item.roles.includes(profile?.role || 'student');
  });

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-background border-r shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CerebroLearn
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {/* User Info */}
          {user && profile && (
            <>
              <div className="mb-4 p-3 rounded-lg bg-accent/50">
                <p className="font-semibold text-sm">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {profile.role === 'course_creator' ? 'Creator' : 
                   profile.role === 'org_admin' ? 'Org Admin' :
                   profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Badge>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Main Navigation */}
          <div className="space-y-1">
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          {user && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                {userMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer with Sign Out */}
        {user && onSignOut && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
