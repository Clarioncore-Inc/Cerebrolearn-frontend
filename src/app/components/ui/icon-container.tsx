/**
 * Standardized Icon Container Component
 * Ensures consistent styling for icon wrappers across the platform
 */
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './utils';

interface IconContainerProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
  shape?: 'square' | 'rounded' | 'circle';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const variantClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  muted: 'bg-muted text-muted-foreground',
};

const shapeClasses = {
  square: 'rounded-md',
  rounded: 'rounded-lg',
  circle: 'rounded-full',
};

export function IconContainer({
  icon: Icon,
  size = 'md',
  variant = 'primary',
  shape = 'rounded',
  className,
}: IconContainerProps) {
  return (
    <div 
      className={cn(
        'flex items-center justify-center flex-shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        shapeClasses[shape],
        className
      )}
    >
      <Icon className={iconSizeClasses[size]} />
    </div>
  );
}
