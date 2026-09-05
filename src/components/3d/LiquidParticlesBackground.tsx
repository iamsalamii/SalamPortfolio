import React, { useEffect, useRef } from 'react';

export const LiquidParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      radius: 190,
      speed: 0
    };

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      mouse.speed = Math.min(Math.hypot(dx, dy), 60);
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
    const count = Math.min(Math.floor((width * height) / 14000), 60);

    // High-contrast Dark Brutalist palette: Electric Crimson, Neon Ruby, Crisp White, and Zinc
    const crimsonPalette = ['#ef4444', '#ff2a5f', '#ffffff', '#dc2626', '#f43f5e', '#71717a'];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseAlpha = Math.random() * 0.4 + 0.35; // High base visibility
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.5 + 1.8,
        color: crimsonPalette[Math.floor(Math.random() * crimsonPalette.length)],
        alpha: baseAlpha,
        baseAlpha,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.025 + 0.008
      });
    }

    let time = 0;

    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      // Spawn distinct ripples on mouse motion
      if (mouse.speed > 4 && Math.random() > 0.55) {
        ripples.push({
          x: mouse.x,
          y: mouse.y,
          radius: 10,
          maxRadius: Math.min(120 + mouse.speed * 2.5, 240),
          alpha: 0.5,
          color: '239, 68, 68'
        });
      }
      mouse.speed *= 0.92;

      // Render Liquid Ripples with high clarity
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.8;
        r.alpha *= 0.95;

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }

      // Render Ambient Crimson Glow behind mouse
      if (mouse.x > 0 && mouse.y > 0) {
        const fluidGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
        fluidGrad.addColorStop(0, 'rgba(239, 68, 68, 0.12)');
        fluidGrad.addColorStop(0.5, 'rgba(220, 38, 38, 0.04)');
        fluidGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fluidGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Update and draw fluid particles with high contrast
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid drifting
        p.angle += p.speed;
        p.x += p.vx + Math.sin(p.angle + time) * 0.45;
        p.y += p.vy + Math.cos(p.angle + time) * 0.45;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse displacement & wave physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius);
          p.x -= (dx / dist) * force * 3.5;
          p.y -= (dy / dist) * force * 3.5;
          p.alpha = Math.min(p.baseAlpha * 2.2, 0.95);
        } else {
          p.alpha = p.baseAlpha;
        }

        // Draw particle dot with crisp outline
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

          if (distNodes < 130) {
            ctx.save();
            const linkAlpha = (1 - distNodes / 130) * 0.22;
            ctx.globalAlpha = linkAlpha;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.2;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
