import type { CvData } from "@/lib/types";
import { readFileSync } from "fs";
import path from "path";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(s: string) {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

export function buildCvHtml(data: CvData): string {
  const cssPath = path.join(process.cwd(), "components", "cv", "cv-sheet.css");
  let css = "";
  try {
    css = readFileSync(/*turbopackIgnore: true*/ cssPath, "utf8");
  } catch {
    css = "";
  }

  const { profile, education, experience, projects, certifications, photoUrl } =
    data;

  const eduHtml = education
    .map(
      (edu, i) => `
      ${i > 0 ? '<hr class="side-rule" />' : ""}
      <div class="edu-item">
        <strong>${escapeHtml(edu.nivel)}</strong>
        ${escapeHtml(edu.institucion)}
        ${edu.lugar ? `<br>${escapeHtml(edu.lugar)}` : ""}
      </div>`,
    )
    .join("");

  const certHtml = certifications
    .map(
      (c) => `
      <div class="cert-item">
        <span class="cert-icon">${escapeHtml(c.icono || "▣")}</span>
        <div>
          <strong>${escapeHtml(c.titulo)}</strong>
          ${c.emisor ? `${escapeHtml(c.emisor)}<br>` : ""}
          ${c.vigencia ? `Vigencia: ${escapeHtml(c.vigencia)}` : ""}
        </div>
      </div>`,
    )
    .join("");

  const jobsHtml = experience
    .map(
      (job) => `
      <div class="job">
        <div class="node"></div>
        <div class="date">${escapeHtml(job.fechas)}</div>
        <div class="job-content">
          <h2 class="job-title">${escapeHtml(job.puesto)}</h2>
          <p class="company">${escapeHtml(job.empresa)}</p>
          ${
            job.bullets?.length
              ? `<ul>${job.bullets
                  .filter(Boolean)
                  .map((b) => `<li>${escapeHtml(b)}</li>`)
                  .join("")}</ul>`
              : ""
          }
        </div>
      </div>`,
    )
    .join("");

  const projectsHtml = projects
    .map(
      (p) => `
      <div class="project-item">
        <h3>${escapeHtml(p.titulo)}${p.fechas ? ` — ${escapeHtml(p.fechas)}` : ""}</h3>
        <p>${escapeHtml(p.descripcion)}</p>
      </div>`,
    )
    .join("");

  const rolesHtml = (profile.roles || [])
    .filter(Boolean)
    .map((r) => `<span>${escapeHtml(r)}</span>`)
    .join("");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<style>
@page { size: A4; margin: 0; }
html, body { margin: 0; padding: 0; background: white; }
${css}
.cv-sheet-root .cv { box-shadow: none; margin: 0; }
</style>
</head>
<body>
<div class="cv-sheet-root">
<main class="cv">
  <aside class="sidebar">
    <div class="photo-wrap">
      ${
        photoUrl
          ? `<img src="${escapeHtml(photoUrl)}" alt="" style="display:block;width:100%;height:100%;object-fit:cover" />`
          : `<div class="photo-placeholder">ESPACIO PARA<br>FOTOGRAFÍA</div>`
      }
    </div>
    ${
      profile.sobre_mi
        ? `<section class="side-section"><div class="side-heading"><span class="side-icon">♟</span> SOBRE MÍ</div><p class="side-copy">${escapeHtml(profile.sobre_mi)}</p></section>`
        : ""
    }
    ${
      education.length
        ? `<section class="side-section"><div class="side-heading"><span class="side-icon">🎓</span> FORMACIÓN ACADÉMICA</div>${eduHtml}</section>`
        : ""
    }
    ${
      certifications.length
        ? `<section class="side-section"><div class="side-heading"><span class="side-icon">▣</span> CERTIFICACIONES</div>${certHtml}</section>`
        : ""
    }
    <section class="personal">
      <div class="side-heading"><span class="side-icon">ⓘ</span> DATOS PERSONALES</div>
      ${profile.fecha_nacimiento ? `<p><strong>Fecha de Nacimiento</strong> ${escapeHtml(profile.fecha_nacimiento)}</p>` : ""}
      ${profile.nacionalidad ? `<p><strong>Nacionalidad:</strong> ${escapeHtml(profile.nacionalidad)}</p>` : ""}
      ${profile.estado_civil ? `<p><strong>Estado Civil:</strong> ${escapeHtml(profile.estado_civil)}</p>` : ""}
    </section>
  </aside>
  <article class="main">
    <header>
      <h1 class="name">${escapeHtml(profile.nombre || "NOMBRE")}</h1>
      <p class="surname">${escapeHtml(profile.apellido || "APELLIDO")}</p>
      ${rolesHtml ? `<div class="roles">${rolesHtml}</div>` : ""}
      <div class="contact">
        ${profile.telefono ? `<div class="contact-item"><span class="contact-icon">☎</span><span>${escapeHtml(profile.telefono)}</span></div>` : ""}
        ${profile.email_contacto ? `<div class="contact-item"><span class="contact-icon">✉</span><span>${escapeHtml(profile.email_contacto)}</span></div>` : ""}
        ${profile.direccion ? `<div class="contact-item"><span class="contact-icon">●</span><span>${nl2br(profile.direccion)}</span></div>` : ""}
      </div>
    </header>
    ${
      profile.perfil_profesional
        ? `<section class="section"><div class="section-title"><span class="icon">♟</span> PERFIL PROFESIONAL</div><p class="profile">${escapeHtml(profile.perfil_profesional)}</p></section>`
        : ""
    }
    ${
      experience.length
        ? `<section class="section experience"><div class="section-title"><span class="icon">🚚</span> EXPERIENCIA LABORAL</div><div class="timeline">${jobsHtml}</div></section>`
        : ""
    }
    ${
      projects.length
        ? `<section class="section"><div class="section-title"><span class="icon">⚙</span> PROYECTOS</div>${projectsHtml}</section>`
        : ""
    }
  </article>
</main>
</div>
</body>
</html>`;
}
