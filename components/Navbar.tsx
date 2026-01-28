"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border-b border-white/5"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all shadow-lg group-hover:shadow-blue-500/20"
        >
          <Image
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiN3lb6zD8UmdVfbhENgNWXK1OjWDvwrZVUaEyMyjcOIxgzqIu5wzGUZusOD9WYXVVupp87PQ4lZcZl6ZyzPtFe8h4-TnjMLz31oDylO9UScGA0bi_miR8MKYufzevuezpGhNrpaOrgixQiPBkS9iZb8JalBVD5ueOhN4TB9x3T9N2yG4rwjEdDUGkoK0k/s554/images%20(2).png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </motion.div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold tracking-tight text-white leading-none">SMK Muhammadiyah</h1>
          <p className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">Bandongan</p>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-sm hover:shadow-blue-500/10"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Area</span>
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}
