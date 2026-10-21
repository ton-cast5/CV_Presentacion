"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  DOCUMENT_CATEGORIES,
  type DocumentCategory,
  type DocumentRow,
  type ExportItem,
} from "@/lib/types";

type ListItem =
  | { key: string; type: "cv"; label: string }
  | { key: string; type: "doc"; id: string; label: string; category: DocumentCategory }
  | {
      key: string;
      type: "external";
      id: string;
      label: string;
      mimeType: string;
      dataBase64: string;
    };

function SortableRow({
  id,
  label,
  onRemove,
}: {
  id: string;
  label: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 rounded-md border border-line bg-white px-3 py-2"
    >
      <button
        type="button"
        className="cursor-grab text-left text-sm font-medium text-navy active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        ⋮⋮ {label}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="text-xs font-semibold text-red-700"
      >
        Quitar
      </button>
    </li>
  );
}

type Props = {
  documents: DocumentRow[];
};

export function ExportBuilder({ documents }: Props) {
  const [order, setOrder] = useState<ListItem[]>([
    { key: "cv", type: "cv", label: "Hoja de CV" },
  ]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const byCategory = useMemo(() => {
    const map = new Map<DocumentCategory, DocumentRow[]>();
    for (const c of DOCUMENT_CATEGORIES) map.set(c.id, []);
    for (const d of documents) {
      map.get(d.category)?.push(d);
    }
    return map;
  }, [documents]);

  function syncOrderFromSelection(nextSelected: Set<string>, keepCv = true) {
    setOrder((prev) => {
      const externals = prev.filter((i) => i.type === "external");
      const cv = keepCv
        ? prev.find((i) => i.type === "cv") || {
            key: "cv",
            type: "cv" as const,
            label: "Hoja de CV",
          }
        : null;

      const existingDocKeys = new Map(
        prev.filter((i) => i.type === "doc").map((i) => [i.key, i]),
      );

      const docs: ListItem[] = [];
      for (const id of nextSelected) {
        const key = `doc:${id}`;
        const existing = existingDocKeys.get(key);
        if (existing) {
          docs.push(existing);
        } else {
          const doc = documents.find((d) => d.id === id);
          if (doc) {
            docs.push({
              key,
              type: "doc",
              id: doc.id,
              label: `${doc.nombre} (${doc.category})`,
              category: doc.category,
            });
          }
        }
      }

      // Preserve relative order of items that remain
      const keptKeys = new Set([
        ...(cv ? [cv.key] : []),
        ...docs.map((d) => d.key),
        ...externals.map((e) => e.key),
      ]);
      const previousOrder = prev.filter((i) => keptKeys.has(i.key));
      const previousKeys = new Set(previousOrder.map((i) => i.key));
      const additions = [
        ...(cv && !previousKeys.has(cv.key) ? [cv] : []),
        ...docs.filter((d) => !previousKeys.has(d.key)),
        ...externals.filter((e) => !previousKeys.has(e.key)),
      ];
      return [...previousOrder, ...additions];
    });
  }

  function toggleDoc(id: string) {
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      syncOrderFromSelection(next, order.some((i) => i.type === "cv"));
      return next;
    });
  }

  function toggleSection(cat: DocumentCategory, on: boolean) {
    const ids = (byCategory.get(cat) || []).map((d) => d.id);
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      syncOrderFromSelection(next, order.some((i) => i.type === "cv"));
      return next;
    });
  }

  function toggleCv(on: boolean) {
    if (on) {
      setOrder((prev) =>
        prev.some((i) => i.type === "cv")
          ? prev
          : [{ key: "cv", type: "cv", label: "Hoja de CV" }, ...prev],
      );
    } else {
      setOrder((prev) => prev.filter((i) => i.type !== "cv"));
    }
  }

  async function onExternal(file: File | null) {
    if (!file) return;
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    const dataBase64 = btoa(binary);
    const id = `ext-${Date.now()}`;
    setOrder((prev) => [
      ...prev,
      {
        key: id,
        type: "external",
        id,
        label: `Externo: ${file.name}`,
        mimeType: file.type || "application/pdf",
        dataBase64,
      },
    ]);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((items) => {
      const oldIndex = items.findIndex((i) => i.key === active.id);
      const newIndex = items.findIndex((i) => i.key === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const items: ExportItem[] = order.map((i) => {
        if (i.type === "cv") return { type: "cv", id: "cv" };
        if (i.type === "doc") return { type: "doc", id: i.id };
        return {
          type: "external",
          id: i.id,
          name: i.label,
          mimeType: i.mimeType,
          dataBase64: i.dataBase64,
        };
      });

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al generar PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV-export.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const includeCv = order.some((i) => i.type === "cv");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Exportar PDF
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Elige la hoja de CV, secciones o archivos, reordénalos y descarga un solo PDF.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-navy">
        <input
          type="checkbox"
          checked={includeCv}
          onChange={(e) => toggleCv(e.target.checked)}
        />
        Incluir hoja de CV
      </label>

      <section className="space-y-4 rounded-xl border border-line bg-white/90 p-5">
        <h2 className="font-semibold text-navy">Documentos por sección</h2>
        {DOCUMENT_CATEGORIES.map((cat) => {
          const list = byCategory.get(cat.id) || [];
          const allOn =
            list.length > 0 && list.every((d) => selectedDocs.has(d.id));
          return (
            <div key={cat.id} className="border-t border-line/70 pt-3 first:border-0 first:pt-0">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{cat.label}</p>
                <button
                  type="button"
                  className="text-xs font-semibold text-navy underline"
                  onClick={() => toggleSection(cat.id, !allOn)}
                  disabled={!list.length}
                >
                  {allOn ? "Quitar sección" : "Toda la sección"}
                </button>
              </div>
              {list.length === 0 ? (
                <p className="text-xs text-ink/45">Sin archivos</p>
              ) : (
                <ul className="space-y-1">
                  {list.map((d) => (
                    <li key={d.id}>
                      <label className="flex items-center gap-2 text-sm text-ink/80">
                        <input
                          type="checkbox"
                          checked={selectedDocs.has(d.id)}
                          onChange={() => toggleDoc(d.id)}
                        />
                        {d.nombre}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-white/90 p-5">
        <h2 className="font-semibold text-navy">Documento externo (opcional)</h2>
        <p className="text-xs text-ink/50">
          Solo para esta exportación; no se guarda en tu perfil.
        </p>
        <input
          type="file"
          accept=".pdf,image/jpeg,image/png"
          onChange={(e) => onExternal(e.target.files?.[0] ?? null)}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-white/90 p-5">
        <h2 className="font-semibold text-navy">Orden de exportación</h2>
        <p className="text-xs text-ink/50">Arrastra para reordenar.</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={order.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {order.map((item) => (
                <SortableRow
                  key={item.key}
                  id={item.key}
                  label={item.label}
                  onRemove={() => {
                    if (item.type === "doc") {
                      setSelectedDocs((prev) => {
                        const next = new Set(prev);
                        next.delete(item.id);
                        return next;
                      });
                    }
                    setOrder((prev) => prev.filter((i) => i.key !== item.key));
                  }}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <Button type="button" onClick={generate} disabled={loading || order.length === 0}>
        {loading ? "Generando…" : "Generar y descargar PDF"}
      </Button>
    </div>
  );
}
