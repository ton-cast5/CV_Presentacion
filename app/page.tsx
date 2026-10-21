import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="bg-atmosphere min-h-screen">
      <SiteHeader />
      <main className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-8 -z-0 mx-auto h-[420px] max-w-4xl opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230b3040' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10 max-w-2xl">
          <p className="font-display text-5xl font-semibold tracking-tight text-navy sm:text-6xl md:text-7xl">
            CV Presentación
          </p>
          <h1 className="mt-5 text-xl font-medium text-navy/90 sm:text-2xl">
            Tu currículum y documentos, listos para compartir y exportar.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
            Registra tu perfil, sube actas, cursos, DC-3 y certificaciones, y
            descarga un PDF con el CV y los archivos que elijas, en el orden
            que quieras.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register" className="px-6 py-3 text-base">
              Crear mi CV
            </Button>
            <Button href="/login" variant="secondary" className="px-6 py-3 text-base">
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
