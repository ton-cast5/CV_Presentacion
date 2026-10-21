"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import type { DocumentRow } from "@/lib/types";

type Props = {
  doc: DocumentRow;
  url: string;
  editable?: boolean;
  onDelete?: (id: string) => void;
};

export function DocumentCard({ doc, url, editable, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="flex flex-col justify-between rounded-xl border border-line bg-white/95 p-4 shadow-sm shadow-navy/5">
        <div>
          <h3 className="font-semibold text-navy">{doc.nombre}</h3>
          <p className="mt-1 text-sm text-ink/65">{doc.descripcion || "Sin descripción"}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-ink/40">
            {doc.mime_type || "archivo"}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
            Ver
          </Button>
          <a
            href={url}
            download={doc.nombre}
            className="inline-flex items-center justify-center rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#134556]"
          >
            Descargar
          </a>
          {editable && onDelete ? (
            <Button type="button" variant="danger" onClick={() => onDelete(doc.id)}>
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
