import React from 'react';

interface SectionDividerProps {
  chapterIndex: number;
  totalChapters: number;
  title: string;
  tag?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  chapterIndex,
  totalChapters,
  title,
  tag = "SYS.ONLINE"
}) => {
  const formattedIndex = chapterIndex.toString().padStart(2, '0');
  const formattedTotal = totalChapters.toString().padStart(2, '0');

  return (
    <div className="relative w-full overflow-hidden py-10 select-none font-mono">
      {/* Horizontal Scanline with Chapter Badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        
        {/* Left Chapter Index Box */}
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border-2 border-zinc-800 text-xs text-zinc-300 font-bold shadow-[2px_2px_0px_#ef4444] shrink-0">
          <span className="text-red-500">//</span>
          <span className="text-white">MODULE [{formattedIndex}/{formattedTotal}]</span>
        </div>

        {/* Section Label */}
        <div className="text-[11px] uppercase tracking-widest text-red-500 font-extrabold hidden md:flex items-center gap-2 shrink-0">
          <span>&gt;&gt;</span>
          <span className="text-zinc-200">{title}</span>
        </div>

        {/* Glowing Monospace Grid Line */}
        <div className="flex-1 h-[2px] bg-gradient-to-r from-red-600/80 via-zinc-800 to-transparent relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
        </div>

        {/* Right Status Tag */}
        <div className="text-[10px] text-zinc-500 tracking-widest hidden sm:block font-bold shrink-0">
          [ {tag} ]
        </div>

      </div>
    </div>
  );
};
