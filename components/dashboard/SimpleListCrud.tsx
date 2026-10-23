"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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

export function SimpleListCrud({
  table,
  profileId,
  items: initial,
  fields,
  title,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputCls = "fc-input mt-1";

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const payload: Record<string, unknown> = {
      profile_id: profileId,
      sort_order: items.length,
    };
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
    const { data, error: err } = await supabase
      .from(table)
      .insert(payload)
      .select("*")
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setItems((prev) => [...prev, data as Item]);
    setForm(Object.fromEntries(fields.map((f) => [f.key, ""])));
    router.refresh();
  }

  async function onDelete(id: string) {
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
      <h1 className="text-[20px] font-semibold tracking-tight sm:text-[26px]">
        {title}
      </h1>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="rounded-[20px] border border-dashed border-outline bg-white/60 p-5 text-[13px] text-muted sm:rounded-[24px] sm:p-6">
            Aún no hay elementos.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="fc-card fc-card-hover flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:p-5"
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
                      <span className="font-semibold text-on-surface">{f.label}: </span>
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
              <Button
                type="button"
                variant="danger"
                icon="delete"
                onClick={() => onDelete(item.id)}
              >
                Eliminar
              </Button>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={onAdd} className="fc-card space-y-3 p-4 sm:p-6">
        <h2 className="font-semibold">Agregar</h2>
        {fields.map((f) => (
          <label key={f.key} className="block text-sm font-medium text-on-surface">
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
        <Button type="submit" disabled={loading} icon="add">
          {loading ? "Guardando…" : "Agregar"}
        </Button>
      </form>
    </div>
  );
}
