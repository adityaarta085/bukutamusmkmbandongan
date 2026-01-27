import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_TABLE = process.env.NEXT_PUBLIC_SUPABASE_TABLE || "userdata";
export const SUPABASE_ADMIN_TABLE = "admin";

export interface GuestBookEntry {
  id: string;
  nama: string;
  instansi: string;
  maksud: string;
  tujuan: string;
  image_url: string;
  signature_url: string;
  tanggal: string;
}
