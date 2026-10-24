"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CvSheet } from "@/components/cv/CvSheet";
import { DocumentPreviewCard } from "@/components/cv/DocumentPreviewCard";
import { ResponsiveCvFrame } from "@/components/cv/ResponsiveCvFrame";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { publicStorageUrl } from "@/lib/cv-data";
import {
  DOCUMENT_CATEGORIES,
  type CvData,
  type DocumentCategory,
  type Project,
  type Certification,
} from "@/lib/types";

type Tab = "dashboard" | "cv";

type Props = {
  data: CvData;
};

export function PublicCvDashboard({ data }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");

  const {
    profile,
    experience,
    projects,
    certifications,
    documents = [],
    photoUrl,
  } = data;

  const name = `${profile.nombre} ${profile.apellido}`.trim() || "CV";
  const roles = (profile.roles || []).filter(Boolean);
  const profileSnippet = (profile.perfil_profesional || "").trim();
  const latestJob = experience[0];

  const filteredDocs = useMemo(
    () =>
      filter === "all"
        ? documents
        : documents.filter((d) => d.category === filter),
    [documents, filter],
  );

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 border-b border-outline/70 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-2 px-3 sm:h-11 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline sm:h-7 sm:w-7">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] font-bold text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate text-[12px] font-semibold sm:text-[13px]">
              {name}
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">
              · Solo lectura
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-full bg-surface-2 p-0.5">
              <TabBtn
                active={tab === "dashboard"}
                onClick={() => setTab("dashboard")}
                label="Portfolio"
              />
              <TabBtn
                active={tab === "cv"}
                onClick={() => setTab("cv")}
                label="CV completo"
              />
            </div>
            <Link
              href="/"
              className="hidden h-7 items-center rounded-[8px] bg-primary px-2 text-[11px] font-semibold text-white sm:inline-flex"
            >
              FolioCraft
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-5">
        <AnimatePresence mode="wait">
          {tab === "dashboard" ? (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5 sm:space-y-6"
            >
              <FadeIn>
                <motion.div
                  className="fc-card p-4 sm:p-6"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                        delay: 0.08,
                      }}
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline sm:h-20 sm:w-20"
                    >
                      {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-base font-bold text-primary sm:text-lg">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <motion.h1
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12, duration: 0.4 }}
                        className="text-[22px] font-semibold tracking-tight sm:text-[28px]"
                      >
                        {name}
                      </motion.h1>
                      {roles.length > 0 ? (
                        <motion.p
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.18, duration: 0.4 }}
                          className="mt-1 text-[13px] font-medium text-on-surface/85 sm:text-[14px]"
                        >
                          {roles.join(" · ")}
                        </motion.p>
                      ) : null}
                      {latestJob ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.24, duration: 0.4 }}
                          className="mt-1 text-[12px] text-muted sm:text-[13px]"
                        >
                          {latestJob.puesto}
                          {latestJob.empresa ? ` · ${latestJob.empresa}` : ""}
                          {latestJob.fechas ? ` · ${latestJob.fechas}` : ""}
                        </motion.p>
                      ) : null}
                      {profileSnippet ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.45 }}
                          className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-muted sm:mt-3 sm:line-clamp-2 sm:text-[13px]"
                        >
                          {profileSnippet}
                        </motion.p>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>

              {projects.length > 0 ? (
                <Section title="Proyectos">
                  <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((p) => (
                      <StaggerItem key={p.id}>
                        <ProjectCard project={p} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Section>
              ) : null}

              {certifications.length > 0 ? (
                <Section title="Certificaciones">
                  <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {certifications.map((c) => (
                      <StaggerItem key={c.id}>
                        <CertCard cert={c} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Section>
              ) : null}

              <Section title="Documentos">
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

                <AnimatePresence mode="wait">
                  {filteredDocs.length === 0 ? (
                    <motion.p
                      key="empty-docs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-[20px] border border-dashed border-outline bg-white/50 p-6 text-center text-[13px] text-muted sm:p-8"
                    >
                      Este perfil aún no tiene documentos publicados.
                    </motion.p>
                  ) : (
                    <motion.div
                      key={`docs-${filter}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28 }}
                    >
                      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredDocs.map((doc) => (
                          <StaggerItem key={doc.id}>
                            <DocumentPreviewCard
                              doc={doc}
                              url={
                                publicStorageUrl(
                                  "documents",
                                  doc.storage_path,
                                ) || "#"
                              }
                            />
                          </StaggerItem>
                        ))}
                      </Stagger>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Section>
            </motion.section>
          ) : (
            <motion.section
              key="cv"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-[15px] font-semibold tracking-tight sm:text-[16px]">
                  CV completo
                </h2>
                <button
                  type="button"
                  onClick={() => setTab("dashboard")}
                  className="text-[12px] font-semibold text-primary hover:underline"
                >
                  Volver al portfolio
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ResponsiveCvFrame>
                  <CvSheet data={data} />
                </ResponsiveCvFrame>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabBtn({
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
      className={`relative rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition sm:px-3 sm:py-1 sm:text-[12px] ${
        active ? "text-on-surface" : "text-muted hover:text-on-surface"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="public-tab"
          className="absolute inset-0 rounded-full bg-white shadow-sm"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FadeIn>
      <div>
        <h2 className="mb-3 text-[15px] font-semibold tracking-tight sm:text-[16px]">
          {title}
        </h2>
        {children}
      </div>
    </FadeIn>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const link = (project.link || "").trim();
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="fc-card flex h-full flex-col justify-between p-4"
    >
      <div>
        <h3 className="text-[15px] font-semibold leading-snug">
          {project.titulo}
        </h3>
        {project.fechas ? (
          <p className="mt-1 text-[12px] text-muted">Fecha: {project.fechas}</p>
        ) : null}
        {project.descripcion ? (
          <p className="mt-1 line-clamp-3 text-[12px] text-muted">
            {project.descripcion}
          </p>
        ) : null}
      </div>
      {link ? (
        <a
          href={link.startsWith("http") ? link : `https://${link}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-primary px-3 text-[12px] font-semibold text-white transition hover:bg-primary-hover"
        >
          <span className="material-symbols-outlined text-[16px]">
            open_in_new
          </span>
          Ver proyecto
        </a>
      ) : null}
    </motion.article>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="fc-card p-4"
    >
      <h3 className="text-[15px] font-semibold leading-snug">{cert.titulo}</h3>
      {cert.vigencia ? (
        <p className="mt-1 text-[12px] text-muted">
          Fecha / vigencia: {cert.vigencia}
        </p>
      ) : null}
      {cert.emisor ? (
        <p className="mt-1 text-[12px] text-muted">{cert.emisor}</p>
      ) : null}
    </motion.article>
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
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
        active
          ? "bg-primary text-white"
          : "bg-white text-muted ring-1 ring-outline hover:bg-surface-2"
      }`}
    >
      {label}
    </motion.button>
  );
}
