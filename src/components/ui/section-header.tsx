/**
 * Standardized Section Header Component
 * Ensures consistent styling for section headings across the platform
 */
import React from 'react';
import { Button } from './button';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from './utils';
import { IconContainer } from './icon-container';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon,
  iconVariant = 'primary',
  action,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <IconContainer 
            icon={icon} 
            size="lg" 
            variant={iconVariant}
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button 
          variant={action.variant || 'outline'} 
          onClick={action.onClick}
          className="gap-2"
        >
          {action.label}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
