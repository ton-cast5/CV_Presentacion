"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-atmosphere flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line/80 bg-white/90 p-8 shadow-lg shadow-navy/5">
        <Link href="/" className="font-display text-2xl font-semibold text-navy">
          CV Presentación
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-navy">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-ink/60">
          Accede para editar tu CV y documentos.
        </p>
        <Suspense fallback={<p className="mt-8 text-sm">Cargando…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-ink/60">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-navy underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
