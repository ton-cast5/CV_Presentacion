import type { SupabaseClient } from "@supabase/supabase-js";
import type { CvData, DocumentRow, Profile } from "@/lib/types";

export function publicStorageUrl(bucket: string, path: string | null | undefined) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export async function loadCvBySlug(
  supabase: SupabaseClient,
  slug: string,
  opts?: { includeDocuments?: boolean; documentMetaOnly?: boolean },
): Promise<CvData | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !profile) return null;
  return loadCvByProfile(supabase, profile as Profile, opts);
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
  opts?: { includeDocuments?: boolean; documentMetaOnly?: boolean },
): Promise<CvData> {
  const includeDocuments = opts?.includeDocuments !== false;
  const documentMetaOnly = Boolean(opts?.documentMetaOnly);

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
      includeDocuments
        ? documentMetaOnly
          ? supabase
              .from("documents")
              .select("id, category, nombre, sort_order, profile_id")
              .eq("profile_id", profile.id)
              .order("sort_order", { ascending: true })
          : supabase
              .from("documents")
              .select("*")
              .eq("profile_id", profile.id)
              .order("sort_order", { ascending: true })
        : Promise.resolve({ data: [] as DocumentRow[] }),
    ]);

  let docs: DocumentRow[] = [];
  if (includeDocuments && documents.data) {
    if (documentMetaOnly) {
      // Public: names/categories only — never expose storage paths or files
      docs = (
        documents.data as {
          id: string;
          profile_id: string;
          category: DocumentRow["category"];
          nombre: string;
          sort_order: number;
        }[]
      ).map((d) => ({
        id: d.id,
        profile_id: d.profile_id,
        category: d.category,
        nombre: d.nombre,
        descripcion: "",
        mime_type: "",
        storage_path: "",
        size: 0,
        sort_order: d.sort_order ?? 0,
      }));
    } else {
      docs = documents.data as DocumentRow[];
    }
  }

  return {
    profile,
    education: education.data ?? [],
    experience: experience.data ?? [],
    projects: projects.data ?? [],
    certifications: certifications.data ?? [],
    documents: docs,
    photoUrl: publicStorageUrl("avatars", profile.foto_path),
  };
}
