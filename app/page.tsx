import { Navbar } from "@/components/Navbar";
import FuturisticBackground from "@/components/canvas/FuturisticBackground";
import { Hero } from "@/components/sections/Hero";
import { GuestBookForm } from "@/components/sections/GuestBookForm";
import { GSAPReveal } from "@/components/GSAPReveal";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <FuturisticBackground />
      <Navbar />

      <div className="relative z-10">
        <Hero />

        <section className="px-6 pb-32">
          <GSAPReveal>
            <GuestBookForm />
          </GSAPReveal>
        </section>

        <footer className="py-10 text-center border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} SMK Muhammadiyah Bandongan. <br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            Powered by <span className="text-blue-400">Student Innovation</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
