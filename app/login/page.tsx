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
        Correo profesional
        <div className="relative mt-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-secondary">
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
        Contraseña segura
        <div className="relative mt-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-secondary">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          >
            <span className="material-symbols-outlined text-[20px]">
              {show ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </label>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full" variant="slate" icon="arrow_forward">
        {loading ? "Entrando…" : "Acceder al Workspace"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-surface/80 px-6 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-sm font-bold text-white">
            F
          </div>
          <span className="font-bold">FolioCraft</span>
        </Link>
        <Link href="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-on-surface">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Inicio
        </Link>
      </header>

      <main className="flex min-h-screen flex-col pt-16 lg:flex-row">
        <FadeIn className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-[45%] lg:px-14">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary-container text-white shadow-md">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <div className="font-semibold tracking-tight">FolioCraft</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-secondary">
                  Dossier Engine
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-high px-2.5 py-1 font-mono text-[11px] font-semibold text-primary">
              <span className="fc-pulse-dot h-2 w-2 rounded-full bg-primary" />
              v2.4 SSR
            </span>
          </div>

          <div className="mb-6 flex rounded-lg bg-surface-low p-1">
            <span className="flex-1 rounded bg-white py-2 text-center text-[13px] font-bold text-primary shadow-sm">
              Iniciar Sesión
            </span>
            <Link
              href="/register"
              className="flex-1 rounded py-2 text-center text-[13px] font-semibold text-secondary transition hover:text-on-surface"
            >
              Crear Cuenta
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Bienvenido de vuelta</h1>
          <p className="mt-1 mb-6 text-sm text-muted">
            Accede para gestionar tus CVs, constancias DC-3 y expedientes PDF.
          </p>

          <Suspense fallback={<p className="text-sm">Cargando…</p>}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-xs text-muted">
            Protegido por Supabase Auth · Sesión aislada por RLS
          </p>
        </FadeIn>

        <FadeIn
          delay={0.1}
          className="relative hidden flex-1 overflow-hidden bg-slate p-10 text-white lg:flex lg:flex-col lg:justify-center"
        >
          <div className="fc-gradient-orb right-10 top-10 h-64 w-64 bg-primary-container/40" />
          <div className="fc-gradient-orb bottom-10 left-10 h-48 w-48 bg-emerald/20" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono">Chromium Pipeline</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono">PDF A4</span>
              <span className="rounded-full bg-emerald/20 px-2.5 py-1 font-mono text-emerald">
                Multi-tenant RLS
              </span>
            </div>
            <div className="fc-card border-0 bg-white/5 p-5 backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">Compilador PDF en vivo</span>
                <span className="font-mono text-[11px] text-emerald">⚡ ~2.8s</span>
              </div>
              {["CV A4", "DC-3 STPS", "Certificaciones"].map((t) => (
                <div
                  key={t}
                  className="mb-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-[12px]">{t}</span>
                  <span className="text-[11px] font-bold text-emerald">Listo</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-relaxed text-white/80">
                “Compilé 14 constancias en un solo PDF para una entrevista ejecutiva.
                Orden personalizado, sin fricción.”
              </p>
              <p className="mt-3 text-[12px] font-semibold text-white/60">
                Perfiles high-trust · Expediente maestro
              </p>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
