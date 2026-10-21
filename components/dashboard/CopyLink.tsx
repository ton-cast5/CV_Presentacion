"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CopyLink({ url }: { url: string }) {
  const [ok, setOk] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="max-w-full truncate rounded bg-white px-2.5 py-1.5 font-mono text-[12px] text-primary shadow-sm">
        {url}
      </code>
      <Button type="button" variant="secondary" icon={ok ? "check" : "content_copy"} onClick={copy}>
        {ok ? "Copiado" : "Copiar"}
      </Button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 items-center gap-1 rounded px-3 text-[13px] font-semibold text-muted transition hover:bg-white hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        Ver
      </a>
    </div>
  );
}
