import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <div className={`flex items-center gap-1.5 group select-none ${className}`}>
      <span className={`${sizeClasses[size]} font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300 font-display`}>
        Salam
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] inline-block transition-transform duration-300 group-hover:scale-125" />
    </div>
  );
};
