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

type OrderItem = {
  key: string;
  label: string;
  group: string;
};

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

const CV_KEY = "cv:sheet";
const CV_LABEL = "Hoja de CV (currículum)";

function buildMessage(opts: {
  name: string;
  mode: Mode;
  ordered: OrderItem[];
}) {
  const { name, mode, ordered } = opts;

  if (mode === "full") {
    return `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar tu CV completo con el expediente disponible. ¿Me lo podrías compartir, por favor?`;
  }

  if (!ordered.length) {
    return `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar información de tu expediente. ¿Me podrías compartir detalles, por favor?`;
  }

  const lines: string[] = [
    `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar lo siguiente (en este orden):`,
    "",
  ];

  ordered.forEach((item, i) => {
    lines.push(`${i + 1}. [${item.group}] ${item.label}`);
  });

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [order, setOrder] = useState<string[]>([]);

  const labelByKey = useMemo(() => {
    const map = new Map<string, OrderItem>();
    map.set(CV_KEY, {
      key: CV_KEY,
      label: CV_LABEL,
      group: "CV",
    });
    for (const d of documents) {
      const cat =
        DOCUMENT_CATEGORIES.find((c) => c.id === d.category)?.label ||
        d.category;
      map.set(`doc:${d.id}`, {
        key: `doc:${d.id}`,
        label: d.nombre,
        group: cat,
      });
    }
    for (const p of projects) {
      map.set(`project:${p.id}`, {
        key: `project:${p.id}`,
        label: p.titulo,
        group: "Proyectos",
      });
    }
    for (const c of certifications) {
      map.set(`cert:${c.id}`, {
        key: `cert:${c.id}`,
        label: c.titulo,
        group: "Certificaciones",
      });
    }
    return map;
  }, [documents, projects, certifications]);

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

  const orderedItems = useMemo(
    () =>
      order
        .map((k) => labelByKey.get(k))
        .filter((x): x is OrderItem => Boolean(x)),
    [order, labelByKey],
  );

  function resetAndClose() {
    setMode("full");
    setSelected(new Set());
    setOrder([]);
    onClose();
  }

  function toggleKey(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        setOrder((o) => o.filter((k) => k !== key));
      } else {
        next.add(key);
        setOrder((o) => (o.includes(key) ? o : [...o, key]));
      }
      return next;
    });
  }

  function selectAllInCategory(cat: DocumentCategory) {
    const list = docsByCategory.get(cat) || [];
    const keys = list.map((d) => `doc:${d.id}`);
    const allOn = keys.every((k) => selected.has(k));
    setSelected((prev) => {
      const next = new Set(prev);
      for (const k of keys) {
        if (allOn) next.delete(k);
        else next.add(k);
      }
      return next;
    });
    setOrder((prev) => {
      if (allOn) return prev.filter((k) => !keys.includes(k));
      const add = keys.filter((k) => !prev.includes(k));
      return [...prev, ...add];
    });
  }

  function moveItem(index: number, dir: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next;
    });
  }

  function openChannel() {
    const msg = buildMessage({
      name,
      mode,
      ordered: orderedItems,
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

  const customEmpty = mode === "custom" && selected.size === 0;

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
                  Elige todo el expediente o arma tu lista en el orden que
                  necesitas.
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
                  title="Expediente completo"
                  desc="Solicitar todo lo disponible"
                />
                <ModeCard
                  active={mode === "custom"}
                  onClick={() => setMode("custom")}
                  icon="checklist"
                  title="Elegir y ordenar"
                  desc="CV, docs, proyectos y más"
                />
              </div>

              {mode === "custom" ? (
                <div className="space-y-4">
                  <fieldset className="space-y-2">
                    <legend className="text-[13px] font-semibold">CV</legend>
                    <ul className="space-y-1.5">
                      <CheckRow
                        checked={selected.has(CV_KEY)}
                        label={CV_LABEL}
                        onChange={() => toggleKey(CV_KEY)}
                      />
                    </ul>
                  </fieldset>

                  {DOCUMENT_CATEGORIES.map((cat) => {
                    const list = docsByCategory.get(cat.id) || [];
                    if (!list.length) return null;
                    const keys = list.map((d) => `doc:${d.id}`);
                    const allOn = keys.every((k) => selected.has(k));
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
                              checked={selected.has(`doc:${d.id}`)}
                              label={d.nombre}
                              onChange={() => toggleKey(`doc:${d.id}`)}
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
                            checked={selected.has(`project:${p.id}`)}
                            label={p.titulo}
                            onChange={() => toggleKey(`project:${p.id}`)}
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
                            checked={selected.has(`cert:${c.id}`)}
                            label={c.titulo}
                            onChange={() => toggleKey(`cert:${c.id}`)}
                          />
                        ))}
                      </ul>
                    </fieldset>
                  ) : null}

                  {orderedItems.length > 0 ? (
                    <div className="rounded-[14px] border border-outline bg-surface-2/40 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-[13px] font-semibold">
                          Orden de solicitud
                        </h3>
                        <span className="text-[11px] text-muted">
                          {orderedItems.length} ítem
                          {orderedItems.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <ol className="space-y-1.5">
                        {orderedItems.map((item, index) => (
                          <li
                            key={item.key}
                            className="flex items-center gap-2 rounded-[10px] bg-white px-2 py-1.5 ring-1 ring-outline"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[12px] font-semibold">
                                {item.label}
                              </div>
                              <div className="truncate text-[10px] text-muted">
                                {item.group}
                              </div>
                            </div>
                            <div className="flex shrink-0 flex-col">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveItem(index, -1)}
                                className="flex h-6 w-7 items-center justify-center rounded text-muted hover:bg-surface-2 disabled:opacity-30"
                                aria-label="Subir"
                              >
                                <span className="material-symbols-outlined text-[16px] leading-none">
                                  keyboard_arrow_up
                                </span>
                              </button>
                              <button
                                type="button"
                                disabled={index === orderedItems.length - 1}
                                onClick={() => moveItem(index, 1)}
                                className="flex h-6 w-7 items-center justify-center rounded text-muted hover:bg-surface-2 disabled:opacity-30"
                                aria-label="Bajar"
                              >
                                <span className="material-symbols-outlined text-[16px] leading-none">
                                  keyboard_arrow_down
                                </span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <p className="rounded-[14px] border border-dashed border-outline px-3 py-3 text-center text-[12px] text-muted">
                      Marca al menos un ítem (puedes incluir o no la hoja de CV).
                    </p>
                  )}
                </div>
              ) : (
                <p className="rounded-[14px] bg-primary-soft/50 px-3 py-3 text-[13px] leading-relaxed text-on-surface">
                  Se enviará una solicitud del expediente completo. El titular
                  decidirá qué compartirte.
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
