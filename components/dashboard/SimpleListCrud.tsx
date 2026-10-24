"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "bullets";
  placeholder?: string;
};

type Item = Record<string, unknown> & { id: string };

type Props = {
  table: string;
  profileId: string;
  items: Item[];
  fields: Field[];
  title: string;
};

function emptyForm(fields: Field[]) {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

function itemToForm(item: Item, fields: Field[]) {
  return Object.fromEntries(
    fields.map((f) => {
      const val = item[f.key];
      if (Array.isArray(val)) return [f.key, (val as string[]).join("\n")];
      return [f.key, String(val ?? "")];
    }),
  );
}

function payloadFromForm(fields: Field[], form: Record<string, string>) {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "bullets") {
      payload[f.key] = form[f.key]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    } else {
      payload[f.key] = form[f.key];
    }
  }
  return payload;
}

export function SimpleListCrud({
  table,
  profileId,
  items: initial,
  fields,
  title,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<Record<string, string>>(() =>
    emptyForm(fields),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const inputCls = "fc-input mt-1";
  const isEditing = Boolean(editingId);

  function startEdit(item: Item) {
    setEditingId(item.id);
    setForm(itemToForm(item, fields));
    setError(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm(fields));
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const payload = payloadFromForm(fields, form);

    if (editingId) {
      const { data, error: err } = await supabase
        .from(table)
        .update(payload)
        .eq("id", editingId)
        .select("*")
        .single();
      setLoading(false);
      if (err) {
        setError(err.message);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? (data as Item) : i)),
      );
      cancelEdit();
      router.refresh();
      return;
    }

    const { data, error: err } = await supabase
      .from(table)
      .insert({
        ...payload,
        profile_id: profileId,
        sort_order: items.length,
      })
      .select("*")
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setItems((prev) => [...prev, data as Item]);
    setForm(emptyForm(fields));
    router.refresh();
  }

  async function onDelete(id: string) {
    if (editingId === id) cancelEdit();
    const supabase = createClient();
    const { error: err } = await supabase.from(table).delete().eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <FadeIn>
        <h1 className="text-[20px] font-semibold tracking-tight sm:text-[26px]">
          {title}
        </h1>
      </FadeIn>

      <ul className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.length === 0 ? (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[20px] border border-dashed border-outline bg-white/60 p-5 text-[13px] text-muted sm:rounded-[24px] sm:p-6"
            >
              Aún no hay elementos. Agrega el primero abajo.
            </motion.li>
          ) : (
            items.map((item, index) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`fc-card fc-card-hover flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:p-5 ${
                  editingId === item.id ? "ring-2 ring-primary/40" : ""
                }`}
              >
                <div className="min-w-0 break-words text-[13px] sm:text-sm">
                  {fields.map((f) => {
                    const val = item[f.key];
                    const text = Array.isArray(val)
                      ? (val as string[]).join(" · ")
                      : String(val ?? "");
                    if (!text) return null;
                    return (
                      <p key={f.key} className="text-muted">
                        <span className="font-semibold text-on-surface">
                          {f.label}:{" "}
                        </span>
                        {f.key === "link" ? (
                          <a
                            href={
                              text.startsWith("http") ? text : `https://${text}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-primary hover:underline"
                          >
                            {text}
                          </a>
                        ) : (
                          text
                        )}
                      </p>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    icon="edit"
                    onClick={() => startEdit(item)}
                    className="h-9 px-3 text-[12px]"
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    icon="delete"
                    onClick={() => onDelete(item.id)}
                    className="h-9 px-3 text-[12px]"
                  >
                    Eliminar
                  </Button>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>

      <FadeIn delay={0.08}>
        <motion.form
          layout
          onSubmit={onSubmit}
          className={`fc-card space-y-3 p-4 sm:p-6 ${
            isEditing ? "ring-2 ring-primary/30" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">
              {isEditing ? "Editar elemento" : "Agregar"}
            </h2>
            {isEditing ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-[12px] font-semibold text-muted hover:text-on-surface"
              >
                Cancelar
              </button>
            ) : null}
          </div>
          {fields.map((f) => (
            <label
              key={f.key}
              className="block text-sm font-medium text-on-surface"
            >
              {f.label}
              {f.type === "textarea" || f.type === "bullets" ? (
                <textarea
                  rows={f.type === "bullets" ? 4 : 3}
                  className={inputCls}
                  placeholder={
                    f.placeholder ||
                    (f.type === "bullets" ? "Una línea por punto" : "")
                  }
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              ) : (
                <input
                  className={inputCls}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              )}
            </label>
          ))}
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={loading}
              icon={isEditing ? "save" : "add"}
            >
              {loading
                ? "Guardando…"
                : isEditing
                  ? "Guardar cambios"
                  : "Agregar"}
            </Button>
            {isEditing ? (
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </motion.form>
      </FadeIn>
    </div>
  );
}
