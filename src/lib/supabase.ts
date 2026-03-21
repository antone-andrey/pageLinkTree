import { createClient } from "@supabase/supabase-js";

// Lazy-initialized to avoid build-time crashes when env vars are missing
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_REF || "ogqubbvumbtvhdydjjsa"}.supabase.co`;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const { error } = await getSupabase().storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = getSupabase().storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  await getSupabase().storage.from(bucket).remove([path]);
}
