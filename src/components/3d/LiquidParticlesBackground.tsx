import React, { useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';

export const LiquidParticlesBackground: React.FC = () => {
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
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
      speed: 0
    };

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      mouse.speed = Math.min(Math.hypot(dx, dy), 50);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Liquid Ripples
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }
    const ripples: Ripple[] = [];

    // Liquid Particles with Fluid Springs
    interface FluidParticle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      angle: number;
      speed: number;
    }

    const particles: FluidParticle[] = [];
    const count = Math.min(Math.floor((width * height) / 14000), 55);

    const darkPalette = ['#06b6d4', '#8b5cf6', '#38bdf8', '#10b981', '#f8fafc'];
    const lightPalette = ['#0284c7', '#4f46e5', '#7c3aed', '#059669', '#64748b'];
    const colorPalette = isDarkMode ? darkPalette : lightPalette;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseAlpha = Math.random() * 0.35 + 0.15;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        alpha: baseAlpha,
        baseAlpha,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    let time = 0;

    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Spawn subtle ripples on movement
      if (mouse.speed > 5 && Math.random() > 0.6) {
        ripples.push({
          x: mouse.x,
          y: mouse.y,
          radius: 10,
          maxRadius: Math.min(120 + mouse.speed * 2, 220),
          alpha: isDarkMode ? 0.25 : 0.18,
          color: isDarkMode ? '6, 182, 212' : '2, 132, 199'
        });
      }
      mouse.speed *= 0.92;

      // Render Liquid Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.5;
        r.alpha *= 0.96;

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Render Ambient Fluid Mesh behind mouse
      if (mouse.x > 0 && mouse.y > 0) {
        const fluidGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        if (isDarkMode) {
          fluidGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
          fluidGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
          fluidGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
        } else {
          fluidGrad.addColorStop(0, 'rgba(2, 132, 199, 0.06)');
          fluidGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)');
          fluidGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
        }
        ctx.fillStyle = fluidGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Update and draw fluid particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid drifting
        p.angle += p.speed;
        p.x += p.vx + Math.sin(p.angle + time) * 0.4;
        p.y += p.vy + Math.cos(p.angle + time) * 0.4;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse displacement & wave interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius);
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
          p.alpha = Math.min(p.baseAlpha * 2.5, 0.9);
        } else {
          p.alpha = p.baseAlpha;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect fluid threads
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (distNodes < 120) {
            ctx.save();
            const linkAlpha = (1 - distNodes / 120) * (isDarkMode ? 0.15 : 0.1);
            ctx.globalAlpha = linkAlpha;
            ctx.strokeStyle = isDarkMode ? '#38bdf8' : '#6366f1';
            ctx.lineWidth = 0.8;
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: isDarkMode ? 0.85 : 0.7 }}
    />
  );
};
