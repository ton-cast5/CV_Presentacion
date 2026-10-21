import type { SupabaseClient } from "@supabase/supabase-js";
import type { CvData, Profile } from "@/lib/types";

export function publicStorageUrl(bucket: string, path: string | null | undefined) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export async function loadCvBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<CvData | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !profile) return null;
  return loadCvByProfile(supabase, profile as Profile);
}

export async function loadCvByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<CvData | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !profile) return null;
  return loadCvByProfile(supabase, profile as Profile);
}

async function loadCvByProfile(
  supabase: SupabaseClient,
  profile: Profile,
): Promise<CvData> {
  const [education, experience, projects, certifications, documents] =
    await Promise.all([
      supabase
        .from("education")
        .select("*")
        .eq("profile_id", profile.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("experience")
        .select("*")
        .eq("profile_id", profile.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("projects")
        .select("*")
        .eq("profile_id", profile.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("certifications")
        .select("*")
        .eq("profile_id", profile.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("documents")
        .select("*")
        .eq("profile_id", profile.id)
        .order("sort_order", { ascending: true }),
    ]);

  return {
    profile,
    education: education.data ?? [],
    experience: experience.data ?? [],
    projects: projects.data ?? [],
    certifications: certifications.data ?? [],
    documents: documents.data ?? [],
    photoUrl: publicStorageUrl("avatars", profile.foto_path),
  };
}
