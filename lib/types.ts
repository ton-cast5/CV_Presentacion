export type DocumentCategory =
  | "personal"
  | "course"
  | "dc3"
  | "credential"
  | "certification";

export const DOCUMENT_CATEGORIES: {
  id: DocumentCategory;
  label: string;
}[] = [
  { id: "personal", label: "Documentación personal" },
  { id: "course", label: "Cursos" },
  { id: "dc3", label: "DC-3" },
  { id: "credential", label: "Credenciales" },
  { id: "certification", label: "Certificaciones (archivos)" },
];

export type Profile = {
  id: string;
  slug: string;
  nombre: string;
  apellido: string;
  foto_path: string | null;
  sobre_mi: string;
  perfil_profesional: string;
  roles: string[];
  telefono: string;
  email_contacto: string;
  direccion: string;
  fecha_nacimiento: string;
  nacionalidad: string;
  estado_civil: string;
  created_at?: string;
  updated_at?: string;
};

export type Education = {
  id: string;
  profile_id: string;
  nivel: string;
  institucion: string;
  lugar: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  profile_id: string;
  puesto: string;
  empresa: string;
  fechas: string;
  bullets: string[];
  sort_order: number;
};

export type Project = {
  id: string;
  profile_id: string;
  titulo: string;
  descripcion: string;
  fechas: string;
  /** URL del proyecto (demo, repo, etc.) — requiere migración 002 */
  link?: string;
  sort_order: number;
};

export type Certification = {
  id: string;
  profile_id: string;
  titulo: string;
  emisor: string;
  vigencia: string;
  icono: string;
  sort_order: number;
};

export type DocumentRow = {
  id: string;
  profile_id: string;
  category: DocumentCategory;
  nombre: string;
  descripcion: string;
  mime_type: string;
  storage_path: string;
  size: number;
  sort_order: number;
  created_at?: string;
};

export type CvData = {
  profile: Profile;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  documents?: DocumentRow[];
  photoUrl?: string | null;
};

export type ExportItem =
  | { type: "cv"; id: "cv" }
  | { type: "doc"; id: string }
  | { type: "external"; id: string; name: string; mimeType: string; dataBase64: string };
