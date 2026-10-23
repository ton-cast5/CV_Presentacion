"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CvSheet } from "@/components/cv/CvSheet";
import { DocumentPreviewCard } from "@/components/cv/DocumentPreviewCard";
import { publicStorageUrl } from "@/lib/cv-data";
import {
  DOCUMENT_CATEGORIES,
  type CvData,
  type DocumentCategory,
} from "@/lib/types";

type Tab = "cv" | "expediente" | "resumen";

type Props = {
  data: CvData;
};

export function PublicCvDashboard({ data }: Props) {
  const [tab, setTab] = useState<Tab>("cv");
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");

  const { profile, education, experience, projects, certifications, documents = [], photoUrl } =
    data;

  const name = `${profile.nombre} ${profile.apellido}`.trim() || "CV";
  const roles = (profile.roles || []).filter(Boolean);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: documents.length };
    for (const c of DOCUMENT_CATEGORIES) {
      map[c.id] = documents.filter((d) => d.category === c.id).length;
    }
    return map;
  }, [documents]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? documents
        : documents.filter((d) => d.category === filter),
    [documents, filter],
  );

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "cv", label: "Hoja CV" },
    { id: "expediente", label: "Expediente", count: documents.length },
    { id: "resumen", label: "Resumen" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-outline/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[17px] font-semibold tracking-tight">{name}</p>
                <span className="fc-badge fc-badge-ok">Público</span>
                <span className="fc-badge fc-badge-muted">Solo lectura</span>
              </div>
              <p className="text-[12px] text-muted">
                {roles.join(" · ") || "Currículum profesional"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("expediente")}
              className="inline-flex h-11 items-center gap-1 rounded-[12px] border border-outline bg-white px-3 text-[13px] font-semibold transition hover:bg-surface-2"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              Expediente ({documents.length})
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-1 rounded-[12px] bg-primary px-3 text-[13px] font-semibold text-white"
            >
              FolioCraft
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* Metrics */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Documentos"
            value={String(documents.length)}
            icon="inventory_2"
          />
          <Metric
            label="Experiencia"
            value={String(experience.length)}
            icon="work"
          />
          <Metric
            label="Formación"
            value={String(education.length)}
            icon="school"
          />
          <Metric
            label="Certificaciones CV"
            value={String(certifications.length)}
            icon="verified"
          />
        </section>

        {/* Category chips when docs exist */}
        {documents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {DOCUMENT_CATEGORIES.filter((c) => (counts[c.id] ?? 0) > 0).map((c) => (
              <span key={c.id} className="fc-badge fc-badge-muted">
                {c.label}: {counts[c.id]}
              </span>
            ))}
          </div>
        ) : null}

        {/* Tabs */}
        <div className="flex gap-1 rounded-[16px] bg-surface-2 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-[12px] px-3 py-2.5 text-[13px] font-semibold transition ${
                tab === t.id
                  ? "bg-white text-on-surface shadow-sm"
                  : "text-muted hover:text-on-surface"
              }`}
            >
              {t.label}
              {typeof t.count === "number" ? (
                <span className="ml-1.5 font-mono text-[11px] text-muted">
                  ({t.count})
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === "cv" ? (
          <section className="overflow-x-auto pb-2">
            <div className="fc-paper mx-auto w-fit">
              <CvSheet data={data} />
            </div>
          </section>
        ) : null}

        {tab === "expediente" ? (
          <section className="space-y-5">
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight">
                Expediente documental
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Previsualiza cada archivo. Puedes ampliar o descargar; no puedes editar.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label={`Todos (${counts.all})`}
              />
              {DOCUMENT_CATEGORIES.map((c) => (
                <FilterChip
                  key={c.id}
                  active={filter === c.id}
                  onClick={() => setFilter(c.id)}
                  label={`${c.label} (${counts[c.id] ?? 0})`}
                  disabled={(counts[c.id] ?? 0) === 0}
                />
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-[24px] border border-dashed border-outline bg-white/50 p-10 text-center text-[13px] text-muted">
                {documents.length === 0
                  ? "Este perfil aún no tiene documentos publicados."
                  : "No hay documentos en este filtro."}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((doc) => (
                  <DocumentPreviewCard
                    key={doc.id}
                    doc={doc}
                    url={publicStorageUrl("documents", doc.storage_path) || "#"}
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}

        {tab === "resumen" ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight">Resumen del perfil</h2>
              <p className="mt-1 text-[13px] text-muted">
                Vista rápida de las secciones del CV (solo lectura).
              </p>
            </div>

            {profile.perfil_profesional || profile.sobre_mi ? (
              <div className="fc-card space-y-3 p-5">
                {profile.perfil_profesional ? (
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
                      Perfil profesional
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed">{profile.perfil_profesional}</p>
                  </div>
                ) : null}
                {profile.sobre_mi ? (
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
                      Sobre mí
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed">{profile.sobre_mi}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <SummaryBlock
              title="Experiencia laboral"
              empty="Sin experiencia registrada"
              items={experience.map((j) => ({
                title: j.puesto,
                meta: `${j.empresa}${j.fechas ? ` · ${j.fechas}` : ""}`,
                body: j.bullets?.filter(Boolean).join(" · "),
              }))}
            />
            <SummaryBlock
              title="Formación académica"
              empty="Sin formación registrada"
              items={education.map((e) => ({
                title: e.nivel,
                meta: [e.institucion, e.lugar].filter(Boolean).join(" · "),
              }))}
            />
            <SummaryBlock
              title="Proyectos"
              empty="Sin proyectos registrados"
              items={projects.map((p) => ({
                title: p.titulo,
                meta: p.fechas || undefined,
                body: p.descripcion,
              }))}
            />
            <SummaryBlock
              title="Certificaciones"
              empty="Sin certificaciones en el CV"
              items={certifications.map((c) => ({
                title: c.titulo,
                meta: [c.emisor, c.vigencia ? `Vigencia: ${c.vigencia}` : ""]
                  .filter(Boolean)
                  .join(" · "),
              }))}
            />

            <div className="fc-card p-5">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
                Contacto
              </h3>
              <ul className="mt-2 space-y-1 text-[14px]">
                {profile.telefono ? <li>Tel: {profile.telefono}</li> : null}
                {profile.email_contacto ? <li>Email: {profile.email_contacto}</li> : null}
                {profile.direccion ? (
                  <li className="whitespace-pre-line">Dir: {profile.direccion}</li>
                ) : null}
                {!profile.telefono && !profile.email_contacto && !profile.direccion ? (
                  <li className="text-muted">Sin datos de contacto</li>
                ) : null}
              </ul>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="fc-card flex items-center justify-between p-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
          {label}
        </div>
        <div className="mt-1 text-[24px] font-semibold tracking-tight">{value}</div>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </span>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-[12px] font-semibold transition disabled:opacity-40 ${
        active
          ? "bg-primary text-white"
          : "bg-white text-muted ring-1 ring-outline hover:bg-surface-2"
      }`}
    >
      {label}
    </button>
  );
}

function SummaryBlock({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { title: string; meta?: string; body?: string }[];
}) {
  return (
    <div className="fc-card p-5">
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-[13px] text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item, i) => (
            <li key={`${item.title}-${i}`} className="rounded-[14px] bg-surface-2 px-3 py-2.5">
              <div className="text-[14px] font-semibold">{item.title}</div>
              {item.meta ? (
                <div className="text-[12px] text-muted">{item.meta}</div>
              ) : null}
              {item.body ? (
                <p className="mt-1 line-clamp-3 text-[13px] text-on-surface/80">{item.body}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
