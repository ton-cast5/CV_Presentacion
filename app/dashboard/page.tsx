import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { CopyLink } from "@/components/dashboard/CopyLink";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function completeness(parts: boolean[]) {
  const done = parts.filter(Boolean).length;
  return Math.round((done / parts.length) * 100);
}

export default async function DashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { count: eduCount },
    { count: expCount },
    { count: projCount },
    { count: certCount },
    { data: docs },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("education")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase
      .from("experience")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase
      .from("certifications")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase.from("documents").select("id, category, size").eq("profile_id", user.id),
  ]);

  const pct = completeness([
    Boolean(profile?.nombre && profile?.apellido),
    Boolean(profile?.sobre_mi),
    Boolean(profile?.perfil_profesional),
    Boolean(profile?.telefono || profile?.email_contacto),
    (eduCount ?? 0) > 0,
    (expCount ?? 0) > 0,
    (certCount ?? 0) > 0,
    (docs?.length ?? 0) > 0,
  ]);

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const publicUrl = `${proto}://${host}/cv/${profile?.slug ?? ""}`;

  const byCat = {
    personal: docs?.filter((d) => d.category === "personal").length ?? 0,
    course: docs?.filter((d) => d.category === "course").length ?? 0,
    dc3: docs?.filter((d) => d.category === "dc3").length ?? 0,
    credential: docs?.filter((d) => d.category === "credential").length ?? 0,
    certification: docs?.filter((d) => d.category === "certification").length ?? 0,
  };
  const totalDocs = docs?.length ?? 0;

  const sections = [
    {
      href: "/dashboard/profile",
      title: "Datos personales y contacto",
      meta: profile?.nombre ? "Completo" : "Pendiente",
      ok: Boolean(profile?.nombre),
      icon: "badge",
    },
    {
      href: "/dashboard/experience",
      title: "Experiencia laboral",
      meta: `${expCount ?? 0} puestos`,
      ok: (expCount ?? 0) > 0,
      icon: "work_history",
    },
    {
      href: "/dashboard/education",
      title: "Formación académica",
      meta: `${eduCount ?? 0} registros`,
      ok: (eduCount ?? 0) > 0,
      icon: "school",
    },
    {
      href: "/dashboard/projects",
      title: "Proyectos destacados",
      meta: `${projCount ?? 0} proyectos`,
      ok: (projCount ?? 0) > 0,
      icon: "folder_code",
    },
    {
      href: "/dashboard/certifications",
      title: "Certificaciones del CV",
      meta: `${certCount ?? 0} vigentes`,
      ok: (certCount ?? 0) > 0,
      icon: "verified",
    },
    {
      href: "/dashboard/documents",
      title: "Expediente documental",
      meta: `${totalDocs} archivos`,
      ok: totalDocs > 0,
      icon: "inventory_2",
    },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <section className="fc-card relative overflow-hidden p-6">
          <div className="fc-gradient-orb -right-24 -top-24 h-96 w-96 bg-primary/10" />
          <div className="fc-gradient-orb right-1/4 top-1/2 h-64 w-64 bg-tertiary/10" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  <span className="fc-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
                  Workspace · Producción
                </span>
                <span className="font-mono text-[11px] text-muted">
                  /cv/{profile?.slug}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
                Panel de Control de Expediente y CV
              </h1>
              <p className="text-sm leading-relaxed text-muted">
                Gestiona tu currículum maestro, sincroniza documentos y construye
                expedientes PDF listos para enviar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href={`/cv/${profile?.slug}`} variant="secondary" icon="preview">
                Previsualizar A4
              </Button>
              <Button href="/dashboard/export" icon="picture_as_pdf">
                Construir PDF Compuesto
              </Button>
            </div>
          </div>
          <div className="relative mt-6 flex flex-col justify-between gap-3 rounded-lg bg-surface-low/70 px-4 py-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary">
                <span className="material-symbols-outlined text-[14px]">public</span>
              </span>
              <span className="font-semibold">Enlace público:</span>
            </div>
            <CopyLink url={publicUrl} />
          </div>
        </section>
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <div className="fc-card fc-card-hover flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Estado del CV
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">{pct}%</span>
                  <span className="flex items-center text-[12px] font-semibold text-tertiary">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {pct >= 80 ? "Excelente" : pct >= 50 ? "En progreso" : "Inicial"}
                  </span>
                </div>
              </div>
              <div className="relative h-12 w-12">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${pct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold">
                  {pct}
                </span>
              </div>
            </div>
            <div className="mt-3 -mx-4 -mb-4 bg-surface-low px-4 py-2 text-xs text-muted">
              Completa secciones para optimizar tu hoja A4
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="fc-card fc-card-hover flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Documentos
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{totalDocs}</span>
                  <span className="text-sm text-muted">Archivos</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-high text-primary">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex h-2 overflow-hidden rounded-full bg-surface-high">
                <div className="bg-primary" style={{ width: `${(byCat.personal / Math.max(totalDocs, 1)) * 100}%` }} />
                <div className="bg-primary-container" style={{ width: `${(byCat.course / Math.max(totalDocs, 1)) * 100}%` }} />
                <div className="bg-secondary" style={{ width: `${(byCat.dc3 / Math.max(totalDocs, 1)) * 100}%` }} />
                <div className="bg-tertiary-container" style={{ width: `${((byCat.credential + byCat.certification) / Math.max(totalDocs, 1)) * 100}%` }} />
              </div>
              <div className="font-mono text-[11px] text-muted">
                {byCat.personal} Pers. · {byCat.course} Cursos · {byCat.dc3} DC-3 ·{" "}
                {byCat.certification + byCat.credential} Cert.
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="fc-card fc-card-hover flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Experiencia
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{expCount ?? 0}</span>
                  <span className="text-sm text-muted">Puestos</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container text-on-surface">
                <span className="material-symbols-outlined">work_history</span>
              </div>
            </div>
            <div className="mt-3 -mx-4 -mb-4 flex items-center gap-1.5 bg-surface-low px-4 py-2 text-xs text-muted">
              <span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
              Listo para timeline A4
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="fc-card fc-card-hover flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Certificaciones
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{certCount ?? 0}</span>
                  <span className="text-sm text-muted">En CV</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-fixed text-tertiary">
                <span className="material-symbols-outlined">verified</span>
              </div>
            </div>
            <div className="mt-3 -mx-4 -mb-4 bg-surface-low px-4 py-2 text-xs text-muted">
              Sidebar del CV · vigencia visible
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <FadeIn delay={0.15}>
        <section className="fc-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Secciones del expediente</h2>
            <span className="font-mono text-[11px] text-muted">Arrastra atención · clics rápidos</span>
          </div>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-transparent bg-surface-low/50 px-3 py-3 transition hover:border-primary-container/30 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm transition group-hover:scale-105">
                      <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-xs text-muted">{s.meta}</div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      s.ok
                        ? "bg-tertiary-fixed text-[var(--on-tertiary-fixed)]"
                        : "bg-surface-high text-muted"
                    }`}
                  >
                    {s.ok ? "Listo" : "Pendiente"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>
    </div>
  );
}
