import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { GlobalSearch } from '../ui/global-search';
import { NotificationCenter } from '../ui/notification-center';
import { KeyboardShortcuts } from '../ui/keyboard-shortcuts';
import { MobileMenu } from '../ui/mobile-menu';
import { NavigationHistory } from '../ui/navigation-history';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Moon,
  Sun,
  BookOpen,
  Trophy,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Brain,
  Users,
  Calendar,
  CreditCard,
  DollarSign,
  ChevronDown,
  GraduationCap,
  BarChart3,
  Flame,
  FileText,
  GitCompare,
  Target,
  Bookmark,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm'>
      <div className='flex h-20 items-center justify-between md:px-8 lg:px-12 px-[24px] py-[0px]'>
        <div className='flex items-center gap-12'>
          {/* Mobile Menu */}
          {user && (
            <MobileMenu
              currentPage={currentPage}
              onNavigate={onNavigate}
              onSignOut={handleSignOut}
            />
          )}

          <button
            onClick={() => onNavigate('landing')}
            className='flex items-center gap-3 group'
          >
            <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg'>
              <BookOpen className='h-5 w-5 text-white' />
            </div>
            <span className='font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              CerebroLearn
            </span>
          </button>

          {user && (
            <div className='hidden md:flex items-center gap-2'>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Dashboard
              </button>

              {/* Learning Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1 ${
                      [
                        'catalog',
                        'course-notes',
                        'course-comparison',
                        'my-learning-path',
                        'bookmarks',
                      ].includes(currentPage)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <GraduationCap className='h-4 w-4' />
                    Learning
                    <ChevronDown className='h-3 w-3' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-56'>
                  <DropdownMenuLabel>Course Tools</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onNavigate('catalog')}>
                    <BookOpen className='mr-2 h-4 w-4' />
                    Browse Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate('my-learning-path')}
                  >
                    <Target className='mr-2 h-4 w-4' />
                    My Learning Path
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate('course-comparison')}
                  >
                    <GitCompare className='mr-2 h-4 w-4' />
                    Compare Courses
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Study Tools</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onNavigate('course-notes')}>
                    <FileText className='mr-2 h-4 w-4' />
                    My Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('bookmarks')}>
                    <Bookmark className='mr-2 h-4 w-4' />
                    Bookmarks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Progress Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1 ${
                      [
                        'progress-dashboard',
                        'learning-streak',
                        'leaderboard',
                      ].includes(currentPage)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <BarChart3 className='h-4 w-4' />
                    Progress
                    <ChevronDown className='h-3 w-3' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-56'>
                  <DropdownMenuItem
                    onClick={() => onNavigate('progress-dashboard')}
                  >
                    <BarChart3 className='mr-2 h-4 w-4' />
                    Learning Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate('learning-streak')}
                  >
                    <Flame className='mr-2 h-4 w-4' />
                    Streak Tracker
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('leaderboard')}>
                    <Trophy className='mr-2 h-4 w-4' />
                    Leaderboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1 ${
                      [
                        'iq-test-landing',
                        'browse-psychologists',
                        'student-sessions',
                      ].includes(currentPage)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Brain className='h-4 w-4' />
                    Services
                    <ChevronDown className='h-3 w-3' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-56'>
                  <DropdownMenuItem
                    onClick={() => onNavigate('iq-test-landing')}
                  >
                    <Brain className='mr-2 h-4 w-4' />
                    IQ Assessment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate('browse-psychologists')}
                  >
                    <Users className='mr-2 h-4 w-4' />
                    Find Psychologists
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate('student-sessions')}
                  >
                    <Calendar className='mr-2 h-4 w-4' />
                    My Sessions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className='flex items-center gap-6'>
          {/* Global Search for Admin/Instructor */}
          {user &&
            profile &&
            (profile.role === 'admin' ||
              profile.role === 'org_admin' ||
              profile.role === 'instructor') && (
              <div className='hidden lg:block'>
                <GlobalSearch onNavigate={onNavigate} />
              </div>
            )}

          {/* Navigation History */}
          {user && (
            <NavigationHistory
              currentPage={currentPage}
              onNavigate={onNavigate}
            />
          )}

          {/* Notification Center */}
          {user && profile && <NotificationCenter />}

          {/* Keyboard Shortcuts */}
          {user &&
            profile &&
            (profile.role === 'admin' ||
              profile.role === 'org_admin' ||
              profile.role === 'instructor') && <KeyboardShortcuts />}

          <Button
            variant='ghost'
            size='icon'
            onClick={toggleTheme}
            className='rounded-full'
          >
            {theme === 'dark' ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>

          {user && profile ? (
            <div className='flex items-center gap-3'>
              <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border'>
                <Trophy className='h-4 w-4 text-yellow-500' />
                <span className='text-sm font-medium'>
                  {profile.xp || 0} XP
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full'
                  >
                    <Avatar>
                      <AvatarImage src={profile.avatar || undefined} />
                      <AvatarFallback>
                        {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p>{profile.full_name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {profile.email}
                      </p>
                      <Badge variant='secondary' className='w-fit mt-1'>
                        {profile.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                    <LayoutDashboard className='mr-2 h-4 w-4' />
                    Dashboard
                  </DropdownMenuItem>
                  {(profile.role === 'instructor' ||
                    profile.role === 'admin') && (
                    <DropdownMenuItem onClick={() => onNavigate('instructor')}>
                      <BookOpen className='mr-2 h-4 w-4' />
                      Instructor Panel
                    </DropdownMenuItem>
                  )}
                  {(profile.role === 'org_admin' ||
                    profile.role === 'admin') && (
                    <DropdownMenuItem onClick={() => onNavigate('admin')}>
                      <Settings className='mr-2 h-4 w-4' />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  {profile.role === 'student' && (
                    <DropdownMenuItem
                      onClick={() => onNavigate('student-payment-history')}
                    >
                      <CreditCard className='mr-2 h-4 w-4' />
                      Payment History
                    </DropdownMenuItem>
                  )}
                  {profile.role === 'psychologist' && (
                    <DropdownMenuItem
                      onClick={() => onNavigate('psychologist-earnings')}
                    >
                      <DollarSign className='mr-2 h-4 w-4' />
                      Earnings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                onClick={() => onNavigate('auth', { authMode: 'login' })}
              >
                Sign In
              </Button>
              <Button onClick={() => onNavigate('auth')}>Get Started</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
