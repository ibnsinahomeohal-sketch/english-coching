import React from 'react';
import { cn } from '../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  className?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon: Icon, color, className, action }: PageHeaderProps) {
  return (
    <div 
      className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[24px] text-white mb-6", className)}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 w-12 h-12 rounded-[14px] flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
