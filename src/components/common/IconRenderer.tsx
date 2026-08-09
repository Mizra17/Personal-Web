import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  // Map common custom icon names or find directly in Lucide
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[name] || LucideIcons.Code;

  return <IconComponent className={className} size={size} />;
};
