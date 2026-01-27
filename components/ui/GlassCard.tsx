import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn(
      "relative group rounded-[2.5rem] overflow-hidden",
      "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
      "hover:border-blue-500/30 transition-all duration-500",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
