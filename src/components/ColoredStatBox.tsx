import React from 'react';
import { cn } from '../lib/utils';

interface ColoredStatBoxProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  className?: string;
}

export function ColoredStatBox({ title, value, icon: Icon, color, trend, className }: ColoredStatBoxProps) {
  return (
    <div 
      className={cn("rounded-[14px] p-4 text-white flex flex-col gap-2", className)}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        {trend && <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <div className="text-xs font-medium opacity-90">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
