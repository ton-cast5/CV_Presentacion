"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  mimeType: string;
  nombre: string;
};

export function DocumentViewer({ open, onClose, url, mimeType, nombre }: Props) {
  const isPdf = mimeType.includes("pdf");
  const isImage = mimeType.startsWith("image/");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate/60 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
              <h3 className="truncate font-semibold">{nombre}</h3>
              <Button type="button" variant="ghost" icon="close" onClick={onClose}>
                Cerrar
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-surface-low p-2">
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
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
