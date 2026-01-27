import { createClient } from "@supabase/supabase-js";

// Original credentials for instant deployment as requested
const SUPABASE_URL = "https://nvegzmpajoaryegqbunj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZWd6bXBham9hcnllZ3FidW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk5MzMsImV4cCI6MjA3OTcyNTkzM30.NSx3E9zJcgR-k2OTJWLM820ilZ3TVYZs6npjc0y5ADU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_TABLE = "userdata";
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
