"use client";

import { useState } from "react";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { Button } from "@/components/ui/Button";
import { DOCUMENT_CATEGORIES, type DocumentRow } from "@/lib/types";

type Props = {
  doc: DocumentRow;
  url: string;
};

export function DocumentPreviewCard({ doc, url }: Props) {
  const [open, setOpen] = useState(false);
  const cat =
    DOCUMENT_CATEGORIES.find((c) => c.id === doc.category)?.label || doc.category;
  const isPdf = doc.mime_type.includes("pdf");
  const isImage = doc.mime_type.startsWith("image/");
  const sizeMb = (Number(doc.size) / (1024 * 1024)).toFixed(2);

  return (
    <>
      <article className="fc-card flex h-full flex-col overflow-hidden">
        <div className="border-b border-outline px-4 py-3">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="fc-badge fc-badge-ok">{cat}</span>
            <span className="fc-badge fc-badge-muted">{isPdf ? "PDF" : "IMG"}</span>
          </div>
          <h3 className="truncate text-[14px] font-semibold leading-snug">{doc.nombre}</h3>
          <p className="mt-0.5 line-clamp-1 text-[12px] text-muted">
            {doc.descripcion || "Sin descripción"} · {sizeMb} MB
          </p>
        </div>

        <div className="relative min-h-[240px] flex-1 bg-surface-2">
          {isPdf ? (
            <iframe
              title={doc.nombre}
              src={`${url}#toolbar=0&navpanes=0`}
              className="h-[240px] w-full border-0 bg-white"
            />
          ) : isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={doc.nombre}
              className="mx-auto h-[240px] w-full object-contain p-3"
            />
          ) : (
            <div className="flex h-[240px] flex-col items-center justify-center gap-2 p-4 text-center text-[13px] text-muted">
              <span className="material-symbols-outlined text-3xl">draft</span>
              Vista previa no disponible
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-0 bg-transparent"
            aria-label={`Ampliar ${doc.nombre}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-outline px-4 py-3">
          <Button type="button" variant="secondary" icon="fullscreen" onClick={() => setOpen(true)}>
            Ampliar
          </Button>
          <a
            href={url}
            download={doc.nombre}
            className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-slate px-4 text-[13px] font-semibold text-white transition hover:bg-[#2c2d2a]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Descargar
          </a>
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
