"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SignatureCanvas from "react-signature-canvas";
import {
  User,
  Building2,
  Clock,
  Camera,
  Trash2,
  Eraser,
  Send,
  PenTool,
  Info,
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFileAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const SUPABASE_TABLE = process.env.NEXT_PUBLIC_SUPABASE_TABLE || "userdata";

export function GuestBookForm() {
  const [nama, setNama] = useState("");
  const [instansi, setInstansi] = useState("");
  const [maksud, setMaksud] = useState("");
  const [pesan, setPesan] = useState("");
  const [timeMode, setTimeMode] = useState<"auto" | "manual">("auto");
  const [manualTime, setManualTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sigCanvas = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearSignature = () => sigCanvas.current?.clear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nama) return setError("Nama Lengkap wajib diisi.");
    if (timeMode === "manual" && !manualTime) return setError("Silakan pilih waktu kehadiran.");
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
      let tanggal = new Date().toISOString();
      if (timeMode === "manual") {
        tanggal = new Date(manualTime).toISOString();
      }

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
    } catch (err) {
      console.error(err);
      setError("Gagal: " + (err instanceof Error ? err.message : "Kesalahan server."));
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
    clearImage();
    clearSignature();
    setError(null);
  };

  return (
    <>
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full text-center overflow-hidden border border-white/50 transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
            {/* Video Section */}
            <div className="relative w-full aspect-video bg-slate-100">
              <video
                src="https://files.catbox.moe/mhj67s.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50"></div>
            </div>

            {/* Text Content */}
            <div className="p-8 pt-2">
              <div className="mx-auto w-16 h-16 bg-green-100 border-4 border-white rounded-full flex items-center justify-center mb-4 shadow-lg -mt-10 relative z-10">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Berhasil Tersimpan!</h2>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Terima kasih atas kunjungan Anda.<br />Data telah berhasil masuk ke sistem.
              </p>

              <button
                onClick={resetForm}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-300 active:scale-[0.98]"
              >
                Isi Buku Tamu Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 overflow-hidden mb-8 border border-slate-100">
        <div className="bg-slate-900 px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
          <h2 className="text-xl font-bold text-white relative z-10">Buku Tamu Digital</h2>
          <p className="text-slate-300 text-xs mt-1 relative z-10">Mohon isi data dengan benar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 flex items-start">
              <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>
          </div>

          {/* Waktu */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Waktu Kehadiran</label>
            <div className="bg-slate-50 p-1.5 rounded-xl flex mb-3 border border-slate-200">
              <button
                type="button"
                onClick={() => setTimeMode("auto")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition",
                  timeMode === "auto" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                )}
              >
                Otomatis
              </button>
              <button
                type="button"
                onClick={() => setTimeMode("manual")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition",
                  timeMode === "manual" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                )}
              >
                Manual
              </button>
            </div>

            {timeMode === "auto" ? (
              <div className="w-full px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 flex justify-between items-center font-medium">
                <span>{currentTime || "Checking time..."}</span>
                <Clock className="w-5 h-5 opacity-70" />
              </div>
            ) : (
              <input
                type="datetime-local"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 outline-none focus:border-blue-500"
              />
            )}
          </div>

          {/* Instansi */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Asal Instansi</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                placeholder="Instansi / Organisasi / Umum"
              />
            </div>
          </div>

          {/* Maksud */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Maksud & Tujuan</label>
            <textarea
              value={maksud}
              onChange={(e) => setMaksud(e.target.value)}
              rows={2}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition"
              placeholder="Tujuan kunjungan Anda..."
            ></textarea>
          </div>

          {/* Pesan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kesan & Pesan</label>
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              rows={2}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition"
              placeholder="Pesan untuk sekolah..."
            ></textarea>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Foto Dokumentasi *</label>

            {!imagePreview ? (
              <div
                className="relative w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-slate-600 block">Ambil Foto / Upload</span>
                <span className="text-xs text-slate-400 mt-1 block">Format JPG/PNG</span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group bg-slate-900">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={500}
                  height={256}
                  className="w-full h-64 object-contain mx-auto"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={clearImage}
                    className="bg-white px-4 py-2 rounded-full text-red-600 font-medium text-sm hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Hapus Foto
                  </button>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Tanda Tangan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tanda Tangan *</label>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white relative shadow-sm">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="#0f172a"
                canvasProps={{
                  className: "w-full h-48 block cursor-crosshair",
                  style: { touchAction: "none" }
                }}
              />
              <div className="absolute top-3 left-3 pointer-events-none opacity-20">
                <PenTool className="w-5 h-5" />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700 font-medium px-3 py-1.5 bg-red-50 rounded-lg transition"
              >
                <Eraser className="w-3 h-3" /> Bersihkan
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-3",
              loading && "opacity-75 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Simpan Data Tamu</span>
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
