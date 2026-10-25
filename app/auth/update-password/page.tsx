"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import {
  passwordIssues,
  passwordStrength,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const issues = useMemo(() => passwordIssues(password), [password]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setAllowed(Boolean(user));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!allowed) {
      setError("Sesión de recuperación inválida o expirada. Solicita un nuevo enlace.");
      return;
    }

    if (issues.length) {
      setError(issues[0]);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Password update via Auth API only (hashed server-side by Supabase — no SQL from the app).
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setLoading(false);
      setError(
        /same|identical/i.test(err.message)
          ? "Elige una contraseña distinta a la anterior."
          : err.message,
      );
      return;
    }

    // End recovery session so the new password must be used to sign in again
    await supabase.auth.signOut();
    setLoading(false);
    router.replace("/login?reset=ok");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">
        Verificando enlace…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-md px-4 py-16">
          <div className="fc-card p-7 text-center sm:p-8">
            <span className="material-symbols-outlined mb-3 text-3xl text-error">
              link_off
            </span>
            <h1 className="text-[22px] font-semibold">Enlace no válido</h1>
            <p className="mt-2 text-[13px] text-muted">
              El enlace de recuperación expiró o ya fue usado. Solicita uno
              nuevo desde tu correo registrado.
            </p>
            <Button href="/forgot-password" className="mt-6 w-full" icon="lock_reset">
              Solicitar nuevo enlace
            </Button>
            <Link
              href="/login"
              className="mt-3 block text-[13px] font-semibold text-muted hover:text-on-surface"
            >
              Volver al login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            F
          </div>
          <span className="font-semibold">FolioCraft</span>
        </Link>
      </header>

      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <FadeIn>
          <div className="fc-card p-7 sm:p-8">
            <h1 className="text-[24px] font-semibold tracking-tight sm:text-[26px]">
              Nueva contraseña
            </h1>
            <p className="mt-1.5 mb-6 text-[13px] text-muted">
              Tu identidad ya fue verificada por el enlace del correo. Define una
              contraseña fuerte.
            </p>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <AuthField
                label="Nueva contraseña"
                icon="lock"
                type={show ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="flex h-full w-full items-center justify-center text-muted hover:text-on-surface"
                    aria-label={show ? "Ocultar" : "Mostrar"}
                  >
                    <span className="material-symbols-outlined text-[20px] leading-none">
                      {show ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                }
              />
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-colors ${
                      strength > i ? "bg-primary" : "bg-outline"
                    }`}
                  />
                ))}
              </div>

              <AuthField
                label="Confirmar contraseña"
                icon="lock"
                type={show ? "text" : "password"}
                name="confirm"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••••••"
              />

              {error ? <p className="text-sm text-error">{error}</p> : null}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                icon="verified_user"
              >
                {loading ? "Guardando…" : "Guardar contraseña"}
              </Button>
            </form>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
