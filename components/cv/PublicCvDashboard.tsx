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

type Tab = "dashboard" | "cv";

type Props = {
  data: CvData;
};

export function PublicCvDashboard({ data }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");

  const { profile, experience, documents = [], photoUrl } = data;

  const name = `${profile.nombre} ${profile.apellido}`.trim() || "CV";
  const roles = (profile.roles || []).filter(Boolean);
  const profileSnippet = (profile.perfil_profesional || "").trim();
  const latestJob = experience[0];

  const filtered = useMemo(
    () =>
      filter === "all"
        ? documents
        : documents.filter((d) => d.category === filter),
    [documents, filter],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Thin top bar */}
      <header className="sticky top-0 z-40 border-b border-outline/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] font-bold text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate text-[13px] font-semibold">{name}</span>
            <span className="hidden text-[11px] text-muted sm:inline">· Solo lectura</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-full bg-surface-2 p-0.5">
              <button
                type="button"
                onClick={() => setTab("dashboard")}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  tab === "dashboard"
                    ? "bg-white text-on-surface shadow-sm"
                    : "text-muted hover:text-on-surface"
                }`}
              >
                Documentos
              </button>
              <button
                type="button"
                onClick={() => setTab("cv")}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  tab === "cv"
                    ? "bg-white text-on-surface shadow-sm"
                    : "text-muted hover:text-on-surface"
                }`}
              >
                CV completo
              </button>
            </div>
            <Link
              href="/"
              className="hidden h-8 items-center rounded-[10px] bg-primary px-2.5 text-[11px] font-semibold text-white sm:inline-flex"
            >
              FolioCraft
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        {tab === "dashboard" ? (
          <section className="space-y-5">
            {/* Identity block */}
            <div className="fc-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline sm:h-20 sm:w-20">
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg font-bold text-primary">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-[26px] font-semibold tracking-tight sm:text-[28px]">
                    {name}
                  </h1>
                  {roles.length > 0 ? (
                    <p className="mt-1 text-[14px] font-medium text-on-surface/85">
                      {roles.join(" · ")}
                    </p>
                  ) : null}
                  {latestJob ? (
                    <p className="mt-1 text-[13px] text-muted">
                      {latestJob.puesto}
                      {latestJob.empresa ? ` · ${latestJob.empresa}` : ""}
                      {latestJob.fechas ? ` · ${latestJob.fechas}` : ""}
                    </p>
                  ) : null}
                  {profileSnippet ? (
                    <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {profileSnippet}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h2 className="mb-3 text-[16px] font-semibold tracking-tight">
                Documentos
              </h2>

              {documents.length > 1 ? (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <FilterChip
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                    label="Todos"
                  />
                  {DOCUMENT_CATEGORIES.map((c) => {
                    const has = documents.some((d) => d.category === c.id);
                    if (!has) return null;
                    return (
                      <FilterChip
                        key={c.id}
                        active={filter === c.id}
                        onClick={() => setFilter(c.id)}
                        label={c.label}
                      />
                    );
                  })}
                </div>
              ) : null}

              {filtered.length === 0 ? (
                <p className="rounded-[20px] border border-dashed border-outline bg-white/50 p-8 text-center text-[13px] text-muted">
                  Este perfil aún no tiene documentos publicados.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((doc) => (
                    <DocumentPreviewCard
                      key={doc.id}
                      doc={doc}
                      url={publicStorageUrl("documents", doc.storage_path) || "#"}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="overflow-x-auto pb-2">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[16px] font-semibold tracking-tight">CV completo</h2>
              <button
                type="button"
                onClick={() => setTab("dashboard")}
                className="text-[12px] font-semibold text-primary hover:underline"
              >
                Volver a documentos
              </button>
            </div>
            <div className="fc-paper mx-auto w-fit">
              <CvSheet data={data} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
        active
          ? "bg-primary text-white"
          : "bg-white text-muted ring-1 ring-outline hover:bg-surface-2"
      }`}
    >
      {label}
    </button>
  );
}
