"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  docCount: number;
  storageMb: number;
  publicHref: string;
  open: boolean;
  onClose: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  external?: boolean;
};

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid_view", exact: true },
  { href: "/dashboard/profile", label: "Perfil", icon: "person" },
  { href: "/dashboard/experience", label: "Experiencia", icon: "work" },
  { href: "/dashboard/education", label: "Educación", icon: "school" },
  { href: "/dashboard/projects", label: "Proyectos", icon: "folder_open" },
  { href: "/dashboard/certifications", label: "Certificaciones", icon: "verified" },
  { href: "/dashboard/documents", label: "Documentos", icon: "inventory_2" },
  { href: "/dashboard/export", label: "Exportar PDF", icon: "picture_as_pdf" },
];

export function DashboardSidebar({
  docCount,
  publicHref,
  open,
  onClose,
}: Props) {
  const pathname = usePathname();

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#20211f]/30 backdrop-blur-[2px] transition md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Mobile drawer with labels */}
      <aside
        className={`fixed left-3 top-3 bottom-3 z-50 flex w-[260px] flex-col rounded-[28px] border border-outline bg-white p-4 shadow-[0_8px_28px_rgba(32,33,31,0.08)] transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-[120%]"
        }`}
      >
        <div className="mb-6 flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            F
          </div>
          <div>
            <div className="text-[15px] font-semibold">FolioCraft</div>
            <div className="text-[11px] text-muted">Dossier Engine</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {mainNav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition ${
                  active
                    ? "bg-slate text-white"
                    : "text-muted hover:bg-surface-2 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
                {item.href === "/dashboard/documents" ? (
                  <span className="ml-auto rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                    {docCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium text-muted transition hover:bg-surface-2 hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
            Vista pública
          </a>
        </nav>
        <form action="/auth/signout" method="post" className="pt-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium text-muted transition hover:bg-error-soft hover:text-error"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* Desktop floating icon rail */}
      <aside className="fc-rail fixed left-4 top-4 bottom-4 z-40 hidden w-[76px] flex-col items-center py-4 md:flex">
        <Link
          href="/dashboard"
          className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white transition hover:bg-primary-hover"
          title="FolioCraft"
        >
          F
        </Link>

        <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2">
          {mainNav.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition ${
                  active
                    ? "bg-slate text-white shadow-sm"
                    : "text-muted hover:bg-surface-2 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                {item.href === "/dashboard/documents" && docCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                    {docCount > 9 ? "9+" : docCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            title="Vista pública"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">visibility</span>
          </a>
        </nav>

        <form action="/auth/signout" method="post" className="mt-3">
          <button
            type="submit"
            title="Cerrar sesión"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-error-soft hover:text-error"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </form>
      </aside>
    </>
  );
}
