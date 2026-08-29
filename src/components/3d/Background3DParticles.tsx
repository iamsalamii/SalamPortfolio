import React, { useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';

export const Background3DParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useData();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = {
      x: -2000,
      y: -2000,
      radius: 160
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      baseAlpha: number;
    }

    const particles: Particle[] = [];
    const count = Math.min(Math.floor((width * height) / 16000), 65);
    
    // Adaptive color palette based on mode
    const darkPalette = ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#f8fafc'];
    const lightPalette = ['#0284c7', '#4f46e5', '#7c3aed', '#059669', '#64748b'];
    const colorPalette = isDarkMode ? darkPalette : lightPalette;

    for (let i = 0; i < count; i++) {
      const baseAlpha = isDarkMode ? Math.random() * 0.4 + 0.15 : Math.random() * 0.35 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        alpha: baseAlpha,
        baseAlpha
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse subtle radial glow
      if (mouse.x > 0 && mouse.y > 0) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
        if (isDarkMode) {
          glow.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
          glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
          glow.addColorStop(1, 'rgba(3, 7, 18, 0)');
        } else {
          glow.addColorStop(0, 'rgba(2, 132, 199, 0.06)');
          glow.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)');
          glow.addColorStop(1, 'rgba(248, 250, 252, 0)');
        }
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;

        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
          p.alpha = Math.min(p.baseAlpha * 2.2, 0.9);
        } else {
          p.alpha = p.baseAlpha;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distNodes < 110) {
            ctx.save();
            const linkAlpha = (1 - distNodes / 110) * (isDarkMode ? 0.12 : 0.1);
            ctx.globalAlpha = linkAlpha;
            ctx.strokeStyle = isDarkMode ? '#38bdf8' : '#6366f1';
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: isDarkMode ? 0.8 : 0.65 }}
    />
  );
};
