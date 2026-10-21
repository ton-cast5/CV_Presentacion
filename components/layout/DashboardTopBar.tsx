"use client";

import { useState } from "react";

type Props = {
  name: string;
  roles: string[];
  publicUrl: string;
  onMenu: () => void;
};

export function DashboardTopBar({ name, roles, publicUrl, onMenu }: Props) {
  const [copied, setCopied] = useState(false);
  const title = roles[0] ? `CV Principal — ${roles[0]}` : "CV Principal";

  async function copy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-outline-variant/40 bg-surface-lowest/90 backdrop-blur-xl md:left-72">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onMenu}
            className="rounded-lg p-2 text-muted hover:bg-surface-low md:hidden"
            aria-label="Menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex min-w-0 items-center gap-1.5 rounded-xl bg-surface-container px-3 py-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[20px] text-primary">
              description
            </span>
            <span className="truncate text-[13px] font-semibold">{title}</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-surface-low px-2 py-1 xl:flex">
            <span className="fc-pulse-dot h-2 w-2 rounded-full bg-tertiary-container" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
              Sincronizado · Supabase RLS
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 rounded-xl bg-surface-low py-1 pl-3 pr-1 shadow-sm md:flex">
            <span className="material-symbols-outlined text-[16px] text-muted">link</span>
            <span className="max-w-[200px] truncate font-mono text-[12px] text-muted">
              {publicUrl.replace(/^https?:\/\//, "")}
            </span>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg p-1.5 text-muted transition hover:bg-surface-high hover:text-on-surface"
              title="Copiar URL"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 pl-1">
            <div className="hidden text-right sm:block">
              <div className="text-[13px] font-semibold leading-tight">{name}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Owner
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-primary ring-2 ring-surface-high">
              {name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
