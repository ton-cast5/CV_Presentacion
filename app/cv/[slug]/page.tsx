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
      <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-surface-lowest/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-primary-fixed ring-2 ring-surface-high">
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
                <p className="text-lg font-bold tracking-tight">{name}</p>
                <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-bold text-[var(--on-tertiary-fixed)]">
                  Público
                </span>
              </div>
              <p className="text-xs text-muted">
                {roles.join(" · ") || "Currículum profesional"} · solo lectura
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#expediente"
              className="inline-flex h-10 items-center gap-1 rounded border border-outline-variant bg-white px-3 text-[13px] font-semibold transition hover:bg-surface-low"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              Expediente ({docs.length})
            </a>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-1 rounded bg-slate px-3 text-[13px] font-semibold text-white"
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
            <h2 className="text-2xl font-bold tracking-tight">Expediente documental</h2>
            <p className="mt-1 text-sm text-muted">
              Visualiza o descarga cada archivo. No puedes editar desde aquí.
            </p>
          </div>

          {DOCUMENT_CATEGORIES.map((cat) => {
            const list = docs.filter((d) => d.category === cat.id);
            if (!list.length) return null;
            return (
              <div key={cat.id}>
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted">
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
            <p className="rounded-xl border border-dashed border-outline-variant p-8 text-center text-sm text-muted">
              Este perfil aún no tiene documentos publicados.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
