"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import type { DocumentCategory, DocumentRow } from "@/lib/types";
import { DOCUMENT_CATEGORIES } from "@/lib/types";

type Props = {
  doc: DocumentRow;
  url: string;
  editable?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (
    id: string,
    patch: {
      nombre: string;
      descripcion: string;
      category: DocumentCategory;
    },
  ) => Promise<void> | void;
};

export function DocumentCard({
  doc,
  url,
  editable,
  onDelete,
  onUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState(doc.nombre);
  const [descripcion, setDescripcion] = useState(doc.descripcion || "");
  const [category, setCategory] = useState<DocumentCategory>(doc.category);
  const [saving, setSaving] = useState(false);

  const cat =
    DOCUMENT_CATEGORIES.find((c) => c.id === doc.category)?.label ||
    doc.category;
  const isPdf = doc.mime_type.includes("pdf");
  const sizeMb = (Number(doc.size) / (1024 * 1024)).toFixed(2);

  function startEdit() {
    setNombre(doc.nombre);
    setDescripcion(doc.descripcion || "");
    setCategory(doc.category);
    setEditing(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!onUpdate) return;
    setSaving(true);
    await onUpdate(doc.id, {
      nombre: nombre.trim() || doc.nombre,
      descripcion: descripcion.trim(),
      category,
    });
    setSaving(false);
    setEditing(false);
  }

  return (
    <>
      <article className="fc-card fc-card-hover flex h-full flex-col justify-between p-5">
        <AnimatePresence mode="wait" initial={false}>
          {editing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              onSubmit={onSave}
              className="space-y-3"
            >
              <label className="block text-[12px] font-semibold">
                Nombre
                <input
                  className="fc-input mt-1"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>
              <label className="block text-[12px] font-semibold">
                Categoría
                <select
                  className="fc-input mt-1"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as DocumentCategory)
                  }
                >
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[12px] font-semibold">
                Descripción
                <textarea
                  className="fc-textarea mt-1"
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  icon="save"
                  disabled={saving}
                  className="h-9 px-3 text-[12px]"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  className="h-9 px-3 text-[12px]"
                >
                  Cancelar
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col justify-between"
            >
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="fc-badge fc-badge-ok">{cat}</span>
                  <span className="fc-badge fc-badge-muted">
                    {isPdf ? "PDF" : "IMG"}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold leading-snug">
                  {doc.nombre}
                </h3>
                <p className="mt-1 line-clamp-2 text-[13px] text-muted">
                  {doc.descripcion || "Sin descripción"}
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted">
                  {sizeMb} MB
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon="visibility"
                  onClick={() => setOpen(true)}
                  className="h-9 px-3 text-[12px]"
                >
                  Ver
                </Button>
                <a
                  href={url}
                  download={doc.nombre}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[12px] bg-slate px-3 text-[12px] font-semibold text-white transition hover:bg-[#2c2d2a]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    download
                  </span>
                  Descargar
                </a>
                {editable && onUpdate ? (
                  <Button
                    type="button"
                    variant="ghost"
                    icon="edit"
                    onClick={startEdit}
                    className="h-9 px-3 text-[12px]"
                  >
                    Editar
                  </Button>
                ) : null}
                {editable && onDelete ? (
                  <Button
                    type="button"
                    variant="ghost"
                    icon="delete"
                    onClick={() => onDelete(doc.id)}
                    className="h-9 px-3 text-[12px]"
                  >
                    Eliminar
                  </Button>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
      <DocumentViewer
        open={open}
        onClose={() => setOpen(false)}
        url={url}
        mimeType={doc.mime_type}
        nombre={doc.nombre}
      />
    </>
  );
}
