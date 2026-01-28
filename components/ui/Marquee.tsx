"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: number;
}

export const Marquee = ({ text, className, speed = 20 }: MarqueeProps) => {
  return (
    <div className={cn("relative flex overflow-x-hidden border-y border-white/5 bg-white/[0.02] py-3 backdrop-blur-sm", className)}>
      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
        className="flex whitespace-nowrap"
      >
        <span className="mx-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-400/80">
          {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp;
        </span>
        <span className="mx-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-400/80">
          {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp;
        </span>
      </motion.div>
    </div>
  );
};
