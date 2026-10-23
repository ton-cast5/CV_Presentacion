"use client";

import { useState } from "react";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { Button } from "@/components/ui/Button";
import type { DocumentRow } from "@/lib/types";

type Props = {
  doc: DocumentRow;
  url: string;
};

function docYear(doc: DocumentRow): string {
  if (doc.created_at) {
    const y = new Date(doc.created_at).getFullYear();
    if (!Number.isNaN(y)) return String(y);
  }
  return "—";
}

export function DocumentPreviewCard({ doc, url }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="fc-card flex h-full flex-col justify-between p-4">
        <div>
          <h3 className="text-[15px] font-semibold leading-snug text-on-surface">
            {doc.nombre}
          </h3>
          <p className="mt-1 text-[12px] text-muted">Fecha: {docYear(doc)}</p>
          {doc.descripcion ? (
            <p className="mt-1 line-clamp-2 text-[12px] text-muted">{doc.descripcion}</p>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            icon="visibility"
            onClick={() => setOpen(true)}
          >
            Visualizar
          </Button>
          <a
            href={url}
            download={doc.nombre}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-slate px-3 text-[12px] font-semibold text-white transition hover:bg-[#2c2d2a]"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
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
