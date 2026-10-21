import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="fc-gradient-orb -left-20 -top-20 h-[420px] w-[420px] bg-primary/15" />
      <div className="fc-gradient-orb bottom-0 right-0 h-[380px] w-[380px] bg-tertiary/10" />

      <header className="relative z-10 border-b border-outline-variant/40 bg-surface-lowest/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary-container text-sm font-bold text-white shadow-md">
              F
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">FolioCraft</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Dossier Engine
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {user ? (
              <Button href="/dashboard" icon="space_dashboard">
                Ir al panel
              </Button>
            ) : (
              <>
                <Button href="/login" variant="ghost">
                  Entrar
                </Button>
                <Button href="/register" icon="arrow_forward">
                  Crear cuenta
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <FadeIn>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            <span className="fc-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
            Multi-CV · PDF · DC-3
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-on-surface sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            FolioCraft
          </h1>
          <p className="mt-3 text-lg font-medium text-on-surface/90">
            Tu currículum y expediente documental, listos para compartir y exportar.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Registra tu perfil, sube actas, cursos, DC-3 y certificaciones. Descarga un
            PDF compuesto con el CV y los archivos que elijas, en el orden que quieras.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register" className="h-11 px-5" icon="rocket_launch">
              Crear mi expediente
            </Button>
            <Button href="/login" variant="secondary" className="h-11 px-5">
              Ya tengo cuenta
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">verified</span>
              RLS por usuario
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">picture_as_pdf</span>
              Merge A4 + anexos
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-amber">bolt</span>
              Link público /cv/slug
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="relative">
          <div className="fc-float absolute -right-2 top-6 z-10 rounded-xl border border-white/10 bg-slate px-3 py-2 text-[11px] text-white shadow-lg">
            <span className="text-emerald">●</span> Pipeline PDF activo
          </div>
          <div className="fc-card relative overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Vista previa del studio
              </span>
              <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--on-tertiary-fixed)]">
                LIVE
              </span>
            </div>
            <div className="grid gap-3">
              {[
                { t: "DOC_01 // CV A4", s: "Listo", c: "bg-primary-fixed text-primary" },
                { t: "ANEXO // DC-3", s: "Validado", c: "bg-tertiary-fixed text-tertiary" },
                { t: "CERT // Cursos", s: "100% OK", c: "bg-secondary-container text-secondary" },
              ].map((item, i) => (
                <div
                  key={item.t}
                  className="flex items-center justify-between rounded-lg border border-outline-variant/50 bg-surface-low/60 px-3 py-3 transition hover:bg-white"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <span className="font-mono text-[12px] font-medium">{item.t}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.c}`}>
                    {item.s}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-slate p-4 text-white">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-white/70">Latencia estimada</span>
                <span className="font-bold text-emerald">~2.8s</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="fc-shimmer h-full w-2/3 rounded-full bg-primary-container" />
              </div>
              <p className="mt-3 text-xs text-white/70">
                Compila CV + anexos en un solo PDF maestro para licitaciones y entrevistas.
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            ¿Listo?{" "}
            <Link href="/register" className="font-semibold text-primary underline-offset-2 hover:underline">
              Empieza en menos de un minuto
            </Link>
          </p>
        </FadeIn>
      </main>
    </div>
  );
}
