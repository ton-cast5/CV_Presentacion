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

export function DashboardTopBar({
  name,
  publicUrl,
  onMenu,
}: Props) {
  const [copied, setCopied] = useState(false);
  const first = name.split(" ")[0] || "Usuario";

  async function copy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <header className="sticky top-0 z-30 mb-6 flex items-start justify-between gap-4 bg-background/80 pb-2 pt-1 backdrop-blur-md md:pt-0">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-outline bg-white text-muted shadow-sm md:hidden"
          aria-label="Menú"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[26px] font-semibold leading-tight tracking-tight text-on-surface sm:text-[28px]">
            Hola, {first}
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            Gestiona tu expediente CV y documentos desde un solo panel.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={copy}
          title={publicUrl}
          className="hidden h-11 items-center gap-2 rounded-full border border-outline bg-white px-4 text-[12px] font-medium text-muted shadow-sm transition hover:bg-surface-2 hover:text-on-surface sm:inline-flex"
        >
          <span className="material-symbols-outlined text-[18px]">link</span>
          {copied ? "Copiado" : "Copiar link público"}
        </button>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-[12px] font-bold text-primary ring-1 ring-outline"
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
