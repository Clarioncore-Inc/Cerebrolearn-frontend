import React, { useEffect, useRef } from 'react';

interface AnimatedGradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function AnimatedGradientBackground({ children, className = '' }: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-pulse"></div>
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-secondary/20 to-transparent blur-3xl"
        style={{
          animation: 'pulse-glow 8s ease-in-out infinite, float-up 6s ease-in-out infinite'
        }}
      ></div>
      <div
        className="absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-primary/15 to-secondary/15 blur-3xl"
        style={{
          animation: 'pulse-glow 10s ease-in-out infinite 2s, float-up 8s ease-in-out infinite 1s'
        }}
      ></div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 neural-grid opacity-30"></div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

      {children}
    </div>
  );
}
