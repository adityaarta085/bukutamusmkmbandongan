"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User, Building2, MessageSquare, Camera, PenTool,
  Trash2, Send, CheckCircle2, Info, Clock, Eraser
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShinyButton } from "@/components/ui/ShinyButton";
import { cn } from "@/lib/utils";
import { supabase, SUPABASE_TABLE } from "@/lib/supabase";
import { uploadFileAction } from "@/lib/actions";
import confetti from "canvas-confetti";

export function GuestBookForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nama, setNama] = useState("");
  const [instansi, setInstansi] = useState("");
  const [maksud, setMaksud] = useState("");
  const [pesan, setPesan] = useState("");
  const [timeMode, setTimeMode] = useState<"auto" | "manual">("auto");
  const [manualTime, setManualTime] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const sigCanvas = useRef<SignatureCanvas>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const clearSignature = () => sigCanvas.current?.clear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nama) return setError("Nama wajib diisi.");
    if (!image) return setError("Harap ambil/upload foto dokumentasi.");
    if (sigCanvas.current?.isEmpty()) return setError("Harap bubuhkan tanda tangan.");

    setLoading(true);

    try {
      // 1. Upload Photo
      const photoFormData = new FormData();
      photoFormData.append("file", image);
      photoFormData.append("ext", "jpg");
      const imageUrl = await uploadFileAction(photoFormData);

      // 2. Upload Signature
      const sigDataURL = sigCanvas.current!.getTrimmedCanvas().toDataURL("image/png");
      const sigBlob = await (await fetch(sigDataURL)).blob();
      const sigFile = new File([sigBlob], "signature.png", { type: "image/png" });

      const sigFormData = new FormData();
      sigFormData.append("file", sigFile);
      sigFormData.append("ext", "png");
      const signatureUrl = await uploadFileAction(sigFormData);

      // 3. Save to Supabase
      const tanggal = timeMode === "auto" ? new Date().toISOString() : new Date(manualTime).toISOString();

      const { error: dbError } = await supabase.from(SUPABASE_TABLE).insert({
        nama,
        instansi: instansi || "-",
        maksud: maksud || "-",
        tujuan: pesan || "-",
        image_url: imageUrl,
        signature_url: signatureUrl,
        tanggal,
      });

      if (dbError) throw dbError;

      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#60a5fa", "#ffffff"],
      });

    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data: " + (err instanceof Error ? err.message : "Terjadi kesalahan server."));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setNama("");
    setInstansi("");
    setMaksud("");
    setPesan("");
    setTimeMode("auto");
    setManualTime("");
    setImage(null);
    setImagePreview(null);
    sigCanvas.current?.clear();
  };

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto"
      >
        <GlassCard className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Berhasil Tersimpan!</h2>
          <p className="text-slate-400 mb-8">
            Terima kasih atas kunjungan Anda. Data Anda telah aman tersimpan dalam sistem kami.
          </p>
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-900 border border-white/5">
             <video src="https://files.catbox.moe/mhj67s.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
          <ShinyButton onClick={resetForm} className="w-full">
            Isi Lagi
          </ShinyButton>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GlassCard>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Send className="w-6 h-6 text-blue-500" />
            Buku Tamu Digital
          </h2>
          <p className="text-slate-400 text-sm mt-2">Silakan lengkapi informasi di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nama Lengkap *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            {/* Instansi */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Asal Instansi</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white"
                  placeholder="Instansi / Sekolah / Umum"
                />
              </div>
            </div>
          </div>

          {/* Waktu */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Waktu Kehadiran</label>
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setTimeMode("auto")}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                  timeMode === "auto" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                Otomatis
              </button>
              <button
                type="button"
                onClick={() => setTimeMode("manual")}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                  timeMode === "manual" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                Manual
              </button>
            </div>
            {timeMode === "auto" ? (
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex justify-between items-center">
                <span className="text-blue-400 font-medium">{currentTime || "Loading..."}</span>
                <Clock className="w-5 h-5 text-blue-500/50" />
              </div>
            ) : (
              <input
                type="datetime-local"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white"
              />
            )}
          </div>

          {/* Maksud & Tujuan */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Maksud & Kesan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                  <textarea
                    value={maksud}
                    onChange={(e) => setMaksud(e.target.value)}
                    rows={2}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white resize-none"
                    placeholder="Maksud kunjungan..."
                  />
               </div>
               <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                  <textarea
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    rows={2}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white resize-none"
                    placeholder="Kesan & Pesan..."
                  />
               </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Foto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Foto Dokumentasi *</label>
              <div className="relative group">
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] cursor-pointer hover:bg-white/10 hover:border-blue-500/50 transition-all group shadow-inner">
                    <div className="p-6 rounded-full bg-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                      <Camera className="w-10 h-10 text-blue-500" />
                    </div>
                    <span className="text-base text-slate-400 mt-4 font-semibold tracking-wide">Klik untuk Ambil Foto</span>
                    <p className="text-xs text-slate-500 mt-1">Pastikan wajah terlihat jelas</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-80 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={clearImage}
                        className="p-4 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tanda Tangan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Tanda Tangan Digital *</label>
              <div className="relative bg-white rounded-[2.5rem] overflow-hidden h-80 border-4 border-blue-500/20 shadow-2xl group">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#020617"
                  canvasProps={{ className: "w-full h-full cursor-crosshair" }}
                />
                <button
                  type="button"
                  onClick={clearSignature}
                  className="absolute bottom-6 right-6 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg active:scale-90 flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                >
                  <Eraser className="w-4 h-4" />
                  Bersihkan
                </button>
                <div className="absolute top-6 left-6 pointer-events-none flex items-center gap-2 text-slate-300">
                  <PenTool className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sign Here</span>
                </div>

                {/* Decorative border animation */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/10 transition-colors pointer-events-none rounded-[2.5rem]" />
              </div>
            </motion.div>
          </div>

          <ShinyButton
            type="submit"
            disabled={loading}
            className="w-full py-5 text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses Data...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Send className="w-5 h-5" />
                <span>Simpan Kunjungan</span>
              </div>
            )}
          </ShinyButton>
        </form>
      </GlassCard>
    </div>
  );
}
