"use client";

import { useState } from "react";

type Props = {
  name: string;
  roles: string[];
  publicUrl: string;
  onMenu: () => void;
  title?: string;
  subtitle?: string;
};

export function DashboardTopBar({ name, publicUrl, onMenu }: Props) {
  const [copied, setCopied] = useState(false);
  const first = name.split(" ")[0] || "Usuario";

  async function copy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <header className="sticky top-0 z-30 mb-4 flex items-center justify-between gap-3 bg-background/80 pb-1.5 pt-0.5 backdrop-blur-md sm:mb-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onMenu}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline bg-white text-on-surface shadow-sm transition hover:bg-surface-2 md:hidden"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-tight text-on-surface sm:text-sm">
            Hola, {first}
          </p>
          <p className="truncate text-[11px] text-muted">Tu espacio FolioCraft</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={copy}
          title={publicUrl}
          className="relative hidden h-9 items-center gap-1.5 overflow-hidden rounded-full border border-outline bg-white px-3 text-[11px] font-medium text-muted shadow-sm transition hover:bg-surface-2 hover:text-on-surface sm:inline-flex"
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          <span>{copied ? "Copiado" : "Copiar link"}</span>
        </button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary ring-1 ring-outline"
          title={name}
        >
          {name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
