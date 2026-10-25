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
  const totalDocs = docs?.length ?? 0;
  const storageMb =
    (docs ?? []).reduce((s, d) => s + Number(d.size || 0), 0) / (1024 * 1024);

  const byCat = {
    personal: docs?.filter((d) => d.category === "personal").length ?? 0,
    course: docs?.filter((d) => d.category === "course").length ?? 0,
    dc3: docs?.filter((d) => d.category === "dc3").length ?? 0,
    other:
      (docs?.filter((d) =>
        ["credential", "certification"].includes(d.category),
      ).length ?? 0),
  };

  const sections = [
    {
      href: "/dashboard/profile",
      title: "Datos personales",
      meta: profile?.nombre ? "Completo" : "Pendiente",
      ok: Boolean(profile?.nombre),
      icon: "person",
    },
    {
      href: "/dashboard/experience",
      title: "Experiencia laboral",
      meta: `${expCount ?? 0} puestos`,
      ok: (expCount ?? 0) > 0,
      icon: "work",
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
      title: "Proyectos",
      meta: `${projCount ?? 0} proyectos`,
      ok: (projCount ?? 0) > 0,
      icon: "folder_open",
    },
    {
      href: "/dashboard/certifications",
      title: "Certificaciones CV",
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
        <section className="fc-card p-6 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="fc-badge fc-badge-ok">Expediente activo</span>
              <h2 className="mt-3 text-[22px] font-semibold tracking-tight sm:text-[24px]">
                Panel de control CV
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Completa tu perfil, sube documentos y construye un PDF compuesto
                listo para compartir.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href={`/cv/${profile?.slug}`} variant="secondary" icon="visibility">
                Ver público
              </Button>
              <Button href="/dashboard/export" icon="picture_as_pdf">
                Construir PDF
              </Button>
            </div>
          </div>
          <div className="mt-6 rounded-[18px] bg-surface-2 px-4 py-3">
            <div className="mb-2 text-[12px] font-semibold text-muted">Link público</div>
            <CopyLink url={publicUrl} />
          </div>
        </section>
      </FadeIn>

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <div className="fc-card flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                  Completitud
                </div>
                <div className="mt-2 text-[28px] font-semibold tracking-tight">{pct}%</div>
                <div className="mt-1 text-[12px] text-muted">
                  {pct >= 80 ? "Listo para exportar" : "Sigue completando secciones"}
                </div>
              </div>
              <div className="relative h-12 w-12 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E9E9E4" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#315C49"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${pct}, 100`}
                  />
                </svg>
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="fc-card flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                  Documentos
                </div>
                <div className="mt-2 text-[28px] font-semibold tracking-tight">{totalDocs}</div>
                <div className="mt-1 text-[12px] text-muted">
                  {byCat.personal} pers. · {byCat.course} cursos · {byCat.dc3} DC-3 · {byCat.other} cert.
                </div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <span className="material-symbols-outlined">inventory_2</span>
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="fc-card flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                  Experiencia
                </div>
                <div className="mt-2 text-[28px] font-semibold tracking-tight">{expCount ?? 0}</div>
                <div className="mt-1 text-[12px] text-muted">Puestos en el CV</div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-on-surface">
                <span className="material-symbols-outlined">work</span>
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="fc-card flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                  Almacenamiento
                </div>
                <div className="mt-2 text-[28px] font-semibold tracking-tight text-on-surface">
                  {storageMb.toFixed(1)}
                  <span className="ml-1 text-[14px] font-medium text-muted">MB</span>
                </div>
                <div className="mt-1 text-[12px] text-muted">
                  Espacio usado por tus documentos
                </div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <span className="material-symbols-outlined">cloud</span>
              </span>
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <FadeIn delay={0.1}>
        <section className="fc-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-semibold tracking-tight">Secciones del expediente</h2>
            <span className="text-[12px] text-muted">{sections.filter((s) => s.ok).length}/{sections.length} listas</span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex items-center justify-between gap-3 rounded-[18px] border border-outline bg-surface-2/60 px-4 py-3.5 transition hover:border-accent-neutral hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold">{s.title}</div>
                      <div className="text-[12px] text-muted">{s.meta}</div>
                    </div>
                  </div>
                  <span className={`fc-badge ${s.ok ? "fc-badge-ok" : "fc-badge-muted"}`}>
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
