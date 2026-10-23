"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-[13px] font-semibold">
        Correo
        <div className="relative mt-1.5">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-muted">
            mail
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="fc-input pl-10"
            placeholder="tu.nombre@empresa.com"
          />
        </div>
      </label>
      <label className="block text-[13px] font-semibold">
        Contraseña
        <div className="relative mt-1.5">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-muted">
            lock
          </span>
          <input
            type={show ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="fc-input pl-10 pr-10"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          >
            <span className="material-symbols-outlined text-[20px]">
              {show ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </label>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full" icon="arrow_forward">
        {loading ? "Entrando…" : "Acceder al panel"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            F
          </div>
          <span className="font-semibold">FolioCraft</span>
        </Link>
        <Link href="/" className="text-[13px] font-semibold text-muted hover:text-on-surface">
          Inicio
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-16">
        <FadeIn>
          <div className="fc-card mx-auto max-w-md p-7 sm:p-8">
            <div className="mb-6 flex rounded-full bg-surface-2 p-1">
              <span className="flex-1 rounded-full bg-white py-2 text-center text-[13px] font-semibold text-on-surface shadow-sm">
                Iniciar sesión
              </span>
              <Link
                href="/register"
                className="flex-1 rounded-full py-2 text-center text-[13px] font-semibold text-muted hover:text-on-surface"
              >
                Crear cuenta
              </Link>
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight">Bienvenido de vuelta</h1>
            <p className="mt-1 mb-6 text-[13px] text-muted">
              Accede para gestionar tu CV, documentos y exportaciones PDF.
            </p>
            <Suspense fallback={<p className="text-sm text-muted">Cargando…</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="hidden lg:block">
          <div className="rounded-[28px] bg-primary p-8 text-white">
            <div className="text-[12px] text-white/70">Expediente profesional</div>
            <h2 className="mt-2 text-[28px] font-semibold leading-tight">
              Un solo lugar para tu CV y anexos
            </h2>
            <ul className="mt-6 space-y-3 text-[14px] text-white/85">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Link público de solo lectura
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Documentos por categoría (DC-3, cursos, etc.)
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                PDF compuesto con orden personalizable
              </li>
            </ul>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
