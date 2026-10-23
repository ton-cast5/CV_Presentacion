import type { CvData } from "@/lib/types";
import "./cv-sheet.css";

type Props = {
  data: CvData;
  className?: string;
};

export function CvSheet({ data, className }: Props) {
  const { profile, education, experience, projects, certifications, photoUrl } =
    data;
  const fullName = `${profile.nombre} ${profile.apellido}`.trim() || "Currículum";

  return (
    <div className={`cv-sheet-root ${className ?? ""}`}>
      <main className="cv" aria-label={`Currículum de ${fullName}`}>
        <aside className="sidebar">
          <div className="photo-wrap">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={`Fotografía de ${fullName}`} />
            ) : (
              <div className="photo-placeholder">
                ESPACIO PARA
                <br />
                FOTOGRAFÍA
              </div>
            )}
          </div>

          {profile.sobre_mi ? (
            <section className="side-section">
              <div className="side-heading">
                <span className="side-icon">♟</span> SOBRE MÍ
              </div>
              <p className="side-copy">{profile.sobre_mi}</p>
            </section>
          ) : null}

          {education.length > 0 ? (
            <section className="side-section">
              <div className="side-heading">
                <span className="side-icon">🎓</span> FORMACIÓN ACADÉMICA
              </div>
              {education.map((edu, i) => (
                <div key={edu.id}>
                  {i > 0 ? <hr className="side-rule" /> : null}
                  <div className="edu-item">
                    <strong>{edu.nivel}</strong>
                    {edu.institucion}
                    {edu.lugar ? (
                      <>
                        <br />
                        {edu.lugar}
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          {certifications.length > 0 ? (
            <section className="side-section">
              <div className="side-heading">
                <span className="side-icon">▣</span> CERTIFICACIONES
              </div>
              {certifications.map((cert) => (
                <div className="cert-item" key={cert.id}>
                  <span className="cert-icon">{cert.icono || "▣"}</span>
                  <div>
                    <strong>{cert.titulo}</strong>
                    {cert.emisor ? (
                      <>
                        {cert.emisor}
                        <br />
                      </>
                    ) : null}
                    {cert.vigencia ? <>Vigencia: {cert.vigencia}</> : null}
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          <section className="personal">
            <div className="side-heading">
              <span className="side-icon">ⓘ</span> DATOS PERSONALES
            </div>
            {profile.fecha_nacimiento ? (
              <p>
                <strong>Fecha de Nacimiento</strong> {profile.fecha_nacimiento}
              </p>
            ) : null}
            {profile.nacionalidad ? (
              <p>
                <strong>Nacionalidad:</strong> {profile.nacionalidad}
              </p>
            ) : null}
            {profile.estado_civil ? (
              <p>
                <strong>Estado Civil:</strong> {profile.estado_civil}
              </p>
            ) : null}
          </section>
        </aside>

        <article className="main">
          <header>
            <h1 className="name">{profile.nombre || "NOMBRE"}</h1>
            <p className="surname">{profile.apellido || "APELLIDO"}</p>
            {profile.roles?.length ? (
              <div className="roles">
                {profile.roles.filter(Boolean).map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            ) : null}
            <div className="contact">
              {profile.telefono ? (
                <div className="contact-item">
                  <span className="contact-icon">☎</span>
                  <span>{profile.telefono}</span>
                </div>
              ) : null}
              {profile.email_contacto ? (
                <div className="contact-item">
                  <span className="contact-icon">✉</span>
                  <span>{profile.email_contacto}</span>
                </div>
              ) : null}
              {profile.direccion ? (
                <div className="contact-item">
                  <span className="contact-icon">●</span>
                  <span className="whitespace-pre-line">{profile.direccion}</span>
                </div>
              ) : null}
            </div>
          </header>

          {profile.perfil_profesional ? (
            <section className="section">
              <div className="section-title">
                <span className="icon">♟</span> PERFIL PROFESIONAL
              </div>
              <p className="profile">{profile.perfil_profesional}</p>
            </section>
          ) : null}

          {experience.length > 0 ? (
            <section className="section experience">
              <div className="section-title">
                <span className="icon">🚚</span> EXPERIENCIA LABORAL
              </div>
              <div className="timeline">
                {experience.map((job) => (
                  <div className="job" key={job.id}>
                    <div className="node" />
                    <div className="date">{job.fechas}</div>
                    <div className="job-content">
                      <h2 className="job-title">{job.puesto}</h2>
                      <p className="company">{job.empresa}</p>
                      {job.bullets?.length ? (
                        <ul>
                          {job.bullets.filter(Boolean).map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {projects.length > 0 ? (
            <section className="section">
              <div className="section-title">
                <span className="icon">⚙</span> PROYECTOS
              </div>
              {projects.map((p) => (
                <div className="project-item" key={p.id}>
                  <h3>
                    {p.titulo}
                    {p.fechas ? ` — ${p.fechas}` : ""}
                  </h3>
                  <p>{p.descripcion}</p>
                  {p.link ? (
                    <p className="project-link">{p.link}</p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}
        </article>
      </main>
    </div>
  );
}
