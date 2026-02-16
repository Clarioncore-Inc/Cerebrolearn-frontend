/**
 * Standardized Stat Card Component
 * Ensures consistent styling for dashboard statistics
 */
import React from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';
import { DESIGN_TOKENS } from './design-tokens';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  detail?: string;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  gradient = 'from-primary to-secondary',
  detail,
  badgeText,
  className,
  onClick
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        'hover-lift card-glow overflow-hidden group cursor-pointer shadow-none hover:shadow-md transition-all',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'h-12 w-12 rounded-lg bg-gradient-to-br flex items-center justify-center',
            'group-hover:scale-110 transition-transform',
            gradient
          )}>
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          {(badgeText || detail) && (
            <Badge variant="secondary" className="text-xs">
              {badgeText || detail}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
