"use client";

import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  mimeType: string;
  nombre: string;
};

export function DocumentViewer({ open, onClose, url, mimeType, nombre }: Props) {
  if (!open) return null;

  const isPdf = mimeType.includes("pdf");
  const isImage = mimeType.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="truncate font-semibold text-navy">{nombre}</h3>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-mist p-2">
          {isPdf ? (
            <iframe title={nombre} src={url} className="h-[75vh] w-full rounded-md bg-white" />
          ) : isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={nombre} className="mx-auto max-h-[75vh] object-contain" />
          ) : (
            <p className="p-6 text-sm">
              Vista previa no disponible.{" "}
              <a href={url} className="underline" target="_blank" rel="noreferrer">
                Abrir archivo
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
