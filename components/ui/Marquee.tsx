"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: number;
}

export const Marquee = ({ text, className, speed = 30 }: MarqueeProps) => {
  return (
    <div className={cn("relative flex overflow-x-hidden border-y border-white/5 bg-white/[0.02] py-6 backdrop-blur-sm group", className)}>
      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
        className="flex whitespace-nowrap group-hover:[animation-play-state:paused]"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-8 text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-blue-500/40 via-blue-400/60 to-blue-500/40">
            {text} &nbsp; • &nbsp;
          </span>
        ))}
        {[...Array(4)].map((_, i) => (
          <span key={i + 4} className="mx-8 text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-blue-500/40 via-blue-400/60 to-blue-500/40">
            {text} &nbsp; • &nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
};
