import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();
  const cachedColorsRef = useRef<{ primary: number[]; secondary: number[] }>({
    primary: [57, 81, 146],
    secondary: [100, 182, 212]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Extract RGB values from CSS variable - only called once or when theme changes
    const extractRGB = (varName: string): number[] => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      const temp = document.createElement('div');
      temp.style.color = `hsl(${value})`;
      document.body.appendChild(temp);
      const rgb = getComputedStyle(temp).color.match(/\d+/g);
      document.body.removeChild(temp);
      return rgb ? [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])] : [57, 81, 146];
    };

    // Cache theme colors once
    cachedColorsRef.current = {
      primary: extractRGB('--primary'),
      secondary: extractRGB('--secondary')
    };

    // Fast color generator using cached RGB values
    const getThemeColor = (colorType: 'primary' | 'secondary', opacity: number) => {
      const rgb = cachedColorsRef.current[colorType];
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
    };

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize nodes
    const nodeCount = 30;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodesRef.current.forEach((node) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Get current theme colors (from cache)
      const primaryColor = getThemeColor('primary', 0.1);
      const secondaryColor = getThemeColor('secondary', 0.2);

      // Draw connections
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const dx = nodesRef.current[i].x - nodesRef.current[j].x;
          const dy = nodesRef.current[i].y - nodesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.strokeStyle = getThemeColor('primary', opacity);
            ctx.beginPath();
            ctx.moveTo(nodesRef.current[i].x, nodesRef.current[i].y);
            ctx.lineTo(nodesRef.current[j].x, nodesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodesRef.current.forEach((node) => {
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.fillStyle = getThemeColor('secondary', 0.1);
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
