import React from 'react';
import { ScrollReveal } from './ScrollReveal';

interface SlideInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SlideInView({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}: SlideInViewProps) {
  return (
    <ScrollReveal direction={direction} delay={delay} className={className}>
      {children}
    </ScrollReveal>
  );
}
