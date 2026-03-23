import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn("bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
