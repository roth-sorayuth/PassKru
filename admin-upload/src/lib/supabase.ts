import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[admin-upload] Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to the "papers" Supabase Storage bucket.
 * Returns the public URL on success.
 */
export async function uploadPaperToStorage(file: File): Promise<{ publicUrl: string; fileSize: string }> {
  const ext = file.name.split('.').pop() ?? 'pdf';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `past-papers/${fileName}`;

  const { error } = await supabase.storage.from('papers').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/pdf',
  });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from('papers').getPublicUrl(filePath);
  const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  return { publicUrl: data.publicUrl, fileSize };
}

/**
 * Upload a file to the "announcement" Supabase Storage bucket.
 * Returns the public URL on success.
 */
export async function uploadAnnouncementToStorage(file: File): Promise<{ publicUrl: string; fileSize: string }> {
  const ext = file.name.split('.').pop() ?? 'pdf';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `documents/${fileName}`;

  const { error } = await supabase.storage.from('Announcement').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/pdf',
  });

  if (error) {
    throw new Error(`Supabase announcement upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from('Announcement').getPublicUrl(filePath);
  const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  return { publicUrl: data.publicUrl, fileSize };
}
