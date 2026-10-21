"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  photoUrl: string | null;
};

export function ProfileForm({ profile, photoUrl }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: profile.nombre,
    apellido: profile.apellido,
    slug: profile.slug,
    sobre_mi: profile.sobre_mi,
    perfil_profesional: profile.perfil_profesional,
    roles: (profile.roles || []).join(", "),
    telefono: profile.telefono,
    email_contacto: profile.email_contacto,
    direccion: profile.direccion,
    fecha_nacimiento: profile.fecha_nacimiento,
    nacionalidad: profile.nacionalidad,
    estado_civil: profile.estado_civil,
  });
  const [preview, setPreview] = useState(photoUrl);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onPhoto(file: File | null) {
    if (!file) return;
    setErr(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/avatar.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setErr(error.message);
      return;
    }
    await supabase
      .from("profiles")
      .update({ foto_path: path })
      .eq("id", profile.id);
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setPreview(`${data.publicUrl}?t=${Date.now()}`);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    const supabase = createClient();
    const roles = form.roles
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const { error } = await supabase
      .from("profiles")
      .update({
        nombre: form.nombre,
        apellido: form.apellido,
        slug: slugify(form.slug || `${form.nombre}-${form.apellido}`),
        sobre_mi: form.sobre_mi,
        perfil_profesional: form.perfil_profesional,
        roles,
        telefono: form.telefono,
        email_contacto: form.email_contacto,
        direccion: form.direccion,
        fecha_nacimiento: form.fecha_nacimiento,
        nacionalidad: form.nacionalidad,
        estado_civil: form.estado_civil,
      })
      .eq("id", profile.id);
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg("Perfil guardado");
    router.refresh();
  }

  const field =
    "mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-navy";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="h-28 w-28 overflow-hidden rounded-full border border-line bg-mist">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-navy/50">
              Sin foto
            </div>
          )}
        </div>
        <label className="text-sm font-medium text-navy">
          Foto de perfil
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-1 block text-sm"
            onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-navy">
          Nombre
          <input className={field} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </label>
        <label className="text-sm font-medium text-navy">
          Apellido
          <input className={field} value={form.apellido} onChange={(e) => set("apellido", e.target.value)} />
        </label>
        <label className="text-sm font-medium text-navy sm:col-span-2">
          Slug del link público
          <input className={field} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </label>
        <label className="text-sm font-medium text-navy sm:col-span-2">
          Roles (separados por coma)
          <input
            className={field}
            value={form.roles}
            onChange={(e) => set("roles", e.target.value)}
            placeholder="Operador, Maniobrista"
          />
        </label>
        <label className="text-sm font-medium text-navy sm:col-span-2">
          Sobre mí
          <textarea
            rows={3}
            className={field}
            value={form.sobre_mi}
            onChange={(e) => set("sobre_mi", e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-navy sm:col-span-2">
          Perfil profesional
          <textarea
            rows={3}
            className={field}
            value={form.perfil_profesional}
            onChange={(e) => set("perfil_profesional", e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-navy">
          Teléfono
          <input className={field} value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
        </label>
        <label className="text-sm font-medium text-navy">
          Email de contacto
          <input className={field} value={form.email_contacto} onChange={(e) => set("email_contacto", e.target.value)} />
        </label>
        <label className="text-sm font-medium text-navy sm:col-span-2">
          Dirección
          <textarea
            rows={2}
            className={field}
            value={form.direccion}
            onChange={(e) => set("direccion", e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-navy">
          Fecha de nacimiento
          <input className={field} value={form.fecha_nacimiento} onChange={(e) => set("fecha_nacimiento", e.target.value)} placeholder="08/09/1975" />
        </label>
        <label className="text-sm font-medium text-navy">
          Nacionalidad
          <input className={field} value={form.nacionalidad} onChange={(e) => set("nacionalidad", e.target.value)} />
        </label>
        <label className="text-sm font-medium text-navy">
          Estado civil
          <input className={field} value={form.estado_civil} onChange={(e) => set("estado_civil", e.target.value)} />
        </label>
      </div>

      {err ? <p className="text-sm text-red-700">{err}</p> : null}
      {msg ? <p className="text-sm text-navy">{msg}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  );
}
