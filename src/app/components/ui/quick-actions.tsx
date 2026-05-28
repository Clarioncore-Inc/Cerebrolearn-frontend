import React, { useState } from 'react';
import { Plus, Users, BookOpen, FileText, UserPlus, Settings, X } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  description?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onNavigate?: (page: string) => void;
}

export function QuickActions({ actions, onNavigate }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultActions: QuickAction[] = [
    {
      id: 'add-user',
      label: 'Add User',
      icon: UserPlus,
      description: 'Create new user account',
      action: () => {
        onNavigate?.('users');
        setIsOpen(false);
      },
    },
    {
      id: 'add-course',
      label: 'Add Course',
      icon: BookOpen,
      description: 'Create new course',
      action: () => {
        onNavigate?.('courses');
        setIsOpen(false);
      },
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: FileText,
      description: 'Create custom report',
      action: () => {
        onNavigate?.('advanced-reports');
        setIsOpen(false);
      },
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      icon: Users,
      description: 'Platform analytics',
      action: () => {
        onNavigate?.('platform-analytics');
        setIsOpen(false);
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Platform settings',
      action: () => {
        onNavigate?.('platform-settings');
        setIsOpen(false);
      },
    },
  ];

  const quickActions = actions || defaultActions;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 mb-2">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {quickActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={action.action}
              className="cursor-pointer py-3"
            >
              <action.icon className="h-5 w-5 mr-3 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">{action.label}</p>
                {action.description && (
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
