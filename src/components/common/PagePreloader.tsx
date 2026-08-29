import React, { useState, useEffect } from 'react';

interface PagePreloaderProps {
  onComplete?: () => void;
}

export const PagePreloader: React.FC<PagePreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const keywords = [
    { text: "ARCHITECTURE", subtitle: "Clean Code, SOLID & Design Patterns", color: "text-red-600" },
    { text: "PERFORMANCE", subtitle: "LINQ & SQL Server Optimization", color: "text-slate-950" },
    { text: ".NET 9 & REACT", subtitle: "Enterprise Web & Cloud Solutions", color: "text-red-600" },
    { text: "SALAM", subtitle: "Moussa Abdou Salam — 2026", color: "text-slate-950" }
  ];

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 700);
  };

  useEffect(() => {
    // Smooth calibrated progress (~3.5 seconds total)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 450);
          return 100;
        }
        const delta = Math.floor(Math.random() * 2) + 1;
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
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-8 sm:p-14 bg-slate-50 text-slate-900 select-none transition-all duration-700 overflow-hidden ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Crimson Background Halos */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-red-500/8 rounded-full blur-[170px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-red-600/6 rounded-full blur-[170px] pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }} />

      {/* Top Bar: Identity Indicator */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-slate-700 tracking-wider font-bold">SALAM / INITIALISATION_SYSTEME</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 font-bold">
          2026 EDITION
        </div>
      </div>

      {/* Center: Kinetic Typography Word Reveal */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto space-y-6 text-center sm:text-left">
        
        {/* Step Indicator */}
        <div className="text-xs font-mono text-red-600 tracking-widest uppercase flex items-center gap-2 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
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
          className="text-sm sm:text-lg text-slate-600 font-mono tracking-wide transition-all duration-300 animate-in fade-in font-medium"
        >
          {active.subtitle}
        </p>

      </div>

      {/* Bottom Bar: Fluid Energy Progress Tracker */}
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-3">
        
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
          <span className="tracking-wider">CHARGEMENT DES MODULES FULL-STACK</span>
          <span className="font-bold text-slate-950 text-base font-mono">{progress}%</span>
        </div>

        {/* Liquid Progress Track */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(220,38,38,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

    </div>
  );
};
