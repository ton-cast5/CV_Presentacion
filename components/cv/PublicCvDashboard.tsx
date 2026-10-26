"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import type { CvData, Project, Certification } from "@/lib/types";

const RequestCvModal = dynamic(
  () =>
    import("@/components/cv/RequestCvModal").then((m) => m.RequestCvModal),
  { ssr: false },
);

type Props = {
  data: CvData;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function requestChannel(profile: CvData["profile"]) {
  const phone = digitsOnly(profile.telefono || "");
  const email = (profile.email_contacto || "").trim();

  if (phone) {
    return {
      channel: "WhatsApp" as const,
      icon: "chat",
      phoneDigits: phone,
      email: "",
    };
  }
  if (email) {
    return {
      channel: "Correo" as const,
      icon: "mail",
      phoneDigits: "",
      email,
    };
  }
  return null;
}

export function PublicCvDashboard({ data }: Props) {
  const [requestOpen, setRequestOpen] = useState(false);

  const {
    profile,
    experience,
    projects,
    certifications,
    documents = [],
    photoUrl,
  } = data;

  const name = `${profile.nombre} ${profile.apellido}`.trim() || "CV";
  const roles = (profile.roles || []).filter(Boolean);
  const profileSnippet = (profile.perfil_profesional || "").trim();
  const about = (profile.sobre_mi || "").trim();
  const phone = (profile.telefono || "").trim();
  const email = (profile.email_contacto || "").trim();
  const address = (profile.direccion || "").trim();
  const latestJob = experience[0];
  const channel = requestChannel(profile);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-outline/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-2 px-3 sm:h-11 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-1 ring-outline sm:h-7 sm:w-7">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  decoding="async"
                  fetchPriority="low"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] font-bold text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate text-[12px] font-semibold sm:text-[13px]">
              {name}
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">
              · Solo lectura
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-white px-2 text-[11px] font-semibold text-on-surface ring-1 ring-outline"
          >
            <BrandMark size={18} priority />
            FolioCraft
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-5">
        <section className="space-y-5 sm:space-y-6">
          <div className="fc-card p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-2 ring-outline sm:mx-0 sm:h-36 sm:w-36 md:h-40 md:w-40">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-bold text-primary sm:text-3xl">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[22px] font-semibold tracking-tight sm:text-[28px]">
                  {name}
                </h1>
                {roles.length > 0 ? (
                  <p className="mt-1 text-[13px] font-medium text-on-surface/85 sm:text-[14px]">
                    {roles.join(" · ")}
                  </p>
                ) : null}
                {latestJob ? (
                  <p className="mt-1 text-[12px] text-muted sm:text-[13px]">
                    {latestJob.puesto}
                    {latestJob.empresa ? ` · ${latestJob.empresa}` : ""}
                    {latestJob.fechas ? ` · ${latestJob.fechas}` : ""}
                  </p>
                ) : null}
                {profileSnippet ? (
                  <p className="mt-3 whitespace-pre-line break-words text-[13px] leading-relaxed text-muted sm:text-[14px]">
                    {profileSnippet}
                  </p>
                ) : null}

                {channel ? (
                  <button
                    type="button"
                    onClick={() => setRequestOpen(true)}
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-[12px] bg-primary px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-primary-hover sm:h-11 sm:text-[13px]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {channel.icon}
                    </span>
                    Solicitar CV
                    <span className="hidden text-[11px] font-medium opacity-80 sm:inline">
                      vía {channel.channel}
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {about || phone || email || address ? (
            <Section title="Sobre mí y contacto">
              <div className="grid gap-3 lg:grid-cols-2">
                {about ? (
                  <div className="fc-card p-4 sm:p-5">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
                      Sobre mí
                    </h3>
                    <p className="mt-2 whitespace-pre-line break-words text-[13px] leading-relaxed text-on-surface sm:text-[14px]">
                      {about}
                    </p>
                  </div>
                ) : null}
                {phone || email || address ? (
                  <div className="fc-card p-4 sm:p-5">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
                      Contacto
                    </h3>
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
                ) : null}
              </div>
            </Section>
          ) : null}

          {projects.length > 0 ? (
            <Section title="Proyectos">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </Section>
          ) : null}

          {certifications.length > 0 ? (
            <Section title="Certificaciones">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((c) => (
                  <CertCard key={c.id} cert={c} />
                ))}
              </div>
            </Section>
          ) : null}
        </section>
      </div>

      {channel && requestOpen ? (
        <RequestCvModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
          name={name}
          channel={channel.channel}
          channelIcon={channel.icon}
          phoneDigits={channel.phoneDigits}
          email={channel.email}
          documents={documents}
          projects={projects}
          certifications={certifications}
        />
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 text-[15px] font-semibold tracking-tight sm:text-[16px]">
        {title}
      </h2>
      {children}
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
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.03em] text-muted">
          {label}
        </div>
        <div className="break-words text-[13px] text-on-surface">{value}</div>
      </div>
    </li>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const link = (project.link || "").trim();
  return (
    <article className="fc-card flex h-full flex-col justify-between p-4 transition hover:-translate-y-0.5">
      <div>
        <h3 className="text-[15px] font-semibold leading-snug">
          {project.titulo}
        </h3>
        {project.fechas ? (
          <p className="mt-1 text-[12px] text-muted">Fecha: {project.fechas}</p>
        ) : null}
        {project.descripcion ? (
          <p className="mt-1 whitespace-pre-line break-words text-[12px] text-muted">
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
    </article>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  return (
    <article className="fc-card p-4 transition hover:-translate-y-0.5">
      <h3 className="text-[15px] font-semibold leading-snug">{cert.titulo}</h3>
      {cert.vigencia ? (
        <p className="mt-1 text-[12px] text-muted">
          Fecha / vigencia: {cert.vigencia}
        </p>
      ) : null}
      {cert.emisor ? (
        <p className="mt-1 text-[12px] text-muted">{cert.emisor}</p>
      ) : null}
    </article>
  );
}
