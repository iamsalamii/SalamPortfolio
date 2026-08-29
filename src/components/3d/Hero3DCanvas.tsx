import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Layers, Box, Cpu } from 'lucide-react';

interface Hero3DCanvasProps {
  className?: string;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePreset, setActivePreset] = useState<'architecture' | 'microservices' | 'data'>('architecture');
  const [isRotating, setIsRotating] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Dimensions
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Core - Crystalline Core & Wireframe Lattice
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    // Inner glowing crystal (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Indigo
      emissive: 0x4338ca,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Outer wireframe cage (Icosahedron with slightly larger radius)
    const wireGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sky cyan
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Middle geometric ring (Torus)
    const torusGeo = new THREE.TorusGeometry(2.3, 0.035, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    coreGroup.add(torusMesh);

    // Second inclined orbital ring
    const torusGeo2 = new THREE.TorusGeometry(2.8, 0.025, 16, 100);
    const torusMat2 = new THREE.MeshStandardMaterial({
      color: 0x34d399, // Emerald
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6
    });
    const torusMesh2 = new THREE.Mesh(torusGeo2, torusMat2);
    torusMesh2.rotation.y = Math.PI / 4;
    torusMesh2.rotation.x = -Math.PI / 6;
    coreGroup.add(torusMesh2);

    // 2. Orbiting Satellite Nodes (representing C#, Clean Architecture, Azure, SQL, Docker)
    const satellites: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; yOffset: number }[] = [];

    const satConfigs = [
      { color: 0x6366f1, geo: new THREE.BoxGeometry(0.35, 0.35, 0.35), radius: 2.3, speed: 0.012, yOffset: 0.4 }, // .NET Core
      { color: 0x38bdf8, geo: new THREE.OctahedronGeometry(0.3, 0), radius: 2.8, speed: -0.009, yOffset: -0.5 }, // Cloud / Azure
      { color: 0x10b981, geo: new THREE.DodecahedronGeometry(0.28, 0), radius: 2.5, speed: 0.015, yOffset: 0.8 }, // Clean Code
      { color: 0xf59e0b, geo: new THREE.CylinderGeometry(0.2, 0.2, 0.35, 8), radius: 3.1, speed: -0.011, yOffset: -0.3 }, // DB SQL
      { color: 0xec4899, geo: new THREE.TetrahedronGeometry(0.3, 0), radius: 2.1, speed: 0.018, yOffset: 0.2 }, // API REST / gRPC
    ];

    satConfigs.forEach((cfg, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(cfg.geo, mat);
      const angle = (idx * Math.PI * 2) / satConfigs.length;
      mesh.position.set(
        Math.cos(angle) * cfg.radius,
        cfg.yOffset,
        Math.sin(angle) * cfg.radius
      );
      rootGroup.add(mesh);
      satellites.push({
        mesh,
        orbitRadius: cfg.radius,
        speed: cfg.speed,
        angle,
        yOffset: cfg.yOffset
      });
    });

    // 3. Floating 3D Point Cloud (Constellation dust)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x6366f1, 2.5, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Mouse & Pointer Interaction state
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        targetRotationX = y * 0.4;
        targetRotationY = x * 0.6;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize Observer for responsive 3D viewport
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          width = w;
          height = h;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse / drag rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      rootGroup.rotation.x = currentRotationX;
      rootGroup.rotation.y = currentRotationY;

      // Continuous automatic 3D rotation if enabled
      if (isRotating && !isDragging) {
        coreGroup.rotation.y += 0.008;
        coreGroup.rotation.x += 0.003;
        innerMesh.rotation.y -= 0.012;
        wireMesh.rotation.z += 0.005;
        torusMesh.rotation.z += 0.01;
        torusMesh2.rotation.y -= 0.008;
      }

      // Orbit satellites around central architecture core
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.orbitRadius;
        sat.mesh.position.y = sat.yOffset + Math.sin(elapsedTime * 2 + sat.angle) * 0.15;
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      });

      // Gently rotate particle background
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      resizeObserver.disconnect();

      // Dispose Three.js resources
      innerGeo.dispose();
      innerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      satellites.forEach((s) => {
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) {
          s.mesh.material.forEach(m => m.dispose());
        } else {
          s.mesh.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [isRotating]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-750/80 dark:border-slate-800 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Top 3D Header Bar */}
      <div className="absolute top-0 inset-x-0 px-4 py-3 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>.NET 9 3D Architectural Matrix</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(prev => !prev)}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              isRotating 
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Activer / Désactiver la rotation automatique"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Bottom 3D Mode Badges & Interaction Tip */}
      <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-2 z-20 pointer-events-none">
        
        {/* Architectural Node Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 shadow-xs flex items-center gap-1 backdrop-blur-sm">
            <Box className="w-3 h-3 text-indigo-400" />
            Clean Core
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-xs flex items-center gap-1 backdrop-blur-sm">
            <Layers className="w-3 h-3 text-cyan-400" />
            Cloud & Azure
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 shadow-xs flex items-center gap-1 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Event Mesh
          </span>
        </div>

        {/* User Interaction hint */}
        <div className="text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-sm font-medium">
          {isInteracting ? '🔄 Rotation 3D active' : '✨ Glissez pour explorer en 3D'}
        </div>
      </div>

      {/* Subtle Corner Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
