import React from 'react';

export interface TechLogoProps {
  name: string;
  logoUrl?: string;
  className?: string;
  size?: number;
}

/**
 * Normalizes technology strings for resilient fuzzy and alias matching.
 * Examples:
 * - "C# 13" -> "csharp13"
 * - ".NET 9.0" -> "dotnet90"
 * - "PostgreSQL" -> "postgresql"
 * - "GitHub Copilot" -> "githubcopilot"
 * - "Google Gemini" -> "googlegemini"
 * - "n8n" -> "n8n"
 * - "Make / Integromat" -> "makeintegromat"
 */
export function normalizeTechKey(rawName: string): string {
  if (!rawName) return '';
  return rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/c#/g, 'csharp')
    .replace(/c\+\+/g, 'cpp')
    .replace(/\.net/g, 'dotnet')
    .replace(/[^a-z0-9]/g, '');
}

export const TechLogo: React.FC<TechLogoProps> = ({ 
  name, 
  logoUrl, 
  className = 'w-5 h-5', 
  size = 20 
}) => {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [logoUrl]);

  // 0. Manual Logo Override (if specified in CMS item and valid)
  if (logoUrl && logoUrl.trim().length > 0 && !imageError) {
    return (
      <img
        src={logoUrl.trim()}
        alt={name}
        style={{ width: size, height: size }}
        className={`object-contain ${className}`}
        loading="lazy"
        onError={() => setImageError(true)}
      />
    );
  }

  const key = normalizeTechKey(name);

  // ==========================================
  // 1. .NET ECOSYSTEM & LANGUAGES
  // ==========================================

  // C# (Official Microsoft C# Hexagon)
  if (key.includes('csharp') || key === 'cs') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M115.4 30.7L66.7 2.6c-1.6-.9-3.7-.9-5.3 0L12.6 30.7c-1.6.9-2.6 2.7-2.6 4.6v56.2c0 1.9 1 3.7 2.6 4.6l48.8 28.1c1.6.9 3.7.9 5.3 0l48.8-28.1c1.6-.9 2.6-2.7 2.6-4.6V35.3c-.1-1.9-1.1-3.7-2.7-4.6z" fill="#9B4993"/>
        <path d="M64 16.7L21.3 41.3v49.4L64 115.3l42.7-24.6V41.3L64 16.7z" fill="#68217A"/>
        <path d="M64.1 36.2c-15.3 0-27.7 12.4-27.7 27.8 0 15.3 12.4 27.8 27.7 27.8 11.2 0 20.8-6.6 25.2-16.1l-10.8-4.4c-2.6 5.5-8.2 9.3-14.4 9.3-9 0-16.4-7.4-16.4-16.5 0-9.1 7.4-16.5 16.4-16.5 6.2 0 11.8 3.8 14.4 9.3l10.8-4.4c-4.4-9.6-14-16.3-25.2-16.4z" fill="#ffffff"/>
        <path d="M83.2 59.8h-2.9l.6-3.8h-3.4l-.6 3.8h-3.8l-.6 3.8h3.8l-.6 3.8h-3.8l-.6 3.8h3.8l-.6 3.8h3.4l.6-3.8h2.9l-.6 3.8h3.4l.6-3.8h3.8l.6-3.8h-3.8l.6-3.8h3.8l.6-3.8h-3.8l.6-3.8h-3.4l-.6 3.8zm-.6 7.6h-2.9l.6-3.8h2.9l-.6 3.8z" fill="#ffffff"/>
      </svg>
    );
  }

  // ASP.NET Core & .NET Ecosystem
  if (key.includes('aspnet') || key.includes('dotnet') || key === 'net' || key.includes('netcore') || key.includes('net9')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <circle cx="64" cy="64" r="64" fill="#512BD4"/>
        <path d="M37.8 88.5h-9.2V39.5h9.2v49zm23.6 0h-8.7L39.8 60.1V39.5h9.2v25.2l12.4-25.2h10.4L57.5 63.8l13.9 24.7zm28.7 0H71.5V39.5h18.6v7.7H79.8v12.2h9.4v7.6h-9.4v13.8h10.3v7.7zm20.8-33.8h-7.6V88.5h-8.3V54.7h-7.6V47h23.5v7.7z" fill="#ffffff"/>
      </svg>
    );
  }

  // Entity Framework Core & LINQ
  if (key.includes('efcore') || key.includes('entityframework') || key.includes('linq')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#512BD4"/>
        <path d="M30 38h68v14H46v18h46v14H46v20h52v14H30V38z" fill="#ffffff"/>
        <circle cx="98" cy="45" r="7" fill="#22D3EE"/>
        <circle cx="98" cy="77" r="7" fill="#22D3EE"/>
      </svg>
    );
  }

  // Python
  if (key.includes('python') || key === 'py') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M63.5 12c-27.8 0-26.1 12-26.1 12l.1 12.5h26.5v3.8H26.3S12 38.8 12 66.8c0 28 12.5 27 12.5 27h7.5v-10.4s-.4-12.5 12.3-12.5h26.2s11.9.2 11.9-11.7V23.7S84.1 12 63.5 12zm-14.7 8.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#3776AB"/>
        <path d="M64.5 116c27.8 0 26.1-12 26.1-12l-.1-12.5H64v-3.8h37.7s14.3 1.5 14.3-26.5c0-28-12.5-27-12.5-27h-7.5v10.4s.4 12.5-12.3 12.5H60s-11.9-.2-11.9 11.7v23.5s-1.7 11.7 18.9 11.7zm14.7-8.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#FFD43B"/>
      </svg>
    );
  }

  // TypeScript
  if (key.includes('typescript') || key === 'ts') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="16" fill="#3178C6"/>
        <path d="M70.1 94.6c1.6 3.1 4.5 5.5 8.7 5.5 5.2 0 8.5-2.7 8.5-6.7 0-4.4-3.5-6.1-9.9-8.8-9.1-3.9-15.1-9-15.1-18.7 0-10.4 8.6-17.9 21.6-17.9 8.2 0 14.7 2.6 18.9 8.6l-7.7 5.7c-2.4-3.4-5.6-4.9-9.8-4.9-5.1 0-7.8 2.6-7.8 5.7 0 3.7 2.9 5.3 9.4 8.1 10.3 4.4 15.6 9.6 15.6 19.3 0 12.3-9.5 18.9-23.7 18.9-10.2 0-18.4-3.8-22.9-10.8l8.2-4.9zM20 50h40.4v9.8H45.7v48.4H34.7V59.8H20V50z" fill="#ffffff"/>
      </svg>
    );
  }

  // JavaScript / Node.js
  if (key.includes('javascript') || key === 'js' || key.includes('nodejs') || key.includes('node')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="16" fill="#F7DF1E"/>
        <path d="M67.3 100.8c3.2 5.5 7.8 9.5 15.5 9.5 6.6 0 10.8-3.3 10.8-7.8 0-5.4-4.3-7.5-11.6-10.7-10.6-4.6-17.5-10.4-17.5-22.6 0-12.7 9.8-21.8 24.8-21.8 10.7 0 18.4 3.7 23.5 12.6l-9.8 6.3c-2.6-4.6-5.8-6.6-11.2-6.6-5.3 0-8.7 3.2-8.7 7.2 0 4.8 3.5 6.8 11.2 10.1 12.5 5.4 18.6 11.4 18.6 23.3 0 14.7-11.5 22.9-27.4 22.9-14.8 0-23.7-6.9-28-16.1l9.8-6.3zM25.4 78.4l10.7-6.3c2.4 4.1 4.5 7.4 9 7.4 4.7 0 7.7-2 7.7-9.5V47.5h12.5v22.7c0 14.1-7.9 20.9-20.1 20.9-10.5 0-16.9-5.1-19.8-12.7z" fill="#000000"/>
      </svg>
    );
  }

  // PHP
  if (key === 'php' || key.startsWith('php')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <ellipse cx="64" cy="64" rx="60" ry="36" fill="#777BB4"/>
        <path d="M41 52h-9l-5 24h6l2.1-10h4.4c6.2 0 10.5-3.3 11.5-8.1 1-4.7-2.3-5.9-10-5.9zm-2.8 8.8h-3.4l1.3-6.1h3.4c3.3 0 4.8.7 4.4 2.8-.5 2.1-2.4 3.3-5.7 3.3zM67.8 52h-6l-5 24h6l2.1-10h6.8l-2.1 10h6l5-24h-6l-2.1 10h-6.8l2.1-10zM96 52h-9l-5 24h6l2.1-10h4.4c6.2 0 10.5-3.3 11.5-8.1 1-4.7-2.3-5.9-10-5.9zm-2.8 8.8h-3.4l1.3-6.1h3.4c3.3 0 4.8.7 4.4 2.8-.5 2.1-2.4 3.3-5.7 3.3z" fill="#ffffff"/>
      </svg>
    );
  }

  // ==========================================
  // 2. AI, MACHINE LEARNING & AUTOMATION TOOLS
  // ==========================================

  // OpenAI / ChatGPT / GPT-4
  if (key.includes('openai') || key.includes('chatgpt') || key.includes('gpt')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#10A37F"/>
        <path d="M96.5 53.2a20.4 20.4 0 0 0-1.6-15.3 20.7 20.7 0 0 0-16.7-10.4 20.4 20.4 0 0 0-14.8-6.5c-9.2 0-17.1 6.1-19.6 14.8a20.6 20.6 0 0 0-13 8.9 20.8 20.8 0 0 0-1.8 19.3 20.6 20.6 0 0 0-7.8 15.6c0 10.4 7.9 19.1 18.2 20.2a20.7 20.7 0 0 0 13 8.9 20.8 20.8 0 0 0 19.4-1.8 20.5 20.5 0 0 0 15.6-7.8c10.4 0 19.1-7.9 20.2-18.2a20.6 20.6 0 0 0 8.9-13 20.8 20.8 0 0 0-1.8-19.7zM64 78.4a14.4 14.4 0 1 1 0-28.8 14.4 14.4 0 0 1 0 28.8z" fill="#ffffff"/>
      </svg>
    );
  }

  // Anthropic / Claude
  if (key.includes('anthropic') || key.includes('claude')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#CC785C"/>
        <path d="M40 92L64 36l24 56h-12l-5-13H57l-5 13H40zm20-23h8l-4-11-4 11z" fill="#ffffff"/>
        <circle cx="92" cy="40" r="8" fill="#FDE68A"/>
      </svg>
    );
  }

  // Google Gemini / Bard
  if (key.includes('gemini') || key.includes('bard') || key.includes('googleai')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#1E1F20"/>
        <path d="M64 16C64 42.5 42.5 64 16 64C42.5 64 64 85.5 64 112C64 85.5 85.5 64 112 64C85.5 64 64 42.5 64 16Z" fill="url(#gemini_grad)"/>
        <defs>
          <linearGradient id="gemini_grad" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1BA1E3"/>
            <stop offset="0.4" stopColor="#5B7FE8"/>
            <stop offset="0.7" stopColor="#9C52E8"/>
            <stop offset="1" stopColor="#E25482"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // GitHub Copilot / Microsoft Copilot
  if (key.includes('copilot')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#000000"/>
        <path d="M64 24c-22.1 0-40 17.9-40 40 0 12.3 5.5 23.3 14.3 30.6 2.2 1.8 4.7 1.4 4.7-1.4v-8.2c-2.8-.6-5.8-1.8-7.8-4.2-2.3-2.8-2.6-6.8-.7-9.8 2-3.1 5.9-4.8 9.6-4.2 1.2.2 2.3.6 3.3 1.2 2.2-6.5 8.4-11.2 15.6-11.2h2c7.2 0 13.4 4.7 15.6 11.2 1-.6 2.1-1 3.3-1.2 3.7-.6 7.6 1.1 9.6 4.2 1.9 3 1.6 7-.7 9.8-2 2.4-5 3.6-7.8 4.2v8.2c0 2.8 2.5 3.2 4.7 1.4C98.5 87.3 104 76.3 104 64c0-22.1-17.9-40-40-40z" fill="#ffffff"/>
        <circle cx="50" cy="62" r="5" fill="#007ACC"/>
        <circle cx="78" cy="62" r="5" fill="#007ACC"/>
      </svg>
    );
  }

  // Semantic Kernel
  if (key.includes('semantickernel')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#0078D4"/>
        <path d="M64 24l28 20v38l-28 22-28-22V44l28-20z" stroke="#ffffff" strokeWidth="8" strokeLinejoin="round"/>
        <circle cx="64" cy="63" r="12" fill="#38BDF8"/>
        <line x1="64" y1="24" x2="64" y2="51" stroke="#38BDF8" strokeWidth="6"/>
        <line x1="64" y1="75" x2="64" y2="104" stroke="#38BDF8" strokeWidth="6"/>
      </svg>
    );
  }

  // LangChain / LangGraph / LangSmith
  if (key.includes('langchain') || key.includes('langgraph') || key.includes('langsmith')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#1C3C3C"/>
        <path d="M42 42h44v44H42z" stroke="#38BDF8" strokeWidth="6" fill="none"/>
        <circle cx="42" cy="42" r="10" fill="#38BDF8"/>
        <circle cx="86" cy="42" r="10" fill="#38BDF8"/>
        <circle cx="42" cy="86" r="10" fill="#22C55E"/>
        <circle cx="86" cy="86" r="10" fill="#22C55E"/>
        <line x1="42" y1="42" x2="86" y2="86" stroke="#ffffff" strokeWidth="5"/>
      </svg>
    );
  }

  // Ollama
  if (key.includes('ollama')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#000000"/>
        <circle cx="64" cy="68" r="32" fill="#ffffff"/>
        <ellipse cx="50" cy="38" rx="8" ry="16" fill="#ffffff"/>
        <ellipse cx="78" cy="38" rx="8" ry="16" fill="#ffffff"/>
        <circle cx="54" cy="64" r="5" fill="#000000"/>
        <circle cx="74" cy="64" r="5" fill="#000000"/>
        <ellipse cx="64" cy="78" rx="8" ry="5" fill="#000000"/>
      </svg>
    );
  }

  // PyTorch
  if (key.includes('pytorch') || key === 'torch') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#1B1F23"/>
        <path d="M64 22l20 20-8 8-12-12-12 12-8-8 20-20z" fill="#EE4C2C"/>
        <circle cx="84" cy="42" r="6" fill="#EE4C2C"/>
        <path d="M64 50a24 24 0 1 0 24 24h-10a14 14 0 1 1-14-14V50z" fill="#EE4C2C"/>
      </svg>
    );
  }

  // n8n
  if (key.includes('n8n')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#EA4B71"/>
        <circle cx="36" cy="64" r="14" fill="#ffffff"/>
        <circle cx="64" cy="40" r="14" fill="#ffffff"/>
        <circle cx="64" cy="88" r="14" fill="#ffffff"/>
        <circle cx="92" cy="64" r="14" fill="#ffffff"/>
        <line x1="36" y1="64" x2="64" y2="40" stroke="#ffffff" strokeWidth="6"/>
        <line x1="36" y1="64" x2="64" y2="88" stroke="#ffffff" strokeWidth="6"/>
        <line x1="64" y1="40" x2="92" y2="64" stroke="#ffffff" strokeWidth="6"/>
        <line x1="64" y1="88" x2="92" y2="64" stroke="#ffffff" strokeWidth="6"/>
      </svg>
    );
  }

  // Make / Integromat
  if (key.includes('make') || key.includes('integromat')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#6F2DBD"/>
        <path d="M32 36l32 18-32 18V36zm32 18l32 18-32 18V54zm-32 36l32 18V72L32 90z" fill="#A855F7"/>
        <path d="M64 54l32-18v36L64 54z" fill="#EC4899"/>
      </svg>
    );
  }

  // Mistral AI
  if (key.includes('mistral')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#000000"/>
        <rect x="28" y="28" width="16" height="16" fill="#F97316"/>
        <rect x="84" y="28" width="16" height="16" fill="#F97316"/>
        <rect x="44" y="44" width="16" height="16" fill="#FB923C"/>
        <rect x="68" y="44" width="16" height="16" fill="#FB923C"/>
        <rect x="56" y="60" width="16" height="16" fill="#FDBA74"/>
        <rect x="28" y="76" width="16" height="16" fill="#F97316"/>
        <rect x="84" y="76" width="16" height="16" fill="#F97316"/>
      </svg>
    );
  }

  // Hugging Face
  if (key.includes('huggingface') || key === 'hf') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#FFD21E"/>
        <circle cx="48" cy="54" r="6" fill="#000000"/>
        <circle cx="80" cy="54" r="6" fill="#000000"/>
        <path d="M46 76c6 10 30 10 36 0" stroke="#000000" strokeWidth="6" strokeLinecap="round"/>
        <path d="M24 74c4-12 16-16 20-8M104 74c-4-12-16-16-20-8" stroke="#000000" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    );
  }

  // TensorFlow
  if (key.includes('tensorflow') || key === 'tf') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#FF6F00"/>
        <path d="M64 24L32 42v44l16-9V58l16 9V24zm0 0l32 18v44l-16-9V58l-16 9V24z" fill="#ffffff"/>
      </svg>
    );
  }

  // ==========================================
  // 3. FRONTEND & MOBILE FRAMEWORKS
  // ==========================================

  // React & React Native
  if (key.includes('react')) {
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
  }

  // Flutter
  if (key.includes('flutter')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#02569B"/>
        <path d="M76 22L36 62l14 14 54-54H76zm0 46L54 90l14 14 36-36H76z" fill="#54C5F8"/>
        <path d="M68 104l12 12h24L82 94l-14 10z" fill="#01579B"/>
      </svg>
    );
  }

  // Next.js
  if (key.includes('nextjs') || key === 'next') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#000000"/>
        <path d="M44 40h10v48H44V40zm22.5 0h9.8l20.2 30.5V40h9.5v48h-9.5L74.8 55.4V88h-8.3V40z" fill="#ffffff"/>
      </svg>
    );
  }

  // Tailwind CSS
  if (key.includes('tailwind')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M64 32c-17.1 0-27.7 8.5-32 25.6 6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.3 4.7 12.2 8.6 6.3 6.3 13.6 13.8 29.4 13.8 17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.6-6.3-6.3-13.6-13.8-29.4-13.8zM32 64c-17.1 0-27.7 8.5-32 25.6 6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.3 4.7 12.2 8.6 6.3 6.3 13.6 13.8 29.4 13.8 17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.6-6.3-6.3-13.6-13.8-29.4-13.8z" fill="#38BDF8"/>
      </svg>
    );
  }

  // Bootstrap
  if (key.includes('bootstrap')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="24" fill="#7952B3"/>
        <path d="M47.4 38.6h20.6c7.9 0 13.8 1.9 17.7 5.7 3.9 3.8 5.8 9 5.8 15.7 0 4.4-1.2 8.2-3.6 11.3-2.4 3.1-5.8 5.3-10.2 6.5 5.5 1.1 9.7 3.6 12.6 7.4 2.9 3.8 4.3 8.7 4.3 14.7 0 7.8-2.3 13.8-6.8 18-4.5 4.2-11.2 6.3-20.1 6.3H47.4V38.6zm13.7 27.2h6.5c4.1 0 7.1-.9 9-2.7 1.9-1.8 2.8-4.4 2.8-7.9 0-3.3-.9-5.8-2.8-7.5-1.9-1.7-4.8-2.5-8.8-2.5h-6.7v20.6zm0 46h7.7c4.6 0 8-1 10.3-3.1 2.3-2.1 3.4-5.1 3.4-9.2 0-4-1.2-7.1-3.6-9.1-2.4-2-6-3.1-10.8-3.1h-7v24.5z" fill="#ffffff"/>
      </svg>
    );
  }

  // HTML5
  if (key.includes('html') || key.includes('html5')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M19 116L9 4h110l-10 112-45 12-45-12z" fill="#E44D26"/>
        <path d="M64 118l36-10 8-90H64v100z" fill="#F16529"/>
        <path d="M64 48h22l2-16H64V18h38l-4 44H64v-14zm0 48l-18-5-1-13h-14l2 24 31 9V96zm0-18h18l-2 20-16 4V88z" fill="#ffffff"/>
      </svg>
    );
  }

  // CSS3
  if (key.includes('css') || key.includes('css3')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M19 116L9 4h110l-10 112-45 12-45-12z" fill="#1572B6"/>
        <path d="M64 118l36-10 8-90H64v100z" fill="#33A9DC"/>
        <path d="M64 54h20l2-20H64V20h38l-6 66-32 9V81l18-5 1-12H64V54z" fill="#ffffff"/>
      </svg>
    );
  }

  // ==========================================
  // 4. DATABASES & STORAGE
  // ==========================================

  // Microsoft SQL Server
  if (key.includes('sqlserver') || key.includes('mssql') || key.includes('tsql')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="16" fill="#CC292B"/>
        <path d="M30 42c0-8.8 15.2-16 34-16s34 7.2 34 16v44c0 8.8-15.2 16-34 16s-34-7.2-34-16V42z" fill="#E84D4D"/>
        <ellipse cx="64" cy="42" rx="34" ry="16" fill="#ffffff"/>
        <path d="M30 56c0 8.8 15.2 16 34 16s34-7.2 34-16v12c0 8.8-15.2 16-34 16s-34-7.2-34-16V56z" fill="#ffffff" opacity="0.8"/>
        <path d="M30 72c0 8.8 15.2 16 34 16s34-7.2 34-16v12c0 8.8-15.2 16-34 16s-34-7.2-34-16V72z" fill="#ffffff" opacity="0.9"/>
      </svg>
    );
  }

  // PostgreSQL
  if (key.includes('postgres') || key.includes('postgresql') || key.includes('psql')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M64 8C33.1 8 8 33.1 8 64s25.1 56 56 56 56-25.1 56-56S94.9 8 64 8z" fill="#336791"/>
        <path d="M94.4 57.3c-.7 1.8-1.7 3.5-3 5-1.9 2.2-4.4 3.7-7.2 4.4-1.2.3-2.5.5-3.8.5-3.6 0-6.9-1.4-9.4-3.7-2.3-2.1-3.8-5-4.2-8.2-.1-.7-.1-1.4-.1-2.1 0-6.8 4.2-12.7 10.4-14.9 1.9-.7 3.9-1 6-1 4.5 0 8.6 1.7 11.7 4.6 1.5 1.4 2.7 3.1 3.5 5 1.1 2.4 1.7 5 1.7 7.7 0 2.9-.6 5.7-1.6 8.2z" fill="#ffffff"/>
        <path d="M44 48c0-8 6.4-14 14.4-14h15.2c8 0 14.4 6 14.4 14v22c0 14-8 26-22 26s-22-12-22-26V48z" fill="#ffffff" opacity="0.95"/>
        <circle cx="56" cy="56" r="4" fill="#336791"/>
      </svg>
    );
  }

  // MySQL
  if (key.includes('mysql')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="16" fill="#00758F"/>
        <path d="M64 24c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm-3 62.4c-8.9 0-16.1-7.2-16.1-16.1s7.2-16.1 16.1-16.1c4.4 0 8.5 1.8 11.4 4.7l-4.5 4.5c-1.8-1.8-4.2-2.8-6.9-2.8-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8c5.4 0 9.8-4.4 9.8-9.8h-9.8v-6.3h16.1v6.3c0 8.9-7.2 16.1-16.1 16.1z" fill="#F29111"/>
      </svg>
    );
  }

  // Redis
  if (key.includes('redis')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#DC2626"/>
        <path d="M32 44l32-16 32 16v40l-32 16-32-16V44z" fill="#ffffff"/>
        <path d="M32 44l32 16 32-16-32-16-32 16z" fill="#FCA5A5"/>
      </svg>
    );
  }

  // ==========================================
  // 5. DEVOPS, TESTING & TOOLS
  // ==========================================

  // Docker
  if (key.includes('docker')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="16" fill="#2496ED"/>
        <path d="M110.2 60.1c-1.4-.9-4.8-1.4-8-1.1-.6-4.5-3.8-8.4-8.3-9.7l-2.4-.7-.9 2.3c-1.5 3.9-1.2 8.2.8 11.8-2.6 1.5-6.5 2.5-11.4 2.5H23.8c-2.3 0-4.2 1.9-4.2 4.2 0 11.2 5.5 21.6 14.8 27.9 9.3 6.3 21 8.2 32 5.2 16.9-4.7 28.5-19.8 28.5-37.4 0-1.8-.1-3.6-.4-5.3 5.4-.5 12.1-1.6 15.7 4.5l2-4.1zM36.1 48.9h9.8v9.8h-9.8v-9.8zm13.1 0h9.8v9.8h-9.8v-9.8zm13.1 0h9.8v9.8h-9.8v-9.8zm13.1 0h9.8v9.8h-9.8v-9.8zm-39.3 13.1h9.8v9.8h-9.8V62zm13.1 0h9.8v9.8h-9.8V62zm13.1 0h9.8v9.8h-9.8V62zm13.1 0h9.8v9.8h-9.8V62z" fill="#ffffff"/>
      </svg>
    );
  }

  // Microsoft Azure
  if (key.includes('azure')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M35 110L72 18h26L42 110H35zm31-42l15-28 27 70H82l-16-42z" fill="#008AD7"/>
      </svg>
    );
  }

  // AWS (Amazon Web Services)
  if (key.includes('aws') || key.includes('amazon')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#232F3E"/>
        <path d="M36 64c0-12 8-20 20-20s20 8 20 20-8 20-20 20-20-8-20-20z" fill="#FF9900"/>
        <path d="M28 88c22 14 50 14 72 0" stroke="#FF9900" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    );
  }

  // Git
  if (key === 'git') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M124.6 57.3L70.7 3.4c-4.5-4.5-11.9-4.5-16.4 0L40.4 17.3l18.4 18.4c4.3-1.4 9.3-.5 12.8 3 3.5 3.5 4.5 8.5 3.1 12.8l17.7 17.7c4.3-1.4 9.3-.5 12.8 3 4.9 4.9 4.9 12.8 0 17.7s-12.8 4.9-17.7 0c-3.7-3.7-4.5-9.1-2.5-13.6L67.7 59.1v27.2c1.4.7 2.7 1.7 3.7 2.7 4.9 4.9 4.9 12.8 0 17.7s-12.8 4.9-17.7 0-4.9-12.8 0-17.7c1.3-1.3 2.9-2.3 4.6-2.9V58.6c-1.7-.6-3.3-1.6-4.6-2.9-3.7-3.7-4.5-9.1-2.5-13.6L32.8 23.7 3.4 53.1c-4.5 4.5-4.5 11.9 0 16.4l53.9 53.9c4.5 4.5 11.9 4.5 16.4 0l50.9-50.9c4.5-4.4 4.5-11.8 0-16.3z" fill="#F05032"/>
      </svg>
    );
  }

  // GitHub
  if (key.includes('github')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="24" fill="#24292E"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M64 18C38.6 18 18 38.6 18 64c0 20.3 13.2 37.6 31.5 43.7 2.3.4 3.1-1 3.1-2.2v-8.6c-12.8 2.8-15.5-5.5-15.5-5.5-2.1-5.3-5.1-6.7-5.1-6.7-4.2-2.8.3-2.8.3-2.8 4.6.3 7.1 4.8 7.1 4.8 4.1 7.1 10.8 5 13.4 3.8.4-3 1.6-5 2.9-6.2-10.2-1.2-20.9-5.1-20.9-22.8 0-5 1.8-9.2 4.8-12.4-.5-1.2-2.1-5.9.5-12.2 0 0 3.9-1.2 12.7 4.7 3.7-1 7.7-1.5 11.6-1.5s7.9.5 11.6 1.5c8.8-6 12.7-4.7 12.7-4.7 2.6 6.4 1 11.1.5 12.2 3 3.3 4.8 7.4 4.8 12.4 0 17.7-10.8 21.6-21 22.7 1.7 1.4 3.1 4.3 3.1 8.6v12.8c0 1.2.9 2.6 3.2 2.2C96.8 101.6 110 84.3 110 64c0-25.4-20.6-46-46-46z" fill="#ffffff"/>
      </svg>
    );
  }

  // GitLab
  if (key.includes('gitlab')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M121.7 51.5L108 9.5c-.8-2.4-4.2-2.4-5 0l-13.7 42H38.7L25 9.5c-.8-2.4-4.2-2.4-5 0L6.3 51.5c-.7 2.1 0 4.4 1.8 5.7l55.9 40.6 55.9-40.6c1.8-1.3 2.5-3.6 1.8-5.7z" fill="#E24329"/>
        <path d="M64 97.8l25.3-76.8H38.7L64 97.8z" fill="#FC6D26"/>
        <path d="M64 97.8L38.7 21H25L64 97.8z" fill="#FCA326"/>
        <path d="M6.3 51.5l1.8 5.7 55.9 40.6L25 21 6.3 51.5z" fill="#E24329"/>
        <path d="M121.7 51.5l-1.8 5.7-55.9 40.6L103 21l18.7 30.5z" fill="#E24329"/>
      </svg>
    );
  }

  // Visual Studio & VS Code
  if (key.includes('visualstudio') || key.includes('vscode') || key === 'vs') {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <path d="M96.7 122.9c3.7 1.9 8.3 1.4 11.5-1.5l16.1-14.7c2.4-2.2 3.7-5.4 3.7-8.7V30c0-3.3-1.3-6.5-3.7-8.7L108.2 6.6c-3.2-2.9-7.8-3.4-11.5-1.5-3.7 1.9-6 5.8-6 10v97.8c0 4.2 2.3 8.1 6 10z" fill="#5C2D91"/>
        <path d="M102.2 15.1L40.7 64l61.5 48.9V15.1z" fill="#68217A"/>
        <path d="M3.7 75.9c-2.4-2.2-3.7-5.4-3.7-8.7V60.8c0-3.3 1.3-6.5 3.7-8.7l22.7-20.7 20.8 19.8-27 24.7H3.7z" fill="#9B4993"/>
        <path d="M27.2 28.5L102.2 92v20.9L47.9 69.2 27.2 28.5z" fill="#007ACC"/>
      </svg>
    );
  }

  // xUnit / NUnit / Unit Testing / TDD
  if (key.includes('xunit') || key.includes('nunit') || key.includes('test') || key.includes('tdd')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#10B981"/>
        <path d="M54 28h20v24L88 78c3 5 0 12-6 16l-36 6c-8 1-15-4-16-12l-4-10 14-26V28h14z" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="64" cy="70" r="6" fill="#ffffff"/>
        <circle cx="56" cy="84" r="4" fill="#ffffff"/>
        <circle cx="72" cy="82" r="5" fill="#ffffff"/>
      </svg>
    );
  }

  // SpecFlow / Cucumber / BDD
  if (key.includes('specflow') || key.includes('cucumber') || key.includes('bdd') || key.includes('gherkin')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#0E7090"/>
        <circle cx="44" cy="64" r="16" fill="#22D3EE"/>
        <circle cx="84" cy="44" r="14" fill="#38BDF8"/>
        <circle cx="84" cy="84" r="14" fill="#38BDF8"/>
        <line x1="44" y1="64" x2="84" y2="44" stroke="#ffffff" strokeWidth="6"/>
        <line x1="44" y1="64" x2="84" y2="84" stroke="#ffffff" strokeWidth="6"/>
      </svg>
    );
  }

  // Agile / SCRUM / Jira / UML
  if (key.includes('scrum') || key.includes('agile') || key.includes('uml') || key.includes('jira')) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} className={className} fill="none">
        <rect width="128" height="128" rx="20" fill="#0284C7"/>
        <path d="M64 28a36 36 0 1 0 32 52l12 6-4-18-18 2 10 5a26 26 0 1 1-22-47V16l-18 18 18 18V42a26 26 0 0 1 10 2z" fill="#ffffff"/>
      </svg>
    );
  }

  // ==========================================
  // 6. DEFAULT HIGH-CONTRAST MONOGRAM FALLBACK
  // ==========================================
  const initial = (name || '?').trim().substring(0, 2).toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-red-400 font-mono font-bold text-[10px] select-none shadow-xs ${className}`}
      title={name}
    >
      <span>{initial}</span>
    </div>
  );
};
