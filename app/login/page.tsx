"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { isValidEmail, normalizeEmail } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const nextRaw = search.get("next") || "/dashboard";
  // Prevent open redirects
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/dashboard";
  const resetOk = search.get("reset") === "ok";
  const authError = search.get("error") === "auth";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(
    authError ? "No se pudo completar la verificación. Intenta de nuevo." : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setLoading(false);
      setError("Ingresa un correo válido.");
      return;
    }
    if (!password || password.length > 72) {
      setLoading(false);
      setError("Contraseña inválida.");
      return;
    }

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    setLoading(false);
    if (err) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {resetOk ? (
        <p className="rounded-[12px] bg-primary-soft/60 px-3 py-2.5 text-[13px] text-primary">
          Contraseña actualizada. Ya puedes iniciar sesión.
        </p>
      ) : null}

      <AuthField
        label="Correo"
        icon="mail"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        required
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu.nombre@empresa.com"
      />

      <div>
        <AuthField
          label="Contraseña"
          icon="lock"
          type={show ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          required
          minLength={6}
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          rightSlot={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="flex h-full w-full items-center justify-center text-muted hover:text-on-surface"
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <span className="material-symbols-outlined text-[20px] leading-none">
                {show ? "visibility_off" : "visibility"}
              </span>
            </button>
          }
        />
        <div className="mt-2 flex justify-end">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">
              lock_reset
            </span>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        icon="arrow_forward"
      >
        {loading ? "Entrando…" : "Acceder al panel"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between px-6">
        <BrandLockup markSize={32} />
        <Link
          href="/"
          className="text-[13px] font-semibold text-muted hover:text-on-surface"
        >
          Inicio
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-16">
        <FadeIn>
          <div className="fc-card mx-auto max-w-md p-7 sm:p-8">
            <div className="mb-6 flex rounded-full bg-surface-2 p-1">
              <span className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[13px] font-semibold text-on-surface shadow-sm">
                <span className="material-symbols-outlined text-[18px] leading-none">
                  login
                </span>
                Iniciar sesión
              </span>
              <Link
                href="/register"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-semibold text-muted hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">
                  person_add
                </span>
                Crear cuenta
              </Link>
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="mt-1 mb-6 text-[13px] leading-relaxed text-muted">
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
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] leading-none">
                  check_circle
                </span>
                <span>Link público de solo lectura</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] leading-none">
                  check_circle
                </span>
                <span>Documentos por categoría (DC-3, cursos, etc.)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] leading-none">
                  check_circle
                </span>
                <span>PDF compuesto con orden personalizable</span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
