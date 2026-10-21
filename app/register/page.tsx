"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
          slug: slugify(`${nombre}-${apellido}`),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setInfo(
      "Revisa tu correo para confirmar la cuenta. Luego podrás iniciar sesión.",
    );
  }

  return (
    <div className="bg-atmosphere flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line/80 bg-white/90 p-8 shadow-lg shadow-navy/5">
        <Link href="/" className="font-display text-2xl font-semibold text-navy">
          CV Presentación
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-navy">Crear cuenta</h1>
        <p className="mt-1 text-sm text-ink/60">
          Tu link público se generará a partir de tu nombre.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-navy">
              Nombre
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-navy"
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              Apellido
              <input
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-navy"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-navy">
            Correo
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-navy"
            />
          </label>
          <label className="block text-sm font-medium text-navy">
            Contraseña
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-navy"
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {info ? <p className="text-sm text-navy">{info}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando…" : "Registrarme"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-navy underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
