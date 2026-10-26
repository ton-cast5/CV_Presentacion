"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  DOCUMENT_CATEGORIES,
  type Certification,
  type DocumentCategory,
  type DocumentRow,
  type Project,
} from "@/lib/types";

type Mode = "full" | "custom";

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  channel: "WhatsApp" | "Correo";
  channelIcon: string;
  phoneDigits: string;
  email: string;
  documents: DocumentRow[];
  projects: Project[];
  certifications: Certification[];
};

function toggleInSet(set: Set<string>, id: string) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function buildMessage(opts: {
  name: string;
  mode: Mode;
  docsByCat: Record<string, string[]>;
  projectTitles: string[];
  certTitles: string[];
}) {
  const { name, mode, docsByCat, projectTitles, certTitles } = opts;

  if (mode === "full") {
    return `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar tu CV completo con el expediente disponible. ¿Me lo podrías compartir, por favor?`;
  }

  const lines: string[] = [
    `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar lo siguiente:`,
    "",
  ];

  for (const cat of DOCUMENT_CATEGORIES) {
    const items = docsByCat[cat.id] || [];
    if (!items.length) continue;
    lines.push(`• ${cat.label}:`);
    for (const n of items) lines.push(`   - ${n}`);
  }

  if (projectTitles.length) {
    lines.push("• Proyectos:");
    for (const n of projectTitles) lines.push(`   - ${n}`);
  }

  if (certTitles.length) {
    lines.push("• Certificaciones:");
    for (const n of certTitles) lines.push(`   - ${n}`);
  }

  if (lines.length <= 2) {
    return `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar información de tu expediente. ¿Me podrías compartir detalles, por favor?`;
  }

  lines.push("", "¿Me lo podrías compartir, por favor?");
  return lines.join("\n");
}

