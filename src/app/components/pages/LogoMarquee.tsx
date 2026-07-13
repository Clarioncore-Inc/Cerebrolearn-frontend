import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

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

export function LogoMarquee({
  logos,
  speed = 30,
  pauseOnHover = true,
}: LogoMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const loopWidthRef = useRef(0);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  useEffect(() => {
    const updateLoopWidth = () => {
      if (!marqueeRef.current) return;
      loopWidthRef.current = marqueeRef.current.scrollWidth / 2;
    };

    updateLoopWidth();

    if (!marqueeRef.current || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateLoopWidth);
      return () => window.removeEventListener('resize', updateLoopWidth);
    }

    const observer = new ResizeObserver(updateLoopWidth);
    observer.observe(marqueeRef.current);
    window.addEventListener('resize', updateLoopWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLoopWidth);
    };
  }, [duplicatedLogos.length]);

  useAnimationFrame((_, delta) => {
    if (isPaused) return;

    const loopWidth = loopWidthRef.current;
    if (!loopWidth) return;

    const pixelsPerSecond = loopWidth / speed;
    const nextX = x.get() - pixelsPerSecond * (delta / 1000);

    if (nextX <= -loopWidth) {
      x.set(nextX + loopWidth);
      return;
    }

    x.set(nextX);
  });

  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >

      {/* Scrolling container */}
      <motion.div
        ref={marqueeRef}
        className="flex w-max gap-12 md:gap-16 py-6"
        style={{ x }}
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
      </motion.div>
    </div>
  );
}
