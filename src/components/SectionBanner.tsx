import React from 'react';
import { cn } from '../lib/utils';

interface SectionBannerProps {
  title: string;
  color: string;
  className?: string;
}

export function SectionBanner({ title, color, className }: SectionBannerProps) {
  return (
    <div 
      className={cn("px-4 py-3 rounded-md font-bold uppercase text-sm mb-4", className)}
      style={{ 
        backgroundColor: `${color}20`, 
        color: color 
      }}
    >
      {title}
    </div>
  );
}
