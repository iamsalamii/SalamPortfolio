import React from 'react';

interface TechLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechLogo: React.FC<TechLogoProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const normalized = name.toLowerCase().replace(/[\s\.\/\#\-]/g, '');

  switch (true) {
    // Flutter
    case normalized.includes('flutter'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <path d="M78.6 7.6L19.4 66.8l18.5 18.5 77.7-77.7H78.6z" fill="#42A5F5"/>
          <path d="M78.6 66.8L47.7 97.7l18.5 18.5 12.4-12.4 37-37H78.6z" fill="#0D47A1"/>
          <path d="M47.7 97.7l18.5-18.5 18.5 18.5-18.5 18.5-18.5-18.5z" fill="#29B6F6"/>
        </svg>
      );

    // C#
    case normalized.includes('csharp') || normalized === 'c':
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <path d="M115.4 30.7L66.7 2.6c-1.6-.9-3.7-.9-5.3 0L12.6 30.7c-1.6.9-2.6 2.7-2.6 4.6v56.2c0 1.9 1 3.7 2.6 4.6l48.8 28.1c1.6.9 3.7.9 5.3 0l48.8-28.1c1.6-.9 2.6-2.7 2.6-4.6V35.3c-.1-1.9-1.1-3.7-2.7-4.6z" fill="#9B4993"/>
          <path d="M64 16.7L21.3 41.3v49.4L64 115.3l42.7-24.6V41.3L64 16.7z" fill="#68217A"/>
          <path d="M64.1 36.2c-15.3 0-27.7 12.4-27.7 27.8 0 15.3 12.4 27.8 27.7 27.8 11.2 0 20.8-6.6 25.2-16.1l-10.8-4.4c-2.6 5.5-8.2 9.3-14.4 9.3-9 0-16.4-7.4-16.4-16.5 0-9.1 7.4-16.5 16.4-16.5 6.2 0 11.8 3.8 14.4 9.3l10.8-4.4c-4.4-9.6-14-16.3-25.2-16.4z" fill="#fff"/>
          <path d="M83.2 59.8h-2.9l.6-3.8h-3.4l-.6 3.8h-3.8l-.6 3.8h3.8l-.6 3.8h-3.8l-.6 3.8h3.8l-.6 3.8h3.4l.6-3.8h2.9l-.6 3.8h3.4l.6-3.8h3.8l.6-3.8h-3.8l.6-3.8h3.8l.6-3.8h-3.8l.6-3.8h-3.4l-.6 3.8zm-.6 7.6h-2.9l.6-3.8h2.9l-.6 3.8z" fill="#fff"/>
        </svg>
      );

    // .NET / ASP.NET
    case normalized.includes('dotnet') || normalized.includes('aspnet') || normalized.includes('net'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <circle cx="64" cy="64" r="64" fill="#512BD4"/>
          <path d="M37.8 88.5h-9.2V39.5h9.2v49zm23.6 0h-8.7L39.8 60.1V39.5h9.2v25.2l12.4-25.2h10.4L57.5 63.8l13.9 24.7zm28.7 0H71.5V39.5h18.6v7.7H79.8v12.2h9.4v7.6h-9.4v13.8h10.3v7.7zm20.8-33.8h-7.6V88.5h-8.3V54.7h-7.6V47h23.5v7.7z" fill="#fff"/>
        </svg>
      );

    // React / React Native
    case normalized.includes('react'):
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" width={size} height={size} className={className} fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
          <g stroke="#61DAFB" strokeWidth="1">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      );

    // TypeScript
    case normalized.includes('typescript') || normalized === 'ts':
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <rect width="128" height="128" rx="16" fill="#3178C6"/>
          <path d="M1.5 64C1.5 29.5 29.5 1.5 64 1.5s62.5 28 62.5 62.5-28 62.5-62.5 62.5S1.5 98.5 1.5 64z" fill="#3178C6"/>
          <path d="M70.1 94.6c1.6 3.1 4.5 5.5 8.7 5.5 5.2 0 8.5-2.7 8.5-6.7 0-4.4-3.5-6.1-9.9-8.8-9.1-3.9-15.1-9-15.1-18.7 0-10.4 8.6-17.9 21.6-17.9 8.2 0 14.7 2.6 18.9 8.6l-7.7 5.7c-2.4-3.4-5.6-4.9-9.8-4.9-5.1 0-7.8 2.6-7.8 5.7 0 3.7 2.9 5.3 9.4 8.1 10.3 4.4 15.6 9.6 15.6 19.3 0 12.3-9.5 18.9-23.7 18.9-10.2 0-18.4-3.8-22.9-10.8l8.2-4.9zM20 50h40.4v9.8H45.7v48.4H34.7V59.8H20V50z" fill="#fff"/>
        </svg>
      );

    // JavaScript
    case normalized.includes('javascript') || normalized === 'js':
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <rect width="128" height="128" rx="16" fill="#F7DF1E"/>
          <path d="M67.3 100.8c3.2 5.5 7.8 9.5 15.5 9.5 6.6 0 10.8-3.3 10.8-7.8 0-5.4-4.3-7.5-11.6-10.7-10.6-4.6-17.5-10.4-17.5-22.6 0-12.7 9.8-21.8 24.8-21.8 10.7 0 18.4 3.7 23.5 12.6l-9.8 6.3c-2.6-4.6-5.8-6.6-11.2-6.6-5.3 0-8.7 3.2-8.7 7.2 0 4.8 3.5 6.8 11.2 10.1 12.5 5.4 18.6 11.4 18.6 23.3 0 14.7-11.5 22.9-27.4 22.9-14.8 0-23.7-6.9-28-16.1l9.8-6.3zM25.4 78.4l10.7-6.3c2.4 4.1 4.5 7.4 9 7.4 4.7 0 7.7-2 7.7-9.5V47.5h12.5v22.7c0 14.1-7.9 20.9-20.1 20.9-10.5 0-16.9-5.1-19.8-12.7z" fill="#000"/>
        </svg>
      );

    // Tailwind CSS
    case normalized.includes('tailwind'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <path d="M64 32c-17.1 0-27.7 8.5-32 25.6 6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.3 4.7 12.2 8.6 6.3 6.3 13.6 13.8 29.4 13.8 17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.6-6.3-6.3-13.6-13.8-29.4-13.8zM32 64c-17.1 0-27.7 8.5-32 25.6 6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.3 4.7 12.2 8.6 6.3 6.3 13.6 13.8 29.4 13.8 17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.6-6.3-6.3-13.6-13.8-29.4-13.8z" fill="#38BDF8"/>
        </svg>
      );

    // SQL Server / SQL
    case normalized.includes('sqlserver') || normalized.includes('mssql'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <rect width="128" height="128" rx="16" fill="#CC292B"/>
          <path d="M30 42c0-8.8 15.2-16 34-16s34 7.2 34 16v44c0 8.8-15.2 16-34 16s-34-7.2-34-16V42z" fill="#E84D4D"/>
          <ellipse cx="64" cy="42" rx="34" ry="16" fill="#fff"/>
          <path d="M30 56c0 8.8 15.2 16 34 16s34-7.2 34-16v12c0 8.8-15.2 16-34 16s-34-7.2-34-16V56z" fill="#fff" opacity="0.8"/>
          <path d="M30 72c0 8.8 15.2 16 34 16s34-7.2 34-16v12c0 8.8-15.2 16-34 16s-34-7.2-34-16V72z" fill="#fff" opacity="0.9"/>
        </svg>
      );

    // PostgreSQL
    case normalized.includes('postgres'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <path d="M64 8C33.1 8 8 33.1 8 64s25.1 56 56 56 56-25.1 56-56S94.9 8 64 8zm30.4 49.3c-.7 1.8-1.7 3.5-3 5-1.9 2.2-4.4 3.7-7.2 4.4-1.2.3-2.5.5-3.8.5-3.6 0-6.9-1.4-9.4-3.7-2.3-2.1-3.8-5-4.2-8.2-.1-.7-.1-1.4-.1-2.1 0-6.8 4.2-12.7 10.4-14.9 1.9-.7 3.9-1 6-1 4.5 0 8.6 1.7 11.7 4.6 1.5 1.4 2.7 3.1 3.5 5 1.1 2.4 1.7 5 1.7 7.7 0 2.9-.6 5.7-1.6 8.2z" fill="#4169E1"/>
          <path d="M72.5 45.2c-3.1 0-5.9 1.4-7.8 3.6-1.9 2.2-3 5.2-3 8.4 0 3.2 1.1 6.2 3 8.4 1.9 2.2 4.7 3.6 7.8 3.6 3.1 0 5.9-1.4 7.8-3.6 1.9-2.2 3-5.2 3-8.4 0-3.2-1.1-6.2-3-8.4-1.9-2.2-4.7-3.6-7.8-3.6z" fill="#fff"/>
        </svg>
      );

    // MySQL
    case normalized.includes('mysql'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <rect width="128" height="128" rx="16" fill="#00758F"/>
          <path d="M64 24c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm-3 62.4c-8.9 0-16.1-7.2-16.1-16.1s7.2-16.1 16.1-16.1c4.4 0 8.5 1.8 11.4 4.7l-4.5 4.5c-1.8-1.8-4.2-2.8-6.9-2.8-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8c5.4 0 9.8-4.4 9.8-9.8h-9.8v-6.3h16.1v6.3c0 8.9-7.2 16.1-16.1 16.1z" fill="#F29111"/>
        </svg>
      );

    // Docker
    case normalized.includes('docker'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <rect width="128" height="128" rx="16" fill="#2496ED"/>
          <path d="M110.2 60.1c-1.4-.9-4.8-1.4-8-1.1-.6-4.5-3.8-8.4-8.3-9.7l-2.4-.7-.9 2.3c-1.5 3.9-1.2 8.2.8 11.8-2.6 1.5-6.5 2.5-11.4 2.5H23.8c-2.3 0-4.2 1.9-4.2 4.2 0 11.2 5.5 21.6 14.8 27.9 9.3 6.3 21 8.2 32 5.2 16.9-4.7 28.5-19.8 28.5-37.4 0-1.8-.1-3.6-.4-5.3 5.4-.5 12.1-1.6 15.7 4.5l2-4.1zM36.1 48.9h9.8v9.8h-9.8v-9.8zm13.1 0h9.8v9.8h-9.8v-9.8zm13.1 0h9.8v9.8h-9.8v-9.8zm13.1 0h9.8v9.8h-9.8v-9.8zm-39.3 13.1h9.8v9.8h-9.8V62zm13.1 0h9.8v9.8h-9.8V62zm13.1 0h9.8v9.8h-9.8V62zm13.1 0h9.8v9.8h-9.8V62z" fill="#fff"/>
        </svg>
      );

    // Git / GitHub / GitLab
    case normalized.includes('git'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <path d="M124.6 57.3L70.7 3.4c-4.5-4.5-11.9-4.5-16.4 0L40.4 17.3l18.4 18.4c4.3-1.4 9.3-.5 12.8 3 3.5 3.5 4.5 8.5 3.1 12.8l17.7 17.7c4.3-1.4 9.3-.5 12.8 3 4.9 4.9 4.9 12.8 0 17.7s-12.8 4.9-17.7 0c-3.7-3.7-4.5-9.1-2.5-13.6L67.7 59.1v27.2c1.4.7 2.7 1.7 3.7 2.7 4.9 4.9 4.9 12.8 0 17.7s-12.8 4.9-17.7 0-4.9-12.8 0-17.7c1.3-1.3 2.9-2.3 4.6-2.9V58.6c-1.7-.6-3.3-1.6-4.6-2.9-3.7-3.7-4.5-9.1-2.5-13.6L32.8 23.7 3.4 53.1c-4.5 4.5-4.5 11.9 0 16.4l53.9 53.9c4.5 4.5 11.9 4.5 16.4 0l50.9-50.9c4.5-4.4 4.5-11.8 0-16.3z" fill="#F05032"/>
        </svg>
      );

    // Visual Studio / VS Code
    case normalized.includes('visualstudio') || normalized.includes('vscode'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <path d="M96.7 122.9c3.7 1.9 8.3 1.4 11.5-1.5l16.1-14.7c2.4-2.2 3.7-5.4 3.7-8.7V30c0-3.3-1.3-6.5-3.7-8.7L108.2 6.6c-3.2-2.9-7.8-3.4-11.5-1.5-3.7 1.9-6 5.8-6 10v97.8c0 4.2 2.3 8.1 6 10z" fill="#5C2D91"/>
          <path d="M102.2 15.1L40.7 64l61.5 48.9V15.1z" fill="#68217A"/>
          <path d="M3.7 75.9c-2.4-2.2-3.7-5.4-3.7-8.7V60.8c0-3.3 1.3-6.5 3.7-8.7l22.7-20.7 20.8 19.8-27 24.7H3.7z" fill="#9B4993"/>
          <path d="M27.2 28.5L102.2 92v20.9L47.9 69.2 27.2 28.5z" fill="#007ACC"/>
        </svg>
      );

    // Bootstrap
    case normalized.includes('bootstrap'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <rect width="128" height="128" rx="24" fill="#7952B3"/>
          <path d="M47.4 38.6h20.6c7.9 0 13.8 1.9 17.7 5.7 3.9 3.8 5.8 9 5.8 15.7 0 4.4-1.2 8.2-3.6 11.3-2.4 3.1-5.8 5.3-10.2 6.5 5.5 1.1 9.7 3.6 12.6 7.4 2.9 3.8 4.3 8.7 4.3 14.7 0 7.8-2.3 13.8-6.8 18-4.5 4.2-11.2 6.3-20.1 6.3H47.4V38.6zm13.7 27.2h6.5c4.1 0 7.1-.9 9-2.7 1.9-1.8 2.8-4.4 2.8-7.9 0-3.3-.9-5.8-2.8-7.5-1.9-1.7-4.8-2.5-8.8-2.5h-6.7v20.6zm0 46h7.7c4.6 0 8-1 10.3-3.1 2.3-2.1 3.4-5.1 3.4-9.2 0-4-1.2-7.1-3.6-9.1-2.4-2-6-3.1-10.8-3.1h-7v24.5z" fill="#fff"/>
        </svg>
      );

    // PHP
    case normalized.includes('php'):
      return (
        <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
          <ellipse cx="64" cy="64" rx="60" ry="36" fill="#777BB4"/>
          <path d="M41 52h-9l-5 24h6l2.1-10h4.4c6.2 0 10.5-3.3 11.5-8.1 1-4.7-2.3-5.9-10-5.9zm-2.8 8.8h-3.4l1.3-6.1h3.4c3.3 0 4.8.7 4.4 2.8-.5 2.1-2.4 3.3-5.7 3.3zM67.8 52h-6l-5 24h6l2.1-10h6.8l-2.1 10h6l5-24h-6l-2.1 10h-6.8l2.1-10zM96 52h-9l-5 24h6l2.1-10h4.4c6.2 0 10.5-3.3 11.5-8.1 1-4.7-2.3-5.9-10-5.9zm-2.8 8.8h-3.4l1.3-6.1h3.4c3.3 0 4.8.7 4.4 2.8-.5 2.1-2.4 3.3-5.7 3.3z" fill="#fff"/>
        </svg>
      );

    // Default Tech fallback icon
    default:
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
};
