import { GuestBookForm } from "@/components/sections/GuestBookForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 relative bg-[#F0F6FF]">
      {/* Top Left Logo */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <Image
          src="https://api.deline.web.id/QWzeCf1ENY.jpg"
          alt="Logo SMK"
          width={56}
          height={56}
          className="h-12 md:h-14 w-auto object-contain rounded-lg shadow-sm bg-white/50 backdrop-blur-sm"
          unoptimized
        />
      </div>

      <div className="max-w-md mx-auto text-center mb-8 pt-6">
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg shadow-blue-100 flex items-center justify-center p-2">
            <Image
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiN3lb6zD8UmdVfbhENgNWXK1OjWDvwrZVUaEyMyjcOIxgzqIu5wzGUZusOD9WYXVVupp87PQ4lZcZl6ZyzPtFe8h4-TnjMLz31oDylO9UScGA0bi_miR8MKYufzevuezpGhNrpaOrgixQiPBkS9iZb8JalBVD5ueOhN4TB9x3T9N2yG4rwjEdDUGkoK0k/s554/images%20(2).png"
              alt="Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          SMK Muhammadiyah<br />Bandongan
        </h1>
        <p className="text-slate-500 text-sm mt-2">Silakan isi buku tamu di bawah ini</p>
      </div>

      <section className="max-w-[500px] mx-auto">
        <GuestBookForm />
      </section>

      <footer className="mt-12 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          &copy; {new Date().getFullYear()} SMK Muhammadiyah Bandongan
        </p>
      </footer>
    </main>
  );
}
