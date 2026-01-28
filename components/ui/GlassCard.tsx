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
      "bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl",
      "hover:border-white/20 hover:bg-white/[0.05] transition-all duration-700 ease-out",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/10 before:via-transparent before:to-purple-500/10 before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-700",
      className
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10 p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
