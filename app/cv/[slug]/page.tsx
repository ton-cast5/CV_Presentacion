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

  const name = `${data.profile.nombre} ${data.profile.apellido}`.trim() || "CV";
  const roles = (data.profile.roles || []).filter(Boolean);
  const docs = data.documents ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-outline/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline">
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[17px] font-semibold tracking-tight">{name}</p>
                <span className="fc-badge fc-badge-ok">Público</span>
              </div>
              <p className="text-[12px] text-muted">
                {roles.join(" · ") || "Currículum profesional"} · solo lectura
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#expediente"
              className="inline-flex h-11 items-center gap-1 rounded-[12px] border border-outline bg-white px-3 text-[13px] font-semibold transition hover:bg-surface-2"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              Expediente ({docs.length})
            </a>
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-1 rounded-[12px] bg-primary px-3 text-[13px] font-semibold text-white"
            >
              FolioCraft
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <section className="overflow-x-auto pb-2">
          <div className="fc-paper mx-auto w-fit">
            <CvSheet data={data} />
          </div>
        </section>

        <section id="expediente" className="space-y-6">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight">Expediente documental</h2>
            <p className="mt-1 text-[13px] text-muted">
              Visualiza o descarga cada archivo. No puedes editar desde aquí.
            </p>
          </div>

          {DOCUMENT_CATEGORIES.map((cat) => {
            const list = docs.filter((d) => d.category === cat.id);
            if (!list.length) return null;
            return (
              <div key={cat.id}>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
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
            <p className="rounded-[24px] border border-dashed border-outline bg-white/50 p-8 text-center text-[13px] text-muted">
              Este perfil aún no tiene documentos publicados.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
