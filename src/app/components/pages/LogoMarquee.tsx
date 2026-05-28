import React, { useState, useRef, useEffect } from 'react';

interface Logo {
  name: string;
  url?: string;
  text?: string;
}

interface LogoMarqueeProps {
  logos: Logo[];
  speed?: number; // seconds for one complete loop
  pauseOnHover?: boolean;
}

export function LogoMarquee({ logos, speed = 30, pauseOnHover = true }: LogoMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling container */}
      <div
        ref={marqueeRef}
        className="flex gap-12 md:gap-16 py-6"
        style={{
          animationName: 'marquee-scroll',
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: 'reverse',
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform'
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 flex items-center justify-center h-12 md:h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer group"
            style={{ minWidth: '120px' }}
          >
            {logo.url ? (
              <img
                src={logo.url}
                alt={logo.name}
                className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const textSpan = document.createElement('span');
                  textSpan.className = 'text-sm md:text-base font-semibold text-muted-foreground group-hover:text-[#395192] transition-colors';
                  textSpan.textContent = logo.name.toUpperCase();
                  target.parentElement?.appendChild(textSpan);
                }}
              />
            ) : logo.text ? (
              <span className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-[#395192] transition-colors whitespace-nowrap">
                {logo.text}
              </span>
            ) : (
              <span className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-[#395192] transition-colors whitespace-nowrap">
                {logo.name.toUpperCase()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
