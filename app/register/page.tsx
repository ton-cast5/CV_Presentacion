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
      <header className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            F
          </div>
          <span className="font-semibold">FolioCraft</span>
        </Link>
        <Link href="/login" className="text-[13px] font-semibold text-muted hover:text-on-surface">
          ¿Ya tienes cuenta?
        </Link>
      </header>

      <main className="mx-auto flex max-w-lg flex-col px-4 py-10 sm:px-6">
        <FadeIn>
          <div className="fc-card p-7 sm:p-8">
            <div className="mb-6 flex rounded-full bg-surface-2 p-1">
              <Link
                href="/login"
                className="flex-1 rounded-full py-2 text-center text-[13px] font-semibold text-muted hover:text-on-surface"
              >
                Iniciar sesión
              </Link>
              <span className="flex-1 rounded-full bg-white py-2 text-center text-[13px] font-semibold shadow-sm">
                Crear cuenta
              </span>
            </div>

            <h1 className="text-[26px] font-semibold tracking-tight">Crea tu workspace</h1>
            <p className="mt-1 mb-6 text-[13px] text-muted">
              Tu link público se genera a partir de tu nombre.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-[13px] font-semibold">
                  Nombre
                  <input className="fc-input mt-1.5" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </label>
                <label className="text-[13px] font-semibold">
                  Apellido
                  <input className="fc-input mt-1.5" required value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </label>
              </div>
              <div className="rounded-[14px] bg-surface-2 px-3 py-2.5 font-mono text-[12px] text-muted">
                /cv/<span className="font-semibold text-primary">{slugPreview}</span>
              </div>
              <label className="block text-[13px] font-semibold">
                Correo
                <input
                  type="email"
                  className="fc-input mt-1.5"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block text-[13px] font-semibold">
                Contraseña
                <input
                  type="password"
                  className="fc-input mt-1.5"
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
                        strength > i ? "bg-primary" : "bg-outline"
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
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
