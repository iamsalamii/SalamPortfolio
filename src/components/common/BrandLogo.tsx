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
      <span className={`${sizeClasses[size]} font-black tracking-tighter text-white group-hover:text-red-400 transition-colors duration-200 font-mono`}>
        SALAM<span className="text-red-500">_</span>
      </span>
      <span className="w-2 h-2 bg-red-600 shadow-[0_0_10px_#ef4444] inline-block transition-transform duration-200 group-hover:rotate-45" />
    </div>
  );
};
