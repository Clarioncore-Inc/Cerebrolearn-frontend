import React from 'react';
import { ScrollReveal } from './ScrollReveal';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInView({ children, className = '', delay = 0 }: FadeInViewProps) {
  return (
    <ScrollReveal direction="fade" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  );
}
