"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 md:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Future of School Visitation</span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.9] tracking-tighter"
        >
          {["SMK", "Muhammadiyah", "Bandongan"].map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50, rotateX: -45 },
                visible: { opacity: 1, y: 0, rotateX: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
              className={cn(
                "inline-block mr-4 last:mr-0",
                i === 2 && "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 pb-2"
              )}
            >
              {word}
              {i === 1 && <br className="hidden md:block" />}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Selamat datang di platform Buku Tamu Digital masa depan.
          Silakan lengkapi data kunjungan Anda dengan pengalaman yang immersive dan modern.
        </motion.p>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[160px] rounded-full -z-10 animate-pulse" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"
        />
      </motion.div>
    </section>
  );
}
