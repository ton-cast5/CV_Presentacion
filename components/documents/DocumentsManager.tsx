"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { publicStorageUrl } from "@/lib/cv-data";
import {
  DOCUMENT_CATEGORIES,
  type DocumentCategory,
  type DocumentRow,
} from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

type Props = {
  profileId: string;
  initialDocs: DocumentRow[];
};

export function DocumentsManager({ profileId, initialDocs }: Props) {
  const router = useRouter();
  const [docs, setDocs] = useState(initialDocs);
  const [category, setCategory] = useState<DocumentCategory>("personal");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () => docs.filter((d) => d.category === category),
    [docs, category],
  );

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Selecciona un archivo");
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      setError("Solo PDF, JPG, PNG o WEBP");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Máximo 15 MB");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${profileId}/${category}/${Date.now()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (upErr) {
      setLoading(false);
      setError(upErr.message);
      return;
    }

    const { data, error: dbErr } = await supabase
      .from("documents")
      .insert({
        profile_id: profileId,
        category,
        nombre: nombre || file.name,
        descripcion,
        mime_type: file.type,
        storage_path: path,
        size: file.size,
        sort_order: filtered.length,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Documentos
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Sube archivos por categoría. Cada uno se puede ver o descargar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DOCUMENT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              category === c.id
                ? "bg-navy text-white"
                : "bg-white text-navy border border-line hover:bg-mist"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink/50">
            No hay documentos en esta sección.
          </p>
        ) : (
          filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              url={publicStorageUrl("documents", doc.storage_path) || "#"}
              editable
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <form
        onSubmit={onUpload}
        className="space-y-3 rounded-xl border border-line bg-white/90 p-6"
      >
        <h2 className="font-semibold text-navy">
          Subir a: {DOCUMENT_CATEGORIES.find((c) => c.id === category)?.label}
        </h2>
        <label className="block text-sm font-medium text-navy">
          Nombre
          <input
            className="mt-1 w-full rounded-md border border-line px-3 py-2.5 outline-none focus:border-navy"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Acta de nacimiento"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Descripción
          <textarea
            rows={2}
            className="mt-1 w-full rounded-md border border-line px-3 py-2.5 outline-none focus:border-navy"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Archivo (PDF, JPG, PNG, WEBP · máx 15MB)
          <input
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Subiendo…" : "Subir documento"}
        </Button>
      </form>
    </div>
  );
}
