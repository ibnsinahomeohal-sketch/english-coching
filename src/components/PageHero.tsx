import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  darkColor: string;
  pattern: React.ReactNode;
  badge: string;
}

export function PageHero({ title, subtitle, icon: Icon, darkColor, pattern, badge }: PageHeroProps) {
  return (
    <div className="relative h-[200px] w-full overflow-hidden" style={{ backgroundColor: darkColor }}>
      {/* SVG Pattern */}
      <div className="absolute inset-0 opacity-20">
        {pattern}
      </div>

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(to top, ${darkColor}ee 0%, ${darkColor}40 100%)` 
        }}
      />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/10 p-1.5 rounded-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className="bg-[rgba(255,255,255,0.18)] text-white text-xs font-medium px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
        <h1 className="text-white text-[22px] font-bold">{title}</h1>
        <p className="text-white/65 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