export function RequestCvModal({
  open,
  onClose,
  name,
  channel,
  channelIcon,
  phoneDigits,
  email,
  documents,
  projects,
  certifications,
}: Props) {
  const [mode, setMode] = useState<Mode>("full");
  const [docIds, setDocIds] = useState<Set<string>>(new Set());
  const [projectIds, setProjectIds] = useState<Set<string>>(new Set());
  const [certIds, setCertIds] = useState<Set<string>>(new Set());

  const docsByCategory = useMemo(() => {
    const map = new Map<DocumentCategory, DocumentRow[]>();
    for (const c of DOCUMENT_CATEGORIES) map.set(c.id, []);
    for (const d of documents) {
      const list = map.get(d.category) || [];
      list.push(d);
      map.set(d.category, list);
    }
    return map;
  }, [documents]);

  const hasCatalog =
    documents.length > 0 || projects.length > 0 || certifications.length > 0;

  function resetAndClose() {
    setMode("full");
    setDocIds(new Set());
    setProjectIds(new Set());
    setCertIds(new Set());
    onClose();
  }

  function selectAllInCategory(cat: DocumentCategory) {
    const list = docsByCategory.get(cat) || [];
    setDocIds((prev) => {
      const next = new Set(prev);
      const allSelected = list.every((d) => next.has(d.id));
      for (const d of list) {
        if (allSelected) next.delete(d.id);
        else next.add(d.id);
      }
      return next;
    });
  }

  function openChannel() {
    const docsByCat: Record<string, string[]> = {};
    for (const c of DOCUMENT_CATEGORIES) {
      const names = (docsByCategory.get(c.id) || [])
        .filter((d) => docIds.has(d.id))
        .map((d) => d.nombre);
      if (names.length) docsByCat[c.id] = names;
    }

    const msg = buildMessage({
      name,
      mode,
      docsByCat,
      projectTitles: projects
        .filter((p) => projectIds.has(p.id))
        .map((p) => p.titulo),
      certTitles: certifications
        .filter((c) => certIds.has(c.id))
        .map((c) => c.titulo),
    });

    if (channel === "WhatsApp" && phoneDigits) {
      window.open(
        `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (email) {
      const subject = `Solicitud de CV — ${name}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    }
    resetAndClose();
  }

  const customEmpty =
    mode === "custom" &&
    docIds.size === 0 &&
    projectIds.size === 0 &&
    certIds.size === 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#20211f]/45 p-3 backdrop-blur-md sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-cv-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_25px_50px_-12px_rgba(32,33,31,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-outline px-4 py-3.5 sm:px-5">
              <div>
                <h2
                  id="request-cv-title"
                  className="text-[17px] font-semibold tracking-tight"
                >
                  Solicitar CV
                </h2>
                <p className="mt-0.5 text-[12px] text-muted">
                  Elige CV completo o indica qué documentos necesitas.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
              <div className="grid gap-2 sm:grid-cols-2">
                <ModeCard
                  active={mode === "full"}
                  onClick={() => setMode("full")}
                  icon="description"
                  title="CV completo"
                  desc="Solicitar el expediente general"
                />
                <ModeCard
                  active={mode === "custom"}
                  onClick={() => setMode("custom")}
                  icon="checklist"
                  title="Elegir qué necesito"
                  desc="Marca secciones y documentos"
                />
              </div>

              {mode === "custom" ? (
                hasCatalog ? (
                  <div className="space-y-4">
                    {DOCUMENT_CATEGORIES.map((cat) => {
                      const list = docsByCategory.get(cat.id) || [];
                      if (!list.length) return null;
                      const allOn = list.every((d) => docIds.has(d.id));
                      return (
                        <fieldset key={cat.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <legend className="text-[13px] font-semibold">
                              {cat.label}
                            </legend>
                            <button
                              type="button"
                              onClick={() => selectAllInCategory(cat.id)}
                              className="text-[11px] font-semibold text-primary hover:underline"
                            >
                              {allOn ? "Quitar todos" : "Todos"}
                            </button>
                          </div>
                          <ul className="space-y-1.5">
                            {list.map((d) => (
                              <CheckRow
                                key={d.id}
                                checked={docIds.has(d.id)}
                                label={d.nombre}
                                onChange={() =>
                                  setDocIds((prev) => toggleInSet(prev, d.id))
                                }
                              />
                            ))}
                          </ul>
                        </fieldset>
                      );
                    })}

                    {projects.length > 0 ? (
                      <fieldset className="space-y-2">
                        <legend className="text-[13px] font-semibold">
                          Proyectos
                        </legend>
                        <ul className="space-y-1.5">
                          {projects.map((p) => (
                            <CheckRow
                              key={p.id}
                              checked={projectIds.has(p.id)}
                              label={p.titulo}
                              onChange={() =>
                                setProjectIds((prev) =>
                                  toggleInSet(prev, p.id),
                                )
                              }
                            />
                          ))}
                        </ul>
                      </fieldset>
                    ) : null}

                    {certifications.length > 0 ? (
                      <fieldset className="space-y-2">
                        <legend className="text-[13px] font-semibold">
                          Certificaciones
                        </legend>
                        <ul className="space-y-1.5">
                          {certifications.map((c) => (
                            <CheckRow
                              key={c.id}
                              checked={certIds.has(c.id)}
                              label={c.titulo}
                              onChange={() =>
                                setCertIds((prev) => toggleInSet(prev, c.id))
                              }
                            />
                          ))}
                        </ul>
                      </fieldset>
                    ) : null}
                  </div>
                ) : (
                  <p className="rounded-[14px] border border-dashed border-outline bg-surface-2/60 px-3 py-4 text-center text-[13px] text-muted">
                    Este perfil aún no tiene ítems listados. Puedes pedir el CV
                    completo.
                  </p>
                )
              ) : (
                <p className="rounded-[14px] bg-primary-soft/50 px-3 py-3 text-[13px] leading-relaxed text-on-surface">
                  Se enviará una solicitud del CV completo. El titular decidirá
                  qué compartirte.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-outline px-4 py-3 sm:px-5">
              <Button type="button" variant="ghost" onClick={resetAndClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                icon={channelIcon}
                disabled={customEmpty}
                onClick={openChannel}
              >
                Continuar a {channel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] border px-3 py-3 text-left transition ${
        active
          ? "border-primary bg-primary-soft/70 ring-2 ring-primary/25"
          : "border-outline bg-white hover:bg-surface-2"
      }`}
    >
      <span className="material-symbols-outlined text-[20px] text-primary">
        {icon}
      </span>
      <div className="mt-1 text-[13px] font-semibold">{title}</div>
      <div className="mt-0.5 text-[11px] text-muted">{desc}</div>
    </button>
  );
}

function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-start gap-2.5 rounded-[10px] bg-surface-2/70 px-2.5 py-2 text-[13px] hover:bg-surface-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
        />
        <span className="min-w-0 break-words leading-snug">{label}</span>
      </label>
    </li>
  );
}
