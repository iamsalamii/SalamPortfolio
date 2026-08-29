import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Technology } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { Sparkles, RotateCw, Orbit, ZoomIn, ZoomOut } from 'lucide-react';

interface TechCloud3DProps {
  technologies: Technology[];
  onSelectTech?: (techId: string) => void;
  selectedTechId?: string;
}

interface PlanetPosition {
  tech: Technology;
  x: number;
  y: number;
  z: number;
  scale: number;
  alpha: number;
  color: string;
  hasRing: boolean;
  size: number;
}

// Tech color palette generator with 3D planet shading
const getPlanetColors = (brandColor?: string, index = 0) => {
  const fallbackColors = [
    '#6366f1', // Indigo
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#14b8a6', // Teal
  ];
  
  const base = brandColor && brandColor.startsWith('#') 
    ? brandColor 
    : fallbackColors[index % fallbackColors.length];

  return base;
};

export const TechCloud3D: React.FC<TechCloud3DProps> = ({
  technologies,
  onSelectTech,
  selectedTechId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0.1, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [sphereRadius, setSphereRadius] = useState(190);
  const [hoveredTechId, setHoveredTechId] = useState<string | null>(null);

  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0.0015, y: 0.0035 });

  // Limit to top 24 active technologies for clean spherical distribution
  const activeTechs = useMemo(() => {
    return technologies.slice(0, 24);
  }, [technologies]);

  // Handle responsive radius
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setSphereRadius(140);
      } else if (window.innerWidth < 1024) {
        setSphereRadius(175);
      } else {
        setSphereRadius(200);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // 3D Orbital animation loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      if (autoRotate && !isDraggingRef.current) {
        setRotation(prev => ({
          x: prev.x + rotationVelocity.current.x,
          y: prev.y + rotationVelocity.current.y
        }));
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    setRotation(prev => ({
      x: prev.x - deltaY * 0.005,
      y: prev.y + deltaX * 0.005
    }));

    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch controls for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePos.current.x;
    const deltaY = e.touches[0].clientY - prevMousePos.current.y;

    setRotation(prev => ({
      x: prev.x - deltaY * 0.006,
      y: prev.y + deltaX * 0.006
    }));

    prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Compute 3D planet positions on the sphere
  const planets: PlanetPosition[] = useMemo(() => {
    const count = activeTechs.length;
    if (count === 0) return [];

    return activeTechs.map((tech, index) => {
      // Golden Spiral distribution
      const phi = Math.acos(-1 + (2 * index) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      // Base spherical coords
      let x0 = sphereRadius * Math.cos(theta) * Math.sin(phi);
      let y0 = sphereRadius * Math.sin(theta) * Math.sin(phi);
      let z0 = sphereRadius * Math.cos(phi);

      // Rotate around X axis
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      let y1 = y0 * cosX - z0 * sinX;
      let z1 = y0 * sinX + z0 * cosX;

      // Rotate around Y axis
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      let x2 = x0 * cosY + z1 * sinY;
      let z2 = -x0 * sinY + z1 * cosY;

      // Perspective Projection
      const depth = sphereRadius * 2.2;
      const scale = (depth + z2) / (depth * 1.4);
      const alpha = Math.max(0.25, (z2 + sphereRadius) / (2 * sphereRadius));

      const color = getPlanetColors(tech.brandColor, index);
      const hasRing = Boolean(tech.isPrimary || index % 3 === 0);
      const baseSize = tech.isPrimary ? 54 : 46;

      return {
        tech,
        x: x2,
        y: y1,
        z: z2,
        scale: Math.max(0.6, Math.min(1.3, scale)),
        alpha,
        color,
        hasRing,
        size: baseSize
      };
    });
  }, [activeTechs, rotation, sphereRadius]);

  return (
    <div className="relative flex flex-col items-center select-none">
      
      {/* 3D Planetary Solar System Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[520px] md:h-[520px] mx-auto cursor-grab active:cursor-grabbing flex items-center justify-center overflow-visible"
      >
        {/* Core Star / Ambient Center Glow */}
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-indigo-600/20 dark:bg-indigo-500/25 blur-3xl pointer-events-none" />
        <div className="absolute w-12 h-12 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />

        {/* Orbital Elliptical Rings (Background Planetary Plane) */}
        <div 
          className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-indigo-500/15 dark:border-indigo-400/20 pointer-events-none"
          style={{
            transform: `rotateX(65deg) rotateY(${rotation.y * 15}deg)`,
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full border border-dashed border-cyan-500/15 dark:border-cyan-400/20 pointer-events-none"
          style={{
            transform: `rotateX(45deg) rotateZ(30deg)`,
            transformStyle: 'preserve-3d'
          }}
        />

        {/* 3D Planet Bubbles */}
        {planets.map((planet) => {
          const isSelected = selectedTechId === planet.tech.id;
          const isHovered = hoveredTechId === planet.tech.id;
          const zIndex = Math.round((planet.z + sphereRadius) * 10);
          const isFront = planet.z > 0;

          return (
            <div
              key={planet.tech.id}
              onClick={() => onSelectTech && onSelectTech(planet.tech.id)}
              onMouseEnter={() => setHoveredTechId(planet.tech.id)}
              onMouseLeave={() => setHoveredTechId(null)}
              className="absolute transition-transform duration-75 cursor-pointer transform-gpu flex flex-col items-center group"
              style={{
                transform: `translate3d(${planet.x}px, ${planet.y}px, ${planet.z}px) scale(${planet.scale * (isHovered ? 1.25 : 1)})`,
                zIndex: isHovered ? 9999 : zIndex,
                opacity: isHovered ? 1 : planet.alpha,
                filter: isFront ? 'none' : `blur(${Math.max(0, -planet.z / 90)}px)`
              }}
            >
              {/* The 3D Spherical Planet Orb Bubble */}
              <div 
                className="relative rounded-full flex items-center justify-center transition-all duration-300 shadow-xl"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  background: `radial-gradient(circle at 35% 28%, ${planet.color}ee 0%, ${planet.color}cc 42%, #090d16 100%)`,
                  boxShadow: isSelected
                    ? `0 0 25px ${planet.color}, inset -3px -3px 8px rgba(0,0,0,0.85), inset 3px 3px 6px rgba(255,255,255,0.35)`
                    : isHovered
                    ? `0 0 22px ${planet.color}, inset -3px -3px 8px rgba(0,0,0,0.8), inset 2px 2px 5px rgba(255,255,255,0.3)`
                    : `0 0 14px ${planet.color}88, inset -3px -3px 6px rgba(0,0,0,0.7), inset 1.5px 1.5px 4px rgba(255,255,255,0.25)`,
                  border: isSelected ? `2px solid ${planet.color}` : `1px solid ${planet.color}66`
                }}
              >
                {/* Planetary Atmosphere Glow Halo */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 10px ${planet.color}`,
                    opacity: 0.8
                  }}
                />

                {/* Planetary Orbit Ring (for Saturn-like or primary techs) */}
                {planet.hasRing && (
                  <div
                    className="absolute pointer-events-none rounded-full border border-white/20"
                    style={{
                      width: `${planet.size * 1.75}px`,
                      height: `${planet.size * 0.55}px`,
                      transform: 'rotate(-25deg)',
                      boxShadow: `0 0 10px ${planet.color}77`,
                      background: `linear-gradient(90deg, transparent 0%, ${planet.color}44 50%, transparent 100%)`
                    }}
                  />
                )}

                {/* Tech Icon inside Planet */}
                <div className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center pointer-events-none">
                  <IconRenderer 
                    name={planet.tech.icon || 'Cpu'} 
                    className={planet.size > 50 ? 'w-5 h-5' : 'w-4 h-4'} 
                  />
                </div>

                {/* Soft Ambient Bubble Light Refraction */}
                <div 
                  className="absolute top-1.5 left-2 w-3 h-2 rounded-full bg-white/25 blur-[0.8px] pointer-events-none transform -rotate-30" 
                />
              </div>

              {/* Planet Label Badge / Pill */}
              <div 
                className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-tight transition-all duration-200 backdrop-blur-md flex items-center gap-1 shadow-md whitespace-nowrap pointer-events-none ${
                  isSelected || isHovered
                    ? 'bg-slate-950/95 text-white border border-indigo-400 scale-105 opacity-100'
                    : isFront
                    ? 'bg-slate-900/90 text-slate-200 border border-slate-700/80 opacity-95'
                    : 'bg-slate-950/75 text-slate-400 border border-slate-800/60 opacity-65'
                }`}
              >
                <span>{planet.tech.name}</span>
                {planet.tech.isPrimary && (
                  <span className="text-[9px] text-amber-400 font-semibold">★</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Controls & Legend */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-md px-4 pt-4 text-xs text-slate-600 dark:text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Orbit className="w-4 h-4 text-indigo-500 animate-spin-slow" />
            <span>Système Planétaire 3D</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 font-mono">
            {activeTechs.length} Planètes
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom In/Out Radius */}
          <button
            onClick={() => setSphereRadius(prev => Math.max(120, prev - 20))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Rapprocher l'orbite"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSphereRadius(prev => Math.min(250, prev + 20))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Éloigner l'orbite"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setAutoRotate(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            <span>{autoRotate ? 'Pause' : 'Rotation'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
