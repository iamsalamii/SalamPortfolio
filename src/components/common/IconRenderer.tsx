import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name?: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  if (!name) {
    return <Icons.Code2 className={className} size={size} />;
  }

  // Normalize name
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[formattedName] ||
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name] ||
    Icons.Code2;

  return <IconComponent className={className} size={size} />;
};
