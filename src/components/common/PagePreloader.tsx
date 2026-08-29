import React, { useState, useEffect } from 'react';

interface PagePreloaderProps {
  onComplete?: () => void;
}

export const PagePreloader: React.FC<PagePreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const keywords = [
    { text: "ARCHITECTURE", subtitle: "Clean Code, SOLID & Design Patterns", color: "text-cyan-400" },
    { text: "PERFORMANCE", subtitle: "LINQ & SQL Server Optimization", color: "text-emerald-400" },
    { text: ".NET 9 & REACT", subtitle: "Enterprise Web & Cloud Solutions", color: "text-violet-400" },
    { text: "SALAM", subtitle: "Moussa Abdou Salam — 2026", color: "text-white" }
  ];

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 750);
  };

  useEffect(() => {
    // Smooth, calibrated progress pacing (~3.6 seconds total)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 500);
          return 100;
        }
        const delta = Math.floor(Math.random() * 2) + 1; // +1 or +2 per 35ms tick = ~3.5s
        const next = prev + delta;
        return next > 100 ? 100 : next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 25) setWordIndex(0);
    else if (progress < 55) setWordIndex(1);
    else if (progress < 82) setWordIndex(2);
    else setWordIndex(3);
  }, [progress]);

  const active = keywords[wordIndex];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-8 sm:p-14 bg-[#050811] text-white select-none transition-all duration-700 overflow-hidden ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-violet-500/10 rounded-full blur-[170px] pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }} />

      {/* Top Bar: Identity System Indicator */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-slate-400 tracking-wider font-semibold">SALAM / FULL_STACK_INIT</span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          2026 EDITION
        </div>
      </div>

      {/* Center: Kinetic Typography Word Reveal with breathing room */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto space-y-6 text-center sm:text-left">
        
        {/* Step Indicator */}
        <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
          <span>[ 0{wordIndex + 1} / 04 ]</span>
        </div>

        {/* Giant Kinetic Word */}
        <div className="h-20 sm:h-28 flex items-center">
          <h1
            key={wordIndex}
            className={`text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter ${active.color} font-display transition-all duration-300 transform animate-in fade-in zoom-in-95`}
          >
            {active.text}
          </h1>
        </div>

        {/* Subtitle / Context */}
        <p
          key={`sub-${wordIndex}`}
          className="text-sm sm:text-lg text-slate-400 font-mono tracking-wide transition-all duration-300 animate-in fade-in"
        >
          {active.subtitle}
        </p>

      </div>

      {/* Bottom Bar: Fluid Energy Progress Tracker */}
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-3">
        
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="tracking-wider">CHARGEMENT DES MODULES SYSTÈME</span>
          <span className="font-bold text-white text-base font-mono">{progress}%</span>
        </div>

        {/* Liquid Progress Track */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-100 shadow-[0_0_15px_#06b6d4]"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

    </div>
  );
};
