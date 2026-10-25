"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  publicHref: string;
  open: boolean;
  onClose: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
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

export function DashboardSidebar({ publicHref, open, onClose }: Props) {
  const pathname = usePathname();

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#20211f]/30 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
          />
        ) : null}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.aside
            key="drawer"
            initial={{ x: -280, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed left-2 top-1/2 z-50 flex max-h-[min(520px,78vh)] w-[220px] -translate-y-1/2 flex-col rounded-[16px] border border-outline bg-white p-2.5 shadow-[0_8px_28px_rgba(32,33,31,0.08)] md:hidden"
          >
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                F
              </div>
              <div>
                <div className="text-[12px] font-semibold leading-tight">
                  FolioCraft
                </div>
                <div className="text-[9px] text-muted">Dossier Engine</div>
              </div>
            </div>
            <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
              {mainNav.map((item, i) => {
                const active = isActive(item);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] font-medium transition ${
                        active
                          ? "bg-slate text-white"
                          : "text-muted hover:bg-surface-2 hover:text-on-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px] leading-none">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <a
                href={publicHref}
                target="_blank"
                rel="noreferrer"
                onClick={onClose}
                className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] font-medium text-muted transition hover:bg-surface-2 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[17px] leading-none">
                  visibility
                </span>
                Vista pública
              </a>
            </nav>
            <form action="/auth/signout" method="post" className="pt-1.5">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] font-medium text-muted transition hover:bg-error-soft hover:text-error"
              >
                <span className="material-symbols-outlined text-[17px] leading-none">
                  logout
                </span>
                Cerrar sesión
              </button>
            </form>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {/* Desktop thin icon rail — height hugs content, centered */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fc-rail fixed left-2 top-1/2 z-40 hidden w-[48px] -translate-y-1/2 flex-col items-center py-2 md:flex lg:left-3"
      >
        <Link
          href="/dashboard"
          className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white transition hover:bg-primary-hover hover:scale-105"
          title="FolioCraft"
        >
          F
        </Link>

        <nav className="flex flex-col items-center gap-px px-0.5">
          {mainNav.map((item, i) => {
            const active = isActive(item);
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.03 * i, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  title={item.label}
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition ${
                    active
                      ? "bg-slate text-white shadow-sm"
                      : "text-muted hover:bg-surface-2 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] leading-none">
                    {item.icon}
                  </span>
                </Link>
              </motion.div>
            );
          })}
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            title="Vista pública"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[17px] leading-none">
              visibility
            </span>
          </a>
        </nav>

        <form action="/auth/signout" method="post" className="mt-1.5">
          <button
            type="submit"
            title="Cerrar sesión"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-error-soft hover:text-error"
          >
            <span className="material-symbols-outlined text-[17px] leading-none">
              logout
            </span>
          </button>
        </form>
      </motion.aside>
    </>
  );
}
