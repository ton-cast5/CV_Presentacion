"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/profile", label: "Perfil" },
  { href: "/dashboard/education", label: "Formación" },
  { href: "/dashboard/experience", label: "Experiencia" },
  { href: "/dashboard/projects", label: "Proyectos" },
  { href: "/dashboard/certifications", label: "Certificaciones" },
  { href: "/dashboard/documents", label: "Documentos" },
  { href: "/dashboard/export", label: "Exportar PDF" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-navy text-white"
                : "text-navy/80 hover:bg-mist"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
