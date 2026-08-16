import React from 'react';
import { Cog, Lightbulb } from 'lucide-react';

interface SkillsExpertiseIconProps {
  className?: string;
}

export function SkillsExpertiseIcon({ className = '' }: SkillsExpertiseIconProps) {
  return (
    <span className={`relative inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`.trim()}>
      <Cog className='absolute inset-0 h-full w-full' strokeWidth={2.2} />
      <span className='relative z-10 flex h-[72%] w-[72%] items-center justify-center rounded-full bg-background'>
        <Lightbulb className='h-full w-full' strokeWidth={2.4} />
      </span>
    </span>
  );
}