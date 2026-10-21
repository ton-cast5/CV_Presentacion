import Link from "next/link";
import { notFound } from "next/navigation";
import { CvSheet } from "@/components/cv/CvSheet";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { loadCvBySlug, publicStorageUrl } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_CATEGORIES } from "@/lib/types";

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
    title: `CV — ${name}`,
    description: data.profile.perfil_profesional?.slice(0, 160) || `Currículum de ${name}`,
  };
}

export default async function PublicCvPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const data = await loadCvBySlug(supabase, slug);
  if (!data) notFound();

  const name = `${data.profile.nombre} ${data.profile.apellido}`.trim() || "CV";
  const docs = data.documents ?? [];

  return (
    <div className="bg-atmosphere min-h-screen">
      <header className="border-b border-line/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-xl font-semibold text-navy">{name}</p>
            <p className="text-xs text-ink/50">Vista pública · solo lectura</p>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-navy underline-offset-2 hover:underline"
          >
            CV Presentación
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6">
        <section className="overflow-x-auto">
          <CvSheet data={data} />
        </section>

        <section className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy">
              Documentación
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Visualiza o descarga cada archivo. No puedes editar desde aquí.
            </p>
          </div>

          {DOCUMENT_CATEGORIES.map((cat) => {
            const list = docs.filter((d) => d.category === cat.id);
            if (!list.length) return null;
            return (
              <div key={cat.id}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy/70">
                  {cat.label}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      url={publicStorageUrl("documents", doc.storage_path) || "#"}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {docs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink/50">
              Este perfil aún no tiene documentos publicados.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
