"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
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

  const slugPreview = useMemo(
    () => slugify(`${nombre}-${apellido}`) || "tu-slug",
    [nombre, apellido],
  );

  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

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
        data: { nombre, apellido, slug: slugPreview },
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
    setInfo("Revisa tu correo para confirmar la cuenta.");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-surface/80 px-6 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-sm font-bold text-white">
            F
          </div>
          <span className="font-bold">FolioCraft</span>
        </Link>
        <Link href="/login" className="text-[13px] font-semibold text-muted hover:text-on-surface">
          ¿Ya tienes cuenta?
        </Link>
      </header>

      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-24">
        <FadeIn>
          <div className="mb-6 flex rounded-lg bg-surface-low p-1">
            <Link
              href="/login"
              className="flex-1 rounded py-2 text-center text-[13px] font-semibold text-secondary hover:text-on-surface"
            >
              Iniciar Sesión
            </Link>
            <span className="flex-1 rounded bg-white py-2 text-center text-[13px] font-bold text-primary shadow-sm">
              Crear Cuenta
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Crea tu workspace</h1>
          <p className="mt-1 mb-6 text-sm text-muted">
            Tu link público se genera a partir de tu nombre.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[13px] font-semibold">
                Nombre
                <input className="fc-input mt-1" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </label>
              <label className="text-[13px] font-semibold">
                Apellido
                <input className="fc-input mt-1" required value={apellido} onChange={(e) => setApellido(e.target.value)} />
              </label>
            </div>
            <div className="rounded-lg bg-surface-low px-3 py-2 font-mono text-[12px] text-muted">
              Slug público: <span className="font-semibold text-primary">/cv/{slugPreview}</span>
            </div>
            <label className="block text-[13px] font-semibold">
              Correo
              <input
                type="email"
                className="fc-input mt-1"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block text-[13px] font-semibold">
              Contraseña
              <input
                type="password"
                className="fc-input mt-1"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-colors ${
                      strength > i ? "bg-tertiary-container" : "bg-surface-high"
                    }`}
                  />
                ))}
              </div>
            </label>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            {info ? <p className="text-sm text-primary">{info}</p> : null}
            <Button type="submit" disabled={loading} className="w-full" icon="rocket_launch">
              {loading ? "Creando…" : "Crear mi expediente"}
            </Button>
          </form>
        </FadeIn>
      </main>
    </div>
  );
}
