import { BrandLockup } from "@/components/brand/BrandLockup";
import { BrandMark } from "@/components/brand/BrandMark";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandLockup markSize={36} showTagline />
          <nav className="flex items-center gap-2">
            {user ? (
              <Button href="/dashboard" icon="grid_view">
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

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <FadeIn>
          <span className="fc-badge fc-badge-ok">CV · Documentos · PDF</span>
          <h1 className="mt-4 flex items-center gap-3 text-[40px] font-semibold leading-[1.08] tracking-tight text-on-surface sm:text-[48px]">
            <BrandMark size={52} />
            FolioCraft
          </h1>
          <p className="mt-3 text-[17px] font-medium text-on-surface/90">
            Tu currículum y expediente documental, listos para compartir y exportar.
          </p>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
            Registra tu perfil, sube actas, cursos, DC-3 y certificaciones. Descarga un
            PDF compuesto con el CV y los archivos que elijas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register" className="h-12 px-5" icon="rocket_launch">
              Crear mi expediente
            </Button>
            <Button href="/login" variant="secondary" className="h-12 px-5">
              Ya tengo cuenta
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="fc-card grid gap-3 p-5 sm:p-6">
            {[
              { t: "Hoja CV A4", s: "Núcleo", i: "description" },
              { t: "Documentos DC-3", s: "Anexo", i: "badge" },
              { t: "Certificaciones", s: "Soporte", i: "verified" },
            ].map((item) => (
              <div
                key={item.t}
                className="flex items-center justify-between rounded-[18px] bg-surface-2 px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary">
                    <span className="material-symbols-outlined">{item.i}</span>
                  </span>
                  <span className="text-[14px] font-semibold">{item.t}</span>
                </div>
                <span className="fc-badge fc-badge-muted">{item.s}</span>
              </div>
            ))}
            <div className="rounded-[18px] bg-primary p-5 text-white">
              <div className="text-[12px] text-white/70">Exportación compuesta</div>
              <div className="mt-1 text-[20px] font-semibold">CV + anexos en un PDF</div>
              <p className="mt-2 text-[13px] text-white/75">
                Selecciona secciones, reordena y descarga listo para entrevistas o licitaciones.
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-[12px] text-muted">
            <Link href="/register" className="font-semibold text-primary underline-offset-2 hover:underline">
              Empieza en menos de un minuto
            </Link>
          </p>
        </FadeIn>
      </main>
    </div>
  );
}
