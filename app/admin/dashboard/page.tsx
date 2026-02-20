"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Sparkles,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Download,
  Users,
  Calendar,
  Camera,
  PenTool,
  Eye,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  ImageOff
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logoutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const SUPABASE_TABLE = process.env.NEXT_PUBLIC_SUPABASE_TABLE || "userdata";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsPremium(localStorage.getItem("adminPremium") === "true");
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const { data: entries, error } = await supabase
        .from(SUPABASE_TABLE)
        .select("*")
        .order("tanggal", { ascending: false });

      if (error) throw error;
      setData(entries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Logout?")) {
      await logoutAction();
      localStorage.removeItem("adminPremium");
      router.push("/admin");
    }
  };

  const handleDelete = async () => {
    if (!idToDelete) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from(SUPABASE_TABLE).delete().eq("id", idToDelete);
      if (error) throw error;
      setData(data.filter(item => item.id !== idToDelete));
      setIdToDelete(null);
    } catch (err) {
      alert("Gagal menghapus data.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = ["ID", "Nama", "Instansi", "Maksud", "Pesan", "Tanggal", "Image URL", "Signature URL"];
    const csvRows = [headers.join(",")];
    data.forEach(item => {
      csvRows.push([
        item.id,
        `"${item.nama||''}"`,
        `"${item.instansi||''}"`,
        `"${item.maksud||''}"`,
        `"${item.tujuan||''}"`,
        item.tanggal,
        item.image_url||'',
        item.signature_url||''
      ].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "buku_tamu_" + new Date().toISOString().split('T')[0] + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data.filter(item =>
    (item.nama || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.instansi || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: data.length,
    today: data.filter(i => i.tanggal && i.tanggal.startsWith(new Date().toISOString().split('T')[0])).length,
    month: data.filter(i => i.tanggal && i.tanggal.startsWith(new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, '0'))).length,
    photo: data.filter(i => i.image_url).length,
    sign: data.filter(i => i.signature_url).length,
  };

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateFull = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] relative text-slate-900">

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white fixed inset-y-0 left-0 w-64 border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Image
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiN3lb6zD8UmdVfbhENgNWXK1OjWDvwrZVUaEyMyjcOIxgzqIu5wzGUZusOD9WYXVVupp87PQ4lZcZl6ZyzPtFe8h4-TnjMLz31oDylO9UScGA0bi_miR8MKYufzevuezpGhNrpaOrgixQiPBkS9iZb8JalBVD5ueOhN4TB9x3T9N2yG4rwjEdDUGkoK0k/s554/images%20(2).png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
            unoptimized
          />
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Admin Panel</h1>
            <p className="text-[10px] text-slate-500">v3.1 Premium</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition",
              activeTab === "dashboard" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("premium"); setSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition",
              activeTab === "premium" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Sparkles className={cn("w-5 h-5", activeTab === "premium" ? "text-amber-500" : "text-slate-400")} />
            Fitur Premium
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-100 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-medium text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-all">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {isPremium ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Premium Plan
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Free Plan
                </>
              )}
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition shadow-sm"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            Refresh
          </button>
        </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" ? (
          <main className="p-4 md:p-8 flex-1">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
              <StatCard label="Total Tamu" value={stats.total} icon={<Users className="w-5 h-5 text-blue-500" />} />
              <StatCard label="Hari Ini" value={stats.today} icon={<Calendar className="w-5 h-5 text-green-500" />} />
              <StatCard label="Bulan Ini" value={stats.month} icon={<Calendar className="w-5 h-5 text-purple-500" />} />
              <StatCard label="Pake Foto" value={stats.photo} icon={<Camera className="w-5 h-5 text-orange-500" />} />
              <StatCard label="Pake TTD" value={stats.sign} icon={<PenTool className="w-5 h-5 text-indigo-500" />} />
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau instansi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>
                <button
                  onClick={exportCSV}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] md:text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                      <th className="px-4 py-4">Tamu</th>
                      <th className="px-4 py-4 hidden sm:table-cell">Maksud & Tujuan</th>
                      <th className="px-4 py-4 hidden md:table-cell">Waktu</th>
                      <th className="px-4 py-4 text-center">Foto / TTD</th>
                      <th className="px-4 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-slate-300" />
                          Memuat data...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                          Tidak ada data tamu.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{item.nama || 'Tanpa Nama'}</div>
                            <div className="text-xs text-slate-500 font-medium">{item.instansi || '-'}</div>
                          </td>
                          <td className="p-4 hidden sm:table-cell text-sm text-slate-600 truncate max-w-[150px]">
                            {item.maksud || '-'}
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 border border-slate-200 whitespace-nowrap">
                              {formatDate(item.tanggal)}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              {item.image_url ? (
                                <a href={item.image_url} target="_blank" className="w-9 h-9 rounded-lg bg-slate-100 block overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-400 transition relative">
                                  <Image src={item.image_url} alt="Foto" fill className="object-cover" unoptimized />
                                </a>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
                                  <ImageOff className="w-4 h-4 text-slate-300" />
                                </div>
                              )}
                              {item.signature_url ? (
                                <a href={item.signature_url} target="_blank" className="w-9 h-9 rounded-lg bg-white block p-1 border border-slate-200 hover:ring-2 hover:ring-blue-400 transition relative">
                                  <Image src={item.signature_url} alt="TTD" fill className="object-contain" unoptimized />
                                </a>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
                                  <PenTool className="w-4 h-4 text-slate-300" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setSelectedEntry(item)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setIdToDelete(item.id)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        ) : (
          <main className="p-8 flex-1 flex items-center justify-center text-center">
            <div className="max-w-md">
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Fitur Premium Aktif</h2>
              <p className="text-slate-500">Dashboard Anda saat ini menggunakan versi Premium v3.1. Semua fitur manajemen data tamu telah terbuka.</p>
            </div>
          </main>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedEntry(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Detail Data Tamu
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
                  {selectedEntry.image_url ? (
                    <Image src={selectedEntry.image_url} alt="Foto" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 italic text-xs">
                      <ImageOff className="w-8 h-8 mb-2 opacity-20" />
                      No Photo
                    </div>
                  )}
                </div>
                <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-slate-200 p-4 relative">
                  {selectedEntry.signature_url ? (
                    <Image src={selectedEntry.signature_url} alt="TTD" fill className="object-contain" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 italic text-xs">
                      <PenTool className="w-8 h-8 mb-2 opacity-20" />
                      No TTD
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nama Lengkap</label>
                  <p className="font-bold text-slate-900">{selectedEntry.nama || '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Asal Instansi</label>
                  <p className="font-medium text-slate-600">{selectedEntry.instansi || '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Maksud & Tujuan</label>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedEntry.maksud || '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Kesan & Pesan</label>
                  <p className="text-sm text-slate-600 bg-blue-50/50 p-3 rounded-xl border border-blue-50/10 italic">"{selectedEntry.tujuan || '-'}"</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateFull(selectedEntry.tanggal)}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition shadow-sm"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {idToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Data?</h3>
            <p className="text-slate-500 text-sm mb-8">Data yang dihapus tidak dapat dikembalikan lagi. Anda yakin?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIdToDelete(null)}
                className="py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-lg md:text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
}
