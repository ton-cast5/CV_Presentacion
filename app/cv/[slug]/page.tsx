import { notFound } from "next/navigation";
import { PublicCvDashboard } from "@/components/cv/PublicCvDashboard";
import { loadCvBySlug } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const data = await loadCvBySlug(supabase, slug, { includeDocuments: false });
  if (!data) return { title: "Perfil no encontrado" };
  const name = `${data.profile.nombre} ${data.profile.apellido}`.trim();
  return {
    title: `${name} · FolioCraft`,
    description:
      data.profile.sobre_mi?.slice(0, 160) ||
      data.profile.perfil_profesional?.slice(0, 160) ||
      `Perfil de ${name}`,
  };
}

export default async function PublicCvPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  // Public view: never fetch documents (privacy)
  const data = await loadCvBySlug(supabase, slug, { includeDocuments: false });
  if (!data) notFound();

  return <PublicCvDashboard data={data} />;
}
