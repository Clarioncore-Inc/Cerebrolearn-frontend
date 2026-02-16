import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, BookOpen, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FooterProps {
  onNavigate?: (page: string) => void;
  hasSidebar?: boolean;
}

export function Footer({ onNavigate, hasSidebar }: FooterProps) {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className={`w-full bg-gradient-to-br from-background via-primary/5 to-secondary/5 border-t border-border/50 ${hasSidebar ? 'lg:ml-64' : ''}`}>
      {/* Main Footer Section */}
      <section className="border-t border-border/50">
        <div className="py-20 px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Footer Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-16 mb-16">
              {/* Logo and Description Column */}
              <div className="lg:col-span-4">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-xl gradient-text">
                    CerebroLearn
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Transforming online education with accessible, engaging, and interactive learning experiences. Join thousands of learners worldwide.
                </p>

                {/* Newsletter */}
                <div className="space-y-4">
                  <p className="font-medium text-foreground">Subscribe to our newsletter</p>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-background/50 border-border/50 h-11"
                    />
                    <Button size="icon" className="flex-shrink-0 h-11 w-11">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Explore Column */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-lg mb-8 text-foreground">
                  Explore
                </h3>
                <ul className="space-y-3.5">
                  <li>
                    <button 
                      onClick={() => handleNavigation('catalog')}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      Browse Courses
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('dashboard')}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      My Learning
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('leaderboard')}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      Leaderboard
                    </button>
                  </li>
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Achievements
                    </button>
                  </li>
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Instructors
                    </button>
                  </li>
                </ul>
              </div>

              {/* Support Column */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-lg mb-8 text-foreground">
                  Support
                </h3>
                <ul className="space-y-3.5">
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      Accessibility
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Column */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-lg mb-8 text-foreground">
                  Contact
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">hello@cerebrolearn.com</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm">San Francisco, CA</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Media and Bottom Bar */}
            <div className="pt-10 border-t border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Social Media Icons */}
                <div className="flex items-center gap-6">
                  <button 
                    className="w-11 h-11 rounded-full bg-muted hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-muted-foreground hover:text-white transition-all flex items-center justify-center hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" fill="currentColor" />
                  </button>
                  <button 
                    className="w-11 h-11 rounded-full bg-muted hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-muted-foreground hover:text-white transition-all flex items-center justify-center hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" fill="currentColor" />
                  </button>
                  <button 
                    className="w-11 h-11 rounded-full bg-muted hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-muted-foreground hover:text-white transition-all flex items-center justify-center hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button 
                    className="w-11 h-11 rounded-full bg-muted hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-muted-foreground hover:text-white transition-all flex items-center justify-center hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" fill="currentColor" />
                  </button>
                  <button 
                    className="w-11 h-11 rounded-full bg-muted hover:bg-gradient-to-br hover:from-primary hover:to-secondary text-muted-foreground hover:text-white transition-all flex items-center justify-center hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" fill="currentColor" />
                  </button>
                </div>

                {/* Copyright and Legal Links */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <p className="text-sm text-muted-foreground">
                    © 2025 CerebroLearn Inc. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Privacy
                    </button>
                    <span className="text-muted-foreground">•</span>
                    <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Terms
                    </button>
                    <span className="text-muted-foreground">•</span>
                    <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Cookies
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}