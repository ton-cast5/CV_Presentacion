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
  const data = await loadCvBySlug(supabase, slug);
  if (!data) return { title: "CV no encontrado" };
  const name = `${data.profile.nombre} ${data.profile.apellido}`.trim();
  return {
    title: `${name} · FolioCraft`,
    description:
      data.profile.perfil_profesional?.slice(0, 160) || `Currículum de ${name}`,
  };
}

export default async function PublicCvPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const data = await loadCvBySlug(supabase, slug);
  if (!data) notFound();

  return <PublicCvDashboard data={data} />;
}
