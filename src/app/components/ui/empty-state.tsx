/**
 * Standardized Empty State Component
 * Ensures consistent styling for empty states across the platform
 */
import React from 'react';
import { Button } from './button';
import { Card } from './card';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  gradient?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  gradient = 'from-primary to-secondary',
  className
}: EmptyStateProps) {
  const ActionIcon = action?.icon;
  
  return (
    <Card className={cn('p-12 text-center hover-lift border-2 shadow-none hover:shadow-md transition-all', className)}>
      <div className={cn(
        'mx-auto w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center mb-4',
        'animate-bounce-subtle',
        gradient
      )}>
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} size="lg" className="gap-2">
          {ActionIcon && <ActionIcon className="h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </Card>
  );
}
