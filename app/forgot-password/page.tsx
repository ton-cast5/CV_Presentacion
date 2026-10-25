"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import {
  canRequestReset,
  isValidEmail,
  markResetRequested,
  normalizeEmail,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";

const GENERIC_OK =
  "Si el correo está registrado, te enviamos un enlace seguro para restablecer tu contraseña. Revisa tu bandeja y spam.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    // Bot trap — silently succeed without calling Auth
    if (honeypot.trim()) {
      setInfo(GENERIC_OK);
      return;
    }

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setError("Ingresa un correo válido.");
      return;
    }

    const gate = canRequestReset();
    if (!gate.ok) {
      setError(
        `Espera ${gate.waitSec}s antes de solicitar otro enlace (protección anti-abuso).`,
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`;

    // Supabase Auth API only — never raw SQL. Always show generic message.
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      normalized,
      { redirectTo },
    );
    setLoading(false);

    if (err) {
      // Avoid leaking whether the account exists; still surface rate-limit clearly
      if (/rate|too many|limit/i.test(err.message)) {
        setError(
          "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
        );
        return;
      }
      setInfo(GENERIC_OK);
      markResetRequested();
      return;
    }

    markResetRequested();
    setInfo(GENERIC_OK);
    setEmail("");
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
        <Link
          href="/login"
          className="text-[13px] font-semibold text-muted hover:text-on-surface"
        >
          Volver a iniciar sesión
        </Link>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-4 py-10 sm:px-6">
        <FadeIn>
          <div className="fc-card p-7 sm:p-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <span className="material-symbols-outlined text-[22px] leading-none">
                lock_reset
              </span>
            </div>
            <h1 className="text-[24px] font-semibold tracking-tight sm:text-[26px]">
              Recuperar contraseña
            </h1>
            <p className="mt-1.5 mb-6 text-[13px] leading-relaxed text-muted">
              Te enviaremos un enlace verificado a tu correo. Solo quien tenga
              acceso a esa bandeja podrá cambiar la contraseña.
            </p>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* Honeypot — hidden from users */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden>
                <label>
                  Sitio web
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              <AuthField
                label="Correo de la cuenta"
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
                hint="Usamos el flujo oficial de Supabase Auth (enlace de un solo uso)."
              />

              {error ? <p className="text-sm text-error">{error}</p> : null}
              {info ? (
                <p className="rounded-[12px] bg-primary-soft/60 px-3 py-2.5 text-sm text-primary">
                  {info}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                icon="send"
              >
                {loading ? "Enviando…" : "Enviar enlace seguro"}
              </Button>
            </form>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
