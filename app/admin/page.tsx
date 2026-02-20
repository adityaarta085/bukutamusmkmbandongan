"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Key,
  ArrowLeft,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "@/lib/actions";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAction(username, password);

      if (!res.success) throw new Error(res.error);

      localStorage.setItem("adminPremium", res.isPremium ? "true" : "false");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F6FF] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg shadow-blue-100 flex items-center justify-center p-2">
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
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Silakan masuk untuk mengakses dashboard</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 p-8 border border-white">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                  placeholder="Username admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                  placeholder="Password admin"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 flex items-center justify-center mt-4"
            >
              <span>{loading ? "Memproses..." : "Masuk Dashboard"}</span>
              {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-slate-500 text-sm font-medium hover:text-slate-800 transition flex items-center justify-center mx-auto py-2 px-4 rounded-lg hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Halaman Tamu
          </Link>
        </div>
      </div>
    </main>
  );
}
