"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
  badge?: boolean;
  mvp?: boolean;
  external?: boolean;
};

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Gestión CV",
    items: [
      { href: "/dashboard", label: "Dashboard General", icon: "space_dashboard", exact: true },
      { href: "/dashboard/profile", label: "Perfil y Datos", icon: "badge" },
      { href: "/dashboard/experience", label: "Experiencia Laboral", icon: "work_history" },
      { href: "/dashboard/education", label: "Educación", icon: "school" },
      { href: "/dashboard/projects", label: "Proyectos", icon: "folder_code" },
      { href: "/dashboard/certifications", label: "Certificaciones CV", icon: "verified" },
    ],
  },
  {
    label: "Documentos y Archivos",
    items: [
      {
        href: "/dashboard/documents",
        label: "Expediente Documental",
        icon: "inventory_2",
        badge: true,
      },
    ],
  },
  {
    label: "Exportación y Compartir",
    items: [
      {
        href: "/dashboard/export",
        label: "Constructor PDF",
        icon: "picture_as_pdf",
        mvp: true,
      },
      {
        href: "#public",
        label: "Vista Pública",
        icon: "visibility",
        external: true,
      },
    ],
  },
];

export function DashboardSidebar({
  docCount,
  storageMb,
  publicHref,
  open,
  onClose,
}: Props) {
  const pathname = usePathname();
  const pct = Math.min(100, (storageMb / 1024) * 100);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate/40 backdrop-blur-sm transition md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between bg-surface-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-16 items-center gap-2 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary-container text-sm font-bold text-white shadow-md">
              F
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">FolioCraft</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Dossier Engine
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-3 py-3">
            {groups.map((group) => (
              <section key={group.label}>
                <div className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.04em] text-muted">
                  {group.label}
                </div>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const href =
                      item.href === "#public" ? publicHref : item.href;
                    const active =
                      item.href !== "#public" &&
                      (item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href));
                    const className = `relative flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-primary-container font-semibold text-white shadow-sm"
                        : "text-muted hover:bg-surface-low hover:text-on-surface"
                    }`;
                    const inner = (
                      <>
                        {active ? (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 -z-10 rounded-lg bg-primary-container"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        ) : null}
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px]">
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span
                            className={`rounded-full px-1.5 py-0.5 font-mono text-[11px] ${
                              active ? "bg-white/20 text-white" : "bg-surface-high text-on-surface"
                            }`}
                          >
                            {docCount}
                          </span>
                        ) : null}
                        {item.mvp ? (
                          <span className="rounded-full bg-tertiary-fixed px-1.5 py-0.5 text-[10px] font-bold text-[var(--on-tertiary-fixed)]">
                            MVP
                          </span>
                        ) : null}
                        {item.external ? (
                          <span className="material-symbols-outlined text-[16px]">
                            open_in_new
                          </span>
                        ) : null}
                      </>
                    );
                    if (item.external) {
                      return (
                        <a
                          key={item.label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={onClose}
                          className={className}
                        >
                          {inner}
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={item.label}
                        href={href}
                        onClick={onClose}
                        className={className}
                      >
                        {inner}
                      </Link>
                    );
                  })}
                </nav>
              </section>
            ))}
          </div>

          <div className="bg-surface-low p-3">
            <div className="mb-3 rounded-xl bg-surface-lowest p-3 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    cloud_done
                  </span>
                  <span className="text-[13px] font-semibold">Supabase Storage</span>
                </div>
                <span className="font-mono text-[12px] text-muted">
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-surface-high">
                <motion.div
                  className="h-full rounded-full bg-tertiary-container"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(pct, 1.2)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between font-mono text-[11px] text-muted">
                <span>{storageMb.toFixed(1)} MB usado</span>
                <span>1 GB</span>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium text-muted transition hover:bg-error-container hover:text-[var(--on-error-container)]"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
