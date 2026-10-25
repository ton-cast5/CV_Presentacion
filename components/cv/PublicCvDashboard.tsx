"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import type { CvData, Project } from "@/lib/types";

type Props = {
  data: CvData;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function buildRequestMessage(name: string) {
  return `Hola ${name}, vi tu perfil en FolioCraft y me gustaría solicitar tu CV completo. ¿Me lo podrías compartir, por favor?`;
}

function requestCvHref(profile: CvData["profile"], name: string) {
  const msg = buildRequestMessage(name);
  const phone = digitsOnly(profile.telefono || "");
  const email = (profile.email_contacto || "").trim();

  if (phone) {
    return {
      href: `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      label: "Solicitar CV",
      icon: "chat",
      channel: "WhatsApp" as const,
    };
  }
  if (email) {
    const subject = `Solicitud de CV — ${name}`;
    return {
      href: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`,
      label: "Solicitar CV",
      icon: "mail",
      channel: "Correo" as const,
    };
  }
  return null;
}

export function PublicCvDashboard({ data }: Props) {
  const { profile, projects, photoUrl } = data;

  const name = `${profile.nombre} ${profile.apellido}`.trim() || "Perfil";
  const roles = (profile.roles || []).filter(Boolean);
  const about = (profile.sobre_mi || "").trim();
  const professional = (profile.perfil_profesional || "").trim();
  const phone = (profile.telefono || "").trim();
  const email = (profile.email_contacto || "").trim();
  const address = (profile.direccion || "").trim();
  const request = requestCvHref(profile, name);

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 border-b border-outline/70 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-11 max-w-3xl items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] font-bold text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate text-[13px] font-semibold">{name}</span>
          </div>
          <Link
            href="/"
            className="inline-flex h-7 items-center rounded-[8px] bg-primary px-2.5 text-[11px] font-semibold text-white"
          >
            FolioCraft
          </Link>
        </div>
      </motion.header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <FadeIn>
          <motion.section
            className="fc-card overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-gradient-to-br from-primary-soft/80 via-white to-surface-2 px-5 py-7 sm:px-8 sm:py-9">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                    delay: 0.06,
                  }}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-outline sm:h-28 sm:w-28"
                >
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-bold text-primary">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </motion.div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">
                    {name}
                  </h1>
                  {roles.length > 0 ? (
                    <p className="mt-1.5 text-[14px] font-medium text-on-surface/85 sm:text-[15px]">
                      {roles.join(" · ")}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[12px] text-muted">
                    Perfil público · El CV completo se comparte bajo solicitud
                  </p>

                  {request ? (
                    <motion.a
                      href={request.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 inline-flex h-11 items-center gap-2 rounded-[12px] bg-primary px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-primary-hover"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {request.icon}
                      </span>
                      {request.label}
                      <span className="text-[11px] font-medium opacity-80">
                        vía {request.channel}
                      </span>
                    </motion.a>
                  ) : (
                    <p className="mt-4 text-[12px] text-muted">
                      Este perfil aún no tiene teléfono ni correo para solicitar
                      el CV.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-7">
              {about ? (
                <div>
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">
                    Sobre mí
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-on-surface">
                    {about}
                  </p>
                </div>
              ) : null}

              {professional ? (
                <div>
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">
                    Perfil profesional
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-on-surface">
                    {professional}
                  </p>
                </div>
              ) : null}

              {(phone || email || address) && (
                <div>
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">
                    Contacto
                  </h2>
                  <ul className="mt-3 space-y-2.5">
                    {phone ? (
                      <ContactRow icon="call" label="Teléfono" value={phone} />
                    ) : null}
                    {email ? (
                      <ContactRow icon="mail" label="Correo" value={email} />
                    ) : null}
                    {address ? (
                      <ContactRow
                        icon="location_on"
                        label="Ubicación"
                        value={address}
                      />
                    ) : null}
                  </ul>
                </div>
              )}
            </div>
          </motion.section>
        </FadeIn>

        {projects.length > 0 ? (
          <div className="mt-6 sm:mt-8">
            <FadeIn delay={0.08}>
              <h2 className="mb-3 text-[15px] font-semibold tracking-tight sm:text-[16px]">
                Proyectos destacados
              </h2>
            </FadeIn>
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {projects.map((p) => (
                <StaggerItem key={p.id}>
                  <ProjectCard project={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : null}

        {request ? (
          <FadeIn delay={0.12}>
            <div className="mt-8 flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-outline bg-white/60 px-5 py-7 text-center">
              <p className="max-w-md text-[13px] text-muted">
                ¿Te interesa conocer el expediente completo? Solicítalo y te
                responderé por {request.channel.toLowerCase()}.
              </p>
              <a
                href={request.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-slate px-5 text-[13px] font-semibold text-white transition hover:bg-[#2c2d2a]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {request.icon}
                </span>
                Solicitar CV
              </a>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-[12px] bg-surface-2/70 px-3 py-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
          {label}
        </div>
        <div className="break-words text-[14px] text-on-surface">{value}</div>
      </div>
    </li>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const link = (project.link || "").trim();
  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="fc-card flex h-full flex-col justify-between p-4"
    >
      <div>
        <h3 className="text-[15px] font-semibold leading-snug">
          {project.titulo}
        </h3>
        {project.fechas ? (
          <p className="mt-1 text-[12px] text-muted">{project.fechas}</p>
        ) : null}
        {project.descripcion ? (
          <p className="mt-1 line-clamp-3 text-[12px] text-muted">
            {project.descripcion}
          </p>
        ) : null}
      </div>
      {link ? (
        <a
          href={link.startsWith("http") ? link : `https://${link}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-primary px-3 text-[12px] font-semibold text-white transition hover:bg-primary-hover"
        >
          <span className="material-symbols-outlined text-[16px]">
            open_in_new
          </span>
          Ver proyecto
        </a>
      ) : null}
    </motion.article>
  );
}
