"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Calendar, BarChart3, Image as ImageIcon,
  PenTool, LogOut, RefreshCw, Download, Search,
  Eye, Trash2, LayoutDashboard, Sparkles, Menu, X,
  Crown, Package
} from "lucide-react";
import { supabase, SUPABASE_TABLE, GuestBookEntry } from "@/lib/supabase";
import { checkAuthAction, logoutAction } from "@/lib/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate, cn } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GuestBookEntry[]>([]);
  const [filteredData, setFilteredData] = useState<GuestBookEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<GuestBookEntry | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    month: 0,
    photo: 0,
    sign: 0
  });

  const checkAuth = useCallback(async () => {
    const isAuthenticated = await checkAuthAction();
    if (!isAuthenticated) {
      router.push("/admin");
    }
    setIsPremium(localStorage.getItem("adminPremium") === "true");
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData, error } = await supabase
        .from(SUPABASE_TABLE)
        .select("*")
        .order("tanggal", { ascending: false });

      if (error) throw error;

      const entries = (userData || []) as GuestBookEntry[];
      setData(entries);
      setFilteredData(entries);
      calculateStats(entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (userData: GuestBookEntry[]) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    setStats({
      total: userData.length,
      today: userData.filter(i => i.tanggal && i.tanggal.startsWith(todayStr)).length,
      month: userData.filter(i => i.tanggal && i.tanggal.startsWith(monthStr)).length,
      photo: userData.filter(i => i.image_url).length,
      sign: userData.filter(i => i.signature_url).length,
    });
  };

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [checkAuth, fetchData]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredData(
      data.filter(item =>
        (item.nama || "").toLowerCase().includes(term) ||
        (item.instansi || "").toLowerCase().includes(term)
      )
    );
  }, [searchTerm, data]);

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem("adminPremium");
    router.push("/admin");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data ini permanen?")) return;
    try {
      const { error } = await supabase.from(SUPABASE_TABLE).delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus.");
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = ["ID", "Nama", "Instansi", "Maksud", "Pesan", "Tanggal"];
    const csvRows = [headers.join(",")];
    data.forEach(item => {
      csvRows.push([
        item.id,
        `"${item.nama || ""}"`,
        `"${item.instansi || ""}"`,
        `"${item.maksud || ""}"`,
        `"${item.tujuan || ""}"`,
        item.tanggal
      ].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `buku_tamu_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"
        />
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-white/5 flex flex-col p-6 z-50 transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Admin Panel</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">v4.0 Futuristic</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-bold border border-blue-500/20">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
            <Sparkles className="w-5 h-5" />
            Premium Features
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
             <div className={cn(
               "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
               isPremium ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
             )}>
                {isPremium ? <Crown className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                {isPremium ? "Premium Plan" : "Free Plan"}
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Administrator</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Online Now</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 bg-gradient-to-br from-blue-600 to-purple-800 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-black mb-2 md:mb-4">Selamat Datang di Panel Admin</h2>
              <p className="text-blue-100/80 max-w-xl text-sm md:text-lg leading-relaxed">
                Kelola semua data kunjungan tamu dengan sistem yang modern, cepat, dan aman.
                Pantau statistik secara real-time.
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             <StatCard label="Total Tamu" value={stats.total} icon={<Users />} color="blue" index={0} />
             <StatCard label="Hari Ini" value={stats.today} icon={<Calendar />} color="green" index={1} />
             <StatCard label="Bulan Ini" value={stats.month} icon={<BarChart3 />} color="purple" index={2} />
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-[2rem] flex flex-col justify-between"
             >
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Kelengkapan</p>
                <div className="flex items-end gap-3 md:gap-4 mt-2">
                   <div>
                      <span className="block text-2xl md:text-3xl font-black">{stats.photo}</span>
                      <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase">Foto</span>
                   </div>
                   <div className="w-px h-6 md:h-8 bg-white/10" />
                   <div>
                      <span className="block text-2xl md:text-3xl font-black">{stats.sign}</span>
                      <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase">TTD</span>
                   </div>
                </div>
             </motion.div>
          </div>

          {/* Table Area */}
          <GlassCard className="!p-0 border-white/5">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.02]">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Daftar Tamu Terbaru
              </h3>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Cari nama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={fetchData}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                    <th className="p-6">Informasi Tamu</th>
                    <th className="p-6 hidden md:table-cell">Maksud / Pesan</th>
                    <th className="p-6 hidden sm:table-cell">Waktu</th>
                    <th className="p-6 text-center">Lampiran</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                  {filteredData.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        delay: Math.min(idx * 0.03, 0.5),
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[120px] sm:max-w-none">{item.nama}</div>
                        <div className="text-xs text-slate-500 font-medium truncate max-w-[120px] sm:max-w-none">{item.instansi}</div>
                      </td>
                      <td className="p-6 hidden md:table-cell">
                        <div className="text-sm text-slate-300 line-clamp-1 max-w-[200px]">{item.maksud || "-"}</div>
                        <div className="text-[10px] text-slate-600 line-clamp-1 max-w-[200px]">{item.tujuan || "-"}</div>
                      </td>
                      <td className="p-6 hidden sm:table-cell">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400">
                          {formatDate(item.tanggal)}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2">
                           {item.image_url ? (
                             <a href={item.image_url} target="_blank" className="w-10 h-10 relative rounded-lg overflow-hidden border border-white/10 bg-slate-800 group-hover:border-blue-500/50 transition-all">
                               <Image src={item.image_url} alt="Foto" fill className="object-cover" />
                             </a>
                           ) : (
                             <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-700" /></div>
                           )}
                           {item.signature_url ? (
                             <a href={item.signature_url} target="_blank" className="w-10 h-10 relative rounded-lg overflow-hidden border border-white/10 bg-white p-1 group-hover:border-blue-500/50 transition-all">
                               <Image src={item.signature_url} alt="TTD" fill className="object-contain p-1" />
                             </a>
                           ) : (
                             <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center"><PenTool className="w-4 h-4 text-slate-700" /></div>
                           )}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedEntry(item)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-blue-400 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="py-20 text-center">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-700" />
                   </div>
                   <p className="text-slate-500 font-medium">Tidak ada data ditemukan.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Detail Tamu
                </h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Foto Dokumentasi</label>
                      <div className="aspect-[4/3] relative rounded-2xl overflow-hidden border border-white/10 bg-slate-800">
                        {selectedEntry.image_url ? (
                          <Image src={selectedEntry.image_url} alt="Foto" fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic text-sm">Tidak ada foto</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Tanda Tangan</label>
                      <div className="h-32 relative rounded-2xl overflow-hidden border border-white/10 bg-white p-4">
                        {selectedEntry.signature_url ? (
                          <Image src={selectedEntry.signature_url} alt="TTD" fill className="object-contain p-4" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic text-sm">Tidak ada TTD</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Nama Lengkap</label>
                      <p className="text-xl font-bold text-white">{selectedEntry.nama || "-"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Asal Instansi</label>
                      <p className="text-slate-300 font-medium">{selectedEntry.instansi || "-"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Waktu Kunjungan</label>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(selectedEntry.tanggal)}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Maksud & Tujuan</label>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-slate-300 leading-relaxed">{selectedEntry.maksud || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Pesan & Kesan</label>
                      <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                        <p className="text-sm text-blue-100 leading-relaxed">{selectedEntry.tujuan || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon, color, index }: { label: string, value: number, icon: React.ReactNode, color: "blue" | "green" | "purple", index: number }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-[2rem] flex flex-col justify-between transition-all hover:border-blue-500/30 hover:bg-white/[0.08] group"
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className={cn("p-1.5 md:p-2 rounded-xl border", colors[color])}>
          {icon}
        </div>
      </div>
      <div className="mt-2 md:mt-4">
        <h3 className="text-2xl md:text-4xl font-black">{value}</h3>
      </div>
    </motion.div>
  );
}
