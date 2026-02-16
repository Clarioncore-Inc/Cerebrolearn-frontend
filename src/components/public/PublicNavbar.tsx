import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Menu,
  X,
  BookOpen,
  Award,
  Users,
  HelpCircle,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PublicNavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function PublicNavbar({ onNavigate, currentPage = 'landing' }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const navLinks = [
    { label: 'Courses', page: 'catalog', icon: BookOpen },
    { label: 'Pricing', page: 'pricing', icon: Award },
    { label: 'About', page: 'about', icon: Users },
  ];

  const resourceLinks = [
    { label: 'FAQ', page: 'faq' },
    { label: 'Contact', page: 'contact' },
    { label: 'Help Center', page: 'faq' },
    { label: 'Blog', page: 'landing' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">CerebroLearn</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </button>
            ))}

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                onMouseEnter={() => setResourcesOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Resources
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setResourcesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-2"
                  >
                    {resourceLinks.map((link) => (
                      <button
                        key={link.page + link.label}
                        onClick={() => {
                          onNavigate(link.page);
                          setResourcesOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              Log In
            </Button>
            <Button onClick={() => onNavigate('signup')}>
              Sign Up Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t overflow-hidden"
          >
            <div className="container py-4 space-y-4">
              {/* Mobile Nav Links */}
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full py-2 text-left ${
                    currentPage === link.page
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </button>
              ))}

              {/* Mobile Resources */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground px-3 py-2">
                  Resources
                </p>
                {resourceLinks.map((link) => (
                  <button
                    key={link.page + link.label}
                    onClick={() => {
                      onNavigate(link.page);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
