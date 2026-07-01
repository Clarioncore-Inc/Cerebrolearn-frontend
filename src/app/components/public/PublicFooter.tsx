import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Send,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PublicFooterProps {
  onNavigate: (page: string) => void;
}

export function PublicFooter({ onNavigate }: PublicFooterProps) {
  const [email, setEmail] = React.useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thanks for subscribing! Check your email for confirmation.');
      setEmail('');
    }
  };

  const footerLinks = {
    product: {
      title: 'Product',
      links: [
        { label: 'Browse Courses', page: 'catalog' },
        { label: 'Pricing', page: 'pricing' },
        { label: 'Features', page: 'landing' },
        { label: 'Mobile Apps', page: 'landing' },
        { label: 'Enterprise', page: 'contact' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', page: 'about' },
        { label: 'Careers', page: 'about' },
        { label: 'Blog', page: 'landing' },
        { label: 'Press', page: 'about' },
        { label: 'Contact', page: 'contact' },
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        { label: 'Help Center', page: 'faq' },
        { label: 'FAQ', page: 'faq' },
        { label: 'Community', page: 'landing' },
        { label: 'Tutorials', page: 'catalog' },
        { label: 'API Docs', page: 'landing' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', page: 'landing' },
        { label: 'Terms of Service', page: 'landing' },
        { label: 'Cookie Policy', page: 'landing' },
        { label: 'Accessibility', page: 'landing' },
        { label: 'Licenses', page: 'landing' },
      ],
    },
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Twitter, label: 'Twitter', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Linkedin, label: 'LinkedIn', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
  ];

  return (
    <footer className="bg-muted/30 border-t mt-20">
      <div className="container py-12">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for the latest courses, tips, and updates.
              </p>
            </div>
            <form onSubmit={handleNewsletterSignup} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold">CerebroLearn</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering learners worldwide with interactive, engaging, and effective education.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="h-10 w-10 rounded-lg bg-muted hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} CerebroLearn. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>for learners worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
