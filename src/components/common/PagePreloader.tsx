import React, { useState, useEffect } from 'react';

interface PagePreloaderProps {
  onComplete?: () => void;
}

export const PagePreloader: React.FC<PagePreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const keywords = [
    { text: "ARCHITECTURE", subtitle: "Clean Code, CQRS, SOLID & Microservices", color: "text-red-500" },
    { text: "PERFORMANCE", subtitle: "Low Latency, LINQ & PostgreSQL Queries", color: "text-white" },
    { text: ".NET 9 & REACT", subtitle: "Enterprise Web Systems & Cloud Native", color: "text-red-500" },
    { text: "SALAM.DEV", subtitle: "Ingénieur Concepteur Full Stack — 2026", color: "text-white" }
  ];

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  useEffect(() => {
    // Calibrated progress (~2.4 seconds total for snappy UX)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 300);
          return 100;
        }
        const delta = Math.floor(Math.random() * 3) + 2;
        const next = prev + delta;
        return next > 100 ? 100 : next;
      });
    }, 30);

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
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#060709] text-zinc-100 select-none transition-all duration-600 overflow-hidden font-mono bg-grid-dark ${
        isExiting ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background crimson ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-xs border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-zinc-300 tracking-wider font-bold">SALAM // SYSTEM.BOOT</span>
        </div>
        <div className="text-[11px] text-zinc-500 tracking-widest hidden sm:block">
          STATUS: ONLINE [v2026.09]
        </div>
      </div>

      {/* Center: Brutalist Kinetic Sequence */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto space-y-4 text-left">
        {/* Step Counter */}
        <div className="text-xs text-red-500 tracking-widest uppercase flex items-center gap-2 font-bold">
          <span className="w-1.5 h-1.5 bg-red-500 inline-block" />
          <span>[ STAGE 0{wordIndex + 1} / 04 ]</span>
        </div>

        {/* Big Monospace Headline */}
        <div className="min-h-[70px] sm:min-h-[110px] flex items-center">
          <h1
            key={wordIndex}
            className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight ${active.color} transition-all duration-200 animate-in fade-in`}
          >
            {active.text}
          </h1>
        </div>

        {/* Subtitle */}
        <p
          key={`sub-${wordIndex}`}
          className="text-xs sm:text-base text-zinc-400 font-mono tracking-wide"
        >
          &gt; {active.subtitle}
        </p>
      </div>

      {/* Bottom: Brutalist Progress Gauge */}
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-2 border-t border-zinc-800/80 pt-4">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="tracking-wider text-[11px]">INITIALIZING CORE MODULES &amp; SERVICES...</span>
          <span className="font-bold text-white text-sm font-mono">{progress}%</span>
        </div>

        <div className="w-full h-2 bg-zinc-900 rounded-none overflow-hidden border border-zinc-800 p-0.5">
          <div
            className="h-full bg-red-600 transition-all duration-75 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

