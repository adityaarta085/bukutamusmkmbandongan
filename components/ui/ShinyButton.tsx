"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShinyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function ShinyButton({
  children,
  onClick,
  className,
  type = "button",
  disabled = false
}: ShinyButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-8 py-4 bg-blue-600 rounded-2xl font-bold text-white overflow-hidden group transition-all duration-300",
        "shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]",
        "hover:ring-2 hover:ring-blue-400/50 hover:ring-offset-4 hover:ring-offset-slate-950",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
