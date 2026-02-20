"use server";

import axios from "axios";
import { cookies } from "next/headers";

const UPLOAD_DELINE = "https://api.deline.web.id/uploader";
const TERMAI_DOMAIN = process.env.TERMAI_DOMAIN || "https://c.termai.cc";
const UPLOAD_TERMAI = `${TERMAI_DOMAIN}/api/upload`;
const KEY_TERMAI = process.env.TERMAI_API_KEY;

export async function uploadFileAction(formData: FormData) {
  const file = formData.get("file") as File;
  const ext = formData.get("ext") as string;

  if (!file) throw new Error("No file provided");

  // Try Deline
  try {
    const fd = new FormData();
    fd.append("file", file, `upload_${Date.now()}.${ext}`);
    const res = await axios.post(UPLOAD_DELINE, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const link = res.data?.result?.link || res.data?.url || res.data?.path;
    if (link) return link;
  } catch (err) {
    console.warn("Deline upload failed, trying Termai...", err);
  }

  // Try Termai
  try {
    const fd = new FormData();
    fd.append("file", file, `file.${ext}`);
    const res = await axios.post(`${UPLOAD_TERMAI}?key=${KEY_TERMAI}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data && res.data.status) {
      return res.data.path;
    }
  } catch (err) {
    console.error("Termai upload failed", err);
  }

  throw new Error("All upload methods failed");
}

export async function loginAction(username: string, password: string) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { success: false, error: "Konfigurasi Supabase tidak ditemukan." };
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/admin?username=eq.${username}&password=eq.${password}`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: `Gagal menghubungi database: ${res.statusText}` };
    }

    const data = await res.json();

    if (data && Array.isArray(data) && data.length > 0) {
      const admin = data[0];
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 // 1 day
      });
      return { success: true, isPremium: admin.is_premium };
    }

    return { success: false, error: "Username atau password salah." };
  } catch (err) {
    console.error("Login action error:", err);
    return { success: false, error: "Terjadi kesalahan internal pada server." };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
  } catch (err) {
    console.error("Logout error:", err);
  }
}

export async function checkAuthAction() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "true";
  } catch (err) {
    console.error("Check auth error:", err);
    return false;
  }
}
