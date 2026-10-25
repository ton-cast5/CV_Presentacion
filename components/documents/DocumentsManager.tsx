"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentCard,
  type DocumentUpdatePayload,
} from "@/components/documents/DocumentCard";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { FilePicker } from "@/components/ui/FilePicker";
import { createClient } from "@/lib/supabase/client";
import { publicStorageUrl } from "@/lib/cv-data";
import {
  DOCUMENT_CATEGORIES,
  type DocumentCategory,
  type DocumentRow,
} from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

type Props = {
  profileId: string;
  initialDocs: DocumentRow[];
};

export function DocumentsManager({ profileId, initialDocs }: Props) {
  const router = useRouter();
  const [docs, setDocs] = useState(initialDocs);
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const filtered = useMemo(
    () => (category === "all" ? docs : docs.filter((d) => d.category === category)),
    [docs, category],
  );

  const totalMb =
    docs.reduce((s, d) => s + Number(d.size || 0), 0) / (1024 * 1024);

  async function uploadFile(selected: File, cat: DocumentCategory) {
    if (!ALLOWED.includes(selected.type)) {
      setError("Solo PDF, JPG, PNG o WEBP");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError("Máximo 15 MB");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const safeName = selected.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${profileId}/${cat}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(path, selected, { contentType: selected.type, upsert: false });
    if (upErr) {
      setLoading(false);
      setError(upErr.message);
      return;
    }
    const { data, error: dbErr } = await supabase
      .from("documents")
      .insert({
        profile_id: profileId,
        category: cat,
        nombre: nombre || selected.name,
        descripcion,
        mime_type: selected.type,
        storage_path: path,
        size: selected.size,
        sort_order: docs.filter((d) => d.category === cat).length,
      })
      .select("*")
      .single();
    setLoading(false);
    if (dbErr) {
      setError(dbErr.message);
      return;
    }
    setDocs((prev) => [...prev, data as DocumentRow]);
    setNombre("");
    setDescripcion("");
    setFile(null);
    router.refresh();
  }

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Selecciona un archivo");
      return;
    }
    const cat = category === "all" ? "personal" : category;
    await uploadFile(file, cat);
  }

  async function onDelete(id: string) {
    const doc = docs.find((d) => d.id === id);
    if (!doc) return;
    const supabase = createClient();
    await supabase.storage.from("documents").remove([doc.storage_path]);
    const { error: err } = await supabase.from("documents").delete().eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    setDocs((prev) => prev.filter((d) => d.id !== id));
    router.refresh();
  }

  async function onUpdate(id: string, patch: DocumentUpdatePayload) {
    const doc = docs.find((d) => d.id === id);
    if (!doc) return;

    const supabase = createClient();
    const updates: Record<string, unknown> = {
      nombre: patch.nombre,
      descripcion: patch.descripcion,
      category: patch.category,
    };

    if (patch.file) {
      const selected = patch.file;
      if (!ALLOWED.includes(selected.type)) {
        setError("Solo PDF, JPG, PNG o WEBP");
        return;
      }
      if (selected.size > MAX_BYTES) {
        setError("Máximo 15 MB");
        return;
      }
      const safeName = selected.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${profileId}/${patch.category}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, selected, {
          contentType: selected.type,
          upsert: false,
        });
      if (upErr) {
        setError(upErr.message);
        return;
      }
      await supabase.storage.from("documents").remove([doc.storage_path]);
      updates.storage_path = path;
      updates.mime_type = selected.type;
      updates.size = selected.size;
    }

    const { data, error: err } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();
    if (err) {
      setError(err.message);
      return;
    }
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? (data as DocumentRow) : d)),
    );
    setError(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight">
              Expediente documental
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              Organiza actas, cursos, DC-3, credenciales y certificaciones para
              anexar al PDF maestro.
            </p>
          </div>
          <Button href="/dashboard/export" icon="picture_as_pdf">
            Abrir Constructor PDF
          </Button>
        </div>
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: "Total archivos", v: String(docs.length), i: "inventory_2" },
          { l: "Storage", v: `${totalMb.toFixed(2)} MB`, i: "cloud" },
          {
            l: "DC-3",
            v: String(docs.filter((d) => d.category === "dc3").length),
            i: "badge",
          },
          {
            l: "Listos para export",
            v: String(docs.length),
            i: "task_alt",
          },
        ].map((m) => (
          <StaggerItem key={m.l}>
            <div className="fc-card fc-card-hover p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                    {m.l}
                  </div>
                  <div className="mt-2 text-[26px] font-semibold tracking-tight">
                    {m.v}
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <span className="material-symbols-outlined">{m.i}</span>
                </span>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <form
        onSubmit={onUpload}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
        className={`fc-card relative overflow-hidden p-6 transition ${
          dragOver ? "border-primary bg-primary-soft/50" : ""
        }`}
      >
        <div className="flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-outline bg-surface-2/70 px-4 py-10 text-center">
          <motion.span
            animate={{ y: dragOver ? -4 : 0 }}
            className="material-symbols-outlined mb-2 text-4xl text-primary"
          >
            cloud_upload
          </motion.span>
          <p className="text-sm font-semibold">Arrastra PDF o imagen aquí</p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            documents/{"{user_id}"}/{"{categoria}"}/ · máx 15MB
          </p>
          <div className="mt-4">
            <FilePicker
              accept=".pdf,image/jpeg,image/png,image/webp"
              fileName={file?.name}
              label="Elegir archivo"
              onChange={setFile}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[13px] font-semibold">
            Nombre
            <input
              className="fc-input mt-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Acta de nacimiento"
            />
          </label>
          <label className="text-[13px] font-semibold">
            Categoría de subida
            <select
              className="fc-input mt-1"
              value={category === "all" ? "personal" : category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[13px] font-semibold sm:col-span-2">
            Descripción
            <textarea
              className="fc-textarea mt-1"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </label>
        </div>
        {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
        <div className="mt-4">
          <Button type="submit" disabled={loading} icon="upload">
            {loading ? "Subiendo…" : "Subir documento"}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
            category === "all"
              ? "bg-slate text-white"
              : "bg-white text-muted ring-1 ring-outline hover:bg-surface-2"
          }`}
        >
          Todos ({docs.length})
        </button>
        {DOCUMENT_CATEGORIES.map((c) => {
          const n = docs.filter((d) => d.category === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                category === c.id
                  ? "bg-primary text-white"
                  : "bg-white text-muted ring-1 ring-outline hover:bg-surface-2"
              }`}
            >
              {c.label} ({n})
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <p className="col-span-full rounded-[24px] border border-dashed border-outline p-10 text-center text-sm text-muted">
              No hay documentos en este filtro.
            </p>
          ) : (
            filtered.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <DocumentCard
                  doc={doc}
                  url={publicStorageUrl("documents", doc.storage_path) || "#"}
                  editable
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
