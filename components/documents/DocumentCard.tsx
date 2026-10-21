"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import type { DocumentRow } from "@/lib/types";
import { DOCUMENT_CATEGORIES } from "@/lib/types";

type Props = {
  doc: DocumentRow;
  url: string;
  editable?: boolean;
  onDelete?: (id: string) => void;
};

export function DocumentCard({ doc, url, editable, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const cat =
    DOCUMENT_CATEGORIES.find((c) => c.id === doc.category)?.label || doc.category;
  const isPdf = doc.mime_type.includes("pdf");
  const sizeMb = (Number(doc.size) / (1024 * 1024)).toFixed(2);

  return (
    <>
      <article className="fc-card fc-card-hover flex h-full flex-col justify-between p-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {cat}
            </span>
            <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-bold text-[var(--on-tertiary-fixed)]">
              {isPdf ? "PDF" : "IMG"}
            </span>
          </div>
          <h3 className="font-semibold leading-snug">{doc.nombre}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {doc.descripcion || "Sin descripción"}
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">{sizeMb} MB</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon="visibility" onClick={() => setOpen(true)}>
            Ver
          </Button>
          <a
            href={url}
            download={doc.nombre}
            className="inline-flex h-10 items-center gap-2 rounded bg-slate px-4 text-[13px] font-semibold text-white transition hover:bg-[#1e293b]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Descargar
          </a>
          {editable && onDelete ? (
            <Button type="button" variant="ghost" icon="delete" onClick={() => onDelete(doc.id)}>
              Eliminar
            </Button>
          ) : null}
        </div>
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
