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
      <code className="max-w-full truncate rounded-md bg-mist px-3 py-2 text-sm text-navy">
        {url}
      </code>
      <Button type="button" variant="secondary" onClick={copy}>
        {ok ? "Copiado" : "Copiar link"}
      </Button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-navy hover:bg-mist"
      >
        Abrir
      </a>
    </div>
  );
}
